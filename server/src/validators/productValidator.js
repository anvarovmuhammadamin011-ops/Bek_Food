import { z } from 'zod';

export const validateCreateProduct = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().optional(),
  price: z.number().int().positive('Price must be positive'),
  discountPrice: z.number().int().optional().nullable(),
  image: z.string().optional().default(''),
  images: z.array(z.string()).optional().default([]),
  calories: z.number().int().nonnegative().optional().nullable(),
  ingredients: z.array(z.string()).optional().default([]),
  spiceLevel: z.number().int().min(0).max(3).optional().default(0),
  prepTime: z.number().int().positive().optional().nullable(),
  categoryId: z.string().uuid('Invalid category ID'),
  branchId: z.string().uuid().optional().nullable(),
  isPopular: z.boolean().optional().default(false),
  isRecommended: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
});

export const validateUpdateProduct = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional().nullable(),
  price: z.number().int().positive().optional(),
  discountPrice: z.number().int().optional().nullable(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  calories: z.number().int().nonnegative().optional().nullable(),
  ingredients: z.array(z.string()).optional(),
  spiceLevel: z.number().int().min(0).max(3).optional(),
  prepTime: z.number().int().positive().optional().nullable(),
  categoryId: z.string().uuid().optional(),
  branchId: z.string().uuid().optional().nullable(),
  isAvailable: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  isRecommended: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const validateProductQuery = z.object({
  search: z.string().optional(),
  category: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  available: z.enum(['true', 'false']).optional(),
  branchId: z.string().uuid().optional(),
});
