export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'BEK FOOD API',
    version: '1.0.0',
    description: 'REST API for BEK FOOD restaurant management system',
    contact: {
      name: 'BEK FOOD Support',
    },
  },
  servers: [
    { url: '/api', description: 'API base path' },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
        description: 'JWT access token stored in httpOnly cookie',
      },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          phone: { type: 'string' },
          role: { type: 'string', enum: ['CUSTOMER', 'ADMIN', 'ORDER_MANAGER', 'DRIVER'] },
          avatar: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'integer' },
          discountPrice: { type: 'integer' },
          image: { type: 'string' },
          categoryId: { type: 'string', format: 'uuid' },
          isAvailable: { type: 'boolean' },
          isPopular: { type: 'boolean' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          icon: { type: 'string' },
          sortOrder: { type: 'integer' },
          isVisible: { type: 'boolean' },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          orderNumber: { type: 'string' },
          status: { type: 'string', enum: ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'DELIVERING', 'DELIVERED', 'COMPLETED', 'CANCELLED'] },
          subtotal: { type: 'integer' },
          deliveryFee: { type: 'integer' },
          total: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Cart: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
          subtotal: { type: 'integer' },
          total: { type: 'integer' },
        },
      },
      CartItem: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          productId: { type: 'string', format: 'uuid' },
          quantity: { type: 'integer' },
          notes: { type: 'string' },
        },
      },
      Address: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          label: { type: 'string' },
          fullAddress: { type: 'string' },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
          isDefault: { type: 'boolean' },
        },
      },
      Promotion: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          code: { type: 'string' },
          description: { type: 'string' },
          discount: { type: 'integer' },
          promoType: { type: 'string', enum: ['PERCENT', 'FIXED', 'CATEGORY'] },
          isActive: { type: 'boolean' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
        },
      },
      Driver: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          vehicleType: { type: 'string' },
          vehiclePlate: { type: 'string' },
          status: { type: 'string', enum: ['ONLINE', 'OFFLINE', 'ON_DELIVERY'] },
          rating: { type: 'number' },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object' },
        },
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: { type: 'array' },
          pagination: {
            type: 'object',
            properties: {
              total: { type: 'integer' },
              page: { type: 'integer' },
              limit: { type: 'integer' },
              totalPages: { type: 'integer' },
              hasNext: { type: 'boolean' },
              hasPrev: { type: 'boolean' },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          errors: { type: 'array', items: { type: 'object' } },
        },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' }, name: { type: 'string' }, phone: { type: 'string' } }, required: ['email', 'password', 'name'] } } } },
        responses: { '201': { description: 'Registration successful' }, '400': { description: 'Validation error' } },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login with email and password',
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, password: { type: 'string' } }, required: ['email', 'password'] } } } },
        responses: { '200': { description: 'Login successful' }, '401': { description: 'Invalid credentials' } },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        responses: { '200': { description: 'Token refreshed' } },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout and revoke tokens',
        security: [{ cookieAuth: [] }],
        responses: { '200': { description: 'Logged out' } },
      },
    },
    '/auth/change-password': {
      put: {
        tags: ['Auth'],
        summary: 'Change password (authenticated)',
        security: [{ cookieAuth: [] }],
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { currentPassword: { type: 'string' }, newPassword: { type: 'string' } }, required: ['currentPassword', 'newPassword'] } } } },
        responses: { '200': { description: 'Password changed' }, '401': { description: 'Invalid current password' } },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Request password reset email',
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' } }, required: ['email'] } } } },
        responses: { '200': { description: 'Reset link sent if email exists' } },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password with token',
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { token: { type: 'string' }, password: { type: 'string' } }, required: ['token', 'password'] } } } },
        responses: { '200': { description: 'Password reset successful' }, '400': { description: 'Invalid or expired token' } },
      },
    },
    '/users/profile': {
      get: {
        tags: ['Users'],
        summary: 'Get current user profile',
        security: [{ cookieAuth: [] }],
        responses: { '200': { description: 'User profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } } },
      },
      put: {
        tags: ['Users'],
        summary: 'Update current user profile',
        security: [{ cookieAuth: [] }],
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, phone: { type: 'string' }, avatar: { type: 'string' } } } } } },
        responses: { '200': { description: 'Profile updated' } },
      },
    },
    '/users/addresses': {
      get: {
        tags: ['Addresses'],
        summary: 'Get user addresses',
        security: [{ cookieAuth: [] }],
        responses: { '200': { description: 'List of addresses', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Address' } } } } } },
      },
      post: {
        tags: ['Addresses'],
        summary: 'Add new address',
        security: [{ cookieAuth: [] }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Address' } } } },
        responses: { '201': { description: 'Address created' } },
      },
    },
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Get all products',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string', format: 'uuid' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'available', in: 'query', schema: { type: 'string', enum: ['true', 'false'] } },
        ],
        responses: { '200': { description: 'Paginated products', content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedResponse' } } } } },
      },
      post: {
        tags: ['Products'],
        summary: 'Create a product (Admin)',
        security: [{ cookieAuth: [] }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
        responses: { '201': { description: 'Product created' } },
      },
    },
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Get all categories',
        responses: { '200': { description: 'List of categories', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Category' } } } } } },
      },
      post: {
        tags: ['Categories'],
        summary: 'Create a category (Admin)',
        security: [{ cookieAuth: [] }],
        responses: { '201': { description: 'Category created' } },
      },
    },
    '/cart': {
      get: {
        tags: ['Cart'],
        summary: 'Get current user cart',
        security: [{ cookieAuth: [] }],
        responses: { '200': { description: 'Cart with items', content: { 'application/json': { schema: { $ref: '#/components/schemas/Cart' } } } } },
      },
    },
    '/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Get current user orders',
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Paginated orders', content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedResponse' } } } } },
      },
      post: {
        tags: ['Orders'],
        summary: 'Create a new order from cart',
        security: [{ cookieAuth: [] }],
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { branchId: { type: 'string' }, deliveryType: { type: 'string', enum: ['DELIVERY', 'PICKUP'] }, addressId: { type: 'string' }, paymentMethod: { type: 'string', enum: ['CASH', 'UZCARD', 'HUMO', 'ONLINE'] }, promoCode: { type: 'string' }, notes: { type: 'string' } }, required: ['branchId', 'deliveryType', 'paymentMethod'] } } } },
        responses: { '201': { description: 'Order created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } } },
      },
    },
    '/drivers/register': {
      post: {
        tags: ['Drivers'],
        summary: 'Register as a driver',
        security: [{ cookieAuth: [] }],
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { vehicleType: { type: 'string' }, vehiclePlate: { type: 'string' } }, required: ['vehicleType', 'vehiclePlate'] } } } },
        responses: { '201': { description: 'Driver registered' } },
      },
    },
    '/promotions': {
      get: {
        tags: ['Promotions'],
        summary: 'Get all promotions (Admin)',
        security: [{ cookieAuth: [] }],
        responses: { '200': { description: 'List of promotions' } },
      },
      post: {
        tags: ['Promotions'],
        summary: 'Create a promotion (Admin)',
        security: [{ cookieAuth: [] }],
        responses: { '201': { description: 'Promotion created' } },
      },
    },
    '/promotions/validate': {
      post: {
        tags: ['Promotions'],
        summary: 'Validate a promo code',
        security: [{ cookieAuth: [] }],
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { code: { type: 'string' }, subtotal: { type: 'integer' } }, required: ['code', 'subtotal'] } } } },
        responses: { '200': { description: 'Promo code valid', content: { 'application/json': { schema: { type: 'object', properties: { code: { type: 'string' }, discount: { type: 'integer' }, discountType: { type: 'string' } } } } } } },
      },
    },
    '/analytics/dashboard': {
      get: {
        tags: ['Analytics'],
        summary: 'Get dashboard analytics (Admin)',
        security: [{ cookieAuth: [] }],
        responses: { '200': { description: 'Dashboard data' } },
      },
    },
    '/notifications': {
      get: {
        tags: ['Notifications'],
        summary: 'Get user notifications',
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { '200': { description: 'Paginated notifications' } },
      },
    },
    '/upload/image': {
      post: {
        tags: ['Upload'],
        summary: 'Upload an image',
        security: [{ cookieAuth: [] }],
        requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { image: { type: 'string', format: 'binary' }, folder: { type: 'string' } } } } } },
        responses: { '201': { description: 'Image uploaded', content: { 'application/json': { schema: { type: 'object', properties: { url: { type: 'string' }, publicId: { type: 'string' } } } } } } },
      },
    },
    '/branches': {
      get: {
        tags: ['Branches'],
        summary: 'Get all active branches',
        responses: { '200': { description: 'List of branches' } },
      },
    },
    '/branches/nearest': {
      get: {
        tags: ['Branches'],
        summary: 'Get nearest branch by coordinates',
        parameters: [
          { name: 'lat', in: 'query', required: true, schema: { type: 'number' } },
          { name: 'lng', in: 'query', required: true, schema: { type: 'number' } },
        ],
        responses: { '200': { description: 'Nearest branch with distance' } },
      },
    },
  },
};
