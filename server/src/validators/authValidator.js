import { z } from 'zod';

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const validateRegister = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().optional(),
});

export const validateLogin = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const validateRefreshToken = z.object({
  refreshToken: z.string().min(1, 'Refresh token required'),
});

export const validateChangePassword = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

export const validateForgotPassword = z.object({
  email: z.string().email('Invalid email address'),
});

export const validateResetPassword = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
});
