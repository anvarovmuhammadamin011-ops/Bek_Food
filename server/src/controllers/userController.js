import prisma from '../config/database.js';
import { ApiResponse } from '../utils/apiResponse.js';

/**
 * Get the authenticated user's profile
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, phone: true, role: true, avatar: true, createdAt: true },
    });
    return ApiResponse.success(res, user);
  } catch (err) { next(err); }
};

/**
 * Update the authenticated user's profile
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { ...(name && { name }), ...(phone && { phone }), ...(avatar && { avatar }) },
      select: { id: true, email: true, name: true, phone: true, role: true, avatar: true },
    });
    return ApiResponse.success(res, user, 'Profile updated');
  } catch (err) { next(err); }
};

/**
 * Get all addresses for the authenticated user
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
    return ApiResponse.success(res, addresses);
  } catch (err) { next(err); }
};

/**
 * Add a new address for the authenticated user
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const addAddress = async (req, res, next) => {
  try {
    const { label, fullAddress, latitude, longitude, apartment, entrance, floor, doorNumber, notes, isDefault } = req.body;
    if (isDefault) {
      await prisma.address.updateMany({ where: { userId: req.user.id }, data: { isDefault: false } });
    }
    const address = await prisma.address.create({
      data: { userId: req.user.id, label, fullAddress, latitude, longitude, apartment, entrance, floor, doorNumber, notes, isDefault: !!isDefault },
    });
    return ApiResponse.created(res, address);
  } catch (err) { next(err); }
};

/**
 * Update an existing address
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const updateAddress = async (req, res, next) => {
  try {
    const { label, fullAddress, latitude, longitude, apartment, entrance, floor, doorNumber, notes, isDefault } = req.body;
    if (isDefault) {
      await prisma.address.updateMany({ where: { userId: req.user.id }, data: { isDefault: false } });
    }
    const address = await prisma.address.update({
      where: { id: req.params.id },
      data: { label, fullAddress, latitude, longitude, apartment, entrance, floor, doorNumber, notes, isDefault: !!isDefault },
    });
    return ApiResponse.success(res, address);
  } catch (err) { next(err); }
};

/**
 * Delete an address by ID
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const deleteAddress = async (req, res, next) => {
  try {
    await prisma.address.delete({ where: { id: req.params.id } });
    return ApiResponse.success(res, null, 'Address deleted');
  } catch (err) { next(err); }
};

/**
 * Set an address as the default for the authenticated user
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const setDefaultAddress = async (req, res, next) => {
  try {
    await prisma.address.updateMany({ where: { userId: req.user.id }, data: { isDefault: false } });
    await prisma.address.update({ where: { id: req.params.id }, data: { isDefault: true } });
    return ApiResponse.success(res, null, 'Default address set');
  } catch (err) { next(err); }
};
