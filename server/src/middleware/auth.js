import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
    if (!token) return ApiResponse.unauthorized(res, 'Access token required');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, email: true, name: true, role: true, isBlocked: true, isActive: true } });
    if (!user) return ApiResponse.unauthorized(res, 'User not found');
    if (user.isBlocked) return ApiResponse.forbidden(res, 'Account is blocked');
    if (!user.isActive) return ApiResponse.unauthorized(res, 'Account is inactive');

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return ApiResponse.unauthorized(res, 'Token expired');
    if (err.name === 'JsonWebTokenError') return ApiResponse.unauthorized(res, 'Invalid token');
    return ApiResponse.unauthorized(res, 'Authentication failed');
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return ApiResponse.unauthorized(res, 'Authentication required');
    if (!roles.includes(req.user.role)) return ApiResponse.forbidden(res, 'Insufficient permissions');
    next();
  };
};

export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '15m' });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });
  return { accessToken, refreshToken };
};

export const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('accessToken', accessToken, {
    httpOnly: true, secure: isProd, sameSite: 'lax', maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, secure: isProd, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
