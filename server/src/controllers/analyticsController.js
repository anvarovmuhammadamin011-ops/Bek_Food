import prisma from '../config/database.js';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * Get dashboard summary metrics (revenue, orders, customers)
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const getDashboard = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(); monthAgo.setMonth(monthAgo.getMonth() - 1);

    const [todayRevenue, weekRevenue, monthRevenue, totalOrders, totalCustomers, activeOrders, completedToday] = await Promise.all([
      prisma.order.aggregate({ where: { status: { in: ['DELIVERED', 'COMPLETED'] }, createdAt: { gte: today } }, _sum: { total: true } }),
      prisma.order.aggregate({ where: { status: { in: ['DELIVERED', 'COMPLETED'] }, createdAt: { gte: weekAgo } }, _sum: { total: true } }),
      prisma.order.aggregate({ where: { status: { in: ['DELIVERED', 'COMPLETED'] }, createdAt: { gte: monthAgo } }, _sum: { total: true } }),
      prisma.order.count(),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.order.count({ where: { status: { in: ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'DRIVER_ASSIGNED', 'PICKED_UP', 'DELIVERING'] } } }),
      prisma.order.count({ where: { status: { in: ['DELIVERED', 'COMPLETED'] }, createdAt: { gte: today } } }),
    ]);

    return ApiResponse.success(res, {
      todayRevenue: todayRevenue._sum.total || 0,
      weekRevenue: weekRevenue._sum.total || 0,
      monthRevenue: monthRevenue._sum.total || 0,
      totalOrders, totalCustomers, activeOrders, completedToday,
    });
  } catch (err) { next(err); }
};

/**
 * Get revenue data grouped by day for a given period
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const getRevenue = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const since = new Date(); since.setDate(since.getDate() - parseInt(days));
    const orders = await prisma.order.findMany({
      where: { status: { in: ['DELIVERED', 'COMPLETED'] }, createdAt: { gte: since } },
      select: { total: true, createdAt: true },
    });

    const grouped = {};
    orders.forEach(o => {
      const date = o.createdAt.toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + o.total;
    });

    const data = Object.entries(grouped).map(([date, revenue]) => ({ date, revenue })).sort((a, b) => a.date.localeCompare(b.date));
    return ApiResponse.success(res, data);
  } catch (err) { next(err); }
};

/**
 * Get order counts grouped by status
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const getOrderStats = async (req, res, next) => {
  try {
    const statuses = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'DELIVERING', 'DELIVERED', 'COMPLETED', 'CANCELLED'];
    const counts = await Promise.all(statuses.map(status =>
      prisma.order.count({ where: { status } })
    ));
    const data = statuses.map((status, i) => ({ status, count: counts[i] }));
    return ApiResponse.success(res, data);
  } catch (err) { next(err); }
};

/**
 * Get the top 10 most ordered products
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const getPopularProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { deletedAt: null },
      include: { _count: { select: { orderItems: true } } },
      orderBy: { orderItems: { _count: 'desc' } },
      take: 10,
    });
    return ApiResponse.success(res, products);
  } catch (err) { next(err); }
};
