import { logger } from '../utils/logger.js';
import { AppError } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  logger.error(`${err.name}: ${err.message}`, { stack: err.stack, path: req.path, method: req.method });

  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0] || 'field';
      error = new AppError(`${field} already exists`, 409);
    } else if (err.code === 'P2025') {
      error = new AppError('Record not found', 404);
    } else if (err.code === 'P2003') {
      error = new AppError('Related record not found', 400);
    }
  }

  if (err.name === 'ValidationError') {
    error = new AppError(err.message, 400);
  }

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') error = new AppError('File too large. Max 10MB', 400);
    else error = new AppError(err.message, 400);
  }

  if (err.name === 'JsonWebTokenError') error = new AppError('Invalid token', 401);
  if (err.name === 'TokenExpiredError') error = new AppError('Token expired', 401);

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};
