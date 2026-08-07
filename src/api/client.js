const BASE = '/api';
const TIMEOUT = 2500;

let adminToken = null;
export function setAdminToken(token) {
  adminToken = token || null;
}
export function getAdminToken() {
  return adminToken;
}

function headers() {
  const h = {};
  if (adminToken) h.Authorization = `Bearer ${adminToken}`;
  return h;
}

async function request(path, { method = 'GET', body, timeout = TIMEOUT, authed = false } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(BASE + path, {
      method,
      headers: { ...headers(), ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(authed ? headers() : {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error((data && data.error) || `HTTP ${res.status}`);
    return data;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  health: () => request('/health'),
  getData: () => request('/data'),
  saveData: (snapshot) => request('/data', { method: 'POST', body: { snapshot }, timeout: 8000 }),
  login: (phone, password) => request('/auth/login', { method: 'POST', body: { phone, password } }),
  register: (name, phone, password, role) => request('/auth/register', { method: 'POST', body: { name, phone, password, role } }),
  updateMe: (token, patch) => request('/auth/update', { method: 'POST', body: { token, ...patch } }),

  // Admin analytics (real data computed from the snapshot)
  adminKpis: (range) => request(`/admin/kpis${range ? `?range=${range}` : ''}`),
  adminRevenue: (days) => request(`/admin/revenue${days ? `?days=${days}` : ''}`),
  adminRevenueTrend: (days) => request(`/admin/revenue-trend${days ? `?days=${days}` : ''}`),
  adminPeakHours: () => request('/admin/peak-hours'),
  adminPayments: () => request('/admin/payments'),
  adminDelivery: () => request('/admin/delivery'),
  adminProducts: (limit) => request(`/admin/products${limit ? `?limit=${limit}` : ''}`),
  adminOrders: (qs) => request(`/admin/orders${qs ? `?${qs}` : ''}`),
  adminInventory: () => request('/admin/inventory'),
  adminPromotions: () => request('/admin/promotions'),
  adminEmployees: () => request('/admin/employees'),
  adminDashboard: () => request('/admin/dashboard'),
  adminUpdateOrderStatus: (id, status) => request(`/admin/orders/${id}/status`, { method: 'POST', body: { status }, authed: true }),
};

export default api;
