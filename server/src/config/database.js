import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

prisma.$on('error', (e) => {
  logger.error('Prisma error:', e);
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
