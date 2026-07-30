import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { generateTokens, setTokenCookies, generateResetToken } from '../middleware/auth.js';
import { cache } from '../config/redis.js';
import { ApiResponse, AppError } from '../utils/apiResponse.js';
import { validateRegister, validateLogin, validateChangePassword, validateForgotPassword, validateResetPassword } from '../validators/authValidator.js';
import { logger } from '../utils/logger.js';
import { createAuditLog, auditAction, auditResource } from '../utils/audit.js';

/**
 * Register a new user account
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const register = async (req, res, next) => {
  try {
    const data = validateRegister.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return ApiResponse.badRequest(res, 'Email already registered');

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword },
      select: { id: true, email: true, name: true, phone: true, role: true },
    });

    const tokenVersion = Date.now();
    const { accessToken, refreshToken } = generateTokens(user.id, tokenVersion);
    setTokenCookies(res, accessToken, refreshToken);
    return ApiResponse.created(res, { user, tokenVersion }, 'Registration successful');
  } catch (err) {
    if (err.name === 'ZodError') return ApiResponse.badRequest(res, 'Validation failed', err.errors);
    next(err);
  }
};

/**
 * Authenticate user with email and password
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const login = async (req, res, next) => {
  try {
    const data = validateLogin.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return ApiResponse.unauthorized(res, 'Invalid credentials');
    if (user.isBlocked) return ApiResponse.forbidden(res, 'Account is blocked');

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) return ApiResponse.unauthorized(res, 'Invalid credentials');

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const tokenVersion = Date.now();
    const { accessToken, refreshToken } = generateTokens(user.id, tokenVersion);
    setTokenCookies(res, accessToken, refreshToken);

    createAuditLog({ userId: user.id, action: auditAction.LOGIN, resourceType: auditResource.USER, resourceId: user.id, ip: req.ip, userAgent: req.get('user-agent') });

    const { password, ...userData } = user;
    return ApiResponse.success(res, { user: userData }, 'Login successful');
  } catch (err) {
    if (err.name === 'ZodError') return ApiResponse.badRequest(res, 'Validation failed', err.errors);
    next(err);
  }
};

/**
 * Refresh access token using refresh token cookie
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) return ApiResponse.unauthorized(res, 'Refresh token required');

    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return ApiResponse.unauthorized(res, 'User not found');

    const tokenVersion = decoded.version || 0;
    const storedVersion = await cache.get(`token:ver:${user.id}`);
    if (storedVersion && tokenVersion < storedVersion) {
      return ApiResponse.unauthorized(res, 'Token has been revoked');
    }

    const newVersion = Date.now();
    const tokens = generateTokens(user.id, newVersion);
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
    return ApiResponse.success(res, { tokenVersion: newVersion }, 'Token refreshed');
  } catch (err) {
    return ApiResponse.unauthorized(res, 'Invalid refresh token');
  }
};

/**
 * Log out the current user and revoke tokens
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
export const logout = async (req, res) => {
  if (req.user) {
    await cache.set(`token:ver:${req.user.id}`, Date.now(), 86400 * 7);
    createAuditLog({ userId: req.user.id, action: auditAction.LOGOUT, resourceType: auditResource.USER, resourceId: req.user.id, ip: req.ip, userAgent: req.get('user-agent') });
  }
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return ApiResponse.success(res, null, 'Logged out');
};

/**
 * Change password for the authenticated user
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const changePassword = async (req, res, next) => {
  try {
    const data = validateChangePassword.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const valid = await bcrypt.compare(data.currentPassword, user.password);
    if (!valid) return ApiResponse.unauthorized(res, 'Current password is incorrect');

    const hashed = await bcrypt.hash(data.newPassword, 12);
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });
    await cache.set(`token:ver:${req.user.id}`, Date.now(), 86400 * 7);
    return ApiResponse.success(res, null, 'Password changed successfully. Please login again.');
  } catch (err) {
    if (err.name === 'ZodError') return ApiResponse.badRequest(res, 'Validation failed', err.errors);
    next(err);
  }
};

/**
 * Send a password reset link to the user's email
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = validateForgotPassword.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return ApiResponse.success(res, null, 'If the email exists, a reset link has been sent');

    const existing = await prisma.passwordResetToken.findFirst({ where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } } });
    if (existing) return ApiResponse.success(res, null, 'If the email exists, a reset link has been sent');

    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    const resetUrl = `${process.env.API_URL || 'http://localhost:5000'}/api/auth/reset-password?token=${token}`;
    logger.info(`Password reset link for ${email}: ${resetUrl}`);

    return ApiResponse.success(res, null, 'If the email exists, a reset link has been sent');
  } catch (err) {
    if (err.name === 'ZodError') return ApiResponse.badRequest(res, 'Validation failed', err.errors);
    next(err);
  }
};

/**
 * Reset password using a valid reset token
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = validateResetPassword.parse(req.body);
    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!resetToken) return ApiResponse.badRequest(res, 'Invalid or expired reset token');
    if (resetToken.usedAt) return ApiResponse.badRequest(res, 'Reset token has already been used');
    if (new Date() > resetToken.expiresAt) return ApiResponse.badRequest(res, 'Reset token has expired');

    const hashed = await bcrypt.hash(password, 12);
    await prisma.$transaction([
      prisma.user.update({ where: { id: resetToken.userId }, data: { password: hashed } }),
      prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
    ]);

    await cache.set(`token:ver:${resetToken.userId}`, Date.now(), 86400 * 7);
    return ApiResponse.success(res, null, 'Password has been reset successfully. Please login with your new password.');
  } catch (err) {
    if (err.name === 'ZodError') return ApiResponse.badRequest(res, 'Validation failed', err.errors);
    next(err);
  }
};

/**
 * Simple phone login (demo mode - no bot needed)
 */
export const phoneLogin = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return ApiResponse.badRequest(res, 'Phone number required');
  const cleaned = phone.replace(/\D/g, '');
  const tokenVersion = Date.now();
  const { accessToken, refreshToken } = generateTokens(cleaned, tokenVersion);
  setTokenCookies(res, accessToken, refreshToken);
  const userId = Math.abs([...cleaned].reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)) % 99999 || 1;
  const user = { id: userId, phone: cleaned ? +998 : phone, role: 'CUSTOMER', name: 'User' };
  return ApiResponse.success(res, { user, tokenVersion }, 'Login successful');
};

/**
 * Google OAuth login
 */
export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) return ApiResponse.badRequest(res, 'Google credential required');

    let email, name, googleId;

    try {
      const jwt = await import('jsonwebtoken');
      const decoded = jwt.default.decode(credential);
      if (decoded && decoded.email) {
        email = decoded.email;
        name = decoded.name || decoded.email.split('@')[0];
        googleId = decoded.sub;
      }
    } catch (_) {}

    if (!email) {
      email = `google_${Date.now()}@temp.com`;
      name = 'Google User';
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: { email, name, password: '', role: 'CUSTOMER', phone: '' },
        select: { id: true, email: true, name: true, phone: true, role: true },
      });
    }

    const tokenVersion = Date.now();
    const tokens = generateTokens(user.id, tokenVersion);
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    return ApiResponse.success(res, { user, tokenVersion }, 'Google login successful');
  } catch (err) {
    next(err);
  }
};

