import prisma from '../config/database.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { paginate } from '../utils/helpers.js';

/**
 * Get all promotions with pagination and optional active filter
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const getAll = async (req, res, next) => {
  try {
    const { page, limit, active } = req.query;
    const { skip, take, page: p, limit: l } = paginate(page, limit);
    const where = {};
    if (active !== undefined) where.isActive = active === 'true';

    const [promotions, total] = await Promise.all([
      prisma.promotion.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take }),
      prisma.promotion.count({ where }),
    ]);
    return ApiResponse.paginated(res, promotions, total, p, l);
  } catch (err) { next(err); }
};

/**
 * Get a single promotion by ID
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const getById = async (req, res, next) => {
  try {
    const promo = await prisma.promotion.findUnique({ where: { id: req.params.id } });
    if (!promo) return ApiResponse.notFound(res, 'Promotion not found');
    return ApiResponse.success(res, promo);
  } catch (err) { next(err); }
};

/**
 * Create a new promotion
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const create = async (req, res, next) => {
  try {
    const { code, description, discount, promoType, minOrder, maxDiscount, usageLimit, categoryId, isActive, startDate, endDate } = req.body;
    const promo = await prisma.promotion.create({
      data: { code: code.toUpperCase(), description, discount, promoType: promoType || 'PERCENT', minOrder: minOrder || 0, maxDiscount, usageLimit, categoryId, isActive: isActive !== false, startDate: new Date(startDate), endDate: new Date(endDate) },
    });
    return ApiResponse.created(res, promo);
  } catch (err) { next(err); }
};

/**
 * Update an existing promotion
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const update = async (req, res, next) => {
  try {
    const promo = await prisma.promotion.update({ where: { id: req.params.id }, data: req.body });
    return ApiResponse.success(res, promo);
  } catch (err) { next(err); }
};

/**
 * Delete a promotion by ID
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const remove = async (req, res, next) => {
  try {
    await prisma.promotion.delete({ where: { id: req.params.id } });
    return ApiResponse.success(res, null, 'Promotion deleted');
  } catch (err) { next(err); }
};

/**
 * Validate a promo code and calculate the discount
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const validatePromo = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    const promo = await prisma.promotion.findUnique({ where: { code: code.toUpperCase() } });
    if (!promo) return ApiResponse.notFound(res, 'Invalid promo code');
    if (!promo.isActive) return ApiResponse.badRequest(res, 'Promo code is inactive');
    if (new Date() < promo.startDate || new Date() > promo.endDate) return ApiResponse.badRequest(res, 'Promo code is expired');
    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) return ApiResponse.badRequest(res, 'Promo code usage limit reached');
    if (promo.minOrder && subtotal < promo.minOrder) return ApiResponse.badRequest(res, `Minimum order: ${promo.minOrder} so'm`);

    const discount = promo.promoType === 'PERCENT'
      ? Math.min(Math.round(subtotal * promo.discount / 100), promo.maxDiscount || Infinity)
      : promo.discount;

    return ApiResponse.success(res, { code: promo.code, discount, discountType: promo.promoType, description: promo.description });
  } catch (err) { next(err); }
};
