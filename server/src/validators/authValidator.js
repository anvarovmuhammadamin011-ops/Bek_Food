import { z } from 'zod';

export const validateRegister = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
});

export const validateLogin = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const validateRefreshToken = z.object({
  refreshToken: z.string().min(1, 'Refresh token required'),
});
