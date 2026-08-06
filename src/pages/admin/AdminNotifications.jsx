import { useState, useEffect } from 'react';
import { Bell, BellRing, CheckCheck, Trash2, Package, Truck, TrendingUp, Users, AlertTriangle, Wallet } from 'lucide-react';

const s = {
  page: { padding: '24px 16px 32px', background: 'var(--bg)', minHeight: '100vh' },
  container: { maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' },
  title: { fontSize: '26px', fontWeight: '800', color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' },
  btnGhost: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', cursor: 'pointer', fontSize: '14px', fontWeight: '600', background: 'var(--surface)', color: 'var(--text)', fontFamily: 'inherit', minHeight: '44px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  item: { display: 'flex', gap: '14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px', alignItems: 'flex-start' },
  itemUnread: { borderColor: 'var(--primary)', borderLeft: '3px solid var(--primary)' },
  itemRead: { opacity: 0.75 },
  icon: { width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  dot: { width: 8, height: 8, borderRadius: 999, background: 'var(--primary)', display: 'inline-block', marginLeft: 8 },
  time: { fontSize: 12, color: 'var(--text-muted)' },
};

const STORAGE_KEY = 'bekfood_notifications_v1';
const INVENTORY_KEY = 'bekfood_inventory_v1';
const PURCHASES_KEY = 'bekfood_purchases_v1';
const EXPENSES_KEY = 'bekfood_expenses_v1';

const iconMap = {
  inventory: { Icon: Package, color: 'var(--primary)' },
  purchase: { Icon: Truck, color: 'var(--success)' },
  sale: { Icon: TrendingUp, color: 'var(--warning)' },
  employee: { Icon: Users, color: 'var(--text-secondary)' },
  warn: { Icon: AlertTriangle, color: 'var(--danger)' },
  expense: { Icon: Wallet, color: 'var(--danger)' },
};

function buildSeed() {
  const inv = (() => { try { return JSON.parse(localStorage.getItem(INVENTORY_KEY) || '[]'); } catch { return []; } })();
  const pur = (() => { try { return JSON.parse(localStorage.getItem(PURCHASES_KEY) || '[]'); } catch { return []; } })();
  const exp = (() => { try { return JSON.parse(localStorage.getItem(EXPENSES_KEY) || '[]'); } catch { return []; } })();
  const out = [];

  inv.forEach((i) => {
    if (Number(i.qty) <= Number(i.minQty || 0)) {
      out.push({ id: 'low_' + i.id, type: 'warn', title: `Kam qolmoqda: ${i.name}`, body: `Zaxirada atigi ${i.qty} ${i.unit} qoldi. Minimal: ${i.minQty} ${i.unit}`, time: new Date().toISOString().slice(0, 10), read: false });
    }
    if (i.expire && i.expire <= new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)) {
      out.push({ id: 'exp_' + i.id, type: 'warn', title: `Yaroqlilik muddati: ${i.name}`, body: `Mahsulotning yaroqlilik muddati ${i.expire} da tugaydi`, time: new Date().toISOString().slice(0, 10), read: false });
    }
  });
  pur.filter((p) => p.status !== 'qabul_qilindi').forEach((p) => {
    out.push({ id: 'pur_' + p.id, type: 'purchase', title: `Xarid kutilmoqda: ${p.product}`, body: `${p.supplier || 'Ta\'minotchi'} dan ${p.qty} ${p.unit} — ${p.status === 'yolda' ? "yo'lda" : 'buyurtma berildi'}`, time: p.date, read: false });
  });
  exp.forEach((e) => {
    out.push({ id: 'exp2_' + e.id, type: 'expense', title: `Yangi xarajat: ${e.label || 'Xarajat'}`, body: `${Number(e.amount).toLocaleString()} so'm`, time: e.date, read: false });
  });
  return out.slice(0, 12);
}

export default function AdminNotifications() {
  const [items, setItems] = useState(() => { try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch { /* noop */ } return buildSeed(); });

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items]);

  const unread = items.filter((i) => !i.read).length;

  const markAll = () => setItems(items.map((i) => ({ ...i, read: true })));
  const markOne = (id) => setItems(items.map((i) => (i.id === id ? { ...i, read: true } : i)));
  const removeOne = (id) => setItems(items.filter((i) => i.id !== id));
  const removeAll = () => setItems([]);

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Bildirishnomalar (Notifications)</h1>
            <p style={s.subtitle}>Kam zaxira, muddat va yangi xaridlar haqida ogohlantirishlar</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={markAll} style={s.btnGhost}><CheckCheck size={15} /> Barchasi o'qildi</button>
            <button onClick={removeAll} style={{ ...s.btnGhost, color: 'var(--danger)' }}><Trash2 size={15} /> Tozalash</button>
          </div>
        </div>

        {unread > 0 && (
          <div style={{ ...s.item, background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.25)', marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BellRing size={18} color="var(--danger)" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{unread} ta o'qilmagan bildirishnoma</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Zaxiradagi muammolarni ko'rib chiqing</div>
            </div>
          </div>
        )}

        <div style={s.list}>
          {items.length === 0 && (
            <div style={{ ...s.item, justifyContent: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <Bell size={20} /> Bildirishnomalar yo'q
            </div>
          )}
          {items.map((it) => {
            const meta = iconMap[it.type] || { Icon: Bell, color: 'var(--text-muted)' };
            const Icon = meta.Icon;
            return (
              <div key={it.id} onClick={() => markOne(it.id)} style={{ ...s.item, ...(it.read ? s.itemRead : s.itemUnread), cursor: 'pointer' }}>
                <div style={{ ...s.icon, background: meta.color + '14' }}><Icon size={18} color={meta.color} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                    {it.title}
                    {!it.read && <span style={s.dot} />}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>{it.body}</div>
                  <div style={s.time}>{it.time}</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); removeOne(it.id); }} style={{ border: 'none', background: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}><Trash2 size={15} /></button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}