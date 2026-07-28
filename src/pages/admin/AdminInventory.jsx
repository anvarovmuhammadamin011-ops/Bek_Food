import React, { useState } from 'react';
import useStore from '../../store/useStore';
import {
  Plus,
  Edit,
  AlertTriangle,
  Package,
  Truck,
  Calendar,
  ArrowUp,
  ArrowDown,
  Search,
  X,
  Minus
} from 'lucide-react';

const categories = ['Hammasi', "Go'sht", 'Non', 'Sous', 'Sabzavot', 'Ichimlik'];
const units = ['kg', 'dona', 'litr', 'pachka', 'quti'];

const defaultInventory = [
  { id: 1, name: "Mol go'shti", category: "Go'sht", quantity: 25, unit: 'kg', minQuantity: 10, supplier: "Toshkent Go'sht", expiryDate: '2026-08-15' },
  { id: 2, name: "Qo'y go'shti", category: "Go'sht", quantity: 3, unit: 'kg', minQuantity: 8, supplier: 'Samarqand Fermer', expiryDate: '2026-08-10' },
  { id: 3, name: 'Non', category: 'Non', quantity: 50, unit: 'dona', minQuantity: 20, supplier: 'Nonvoy Usti', expiryDate: '2026-07-30' },
  { id: 4, name: 'Lavash', category: 'Non', quantity: 15, unit: 'dona', minQuantity: 10, supplier: 'Nonvoy Usti', expiryDate: '2026-07-29' },
  { id: 5, name: 'Ketchup', category: 'Sous', quantity: 12, unit: 'litr', minQuantity: 5, supplier: 'Oziq-ovqat', expiryDate: '2026-12-01' },
  { id: 6, name: 'Mayonez', category: 'Sous', quantity: 0, unit: 'litr', minQuantity: 5, supplier: 'Oziq-ovqat', expiryDate: '2026-11-15' },
  { id: 7, name: 'Pomidor', category: 'Sabzavot', quantity: 18, unit: 'kg', minQuantity: 8, supplier: "Bog'dod Bozori", expiryDate: '2026-08-05' },
  { id: 8, name: 'Cola', category: 'Ichimlik', quantity: 30, unit: 'dona', minQuantity: 15, supplier: 'Imzo', expiryDate: '2027-01-20' },
];

function getStatus(quantity, minQuantity) {
  if (quantity === 0) return 'Tugadi';
  if (quantity <= minQuantity) return 'Kam qoldi';
  return 'Yetarli';
}

function getStatusColor(status) {
  if (status === 'Yetarli') return 'var(--success)';
  if (status === 'Kam qoldi') return 'var(--warning)';
  return 'var(--danger)';
}

function getCategoryBadgeStyle(cat) {
  const map = {
    "Go'sht": { bg: 'rgba(239,68,68,0.08)', color: 'var(--danger)' },
    'Non': { bg: 'rgba(245,158,11,0.08)', color: 'var(--warning)' },
    'Sous': { bg: 'rgba(139,92,246,0.08)', color: '#8B5CF6' },
    'Sabzavot': { bg: 'rgba(34,197,94,0.08)', color: 'var(--success)' },
    'Ichimlik': { bg: 'rgba(59,130,246,0.08)', color: '#3B82F6' },
  };
  return map[cat] || { bg: 'var(--surface-active)', color: 'var(--text-muted)' };
}

const s = {
  page: {
    padding: '0 0 40px',
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text)',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchBox: {
    position: 'relative',
  },
  searchInput: {
    padding: '10px 14px 10px 40px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontSize: '14px',
    outline: 'none',
    width: '260px',
    transition: 'border-color 0.2s',
  },
  searchIconWrap: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    display: 'flex',
    pointerEvents: 'none',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'var(--primary)',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  categoryBar: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  catBtn: (active) => ({
    padding: '8px 18px',
    borderRadius: 'var(--radius-sm)',
    border: active ? '1px solid var(--primary)' : '1px solid var(--border)',
    background: active ? 'var(--primary-light)' : 'var(--surface)',
    color: active ? 'var(--primary)' : 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s',
  }),
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '20px',
    transition: 'box-shadow 0.2s',
  },
  statIconWrap: (color) => ({
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: `${color}12`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color,
    marginBottom: '14px',
  }),
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--text)',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginTop: '6px',
  },
  alertBanner: {
    background: 'rgba(239,68,68,0.06)',
    border: '1px solid rgba(239,68,68,0.15)',
    borderRadius: 'var(--radius)',
    padding: '16px 20px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  alertIcon: {
    color: 'var(--danger)',
    flexShrink: 0,
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    fontWeight: '600',
    color: 'var(--danger)',
    fontSize: '14px',
  },
  alertDesc: {
    color: 'var(--text-secondary)',
    fontSize: '13px',
    marginTop: '2px',
  },
  tableWrap: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '14px 20px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--surface-hover)',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '14px 20px',
    borderBottom: '1px solid var(--border)',
    fontSize: '14px',
    color: 'var(--text)',
    verticalAlign: 'middle',
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  nameIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'var(--primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--primary)',
    flexShrink: 0,
  },
  nameText: {
    fontWeight: '600',
  },
  badge: (bg, color) => ({
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    background: bg,
    color,
    display: 'inline-block',
    whiteSpace: 'nowrap',
  }),
  qtyValue: {
    fontWeight: '600',
    color: 'var(--text)',
  },
  qtyUnit: {
    color: 'var(--text-muted)',
    fontSize: '13px',
    marginLeft: '2px',
  },
  minQtyText: {
    color: 'var(--text-muted)',
    fontSize: '13px',
  },
  progressOuter: {
    width: '80px',
    height: '6px',
    background: 'var(--border)',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '6px',
  },
  progressInner: (pct, color) => ({
    width: Math.min(pct, 100) + '%',
    height: '100%',
    background: color,
    borderRadius: '3px',
    transition: 'width 0.3s',
  }),
  statusBadge: (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: '600',
    color,
  }),
  statusDot: (color) => ({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
  }),
  supplierCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    whiteSpace: 'nowrap',
  },
  dateCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    whiteSpace: 'nowrap',
  },
  actions: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  iconBtn: {
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--primary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  },
  qtyBtnInc: {
    padding: '6px 8px',
    borderRadius: '8px',
    border: 'none',
    background: 'rgba(34,197,94,0.1)',
    color: 'var(--success)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  },
  qtyBtnDec: {
    padding: '6px 8px',
    borderRadius: '8px',
    border: 'none',
    background: 'rgba(239,68,68,0.1)',
    color: 'var(--danger)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'var(--text-muted)',
  },
  emptyIcon: {
    marginBottom: '12px',
    color: 'var(--border-strong)',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    width: '520px',
    maxWidth: '94vw',
    maxHeight: '90vh',
    overflow: 'auto',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-lg)',
  },
  modalHeader: {
    padding: '24px 24px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text)',
    margin: 0,
  },
  modalClose: {
    background: 'var(--surface-active)',
    border: 'none',
    borderRadius: '10px',
    padding: '8px',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  },
  modalBody: {
    padding: '24px',
  },
  formGroup: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  modalFooter: {
    padding: '0 24px 24px',
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '10px 20px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  saveBtn: {
    padding: '10px 24px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'var(--primary)',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
};

const css = `
  @media (max-width: 1100px) {
    .inv-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .inv-table-wrap { overflow-x: auto; }
  }
  @media (max-width: 640px) {
    .inv-stats-grid { grid-template-columns: 1fr !important; }
    .inv-header-row { flex-direction: column !important; align-items: stretch !important; }
    .inv-header-actions { flex-direction: column; }
    .inv-header-actions input { width: 100% !important; }
    .inv-form-row { grid-template-columns: 1fr !important; }
  }
`;

export default function AdminInventory() {
  const store = useStore();
  const inventory = store?.inventory || defaultInventory;
  const updateInventory = store?.updateInventory || (() => {});
  const addInventory = store?.addInventory || (() => {});

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Hammasi');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: "Go'sht",
    quantity: '',
    unit: 'kg',
    minQuantity: '',
    supplier: '',
    expiryDate: '',
  });

  const filtered = inventory.filter((item) => {
    const matchCat = activeCategory === 'Hammasi' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const stats = {
    total: inventory.length,
    low: inventory.filter((i) => i.quantity > 0 && i.quantity <= i.minQuantity).length,
    out: inventory.filter((i) => i.quantity === 0).length,
    sufficient: inventory.filter((i) => i.quantity > i.minQuantity).length,
  };

  const criticalItems = inventory.filter((i) => i.quantity === 0 || i.quantity <= i.minQuantity);

  const openAdd = () => {
    setEditingItem(null);
    setFormData({ name: '', category: "Go'sht", quantity: '', unit: 'kg', minQuantity: '', supplier: '', expiryDate: '' });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: String(item.quantity),
      unit: item.unit,
      minQuantity: String(item.minQuantity),
      supplier: item.supplier,
      expiryDate: item.expiryDate,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    const data = {
      ...formData,
      quantity: Number(formData.quantity),
      minQuantity: Number(formData.minQuantity),
    };
    if (editingItem) {
      updateInventory(editingItem.id, data);
    } else {
      addInventory({ ...data, id: Date.now() });
    }
    setShowModal(false);
  };

  const handleQtyChange = (id, delta) => {
    const item = inventory.find((i) => i.id === id);
    if (item) {
      updateInventory(id, { quantity: Math.max(0, item.quantity + delta) });
    }
  };

  return (
    <div style={s.page}>
      <style>{css}</style>

      <div className="inv-header-row" style={s.headerRow}>
        <h1 style={s.title}>Inventarizatsiya</h1>
        <div className="inv-header-actions" style={s.headerActions}>
          <div style={s.searchBox}>
            <div style={s.searchIconWrap}>
              <Search size={16} />
            </div>
            <input
              style={s.searchInput}
              placeholder="Mahsulot qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button style={s.addBtn} onClick={openAdd}>
            <Plus size={18} />
            Yangi mahsulot
          </button>
        </div>
      </div>

      <div style={s.categoryBar}>
        {categories.map((cat) => (
          <button
            key={cat}
            style={s.catBtn(activeCategory === cat)}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="inv-stats-grid" style={s.statsGrid}>
        <div style={s.statCard}>
          <div style={s.statIconWrap('var(--primary)')}>
            <Package size={22} />
          </div>
          <div style={s.statValue}>{stats.total}</div>
          <div style={s.statLabel}>Jami mahsulotlar</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statIconWrap('var(--danger)')}>
            <AlertTriangle size={22} />
          </div>
          <div style={s.statValue}>{stats.out}</div>
          <div style={s.statLabel}>Tugagan</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statIconWrap('var(--warning)')}>
            <ArrowDown size={22} />
          </div>
          <div style={s.statValue}>{stats.low}</div>
          <div style={s.statLabel}>Kam qoldi</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statIconWrap('var(--success)')}>
            <ArrowUp size={22} />
          </div>
          <div style={s.statValue}>{stats.sufficient}</div>
          <div style={s.statLabel}>Yetarli</div>
        </div>
      </div>

      {criticalItems.length > 0 && (
        <div style={s.alertBanner}>
          <AlertTriangle size={20} style={s.alertIcon} />
          <div style={s.alertText}>
            <div style={s.alertTitle}>Diqqat! {criticalItems.length} ta mahsulotda muammo bor</div>
            <div style={s.alertDesc}>
              {criticalItems.map((i) => i.name).join(', ')} — zaxira yetarli emas yoki tugagan
            </div>
          </div>
        </div>
      )}

      <div className="inv-table-wrap" style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Mahsulot</th>
              <th style={s.th}>Kategoriya</th>
              <th style={s.th}>Miqdori</th>
              <th style={s.th}>Min. limit</th>
              <th style={s.th}>Holat</th>
              <th style={s.th}>Yetkazib beruvchi</th>
              <th style={s.th}>Muddati</th>
              <th style={s.th}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <div style={s.emptyState}>
                    <Package size={44} style={s.emptyIcon} />
                    <div style={{ fontSize: '15px', fontWeight: '600' }}>Mahsulot topilmadi</div>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const status = getStatus(item.quantity, item.minQuantity);
                const statusColor = getStatusColor(status);
                const pct = item.minQuantity > 0 ? (item.quantity / item.minQuantity) * 100 : 0;
                const catBadge = getCategoryBadgeStyle(item.category);
                return (
                  <tr key={item.id}>
                    <td style={s.td}>
                      <div style={s.nameCell}>
                        <div style={s.nameIcon}>
                          <Package size={18} />
                        </div>
                        <span style={s.nameText}>{item.name}</span>
                      </div>
                    </td>
                    <td style={s.td}>
                      <span style={s.badge(catBadge.bg, catBadge.color)}>{item.category}</span>
                    </td>
                    <td style={s.td}>
                      <span style={s.qtyValue}>{item.quantity}</span>
                      <span style={s.qtyUnit}>{item.unit}</span>
                    </td>
                    <td style={s.td}>
                      <span style={s.minQtyText}>{item.minQuantity} {item.unit}</span>
                    </td>
                    <td style={s.td}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={s.progressOuter}>
                          <div style={s.progressInner(pct, statusColor)} />
                        </div>
                        <div style={s.statusBadge(statusColor)}>
                          <span style={s.statusDot(statusColor)} />
                          {status}
                        </div>
                      </div>
                    </td>
                    <td style={s.td}>
                      <div style={s.supplierCell}>
                        <Truck size={14} />
                        {item.supplier}
                      </div>
                    </td>
                    <td style={s.td}>
                      <div style={s.dateCell}>
                        <Calendar size={14} />
                        {item.expiryDate}
                      </div>
                    </td>
                    <td style={s.td}>
                      <div style={s.actions}>
                        <button style={s.iconBtn} onClick={() => openEdit(item)}>
                          <Edit size={15} />
                        </button>
                        <button style={s.qtyBtnDec} onClick={() => handleQtyChange(item.id, -1)}>
                          <Minus size={14} />
                        </button>
                        <button style={s.qtyBtnInc} onClick={() => handleQtyChange(item.id, 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={s.overlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editingItem ? 'Mahsulotni tahrirlash' : "Yangi mahsulot qo'shish"}</h2>
              <button style={s.modalClose} onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div style={s.modalBody}>
              <div style={s.formGroup}>
                <label style={s.label}>Mahsulot nomi</label>
                <input
                  style={s.input}
                  placeholder="Masalan: Mol go'shti"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Kategoriya</label>
                <select
                  style={s.select}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.filter((c) => c !== 'Hammasi').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="inv-form-row" style={s.formRow}>
                <div style={s.formGroup}>
                  <label style={s.label}>Miqdori</label>
                  <input
                    style={s.input}
                    type="number"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
                <div style={s.formGroup}>
                  <label style={s.label}>O'lchov birligi</label>
                  <select
                    style={s.select}
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Minimal limit</label>
                <input
                  style={s.input}
                  type="number"
                  placeholder="0"
                  value={formData.minQuantity}
                  onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Yetkazib beruvchi</label>
                <input
                  style={s.input}
                  placeholder="Kompaniya nomi"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Muddati</label>
                <input
                  style={s.input}
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
            </div>
            <div style={s.modalFooter}>
              <button style={s.cancelBtn} onClick={() => setShowModal(false)}>
                Bekor qilish
              </button>
              <button
                style={{
                  ...s.saveBtn,
                  opacity: !formData.name || !formData.quantity ? 0.5 : 1,
                  cursor: !formData.name || !formData.quantity ? 'not-allowed' : 'pointer',
                }}
                onClick={handleSave}
                disabled={!formData.name || !formData.quantity}
              >
                {editingItem ? 'Saqlash' : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
