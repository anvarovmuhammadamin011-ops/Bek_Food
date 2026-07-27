import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Edit, AlertTriangle, Check, Package, ArrowUp, ArrowDown, X, Search } from 'lucide-react';
import useStore from '../../store/useStore';

const UNITS = ['kg', 'dona', 'liter'];

function getStatus(quantity, minQuantity) {
  if (quantity <= 0) return 'critical';
  if (quantity <= minQuantity * 0.5) return 'low';
  return 'ok';
}

function getProgressPercent(quantity, minQuantity) {
  const target = minQuantity * 3;
  return Math.min(100, Math.round((quantity / target) * 100));
}

function getProgressColor(quantity, minQuantity) {
  const pct = getProgressPercent(quantity, minQuantity);
  if (pct > 50) return '#7fbf7f';
  if (pct >= 20) return '#eab308';
  return '#e51e1e';
}

function getStatusBadge(status) {
  if (status === 'critical') return { label: 'Tugadi', cls: 'badge badge-red' };
  if (status === 'low') return { label: 'Kam qoldi', cls: 'badge badge-yellow' };
  return { label: 'Yetarli', cls: 'badge badge-green' };
}

export default function SellerInventory() {
  const navigate = useNavigate();
  const { inventory, addInventory, updateInventory } = useStore();

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', quantity: '', unit: 'kg', minQuantity: '' });

  const enriched = inventory.map((item) => ({
    ...item,
    status: item.status || getStatus(item.quantity, item.minQuantity),
  }));

  const filtered = enriched.filter((item) => {
    if (filter === 'low' && item.status !== 'low') return false;
    if (filter === 'critical' && item.status !== 'critical') return false;
    if (filter === 'ok' && item.status !== 'ok') return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalItems = enriched.length;
  const lowCount = enriched.filter((i) => i.status === 'low').length;
  const criticalCount = enriched.filter((i) => i.status === 'critical').length;
  const okCount = enriched.filter((i) => i.status === 'ok').length;
  const hasCritical = criticalCount > 0;

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: '', quantity: '', unit: 'kg', minQuantity: '' });
    setModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, quantity: String(item.quantity), unit: item.unit, minQuantity: String(item.minQuantity) });
    setModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.quantity || !form.minQuantity) return;
    const qty = Number(form.quantity);
    const min = Number(form.minQuantity);
    const data = { name: form.name, quantity: qty, unit: form.unit, minQuantity: min, status: getStatus(qty, min) };
    if (editItem) {
      updateInventory(editItem.id, data);
    } else {
      addInventory(data);
    }
    setModal(false);
  };

  const adjustQty = (id, delta) => {
    const item = enriched.find((i) => i.id === id);
    if (!item) return;
    const newQty = Math.max(0, item.quantity + delta);
    updateInventory(id, { quantity: newQty, status: getStatus(newQty, item.minQuantity) });
  };

  const filters = [
    { key: 'all', label: 'Hammasi' },
    { key: 'low', label: 'Kam qoldi' },
    { key: 'critical', label: 'Tugadi' },
  ];

  return (
    <div className="h-full overflow-y-auto scrollbar-hide animate-fade-in" style={{ paddingBottom: 80 }}>
      {hasCritical && (
        <div
          className="flex items-center gap-3 animate-fade-in-down"
          style={{
            margin: '12px 16px 0',
            padding: '12px 14px',
            background: 'rgba(229,30,30,.1)',
            border: '1px solid rgba(229,30,30,.25)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <AlertTriangle size={18} style={{ color: '#e51e1e', flexShrink: 0 }} />
          <span style={{ color: '#e51e1e', fontSize: 13, fontWeight: 600 }}>
            {criticalCount} ta mahsulot tugadi — zaxirani to'ldiring!
          </span>
        </div>
      )}

      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-icon"
            style={{ minWidth: 36, minHeight: 36, padding: 6 }}
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="heading">Inventarizatsiya</h1>
        </div>
        <button onClick={openAdd} className="btn btn-primary btn-sm flex items-center gap-1">
          <Plus size={14} /> Yangi mahsulot
        </button>
      </div>

      <div className="px-4 mb-3">
        <div className="input-group">
          <span className="input-group-icon"><Search size={14} /></span>
          <input
            className="input"
            placeholder="Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 40, minHeight: 40, fontSize: 13, borderRadius: 'var(--radius-sm)' }}
          />
        </div>
      </div>

      <div className="px-4 mb-3 flex gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="btn btn-xs"
            style={{
              background: filter === f.key ? 'var(--red)' : 'var(--surface)',
              color: filter === f.key ? '#fff' : 'var(--text-muted)',
              border: `1px solid ${filter === f.key ? 'var(--red)' : 'var(--border)'}`,
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="px-4 mb-4 grid grid-cols-4 gap-2 stagger">
        <div className="card p-3" style={{ textAlign: 'center' }}>
          <Package size={16} style={{ color: 'var(--text-muted)', margin: '0 auto 4px' }} />
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{totalItems}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 500 }}>Jami</div>
        </div>
        <div className="card p-3" style={{ textAlign: 'center' }}>
          <AlertTriangle size={16} style={{ color: 'var(--yellow)', margin: '0 auto 4px' }} />
          <div style={{ color: 'var(--yellow)', fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{lowCount}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 500 }}>Kam qoldi</div>
        </div>
        <div className="card p-3" style={{ textAlign: 'center' }}>
          <AlertTriangle size={16} style={{ color: 'var(--red)', margin: '0 auto 4px' }} />
          <div style={{ color: 'var(--red)', fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{criticalCount}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 500 }}>Tugadi</div>
        </div>
        <div className="card p-3" style={{ textAlign: 'center' }}>
          <Check size={16} style={{ color: 'var(--green)', margin: '0 auto 4px' }} />
          <div style={{ color: 'var(--green)', fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{okCount}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 500 }}>Yetarli</div>
        </div>
      </div>

      <div className="px-4 space-y-3 stagger">
        {filtered.length === 0 && (
          <div className="empty-state py-16">
            <div className="empty-state-icon"><Package size={20} /></div>
            <h3 style={{ color: '#fff', fontWeight: 500, marginBottom: 4 }}>
              {search ? 'Topilmadi' : 'Ombor bo\'sh'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
              {search ? 'Boshqa so\'z bilan qidiring' : 'Mahsulot qo\'shing'}
            </p>
          </div>
        )}

        {filtered.map((item) => {
          const badge = getStatusBadge(item.status);
          const pct = getProgressPercent(item.quantity, item.minQuantity);
          const barColor = getProgressColor(item.quantity, item.minQuantity);

          return (
            <div key={item.id} className="card p-4 animate-fade-in-up">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{item.name}</span>
                    <span className={badge.cls} style={{ fontSize: 10, padding: '2px 7px' }}>{badge.label}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span style={{ color: '#fff', fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                      {item.quantity}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{item.unit}</span>
                    <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>· min: {item.minQuantity} {item.unit}</span>
                  </div>
                </div>
                <button
                  onClick={() => openEdit(item)}
                  className="btn btn-ghost"
                  style={{ padding: 6, minWidth: 32, minHeight: 32 }}
                >
                  <Edit size={14} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>

              <div className="progress-bar mb-3" style={{ height: 4 }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${pct}%`,
                    background: barColor,
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>
                  {pct}% · {item.unit === 'dona' ? 'dona' : item.unit === 'liter' ? 'litr' : 'kg'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustQty(item.id, -1)}
                    className="btn btn-ghost"
                    style={{
                      minWidth: 32,
                      minHeight: 32,
                      padding: 0,
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--surface-hover)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ArrowDown size={14} style={{ color: 'var(--red)' }} />
                  </button>
                  <span style={{ color: '#fff', fontSize: 14, fontWeight: 600, minWidth: 28, textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => adjustQty(item.id, 1)}
                    className="btn btn-ghost"
                    style={{
                      minWidth: 32,
                      minHeight: 32,
                      padding: 0,
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--surface-hover)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ArrowUp size={14} style={{ color: 'var(--green)' }} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <div
          className="fixed inset-0 flex items-end justify-center animate-fade-in"
          style={{ background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(8px)', zIndex: 100 }}
          onClick={() => setModal(false)}
        >
          <div
            className="card animate-slide-up"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 480,
              padding: '24px 20px',
              borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
              background: 'var(--bg-soft)',
              border: '1px solid var(--border-strong)',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 600 }}>
                {editItem ? 'Tahrirlash' : 'Yangi mahsulot'}
              </h2>
              <button onClick={() => setModal(false)} className="btn btn-ghost" style={{ padding: 4, minWidth: 28, minHeight: 28 }}>
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label style={{ color: 'var(--text-sec)', fontSize: 12, fontWeight: 500, marginBottom: 4, display: 'block' }}>
                  Nomi
                </label>
                <input
                  className="input"
                  placeholder="Mahsulot nomi"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="flex gap-3">
                <div style={{ flex: 1 }}>
                  <label style={{ color: 'var(--text-sec)', fontSize: 12, fontWeight: 500, marginBottom: 4, display: 'block' }}>
                    Miqdor
                  </label>
                  <input
                    className="input"
                    type="number"
                    placeholder="0"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  />
                </div>
                <div style={{ width: 110 }}>
                  <label style={{ color: 'var(--text-sec)', fontSize: 12, fontWeight: 500, marginBottom: 4, display: 'block' }}>
                    O'lchov birligi
                  </label>
                  <select
                    className="input"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    style={{ minHeight: 48 }}
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ color: 'var(--text-sec)', fontSize: 12, fontWeight: 500, marginBottom: 4, display: 'block' }}>
                  Min. miqdor
                </label>
                <input
                  className="input"
                  type="number"
                  placeholder="Eng kam miqdor"
                  value={form.minQuantity}
                  onChange={(e) => setForm({ ...form, minQuantity: e.target.value })}
                />
              </div>

              <button
                onClick={handleSave}
                className="btn btn-primary w-full mt-2"
                style={{ borderRadius: 'var(--radius)' }}
              >
                {editItem ? 'Saqlash' : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
