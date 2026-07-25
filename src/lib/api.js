const API_URL = import.meta.env.VITE_API_URL || '';

class ApiClient {
  constructor() {
    this.baseUrl = API_URL;
    this.token = null;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/api${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
      credentials: 'include',
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 — try refresh
      if (response.status === 401 && !endpoint.includes('/auth/')) {
        try {
          await this.request('/auth/refresh', { method: 'POST' });
          return this.request(endpoint, options);
        } catch {
          throw new Error('Sessiya muddati tugadi. Qaytadan kiring.');
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Server bilan bog\'lanib bo\'lmadi');
      }
      throw err;
    }
  }

  get(endpoint) { return this.request(endpoint); }
  post(endpoint, body) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) }); }
  put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }); }
  delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }

  // ── Auth ──
  login(email, password) { return this.post('/auth/login', { email, password }); }
  register(data) { return this.post('/auth/register', data); }
  logout() { return this.post('/auth/logout'); }
  refreshToken() { return this.post('/auth/refresh'); }

  // ── Branches ──
  getBranches() { return this.get('/branches'); }
  getBranch(id) { return this.get(`/branches/${id}`); }
  getNearestBranch(lat, lng) { return this.get(`/branches/nearest?lat=${lat}&lng=${lng}`); }

  // ── Products ──
  getProducts(params) { return this.get(`/products?${new URLSearchParams(params)}`); }
  getProduct(id) { return this.get(`/products/${id}`); }

  // ── Categories ──
  getCategories() { return this.get('/categories'); }

  // ── Cart ──
  getCart() { return this.get('/cart'); }
  addToCart(productId, quantity) { return this.post('/cart/items', { productId, quantity }); }
  updateCartItem(productId, quantity) { return this.put(`/cart/items/${productId}`, { quantity }); }
  removeFromCart(productId) { return this.delete(`/cart/items/${productId}`); }

  // ── Orders ──
  createOrder(data) { return this.post('/orders', data); }
  getOrders() { return this.get('/orders'); }
  getOrder(id) { return this.get(`/orders/${id}`); }

  // ── User ──
  getProfile() { return this.get('/users/profile'); }
  updateProfile(data) { return this.put('/users/profile', data); }
  getAddresses() { return this.get('/users/addresses'); }
  addAddress(data) { return this.post('/users/addresses', data); }
  updateAddress(id, data) { return this.put(`/users/addresses/${id}`, data); }
  deleteAddress(id) { return this.delete(`/users/addresses/${id}`); }

  // ── Promotions ──
  validatePromo(code, subtotal) { return this.post('/promotions/validate', { code, subtotal }); }

  // ── Notifications ──
  getNotifications() { return this.get('/notifications'); }
  markNotificationRead(id) { return this.put(`/notifications/${id}/read`); }

  // ── Upload ──
  async uploadImage(file, folder = 'ajif') {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    const url = `${this.baseUrl}/api/upload/image`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    return response.json();
  }
}

export const api = new ApiClient();
export default api;
