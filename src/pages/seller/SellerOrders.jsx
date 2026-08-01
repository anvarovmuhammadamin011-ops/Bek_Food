import { useState, useEffect, useCallback } from 'react';
import useStore from '../../store/useStore';
import { useSearchParams } from 'react-router-dom';
import { printReceipt } from '../../utils/receipt';
import {
  Check,
  X,
  Clock,
  ChefHat,
  Bell,
  Package,
  ArrowRight,
  Search,
  Phone,
  Printer,
  LayoutGrid,
  List,
  Bike,
  CheckCircle2,
  PackageCheck,
  Banknote,
  CreditCard,
} from 'lucide-react';

const COLUMNS = [
  { key: 'pending', label: 'Yangi', icon: Bell, accent: '#EF4444' },
  { key: 'confirmed', label: 'Tasdiqlandi', icon: CheckCircle2, accent: '#F59E0B' },
  { key: 'preparing', label: 'Tayyorlanmoqda', icon: ChefHat, accent: '#F97316' },
  { key: 'ready', label: 'Tayyor', icon: PackageCheck, accent: '#22C55E' },
  { key: 'assigned', label: 'Kuryer tayinlandi', icon: Bike, accent: '#F59E0B' },
  { key: 'onTheWay', label: 'Kuryer ketdi', icon: Bike, accent: '#3B82F6' },
  { key: 'pickedUp', label: 'Olib ketildi', icon: PackageCheck, accent: '#8B5CF6' },
  { key: 'delivered', label: 'Yakunlangan', icon: Package, accent: '#6B7280' },
];

const STATUS_META = {
  pending: { label: 'Yangi', color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
  confirmed: { label: 'Tasdiqlandi', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  preparing: { label: 'Tayyorlanmoqda', color: '#F97316', bg: 'rgba(249,115,22,0.08)' },
  ready: { label: 'Tayyor', color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  assigned: { label: 'Kuryer tayinlandi', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  onTheWay: { label: 'Kuryer ketdi', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  pickedUp: { label: 'Olib ketildi', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' },
  delivered: { label: 'Yetkazildi', color: '#6B7280', bg: 'rgba(107,114,128,0.08)' },
  cancelled: { label: 'Bekor', color: '#9CA3AF', bg: 'rgba(156,163,175,0.08)' },
};

const s = {
  root: { minHeight: '100vh', background: 'var(--bg)' },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(24px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
    borderBottom: '1px solid var(--border)',
  },
  headerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    maxWidth: 1200,
    margin: '0 auto',
  },
  title: { fontSize: 18, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em', margin: 0 },
  viewToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    background: 'var(--surface)',
    borderRadius: 'var(--radius-sm)',
    padding: 3,
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-sm)',
  },
  viewBtn: (active) => ({
    padding: '6px 12px',
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    background: active ? 'var(--primary)' : 'transparent',
    color: active ? '#fff' : 'var(--text-muted)',
  }),
  toolbar: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 16px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  searchWrap: { position: 'relative', flex: 1, minWidth: 220, maxWidth: 320 },
  searchInput: {
    width: '100%',
    padding: '9px 14px 9px 36px',
    borderRadius: 999,
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text)',
    fontSize: 13,
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' },
  filters: {
    display: 'flex',
    gap: 6,
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    paddingBottom: 2,
  },
  filterChip: (active) => ({
    padding: '6px 14px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
    background: active ? 'var(--primary-light)' : 'var(--surface)',
    color: active ? 'var(--primary)' : 'var(--text-muted)',
    boxShadow: active ? '0 0 0 1.5px var(--primary)' : 'var(--shadow-sm)',
    fontFamily: 'inherit',
  }),
  content: { maxWidth: 1200, margin: '0 auto', padding: '0 16px 60px' },
  kanbanScroll: { display: 'flex', gap: 12, overflowX: 'auto', padding: '0 0 16px', scrollbarWidth: 'none' },
  column: { flex: '0 0 280px', minWidth: 280, display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 180px)' },
  colHeader: (accent) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 14px',
    borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderBottom: `2px solid ${accent}`,
  }),
  colDot: (accent) => ({ width: 8, height: 8, borderRadius: '50%', background: accent, boxShadow: `0 0 8px ${accent}33` }),
  colCount: (accent) => ({
    fontSize: 11,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 999,
    background: `${accent}12`,
    color: accent,
  }),
  colBody: { flex: 1, overflowY: 'auto', padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 8, scrollbarWidth: 'none' },
  emptyCol: {
    padding: '32px 12px',
    textAlign: 'center',
    background: 'var(--surface)',
    borderRadius: '0 0 var(--radius-sm) var(--radius-sm)',
    border: '1px solid var(--border)',
    borderTop: 'none',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: 14,
    boxShadow: 'var(--shadow-sm)',
  },
  cardId: { fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: 0 },
  cardTime: { fontSize: 11, color: 'var(--text-muted)' },
  badge: (color, bg) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 8px',
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 600,
    color,
    background: bg,
  }),
  divider: { height: 1, background: 'var(--border)', margin: '8px 0' },
  cardTotalLabel: { fontSize: 11, color: 'var(--text-muted)' },
  cardTotalValue: { fontSize: 15, fontWeight: 700, color: 'var(--text)' },
  acceptBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    padding: '9px 0',
    borderRadius: 10,
    border: 'none',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    background: 'var(--success)',
    color: '#fff',
    fontFamily: 'inherit',
  },
  rejectBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '9px 12px',
    borderRadius: 10,
    border: '1px solid rgba(239,68,68,0.2)',
    background: 'rgba(239,68,68,0.06)',
    color: 'var(--danger)',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  actionBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    padding: '9px 0',
    borderRadius: 10,
    border: 'none',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  iconBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 10,
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  courierBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    flex: 1,
    padding: '9px 0',
    borderRadius: 10,
    border: 'none',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    background: '#3B82F6',
    color: '#fff',
    fontFamily: 'inherit',
  },
  courierDropdown: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    marginBottom: 6,
    padding: 6,
    zIndex: 10,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow-lg)',
  },
  courierOption: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    padding: '8px 10px',
    background: 'transparent',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    color: 'var(--text)',
    fontSize: 12,
  },
  courierAvatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'var(--primary-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--primary)',
  },
  timer: (overdue) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'JetBrains Mono', monospace",
    color: overdue ? 'var(--danger)' : 'var(--primary)',
    background: overdue ? 'rgba(239,68,68,0.08)' : 'var(--primary-light)',
    padding: '4px 10px',
    borderRadius: 8,
    border: overdue ? '1px solid rgba(239,68,68,0.15)' : '1px solid rgba(249,115,22,0.15)',
  }),
  listWrap: {
    overflow: 'hidden',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    boxShadow: 'var(--shadow-sm)',
  },
  listHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 14px',
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border-strong)',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
  },
  listRow: { display: 'flex', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid var(--border)', fontSize: 13, gap: 8 },
  statusBadge: (color, bg) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 10px',
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 600,
    color,
    background: bg,
  }),
};

const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
const formatPrice = (n) => Number(n).toLocaleString('uz-UZ') + " so'm";
const shortId = (id) => '#' + String(id).slice(-4);

function Timer({ startTime }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - new Date(startTime).getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const overdue = elapsed > 900;
  return (
    <div style={s.timer(overdue)}>
      <Clock size={12} />
      <span>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
      {overdue && <span style={{ fontSize: 10, marginLeft: 2, color: 'var(--danger)' }}>Kechikdi!</span>}
    </div>
  );
}

function OrderCard({ order, onAccept, onReject, onPreparing, onReady, onAssignCourier, employees, settings }) {
  const [showCourierSelect, setShowCourierSelect] = useState(false);
  const couriers = employees.filter((e) => e.role === 'courier' && e.isOnline);
  const isPickup = order.deliveryType === 'pickup';

  return (
    <div style={s.card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={s.cardId}>{shortId(order.id)}</span>
          <span style={s.cardTime}>{formatTime(order.createdAt)}</span>
        </div>
        {order.priority === 'high' && (
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--danger)', background: 'rgba(239,68,68,0.08)', padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.15)' }}>Tezkor</span>
        )}
      </div>

      <div style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', margin: 0 }}>{order.customerName}</p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>{order.customerPhone}</p>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={s.badge(isPickup ? '#8B5CF6' : '#3B82F6', isPickup ? 'rgba(139,92,246,0.08)' : 'rgba(59,130,246,0.08)')}>
          {isPickup ? 'Olib ketish' : 'Yetkazish'}
        </span>
        <span style={s.badge(order.paymentMethod === 'card' ? '#0EA5E9' : '#10B981', 'rgba(16,185,129,0.08)')}>
          {order.paymentMethod === 'card' ? <CreditCard size={10} /> : <Banknote size={10} />}
          {order.paymentMethod === 'card' ? 'Karta' : 'Naqd'}
        </span>
      </div>

      <div style={{ marginBottom: 8 }}>
        {order.items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '3px 0', fontSize: 12 }}>
            <span style={{ color: 'var(--text-muted)' }}>{item.quantity}x {item.food.name}</span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div style={s.divider} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <span style={s.cardTotalLabel}>Jami · </span>
          <span style={s.cardTotalValue}>{formatPrice(order.total)}</span>
        </div>
        {(order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing') && (
          <Timer startTime={order.createdAt} />
        )}
      </div>

      {order.status === 'pending' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onAccept(order.id)} style={{ ...s.acceptBtn, background: 'var(--success)' }}>
            <Check size={13} /> Qabul qilish
          </button>
          <button onClick={() => onReject(order.id)} style={s.rejectBtn}>
            <X size={13} />
          </button>
        </div>
      )}

      {order.status === 'confirmed' && (
        <button onClick={() => onPreparing(order.id)} style={{ ...s.actionBtn, background: 'var(--primary)', color: '#fff' }}>
          <ChefHat size={13} /> Tayyorlashni boshlash
        </button>
      )}

      {order.status === 'preparing' && (
        <button onClick={() => onReady(order.id)} style={{ ...s.actionBtn, background: 'var(--success)', color: '#fff' }}>
          <PackageCheck size={13} /> Tayyor
        </button>
      )}

      {order.status === 'ready' && (
        <div style={{ position: 'relative', display: 'flex', gap: 8 }}>
          <button onClick={() => setShowCourierSelect(!showCourierSelect)} style={s.courierBtn}>
            <Bike size={13} /> Kuryer berish <ArrowRight size={13} />
          </button>
          {showCourierSelect && (
            <div style={s.courierDropdown}>
              {couriers.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 11, padding: '6px 8px', textAlign: 'center' }}>Kuryerlar yo'q</p>}
              {couriers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { onAssignCourier(order.id, c.id); setShowCourierSelect(false); }}
                  style={s.courierOption}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={s.courierAvatar}>{c.name.charAt(0)}</div>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', margin: 0 }}>{c.name}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0 }}>{c.rating} reyting</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {['assigned', 'onTheWay', 'pickedUp', 'delivered'].includes(order.status) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, flex: 1 }}>
            {order.status === 'assigned' && 'Kuryer qabul qilishini kutilmoqda'}
            {order.status === 'onTheWay' && 'Kuryer buyurtmani olib ketmoqda'}
            {order.status === 'pickedUp' && 'Kuryer yetkazmoqda'}
            {order.status === 'delivered' && 'Yetkazib berildi'}
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => printReceipt(order, settings)} style={s.iconBtn} title="Chek chop etish">
              <Printer size={15} />
            </button>
            {order.status !== 'delivered' && (() => {
              const courier = employees.find((e) => e.id === order.courierId);
              return (
                <button onClick={() => { if (courier?.phone) window.location.href = 'tel:' + courier.phone; }} style={s.iconBtn} title={`Kuryerga qo'ng'iroq (${courier?.name || ''})`}>
                  <Bike size={15} />
                </button>
              );
            })()}
            <button onClick={() => { if (order.customerPhone) window.location.href = 'tel:' + order.customerPhone; }} style={s.iconBtn} title="Qo'ng'iroq qilish">
              <Phone size={15} />
            </button>
          </div>
        </div>
      )}

      {(order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing' || order.status === 'ready') && (
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          <button onClick={() => printReceipt(order, settings)} style={{ ...s.iconBtn, flex: 1 }} title="Chek chop etish">
            <Printer size={14} /> <span style={{ fontSize: 11, fontWeight: 600 }}>Chek</span>
          </button>
          <button onClick={() => { if (order.customerPhone) window.location.href = 'tel:' + order.customerPhone; }} style={{ ...s.iconBtn, flex: 1 }} title="Qo'ng'iroq qilish">
            <Phone size={14} /> <span style={{ fontSize: 11, fontWeight: 600 }}>Qo'ng'iroq</span>
          </button>
        </div>
      )}
    </div>
  );
}

function KanbanView({ orders, ...handlers }) {
  return (
    <div style={s.kanbanScroll}>
      {COLUMNS.map((col) => {
        const colOrders = orders.filter((o) => o.status === col.key);
        const Icon = col.icon;
        return (
          <div key={col.key} style={s.column}>
            <div style={s.colHeader(col.accent)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={s.colDot(col.accent)} />
                <Icon size={13} style={{ color: col.accent }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{col.label}</span>
              </div>
              <span style={s.colCount(col.accent)}>{colOrders.length}</span>
            </div>
            <div style={s.colBody}>
              {colOrders.length === 0 ? (
                <div style={s.emptyCol}>
                  <Package size={24} style={{ color: 'var(--border-strong)', margin: '0 auto 8px', display: 'block' }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>Bo'sh</p>
                </div>
              ) : (
                colOrders.map((order) => (
                  <OrderCard key={order.id} order={order} {...handlers} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ListView({ orders, ...handlers }) {
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return (
    <div style={s.listWrap}>
      <div style={s.listHeader}>
        <span style={{ flex: '0 0 70px' }}>ID</span>
        <span style={{ flex: '0 0 55px' }}>Vaqt</span>
        <span style={{ flex: 1.2 }}>Mijoz</span>
        <span style={{ flex: 1 }}>Telefon</span>
        <span style={{ flex: '0 0 80px', textAlign: 'center' }}>To'lov</span>
        <span style={{ flex: '0 0 90px', textAlign: 'right' }}>Summa</span>
        <span style={{ flex: '0 0 95px', textAlign: 'center' }}>Holat</span>
        <span style={{ flex: '0 0 80px', textAlign: 'center' }}>Amal</span>
      </div>
      {sorted.length === 0 ? (
        <div style={{ padding: '48px 16px', textAlign: 'center' }}>
          <Package size={32} style={{ color: 'var(--border-strong)' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Buyurtmalar yo'q</p>
        </div>
      ) : (
        sorted.map((order) => {
          const st = STATUS_META[order.status] || STATUS_META.pending;
          return (
            <div key={order.id} style={s.listRow} onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              <span style={{ flex: '0 0 70px', fontWeight: 600, color: 'var(--text)' }}>{shortId(order.id)}</span>
              <span style={{ flex: '0 0 55px', color: 'var(--text-muted)', fontSize: 11 }}>{formatTime(order.createdAt)}</span>
              <span style={{ flex: 1.2, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.customerName}</span>
              <span style={{ flex: 1, color: 'var(--text-muted)', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.customerPhone}</span>
              <div style={{ flex: '0 0 80px', display: 'flex', justifyContent: 'center' }}>
                <span style={s.statusBadge(order.paymentMethod === 'card' ? '#0EA5E9' : '#10B981', 'rgba(16,185,129,0.08)')}>
                  {order.paymentMethod === 'card' ? 'Karta' : 'Naqd'}
                </span>
              </div>
              <span style={{ flex: '0 0 90px', textAlign: 'right', fontWeight: 600, fontSize: 12, color: 'var(--text)' }}>{formatPrice(order.total)}</span>
              <div style={{ flex: '0 0 95px', display: 'flex', justifyContent: 'center' }}>
                <span style={s.statusBadge(st.color, st.bg)}>{st.label}</span>
              </div>
              <div style={{ flex: '0 0 80px', display: 'flex', justifyContent: 'center', gap: 4 }}>
                {order.status === 'pending' && (
                  <>
                    <button onClick={() => handlers.onAccept(order.id)} style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--success)', border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Check size={12} />
                    </button>
                    <button onClick={() => handlers.onReject(order.id)} style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <X size={12} />
                    </button>
                  </>
                )}
                {order.status === 'confirmed' && (
                  <button onClick={() => handlers.onPreparing(order.id)} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <ChefHat size={12} />
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button onClick={() => handlers.onReady(order.id)} style={{ background: 'var(--success)', color: '#fff', border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <PackageCheck size={12} />
                  </button>
                )}
                {order.status === 'ready' && (
                  <button onClick={() => handlers.onPrint(order)} style={{ background: 'var(--surface-active)', color: 'var(--text-secondary)', border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Printer size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default function SellerOrders() {
  const [searchParams] = useSearchParams();
  const {
    orders,
    updateOrderStatus,
    acceptOrder,
    startPreparing,
    readyOrder,
    assignCourier,
    employees,
    settings,
    startOrderTimer,
    activeOrderTimers,
  } = useStore();

  const [viewMode, setViewMode] = useState('kanban');
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    orders.forEach((o) => {
      if ((o.status === 'preparing' || o.status === 'confirmed') && !activeOrderTimers[o.id]) {
        startOrderTimer(o.id);
      }
    });
  }, [orders, activeOrderTimers, startOrderTimer]);

  const handleReject = useCallback((id) => updateOrderStatus(id, 'cancelled'), [updateOrderStatus]);
  const handleAssignCourier = useCallback((id, courierId) => assignCourier(id, courierId), [assignCourier]);
  const handleAccept = useCallback((id) => acceptOrder(id), [acceptOrder]);
  const handlePreparing = useCallback((id) => startPreparing(id), [startPreparing]);
  const handleReady = useCallback((id) => readyOrder(id), [readyOrder]);
  const handlePrint = useCallback((order) => printReceipt(order, settings), [settings]);

  const filters = [
    { key: 'all', label: 'Hammasi' },
    { key: 'pending', label: 'Yangi' },
    { key: 'confirmed', label: 'Tasdiqlandi' },
    { key: 'preparing', label: 'Tayyorlanmoqda' },
    { key: 'ready', label: 'Tayyor' },
    { key: 'assigned', label: 'Kuryer tayinlandi' },
    { key: 'onTheWay', label: 'Yetkazish' },
    { key: 'pickedUp', label: 'Olib ketildi' },
    { key: 'pickup', label: 'Olib ketish' },
    { key: 'delivered', label: 'Yakunlangan' },
    { key: 'cancelled', label: 'Bekor' },
  ];

  let filteredOrders = orders;
  if (filterStatus === 'pickup') {
    filteredOrders = orders.filter((o) => o.deliveryType === 'pickup');
  } else if (filterStatus !== 'all') {
    filteredOrders = orders.filter((o) => o.status === filterStatus);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    filteredOrders = filteredOrders.filter((o) =>
      String(o.id).includes(q) ||
      (o.customerName || '').toLowerCase().includes(q) ||
      (o.customerPhone || '').replace(/\s+/g, '').includes(q.replace(/\s+/g, ''))
    );
  }

  return (
    <div style={s.root}>
      <div style={s.header}>
        <div style={s.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={s.title}>Buyurtmalar</h1>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{filteredOrders.length} ta</span>
          </div>
          <div style={s.viewToggle}>
            <button onClick={() => setViewMode('kanban')} style={s.viewBtn(viewMode === 'kanban')}>
              <LayoutGrid size={13} /> Kanban
            </button>
            <button onClick={() => setViewMode('list')} style={s.viewBtn(viewMode === 'list')}>
              <List size={13} /> Ro'yxat
            </button>
          </div>
        </div>

        <div style={s.toolbar}>
          <div style={s.searchWrap}>
            <Search size={14} style={s.searchIcon} />
            <input
              style={s.searchInput}
              placeholder="ID, telefon yoki mijoz..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={s.filters}>
            {filters.map((f) => (
              <button key={f.key} onClick={() => setFilterStatus(f.key)} style={s.filterChip(filterStatus === f.key)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={s.content}>
        {viewMode === 'kanban' ? (
          <KanbanView
            orders={filteredOrders}
            onAccept={handleAccept}
            onReject={handleReject}
            onPreparing={handlePreparing}
            onReady={handleReady}
            onAssignCourier={handleAssignCourier}
            onPrint={handlePrint}
            employees={employees}
            settings={settings}
          />
        ) : (
          <ListView
            orders={filteredOrders}
            onAccept={handleAccept}
            onReject={handleReject}
            onPreparing={handlePreparing}
            onReady={handleReady}
            onAssignCourier={handleAssignCourier}
            onPrint={handlePrint}
            employees={employees}
            settings={settings}
          />
        )}
      </div>
    </div>
  );
}
