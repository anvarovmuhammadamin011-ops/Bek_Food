import express from 'express';
import { createHash, randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, existsSync, renameSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8081;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const TMP_FILE = path.join(DATA_DIR, 'db.tmp.json');

const app = express();
app.use(express.json({ limit: '20mb' }));

function ensureDb() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(DB_FILE)) {
    writeFileSync(DB_FILE, JSON.stringify({ snapshot: null, users: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, null, 2), 'utf-8');
  }
}

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
  writeFileSync(TMP_FILE, JSON.stringify(db, null, 2), 'utf-8');
  renameSync(TMP_FILE, DB_FILE);
}

const hash = (pw) => createHash('sha256').update(String(pw || '')).digest('hex');
const sessions = new Map();

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
      email: '',
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

// ---------- Static (production build) ----------
const DIST = path.join(__dirname, '..', 'dist');
if (existsSync(DIST)) {
  app.use(express.static(DIST));
  app.get(/^\/(?!api\/).*/, (_req, res) => res.sendFile(path.join(DIST, 'index.html')));
} else {
  app.get('/', (_req, res) => res.json({ ok: true, message: 'BEK FOOD API ishlayapti. Frontend build qilinmagan: npm run build' }));
}

app.listen(PORT, () => {
  console.log(`BEK FOOD API  http://localhost:${PORT}`);
  ensureDb();
});