export const auditAction = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  REGISTER: 'register',
  UPDATE: 'update',
  DELETE: 'delete',
};

export const auditResource = {
  USER: 'user',
  ORDER: 'order',
  PRODUCT: 'product',
  CATEGORY: 'category',
};

export function createAuditLog(data) {
  return data;
}
