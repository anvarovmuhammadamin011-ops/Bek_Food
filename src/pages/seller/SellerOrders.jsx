import { useState, useEffect, useCallback, useRef } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Check,
  X,
  Clock,
  ChefHat,
  Bell,
  Package,
  ArrowRight,
  Volume2,
  Filter,
  LayoutGrid,
  List,
  Bike,
  CircleDot,
  CheckCircle2,
  PackageCheck,
  Ban,
} from 'lucide-react';

const COLUMNS = [
  { key: 'pending', label: 'Yangi', icon: Bell, accent: '#F59E0B' },
  { key: 'confirmed', label: 'Tasdiqlandi', icon: CheckCircle2, accent: '#3B82F6' },
  { key: 'preparing', label: 'Tayyorlanmoqda', icon: ChefHat, accent: '#F97316' },
  { key: 'ready', label: 'Tayyor', icon: PackageCheck, accent: '#22C55E' },
  { key: 'delivered', label: 'Yakunlandi', icon: Ban, accent: '#6B7280' },
];

const s = {
  root: {
    minHeight: '100vh',
    background: 'var(--bg)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(255,255,255,0.72)',
    backdropFilter: 'blur(24px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
    borderBottom: '1px solid var(--border)',
  },
  headerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    maxWidth: 960,
    margin: '0 auto',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: 'var(--text)',
    boxShadow: 'var(--shadow-sm)',
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '-0.01em',
  },
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
  filters: {
    display: 'flex',
    gap: 6,
    padding: '0 16px 12px',
    overflowX: 'auto',
    maxWidth: 960,
    margin: '0 auto',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
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
  }),
  content: {
    maxWidth: 960,
    margin: '0 auto',
    padding: '0 16px 100px',
  },
  kanbanScroll: {
    display: 'flex',
    gap: 12,
    overflowX: 'auto',
    overflowY: 'hidden',
    padding: '0 0 16px',
    scrollSnapType: 'x mandatory',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
  },
  column: {
    flex: '0 0 280px',
    minWidth: 280,
    scrollSnapAlign: 'start',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 'calc(100vh - 200px)',
  },
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
  colDot: (accent) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: accent,
    boxShadow: `0 0 8px ${accent}33`,
  }),
  colCount: (accent) => ({
    fontSize: 11,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 999,
    background: `${accent}12`,
    color: accent,
  }),
  colBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    scrollbarWidth: 'none',
  },
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
    transition: 'all 0.2s',
  },
  cardId: {
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--text)',
  },
  cardTime: {
    fontSize: 11,
    color: 'var(--text-muted)',
  },
  cardCustomer: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    marginBottom: 8,
  },
  cardItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '3px 0',
    fontSize: 12,
  },
  cardItemName: {
    color: 'var(--text-muted)',
  },
  cardItemPrice: {
    color: 'var(--text-secondary)',
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
  },
  divider: {
    height: 1,
    background: 'var(--border)',
    margin: '8px 0',
  },
  cardTotal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTotalLabel: {
    fontSize: 11,
    color: 'var(--text-muted)',
  },
  cardTotalValue: {
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--text)',
  },
  priorityBadge: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--danger)',
    background: 'rgba(239,68,68,0.08)',
    padding: '2px 8px',
    borderRadius: 6,
    border: '1px solid rgba(239,68,68,0.15)',
  },
  acceptBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    padding: '8px 0',
    borderRadius: 10,
    border: 'none',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    background: 'var(--success)',
    color: '#fff',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(34,197,94,0.2)',
  },
  rejectBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 12px',
    borderRadius: 10,
    border: '1px solid rgba(239,68,68,0.2)',
    background: 'rgba(239,68,68,0.06)',
    color: 'var(--danger)',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  readyBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    width: '100%',
    padding: '8px 0',
    borderRadius: 10,
    border: 'none',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    background: 'var(--primary)',
    color: '#fff',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(249,115,22,0.2)',
  },
  courierBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    width: '100%',
    padding: '8px 0',
    borderRadius: 10,
    border: 'none',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    background: '#3B82F6',
    color: '#fff',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(59,130,246,0.2)',
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
    transition: 'background 0.15s',
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
  listRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 14px',
    borderBottom: '1px solid var(--border)',
    fontSize: 13,
    transition: 'background 0.15s',
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
  statusBadge: (color, bg) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 10px',
    borderRadius: 999,
    fontSize: 10,
    fontWeight: 600,
    color: color,
    background: bg,
  }),
  actionBtn: (bg, color) => ({
    background: bg,
    color: color,
    border: 'none',
    borderRadius: 8,
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontSize: 10,
    fontWeight: 600,
  }),
  courierSelect: {
    background: 'var(--surface)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '4px 8px',
    fontSize: 10,
    cursor: 'pointer',
    maxWidth: 90,
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
  notification: {
    position: 'fixed',
    top: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 100,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    boxShadow: 'var(--shadow-lg)',
    maxWidth: 360,
    width: 'calc(100% - 32px)',
    animation: 'fadeInDown 0.3s ease-out',
  },
  notifIcon: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: 'var(--danger)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text)',
  },
  notifSub: {
    fontSize: 12,
    color: 'var(--text-muted)',
  },
  emptyState: {
    padding: '48px 16px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
};

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
}

function formatPrice(n) {
  return Number(n).toLocaleString('uz-UZ') + " so'm";
}

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

function NotificationBanner({ order, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div style={s.notification}>
      <div style={s.notifIcon}>
        <Bell size={16} color="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={s.notifTitle}>Yangi buyurtma!</p>
        <p style={s.notifSub}>#{String(order.id).slice(-4)} — {formatPrice(order.total)}</p>
      </div>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex', alignItems: 'center' }}>
        <X size={14} />
      </button>
    </div>
  );
}

function OrderCard({ order, onAccept, onReject, onReady, onAssignCourier, employees, isPreparing }) {
  const [showCourierSelect, setShowCourierSelect] = useState(false);

  const couriers = employees.filter((e) => e.role === 'courier' && e.isOnline);

  return (
    <div style={s.card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={s.cardId}>#{String(order.id).slice(-4)}</span>
          <span style={s.cardTime}>{formatTime(order.createdAt)}</span>
        </div>
        {order.priority === 'high' && <span style={s.priorityBadge}>Tezkor</span>}
      </div>

      <p style={s.cardCustomer}>{order.customerName}</p>

      <div style={{ marginBottom: 8 }}>
        {order.items.map((item, idx) => (
          <div key={idx} style={s.cardItem}>
            <span style={s.cardItemName}>{item.quantity}x {item.food.name}</span>
            <span style={s.cardItemPrice}>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div style={s.divider} />

      <div style={s.cardTotal}>
        <span style={s.cardTotalLabel}>Jami</span>
        <span style={s.cardTotalValue}>{formatPrice(order.total)}</span>
      </div>

      {isPreparing && order.status === 'preparing' && (
        <div style={{ marginBottom: 10 }}>
          <Timer startTime={order.createdAt} />
        </div>
      )}

      {order.status === 'pending' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onAccept(order.id)} style={s.acceptBtn}>
            <Check size={13} />
            Qabul qilish
          </button>
          <button onClick={() => onReject(order.id)} style={s.rejectBtn}>
            <X size={13} />
          </button>
        </div>
      )}

      {order.status === 'preparing' && (
        <button onClick={() => onReady(order.id)} style={s.readyBtn}>
          <ChefHat size={13} />
          Tayyor
        </button>
      )}

      {order.status === 'ready' && (
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowCourierSelect(!showCourierSelect)} style={s.courierBtn}>
            <Bike size={13} />
            Kuryercha berish
            <ArrowRight size={13} style={{ marginLeft: 'auto' }} />
          </button>
          {showCourierSelect && (
            <div style={s.courierDropdown}>
              {couriers.length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: 11, padding: '6px 8px', textAlign: 'center' }}>Kuryerlar yo'q</p>
              )}
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
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{c.name}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{c.rating} reyting</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function KanbanView({ orders, onAccept, onReject, onReady, onAssignCourier, employees }) {
  const preparingOrders = orders.filter((o) => o.status === 'preparing');

  const getOrderForColumn = (colKey) => {
    if (colKey === 'confirmed') return [];
    if (colKey === 'delivered') {
      return orders.filter((o) => o.status === 'delivered' || o.status === 'onTheWay');
    }
    return orders.filter((o) => o.status === colKey);
  };

  return (
    <div style={s.kanbanScroll}>
      {COLUMNS.map((col) => {
        const colOrders = getOrderForColumn(col.key);
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
                  <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Bo'sh</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {colOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onAccept={onAccept}
                      onReject={onReject}
                      onReady={onReady}
                      onAssignCourier={onAssignCourier}
                      employees={employees}
                      isPreparing={preparingOrders.length > 0}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ListView({ orders, onAccept, onReject, onReady, onAssignCourier, employees }) {
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const statusMap = {
    pending: { label: 'Yangi', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
    preparing: { label: 'Tayyorlanmoqda', color: '#F97316', bg: 'rgba(249,115,22,0.08)' },
    ready: { label: 'Tayyor', color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
    onTheWay: { label: "Yo'lda", color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
    delivered: { label: 'Yetkazildi', color: '#6B7280', bg: 'rgba(107,114,128,0.08)' },
    cancelled: { label: 'Bekor', color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
  };

  return (
    <div style={{ overflow: 'hidden', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}>
      <div style={s.listHeader}>
        <span style={{ flex: '0 0 60px' }}>ID</span>
        <span style={{ flex: '0 0 60px' }}>Vaqt</span>
        <span style={{ flex: 1 }}>Mijoz</span>
        <span style={{ flex: '0 0 80px', textAlign: 'right' }}>Summa</span>
        <span style={{ flex: '0 0 80px', textAlign: 'center' }}>Holat</span>
        <span style={{ flex: '0 0 90px', textAlign: 'center' }}>Amal</span>
      </div>
      {sorted.length === 0 ? (
        <div style={s.emptyState}>
          <Package size={32} style={{ color: 'var(--border-strong)' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Buyurtmalar yo'q</p>
        </div>
      ) : (
        sorted.map((order) => {
          const st = statusMap[order.status] || statusMap.pending;
          return (
            <div
              key={order.id}
              style={s.listRow}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ flex: '0 0 60px', fontWeight: 600, color: 'var(--text)' }}>
                #{String(order.id).slice(-4)}
              </span>
              <span style={{ flex: '0 0 60px', color: 'var(--text-muted)', fontSize: 11 }}>
                {formatTime(order.createdAt)}
              </span>
              <span style={{ flex: 1, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {order.customerName}
              </span>
              <span style={{ flex: '0 0 80px', textAlign: 'right', fontWeight: 600, fontSize: 12, color: 'var(--text)' }}>
                {formatPrice(order.total)}
              </span>
              <div style={{ flex: '0 0 80px', display: 'flex', justifyContent: 'center' }}>
                <span style={s.statusBadge(st.color, st.bg)}>{st.label}</span>
              </div>
              <div style={{ flex: '0 0 90px', display: 'flex', justifyContent: 'center', gap: 4 }}>
                {order.status === 'pending' && (
                  <>
                    <button onClick={() => onAccept(order.id)} style={s.actionBtn('rgba(34,197,94,0.1)', 'var(--success)')}>
                      <Check size={12} />
                    </button>
                    <button onClick={() => onReject(order.id)} style={s.actionBtn('rgba(239,68,68,0.1)', 'var(--danger)')}>
                      <X size={12} />
                    </button>
                  </>
                )}
                {order.status === 'preparing' && (
                  <button onClick={() => onReady(order.id)} style={s.actionBtn('var(--primary)', '#fff')}>
                    <ChefHat size={10} />
                  </button>
                )}
                {order.status === 'ready' && (
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        onAssignCourier(order.id, Number(e.target.value));
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                    style={s.courierSelect}
                  >
                    <option value="" disabled>Kuryer</option>
                    {employees.filter((e) => e.role === 'courier').map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                )}
                {(order.status === 'delivered' || order.status === 'onTheWay' || order.status === 'cancelled') && (
                  <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>-</span>
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
  const navigate = useNavigate();
  const {
    orders,
    updateOrderStatus,
    acceptOrder,
    readyOrder,
    assignCourier,
    employees,
    startOrderTimer,
    activeOrderTimers,
  } = useStore();

  const [viewMode, setViewMode] = useState('kanban');
  const [notification, setNotification] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const prevOrderCountRef = useRef(orders.length);

  useEffect(() => {
    if (orders.length > prevOrderCountRef.current) {
      const newest = orders[0];
      if (newest && newest.status === 'pending') {
        setNotification(newest);
      }
    }
    prevOrderCountRef.current = orders.length;
  }, [orders]);

  useEffect(() => {
    orders.forEach((o) => {
      if (o.status === 'preparing' && !activeOrderTimers[o.id]) {
        startOrderTimer(o.id);
      }
    });
  }, [orders, activeOrderTimers, startOrderTimer]);

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter((o) => o.status === filterStatus);

  const handleReject = useCallback((id) => { updateOrderStatus(id, 'cancelled'); }, [updateOrderStatus]);
  const handleAssignCourier = useCallback((id, courierId) => { assignCourier(id, courierId); }, [assignCourier]);
  const handleAccept = useCallback((id) => { acceptOrder(id); }, [acceptOrder]);
  const handleReady = useCallback((id) => { readyOrder(id); }, [readyOrder]);

  const filters = [
    { key: 'all', label: 'Hammasi' },
    { key: 'pending', label: 'Yangi' },
    { key: 'preparing', label: 'Tayyorlanmoqda' },
    { key: 'ready', label: 'Tayyor' },
    { key: 'delivered', label: 'Yetkazildi' },
    { key: 'cancelled', label: 'Bekor' },
  ];

  return (
    <div style={s.root}>
      {notification && <NotificationBanner order={notification} onDismiss={() => setNotification(null)} />}

      <div style={s.header}>
        <div style={s.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => navigate(-1)} style={s.backBtn} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
              <ChevronLeft size={18} />
            </button>
            <h1 style={s.title}>Buyurtmalar</h1>
          </div>

          <div style={s.viewToggle}>
            <button onClick={() => setViewMode('kanban')} style={s.viewBtn(viewMode === 'kanban')}>
              <LayoutGrid size={13} />
              Kanban
            </button>
            <button onClick={() => setViewMode('list')} style={s.viewBtn(viewMode === 'list')}>
              <List size={13} />
              Ro'yxat
            </button>
          </div>
        </div>

        <div style={{ ...s.filters, padding: '0 16px 10px' }}>
          {filters.map((f) => (
            <button key={f.key} onClick={() => setFilterStatus(f.key)} style={s.filterChip(filterStatus === f.key)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={s.content}>
        {viewMode === 'kanban' ? (
          <KanbanView
            orders={filteredOrders}
            onAccept={handleAccept}
            onReject={handleReject}
            onReady={handleReady}
            onAssignCourier={handleAssignCourier}
            employees={employees}
          />
        ) : (
          <ListView
            orders={filteredOrders}
            onAccept={handleAccept}
            onReject={handleReject}
            onReady={handleReady}
            onAssignCourier={handleAssignCourier}
            employees={employees}
          />
        )}
      </div>
    </div>
  );
}
