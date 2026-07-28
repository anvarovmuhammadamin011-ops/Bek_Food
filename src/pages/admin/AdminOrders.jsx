import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Check, X, Eye, Clock, Download, Printer, Package, User, MapPin,
  CreditCard, Banknote, AlertCircle, ArrowRight, ShoppingCart
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

const useCountUp = (target, duration = 800) => {
  const [value, setValue] = useState(0);
  const startTime = performance.now();
  const animate = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    setValue(Math.floor(eased * target));
    if (progress < 1) requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
  return value;
};

const statusConfig = {
  pending: { label: 'Kutilmoqda', color: 'var(--warning)', bg: 'var(--warning-bg)' },
  preparing: { label: 'Tayyorlanmoqda', color: 'var(--primary)', bg: 'var(--primary-light)' },
  ready: { label: 'Tayyor', color: 'var(--success)', bg: 'var(--success-bg)' },
  onTheWay: { label: "Yo'lda", color: '#8B5CF6', bg: 'rgba(139,92,246,.1)' },
  delivered: { label: 'Yetkazilgan', color: 'var(--success)', bg: 'var(--success-bg)' },
  cancelled: { label: 'Bekor qilingan', color: 'var(--danger)', bg: 'var(--danger-bg)' },
};

const statusOrder = ['pending', 'preparing', 'ready', 'onTheWay', 'delivered'];

function formatCurrency(n) {
  return (n ?? 0).toLocaleString() + " so'm";
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

const baseBtn = {
  padding: '7px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600,
  border: '1px solid var(--border)', cursor: 'pointer', transition: 'all .2s',
  display: 'inline-flex', alignItems: 'center', gap: 6,
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
    if (filterStatus !== 'all') list = list.filter(o => o.status === filterStatus);
    if (filterPayment !== 'all') list = list.filter(o => o.paymentMethod === filterPayment);
    if (filterMinSum) list = list.filter(o => o.total >= Number(filterMinSum));
    if (filterMaxSum) list = list.filter(o => o.total <= Number(filterMaxSum));
    if (filterVIP) list = list.filter(o => o.priority === 'high');
    if (filterPromo) list = list.filter(o => o.notes && o.notes.length > 0);
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: '100%' }}>
      <motion.div variants={itemVariants} initial="hidden" animate="visible" style={{ padding: '28px 0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Buyurtmalar</h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '4px 0 0' }}>Barcha buyurtmalarni boshqaring</p>
          </div>
          <button onClick={handleExport} style={{
            width: 40, height: 40, borderRadius: 12, background: 'var(--primary)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(249,115,22,.25)', transition: 'all .2s',
          }}>
            <Download size={18} color="#fff" />
          </button>
        </div>
      </motion.div>

      <button onClick={() => setFiltersOpen(!filtersOpen)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, width: '100%', marginBottom: 16,
          padding: '10px 18px', borderRadius: 14, fontSize: 13, fontWeight: 500,
          border: '1px solid ' + (hasActiveFilters ? 'var(--primary)' : 'var(--border)'),
          background: hasActiveFilters ? 'var(--primary-light)' : 'var(--surface)',
          color: hasActiveFilters ? 'var(--primary)' : 'var(--text-secondary)',
          cursor: 'pointer', transition: 'all .2s',
        }}>
        <Filter size={15} />
        Filtrlar
        {hasActiveFilters && (
          <span style={{
            background: 'var(--primary)', color: '#fff', borderRadius: '50%',
            width: 20, height: 20, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 10, fontWeight: 700,
          }}>{activeFilterCount}</span>
        )}
        <div style={{ marginLeft: 'auto' }}>
          {filtersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      <AnimatePresence>
        {filtersOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
            <div style={{
              marginBottom: 20, padding: 20, background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 16,
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Sana</label>
                  <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Holat</label>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selectStyle}>
                    <option value="all">Barchasi</option>
                    {Object.entries(statusConfig).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>To'lov turi</label>
                  <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)} style={selectStyle}>
                    <option value="all">Barchasi</option>
                    <option value="cash">Naqd</option>
                    <option value="card">Karta</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Summa (min)</label>
                  <input type="number" placeholder="0" value={filterMinSum} onChange={e => setFilterMinSum(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Summa (max)</label>
                  <input type="number" placeholder="999999" value={filterMaxSum} onChange={e => setFilterMaxSum(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Qidirish</label>
                  <div style={{ position: 'relative' }}>
                    <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input type="text" placeholder="ID, nomi, telefon..." value={search}
                      onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                      style={{ ...inputStyle, paddingLeft: 36 }} />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                {['VIP', 'promo'].map(type => {
                  const active = type === 'VIP' ? filterVIP : filterPromo;
                  const toggle = type === 'VIP' ? () => setFilterVIP(!filterVIP) : () => setFilterPromo(!filterPromo);
                  return (
                    <button key={type} onClick={toggle} style={{
                      ...baseBtn, background: active ? 'var(--primary-light)' : 'var(--bg)',
                      borderColor: active ? 'var(--primary)' : 'var(--border)',
                      color: active ? 'var(--primary)' : 'var(--text-muted)',
                    }}>
                      <div style={checkboxStyle(active)}>
                        {active && <Check size={10} color="#fff" strokeWidth={3} />}
                      </div>
                      {type === 'VIP' ? 'VIP mijoz' : 'Promo ishlatilgan'}
                    </button>
                  );
                })}
                {hasActiveFilters && (
                  <button onClick={clearFilters} style={{
                    ...baseBtn, marginLeft: 'auto',
                    background: 'rgba(239,68,68,.08)', borderColor: 'rgba(239,68,68,.15)', color: 'var(--danger)',
                  }}>
                    <X size={13} /> Tozalash
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{
              marginBottom: 14, padding: '10px 16px', background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 12,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
            <div onClick={toggleAll} style={checkboxStyle(selectedIds.length === paginated.length)}>
              {selectedIds.length === paginated.length && <Check size={11} color="#fff" strokeWidth={3} />}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap' }}>
              {selectedIds.length} ta tanlangan
            </span>
            <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', flexWrap: 'wrap' }}>
              {[
                { label: 'Eksport', icon: Download, color: '#3b82f6', action: handleExport },
                { label: 'Chop etish', icon: Printer, color: '#8b5cf6', action: () => window.print() },
                { label: 'Yetkazilgan', icon: Check, color: 'var(--success)', action: () => handleBulkStatusChange('delivered') },
                { label: 'Bekor qilish', icon: X, color: 'var(--danger)', action: handleBulkCancel },
              ].map((btn, i) => (
                <button key={i} onClick={btn.action} style={bulkActionBtn(btn.color)}>
                  <btn.icon size={12} /> {btn.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {paginated.length === 0 ? (
          <motion.div variants={itemVariants} style={{
            padding: 60, textAlign: 'center', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 16,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 14, background: 'var(--bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
            }}>
              <Package size={28} color="var(--text-muted)" />
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4 }}>Buyurtmalar topilmadi</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Filtrlarni o'zgartirib ko'ring</p>
          </motion.div>
        ) : (
          <>
            <motion.div variants={itemVariants} style={{
              display: 'grid', gridTemplateColumns: '36px 68px 72px 1fr 100px 120px 90px 36px',
              alignItems: 'center', gap: 8, padding: '8px 16px',
            }}>
              <div onClick={toggleAll} style={checkboxStyle(selectedIds.length === paginated.length && paginated.length > 0)}>
                {selectedIds.length === paginated.length && paginated.length > 0 && <Check size={11} color="#fff" strokeWidth={3} />}
              </div>
              <span style={thStyle}>ID</span>
              <span style={thStyle}>Vaqt</span>
              <span style={thStyle}>Mijoz</span>
              <span style={{ ...thStyle, textAlign: 'right' }}>Summa</span>
              <span style={thStyle}>Holat</span>
              <span style={thStyle}>To'lov</span>
              <span></span>
            </motion.div>
            {paginated.map((o, idx) => {
              const sc = statusConfig[o.status] || statusConfig.pending;
              const isSelected = selectedIds.includes(o.id);
              return (
                <motion.div key={o.id} variants={itemVariants}
                  style={{
                    background: isSelected ? 'var(--primary-light)' : 'var(--surface)',
                    border: '1px solid ' + (isSelected ? 'var(--primary)' : 'var(--border)'),
                    borderRadius: 12, padding: '10px 16px', cursor: 'default',
                    transition: 'all .2s',
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                  onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; } }}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: '36px 68px 72px 1fr 100px 120px 90px 36px',
                    alignItems: 'center', gap: 8,
                  }}>
                    <div onClick={() => toggleSelect(o.id)} style={checkboxStyle(isSelected)}>
                      {isSelected && <Check size={11} color="#fff" strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>#{o.id}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Clock size={12} color="var(--text-muted)" />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{formatTime(o.createdAt)}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', margin: 0, lineHeight: 1.3 }}>{o.customerName}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>{o.customerPhone}</p>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
                      {o.total.toLocaleString()}
                    </span>
                    <span><Badge variant={o.status === 'cancelled' ? 'danger' : o.status === 'delivered' ? 'success' : o.status === 'pending' ? 'warning' : 'info'} size="sm">{sc.label}</Badge></span>
                    <span><Badge variant={o.paymentMethod === 'card' ? 'success' : 'warning'} size="sm">
                      {o.paymentMethod === 'cash' ? 'Naqd' : 'Karta'}
                    </Badge></span>
                    <button onClick={() => setDetailOrder(o)} style={{
                      width: 34, height: 34, borderRadius: 10, background: 'var(--primary)',
                      border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'all .2s', boxShadow: '0 1px 4px rgba(249,115,22,.2)',
                    }}>
                      <Eye size={15} color="#fff" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </>
        )}
      </motion.div>

      {totalPages > 1 && (
        <div style={{ padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            style={navBtnStyle(currentPage === 1)}>
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => setCurrentPage(page)}
              style={pageBtnStyle(page === currentPage)}>
              {page}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            style={navBtnStyle(currentPage === totalPages)}>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      <AnimatePresence>
        {detailOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,.4)',
              backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            }}
            onClick={e => { if (e.target === e.currentTarget) setDetailOrder(null); }}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                width: '100%', maxWidth: 520, maxHeight: '90vh', background: 'var(--surface)',
                borderRadius: '20px 20px 0 0', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                boxShadow: '0 -4px 24px rgba(0,0,0,.12)',
              }}>
              <div style={{
                padding: '20px 24px 16px', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
              }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  Buyurtma #{detailOrder.id}
                  <Badge variant={detailOrder.status === 'cancelled' ? 'danger' : detailOrder.status === 'delivered' ? 'success' : 'info'} size="sm">
                    {statusConfig[detailOrder.status]?.label}
                  </Badge>
                </span>
                <button onClick={() => setDetailOrder(null)} style={{
                  width: 34, height: 34, borderRadius: 10, background: 'var(--bg)',
                  border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)',
                }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                <div style={{ marginBottom: 24 }}>
                  <p style={sectionTitle}>Buyurtma tarixi</p>
                  {getTimeline(detailOrder).map((step, i, arr) => (
                    <div key={i} style={{ display: 'flex', gap: 12, position: 'relative', paddingBottom: i < arr.length - 1 ? 16 : 0 }}>
                      {i < arr.length - 1 && <div style={{ position: 'absolute', left: 11, top: 24, width: 2, height: 'calc(100% - 8px)', background: 'var(--border)' }} />}
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                        background: step.done ? 'var(--primary-light)' : 'var(--bg)',
                        border: '2px solid ' + (step.done ? 'var(--primary)' : 'var(--border-strong)'),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {step.done && <Check size={11} color="var(--primary)" strokeWidth={3} />}
                      </div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: step.done ? 'var(--text)' : 'var(--text-muted)' }}>{step.label}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{step.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={infoCard}>
                  <p style={sectionTitle}>Mijoz ma'lumotlari</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={infoIcon('var(--primary-light)')}><User size={16} color="var(--primary)" /></div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', margin: 0 }}>{detailOrder.customerName}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>{detailOrder.customerPhone}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={infoIcon('rgba(59,130,246,.1)')}><MapPin size={16} color="#3b82f6" /></div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{detailOrder.address}</p>
                    </div>
                  </div>
                </div>

                <div style={infoCard}>
                  <p style={sectionTitle}>Buyurtma tarkibi</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {detailOrder.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 42, height: 42, borderRadius: 10, background: 'var(--surface)',
                            border: '1px solid var(--border)', overflow: 'hidden', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            {item.food?.image ? (
                              <img src={item.food.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : <Package size={18} color="var(--text-muted)" />}
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', margin: 0 }}>{item.food?.name || "Noma'lum"}</p>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>{item.quantity} x {item.price?.toLocaleString()} so'm</p>
                          </div>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Jami</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>
                      {detailOrder.total.toLocaleString()} so'm
                    </span>
                  </div>
                </div>

                <div style={infoCard}>
                  <p style={sectionTitle}>To'lov ma'lumotlari</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={infoIcon(detailOrder.paymentMethod === 'cash' ? 'rgba(245,158,11,.1)' : 'rgba(34,197,94,.1)')}>
                        {detailOrder.paymentMethod === 'cash' ? <Banknote size={18} color="var(--warning)" /> : <CreditCard size={18} color="var(--success)" />}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', margin: 0 }}>
                          {detailOrder.paymentMethod === 'cash' ? 'Naqd pul' : 'Plastik karta'}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>{formatDate(detailOrder.createdAt)}</p>
                      </div>
                    </div>
                    <Badge variant="success" size="sm">To'langan</Badge>
                  </div>
                </div>

                {detailOrder.notes && (
                  <div style={infoCard}>
                    <p style={sectionTitle}>Eslatmalar</p>
                    <p style={{
                      fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0,
                      padding: 12, background: 'var(--surface)', borderRadius: 10,
                      border: '1px solid var(--border)', fontStyle: 'italic',
                    }}>
                      "{detailOrder.notes}"
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  {detailOrder.status !== 'delivered' && detailOrder.status !== 'cancelled' && (
                    <>
                      <button
                        onClick={() => {
                          const currentIdx = statusOrder.indexOf(detailOrder.status);
                          if (currentIdx < statusOrder.length - 1) {
                            updateOrderStatus(detailOrder.id, statusOrder[currentIdx + 1]);
                            setDetailOrder({ ...detailOrder, status: statusOrder[currentIdx + 1] });
                          }
                        }}
                        style={actionBtnStyle('primary')}>
                        <ArrowRight size={15} /> Keyingi holat
                      </button>
                      <button
                        onClick={() => {
                          cancelOrder(detailOrder.id);
                          setDetailOrder({ ...detailOrder, status: 'cancelled' });
                        }}
                        style={actionBtnStyle('danger')}>
                        <X size={15} /> Bekor qilish
                      </button>
                    </>
                  )}
                  <button onClick={() => window.print()} style={actionBtnStyle('default')}>
                    <Printer size={15} /> Chop etish
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const labelStyle = { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 6, display: 'block' };
const inputStyle = {
  width: '100%', padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)',
  borderRadius: 10, color: 'var(--text)', fontSize: 13, outline: 'none', transition: 'border-color .2s',
  boxSizing: 'border-box',
};
const selectStyle = {
  ...inputStyle, padding: '10px 32px 10px 12px', cursor: 'pointer', appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239ca3af' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
};
const checkboxStyle = (active) => ({
  width: 20, height: 20, borderRadius: 5,
  border: '2px solid ' + (active ? 'var(--primary)' : 'var(--border-strong)'),
  background: active ? 'var(--primary)' : 'transparent',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  transition: 'all .15s', flexShrink: 0,
});
const thStyle = { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' };
const bulkActionBtn = (color) => ({
  padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 500,
  background: `${color}10`, border: `1px solid ${color}25`, color,
  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
  transition: 'all .15s',
});
const pageBtnStyle = (active) => ({
  width: 36, height: 36, borderRadius: 10,
  background: active ? 'var(--primary)' : 'var(--surface)',
  border: '1px solid ' + (active ? 'var(--primary)' : 'var(--border)'),
  color: active ? '#fff' : 'var(--text-secondary)',
  fontSize: 13, fontWeight: active ? 600 : 400, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all .15s',
});
const navBtnStyle = (disabled) => ({
  width: 36, height: 36, borderRadius: 10, background: 'var(--surface)',
  border: '1px solid var(--border)', color: disabled ? 'var(--border-strong)' : 'var(--text-secondary)',
  cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center',
  justifyContent: 'center', opacity: disabled ? 0.5 : 1,
});
const sectionTitle = { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14, marginTop: 0 };
const infoCard = {
  padding: 16, background: 'var(--bg)', border: '1px solid var(--border)',
  borderRadius: 12, marginBottom: 12,
};
const infoIcon = (bg) => ({
  width: 36, height: 36, borderRadius: 10, background: bg,
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
});
const actionBtnStyle = (variant) => ({
  flex: variant === 'primary' ? 1 : 'none',
  height: 44, padding: variant === 'primary' ? 0 : '0 20px',
  borderRadius: 12,
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
  fontSize: 13, fontWeight: 600, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
  transition: 'all .15s',
  boxShadow: variant === 'primary' ? '0 2px 8px rgba(249,115,22,.25)' : 'none',
});
