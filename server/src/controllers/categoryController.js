import prisma from '../config/database.js';
import { ApiResponse, NotFoundError } from '../utils/apiResponse.js';
import { paginate } from '../utils/helpers.js';

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

export const create = async (req, res, next) => {
  try {
    const { name, icon, image, sortOrder, isVisible } = req.body;
    const category = await prisma.category.create({
      data: { name, icon, image, sortOrder: sortOrder || 0, isVisible: isVisible !== false },
    });
    return ApiResponse.created(res, category);
  } catch (err) { next(err); }
};

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

export const remove = async (req, res, next) => {
  try {
    await prisma.category.update({
      where: { id: req.params.id },
      data: { deletedAt: new Date() },
    });
    return ApiResponse.success(res, null, 'Category deleted');
  } catch (err) { next(err); }
};

export const reorder = async (req, res, next) => {
  try {
    const { items } = req.body; // [{ id, sortOrder }]
    await Promise.all(items.map(item =>
      prisma.category.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } })
    ));
    return ApiResponse.success(res, null, 'Categories reordered');
  } catch (err) { next(err); }
};
