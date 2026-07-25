import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { authenticate, generateTokens, setTokenCookies } from '../middleware/auth.js';
import { ApiResponse, AppError } from '../utils/apiResponse.js';
import { validateRegister, validateLogin } from '../validators/authValidator.js';

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

    const { accessToken, refreshToken } = generateTokens(user.id);
    setTokenCookies(res, accessToken, refreshToken);
    return ApiResponse.created(res, { user, accessToken, refreshToken }, 'Registration successful');
  } catch (err) {
    if (err.name === 'ZodError') return ApiResponse.badRequest(res, 'Validation failed', err.errors);
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = validateLogin.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) return ApiResponse.unauthorized(res, 'Invalid credentials');
    if (user.isBlocked) return ApiResponse.forbidden(res, 'Account is blocked');

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) return ApiResponse.unauthorized(res, 'Invalid credentials');

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const { accessToken, refreshToken } = generateTokens(user.id);
    setTokenCookies(res, accessToken, refreshToken);
    const { password, ...userData } = user;
    return ApiResponse.success(res, { user: userData, accessToken, refreshToken }, 'Login successful');
  } catch (err) {
    if (err.name === 'ZodError') return ApiResponse.badRequest(res, 'Validation failed', err.errors);
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) return ApiResponse.unauthorized(res, 'Refresh token required');

    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return ApiResponse.unauthorized(res, 'User not found');

    const tokens = generateTokens(user.id);
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
    return ApiResponse.success(res, tokens, 'Token refreshed');
  } catch (err) {
    return ApiResponse.unauthorized(res, 'Invalid refresh token');
  }
};

export const logout = async (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return ApiResponse.success(res, null, 'Logged out');
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return ApiResponse.badRequest(res, 'Current and new password required');
    if (newPassword.length < 6) return ApiResponse.badRequest(res, 'New password must be at least 6 characters');

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return ApiResponse.unauthorized(res, 'Current password is incorrect');

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });
    return ApiResponse.success(res, null, 'Password changed successfully');
  } catch (err) { next(err); }
};
