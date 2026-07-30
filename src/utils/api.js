const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const config = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };
  const res = await fetch(`${API_URL}${endpoint}`, config);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Request failed');
  return data;
}

export const authApi = {
  login: (phone) =>
    request('/auth/phone-login', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),
  verifyCode: (phone, code) =>
    request('/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    }),
  googleLogin: (credential) =>
    request('/auth/google-login', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    }),
};
