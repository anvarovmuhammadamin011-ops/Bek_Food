import prisma from '../config/database.js';
import { ApiResponse, NotFoundError } from '../utils/apiResponse.js';
import { paginate } from '../utils/helpers.js';

/**
 * Get all categories with optional admin visibility
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const getAll = async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === 'ADMIN';
    const where = isAdmin ? {} : { isVisible: true, deletedAt: null };
    const categories = await prisma.category.findMany({
      where,
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: 'asc' },
    });
    return ApiResponse.success(res, categories);
  } catch (err) { next(err); }
};

/**
 * Get a single category by ID
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const getById = async (req, res, next) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { products: true } } },
    });
    if (!category) return ApiResponse.notFound(res, 'Category not found');
    return ApiResponse.success(res, category);
  } catch (err) { next(err); }
};

/**
 * Create a new category
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const create = async (req, res, next) => {
  try {
    const { name, icon, image, sortOrder, isVisible } = req.body;
    const category = await prisma.category.create({
      data: { name, icon, image, sortOrder: sortOrder || 0, isVisible: isVisible !== false },
    });
    return ApiResponse.created(res, category);
  } catch (err) { next(err); }
};

/**
 * Update an existing category
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const update = async (req, res, next) => {
  try {
    const { name, icon, image, sortOrder, isVisible } = req.body;
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: { ...(name && { name }), ...(icon !== undefined && { icon }), ...(image !== undefined && { image }), ...(sortOrder !== undefined && { sortOrder }), ...(isVisible !== undefined && { isVisible }) },
    });
    return ApiResponse.success(res, category);
  } catch (err) { next(err); }
};

/**
 * Soft-delete a category by ID
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const remove = async (req, res, next) => {
  try {
    await prisma.category.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date() },
    });
    return ApiResponse.success(res, null, 'Category deleted');
  } catch (err) { next(err); }
};

/**
 * Reorder categories by setting sortOrder on multiple items
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const reorder = async (req, res, next) => {
  try {
    const { items } = req.body; // [{ id, sortOrder }]
    await Promise.all(items.map(item =>
      prisma.category.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } })
    ));
    return ApiResponse.success(res, null, 'Categories reordered');
  } catch (err) { next(err); }
};
