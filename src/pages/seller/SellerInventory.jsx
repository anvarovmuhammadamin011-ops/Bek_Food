import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatPrice } from '../../utils/cn';

import {
  ChevronLeft, Plus, Pencil, AlertTriangle, Check, Package,
  ArrowUp, ArrowDown, X, Search, Home, ShoppingBag, UtensilsCrossed, BarChart3, Settings
} from 'lucide-react';

const UNITS = ['kg', 'dona', 'liter'];

function getStatus(quantity, minQuantity) {
  if (quantity <= 0) return 'critical';
  if (quantity <= minQuantity * 0.5) return 'low';
  return 'ok';
}

function getStatusBadge(status) {
  if (status === 'critical') return { label: 'Tugadi', variant: 'danger' };
  if (status === 'low') return { label: 'Kam qoldi', variant: 'warning' };
  return { label: 'Yetarli', variant: 'success' };
}

export default function SellerInventory() {
  const navigate = useNavigate();
  const { inventory, addInventory, updateInventory } = useStore();

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', quantity: '', unit: 'kg', minQuantity: '' });

  const enriched = inventory.map(item => ({
    ...item,
    status: item.status || getStatus(item.quantity, item.minQuantity),
  }));

  const filtered = enriched.filter(item => {
    if (filter !== 'all' && item.status !== filter) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalItems = enriched.length;
  const lowCount = enriched.filter(i => i.status === 'low').length;
  const criticalCount = enriched.filter(i => i.status === 'critical').length;
  const okCount = enriched.filter(i => i.status === 'ok').length;
  const hasCritical = criticalCount > 0;

  const openAdd = () => { setEditItem(null); setForm({ name: '', quantity: '', unit: 'kg', minQuantity: '' }); setModal(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ name: item.name, quantity: String(item.quantity), unit: item.unit, minQuantity: String(item.minQuantity) }); setModal(true); };

  const handleSave = () => {
    if (!form.name || !form.quantity || !form.minQuantity) return;
    const qty = Number(form.quantity);
    const min = Number(form.minQuantity);
    const data = { name: form.name, quantity: qty, unit: form.unit, minQuantity: min, status: getStatus(qty, min) };
    if (editItem) updateInventory(editItem.id, data);
    else addInventory(data);
    setModal(false);
  };

  const adjustQty = (id, delta) => {
    const item = enriched.find(i => i.id === id);
    if (!item) return;
    const newQty = Math.max(0, item.quantity + delta);
    updateInventory(id, { quantity: newQty, status: getStatus(newQty, item.minQuantity) });
  };

  const filters = [
    { key: 'all', label: 'Hammasi' },
    { key: 'low', label: 'Kam qoldi' },
    { key: 'critical', label: 'Tugadi' },
  ];

  const navItems = [
    { label: 'KDS', icon: Home, path: '/seller' },
    { label: 'Buyurtmalar', icon: ShoppingBag, path: '/seller/orders' },
    { label: 'Menyu', icon: UtensilsCrossed, path: '/seller/menu' },
    { label: 'Statistika', icon: BarChart3, path: '/seller/analytics' },
    { label: 'Sozlamalar', icon: Settings, path: '/seller/settings' },
  ];

  return (
    <div className="min-h-full bg-bg pb-24">
      {hasCritical && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-3 px-3.5 py-2.5 bg-danger/5 border border-danger/20 rounded-xl flex items-center gap-2.5"
        >
          <AlertTriangle size={16} className="text-danger flex-shrink-0" />
          <span className="text-xs font-semibold text-danger">{criticalCount} ta mahsulot tugadi — zaxirani to'ldiring!</span>
        </motion.div>
      )}

      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-borderStrong transition-all">
              <ChevronLeft size={18} className="text-text" />
            </button>
            <h1 className="text-lg font-bold text-text">Inventarizatsiya</h1>
          </div>
          <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl shadow-primary hover:brightness-110 active:scale-[0.97] transition-all text-sm">
            <Plus size={16} /> Yangi
          </button>
        </div>

        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
          <input className="w-full pl-9 pr-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-text outline-none transition-all focus:border-primary/40" placeholder="Qidirish..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="flex gap-2 mb-3">
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={cn('px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all',
                filter === f.key ? 'bg-primary text-white border-primary' : 'bg-surface text-textMuted border-border hover:border-borderStrong'
              )}
            >{f.label}</button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="bg-surface border border-border rounded-xl p-2.5 text-center">
            <Package size={14} className="mx-auto text-textMuted mb-1" />
            <p className="text-lg font-extrabold text-text tabular-nums">{totalItems}</p>
            <p className="text-[10px] text-textMuted font-medium">Jami</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-2.5 text-center">
            <AlertTriangle size={14} className="mx-auto text-warning mb-1" />
            <p className="text-lg font-extrabold text-warning tabular-nums">{lowCount}</p>
            <p className="text-[10px] text-textMuted font-medium">Kam</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-2.5 text-center">
            <AlertTriangle size={14} className="mx-auto text-danger mb-1" />
            <p className="text-lg font-extrabold text-danger tabular-nums">{criticalCount}</p>
            <p className="text-[10px] text-textMuted font-medium">Tugadi</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-2.5 text-center">
            <Check size={14} className="mx-auto text-success mb-1" />
            <p className="text-lg font-extrabold text-success tabular-nums">{okCount}</p>
            <p className="text-[10px] text-textMuted font-medium">Yetarli</p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-surface border border-border rounded-2xl p-10 text-center">
            <Package size={48} className="mx-auto mb-3 text-borderStrong" />
            <p className="font-bold text-text">{search ? 'Topilmadi' : "Ombor bo'sh"}</p>
            <p className="text-sm text-textMuted mt-1">{search ? "Boshqa so'z bilan qidiring" : 'Mahsulot qo\'shing'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(item => {
              const badge = getStatusBadge(item.status);
              const pct = Math.min(100, Math.round((item.quantity / (item.minQuantity * 3)) * 100));
              const barColor = pct > 50 ? 'bg-success' : pct >= 20 ? 'bg-warning' : 'bg-danger';

              return (
                <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-surface border border-border rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-text">{item.name}</span>
                        <Badge variant={badge.variant} size="xs">{badge.label}</Badge>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-text tabular-nums">{item.quantity}</span>
                        <span className="text-sm text-textMuted">{item.unit}</span>
                        <span className="text-xs text-textMuted">min: {item.minQuantity} {item.unit}</span>
                      </div>
                    </div>
                    <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-xl border border-border bg-surface flex items-center justify-center hover:border-borderStrong transition-all">
                      <Pencil size={13} className="text-textMuted" />
                    </button>
                  </div>

                  <div className="h-1.5 rounded-full bg-surfaceActive overflow-hidden mb-3">
                    <div className={cn('h-full rounded-full transition-all duration-500', barColor)} style={{ width: `${pct}%` }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-textMuted">{pct}%</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => adjustQty(item.id, -1)} className="w-8 h-8 rounded-xl border border-border flex items-center justify-center hover:bg-danger/5 hover:border-danger/20 transition-all">
                        <ArrowDown size={14} className="text-danger" />
                      </button>
                      <span className="text-base font-bold text-text tabular-nums min-w-[24px] text-center">{item.quantity}</span>
                      <button onClick={() => adjustQty(item.id, 1)} className="w-8 h-8 rounded-xl border border-border flex items-center justify-center hover:bg-success/5 hover:border-success/20 transition-all">
                        <ArrowUp size={14} className="text-success" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(false)} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-surface rounded-t-3xl border border-border shadow-lg max-h-[80vh] overflow-y-auto"
            >
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-bold text-text">{editItem ? 'Tahrirlash' : 'Yangi mahsulot'}</h2>
                <button onClick={() => setModal(false)} className="w-8 h-8 rounded-xl bg-surfaceHover border border-border flex items-center justify-center"><X size={16} className="text-textMuted" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-textSecondary mb-1.5">Nomi</label>
                  <input className="w-full px-3.5 py-2.5 bg-surfaceHover border border-border rounded-xl text-sm text-text outline-none focus:border-primary/40 transition-all" placeholder="Mahsulot nomi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-textSecondary mb-1.5">Miqdor</label>
                    <input className="w-full px-3.5 py-2.5 bg-surfaceHover border border-border rounded-xl text-sm text-text outline-none focus:border-primary/40 transition-all" type="number" placeholder="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                  </div>
                  <div className="w-28">
                    <label className="block text-xs font-semibold text-textSecondary mb-1.5">O'lchov</label>
                    <select className="w-full px-3.5 py-2.5 bg-surfaceHover border border-border rounded-xl text-sm text-text outline-none focus:border-primary/40 transition-all appearance-none" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-textSecondary mb-1.5">Min. miqdor</label>
                  <input className="w-full px-3.5 py-2.5 bg-surfaceHover border border-border rounded-xl text-sm text-text outline-none focus:border-primary/40 transition-all" type="number" placeholder="Eng kam miqdor" value={form.minQuantity} onChange={(e) => setForm({ ...form, minQuantity: e.target.value })} />
                </div>
                <button onClick={handleSave} className="w-full py-3 rounded-xl bg-primary text-white font-semibold shadow-primary hover:brightness-110 transition-all text-sm">
                  {editItem ? 'Saqlash' : "Qo'shish"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
          {navItems.map((item) => (
            <button key={item.path} onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full border-none bg-transparent cursor-pointer transition-all"
              style={{ color: 'var(--text-muted)' }}
            >
              <item.icon size={22} strokeWidth={1.8} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}