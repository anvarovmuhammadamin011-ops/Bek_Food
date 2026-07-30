import { describe, it, expect } from '@jest/globals';
import { AppError, ValidationError, NotFoundError, UnauthorizedError, ForbiddenError, ConflictError } from '../utils/apiResponse.js';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create an operational error', () => {
      const err = new AppError('Test error', 400);
      expect(err.message).toBe('Test error');
      expect(err.statusCode).toBe(400);
      expect(err.isOperational).toBe(true);
    });
  });

  describe('ValidationError', () => {
    it('should create validation error with 400 status', () => {
      const err = new ValidationError('Invalid input', [{ field: 'email', message: 'Invalid email' }]);
      expect(err.statusCode).toBe(400);
      expect(err.errors).toHaveLength(1);
    });
  });

  describe('NotFoundError', () => {
    it('should create 404 error', () => {
      const err = new NotFoundError('Product');
      expect(err.statusCode).toBe(404);
      expect(err.message).toBe('Product not found');
    });
  });

  describe('UnauthorizedError', () => {
    it('should create 401 error', () => {
      const err = new UnauthorizedError();
      expect(err.statusCode).toBe(401);
    });
  });

  describe('ForbiddenError', () => {
    it('should create 403 error', () => {
      const err = new ForbiddenError();
      expect(err.statusCode).toBe(403);
    });
  });

  describe('ConflictError', () => {
    it('should create 409 error', () => {
      const err = new ConflictError('Email already exists');
      expect(err.statusCode).toBe(409);
    });
  });
});
