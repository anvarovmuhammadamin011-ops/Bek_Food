import { z } from 'zod';

export const validateCreateCategory = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  icon: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
  isVisible: z.boolean().optional().default(true),
});

export const validateUpdateCategory = z.object({
  name: z.string().min(1).max(100).optional(),
  icon: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  isVisible: z.boolean().optional(),
});

export const validateReorderCategories = z.object({
  items: z.array(z.object({
    id: z.string().uuid(),
    sortOrder: z.number().int(),
  })).min(1, 'At least one item required'),
});
