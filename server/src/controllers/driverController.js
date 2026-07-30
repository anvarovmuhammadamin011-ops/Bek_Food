import prisma from '../config/database.js';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * Register the authenticated user as a driver
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const register = async (req, res, next) => {
  try {
    const { vehicleType, vehiclePlate } = req.body;
    const existing = await prisma.driver.findUnique({ where: { userId: req.user.id } });
    if (existing) return ApiResponse.badRequest(res, 'Already registered as driver');

    await prisma.user.update({ where: { id: req.user.id }, data: { role: 'DRIVER' } });
    const driver = await prisma.driver.create({
      data: { userId: req.user.id, vehicleType, vehiclePlate },
    });
    return ApiResponse.created(res, driver, 'Driver registered');
  } catch (err) { next(err); }
};

/**
 * Update the driver's current status
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const driver = await prisma.driver.findUnique({ where: { userId: req.user.id } });
    if (!driver) return ApiResponse.notFound(res, 'Driver profile not found');

    const updated = await prisma.driver.update({ where: { id: driver.id }, data: { status } });
    return ApiResponse.success(res, updated);
  } catch (err) { next(err); }
};

/**
 * Update the driver's current location
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const updateLocation = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;
    const driver = await prisma.driver.findUnique({ where: { userId: req.user.id } });
    if (!driver) return ApiResponse.notFound(res, 'Driver profile not found');

    await prisma.driverLocation.create({ data: { driverId: driver.id, latitude, longitude } });
    const updated = await prisma.driver.update({ where: { id: driver.id }, data: { currentLat: latitude, currentLng: longitude } });
    return ApiResponse.success(res, updated);
  } catch (err) { next(err); }
};

/**
 * Get the driver's current active deliveries
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const getMyDeliveries = async (req, res, next) => {
  try {
    const driver = await prisma.driver.findUnique({ where: { userId: req.user.id } });
    if (!driver) return ApiResponse.notFound(res, 'Driver profile not found');

    const orders = await prisma.order.findMany({
      where: { driverId: driver.id, status: { notIn: ['COMPLETED', 'CANCELLED'] } },
      include: { items: true, address: true },
      orderBy: { createdAt: 'desc' },
    });
    return ApiResponse.success(res, orders);
  } catch (err) { next(err); }
};

/**
 * Get the driver's delivery history
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const getDeliveryHistory = async (req, res, next) => {
  try {
    const driver = await prisma.driver.findUnique({ where: { userId: req.user.id } });
    if (!driver) return ApiResponse.notFound(res, 'Driver profile not found');

    const orders = await prisma.order.findMany({
      where: { driverId: driver.id, status: { in: ['COMPLETED', 'DELIVERED', 'CANCELLED'] } },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return ApiResponse.success(res, orders);
  } catch (err) { next(err); }
};

/**
 * Get the driver's delivery statistics
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const getStats = async (req, res, next) => {
  try {
    const driver = await prisma.driver.findUnique({ where: { userId: req.user.id } });
    if (!driver) return ApiResponse.notFound(res, 'Driver profile not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayOrders, totalOrders, todayEarnings] = await Promise.all([
      prisma.order.count({ where: { driverId: driver.id, status: { in: ['DELIVERED', 'COMPLETED'] }, createdAt: { gte: today } } }),
      prisma.order.count({ where: { driverId: driver.id, status: { in: ['DELIVERED', 'COMPLETED'] } } }),
      prisma.order.aggregate({ where: { driverId: driver.id, status: { in: ['DELIVERED', 'COMPLETED'] }, createdAt: { gte: today } }, _sum: { deliveryFee: true } }),
    ]);

    return ApiResponse.success(res, {
      todayEarnings: todayEarnings._sum.deliveryFee || 0,
      todayDeliveries: todayOrders,
      totalDeliveries: totalOrders,
      rating: driver.rating,
      status: driver.status,
    });
  } catch (err) { next(err); }
};
