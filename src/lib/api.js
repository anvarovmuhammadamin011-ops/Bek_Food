const API_URL = import.meta.env.VITE_API_URL || '';

class ApiClient {
  constructor() {
    this.baseUrl = API_URL;
    // Load token from localStorage on init
    this.token = localStorage.getItem('accessToken') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('accessToken');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/api${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
      credentials: 'include',
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Network error — backend may be unavailable');
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
  logout() {
    this.setToken(null);
    localStorage.removeItem('refreshToken');
    return this.post('/auth/logout');
  }
  refreshToken() { return this.post('/auth/refresh'); }

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
  async uploadImage(file, folder = 'bekfood') {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    const url = `${this.baseUrl}/api/upload/image`;
    const token = this.getToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers,
    });
    return response.json();
  }
}

export const api = new ApiClient();
export default api;
