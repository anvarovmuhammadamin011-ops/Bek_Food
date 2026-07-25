import { upload, uploadToCloudinary } from '../config/cloudinary.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return ApiResponse.badRequest(res, 'No image file provided');
    const { url, publicId } = await uploadToCloudinary(req.file, req.body.folder || 'bekfood');
    return ApiResponse.created(res, { url, publicId }, 'Image uploaded');
  } catch (err) { next(err); }
};
