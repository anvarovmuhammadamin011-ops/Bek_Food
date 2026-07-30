import { z } from 'zod';

export const validateAddCartItem = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().positive('Quantity must be positive').optional().default(1),
  notes: z.string().optional(),
});

export const validateCartQuantity = z.object({
  quantity: z.number().int().nonnegative('Quantity must be non-negative'),
});
