import { z } from 'zod';

export const validateCreateBranch = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  address: z.string().min(1, 'Address is required'),
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude'),
  phone: z.string().optional().nullable(),
  workingHours: z.any().optional(),
  isActive: z.boolean().optional().default(true),
});

export const validateUpdateBranch = z.object({
  name: z.string().min(1).max(200).optional(),
  address: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  phone: z.string().optional().nullable(),
  workingHours: z.any().optional(),
  isActive: z.boolean().optional(),
});

export const validateNearestBranch = z.object({
  lat: z.coerce.number().min(-90).max(90, 'Invalid latitude'),
  lng: z.coerce.number().min(-180).max(180, 'Invalid longitude'),
});
