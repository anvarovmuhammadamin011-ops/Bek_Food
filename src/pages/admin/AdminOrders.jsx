import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Filter, Search, Check, X, Eye, Clock, ChevronDown, ChevronUp, Printer, Package } from 'lucide-react';
import useStore from '../../store/useStore';

const statusConfig = {
  pending: { label: 'Kutilmoqda', color: '#f59e0b', bg: 'rgba(245,158,11,.12)', icon: '⏳' },
  preparing: { label: 'Tayyorlanmoqda', color: '#3b82f6', bg: 'rgba(59,130,246,.12)', icon: '👨‍🍳' },
  ready: { label: 'Tayyor', color: '#10b981', bg: 'rgba(16,185,129,.12)', icon: '✅' },
  onTheWay: { label: "Yo'lda", color: '#8b5cf6', bg: 'rgba(139,92,246,.12)', icon: '🚗' },
  delivered: { label: 'Yetkazilgan', color: '#22c55e', bg: 'rgba(34,197,94,.12)', icon: '📦' },
  cancelled: { label: 'Bekor qilingan', color: '#ef4444', bg: 'rgba(239,68,68,.12)', icon: '❌' },
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
  const created = new Date(order.createdAt);
  const steps = [];
  const base = created.getTime();
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

export default function AdminOrders() {
  const navigate = useNavigate();
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

  const hasActiveFilters = search || filterDate || filterStatus !== 'all' || filterPayment !== 'all' || filterMinSum || filterMaxSum || filterVIP || filterPromo;

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

  const selectStyle = {
    background: '#1a1a1a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '7px 10px',
    color: '#fff',
    fontSize: 12,
    outline: 'none',
    width: '100%',
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236b6b6b' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
  };

  const inputStyle = {
    background: '#1a1a1a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: '7px 10px',
    color: '#fff',
    fontSize: 12,
    outline: 'none',
    width: '100%',
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} className="animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all .2s',
            }}
          >
            <ChevronLeft size={18} color="#fff" />
          </button>
          <h1 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 18, fontWeight: 600 }}>
            Buyurtmalar markazi
          </h1>
        </div>
        <button
          onClick={handleExport}
          style={{
            width: 34, height: 34, borderRadius: 10,
            background: '#e51e1e', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all .2s',
          }}
        >
          <Download size={16} color="#fff" />
        </button>
      </div>

      {/* Filters Toggle */}
      <div style={{ padding: '0 16px 8px' }}>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: hasActiveFilters ? 'rgba(229,30,30,.12)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${hasActiveFilters ? 'rgba(229,30,30,.3)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 8, padding: '6px 12px', color: hasActiveFilters ? '#e51e1e' : '#b8b8b8',
            fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all .2s',
          }}
        >
          <Filter size={14} />
          Filtrlar
          {hasActiveFilters && (
            <span style={{ background: '#e51e1e', color: '#fff', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 600 }}>
              {[search, filterDate, filterStatus !== 'all', filterPayment !== 'all', filterMinSum, filterMaxSum, filterVIP, filterPromo].filter(Boolean).length}
            </span>
          )}
          {filtersOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Collapsible Filters Panel */}
      {filtersOpen && (
        <div style={{ padding: '0 16px 12px' }} className="animate-fade-in">
          <div className="card" style={{ padding: 14, display: 'grid', gap: 10 }}>
            {/* Row 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div>
                <label style={{ color: '#6b6b6b', fontSize: 10, marginBottom: 4, display: 'block' }}>Sana</label>
                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: '#6b6b6b', fontSize: 10, marginBottom: 4, display: 'block' }}>Holat</label>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
                  <option value="all">Barchasi</option>
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="onTheWay">On the way</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#6b6b6b', fontSize: 10, marginBottom: 4, display: 'block' }}>To'lov turi</label>
                <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)} style={selectStyle}>
                  <option value="all">Barchasi</option>
                  <option value="cash">Naqd</option>
                  <option value="card">Karta</option>
                </select>
              </div>
            </div>
            {/* Row 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div>
                <label style={{ color: '#6b6b6b', fontSize: 10, marginBottom: 4, display: 'block' }}>Summa (min)</label>
                <input
                  type="number" placeholder="0" value={filterMinSum}
                  onChange={e => setFilterMinSum(e.target.value)} style={inputStyle}
                />
              </div>
              <div>
                <label style={{ color: '#6b6b6b', fontSize: 10, marginBottom: 4, display: 'block' }}>Summa (max)</label>
                <input
                  type="number" placeholder="999999" value={filterMaxSum}
                  onChange={e => setFilterMaxSum(e.target.value)} style={inputStyle}
                />
              </div>
              <div>
                <label style={{ color: '#6b6b6b', fontSize: 10, marginBottom: 4, display: 'block' }}>Qidirish</label>
                <div style={{ position: 'relative' }}>
                  <Search size={13} color="#6b6b6b" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text" placeholder="ID, nomi, telefon..." value={search}
                    onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                    style={{ ...inputStyle, paddingLeft: 28 }}
                  />
                </div>
              </div>
            </div>
            {/* Row 3 - toggles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={() => setFilterVIP(!filterVIP)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', borderRadius: 16, fontSize: 11, fontWeight: 500,
                  cursor: 'pointer', transition: 'all .15s',
                  background: filterVIP ? 'rgba(245,158,11,.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${filterVIP ? 'rgba(245,158,11,.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: filterVIP ? '#f59e0b' : '#b8b8b8',
                }}
              >
                <div style={{
                  width: 14, height: 14, borderRadius: 4,
                  border: `1.5px solid ${filterVIP ? '#f59e0b' : '#555'}`,
                  background: filterVIP ? '#f59e0b' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .15s',
                }}>
                  {filterVIP && <Check size={10} color="#000" strokeWidth={3} />}
                </div>
                VIP mijoz
              </button>
              <button
                onClick={() => setFilterPromo(!filterPromo)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', borderRadius: 16, fontSize: 11, fontWeight: 500,
                  cursor: 'pointer', transition: 'all .15s',
                  background: filterPromo ? 'rgba(139,92,246,.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${filterPromo ? 'rgba(139,92,246,.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: filterPromo ? '#8b5cf6' : '#b8b8b8',
                }}
              >
                <div style={{
                  width: 14, height: 14, borderRadius: 4,
                  border: `1.5px solid ${filterPromo ? '#8b5cf6' : '#555'}`,
                  background: filterPromo ? '#8b5cf6' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .15s',
                }}>
                  {filterPromo && <Check size={10} color="#fff" strokeWidth={3} />}
                </div>
                Promo ishlatilgan
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  style={{
                    marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4,
                    padding: '5px 10px', borderRadius: 8, fontSize: 11,
                    background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)',
                    color: '#ef4444', cursor: 'pointer',
                  }}
                >
                  <X size={12} /> Tozalash
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div style={{ padding: '0 16px 8px' }} className="animate-fade-in">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
            background: 'rgba(229,30,30,.08)', border: '1px solid rgba(229,30,30,.2)',
            borderRadius: 10,
          }}>
            <div
              onClick={toggleAll}
              style={{
                width: 18, height: 18, borderRadius: 4,
                border: `2px solid ${selectedIds.length === paginated.length ? '#e51e1e' : '#555'}`,
                background: selectedIds.length === paginated.length ? '#e51e1e' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all .15s', flexShrink: 0,
              }}
            >
              {selectedIds.length === paginated.length && <Check size={11} color="#fff" strokeWidth={3} />}
            </div>
            <span style={{ color: '#fff', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>
              {selectedIds.length} ta tanlangan
            </span>
            <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', flexWrap: 'wrap' }}>
              <button
                onClick={handleExport}
                style={{
                  padding: '5px 10px', borderRadius: 6, fontSize: 10, fontWeight: 500,
                  background: 'rgba(59,130,246,.12)', border: '1px solid rgba(59,130,246,.2)',
                  color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <Download size={11} /> Eksport
              </button>
              <button
                onClick={() => window.print()}
                style={{
                  padding: '5px 10px', borderRadius: 6, fontSize: 10, fontWeight: 500,
                  background: 'rgba(139,92,246,.12)', border: '1px solid rgba(139,92,246,.2)',
                  color: '#8b5cf6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <Printer size={11} /> Chop etish
              </button>
              <button
                onClick={() => { handleBulkStatusChange('delivered'); }}
                style={{
                  padding: '5px 10px', borderRadius: 6, fontSize: 10, fontWeight: 500,
                  background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.2)',
                  color: '#22c55e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <Check size={11} /> Status o'zgartirish
              </button>
              <button
                onClick={handleBulkCancel}
                style={{
                  padding: '5px 10px', borderRadius: 6, fontSize: 10, fontWeight: 500,
                  background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.2)',
                  color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <X size={11} /> Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order List */}
      <div style={{ padding: '0 16px' }}>
        {paginated.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            <Package size={32} color="#333" style={{ margin: '0 auto 10px' }} />
            <p style={{ color: '#6b6b6b', fontSize: 13 }}>Buyurtmalar topilmadi</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }} className="stagger">
            {/* Table Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '30px 60px 50px 1fr 80px 90px 60px 34px',
              alignItems: 'center', gap: 6, padding: '6px 10px',
              background: 'transparent', borderRadius: 0,
            }}>
              <div
                onClick={toggleAll}
                style={{
                  width: 18, height: 18, borderRadius: 4,
                  border: `2px solid ${selectedIds.length === paginated.length && paginated.length > 0 ? '#e51e1e' : '#444'}`,
                  background: selectedIds.length === paginated.length && paginated.length > 0 ? '#e51e1e' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all .15s',
                }}
              >
                {selectedIds.length === paginated.length && paginated.length > 0 && <Check size={11} color="#fff" strokeWidth={3} />}
              </div>
              <span style={{ color: '#555', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>ID</span>
              <span style={{ color: '#555', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Vaqt</span>
              <span style={{ color: '#555', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Mijoz</span>
              <span style={{ color: '#555', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'right' }}>Summa</span>
              <span style={{ color: '#555', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Holat</span>
              <span style={{ color: '#555', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>To'lov</span>
              <span style={{ color: '#555', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Amal</span>
            </div>

            {/* Order Rows */}
            {paginated.map((o, idx) => {
              const sc = statusConfig[o.status] || statusConfig.pending;
              const isSelected = selectedIds.includes(o.id);
              return (
                <div
                  key={o.id}
                  className="card card-hover animate-fade-in"
                  style={{
                    padding: '10px', cursor: 'default',
                    background: isSelected ? 'rgba(229,30,30,.06)' : undefined,
                    borderColor: isSelected ? 'rgba(229,30,30,.2)' : undefined,
                    animationDelay: `${idx * 0.03}s`,
                  }}
                >
                  <div style={{
                    display: 'grid', gridTemplateColumns: '30px 60px 50px 1fr 80px 90px 60px 34px',
                    alignItems: 'center', gap: 6,
                  }}>
                    {/* Checkbox */}
                    <div
                      onClick={() => toggleSelect(o.id)}
                      style={{
                        width: 18, height: 18, borderRadius: 4,
                        border: `2px solid ${isSelected ? '#e51e1e' : '#444'}`,
                        background: isSelected ? '#e51e1e' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all .15s',
                      }}
                    >
                      {isSelected && <Check size={11} color="#fff" strokeWidth={3} />}
                    </div>

                    {/* Order ID */}
                    <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>
                      #{o.id}
                    </span>

                    {/* Time */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Clock size={10} color="#6b6b6b" />
                      <span style={{ color: '#b8b8b8', fontSize: 11 }}>{formatTime(o.createdAt)}</span>
                    </div>

                    {/* Customer */}
                    <div>
                      <p style={{ color: '#fff', fontSize: 12, fontWeight: 500, lineHeight: 1.2 }}>{o.customerName}</p>
                      <p style={{ color: '#6b6b6b', fontSize: 10 }}>{o.customerPhone}</p>
                    </div>

                    {/* Sum */}
                    <span style={{ color: '#fff', fontSize: 12, fontWeight: 600, textAlign: 'right', fontFamily: 'var(--font-display)' }}>
                      {o.total.toLocaleString()}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`badge ${o.status === 'delivered' ? 'badge-green' : o.status === 'cancelled' ? 'badge-red' : 'badge-yellow'}`}
                      style={{ fontSize: 9, padding: '3px 6px', whiteSpace: 'nowrap' }}
                    >
                      {sc.icon} {sc.label}
                    </span>

                    {/* Payment Badge */}
                    <span
                      className={`badge ${o.paymentMethod === 'card' ? 'badge-green' : 'badge-yellow'}`}
                      style={{ fontSize: 9, padding: '3px 6px', whiteSpace: 'nowrap' }}
                    >
                      {o.paymentMethod === 'cash' ? '💵 Naqd' : '💳 Karta'}
                    </span>

                    {/* View Button */}
                    <button
                      onClick={() => setDetailOrder(o)}
                      className="btn btn-primary"
                      style={{
                        width: 30, height: 30, padding: 0, borderRadius: 8,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all .2s',
                      }}
                    >
                      <Eye size={13} color="#fff" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: currentPage === 1 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: currentPage === 1 ? '#333' : '#fff',
              fontSize: 12, cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: page === currentPage ? '#e51e1e' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${page === currentPage ? '#e51e1e' : 'rgba(255,255,255,0.08)'}`,
                color: '#fff', fontSize: 12, fontWeight: page === currentPage ? 600 : 400,
                cursor: 'pointer', transition: 'all .15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: currentPage === totalPages ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: currentPage === totalPages ? '#333' : '#fff',
              fontSize: 12, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>
      )}

      {/* Bottom spacer */}
      <div style={{ height: 24 }} />

      {/* Order Detail Modal - Bottom Sheet */}
      {detailOrder && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            animation: 'fadeIn 0.2s',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setDetailOrder(null); }}
        >
          <div
            className="animate-fade-in"
            style={{
              width: '100%', maxWidth: 480, maxHeight: '88vh',
              background: '#1a1a1a', borderRadius: '16px 16px 0 0',
              overflow: 'hidden', display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '16px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#fff', fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                  Buyurtma #{detailOrder.id}
                </span>
                <span
                  className={`badge ${detailOrder.status === 'delivered' ? 'badge-green' : detailOrder.status === 'cancelled' ? 'badge-red' : 'badge-yellow'}`}
                  style={{ fontSize: 10, padding: '2px 8px' }}
                >
                  {statusConfig[detailOrder.status]?.label}
                </span>
              </div>
              <button
                onClick={() => setDetailOrder(null)}
                style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: 'rgba(255,255,255,0.06)', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all .2s',
                }}
              >
                <X size={16} color="#fff" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }} className="scrollbar-hide">
              {/* Timeline */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ color: '#6b6b6b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                  Buyurtma tarixi
                </p>
                {getTimeline(detailOrder).map((step, i, arr) => (
                  <div key={i} style={{ display: 'flex', gap: 10, position: 'relative', paddingBottom: i < arr.length - 1 ? 16 : 0 }}>
                    {/* Vertical line */}
                    {i < arr.length - 1 && (
                      <div style={{
                        position: 'absolute', left: 9, top: 20, width: 2, height: 'calc(100% - 12px)',
                        background: 'rgba(255,255,255,0.08)',
                      }} />
                    )}
                    {/* Circle */}
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      background: step.done ? 'rgba(229,30,30,.15)' : 'rgba(255,255,255,0.06)',
                      border: `2px solid ${step.done ? '#e51e1e' : '#444'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {step.done && <Check size={10} color="#e51e1e" strokeWidth={3} />}
                    </div>
                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: step.done ? '#fff' : '#666', fontSize: 12, fontWeight: 500 }}>
                          {step.label}
                        </span>
                        <span style={{ color: '#6b6b6b', fontSize: 10 }}>{step.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Info */}
              <div className="card" style={{ padding: 14, marginBottom: 12 }}>
                <p style={{ color: '#6b6b6b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                  Mijoz ma'lumotlari
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'rgba(229,30,30,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14,
                    }}>
                      👤
                    </div>
                    <div>
                      <p style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{detailOrder.customerName}</p>
                      <p style={{ color: '#6b6b6b', fontSize: 11 }}>{detailOrder.customerPhone}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'rgba(59,130,246,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, flexShrink: 0,
                    }}>
                      📍
                    </div>
                    <p style={{ color: '#b8b8b8', fontSize: 12, lineHeight: 1.4, paddingTop: 5 }}>{detailOrder.address}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="card" style={{ padding: 14, marginBottom: 12 }}>
                <p style={{ color: '#6b6b6b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                  Buyurtma tarkibi
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {detailOrder.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 8,
                          background: 'rgba(255,255,255,0.04)', overflow: 'hidden',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          {item.food?.image ? (
                            <img src={item.food.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <Package size={16} color="#555" />
                          )}
                        </div>
                        <div>
                          <p style={{ color: '#fff', fontSize: 12, fontWeight: 500 }}>{item.food?.name || 'Noma\'lum'}</p>
                          <p style={{ color: '#6b6b6b', fontSize: 10 }}>{item.quantity} x {item.price?.toLocaleString()} so'm</p>
                        </div>
                      </div>
                      <span style={{ color: '#fff', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                        {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Jami</span>
                  <span style={{ color: '#e51e1e', fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                    {detailOrder.total.toLocaleString()} so'm
                  </span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="card" style={{ padding: 14, marginBottom: 12 }}>
                <p style={{ color: '#6b6b6b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                  To'lov ma'lumotlari
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 20 }}>{detailOrder.paymentMethod === 'cash' ? '💵' : '💳'}</span>
                    <div>
                      <p style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>
                        {detailOrder.paymentMethod === 'cash' ? 'Naqd pul' : 'Plastik karta'}
                      </p>
                      <p style={{ color: '#6b6b6b', fontSize: 11 }}>{formatDate(detailOrder.createdAt)}</p>
                    </div>
                  </div>
                  <span className="badge badge-green" style={{ fontSize: 10 }}>
                    To'langan
                  </span>
                </div>
              </div>

              {/* Notes */}
              {detailOrder.notes && (
                <div className="card" style={{ padding: 14, marginBottom: 12 }}>
                  <p style={{ color: '#6b6b6b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                    Eslatmalar
                  </p>
                  <p style={{ color: '#b8b8b8', fontSize: 12, lineHeight: 1.5, background: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 8, fontStyle: 'italic' }}>
                    "{detailOrder.notes}"
                  </p>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                {detailOrder.status !== 'delivered' && detailOrder.status !== 'cancelled' && (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        const currentIdx = statusOrder.indexOf(detailOrder.status);
                        if (currentIdx < statusOrder.length - 1) {
                          updateOrderStatus(detailOrder.id, statusOrder[currentIdx + 1]);
                          setDetailOrder({ ...detailOrder, status: statusOrder[currentIdx + 1] });
                        }
                      }}
                      style={{
                        flex: 1, height: 40, fontSize: 12, fontWeight: 600,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}
                    >
                      <ChevronRight size={14} /> Keyingi holat
                    </button>
                    <button
                      onClick={() => {
                        cancelOrder(detailOrder.id);
                        setDetailOrder({ ...detailOrder, status: 'cancelled' });
                      }}
                      style={{
                        height: 40, padding: '0 16px', borderRadius: 'var(--radius)',
                        background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.2)',
                        color: '#ef4444', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}
                    >
                      <X size={14} /> Bekor qilish
                    </button>
                  </>
                )}
                <button
                  onClick={() => window.print()}
                  style={{
                    height: 40, padding: '0 16px', borderRadius: 'var(--radius)',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                    color: '#b8b8b8', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  <Printer size={14} /> Chop etish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}