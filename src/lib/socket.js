import { io } from 'socket.io-client';

let socket = null;
let listeners = new Map();
let connected = false;

function connect() {
  if (socket) return socket;
  socket = io({ path: '/socket.io', transports: ['websocket', 'polling'], reconnection: true, reconnectionDelay: 2000 });
  socket.on('connect', () => {
    connected = true;
    emit('admin:subscribe', { scope: 'dashboard' });
  });
  socket.on('disconnect', () => {
    connected = false;
  });
  socket.on('dashboard:refresh', (payload) => {
    (listeners.get('refresh') || []).forEach((fn) => fn(payload));
  });
  socket.on('dashboard:kpi', (payload) => {
    (listeners.get('kpi') || []).forEach((fn) => fn(payload));
  });
  socket.on('dashboard:orders', (payload) => {
    (listeners.get('orders') || []).forEach((fn) => fn(payload));
  });
  socket.on('order:status', (payload) => {
    (listeners.get('order') || []).forEach((fn) => fn(payload));
  });
  socket.on('seller:notify', (payload) => {
    (listeners.get('seller:notify') || []).forEach((fn) => fn(payload));
  });
  return socket;
}

function ensure() {
  if (!socket) connect();
  return socket;
}

export function emit(event, payload) {
  const s = ensure();
  if (s && connected) s.emit(event, payload);
}

export function on(event, fn) {
  ensure();
  const arr = listeners.get(event) || [];
  arr.push(fn);
  listeners.set(event, arr);
}

export function off(event, fn) {
  const arr = listeners.get(event) || [];
  listeners.set(
    event,
    arr.filter((f) => f !== fn)
  );
}

export function socketReady() {
  return connected;
}

export default { connect, emit, on, off, socketReady };
