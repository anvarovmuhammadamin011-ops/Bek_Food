import { v4 as uuidv4 } from 'uuid';

export const generateOrderNumber = () => {
  const prefix = 'ORD';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
};

export const generateUUID = () => uuidv4();

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('uz-UZ').format(amount) + ' so\'m';
};

export const calculateDeliveryFee = (subtotal) => {
  if (subtotal > 50000) return 0;
  return 10000;
};

export const calculateServiceFee = (subtotal) => {
  return Math.round(subtotal * 0.05);
};

export const calculateTax = (subtotal) => {
  return Math.round(subtotal * 0.12);
};

export const calculateDiscount = (subtotal, promotion) => {
  if (!promotion) return 0;
  if (promotion.promoType === 'PERCENT') {
    const discount = Math.round(subtotal * promotion.discount / 100);
    return promotion.maxDiscount ? Math.min(discount, promotion.maxDiscount) : discount;
  }
  return promotion.discount;
};

export const estimateDeliveryTime = (distance) => {
  if (distance <= 1) return '10-15 min';
  if (distance <= 2) return '15-20 min';
  if (distance <= 3) return '20-25 min';
  if (distance <= 5) return '25-35 min';
  return '35-45 min';
};

export const paginate = (page = 1, limit = 10) => {
  const p = Math.max(1, parseInt(page));
  const l = Math.min(100, Math.max(1, parseInt(limit)));
  return { skip: (p - 1) * l, take: l, page: p, limit: l };
};
