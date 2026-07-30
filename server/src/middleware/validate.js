import { ApiResponse } from '../utils/apiResponse.js';

export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const errors = result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return ApiResponse.badRequest(res, 'Validation failed', errors);
    }
    req[source] = result.data;
    next();
  };
};
