import { Router } from 'express';
import { getCart, addItem, updateQuantity, removeItem, clearCart } from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.get('/', getCart);
router.post('/items', addItem);
router.put('/items/:productId', updateQuantity);
router.delete('/items/:productId', removeItem);
router.delete('/clear', clearCart);

export default router;
