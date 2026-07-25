import { Router } from 'express';
import { getAll, getById, create, update, remove, validatePromo } from '../controllers/promotionController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, authorize('ADMIN'), getAll);
router.get('/:id', authenticate, authorize('ADMIN'), getById);
router.post('/', authenticate, authorize('ADMIN'), create);
router.put('/:id', authenticate, authorize('ADMIN'), update);
router.delete('/:id', authenticate, authorize('ADMIN'), remove);
router.post('/validate', authenticate, validatePromo);

export default router;
