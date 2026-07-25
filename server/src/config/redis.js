import Redis from 'ioredis';
import { logger } from '../utils/logger.js';

let redis;

try {
  redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  redis.on('connect', () => logger.info('Redis connected'));
  redis.on('error', (err) => logger.warn('Redis error:', err.message));
} catch (err) {
  logger.warn('Redis not available, running without cache');
  redis = null;
}

export const cache = {
  async get(key) {
    if (!redis) return null;
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  },
  async set(key, value, ttl = 300) {
    if (!redis) return;
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
    } catch {}
  },
  async del(key) {
    if (!redis) return;
    try {
      await redis.del(key);
    } catch {}
  },
  async flush(pattern) {
    if (!redis) return;
    try {
      const keys = await redis.keys(pattern || '*');
      if (keys.length) await redis.del(...keys);
    } catch {}
  },
};

export default redis;
