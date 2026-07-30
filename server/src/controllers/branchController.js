import prisma from '../config/database.js';
import { ApiResponse } from '../utils/apiResponse.js';

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get all active branches
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const getBranches = async (req, res, next) => {
  try {
    const branches = await prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
    return ApiResponse.success(res, branches);
  } catch (err) { next(err); }
};

/**
 * Get a single branch by ID
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const getBranch = async (req, res, next) => {
  try {
    const branch = await prisma.branch.findUnique({ where: { id: req.params.id } });
    if (!branch) return ApiResponse.notFound(res, 'Branch not found');
    return ApiResponse.success(res, branch);
  } catch (err) { next(err); }
};

/**
 * Find the nearest branch to the given coordinates
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const getNearestBranch = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return ApiResponse.badRequest(res, 'lat and lng are required');

    const branches = await prisma.branch.findMany({ where: { isActive: true } });
    if (branches.length === 0) return ApiResponse.notFound(res, 'No active branches');

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    let nearest = branches[0];
    let minDist = haversineDistance(userLat, userLng, nearest.latitude, nearest.longitude);

    for (const branch of branches) {
      const dist = haversineDistance(userLat, userLng, branch.latitude, branch.longitude);
      if (dist < minDist) {
        minDist = dist;
        nearest = branch;
      }
    }

    return ApiResponse.success(res, { ...nearest, distance: Math.round(minDist * 10) / 10 });
  } catch (err) { next(err); }
};
