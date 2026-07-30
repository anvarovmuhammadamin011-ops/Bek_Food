import { describe, it, expect } from '@jest/globals';
import { validateRegister, validateLogin, validateChangePassword, validateForgotPassword, validateResetPassword } from '../validators/authValidator.js';
import { validateCreateProduct, validateUpdateProduct } from '../validators/productValidator.js';
import { validateCreateCategory, validateReorderCategories } from '../validators/categoryValidator.js';
import { validateAddCartItem } from '../validators/cartValidator.js';
import { validateRegisterDriver, validateDriverLocation } from '../validators/driverValidator.js';
import { validateCreateBranch, validateNearestBranch } from '../validators/branchValidator.js';
import { validateCreatePromotion, validatePromoCode } from '../validators/promotionValidator.js';
import { validateCreateOrder } from '../validators/orderValidator.js';
import { validateAddAddress, validateUpdateProfile } from '../validators/userValidator.js';

describe('Auth Validators', () => {
  describe('validateRegister', () => {
    it('should accept valid registration data', () => {
      const data = { email: 'test@example.com', password: 'StrongP1ss', name: 'Test User' };
      const result = validateRegister.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject weak passwords', () => {
      const data = { email: 'test@example.com', password: 'weak', name: 'Test User' };
      const result = validateRegister.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const data = { email: 'notanemail', password: 'StrongP1ss', name: 'Test User' };
      const result = validateRegister.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('validateLogin', () => {
    it('should accept valid login data', () => {
      const data = { email: 'test@example.com', password: 'password' };
      const result = validateLogin.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('validateChangePassword', () => {
    it('should validate password strength', () => {
      const weak = validateChangePassword.safeParse({ currentPassword: 'old', newPassword: 'weak' });
      expect(weak.success).toBe(false);

      const strong = validateChangePassword.safeParse({ currentPassword: 'oldP1ss', newPassword: 'NewStrongP1ss' });
      expect(strong.success).toBe(true);
    });
  });

  describe('validateForgotPassword', () => {
    it('should accept valid email', () => {
      const result = validateForgotPassword.safeParse({ email: 'test@example.com' });
      expect(result.success).toBe(true);
    });
  });

  describe('validateResetPassword', () => {
    it('should require token and strong password', () => {
      const result = validateResetPassword.safeParse({ token: 'abc123', password: 'NewStrongP1ss' });
      expect(result.success).toBe(true);
    });
  });
});

describe('Product Validators', () => {
  describe('validateCreateProduct', () => {
    it('should accept valid product data', () => {
      const data = { name: 'Test Product', price: 15000, categoryId: '550e8400-e29b-41d4-a716-446655440000' };
      const result = validateCreateProduct.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject negative price', () => {
      const data = { name: 'Test', price: -100, categoryId: '550e8400-e29b-41d4-a716-446655440000' };
      const result = validateCreateProduct.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('validateUpdateProduct', () => {
    it('should accept partial update data', () => {
      const data = { name: 'Updated Name', price: 20000 };
      const result = validateUpdateProduct.safeParse(data);
      expect(result.success).toBe(true);
    });
  });
});

describe('Category Validators', () => {
  describe('validateCreateCategory', () => {
    it('should accept valid category data', () => {
      const result = validateCreateCategory.safeParse({ name: 'Shashlik' });
      expect(result.success).toBe(true);
    });
  });

  describe('validateReorderCategories', () => {
    it('should accept valid reorder data', () => {
      const result = validateReorderCategories.safeParse({
        items: [{ id: '550e8400-e29b-41d4-a716-446655440000', sortOrder: 1 }]
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('Cart Validators', () => {
  describe('validateAddCartItem', () => {
    it('should accept valid cart item', () => {
      const result = validateAddCartItem.safeParse({
        productId: '550e8400-e29b-41d4-a716-446655440000',
        quantity: 2,
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('Driver Validators', () => {
  describe('validateRegisterDriver', () => {
    it('should accept valid driver data', () => {
      const result = validateRegisterDriver.safeParse({ vehicleType: 'Motorcycle', vehiclePlate: '01A123AA' });
      expect(result.success).toBe(true);
    });
  });

  describe('validateDriverLocation', () => {
    it('should accept valid coordinates', () => {
      const result = validateDriverLocation.safeParse({ latitude: 41.3, longitude: 69.2 });
      expect(result.success).toBe(true);
    });

    it('should reject invalid latitude', () => {
      const result = validateDriverLocation.safeParse({ latitude: 100, longitude: 69.2 });
      expect(result.success).toBe(false);
    });
  });
});

describe('Branch Validators', () => {
  describe('validateCreateBranch', () => {
    it('should accept valid branch data', () => {
      const result = validateCreateBranch.safeParse({
        name: 'Main Branch', address: '123 Main St', latitude: 41.3, longitude: 69.2,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('validateNearestBranch', () => {
    it('should accept valid query params', () => {
      const result = validateNearestBranch.safeParse({ lat: '41.3', lng: '69.2' });
      expect(result.success).toBe(true);
    });
  });
});

describe('Promotion Validators', () => {
  describe('validateCreatePromotion', () => {
    it('should accept valid promotion data', () => {
      const result = validateCreatePromotion.safeParse({
        code: 'WELCOME10', discount: 10, promoType: 'PERCENT',
        startDate: '2024-01-01', endDate: '2024-12-31',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('validatePromoCode', () => {
    it('should uppercase the code', () => {
      const result = validatePromoCode.safeParse({ code: 'welcome10', subtotal: 50000 });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.code).toBe('WELCOME10');
      }
    });
  });
});

describe('Order Validators', () => {
  describe('validateCreateOrder', () => {
    it('should accept valid order data', () => {
      const result = validateCreateOrder.safeParse({
        branchId: '550e8400-e29b-41d4-a716-446655440000',
        deliveryType: 'DELIVERY',
        paymentMethod: 'CASH',
        items: [{ productId: '550e8400-e29b-41d4-a716-446655440000', quantity: 2 }],
      });
      expect(result.success).toBe(true);
    });

    it('should reject order without items', () => {
      const result = validateCreateOrder.safeParse({
        branchId: '550e8400-e29b-41d4-a716-446655440000',
        deliveryType: 'DELIVERY',
        paymentMethod: 'CASH',
      });
      expect(result.success).toBe(false);
    });
  });
});

describe('User Validators', () => {
  describe('validateUpdateProfile', () => {
    it('should accept valid profile update', () => {
      const result = validateUpdateProfile.safeParse({ name: 'New Name', phone: '+998901234567' });
      expect(result.success).toBe(true);
    });
  });

  describe('validateAddAddress', () => {
    it('should accept valid address data', () => {
      const result = validateAddAddress.safeParse({ label: 'Home', fullAddress: '123 Main St' });
      expect(result.success).toBe(true);
    });
  });
});
