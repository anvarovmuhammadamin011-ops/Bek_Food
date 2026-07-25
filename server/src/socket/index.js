import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.userRole = socket.handshake.auth.role || 'CUSTOMER';
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id} (user: ${socket.userId})`);

    // Join user-specific room
    socket.join(`user:${socket.userId}`);

    // Join role-specific room
    if (socket.userRole) {
      socket.join(`role:${socket.userRole}`);
    }

    // Driver joins driver room
    if (socket.userRole === 'DRIVER') {
      socket.join('drivers');
    }

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};

// ─── Emission helpers ───

export const emitToUser = (userId, event, data) => {
  if (io) io.to(`user:${userId}`).emit(event, data);
};

export const emitToRole = (role, event, data) => {
  if (io) io.to(`role:${role}`).emit(event, data);
};

export const emitToDrivers = (event, data) => {
  if (io) io.to('drivers').emit(event, data);
};

export const emitToAll = (event, data) => {
  if (io) io.emit(event, data);
};

// ─── Order events ───

export const emitOrderUpdate = (order, status) => {
  const data = { orderId: order.id, orderNumber: order.orderNumber, status, updatedAt: new Date() };

  // Notify customer
  emitToUser(order.userId, 'order:update', data);

  // Notify admin and order manager
  emitToRole('ADMIN', 'order:update', data);
  emitToRole('ORDER_MANAGER', 'order:update', data);

  // Notify assigned driver
  if (order.driverId) {
    emitToRole('DRIVER', 'order:update', data);
  }

  // Broadcast to all
  emitToAll('order:status', data);
};

export const emitNewOrder = (order) => {
  emitToRole('ADMIN', 'order:new', order);
  emitToRole('ORDER_MANAGER', 'order:new', order);
  emitToDrivers('order:available', order);
};

export const emitDriverLocation = (driverId, location) => {
  emitToAll('driver:location', { driverId, ...location });
};
