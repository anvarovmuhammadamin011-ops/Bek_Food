import prisma from '../config/database.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { paginate } from '../utils/helpers.js';

export const getAll = async (req, res, next) => {
  try {
    const { search, category, page, limit, available } = req.query;
    const { skip, take, page: p, limit: l } = paginate(page, limit);
    const where = { deletedAt: null };
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }];
    if (category) where.categoryId = category;
    if (available !== undefined) where.isAvailable = available === 'true';

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, include: { category: true }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }], skip, take }),
      prisma.product.count({ where }),
    ]);
    return ApiResponse.paginated(res, products, total, p, l);
  } catch (err) { next(err); }
};

export const getById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true, reviews: { include: { user: { select: { id: true, name: true, avatar: true } } } } },
    });
    if (!product) return ApiResponse.notFound(res, 'Product not found');
    return ApiResponse.success(res, product);
  } catch (err) { next(err); }
};

export const getByCategory = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { categoryId: req.params.categoryId, isAvailable: true, deletedAt: null },
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
    });
    return ApiResponse.success(res, products);
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const { name, description, price, discountPrice, image, images, calories, ingredients, spiceLevel, prepTime, categoryId, isPopular, isRecommended } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price, discountPrice, image, images: images || [], calories, ingredients: ingredients || [], spiceLevel: spiceLevel || 0, prepTime, categoryId, isPopular: !!isPopular, isRecommended: !!isRecommended },
    });
    return ApiResponse.created(res, product);
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    });
    return ApiResponse.success(res, product);
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    await prisma.product.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } });
    return ApiResponse.success(res, null, 'Product deleted');
  } catch (err) { next(err); }
};

export const toggleAvailability = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    const updated = await prisma.product.update({ where: { id: req.params.id }, data: { isAvailable: !product.isAvailable } });
    return ApiResponse.success(res, updated);
  } catch (err) { next(err); }
};

export const togglePopular = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    const updated = await prisma.product.update({ where: { id: req.params.id }, data: { isPopular: !product.isPopular } });
    return ApiResponse.success(res, updated);
  } catch (err) { next(err); }
};

export const toggleRecommended = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    const updated = await prisma.product.update({ where: { id: req.params.id }, data: { isRecommended: !product.isRecommended } });
    return ApiResponse.success(res, updated);
  } catch (err) { next(err); }
};
