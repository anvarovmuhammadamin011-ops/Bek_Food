import { z } from 'zod';
import dotenv from 'dotenv';
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(format.colorize(), format.simple()),
  transports: [new transports.Console()],
});

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  API_URL: z.string().default('http://localhost:5000'),

  DATABASE_URL: z.string().optional(),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters').default('dev-secret-key-111111111111111111111111111111'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters').default('dev-refresh-secret-11111111111111111111111111'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  REDIS_URL: z.string().default('redis://localhost:6379'),

  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  SOCKET_CORS_ORIGIN: z.string().default('http://localhost:5173'),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),

  TELEGRAM_BOT_TOKEN: z.string().optional().default('8776196903:AAHDPsZOuhMGbpTZF2wJpQ4PFf_2c88ob4Q'),
  WEBAPP_URL: z.string().default('https://bek-food.vercel.app'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.warn('Some env vars are invalid, using defaults:');
  parsed.error.errors.forEach(err => {
    logger.warn(`  ${err.path.join('.')}: ${err.message}`);
  });
}

export const env = Object.assign(
  {},
  envSchema.parse(process.env),
  parsed.success ? parsed.data : envSchema.parse({})
);

export default env;
