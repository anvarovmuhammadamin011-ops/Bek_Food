import express from 'express';
import http from 'node:http';
import { createHash, randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, existsSync, renameSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import { Server } from 'socket.io';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8081;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const TMP_FILE = path.join(DATA_DIR, 'db.tmp.json');

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(cors({ origin: '*', credentials: false }));

const server = http.createServer(app);
const io = new Server(server, {
  path: '/socket.io',
  cors: { origin: '*', credentials: false },
});

function ensureDb() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(DB_FILE)) {
    const db = { snapshot: null, users: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    seedAdmin(db);
    writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    return;
  }
}

const hash = (pw) => createHash('sha256').update(String(pw || '')).digest('hex');

function seedAdmin(db) {
  const adminPhones = ['998900000000', '998777777777'];
  let changed = false;
  for (const adminPhone of adminPhones) {
    const existing = db.users.find((u) => String(u.phone).replace(/\D/g, '') === adminPhone);
    if (existing) {
      if (existing.role === 'admin' && existing.password === hash('1111')) continue;
      existing.role = 'admin';
      existing.password = hash('1111');
      existing.name = 'Admin';
      changed = true;
    } else {
      db.users.push({
        id: db.users.reduce((m, u) => Math.max(m, u.id), 0) + 1,
        name: 'Admin',
        phone: adminPhone,
        password: hash('1111'),
        role: 'admin',
        createdAt: new Date().toISOString(),
      });
      changed = true;
    }
  }
  return changed;
}

function ensureAdmin() {
  ensureDb();
  const db = JSON.parse(readFileSync(DB_FILE, 'utf-8'));
  if (seedAdmin(db)) {
    db.updatedAt = new Date().toISOString();
    writeFileSync(TMP_FILE, JSON.stringify(db, null, 2));
    renameSync(TMP_FILE, DB_FILE);
  }
}

ensureAdmin();

function readDb() {
  ensureDb();
  try {
    return JSON.parse(readFileSync(DB_FILE, 'utf-8'));
  } catch {
    return { snapshot: null, users: [] };
  }
}

function writeDb(db) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  db.updatedAt = new Date().toISOString();
  writeFileSync(TMP_FILE, JSON.stringify(db, null, 2));
  renameSync(TMP_FILE, DB_FILE);
  broadcastSnapshot();
}

function readSnapshot() {
  const db = readDb();
  return db.snapshot || { foods: [], categories: [], restaurants: [], banners: [], promoCodes: [], settings: {}, inventory: [], employees: [], branches: [], orders: [], addresses: [], notifications: [] };
}

const sessions = new Map();

const ACTIVE_STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'pickedUp', 'onTheWay', 'assigned'];
const COMPLETED_STATUSES = ['delivered', 'completed'];

function analyze(snap) {
  const orders = Array.isArray(snap.orders) ? snap.orders : [];

  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
  const today = (d) => d >= todayStart;
  const dayMs = 24 * 3600 * 1000;
  const since = (days) => new Date(now.getTime() - days * dayMs);

  const byStatus = {};
  ACTIVE_STATUSES.forEach((s) => (byStatus[s] = 0));
  let activeOrders = 0;
  let completedToday = 0;
  let cancelledToday = 0;
  let todayRevenue = 0;
  let todayOrders = 0;
  const distinctCustomers = new Set();

  const delivered = orders.filter((o) => COMPLETED_STATUSES.includes(o.status));
  orders.forEach((o) => {
    distinctCustomers.add(o.customerPhone || o.customerName);
    if (ACTIVE_STATUSES.includes(o.status)) activeOrders++;
    if (byStatus[o.status] !== undefined) byStatus[o.status] = (byStatus[o.status] || 0) + 1;
    if (today(new Date(o.createdAt))) {
      todayOrders++;
      if (o.status === 'cancelled') cancelledToday++;
    }
    if (COMPLETED_STATUSES.includes(o.status) && today(new Date(o.createdAt))) {
      todayRevenue += Number(o.total) || 0;
      completedToday++;
    }
  });

  const weekStart = since(7);
  const monthStart = since(30);
  let weekRevenue = 0, monthRevenue = 0;
  delivered.forEach((o) => {
    const t = new Date(o.createdAt);
    if (t >= weekStart) weekRevenue += Number(o.total) || 0;
    if (t >= monthStart) monthRevenue += Number(o.total) || 0;
  });

  const avgOrderValue = completedToday ? Math.round(todayRevenue / completedToday) : 0;

  const yesterdayStart = new Date(now.getTime() - dayMs);
  let yesterdayRevenue = 0;
  const ys = new Date(now.getTime() - 2 * dayMs);
  delivered.forEach((o) => {
    const t = new Date(o.createdAt);
    if (t >= ys && t < yesterdayStart) yesterdayRevenue += Number(o.total) || 0;
  });
  const revenueChangePct = yesterdayRevenue
    ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
    : 0;

  return {
    summary: {
      todayRevenue,
      weekRevenue,
      monthRevenue,
      todayOrders,
      activeOrders,
      completedToday,
      cancelledToday,
      avgOrderValue,
      totalOrders: orders.length,
      totalCustomers: distinctCustomers.size,
      totalRevenue: delivered.reduce((s, o) => s + (Number(o.total) || 0), 0),
      revenueChangePct,
    },
    byStatus,
    activeOrders,
    completedToday,
    cancelledToday,
  };
}

function revenueByDay(snap, days = 7) {
  const orders = (Array.isArray(snap.orders) ? snap.orders : []).filter((o) => COMPLETED_STATUSES.includes(o.status));
  const now = new Date();
  const labels = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
    labels.push(d.toISOString().split('T')[0]);
  }
  const acc = Object.fromEntries(labels.map((d) => [d, 0]));
  orders.forEach((o) => {
    const d = new Date(o.createdAt).toISOString().split('T')[0];
    if (acc[d] !== undefined) acc[d] += Number(o.total) || 0;
  });
  const totals = {};
  orders.forEach((o) => {
    const d = new Date(o.createdAt).toISOString().split('T')[0];
    totals[d] = (totals[d] || 0) + 1;
  });
  return labels.map((d) => ({ date: d.slice(5), revenue: Math.round(acc[d]), orders: totals[d] || 0 }));
}

function ordersTimeline(snap, days = 7) {
  const orders = Array.isArray(snap.orders) ? snap.orders : [];
  const now = new Date();
  const labels = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 3600 * 1000);
    labels.push(d.toISOString().split('T')[0]);
  }
  const acc = Object.fromEntries(labels.map((d) => [d, 0]));
  orders.forEach((o) => {
    const d = new Date(o.createdAt).toISOString().split('T')[0];
    if (acc[d] !== undefined) acc[d]++;
  });
  return labels.map((d) => ({ date: d.slice(5), count: acc[d] || 0 }));
}

function peakHours(snap) {
  const orders = (Array.isArray(snap.orders) ? snap.orders : []).filter((o) => COMPLETED_STATUSES.includes(o.status));
  const hours = Array(24).fill(0);
  orders.forEach((o) => {
    const h = new Date(o.createdAt).getHours();
    hours[h]++;
  });
  return hours.map((count, h) => ({ hour: `${h}:00`, count }));
}

function paymentAnalytics(snap) {
  const orders = (Array.isArray(snap.orders) ? snap.orders : []).filter((o) => COMPLETED_STATUSES.includes(o.status));
  const groups = {};
  orders.forEach((o) => {
    const pm = o.paymentMethod || 'cash';
    groups[pm] = (groups[pm] || { count: 0, revenue: 0 });
    groups[pm].count++;
    groups[pm].revenue += Number(o.total) || 0;
  });
  return Object.entries(groups).map(([name, v]) => ({ name, ...v, revenue: Math.round(v.revenue) }));
}

function deliveryVsPickup(snap) {
  const orders = (Array.isArray(snap.orders) ? snap.orders : []).filter((o) => COMPLETED_STATUSES.includes(o.status));
  const groups = {};
  orders.forEach((o) => {
    const dt = (o.deliveryType || 'delivery').toLowerCase();
    groups[dt] = (groups[dt] || { count: 0, revenue: 0 });
    groups[dt].count++;
    groups[dt].revenue += Number(o.total) || 0;
  });
  return Object.entries(groups).map(([name, v]) => ({ name, ...v, revenue: Math.round(v.revenue) }));
}

function topProducts(snap, limit = 10) {
  const orders = (Array.isArray(snap.orders) ? snap.orders : []).filter((o) => COMPLETED_STATUSES.includes(o.status));
  const foods = Array.isArray(snap.foods) ? snap.foods : [];
  const qty = {};
  const rev = {};
  orders.forEach((o) => {
    (o.items || []).forEach((it) => {
      const fid = it.food?.id || it.foodId;
      const q = Number(it.quantity) || 0;
      qty[fid] = (qty[fid] || 0) + q;
      rev[fid] = (rev[fid] || 0) + (Number(it.price) || 0) * q;
    });
  });
  return foods
    .map((f) => ({
      id: f.id,
      name: f.name,
      image: f.image,
      sold: qty[f.id] || 0,
      revenue: Math.round(rev[f.id] || 0),
    }))
    .filter((p) => p.sold > 0)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, limit);
}

function inventoryStatus(snap) {
  const inv = Array.isArray(snap.inventory) ? snap.inventory : [];
  return inv.map((i) => ({
    id: i.id,
    name: i.name,
    quantity: Number(i.quantity) || 0,
    unit: i.unit,
    minQuantity: Number(i.minQuantity) || 0,
    unitCost: Number(i.unitCost) || 0,
    status: i.status || (Number(i.quantity) <= Number(i.minQuantity) ? 'low' : 'ok'),
    value: Math.round((Number(i.quantity) || 0) * (Number(i.unitCost) || 0)),
  }));
}

function ordersList(snap, filter) {
  let orders = Array.isArray(snap.orders) ? [...snap.orders] : [];
  if (filter?.status) orders = orders.filter((o) => o.status === filter.status);
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return orders.slice(0, Number(filter?.limit) || 50).map((o) => ({
    id: o.id,
    customerName: o.customerName || '---',
    customerPhone: o.customerPhone || '',
    status: o.status,
    total: Number(o.total) || 0,
    items: Array.isArray(o.items) ? o.items.length : 0,
    paymentMethod: o.paymentMethod || 'cash',
    deliveryType: o.deliveryType || 'delivery',
    createdAt: o.createdAt,
    estimatedReady: o.estimatedReady,
    notes: o.notes || '',
    courierId: o.courierId,
    priority: o.priority || 'normal',
  }));
}

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  const userId = sessions.get(String(token || ''));
  if (!userId) return res.status(401).json({ ok: false, error: 'Autorizatsiya talab etiladi' });
  const db = readDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return res.status(401).json({ ok: false, error: 'Foydalanuvchi topilmadi' });
  if (user.role !== 'admin') return res.status(403).json({ ok: false, error: 'Ruxsat berilmagan' });
  req.adminUser = user;
  next();
}

function broadcastSnapshot() {
  const snap = readSnapshot();
  try {
    const a = analyze(snap);
    io.emit('dashboard:kpi', a.summary);
    io.emit('dashboard:orders', a.byStatus);
    io.emit('dashboard:refresh', { updatedAt: new Date().toISOString() });
  } catch {
    io.emit('dashboard:refresh', { updatedAt: new Date().toISOString() });
  }
}

io.on('connection', (socket) => {
  const snap = readSnapshot();
  const a = analyze(snap);
  socket.emit('dashboard:kpi', a.summary);
  socket.emit('dashboard:refresh', { updatedAt: new Date().toISOString() });
  socket.on('admin:ping', () => socket.emit('admin:pong', { ok: true, time: Date.now() }));
});

// ---------- Health ----------
app.get('/api/health', (_req, res) => res.json({ ok: true, uptime: process.uptime() }));

// ---------- Full data snapshot (client <-> server) ----------
app.get('/api/data', (_req, res) => {
  const db = readDb();
  res.json({ ok: true, data: db.snapshot && Object.keys(db.snapshot).length ? db.snapshot : null, updatedAt: db.updatedAt });
});

app.post('/api/data', (req, res) => {
  const snapshot = req.body && req.body.snapshot;
  if (!snapshot || typeof snapshot !== 'object') return res.status(400).json({ ok: false, error: 'snapshot kerak' });
  const db = readDb();
  db.snapshot = snapshot;
  writeDb(db);
  res.json({ ok: true, updatedAt: db.updatedAt });
});

// ---------- Auth ----------
app.post('/api/auth/login', (req, res) => {
  const { phone, password } = req.body || {};
  const p = String(phone || '').replace(/\D/g, '');
  if (p.length < 9) return res.status(400).json({ ok: false, error: 'Telefon raqam noto\'g\'ri' });
  const db = readDb();
  let user = db.users.find((u) => String(u.phone).replace(/\D/g, '') === p);
  if (!user) {
    user = {
      id: db.users.reduce((m, u) => Math.max(m, u.id), 0) + 1,
      name: 'Mijoz',
      phone: p,
      password: hash(password || ''),
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    writeDb(db);
  } else if (password && hash(password) !== user.password) {
    return res.status(401).json({ ok: false, error: 'Parol noto\'g\'ri' });
  }
  const token = randomUUID();
  sessions.set(token, user.id);
  const { password: _pw, ...safe } = user;
  res.json({ ok: true, user: { ...safe, role: safe.role || 'customer' }, token });
});

app.post('/api/auth/register', (req, res) => {
  const { name, phone, password, role } = req.body || {};
  const p = String(phone || '').replace(/\D/g, '');
  if (p.length < 9) return res.status(400).json({ ok: false, error: 'Telefon raqam noto\'g\'ri' });
  const db = readDb();
  if (db.users.some((u) => String(u.phone).replace(/\D/g, '') === p)) {
    return res.status(409).json({ ok: false, error: 'Bu raqam allaqachon ro\'yxatdan o\'tgan' });
  }
  const user = {
    id: db.users.length + 1,
    name: name || 'Mijoz',
    phone: p,
    email: '',
    password: hash(password || ''),
    role: (role || 'customer').toLowerCase(),
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDb(db);
  const { password: _pw, ...safe } = user;
  res.json({ ok: true, user: { ...safe, role: safe.role } });
});

app.post('/api/auth/update', (req, res) => {
  const { token, name, phone, email, password } = req.body || {};
  const userId = sessions.get(String(token || ''));
  if (!userId) return res.status(401).json({ ok: false, error: 'Avtorizatsiya kerak' });
  const db = readDb();
  const u = db.users.find((x) => x.id === userId);
  if (!u) return res.status(404).json({ ok: false, error: 'Foydalanuvchi topilmadi' });
  if (name !== undefined) u.name = name;
  if (email !== undefined) u.email = email;
  if (phone !== undefined) u.phone = String(phone).replace(/\D/g, '');
  if (password) u.password = hash(password);
  writeDb(db);
  const { password: _pw, ...safe } = u;
  res.json({ ok: true, user: { ...safe, role: safe.role } });
});

// ---------- Admin analytics (real data computed from snapshot) ----------
app.get('/api/admin/dashboard', (req, res) => {
  const snap = readSnapshot();
  const a = analyze(snap);
  res.json({ ok: true, data: a });
});

app.get('/api/admin/kpis', (req, res) => {
  const { range = 'today', days = '7' } = req.query;
  const snap = readSnapshot();
  const a = analyze(snap);
  const out = { ...a.summary, byStatus: a.byStatus, range, days: Number(days) };
  res.json({ ok: true, data: out });
});

app.get('/api/admin/revenue', (req, res) => {
  const { days = '30' } = req.query;
  const snap = readSnapshot();
  res.json({ ok: true, data: revenueByDay(snap, Number(days)) });
});

app.get('/api/admin/revenue-trend', (req, res) => {
  const { days = '7' } = req.query;
  const snap = readSnapshot();
  res.json({ ok: true, data: ordersTimeline(snap, Number(days)) });
});

app.get('/api/admin/peak-hours', (_req, res) => {
  const snap = readSnapshot();
  res.json({ ok: true, data: peakHours(snap) });
});

app.get('/api/admin/payments', (_req, res) => {
  const snap = readSnapshot();
  res.json({ ok: true, data: paymentAnalytics(snap) });
});

app.get('/api/admin/delivery', (_req, res) => {
  const snap = readSnapshot();
  res.json({ ok: true, data: deliveryVsPickup(snap) });
});

app.get('/api/admin/products', (req, res) => {
  const { limit = '10' } = req.query;
  const snap = readSnapshot();
  res.json({ ok: true, data: topProducts(snap, Number(limit)) });
});

app.get('/api/admin/orders', (req, res) => {
  const snap = readSnapshot();
  res.json({ ok: true, data: ordersList(snap, req.query) });
});

app.get('/api/admin/inventory', (_req, res) => {
  const snap = readSnapshot();
  res.json({ ok: true, data: inventoryStatus(snap) });
});

app.get('/api/admin/promotions', (_req, res) => {
  const snap = readSnapshot();
  const promos = (Array.isArray(snap.promoCodes) ? snap.promoCodes : []).map((p) => ({
    id: p.id,
    code: p.code,
    discount: p.discount,
    discountType: p.discountType,
    usedCount: p.usedCount || 0,
    maxUses: p.maxUses || 0,
    active: !!p.active,
    startDate: p.startDate,
    endDate: p.endDate,
    minOrder: p.minOrder,
  }));
  res.json({ ok: true, data: promos });
});

app.get('/api/admin/employees', (_req, res) => {
  const snap = readSnapshot();
  const settings = snap.settings || {};
  const employees = (Array.isArray(snap.employees) ? snap.employees : []).map((e) => ({
    id: e.id,
    name: e.name,
    role: e.role,
    phone: e.phone,
    rating: e.rating,
    isOnline: e.isOnline,
    totalDeliveries: e.totalDeliveries,
    totalOrders: e.totalOrders,
  }));
  res.json({ ok: true, data: { settings, employees } });
});

app.post('/api/admin/orders/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  const db = readDb();
  if (!db.snapshot || !Array.isArray(db.snapshot.orders)) return res.status(404).json({ ok: false, error: 'Buyurtma topilmadi' });
  const order = db.snapshot.orders.find((o) => String(o.id) === String(id));
  if (!order) return res.status(404).json({ ok: false, error: 'Buyurtma topilmadi' });
  order.status = status;
  order.updatedAt = new Date().toISOString();
  writeDb(db);
  io.emit('order:status', { orderId: order.id, status, updatedAt: order.updatedAt, user: req.adminUser.name });
  io.emit('dashboard:refresh', { updatedAt: new Date().toISOString(), changed: 'orders' });
  res.json({ ok: true, order: ordersList(db.snapshot, { status }).find((o) => o.id === order.id) });
});

// ---------- Static (production build) ----------
const DIST = path.join(__dirname, '..', 'dist');
if (existsSync(DIST)) {
  app.use(express.static(DIST));
  app.get(/^\/(?!api\/).*/, (_req, res) => res.sendFile(path.join(DIST, 'index.html')));
} else {
  app.get('/', (_req, res) => res.json({ ok: true, message: 'BEK FOOD API ishlayapti. Frontend build qilinmagan: npm run build' }));
}

server.listen(PORT, () => {
  console.log(`BEK FOOD API  http://localhost:${PORT}`);
  ensureDb();
});
