import { z } from 'zod';

export const validateRegisterDriver = z.object({
  vehicleType: z.string().min(1, 'Vehicle type is required').max(50),
  vehiclePlate: z.string().min(1, 'Vehicle plate is required').max(20),
});

export const validateDriverStatus = z.object({
  status: z.enum(['ONLINE', 'OFFLINE', 'ON_DELIVERY'], 'Invalid driver status'),
});

export const validateDriverLocation = z.object({
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude'),
});
