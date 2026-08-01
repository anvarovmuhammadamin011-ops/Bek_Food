import { useState, useMemo, useCallback } from 'react';
import {
  Search, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Check, X, Eye, Clock, Download, Printer, Package, User, MapPin, CreditCard, Banknote, AlertCircle
} from 'lucide-react';
import useStore from '../../store/useStore';

const statusConfig = {
  pending: { label: 'Kutilmoqda', color: 'var(--warning)', bg: 'rgba(245,158,11,.1)' },
  preparing: { label: 'Tayyorlanmoqda', color: 'var(--primary)', bg: 'var(--primary-light)' },
  ready: { label: 'Tayyor', color: 'var(--success)', bg: 'rgba(34,197,94,.1)' },
  onTheWay: { label: "Yo'lda", color: '#8B5CF6', bg: 'rgba(139,92,246,.1)' },
  delivered: { label: 'Yetkazilgan', color: 'var(--success)', bg: 'rgba(34,197,94,.1)' },
  cancelled: { label: 'Bekor qilingan', color: 'var(--danger)', bg: 'rgba(239,68,68,.1)' },
};

const statusOrder = ['pending', 'preparing', 'ready', 'onTheWay', 'delivered'];

function formatCurrency(n) {
  return n?.toLocaleString() + " so'm";
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getTimeline(order) {
  const base = new Date(order.createdAt).getTime();
  const steps = [];
  steps.push({ time: formatTime(order.createdAt), label: 'Buyurtma yaratildi', done: true });
  if (['preparing', 'ready', 'onTheWay', 'delivered'].includes(order.status)) {
    steps.push({ time: formatTime(new Date(base + 60000)), label: 'Sotuvchi qabul qildi', done: true });
  }
  if (['ready', 'onTheWay', 'delivered'].includes(order.status)) {
    steps.push({ time: formatTime(new Date(base + 900000)), label: "Tayyor bo'ldi", done: true });
  }
  if (['onTheWay', 'delivered'].includes(order.status)) {
    steps.push({ time: formatTime(new Date(base + 1200000)), label: 'Kuryer oldi', done: true });
  }
  if (order.status === 'delivered') {
    steps.push({ time: formatTime(order.deliveredAt || new Date(base + 1800000)), label: 'Yetkazildi', done: true });
  }
  if (order.status === 'cancelled') {
    steps.push({ time: formatTime(new Date()), label: 'Bekor qilindi', done: false });
  }
  return steps;
}

const styles = {
  page: {
    minHeight: '100%',
    background: 'var(--bg)',
    fontFamily: 'var(--font-body)',
  },
  header: {
    padding: '20px 24px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '-0.01em',
  },
  exportBtn: {
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-sm)',
    background: 'var(--primary)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all .2s',
    boxShadow: '0 2px 8px rgba(249,115,22,.25)',
  },
  filterToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    margin: '0 24px 12px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all .2s',
  },
  filterToggleActive: {
    background: 'var(--primary-light)',
    borderColor: 'var(--primary)',
    color: 'var(--primary)',
  },
  filterCount: {
    background: 'var(--primary)',
    color: '#fff',
    borderRadius: '50%',
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 700,
  },
  filterPanel: {
    margin: '0 24px 16px',
    padding: 16,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    display: 'grid',
    gap: 12,
  },
  filterRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    marginBottom: 6,
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    color: 'var(--text)',
    fontSize: 13,
    outline: 'none',
    transition: 'border-color .2s',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px 32px 10px 12px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    color: 'var(--text)',
    fontSize: 13,
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239ca3af' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    boxSizing: 'border-box',
  },
  filterToggles: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    padding: '7px 14px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all .15s',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
  },
  toggleBtnActive: {
    background: 'var(--primary-light)',
    borderColor: 'var(--primary)',
    color: 'var(--primary)',
  },
  toggleCheck: (active) => ({
    width: 16,
    height: 16,
    borderRadius: 4,
    border: `2px solid ${active ? 'var(--primary)' : 'var(--border-strong)'}`,
    background: active ? 'var(--primary)' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all .15s',
    flexShrink: 0,
  }),
  clearBtn: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '7px 12px',
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 500,
    background: 'rgba(239,68,68,.08)',
    border: '1px solid rgba(239,68,68,.15)',
    color: 'var(--danger)',
    cursor: 'pointer',
  },
  bulkBar: {
    margin: '0 24px 12px',
    padding: '10px 16px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  bulkActions: {
    display: 'flex',
    gap: 6,
    marginLeft: 'auto',
    flexWrap: 'wrap',
  },
  bulkActionBtn: (color) => ({
    padding: '6px 12px',
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 500,
    background: `${color}10`,
    border: `1px solid ${color}25`,
    color,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    transition: 'all .15s',
  }),
  content: {
    padding: '0 24px',
  },
  emptyState: {
    padding: 60,
    textAlign: 'center',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 'var(--radius)',
    background: 'var(--bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '40px 70px 60px 1fr 90px 110px 80px 40px',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    marginBottom: 4,
  },
  thText: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  orderCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '12px 16px',
    marginBottom: 6,
    transition: 'all .15s',
    cursor: 'default',
  },
  orderRow: {
    display: 'grid',
    gridTemplateColumns: '40px 70px 60px 1fr 90px 110px 80px 40px',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: (active) => ({
    width: 20,
    height: 20,
    borderRadius: 5,
    border: `2px solid ${active ? 'var(--primary)' : 'var(--border-strong)'}`,
    background: active ? 'var(--primary)' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all .15s',
    flexShrink: 0,
  }),
  orderId: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text)',
  },
  timeCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  customerName: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text)',
    lineHeight: 1.3,
  },
  customerPhone: {
    fontSize: 11,
    color: 'var(--text-muted)',
    marginTop: 1,
  },
  sumCell: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text)',
    textAlign: 'right',
    fontVariantNumeric: 'tabular-nums',
  },
  badge: (color, bg) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    color,
    background: bg,
    whiteSpace: 'nowrap',
    lineHeight: 1,
  }),
  viewBtn: {
    width: 34,
    height: 34,
    padding: 0,
    borderRadius: 10,
    background: 'var(--primary)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all .2s',
    boxShadow: '0 1px 4px rgba(249,115,22,.2)',
  },
  pagination: {
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  pageBtn: (active) => ({
    width: 36,
    height: 36,
    borderRadius: 10,
    background: active ? 'var(--primary)' : 'var(--surface)',
    border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
    color: active ? '#fff' : 'var(--text-secondary)',
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    cursor: 'pointer',
    transition: 'all .15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  navBtn: (disabled) => ({
    width: 36,
    height: 36,
    borderRadius: 10,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    color: disabled ? 'var(--border-strong)' : 'var(--text-secondary)',
    fontSize: 13,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.5 : 1,
  }),
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    background: 'rgba(0,0,0,.4)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  sheet: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90vh',
    background: 'var(--surface)',
    borderRadius: '20px 20px 0 0',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 -4px 24px rgba(0,0,0,.12)',
  },
  sheetHeader: {
    padding: '20px 24px 16px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: 'var(--text)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--text-muted)',
    transition: 'all .15s',
  },
  sheetBody: {
    flex: 1,
    overflowY: 'auto',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 14,
  },
  timelineStep: (done) => ({
    display: 'flex',
    gap: 12,
    position: 'relative',
    paddingBottom: 16,
  }),
  timelineLine: {
    position: 'absolute',
    left: 11,
    top: 24,
    width: 2,
    height: 'calc(100% - 8px)',
    background: 'var(--border)',
  },
  timelineDot: (done) => ({
    width: 24,
    height: 24,
    borderRadius: '50%',
    flexShrink: 0,
    background: done ? 'var(--primary-light)' : 'var(--bg)',
    border: `2px solid ${done ? 'var(--primary)' : 'var(--border-strong)'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  timelineLabel: (done) => ({
    color: done ? 'var(--text)' : 'var(--text-muted)',
    fontSize: 13,
    fontWeight: 500,
  }),
  infoCard: {
    padding: 16,
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    marginBottom: 12,
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  infoIcon: (bg) => ({
    width: 36,
    height: 36,
    borderRadius: 10,
    background: bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),
  itemName: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text)',
  },
  itemDetail: {
    fontSize: 11,
    color: 'var(--text-muted)',
    marginTop: 2,
  },
  itemSum: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text)',
    fontVariantNumeric: 'tabular-nums',
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTop: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text)',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--primary)',
    fontVariantNumeric: 'tabular-nums',
  },
  actionBtn: (variant) => ({
    flex: variant === 'primary' ? 1 : 'none',
    height: 44,
    padding: variant === 'primary' ? 0 : '0 20px',
    borderRadius: 'var(--radius-sm)',
    border: variant === 'primary' ? 'none' : '1px solid var(--border)',
    background: variant === 'primary'
      ? 'var(--primary)'
      : variant === 'danger'
        ? 'rgba(239,68,68,.08)'
        : 'var(--bg)',
    color: variant === 'primary'
      ? '#fff'
      : variant === 'danger'
        ? 'var(--danger)'
        : 'var(--text-secondary)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    transition: 'all .15s',
    boxShadow: variant === 'primary' ? '0 2px 8px rgba(249,115,22,.25)' : 'none',
  }),
};

export default function AdminOrders() {
  const { orders, updateOrderStatus, cancelOrder } = useStore();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [detailOrder, setDetailOrder] = useState(null);
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [filterMinSum, setFilterMinSum] = useState('');
  const [filterMaxSum, setFilterMaxSum] = useState('');
  const [filterVIP, setFilterVIP] = useState(false);
  const [filterPromo, setFilterPromo] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    let list = [...orders];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        String(o.id).includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.customerPhone?.includes(q)
      );
    }
    if (filterDate) {
      const d = new Date(filterDate).toDateString();
      list = list.filter(o => new Date(o.createdAt).toDateString() === d);
    }
    if (filterStatus !== 'all') {
      list = list.filter(o => o.status === filterStatus);
    }
    if (filterPayment !== 'all') {
      list = list.filter(o => o.paymentMethod === filterPayment);
    }
    if (filterMinSum) {
      list = list.filter(o => o.total >= Number(filterMinSum));
    }
    if (filterMaxSum) {
      list = list.filter(o => o.total <= Number(filterMaxSum));
    }
    if (filterVIP) {
      list = list.filter(o => o.priority === 'high');
    }
    if (filterPromo) {
      list = list.filter(o => o.notes && o.notes.length > 0);
    }
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [orders, search, filterDate, filterStatus, filterPayment, filterMinSum, filterMaxSum, filterVIP, filterPromo]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggleSelect = useCallback((id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const toggleAll = useCallback(() => {
    if (selectedIds.length === paginated.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginated.map(o => o.id));
    }
  }, [selectedIds, paginated]);

  const clearFilters = () => {
    setSearch('');
    setFilterDate('');
    setFilterStatus('all');
    setFilterPayment('all');
    setFilterMinSum('');
    setFilterMaxSum('');
    setFilterVIP(false);
    setFilterPromo(false);
    setCurrentPage(1);
  };

  const activeFilterCount = [search, filterDate, filterStatus !== 'all', filterPayment !== 'all', filterMinSum, filterMaxSum, filterVIP, filterPromo].filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0;

  const handleBulkStatusChange = (status) => {
    selectedIds.forEach(id => updateOrderStatus(id, status));
    setSelectedIds([]);
  };

  const handleBulkCancel = () => {
    selectedIds.forEach(id => cancelOrder(id));
    setSelectedIds([]);
  };

  const handleExport = () => {
    const data = filtered.map(o => ({
      ID: o.id,
      Sana: formatDate(o.createdAt),
      Vaqt: formatTime(o.createdAt),
      Mijoz: o.customerName,
      Telefon: o.customerPhone,
      Summa: o.total,
      Holat: statusConfig[o.status]?.label,
      "To'lov": o.paymentMethod === 'cash' ? 'Naqd' : 'Karta',
      Manzil: o.address,
    }));
    const csv = [Object.keys(data[0] || {}).join(',')];
    data.forEach(row => csv.push(Object.values(row).map(v => `"${v}"`).join(',')));
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `buyurtmalar_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Buyurtmalar</h1>
        </div>
        <button onClick={handleExport} style={styles.exportBtn} title="CSV eksport">
          <Download size={18} color="#fff" />
        </button>
      </div>

      <button
        onClick={() => setFiltersOpen(!filtersOpen)}
        style={{
          ...styles.filterToggle,
          ...(hasActiveFilters ? styles.filterToggleActive : {}),
        }}
      >
        <Filter size={15} />
        Filtrlar
        {hasActiveFilters && (
          <span style={styles.filterCount}>{activeFilterCount}</span>
        )}
        <div style={{ marginLeft: 'auto' }}>
          {filtersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {filtersOpen && (
        <div style={styles.filterPanel}>
          <div style={styles.filterRow}>
            <div>
              <label style={styles.label}>Sana</label>
              <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Holat</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={styles.select}>
                <option value="all">Barchasi</option>
                <option value="pending">Kutilmoqda</option>
                <option value="preparing">Tayyorlanmoqda</option>
                <option value="ready">Tayyor</option>
                <option value="onTheWay">Yo'lda</option>
                <option value="delivered">Yetkazilgan</option>
                <option value="cancelled">Bekor qilingan</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>To'lov turi</label>
              <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)} style={styles.select}>
                <option value="all">Barchasi</option>
                <option value="cash">Naqd</option>
                <option value="card">Karta</option>
              </select>
            </div>
          </div>
          <div style={styles.filterRow}>
            <div>
              <label style={styles.label}>Summa (min)</label>
              <input type="number" placeholder="0" value={filterMinSum} onChange={e => setFilterMinSum(e.target.value)} style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Summa (max)</label>
              <input type="number" placeholder="999999" value={filterMaxSum} onChange={e => setFilterMaxSum(e.target.value)} style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Qidirish</label>
              <div style={{ position: 'relative' }}>
                <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="ID, nomi, telefon..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                  style={{ ...styles.input, paddingLeft: 34 }}
                />
              </div>
            </div>
          </div>
          <div style={styles.filterToggles}>
            <button
              onClick={() => setFilterVIP(!filterVIP)}
              style={{ ...styles.toggleBtn, ...(filterVIP ? styles.toggleBtnActive : {}) }}
            >
              <div style={styles.toggleCheck(filterVIP)}>
                {filterVIP && <Check size={10} color="#fff" strokeWidth={3} />}
              </div>
              VIP mijoz
            </button>
            <button
              onClick={() => setFilterPromo(!filterPromo)}
              style={{ ...styles.toggleBtn, ...(filterPromo ? styles.toggleBtnActive : {}) }}
            >
              <div style={styles.toggleCheck(filterPromo)}>
                {filterPromo && <Check size={10} color="#fff" strokeWidth={3} />}
              </div>
              Promo ishlatilgan
            </button>
            {hasActiveFilters && (
              <button onClick={clearFilters} style={styles.clearBtn}>
                <X size={13} />
                Tozalash
              </button>
            )}
          </div>
        </div>
      )}

      {selectedIds.length > 0 && (
        <div style={styles.bulkBar}>
          <div style={{ flexShrink: 0 }}>
            <div onClick={toggleAll} style={styles.checkbox(selectedIds.length === paginated.length)}>
              {selectedIds.length === paginated.length && <Check size={11} color="#fff" strokeWidth={3} />}
            </div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap' }}>
            {selectedIds.length} ta tanlangan
          </span>
          <div style={styles.bulkActions}>
            <button onClick={handleExport} style={styles.bulkActionBtn('#3b82f6')}>
              <Download size={12} /> Eksport
            </button>
            <button onClick={() => window.print()} style={styles.bulkActionBtn('#8b5cf6')}>
              <Printer size={12} /> Chop etish
            </button>
            <button onClick={() => handleBulkStatusChange('delivered')} style={styles.bulkActionBtn('var(--success)')}>
              <Check size={12} /> Yetkazilgan
            </button>
            <button onClick={handleBulkCancel} style={styles.bulkActionBtn('var(--danger)')}>
              <X size={12} /> Bekor qilish
            </button>
          </div>
        </div>
      )}

      <div style={styles.content}>
        {paginated.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <Package size={28} color="var(--text-muted)" />
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4 }}>Buyurtmalar topilmadi</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Filtrlarni o'zgartirib ko'ring</p>
          </div>
        ) : (
          <>
            <div style={styles.tableHeader}>
              <div onClick={toggleAll} style={styles.checkbox(selectedIds.length === paginated.length && paginated.length > 0)}>
                {selectedIds.length === paginated.length && paginated.length > 0 && <Check size={11} color="#fff" strokeWidth={3} />}
              </div>
              <span style={styles.thText}>ID</span>
              <span style={styles.thText}>Vaqt</span>
              <span style={styles.thText}>Mijoz</span>
              <span style={{ ...styles.thText, textAlign: 'right' }}>Summa</span>
              <span style={styles.thText}>Holat</span>
              <span style={styles.thText}>To'lov</span>
              <span style={styles.thText}></span>
            </div>

            {paginated.map(o => {
              const sc = statusConfig[o.status] || statusConfig.pending;
              const isSelected = selectedIds.includes(o.id);
              return (
                <div
                  key={o.id}
                  style={{
                    ...styles.orderCard,
                    borderColor: isSelected ? 'var(--primary)' : undefined,
                    background: isSelected ? 'var(--primary-light)' : undefined,
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                  onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; } }}
                >
                  <div style={styles.orderRow}>
                    <div onClick={() => toggleSelect(o.id)} style={styles.checkbox(isSelected)}>
                      {isSelected && <Check size={11} color="#fff" strokeWidth={3} />}
                    </div>
                    <span style={styles.orderId}>#{o.id}</span>
                    <div style={styles.timeCell}>
                      <Clock size={12} color="var(--text-muted)" />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{formatTime(o.createdAt)}</span>
                    </div>
                    <div>
                      <p style={styles.customerName}>{o.customerName}</p>
                      <p style={styles.customerPhone}>{o.customerPhone}</p>
                    </div>
                    <span style={styles.sumCell}>{o.total.toLocaleString()}</span>
                    <span style={styles.badge(sc.color, sc.bg)}>{sc.label}</span>
                    <span style={styles.badge(
                      o.paymentMethod === 'card' ? 'var(--success)' : 'var(--warning)',
                      o.paymentMethod === 'card' ? 'rgba(34,197,94,.1)' : 'rgba(245,158,11,.1)'
                    )}>
                      {o.paymentMethod === 'cash' ? (
                        <><Banknote size={11} /> Naqd</>
                      ) : (
                        <><CreditCard size={11} /> Karta</>
                      )}
                    </span>
                    <button onClick={() => setDetailOrder(o)} style={styles.viewBtn}>
                      <Eye size={15} color="#fff" />
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={styles.navBtn(currentPage === 1)}>
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => setCurrentPage(page)} style={styles.pageBtn(page === currentPage)}>
              {page}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={styles.navBtn(currentPage === totalPages)}>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {detailOrder && (
        <div style={styles.overlay} onClick={e => { if (e.target === e.currentTarget) setDetailOrder(null); }}>
          <div style={styles.sheet}>
            <div style={styles.sheetHeader}>
              <span style={styles.sheetTitle}>
                Buyurtma #{detailOrder.id}
                <span style={styles.badge(
                  statusConfig[detailOrder.status]?.color,
                  statusConfig[detailOrder.status]?.bg
                )}>
                  {statusConfig[detailOrder.status]?.label}
                </span>
              </span>
              <button onClick={() => setDetailOrder(null)} style={styles.closeBtn}>
                <X size={16} />
              </button>
            </div>

            <div style={styles.sheetBody}>
              <div style={{ marginBottom: 24 }}>
                <p style={styles.sectionTitle}>Buyurtma tarixi</p>
                {getTimeline(detailOrder).map((step, i, arr) => (
                  <div key={i} style={styles.timelineStep(step.done)}>
                    {i < arr.length - 1 && <div style={styles.timelineLine} />}
                    <div style={styles.timelineDot(step.done)}>
                      {step.done && <Check size={11} color="var(--primary)" strokeWidth={3} />}
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={styles.timelineLabel(step.done)}>{step.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{step.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.infoCard}>
                <p style={styles.sectionTitle}>Mijoz ma'lumotlari</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={styles.infoRow}>
                    <div style={styles.infoIcon('var(--primary-light)')}>
                      <User size={16} color="var(--primary)" />
                    </div>
                    <div>
                      <p style={styles.itemName}>{detailOrder.customerName}</p>
                      <p style={styles.itemDetail}>{detailOrder.customerPhone}</p>
                    </div>
                  </div>
                  <div style={styles.infoRow}>
                    <div style={styles.infoIcon('rgba(59,130,246,.1)')}>
                      <MapPin size={16} color="#3b82f6" />
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4, paddingTop: 4 }}>{detailOrder.address}</p>
                  </div>
                </div>
              </div>

              <div style={styles.infoCard}>
                <p style={styles.sectionTitle}>Buyurtma tarkibi</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {detailOrder.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 42,
                          height: 42,
                          borderRadius: 10,
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {item.food?.image ? (
                            <img src={item.food.image} alt="" onError={(e) => { e.currentTarget.src = '/food/placeholder.svg'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <Package size={18} color="var(--text-muted)" />
                          )}
                        </div>
                        <div>
                          <p style={styles.itemName}>{item.food?.name || "Noma'lum"}</p>
                          <p style={styles.itemDetail}>{item.quantity} x {item.price?.toLocaleString()} so'm</p>
                        </div>
                      </div>
                      <span style={styles.itemSum}>{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Jami</span>
                  <span style={styles.totalValue}>{detailOrder.total.toLocaleString()} so'm</span>
                </div>
              </div>

              <div style={styles.infoCard}>
                <p style={styles.sectionTitle}>To'lov ma'lumotlari</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={styles.infoRow}>
                    <div style={styles.infoIcon(
                      detailOrder.paymentMethod === 'cash' ? 'rgba(245,158,11,.1)' : 'rgba(34,197,94,.1)'
                    )}>
                      {detailOrder.paymentMethod === 'cash' ? (
                        <Banknote size={18} color="var(--warning)" />
                      ) : (
                        <CreditCard size={18} color="var(--success)" />
                      )}
                    </div>
                    <div>
                      <p style={styles.itemName}>{detailOrder.paymentMethod === 'cash' ? 'Naqd pul' : 'Plastik karta'}</p>
                      <p style={styles.itemDetail}>{formatDate(detailOrder.createdAt)}</p>
                    </div>
                  </div>
                  <span style={styles.badge('var(--success)', 'rgba(34,197,94,.1)')}>To'langan</span>
                </div>
              </div>

              {detailOrder.notes && (
                <div style={styles.infoCard}>
                  <p style={styles.sectionTitle}>Eslatmalar</p>
                  <p style={{
                    fontSize: 13,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    padding: 12,
                    background: 'var(--surface)',
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    fontStyle: 'italic',
                  }}>
                    "{detailOrder.notes}"
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                {detailOrder.status !== 'delivered' && detailOrder.status !== 'cancelled' && (
                  <>
                    <button
                      style={styles.actionBtn('primary')}
                      onClick={() => {
                        const currentIdx = statusOrder.indexOf(detailOrder.status);
                        if (currentIdx < statusOrder.length - 1) {
                          updateOrderStatus(detailOrder.id, statusOrder[currentIdx + 1]);
                          setDetailOrder({ ...detailOrder, status: statusOrder[currentIdx + 1] });
                        }
                      }}
                    >
                      <ChevronRight size={15} /> Keyingi holat
                    </button>
                    <button
                      style={styles.actionBtn('danger')}
                      onClick={() => {
                        cancelOrder(detailOrder.id);
                        setDetailOrder({ ...detailOrder, status: 'cancelled' });
                      }}
                    >
                      <X size={15} /> Bekor qilish
                    </button>
                  </>
                )}
                <button style={styles.actionBtn('default')} onClick={() => window.print()}>
                  <Printer size={15} /> Chop etish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
