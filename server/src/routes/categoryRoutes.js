import { Router } from 'express';
import { getAll, getById, create, update, remove, reorder } from '../controllers/categoryController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', authenticate, authorize('ADMIN'), create);
router.put('/:id', authenticate, authorize('ADMIN'), update);
router.delete('/:id', authenticate, authorize('ADMIN'), remove);
router.put('/reorder', authenticate, authorize('ADMIN'), reorder);

export default router;
