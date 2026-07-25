import prisma from '../config/database.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { paginate, generateOrderNumber, calculateDeliveryFee, calculateServiceFee, calculateTax, calculateDiscount } from '../utils/helpers.js';
import { validateCreateOrder } from '../validators/orderValidator.js';

export const createOrder = async (req, res, next) => {
  try {
    const data = validateCreateOrder.parse(req.body);
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });
    if (!cart || cart.items.length === 0) return ApiResponse.badRequest(res, 'Cart is empty');

    let subtotal = 0;
    const orderItems = cart.items.map(item => {
      const price = item.product.discountPrice || item.product.price;
      subtotal += price * item.quantity;
      return { productId: item.productId, name: item.product.name, price, quantity: item.quantity, notes: item.notes };
    });

    let promotion = null;
    if (data.promoCode) {
      promotion = await prisma.promotion.findUnique({ where: { code: data.promoCode.toUpperCase() } });
      if (!promotion || !promotion.isActive || new Date() > promotion.endDate) promotion = null;
      if (promotion && promotion.usageLimit && promotion.usedCount >= promotion.usageLimit) promotion = null;
      if (promotion && promotion.minOrder && subtotal < promotion.minOrder) promotion = null;
    }

    const deliveryFee = data.deliveryType === 'PICKUP' ? 0 : calculateDeliveryFee(subtotal);
    const serviceFee = calculateServiceFee(subtotal);
    const tax = calculateTax(subtotal);
    const discount = promotion ? calculateDiscount(subtotal, promotion) : 0;
    const total = subtotal + deliveryFee + serviceFee - tax - discount;

    const address = data.addressId ? await prisma.address.findUnique({ where: { id: data.addressId } }) : null;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: req.user.id,
        deliveryType: data.deliveryType,
        deliveryAddress: address?.fullAddress,
        deliveryLat: address?.latitude,
        deliveryLng: address?.longitude,
        addressId: data.addressId,
        notes: data.notes,
        paymentMethod: data.paymentMethod,
        subtotal, deliveryFee, serviceFee, tax, discount, total,
        estimatedDelivery: data.deliveryType === 'DELIVERY' ? '25-35 min' : '15-20 min',
        items: { create: orderItems },
        timeline: { create: { status: 'PENDING' } },
        payment: { create: { method: data.paymentMethod, amount: total, status: data.paymentMethod === 'CASH' ? 'PENDING' : 'PENDING' } },
      },
      include: { items: true, payment: true },
    });

    if (promotion) {
      await prisma.promotion.update({ where: { id: promotion.id }, data: { usedCount: { increment: 1 } } });
      await prisma.promoUsage.create({ data: { promotionId: promotion.id, userId: req.user.id, orderId: order.id } });
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return ApiResponse.created(res, order, 'Order placed successfully');
  } catch (err) {
    if (err.name === 'ZodError') return ApiResponse.badRequest(res, 'Validation failed', err.errors);
    next(err);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const { skip, take, page: p, limit: l } = paginate(page, limit);
    const where = { userId: req.user.id, ...(status && { status }) };
    const [orders, total] = await Promise.all([
      prisma.order.findMany({ where, include: { items: true, driver: { include: { user: { select: { name: true, phone: true, avatar: true } } } } }, orderBy: { createdAt: 'desc' }, skip, take }),
      prisma.order.count({ where }),
    ]);
    return ApiResponse.paginated(res, orders, total, p, l);
  } catch (err) { next(err); }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true, payment: true, timeline: true, driver: { include: { user: { select: { name: true, phone: true, avatar: true } } } }, address: true },
    });
    if (!order) return ApiResponse.notFound(res, 'Order not found');
    if (req.user.role === 'CUSTOMER' && order.userId !== req.user.id) return ApiResponse.forbidden(res, 'Access denied');
    return ApiResponse.success(res, order);
  } catch (err) { next(err); }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { page, limit, status, search } = req.query;
    const { skip, take, page: p, limit: l } = paginate(page, limit);
    const where = {};
    if (status) where.status = status;
    if (search) where.OR = [{ orderNumber: { contains: search, mode: 'insensitive' } }, { user: { name: { contains: search, mode: 'insensitive' } } }];

    const [orders, total] = await Promise.all([
      prisma.order.findMany({ where, include: { items: true, user: { select: { id: true, name: true, email: true, phone: true } }, driver: { include: { user: { select: { name: true, phone: true } } } } }, orderBy: { createdAt: 'desc' }, skip, take }),
      prisma.order.count({ where }),
    ]);
    return ApiResponse.paginated(res, orders, total, p, l);
  } catch (err) { next(err); }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status, ...(status === 'CANCELLED' && { cancelledAt: new Date(), cancelReason: note }) },
    });
    await prisma.orderTimeline.create({ data: { orderId: order.id, status, note } });
    return ApiResponse.success(res, order, 'Order status updated');
  } catch (err) { next(err); }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return ApiResponse.notFound(res, 'Order not found');
    if (req.user.role === 'CUSTOMER' && order.userId !== req.user.id) return ApiResponse.forbidden(res, 'Access denied');
    if (['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(order.status)) return ApiResponse.badRequest(res, 'Cannot cancel this order');

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED', cancelledAt: new Date(), cancelReason: req.body.reason || 'Cancelled by user' },
    });
    await prisma.orderTimeline.create({ data: { orderId: order.id, status: 'CANCELLED', note: req.body.reason } });
    return ApiResponse.success(res, updated, 'Order cancelled');
  } catch (err) { next(err); }
};

export const assignDriver = async (req, res, next) => {
  try {
    const { driverId } = req.body;
    const [order, driver] = await Promise.all([
      prisma.order.findUnique({ where: { id: req.params.id } }),
      prisma.driver.findUnique({ where: { id: driverId } }),
    ]);
    if (!order) return ApiResponse.notFound(res, 'Order not found');
    if (!driver) return ApiResponse.notFound(res, 'Driver not found');

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { driverId, status: 'DRIVER_ASSIGNED' },
    });
    await prisma.orderTimeline.create({ data: { orderId: order.id, status: 'DRIVER_ASSIGNED', note: `Assigned to ${driver.user?.name || 'driver'}` } });
    return ApiResponse.success(res, updated, 'Driver assigned');
  } catch (err) { next(err); }
};
