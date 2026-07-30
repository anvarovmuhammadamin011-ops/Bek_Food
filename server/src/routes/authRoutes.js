import { Router } from 'express';
import { register, login, phoneLogin, googleLogin, refreshToken, logout, changePassword, forgotPassword, resetPassword } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/phone-login', authLimiter, phoneLogin);
router.post('/google-login', authLimiter, googleLogin);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);
router.put('/change-password', authenticate, changePassword);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

export default router;
