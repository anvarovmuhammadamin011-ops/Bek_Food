import { z } from 'zod';

export const validateUpdateProfile = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().optional().nullable(),
  avatar: z.string().url('Invalid avatar URL').optional().nullable(),
});

export const validateAddAddress = z.object({
  label: z.string().min(1, 'Label is required').max(50),
  fullAddress: z.string().min(1, 'Address is required'),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  apartment: z.string().optional().nullable(),
  entrance: z.string().optional().nullable(),
  floor: z.string().optional().nullable(),
  doorNumber: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  isDefault: z.boolean().optional().default(false),
});

export const validateUpdateAddress = z.object({
  label: z.string().min(1).max(50).optional(),
  fullAddress: z.string().min(1).optional(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  apartment: z.string().optional().nullable(),
  entrance: z.string().optional().nullable(),
  floor: z.string().optional().nullable(),
  doorNumber: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  isDefault: z.boolean().optional(),
});
