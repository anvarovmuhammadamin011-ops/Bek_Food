import { useState, useEffect, useCallback, useRef } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, X, Clock, ChefHat, Bell, Package, ArrowRight, Volume2, Filter } from 'lucide-react';

const COLUMNS = [
  { key: 'pending', label: 'Yangi', color: '#eab308', bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.3)' },
  { key: 'confirmed', label: 'Tasdiqlandi', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)' },
  { key: 'preparing', label: 'Tayyorlanmoqda', color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)' },
  { key: 'ready', label: 'Tayyor', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)' },
  { key: 'delivered', label: 'Yakunlandi', color: '#6b6b6b', bg: 'rgba(107,107,107,0.12)', border: 'rgba(107,107,107,0.3)' },
];

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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontFamily: 'var(--font-display)',
        fontSize: 14,
        fontWeight: 600,
        color: overdue ? '#ef4444' : '#f97316',
        background: overdue ? 'rgba(239,68,68,0.1)' : 'rgba(249,115,22,0.1)',
        padding: '4px 10px',
        borderRadius: 'var(--radius-sm)',
        animation: overdue ? 'badgePulse 2s ease-in-out infinite' : undefined,
      }}
    >
      <Clock size={12} />
      <span>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
      {overdue && <span style={{ fontSize: 10, color: '#ef4444' }}>Kechikdi!</span>}
    </div>
  );
}

function NotificationBanner({ order, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className="animate-fade-in-down"
      style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        background: 'linear-gradient(135deg, #1a0505 0%, #141414 100%)',
        border: '1px solid rgba(229,30,30,0.4)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 8px 40px rgba(229,30,30,0.3)',
        maxWidth: 360,
        width: 'calc(100% - 32px)',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'var(--red)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          animation: 'glow 2s ease-in-out infinite',
        }}
      >
        <Bell size={16} color="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Yangi buyurtma!</p>
        <p style={{ color: '#6b6b6b', fontSize: 12 }}>
          #{String(order.id).slice(-4)} — {formatPrice(order.total)}
        </p>
      </div>
      <button
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#6b6b6b',
          padding: 4,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

function OrderCard({ order, onAccept, onReject, onReady, onAssignCourier, employees, isPreparing }) {
  const [showCourierSelect, setShowCourierSelect] = useState(false);

  const couriers = employees.filter((e) => e.role === 'courier' && e.isOnline);

  return (
    <div
      className="card card-hover"
      style={{
        padding: 14,
        animation: 'fadeInUp 0.4s var(--ease-out) forwards',
        opacity: 0,
        animationFillMode: 'forwards',
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
        <div className="flex items-center gap-2">
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
            #{String(order.id).slice(-4)}
          </span>
          <span style={{ color: '#6b6b6b', fontSize: 11 }}>{formatTime(order.createdAt)}</span>
        </div>
        {order.priority === 'high' && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#e51e1e',
              background: 'rgba(229,30,30,0.12)',
              padding: '2px 6px',
              borderRadius: 4,
            }}
          >
            Tezkor
          </span>
        )}
      </div>

      <p style={{ color: '#b8b8b8', fontSize: 12, marginBottom: 8 }}>{order.customerName}</p>

      <div style={{ marginBottom: 8 }}>
        {order.items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between"
            style={{ padding: '3px 0', fontSize: 12 }}
          >
            <span style={{ color: '#6b6b6b' }}>
              {item.quantity}x {item.food.name}
            </span>
            <span style={{ color: '#b8b8b8', fontVariantNumeric: 'tabular-nums' }}>
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div
        className="flex items-center justify-between"
        style={{
          padding: '8px 0',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          marginBottom: 10,
        }}
      >
        <span style={{ color: '#6b6b6b', fontSize: 11 }}>Jami</span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            color: '#fff',
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          {formatPrice(order.total)}
        </span>
      </div>

      {isPreparing && order.status === 'preparing' && (
        <div style={{ marginBottom: 10 }}>
          <Timer startTime={order.createdAt} />
        </div>
      )}

      {order.status === 'pending' && (
        <div className="flex gap-2">
          <button
            onClick={() => onAccept(order.id)}
            className="btn btn-sm"
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: '#fff',
              fontSize: 12,
              minHeight: 34,
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <Check size={13} />
            Qabul qilish
          </button>
          <button
            onClick={() => onReject(order.id)}
            className="btn btn-sm"
            style={{
              background: 'rgba(239,68,68,0.12)',
              color: '#ef4444',
              fontSize: 12,
              minHeight: 34,
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <X size={13} />
          </button>
        </div>
      )}

      {order.status === 'preparing' && (
        <button
          onClick={() => onReady(order.id)}
          className="btn btn-primary btn-sm"
          style={{ width: 100, fontSize: 12, minHeight: 34, borderRadius: 'var(--radius-sm)' }}
        >
          <ChefHat size={13} />
          Tayyor
        </button>
      )}

      {order.status === 'ready' && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowCourierSelect(!showCourierSelect)}
            className="btn btn-sm"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: '#fff',
              fontSize: 12,
              minHeight: 34,
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <Package size={13} />
            Kuryercha berish
            <ArrowRight size={13} style={{ marginLeft: 'auto' }} />
          </button>
          {showCourierSelect && (
            <div
              className="glass-floating animate-fade-in"
              style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                right: 0,
                marginBottom: 6,
                padding: 6,
                zIndex: 10,
              }}
            >
              {couriers.length === 0 && (
                <p style={{ color: '#6b6b6b', fontSize: 11, padding: '6px 8px', textAlign: 'center' }}>
                  Kuryerlar yo'q
                </p>
              )}
              {couriers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onAssignCourier(order.id, c.id);
                    setShowCourierSelect(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '8px 10px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    color: '#fff',
                    fontSize: 12,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'var(--surface-hover)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {c.name.charAt(0)}
                  </div>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 500 }}>{c.name}</p>
                    <p style={{ fontSize: 10, color: '#6b6b6b' }}>★ {c.rating}</p>
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
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        gap: 10,
        overflowX: 'auto',
        overflowY: 'hidden',
        padding: '0 16px 16px',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {COLUMNS.map((col) => {
        const colOrders = getOrderForColumn(col.key);
        return (
          <div
            key={col.key}
            style={{
              flex: '0 0 260px',
              minWidth: 260,
              scrollSnapAlign: 'start',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: 'calc(100vh - 160px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 'var(--radius) var(--radius) 0 0',
                background: col.bg,
                borderBottom: `2px solid ${col.border}`,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: col.color,
                    boxShadow: `0 0 8px ${col.bg}`,
                  }}
                />
                <span style={{ color: col.color, fontSize: 13, fontWeight: 600 }}>
                  {col.label}
                </span>
              </div>
              <span
                style={{
                  background: col.bg,
                  color: col.color,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 999,
                  border: `1px solid ${col.border}`,
                }}
              >
                {colOrders.length}
              </span>
            </div>

            <div
              className="scrollbar-hide"
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '8px 0',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '0 0 var(--radius) var(--radius)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {colOrders.length === 0 ? (
                <div style={{ padding: '24px 12px', textAlign: 'center' }}>
                  <Package size={24} style={{ color: '#3a3a3a', margin: '0 auto 8px' }} />
                  <p style={{ color: '#3a3a3a', fontSize: 12 }}>Bo'sh</p>
                </div>
              ) : (
                <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 4px' }}>
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
    pending: { label: 'Yangi', color: '#eab308', bg: 'rgba(234,179,8,0.12)' },
    preparing: { label: 'Tayyorlanmoqda', color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
    ready: { label: 'Tayyor', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    onTheWay: { label: 'Yo\'lda', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    delivered: { label: 'Yetkazildi', color: '#6b6b6b', bg: 'rgba(107,107,107,0.12)' },
    cancelled: { label: 'Bekor', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 16px 16px' }}>
      <div className="card" style={{ overflow: 'hidden' }}>
        <div
          className="flex items-center"
          style={{
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            fontSize: 11,
            fontWeight: 600,
            color: '#6b6b6b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          <span style={{ flex: '0 0 60px' }}>ID</span>
          <span style={{ flex: '0 0 60px' }}>Vaqt</span>
          <span style={{ flex: 1 }}>Mijoz</span>
          <span style={{ flex: '0 0 80px', textAlign: 'right' }}>Summa</span>
          <span style={{ flex: '0 0 80px', textAlign: 'center' }}>Holat</span>
          <span style={{ flex: '0 0 90px', textAlign: 'center' }}>Amal</span>
        </div>
        {sorted.length === 0 ? (
          <div className="empty-state py-16">
            <Package size={32} style={{ color: '#3a3a3a', marginBottom: 12 }} />
            <p style={{ color: '#6b6b6b', fontSize: 13 }}>Buyurtmalar yo'q</p>
          </div>
        ) : (
          <div className="stagger">
            {sorted.map((order) => {
              const st = statusMap[order.status] || statusMap.pending;
              return (
                <div
                  key={order.id}
                  className="flex items-center"
                  style={{
                    padding: '10px 14px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    fontSize: 13,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ flex: '0 0 60px', color: '#fff', fontWeight: 600 }}>
                    #{String(order.id).slice(-4)}
                  </span>
                  <span style={{ flex: '0 0 60px', color: '#6b6b6b', fontSize: 11 }}>
                    {formatTime(order.createdAt)}
                  </span>
                  <span style={{ flex: 1, color: '#b8b8b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {order.customerName}
                  </span>
                  <span
                    style={{
                      flex: '0 0 80px',
                      textAlign: 'right',
                      fontFamily: 'var(--font-display)',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    {formatPrice(order.total)}
                  </span>
                  <div style={{ flex: '0 0 80px', display: 'flex', justifyContent: 'center' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 10,
                        fontWeight: 600,
                        color: st.color,
                        background: st.bg,
                      }}
                    >
                      {st.label}
                    </span>
                  </div>
                  <div style={{ flex: '0 0 90px', display: 'flex', justifyContent: 'center', gap: 4 }}>
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onAccept(order.id)}
                          style={{
                            background: 'rgba(34,197,94,0.15)',
                            color: '#22c55e',
                            border: 'none',
                            borderRadius: 6,
                            width: 26,
                            height: 26,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Check size={12} />
                        </button>
                        <button
                          onClick={() => onReject(order.id)}
                          style={{
                            background: 'rgba(239,68,68,0.15)',
                            color: '#ef4444',
                            border: 'none',
                            borderRadius: 6,
                            width: 26,
                            height: 26,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <X size={12} />
                        </button>
                      </>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => onReady(order.id)}
                        style={{
                          background: 'var(--red)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '4px 8px',
                          fontSize: 10,
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <ChefHat size={10} /> Tayyor
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
                        style={{
                          background: 'var(--surface)',
                          color: '#fff',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 6,
                          padding: '4px 6px',
                          fontSize: 10,
                          cursor: 'pointer',
                          maxWidth: 80,
                        }}
                      >
                        <option value="" disabled>Kuryer</option>
                        {employees
                          .filter((e) => e.role === 'courier')
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                      </select>
                    )}
                    {(order.status === 'delivered' || order.status === 'onTheWay' || order.status === 'cancelled') && (
                      <span style={{ color: '#3a3a3a', fontSize: 10 }}>—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
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

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  const handleReject = useCallback(
    (id) => {
      updateOrderStatus(id, 'cancelled');
    },
    [updateOrderStatus]
  );

  const handleAssignCourier = useCallback(
    (id, courierId) => {
      assignCourier(id, courierId);
    },
    [assignCourier]
  );

  const handleAccept = useCallback(
    (id) => {
      acceptOrder(id);
    },
    [acceptOrder]
  );

  const handleReady = useCallback(
    (id) => {
      readyOrder(id);
    },
    [readyOrder]
  );

  return (
    <div className="h-full overflow-y-auto scrollbar-hide" style={{ background: '#0a0a0a' }}>
      {notification && (
        <NotificationBanner order={notification} onDismiss={() => setNotification(null)} />
      )}

      <div
        className="glass"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: '12px 16px',
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              style={{
                background: 'var(--surface)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <ChevronLeft size={18} color="#fff" />
            </button>
            <h1 className="heading" style={{ fontSize: 18, fontWeight: 600 }}>
              Buyurtmalar
            </h1>
          </div>

          <div
            className="flex items-center gap-1"
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius)',
              padding: 3,
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 12,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: viewMode === 'kanban' ? 'var(--red)' : 'transparent',
                color: viewMode === 'kanban' ? '#fff' : '#6b6b6b',
              }}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 12,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: viewMode === 'list' ? 'var(--red)' : 'transparent',
                color: viewMode === 'list' ? '#fff' : '#6b6b6b',
              }}
            >
              Ro'yxat
            </button>
          </div>
        </div>

        <div
          className="flex items-center gap-2"
          style={{ overflowX: 'auto', paddingBottom: 4 }}
        >
          {[
            { key: 'all', label: 'Hammasi' },
            { key: 'pending', label: 'Yangi' },
            { key: 'preparing', label: 'Tayyorlanmoqda' },
            { key: 'ready', label: 'Tayyor' },
            { key: 'delivered', label: 'Yetkazildi' },
            { key: 'cancelled', label: 'Bekor' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key)}
              style={{
                padding: '5px 12px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                background: filterStatus === f.key ? 'rgba(229,30,30,0.15)' : 'var(--surface)',
                color: filterStatus === f.key ? '#e51e1e' : '#6b6b6b',
                outline: filterStatus === f.key ? '1px solid rgba(229,30,30,0.3)' : '1px solid transparent',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ paddingTop: 8 }}>
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
