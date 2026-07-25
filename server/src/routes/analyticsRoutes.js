import { Router } from 'express';
import { getDashboard, getRevenue, getOrderStats, getPopularProducts } from '../controllers/analyticsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));
router.get('/dashboard', getDashboard);
router.get('/revenue', getRevenue);
router.get('/orders', getOrderStats);
router.get('/popular', getPopularProducts);

export default router;
