import { z } from 'zod';

export const validateCreateOrder = z.object({
  branchId: z.string().uuid(),
  deliveryType: z.enum(['DELIVERY', 'PICKUP']),
  addressId: z.string().uuid().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(['CASH', 'UZCARD', 'HUMO', 'ONLINE']),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1),
  })).min(1, 'At least one item required'),
  promoCode: z.string().optional(),
});
