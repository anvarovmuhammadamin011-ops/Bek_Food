import prisma from '../config/database.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { paginate } from '../utils/helpers.js';

/**
 * Get all notifications for the authenticated user with pagination
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const getAll = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const { skip, take, page: p, limit: l } = paginate(page, limit);
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' }, skip, take }),
      prisma.notification.count({ where: { userId: req.user.id } }),
    ]);
    return ApiResponse.paginated(res, notifications, total, p, l);
  } catch (err) { next(err); }
};

/**
 * Mark a single notification as read
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const markRead = async (req, res, next) => {
  try {
    await prisma.notification.update({ where: { id: req.params.id }, data: { isRead: true } });
    return ApiResponse.success(res, null, 'Marked as read');
  } catch (err) { next(err); }
};

/**
 * Mark all unread notifications as read for the authenticated user
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const markAllRead = async (req, res, next) => {
  try {
    await prisma.notification.updateMany({ where: { userId: req.user.id, isRead: false }, data: { isRead: true } });
    return ApiResponse.success(res, null, 'All marked as read');
  } catch (err) { next(err); }
};
