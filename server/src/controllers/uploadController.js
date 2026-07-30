import { upload, uploadToCloudinary } from '../config/cloudinary.js';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * Upload an image file to Cloudinary
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return ApiResponse.badRequest(res, 'No image file provided');
    const { url, publicId } = await uploadToCloudinary(req.file, req.body.folder || 'bekfood');
    return ApiResponse.created(res, { url, publicId }, 'Image uploaded');
  } catch (err) { next(err); }
};
