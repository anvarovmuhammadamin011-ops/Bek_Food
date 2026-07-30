import { describe, it, expect } from '@jest/globals';
import { generateOrderNumber, formatCurrency, calculateDeliveryFee, calculateServiceFee, calculateTax, calculateDiscount, paginate, estimateDeliveryTime } from '../utils/helpers.js';

describe('Helpers', () => {
  describe('generateOrderNumber', () => {
    it('should generate order number with ORD prefix', () => {
      const result = generateOrderNumber();
      expect(result).toMatch(/^ORD-/);
    });

    it('should generate unique order numbers', () => {
      const a = generateOrderNumber();
      const b = generateOrderNumber();
      expect(a).not.toBe(b);
    });
  });

  describe('formatCurrency', () => {
    it('should format in so\'m', () => {
      const result = formatCurrency(15000);
      expect(result).toContain('so\'m');
    });
  });

  describe('calculateDeliveryFee', () => {
    it('should return 0 for orders over 50000', () => {
      expect(calculateDeliveryFee(60000)).toBe(0);
    });

    it('should return 10000 for orders under 50000', () => {
      expect(calculateDeliveryFee(30000)).toBe(10000);
    });
  });

  describe('calculateServiceFee', () => {
    it('should be 5% of subtotal', () => {
      expect(calculateServiceFee(10000)).toBe(500);
    });
  });

  describe('calculateTax', () => {
    it('should be 12% of subtotal', () => {
      expect(calculateTax(10000)).toBe(1200);
    });
  });

  describe('calculateDiscount', () => {
    it('should return 0 if no promotion', () => {
      expect(calculateDiscount(10000, null)).toBe(0);
    });

    it('should calculate percentage discount', () => {
      const promo = { promoType: 'PERCENT', discount: 10, maxDiscount: null };
      expect(calculateDiscount(20000, promo)).toBe(2000);
    });

    it('should respect max discount', () => {
      const promo = { promoType: 'PERCENT', discount: 50, maxDiscount: 5000 };
      expect(calculateDiscount(20000, promo)).toBe(5000);
    });
  });

  describe('paginate', () => {
    it('should return valid pagination params', () => {
      const result = paginate(1, 10);
      expect(result).toEqual({ skip: 0, take: 10, page: 1, limit: 10 });
    });

    it('should cap limit at 100', () => {
      const result = paginate(1, 500);
      expect(result.limit).toBe(100);
    });

    it('should enforce minimum page of 1', () => {
      const result = paginate(-5, 10);
      expect(result.page).toBe(1);
    });
  });

  describe('estimateDeliveryTime', () => {
    it('should return shortest time for close distances', () => {
      expect(estimateDeliveryTime(0.5)).toBe('10-15 min');
    });

    it('should return longest time for far distances', () => {
      expect(estimateDeliveryTime(10)).toBe('35-45 min');
    });
  });
});
