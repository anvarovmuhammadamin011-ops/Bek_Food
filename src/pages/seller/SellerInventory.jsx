import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Plus,
  Pencil,
  AlertTriangle,
  Check,
  Package,
  ArrowUp,
  ArrowDown,
  X,
  Search,
} from 'lucide-react';
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
  if (pct > 50) return 'var(--success)';
  if (pct >= 20) return 'var(--warning)';
  return 'var(--danger)';
}

function getStatusBadge(status) {
  if (status === 'critical') return { label: 'Tugadi', color: 'var(--danger)', bg: '#FEF2F2' };
  if (status === 'low') return { label: 'Kam qoldi', color: 'var(--warning)', bg: '#FFFBEB' };
  return { label: 'Yetarli', color: 'var(--success)', bg: '#F0FDF4' };
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
    setForm({
      name: item.name,
      quantity: String(item.quantity),
      unit: item.unit,
      minQuantity: String(item.minQuantity),
    });
    setModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.quantity || !form.minQuantity) return;
    const qty = Number(form.quantity);
    const min = Number(form.minQuantity);
    const data = {
      name: form.name,
      quantity: qty,
      unit: form.unit,
      minQuantity: min,
      status: getStatus(qty, min),
    };
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

  const s = {
    page: {
      minHeight: '100%',
      background: 'var(--bg)',
      paddingBottom: 100,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 16px 12px',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'var(--text)',
      transition: 'background 0.15s',
    },
    title: {
      fontSize: 20,
      fontWeight: 700,
      color: 'var(--text)',
      margin: 0,
      letterSpacing: '-0.01em',
    },
    addBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 14px',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--primary)',
      color: '#fff',
      border: 'none',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'opacity 0.15s',
    },
    searchWrap: {
      padding: '0 16px',
      marginBottom: 12,
    },
    searchInner: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    searchIcon: {
      position: 'absolute',
      left: 12,
      color: 'var(--text-muted)',
      pointerEvents: 'none',
    },
    searchInput: {
      width: '100%',
      padding: '10px 12px 10px 38px',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      color: 'var(--text)',
      fontSize: 13,
      outline: 'none',
      transition: 'border-color 0.15s',
      boxSizing: 'border-box',
    },
    filters: {
      display: 'flex',
      gap: 8,
      padding: '0 16px',
      marginBottom: 12,
    },
    filterBtn: (active) => ({
      padding: '6px 14px',
      borderRadius: 999,
      border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
      background: active ? 'var(--primary-light)' : 'var(--surface)',
      color: active ? 'var(--primary)' : 'var(--text-muted)',
      fontSize: 12,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.15s',
    }),
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 8,
      padding: '0 16px',
      marginBottom: 16,
    },
    statCard: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: '12px 8px',
      textAlign: 'center',
    },
    statValue: {
      fontSize: 18,
      fontWeight: 700,
      margin: '2px 0',
      fontVariantNumeric: 'tabular-nums',
    },
    statLabel: {
      fontSize: 10,
      fontWeight: 500,
      color: 'var(--text-muted)',
    },
    listWrap: {
      padding: '0 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    },
    emptyState: {
      textAlign: 'center',
      padding: '48px 16px',
      color: 'var(--text-muted)',
    },
    card: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 16,
      transition: 'border-color 0.15s',
    },
    cardTop: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    cardName: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text)',
      marginBottom: 4,
    },
    cardQty: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6,
    },
    qtyNum: {
      fontSize: 22,
      fontWeight: 700,
      color: 'var(--text)',
      fontVariantNumeric: 'tabular-nums',
    },
    qtyUnit: {
      fontSize: 12,
      color: 'var(--text-muted)',
      fontWeight: 500,
    },
    qtyMin: {
      fontSize: 11,
      color: 'var(--text-muted)',
    },
    editBtn: {
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      transition: 'background 0.15s',
      flexShrink: 0,
    },
    progressBar: {
      height: 4,
      borderRadius: 2,
      background: 'var(--surface-active)',
      overflow: 'hidden',
      marginBottom: 10,
    },
    progressFill: (pct, color) => ({
      height: '100%',
      width: `${pct}%`,
      borderRadius: 2,
      background: color,
      transition: 'width 0.6s ease',
    }),
    cardBottom: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardPct: {
      fontSize: 11,
      color: 'var(--text-muted)',
      fontWeight: 500,
    },
    adjustGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    adjBtn: {
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'background 0.15s',
    },
    adjQty: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text)',
      minWidth: 24,
      textAlign: 'center',
      fontVariantNumeric: 'tabular-nums',
    },
    overlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 100,
    },
    sheet: {
      width: '100%',
      maxWidth: 480,
      background: 'var(--surface)',
      borderRadius: 'var(--radius) var(--radius) 0 0',
      padding: '24px 20px',
      border: '1px solid var(--border)',
      maxHeight: '80vh',
      overflowY: 'auto',
    },
    sheetHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    sheetTitle: {
      fontSize: 18,
      fontWeight: 700,
      color: 'var(--text)',
      margin: 0,
    },
    sheetClose: {
      width: 28,
      height: 28,
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'var(--text-muted)',
    },
    fieldGroup: {
      marginBottom: 14,
    },
    fieldLabel: {
      display: 'block',
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text-secondary)',
      marginBottom: 6,
    },
    fieldRow: {
      display: 'flex',
      gap: 10,
    },
    fieldInput: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border)',
      background: 'var(--bg)',
      color: 'var(--text)',
      fontSize: 13,
      outline: 'none',
      transition: 'border-color 0.15s',
      boxSizing: 'border-box',
    },
    fieldSelect: {
      width: 110,
      padding: '10px 12px',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border)',
      background: 'var(--bg)',
      color: 'var(--text)',
      fontSize: 13,
      outline: 'none',
      transition: 'border-color 0.15s',
      boxSizing: 'border-box',
      appearance: 'auto',
    },
    saveBtn: {
      width: '100%',
      padding: '12px',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--primary)',
      color: '#fff',
      border: 'none',
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      marginTop: 8,
      transition: 'opacity 0.15s',
    },
  };

  return (
    <div style={s.page}>
      {hasCritical && (
        <div
          style={{
            margin: '12px 16px 0',
            padding: '10px 14px',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <AlertTriangle size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />
          <span style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 600 }}>
            {criticalCount} ta mahsulot tugadi — zaxirani to'ldiring!
          </span>
        </div>
      )}

      <div style={s.header}>
        <div style={s.headerLeft}>
          <button onClick={() => navigate(-1)} style={s.backBtn}>
            <ChevronLeft size={18} />
          </button>
          <h1 style={s.title}>Inventarizatsiya</h1>
        </div>
        <button onClick={openAdd} style={s.addBtn}>
          <Plus size={14} /> Yangi
        </button>
      </div>

      <div style={s.searchWrap}>
        <div style={s.searchInner}>
          <Search size={15} style={s.searchIcon} />
          <input
            style={s.searchInput}
            placeholder="Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={s.filters}>
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={s.filterBtn(filter === f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={s.statsGrid}>
        <div style={s.statCard}>
          <Package size={14} style={{ color: 'var(--text-muted)' }} />
          <div style={{ ...s.statValue, color: 'var(--text)' }}>{totalItems}</div>
          <div style={s.statLabel}>Jami</div>
        </div>
        <div style={s.statCard}>
          <AlertTriangle size={14} style={{ color: 'var(--warning)' }} />
          <div style={{ ...s.statValue, color: 'var(--warning)' }}>{lowCount}</div>
          <div style={s.statLabel}>Kam qoldi</div>
        </div>
        <div style={s.statCard}>
          <AlertTriangle size={14} style={{ color: 'var(--danger)' }} />
          <div style={{ ...s.statValue, color: 'var(--danger)' }}>{criticalCount}</div>
          <div style={s.statLabel}>Tugadi</div>
        </div>
        <div style={s.statCard}>
          <Check size={14} style={{ color: 'var(--success)' }} />
          <div style={{ ...s.statValue, color: 'var(--success)' }}>{okCount}</div>
          <div style={s.statLabel}>Yetarli</div>
        </div>
      </div>

      <div style={s.listWrap}>
        {filtered.length === 0 && (
          <div style={s.emptyState}>
            <Package size={28} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
            <h3 style={{ color: 'var(--text)', fontWeight: 500, fontSize: 14, marginBottom: 4 }}>
              {search ? 'Topilmadi' : "Ombor bo'sh"}
            </h3>
            <p style={{ fontSize: 12 }}>
              {search ? "Boshqa so'z bilan qidiring" : 'Mahsulot qo\'shing'}
            </p>
          </div>
        )}

        {filtered.map((item) => {
          const badge = getStatusBadge(item.status);
          const pct = getProgressPercent(item.quantity, item.minQuantity);
          const barColor = getProgressColor(item.quantity, item.minQuantity);

          return (
            <div key={item.id} style={s.card}>
              <div style={s.cardTop}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={s.cardName}>{item.name}</span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: badge.bg,
                        color: badge.color,
                      }}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <div style={s.cardQty}>
                    <span style={s.qtyNum}>{item.quantity}</span>
                    <span style={s.qtyUnit}>{item.unit}</span>
                    <span style={s.qtyMin}>min: {item.minQuantity} {item.unit}</span>
                  </div>
                </div>
                <button onClick={() => openEdit(item)} style={s.editBtn}>
                  <Pencil size={13} />
                </button>
              </div>

              <div style={s.progressBar}>
                <div style={s.progressFill(pct, barColor)} />
              </div>

              <div style={s.cardBottom}>
                <span style={s.cardPct}>
                  {pct}% · {item.unit === 'dona' ? 'dona' : item.unit === 'liter' ? 'litr' : 'kg'}
                </span>
                <div style={s.adjustGroup}>
                  <button onClick={() => adjustQty(item.id, -1)} style={s.adjBtn}>
                    <ArrowDown size={14} style={{ color: 'var(--danger)' }} />
                  </button>
                  <span style={s.adjQty}>{item.quantity}</span>
                  <button onClick={() => adjustQty(item.id, 1)} style={s.adjBtn}>
                    <ArrowUp size={14} style={{ color: 'var(--success)' }} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <div style={s.overlay} onClick={() => setModal(false)}>
          <div style={s.sheet} onClick={(e) => e.stopPropagation()}>
            <div style={s.sheetHeader}>
              <h2 style={s.sheetTitle}>{editItem ? 'Tahrirlash' : 'Yangi mahsulot'}</h2>
              <button onClick={() => setModal(false)} style={s.sheetClose}>
                <X size={16} />
              </button>
            </div>

            <div>
              <div style={s.fieldGroup}>
                <label style={s.fieldLabel}>Nomi</label>
                <input
                  style={s.fieldInput}
                  placeholder="Mahsulot nomi"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div style={s.fieldRow}>
                <div style={{ ...s.fieldGroup, flex: 1 }}>
                  <label style={s.fieldLabel}>Miqdor</label>
                  <input
                    style={s.fieldInput}
                    type="number"
                    placeholder="0"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  />
                </div>
                <div style={{ ...s.fieldGroup, width: 110 }}>
                  <label style={s.fieldLabel}>O'lchov</label>
                  <select
                    style={s.fieldSelect}
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={s.fieldGroup}>
                <label style={s.fieldLabel}>Min. miqdor</label>
                <input
                  style={s.fieldInput}
                  type="number"
                  placeholder="Eng kam miqdor"
                  value={form.minQuantity}
                  onChange={(e) => setForm({ ...form, minQuantity: e.target.value })}
                />
              </div>

              <button onClick={handleSave} style={s.saveBtn}>
                {editItem ? 'Saqlash' : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
