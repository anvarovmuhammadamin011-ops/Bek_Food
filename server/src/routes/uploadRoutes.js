import { Router } from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { upload } from '../config/cloudinary.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/image', authenticate, upload.single('image'), uploadImage);

export default router;
