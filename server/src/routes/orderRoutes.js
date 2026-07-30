import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById, getAllOrders, updateStatus, cancelOrder, assignDriver } from '../controllers/orderController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/all', authorize('ADMIN', 'ORDER_MANAGER'), getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', authorize('ADMIN', 'ORDER_MANAGER'), updateStatus);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/assign', authorize('ADMIN', 'ORDER_MANAGER'), assignDriver);

export default router;
