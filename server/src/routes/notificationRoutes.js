import { Router } from 'express';
import { getAll, markRead, markAllRead } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);
router.get('/', getAll);
router.put('/:id/read', markRead);
router.put('/read-all', markAllRead);

export default router;
