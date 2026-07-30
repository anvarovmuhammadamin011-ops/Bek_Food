import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { logger } from './utils/logger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { initSocket } from './socket/index.js';
import prisma from './config/database.js';
import env from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { initJobs } from './jobs/index.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import branchRoutes from './routes/branchRoutes.js';

const app = express();
const server = createServer(app);

initSocket(server);

const allowedOrigins = (env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(s => s.trim());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) return callback(null, true);
    if (env.NODE_ENV !== 'production') return callback(null, true);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Idempotency-Key'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginOpenerPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api/')) {
      logger.debug(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    }
  });
  next();
});

app.use('/api/', apiLimiter);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
  });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'BEK FOOD API Docs',
  customCss: '.swagger-ui .topbar { display: none }',
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/branches', branchRoutes);

app.get('/api', (req, res) => {
  res.json({
    name: 'BEK FOOD API',
    version: '1.0.0',
    environment: env.NODE_ENV,
    docs: '/api/docs',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      categories: '/api/categories',
      cart: '/api/cart',
      orders: '/api/orders',
      drivers: '/api/drivers',
      promotions: '/api/promotions',
      analytics: '/api/analytics',
      notifications: '/api/notifications',
      upload: '/api/upload',
      branches: '/api/branches',
    },
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = env.PORT || 5000;

async function start() {
  try {
    await prisma.$connect();
    logger.info('Database connected');
    await initJobs();
  } catch (err) {
    logger.warn('Database not available, running without DB:', err.message);
  }

  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
    logger.info(`API docs: http://localhost:${PORT}/api/docs`);
  });
}

process.on('SIGINT', () => {
  logger.info('Shutting down...');
  server.close(() => process.exit(0));
});

process.on('SIGTERM', () => {
  logger.info('Shutting down...');
  server.close(() => process.exit(0));
});

start();

export { app, server };
