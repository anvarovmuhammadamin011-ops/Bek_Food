import { Router } from 'express';
import { register, updateStatus, updateLocation, getMyDeliveries, getDeliveryHistory, getStats } from '../controllers/driverController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.post('/register', register);
router.put('/status', authorize('DRIVER'), updateStatus);
router.put('/location', authorize('DRIVER'), updateLocation);
router.get('/deliveries', authorize('DRIVER'), getMyDeliveries);
router.get('/history', authorize('DRIVER'), getDeliveryHistory);
router.get('/stats', authorize('DRIVER'), getStats);

export default router;
