const BASE = '/api';
const TIMEOUT = 2500;

async function request(path, { method = 'GET', body, timeout = TIMEOUT } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(BASE + path, {
      method,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
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
};

export default api;