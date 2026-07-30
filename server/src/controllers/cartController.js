import prisma from '../config/database.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { calculateDeliveryFee, calculateServiceFee, calculateTax } from '../utils/helpers.js';

/**
 * Get the authenticated user's cart with calculated totals
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const getCart = async (req, res, next) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: { include: { category: true } } } } },
    });
    if (!cart) cart = await prisma.cart.create({ data: { userId: req.user.id }, include: { items: { include: { product: { include: { category: true } } } } } });

    const subtotal = cart.items.reduce((sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity, 0);
    const deliveryFee = calculateDeliveryFee(subtotal);
    const serviceFee = calculateServiceFee(subtotal);
    const tax = calculateTax(subtotal);

    return ApiResponse.success(res, { ...cart, subtotal, deliveryFee, serviceFee, tax, total: subtotal + deliveryFee + serviceFee - tax });
  } catch (err) { next(err); }
};

/**
 * Add a product to the cart or increment its quantity
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) cart = await prisma.cart.create({ data: { userId: req.user.id } });

    const existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId } });
    if (existing) {
      await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + quantity } });
    } else {
      await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: { include: { category: true } } } } },
    });
    return ApiResponse.success(res, updatedCart, 'Item added to cart');
  } catch (err) { next(err); }
};

/**
 * Update the quantity of a cart item (removes if quantity <= 0)
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const updateQuantity = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) return ApiResponse.notFound(res, 'Cart not found');

    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId: req.params.productId } });
    } else {
      await prisma.cartItem.updateMany({ where: { cartId: cart.id, productId: req.params.productId }, data: { quantity } });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: { include: { category: true } } } } },
    });
    return ApiResponse.success(res, updatedCart);
  } catch (err) { next(err); }
};

/**
 * Remove a product from the cart
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const removeItem = async (req, res, next) => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) return ApiResponse.notFound(res, 'Cart not found');
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId: req.params.productId } });
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: { include: { category: true } } } } },
    });
    return ApiResponse.success(res, updatedCart, 'Item removed');
  } catch (err) { next(err); }
};

/**
 * Clear all items from the cart
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
export const clearCart = async (req, res, next) => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return ApiResponse.success(res, null, 'Cart cleared');
  } catch (err) { next(err); }
};
