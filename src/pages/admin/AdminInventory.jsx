import React, { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Plus,
  Edit,
  AlertTriangle,
  Package,
  Truck,
  Calendar,
  ArrowUp,
  ArrowDown,
  Search
} from 'lucide-react';

const categories = ['Hammasi', 'Go\'sht', 'Non', 'Sous', 'Sabzavot', 'Ichimlik'];
const units = ['kg', 'dona', 'litr', 'pachka', 'quti'];

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 100%)',
    color: '#f5f5f5',
    fontFamily: "'Inter', sans-serif",
    padding: '24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  backBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '12px',
    padding: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#fff',
  },
  searchBox: {
    position: 'relative',
    width: '300px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 44px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
  },
  searchIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#888',
  },
  categories: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  categoryBtn: (active) => ({
    padding: '10px 20px',
    borderRadius: '10px',
    border: active ? '2px solid #d4a574' : '1px solid rgba(255,255,255,0.1)',
    background: active ? 'rgba(212,165,116,0.2)' : 'rgba(255,255,255,0.05)',
    color: active ? '#d4a574' : '#aaa',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }),
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: (color) => ({
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '16px',
    padding: '20px',
    border: `1px solid ${color}30`,
    animation: 'fade-in 0.5s ease',
  }),
  statIcon: (color) => ({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: `${color}20`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color,
    marginBottom: '12px',
  }),
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: '13px',
    color: '#888',
    marginTop: '4px',
  },
  alertBanner: {
    background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    animation: 'fade-in 0.5s ease',
  },
  alertIcon: {
    color: '#ef4444',
    flexShrink: 0,
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    fontWeight: '600',
    color: '#ef4444',
    fontSize: '14px',
  },
  alertDesc: {
    color: '#ccc',
    fontSize: '13px',
    marginTop: '2px',
  },
  tableContainer: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '16px 20px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.02)',
  },
  td: {
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    fontSize: '14px',
  },
  tr: {
    transition: 'all 0.2s',
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  nameIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(212,165,116,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#d4a574',
  },
  productName: {
    fontWeight: '600',
    color: '#fff',
  },
  categoryBadge: (cat) => ({
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    background: getCategoryColor(cat) + '20',
    color: getCategoryColor(cat),
    border: `1px solid ${getCategoryColor(cat)}40`,
  }),
  quantity: {
    fontWeight: '600',
    color: '#fff',
  },
  unit: {
    color: '#888',
    fontSize: '13px',
  },
  progressBar: {
    width: '100px',
    height: '6px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: (pct, color) => ({
    width: `${Math.min(pct, 100)}%`,
    height: '100%',
    background: color,
    borderRadius: '3px',
    transition: 'width 0.3s',
  }),
  badge: (status) => ({
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    ...getStatusStyle(status),
  }),
  badgeDot: (color) => ({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: color,
  }),
  supplierCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#aaa',
    fontSize: '13px',
  },
  dateCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#aaa',
    fontSize: '13px',
  },
  actionBtns: {
    display: 'flex',
    gap: '8px',
  },
  editBtn: {
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: '#d4a574',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  qtyBtn: (type) => ({
    padding: '6px 10px',
    borderRadius: '8px',
    border: 'none',
    background: type === 'inc' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
    color: type === 'inc' ? '#22c55e' : '#ef4444',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  }),
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fade-in 0.2s ease',
  },
  modal: {
    background: '#2d1810',
    borderRadius: '20px',
    width: '520px',
    maxHeight: '90vh',
    overflow: 'auto',
    border: '1px solid rgba(255,255,255,0.1)',
    animation: 'fade-in 0.3s ease',
  },
  modalHeader: {
    padding: '24px 24px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
  },
  modalClose: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '10px',
    padding: '10px',
    cursor: 'pointer',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  modalBody: {
    padding: '24px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#aaa',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
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
    padding: '12px 24px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: '#aaa',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  saveBtn: {
    padding: '12px 28px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #d4a574 0%, #b8956a 100%)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#888',
  },
  emptyIcon: {
    marginBottom: '16px',
    color: '#555',
  },
};

function getCategoryColor(cat) {
  const colors = {
    "Go'sht": '#ef4444',
    'Non': '#f59e0b',
    'Sous': '#8b5cf6',
    'Sabzavot': '#22c55e',
    'Ichimlik': '#3b82f6',
  };
  return colors[cat] || '#888';
}

function getStatusStyle(status) {
  if (status === 'Yetarli') return { background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' };
  if (status === 'Kam qoldi') return { background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' };
  return { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' };
}

function getStatus(quantity, minQuantity) {
  if (quantity === 0) return 'Tugadi';
  if (quantity <= minQuantity) return 'Kam qoldi';
  return 'Yetarli';
}

function getProgressColor(quantity, minQuantity) {
  if (quantity === 0) return '#ef4444';
  if (quantity <= minQuantity) return '#f59e0b';
  return '#22c55e';
}

const defaultInventory = [
  { id: 1, name: "Mol go'shti", category: "Go'sht", quantity: 25, unit: 'kg', minQuantity: 10, supplier: 'Toshkent Go\'sht', expiryDate: '2026-08-15' },
  { id: 2, name: "Qo'y go'shti", category: "Go'sht", quantity: 3, unit: 'kg', minQuantity: 8, supplier: 'Samarqand Fermer', expiryDate: '2026-08-10' },
  { id: 3, name: "Non", category: "Non", quantity: 50, unit: 'dona', minQuantity: 20, supplier: 'Nonvoy Usti', expiryDate: '2026-07-30' },
  { id: 4, name: "Lavash", category: "Non", quantity: 15, unit: 'dona', minQuantity: 10, supplier: 'Nonvoy Usti', expiryDate: '2026-07-29' },
  { id: 5, name: "Ketchup", category: "Sous", quantity: 12, unit: 'litr', minQuantity: 5, supplier: 'Oziq-ovqat', expiryDate: '2026-12-01' },
  { id: 6, name: "Mayonez", category: "Sous", quantity: 0, unit: 'litr', minQuantity: 5, supplier: 'Oziq-ovqat', expiryDate: '2026-11-15' },
  { id: 7, name: "Pomidor", category: "Sabzavot", quantity: 18, unit: 'kg', minQuantity: 8, supplier: 'Bog\'dod Bozori', expiryDate: '2026-08-05' },
  { id: 8, name: "Cola", category: "Ichimlik", quantity: 30, unit: 'dona', minQuantity: 15, supplier: 'Imzo', expiryDate: '2027-01-20' },
];

export default function AdminInventory() {
  const navigate = useNavigate();
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
    const matchCategory = activeCategory === 'Hammasi' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const stats = {
    total: inventory.length,
    low: inventory.filter((i) => i.quantity > 0 && i.quantity <= i.minQuantity).length,
    out: inventory.filter((i) => i.quantity === 0).length,
    sufficient: inventory.filter((i) => i.quantity > i.minQuantity).length,
  };

  const criticalItems = inventory.filter((i) => i.quantity === 0 || i.quantity <= i.minQuantity);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ name: '', category: "Go'sht", quantity: '', unit: 'kg', minQuantity: '', supplier: '', expiryDate: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
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
      const newQty = Math.max(0, item.quantity + delta);
      updateInventory(id, { quantity: newQty });
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes stagger {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input::placeholder, select::placeholder { color: #666; }
        input:focus, select:focus { border-color: #d4a574 !important; }
        .inventory-row:hover { background: rgba(255,255,255,0.03) !important; }
        .edit-btn:hover { background: rgba(212,165,116,0.2) !important; }
        .qty-btn:hover { filter: brightness(1.3); }
        .back-btn:hover { background: rgba(255,255,255,0.15) !important; }
        .modal-close:hover { background: rgba(255,255,255,0.2) !important; }
        .cancel-btn:hover { background: rgba(255,255,255,0.1) !important; }
        .save-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .cat-btn:hover { background: rgba(255,255,255,0.1) !important; }
        .search-input:focus { border-color: #d4a574 !important; background: rgba(255,255,255,0.08) !important; }
        .stat-card { transition: transform 0.2s, box-shadow 0.2s; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.3); }
        select option { background: #2d1810; color: #fff; }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button className="back-btn" style={styles.backBtn} onClick={() => navigate(-1)}>
            <ChevronLeft size={22} />
          </button>
          <h1 style={styles.title}>Inventarizatsiya</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={styles.searchBox}>
            <Search size={18} style={styles.searchIcon} />
            <input
              className="search-input"
              style={styles.searchInput}
              placeholder="Mahsulot qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary"
            style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #d4a574 0%, #b8956a 100%)', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
            onClick={handleOpenAdd}
          >
            <Plus size={18} />
            Yangi mahsulot
          </button>
        </div>
      </div>

      {/* Categories */}
      <div style={styles.categories}>
        {categories.map((cat) => (
          <button
            key={cat}
            className="cat-btn"
            style={styles.categoryBtn(activeCategory === cat)}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        <div className="stat-card" style={styles.statCard('#d4a574')}>
          <div style={styles.statIcon('#d4a574')}>
            <Package size={24} />
          </div>
          <div style={styles.statValue}>{stats.total}</div>
          <div style={styles.statLabel}>Jami mahsulotlar</div>
        </div>
        <div className="stat-card" style={styles.statCard('#ef4444')}>
          <div style={styles.statIcon('#ef4444')}>
            <AlertTriangle size={24} />
          </div>
          <div style={styles.statValue}>{stats.out}</div>
          <div style={styles.statLabel}>Tugagan</div>
        </div>
        <div className="stat-card" style={styles.statCard('#f59e0b')}>
          <div style={styles.statIcon('#f59e0b')}>
            <ArrowDown size={24} />
          </div>
          <div style={styles.statValue}>{stats.low}</div>
          <div style={styles.statLabel}>Kam qoldi</div>
        </div>
        <div className="stat-card" style={styles.statCard('#22c55e')}>
          <div style={styles.statIcon('#22c55e')}>
            <ArrowUp size={24} />
          </div>
          <div style={styles.statValue}>{stats.sufficient}</div>
          <div style={styles.statLabel}>Yetarli</div>
        </div>
      </div>

      {/* Alert Banner */}
      {criticalItems.length > 0 && (
        <div style={styles.alertBanner}>
          <AlertTriangle size={24} style={styles.alertIcon} />
          <div style={styles.alertText}>
            <div style={styles.alertTitle}>Diqqat! {criticalItems.length} ta mahsulotda muammo bor</div>
            <div style={styles.alertDesc}>
              {criticalItems.map((i) => i.name).join(', ')} — zaxira yetarli emas yoki tugagan
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Mahsulot</th>
              <th style={styles.th}>Kategoriya</th>
              <th style={styles.th}>Miqdori</th>
              <th style={styles.th}>Min. limit</th>
              <th style={styles.th}>Holat</th>
              <th style={styles.th}>Yetkazib beruvchi</th>
              <th style={styles.th}>Muddati</th>
              <th style={styles.th}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8">
                  <div style={styles.emptyState}>
                    <Package size={48} style={styles.emptyIcon} />
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>Mahsulot topilmadi</div>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((item, idx) => {
                const status = getStatus(item.quantity, item.minQuantity);
                const pct = item.minQuantity > 0 ? (item.quantity / item.minQuantity) * 100 : 0;
                const progressColor = getProgressColor(item.quantity, item.minQuantity);
                return (
                  <tr
                    key={item.id}
                    className="inventory-row"
                    style={{
                      ...styles.tr,
                      animation: `stagger 0.4s ease ${idx * 0.05}s both`,
                    }}
                  >
                    <td style={styles.td}>
                      <div style={styles.nameCell}>
                        <div style={styles.nameIcon}>
                          <Package size={18} />
                        </div>
                        <span style={styles.productName}>{item.name}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.categoryBadge(item.category)}>{item.category}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.quantity}>{item.quantity}</span>
                      <span style={styles.unit}> {item.unit}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ color: '#888' }}>{item.minQuantity} {item.unit}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={styles.progressBar}>
                          <div style={styles.progressFill(pct, progressColor)} />
                        </div>
                        <span style={styles.badge(status)}>
                          <span style={styles.badgeDot(progressColor)} />
                          {status}
                        </span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.supplierCell}>
                        <Truck size={14} />
                        {item.supplier}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.dateCell}>
                        <Calendar size={14} />
                        {item.expiryDate}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionBtns}>
                        <button
                          className="edit-btn"
                          style={styles.editBtn}
                          onClick={() => handleOpenEdit(item)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="qty-btn"
                          style={styles.qtyBtn('dec')}
                          onClick={() => handleQtyChange(item.id, -1)}
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          className="qty-btn"
                          style={styles.qtyBtn('inc')}
                          onClick={() => handleQtyChange(item.id, 1)}
                        >
                          <ArrowUp size={14} />
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

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editingItem ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}</h2>
              <button className="modal-close" style={styles.modalClose} onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Mahsulot nomi</label>
                <input
                  style={styles.input}
                  placeholder="Masalan: Mol go'shti"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Kategoriya</label>
                <select
                  style={styles.select}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.filter((c) => c !== 'Hammasi').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Miqdori</label>
                  <input
                    style={styles.input}
                    type="number"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>O'lchov birligi</label>
                  <select
                    style={styles.select}
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Minimal limit</label>
                <input
                  style={styles.input}
                  type="number"
                  placeholder="0"
                  value={formData.minQuantity}
                  onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Yetkazib beruvchi</label>
                <input
                  style={styles.input}
                  placeholder="Kompaniya nomi"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Muddati</label>
                <input
                  style={styles.input}
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button className="cancel-btn" style={styles.cancelBtn} onClick={() => setShowModal(false)}>
                Bekor qilish
              </button>
              <button
                className="save-btn"
                style={styles.saveBtn}
                onClick={handleSave}
                disabled={!formData.name || !formData.quantity}
              >
                {editingItem ? "Saqlash" : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}