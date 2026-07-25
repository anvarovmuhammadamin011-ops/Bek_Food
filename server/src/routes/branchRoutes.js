import { Router } from 'express';
import { getBranches, getBranch, getNearestBranch } from '../controllers/branchController.js';

const router = Router();

router.get('/', getBranches);
router.get('/nearest', getNearestBranch);
router.get('/:id', getBranch);

export default router;
