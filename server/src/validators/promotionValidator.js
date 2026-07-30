import { z } from 'zod';

export const validateCreatePromotion = z.object({
  code: z.string().min(1, 'Code is required').max(50)
    .transform(s => s.toUpperCase()),
  description: z.string().optional().nullable(),
  discount: z.number().int().positive('Discount must be positive'),
  promoType: z.enum(['PERCENT', 'FIXED', 'CATEGORY']).optional().default('PERCENT'),
  minOrder: z.number().int().nonnegative().optional().default(0),
  maxDiscount: z.number().int().positive().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  startDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  endDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
});

export const validateUpdatePromotion = z.object({
  description: z.string().optional().nullable(),
  discount: z.number().int().positive().optional(),
  promoType: z.enum(['PERCENT', 'FIXED', 'CATEGORY']).optional(),
  minOrder: z.number().int().nonnegative().optional(),
  maxDiscount: z.number().int().positive().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
  isActive: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const validatePromoCode = z.object({
  code: z.string().min(1, 'Promo code is required').transform(s => s.toUpperCase()),
  subtotal: z.number().int().nonnegative('Subtotal must be non-negative'),
});
