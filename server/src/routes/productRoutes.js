import { Router } from 'express';
import { getAll, getById, getByCategory, create, update, remove, toggleAvailability, togglePopular, toggleRecommended } from '../controllers/productController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.get('/category/:categoryId', getByCategory);
router.post('/', authenticate, authorize('ADMIN'), create);
router.put('/:id', authenticate, authorize('ADMIN'), update);
router.delete('/:id', authenticate, authorize('ADMIN'), remove);
router.put('/:id/availability', authenticate, authorize('ADMIN'), toggleAvailability);
router.put('/:id/popular', authenticate, authorize('ADMIN'), togglePopular);
router.put('/:id/recommended', authenticate, authorize('ADMIN'), toggleRecommended);

export default router;
