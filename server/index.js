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
ensureDemoSnapshot();

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

const DEMO = {
  settings: { name: 'BEK FOOD', phone: '+998 90 123 45 67', address: "Chinobod tumani, Oqtepa ko'chasi, 15", logo: '/logo.png', openTime: '10:00', closeTime: '23:00', deliveryFee: 0, minOrder: 0, paymentMethods: { cash: true, card: true, click: true, payme: true } },
  categories: [
    { id: 1, name: "Hot-doglar", icon: 'HD' },
    { id: 2, name: 'Lavash', icon: 'LV' },
    { id: 3, name: 'Burgerlar', icon: 'BG' },
    { id: 4, name: 'Doner', icon: 'DN' },
    { id: 5, name: 'Fri', icon: 'FR' },
    { id: 6, name: 'Ichimliklar', icon: 'DR' },
    { id: 7, name: 'Deserlar', icon: 'DS' },
    { id: 8, name: 'Sosiska', icon: 'SO' },
  ],
  foods: [
    { id: 1, name: 'Hot-dog oddiy', price: 12000, image: '/food/hotdog.svg', categoryId: 1, isPopular: true, restaurantId: 1, spiceLevel: 0, ingredients: ['Sosiska', 'Bulochka'] },
    { id: 2, name: 'Hot-dog qalamper', price: 15000, image: '/food/hotdog.svg', categoryId: 1, isPopular: true, restaurantId: 1, spiceLevel: 0, ingredients: ['Sosiska', 'Bulochka', 'Sous'] },
    { id: 3, name: 'Lavash murch', price: 32000, image: '/food/lavash.svg', categoryId: 2, isPopular: true, restaurantId: 1, spiceLevel: 1, ingredients: ['Murch', 'Sous', 'Salat'] },
    { id: 4, name: 'Lavash betta', price: 28000, image: '/food/lavash.svg', categoryId: 2, isPopular: false, restaurantId: 1, spiceLevel: 0, ingredients: ['Betta', 'Sous'] },
    { id: 5, name: 'Gamburger', price: 35000, image: '/food/burger.svg', categoryId: 3, isPopular: true, restaurantId: 1, spiceLevel: 0, ingredients: ['Govedina', 'Bulochka', 'Sous'] },
    { id: 6, name: 'Chizburger', price: 42000, image: '/food/burger.svg', categoryId: 3, isPopular: false, restaurantId: 1, spiceLevel: 0, ingredients: ['Govedina', 'Pishloq', 'Sous'] },
    { id: 7, name: 'Doner kichik', price: 25000, image: '/food/doner.svg', categoryId: 4, isPopular: true, restaurantId: 1, spiceLevel: 0, ingredients: ['Govedina'] },
    { id: 8, name: 'Doner katta', price: 33000, image: '/food/doner.svg', categoryId: 4, isPopular: false, restaurantId: 1, spiceLevel: 0, ingredients: ['Govedina', 'Sous'] },
    { id: 9, name: 'Fri katta', price: 15000, image: '/food/fri.svg', categoryId: 5, isPopular: true, restaurantId: 1, spiceLevel: 0, ingredients: ['Kartoshka'] },
    { id: 10, name: 'Fri mini', price: 9000, image: '/food/fri.svg', categoryId: 5, isPopular: false, restaurantId: 1, spiceLevel: 0, ingredients: ['Kartoshka'] },
    { id: 11, name: 'Coca Cola', price: 8000, image: '/food/coca.svg', categoryId: 6, isPopular: true, restaurantId: 1, spiceLevel: 0, ingredients: ['Gazli suv'] },
    { id: 12, name: 'Fanta', price: 8000, image: '/food/fanta.svg', categoryId: 6, isPopular: false, restaurantId: 1, spiceLevel: 0, ingredients: ['Gazli suv'] },
    { id: 13, name: 'Mastakhaftoy', price: 10000, image: '/food/milk.svg', categoryId: 6, isPopular: false, restaurantId: 1, spiceLevel: 0, ingredients: ['Suv', 'Shirinlov'] },
    { id: 14, name: 'Napoleon', price: 12000, image: '/food/cake.svg', categoryId: 7, isPopular: true, restaurantId: 1, spiceLevel: 0, ingredients: ['Tort'] },
    { id: 15, name: 'Chocolate mousse', price: 18000, image: '/food/dessert.svg', categoryId: 7, isPopular: false, restaurantId: 1, spiceLevel: 0, ingredients: ['Shokolad'] },
    { id: 16, name: 'Sosiska 1 dona', price: 5000, image: '/food/hotdog.svg', categoryId: 8, isPopular: false, restaurantId: 1, spiceLevel: 0, ingredients: ['Sosiska'] },
    { id: 17, name: 'Lavash doner', price: 38000, image: '/food/lavash.svg', categoryId: 2, isPopular: true, restaurantId: 1, spiceLevel: 0, ingredients: ['Doner', 'Sous', 'Salat'] },
    { id: 18, name: 'Double burger', price: 48000, image: '/food/burger.svg', categoryId: 3, isPopular: true, restaurantId: 1, spiceLevel: 0, ingredients: ['Ikki marta govedina'] },
    { id: 19, name: 'Cheeseburger', price: 30000, image: '/food/burger.svg', categoryId: 3, isPopular: false, restaurantId: 1, spiceLevel: 0, ingredients: ['Pishloq', 'Govedina'] },
    { id: 20, name: 'Limon choy', price: 5000, image: '/food/tea.svg', categoryId: 6, isPopular: false, restaurantId: 1, spiceLevel: 0, ingredients: ['Choy', 'Limon'] },
  ],
  inventory: [
    { id: 1, name: "Govedina go'shti", quantity: 15, unit: 'kg', minQuantity: 5, unitCost: 55000, status: 'ok' },
    { id: 2, name: "Tovuq go'shti", quantity: 8, unit: 'kg', minQuantity: 5, unitCost: 28000, status: 'low' },
    { id: 3, name: 'Piyoz', quantity: 20, unit: 'kg', minQuantity: 10, unitCost: 5000, status: 'ok' },
    { id: 4, name: 'Kartoshka', quantity: 3, unit: 'kg', minQuantity: 8, unitCost: 6000, status: 'critical' },
    { id: 5, name: 'Non', quantity: 50, unit: 'dona', minQuantity: 20, unitCost: 3000, status: 'ok' },
    { id: 6, name: 'Pishloq', quantity: 4, unit: 'kg', minQuantity: 3, unitCost: 45000, status: 'ok' },
    { id: 7, name: 'Sosiska', quantity: 24, unit: 'dona', minQuantity: 12, unitCost: 8000, status: 'ok' },
    { id: 8, name: 'Sous', quantity: 2, unit: 'kg', minQuantity: 4, unitCost: 35000, status: 'critical' },
  ],
  promotions: [
    { id: 1, code: 'BEK20', discount: 20, discountType: 'percent', minOrder: 0, maxUses: 0, usedCount: 12, active: true, startDate: '', endDate: '' },
    { id: 2, code: 'BEK50', discount: 5000, discountType: 'fixed', minOrder: 100000, maxUses: 50, usedCount: 18, active: true, startDate: '', endDate: '' },
    { id: 3, code: 'CHINOBOD', discount: 10, discountType: 'percent', minOrder: 50000, maxUsers: 100, maxUses: 100, usedCount: 34, active: false, startDate: '', endDate: '' },
  ],
};

const CUSTOMERS = [
  { name: 'Aziz Karimov', phone: '+998901112233', addr: "Chinobod, Oqtepa ko'chasi, 15" },
  { name: 'Sardor Rahimjonov', phone: '+998902223344', addr: 'Chinobod, Bog\'ishamol ko\'chasi, 8' },
  { name: 'Jamshid Tursunov', phone: '+998903334455', addr: "Chinobod, Mustaqillik ko'chasi, 42" },
  { name: 'Otabek Qodirov', phone: '+998904445566', addr: 'Chinobod, Bobur ko\'chasi, 12' },
  { name: 'Dilshod Aliyev', phone: '+998905556677', addr: "Chinobod, Yangi ko'chasi, 3" },
  { name: 'Nodir Islomov', phone: '+998906667788', addr: 'Chinobod tumani, Markaz ko\'chasi, 5' },
  { name: 'Shohruhbek', phone: '+998907778899', addr: 'Chinobod, G\'alaba ko\'chasi, 77' },
  { name: 'Ulugbek', phone: '+998908889900', addr: "Chinobod, Amir Timur ko'chasi, 9" },
];

const STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'pickedUp', 'onTheWay', 'delivered', 'cancelled'];
const PAYMENTS = ['cash', 'card', 'click', 'payme'];
const DELIVERY = ['delivery', 'pickup'];

function demoOrders(count, daysBack) {
  const list = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getTime() - Math.floor(Math.random() * (daysBack * 24 - 1) * 3600000));
    const items = [];
    const n = 1 + Math.floor(Math.random() * 3);
    let total = 0;
    for (let j = 0; j < n; j++) {
      const f = DEMO.foods[Math.floor(Math.random() * DEMO.foods.length)];
      const q = 1 + Math.floor(Math.random() * 2);
      total += f.price * q;
      items.push({ food: f, quantity: q, price: f.price });
    }
    const roll = Math.random();
    let status;
    if (roll < 0.6) status = 'delivered';
    else if (roll < 0.72) status = 'cancelled';
    else status = STATUSES[3 + Math.floor(Math.random() * 4)];
    const pm = PAYMENTS[Math.floor(Math.random() * PAYMENTS.length)];
    const dt = DELIVERY[Math.floor(Math.random() * DELIVERY.length)];
    const cust = CUSTOMERS[i % CUSTOMERS.length];
    const priority = roll < 0.2 ? 'high' : roll < 0.5 ? 'normal' : 'low';
    const order = {
      id: 2000 + i,
      items,
      total: Math.round(total),
      status,
      paymentMethod: pm,
      address: cust.addr,
      notes: roll > 0.8 ? 'Achchiq qiling' : '',
      createdAt: d.toISOString(),
      customerName: cust.name,
      customerPhone: cust.phone,
      priority,
      deliveryType: dt,
      courierId: status === 'delivered' ? (1 + Math.floor(Math.random() * 4)) : null,
      deliveredAt: status === 'delivered' ? new Date(d.getTime() + (15 + Math.floor(Math.random() * 30)) * 60000).toISOString() : null,
      pickedUpAt: ['pickedUp', 'onTheWay', 'delivered'].includes(status) ? new Date(d.getTime() + 10 * 60000).toISOString() : null,
    };
    list.push(order);
  }
  return list;
}

function demoOrdersToday(count) {
  const list = [];
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (let i = 0; i < count; i++) {
    const hour = 10 + Math.floor(Math.random() * 10);
    const minute = Math.floor(Math.random() * 60);
    const d = new Date(todayStart.getTime() + (hour * 3600 + minute * 60) * 1000 + Math.random() * 60000);
    const items = [];
    const n = 1 + Math.floor(Math.random() * 2);
    let total = 0;
    for (let j = 0; j < n; j++) {
      const f = DEMO.foods[Math.floor(Math.random() * DEMO.foods.length)];
      const q = 1 + Math.floor(Math.random() * 2);
      total += f.price * q;
      items.push({ food: f, quantity: q, price: f.price });
    }
    const roll = Math.random();
    const status = roll < 0.7 ? 'delivered' : roll < 0.85 ? 'pickedUp' : 'onTheWay';
    const pm = PAYMENTS[Math.floor(Math.random() * PAYMENTS.length)];
    const cust = CUSTOMERS[i % CUSTOMERS.length];
    list.push({
      id: 3000 + i,
      items,
      total: Math.round(total),
      status,
      paymentMethod: pm,
      address: cust.addr,
      notes: '',
      createdAt: d.toISOString(),
      customerName: cust.name,
      customerPhone: cust.phone,
      priority: 'normal',
      deliveryType: Math.random() < 0.7 ? 'delivery' : 'pickup',
      courierId: status === 'delivered' ? (1 + Math.floor(Math.random() * 4)) : null,
      deliveredAt: status === 'delivered' ? new Date(d.getTime() + 20 * 60000).toISOString() : null,
    });
  }
  return list;
}

function buildDemoSnapshot() {
  const orders = [...demoOrdersToday(14), ...demoOrders(28, 7)];
  const employees = [
    { id: 30, name: 'Admin', role: 'admin', phone: '+998777777777', rating: 5, isOnline: true },
    { id: 1, name: 'Akbar', role: 'courier', phone: '+998901112233', rating: 4.8, totalDeliveries: 312, isOnline: true },
    { id: 2, name: 'Sardor', role: 'courier', phone: '+998902223344', rating: 4.6, totalDeliveries: 198, isOnline: false },
    { id: 3, name: 'Otabek', role: 'seller', phone: '+998903334455', rating: 4.9, totalOrders: 1245, isOnline: true },
    { id: 4, name: 'Jamshid', role: 'seller', phone: '+998904445566', rating: 4.7, totalOrders: 980, isOnline: true },
  ];
  const banners = [{ id: 1, image: '/food/hotdog.svg', title: 'Hot-dog oddiy', subtitle: "12 000 so'mdan boshlab" }];
  return {
    foods: DEMO.foods,
    categories: DEMO.categories,
    restaurants: [{ id: 1, name: 'BEK FOOD Chinobod', coverImage: '/food/restaurant-cover.svg', logo: '/logo.png', cuisine: 'Hot-dog, Lavash, Burger, Doner', rating: 4.8, deliveryTime: '25-35', distance: 'Chinobod', minOrder: 0, isOpen: true, address: "Chinobod tumani, Oqtepa ko'chasi, 15", phone: '+998 90 123 45 67', workingHours: '10:00 - 23:00', coordinates: { lat: 41.2995, lng: 69.2401 } }],
    banners,
    promoCodes: DEMO.promotions,
    settings: DEMO.settings,
    inventory: DEMO.inventory,
    employees,
    branches: [{ id: 1, name: 'BEK FOOD Chinobod', coverImage: '/food/restaurant-cover.svg', logo: '/logo.png', cuisine: 'Hot-dog, Lavash, Burger, Doner', rating: 4.8, deliveryTime: '25-35', distance: 'Chinobod', minOrder: 0, isOpen: true, address: "Chinobod tumani, Oqtepa ko'chasi, 15", phone: '+998 90 123 45 67', workingHours: '10:00 - 23:00', coordinates: { lat: 41.2995, lng: 69.2401 } }],
    orders,
    addresses: [
      { id: 1, label: "Uy", fullAddress: "Chinobod, Oqtepa ko'chasi, 15", isDefault: true },
      { id: 2, label: "Ish", fullAddress: "Chinobod, Bog'ishamol ko'chasi, 8", isDefault: false },
    ],
    notifications: [
      { id: 1, title: 'Yangi buyurtma', message: '#3012 — 87 000 soʻm', time: new Date().toISOString(), isRead: false, type: 'order' },
      { id: 2, title: 'Tasdiqlandi', message: '#3001 buyurtmangiz tayyorlanmoqda', time: new Date(Date.now() - 600000).toISOString(), isRead: false, type: 'order' },
    ],
  };
}

function ensureDemoSnapshot() {
  ensureDb();
  const db = JSON.parse(readFileSync(DB_FILE, 'utf-8'));
  if (db.snapshot && Array.isArray(db.snapshot.orders) && db.snapshot.orders.length > 5) return;
  db.snapshot = buildDemoSnapshot();
  db.updatedAt = new Date().toISOString();
  writeFileSync(TMP_FILE, JSON.stringify(db, null, 2));
  renameSync(TMP_FILE, DB_FILE);
  broadcastSnapshot();
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

app.post('/api/admin/seed-demo', (_req, res) => {
  const db = readDb();
  db.snapshot = buildDemoSnapshot();
  db.updatedAt = new Date().toISOString();
  writeFileSync(TMP_FILE, JSON.stringify(db, null, 2));
  renameSync(TMP_FILE, DB_FILE);
  const a = analyze(db.snapshot);
  res.json({ ok: true, message: 'Demo ma\'lumotlar qo\'shildi', orders: a.summary.totalOrders, revenue: a.summary.totalRevenue });
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
