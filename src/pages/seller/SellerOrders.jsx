import { useState, useEffect, useCallback, useRef } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatPrice, formatTime } from '../../utils/cn';

import {
  ChevronLeft, Check, X, Clock, ChefHat, Bell, Package, ArrowRight,
  Volume2, Filter, Search, Bike, AlertTriangle, PauseCircle, PlayCircle, Home, ShoppingBag, UtensilsCrossed, BarChart3, Settings
} from 'lucide-react';

const STATUS_COLORS = {
  pending: { bg: 'bg-warning/10 text-warning border-warning/20', dot: 'bg-warning' },
  preparing: { bg: 'bg-info/10 text-info border-info/20', dot: 'bg-info' },
  ready: { bg: 'bg-success/10 text-success border-success/20', dot: 'bg-success' },
  onTheWay: { bg: 'bg-purple/10 text-purple border-purple/20', dot: 'bg-purple' },
  delivered: { bg: 'bg-textDim/10 text-textDim border-textDim/20', dot: 'bg-textDim' },
  cancelled: { bg: 'bg-danger/10 text-danger border-danger/20', dot: 'bg-danger' },
};

function TimerDisplay({ startTime }) {
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
    <span className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-base font-bold tabular-nums',
      overdue ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-primary/10 text-primary border border-primary/20'
    )}>
      <Clock size={14} />
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      {overdue && <span className="text-[10px] font-bold ml-0.5">Kechikdi!</span>}
    </span>
  );
}

function NotificationBanner({ order, onDismiss }) {
  useEffect(() => { const t = setTimeout(onDismiss, 4000); return () => clearTimeout(t); }, [onDismiss]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -60, scale: 0.9 }}
      className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto bg-surface border border-primary/20 rounded-2xl p-4 shadow-lg flex items-center gap-3"
    >
      <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center flex-shrink-0">
        <Volume2 size={24} className="text-danger animate-bounce" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-text">Yangi buyurtma!</p>
        <p className="text-sm text-textMuted">#{String(order.id).slice(-4)} - {formatPrice(order.total)} so'm</p>
      </div>
      <button onClick={onDismiss} className="text-textMuted hover:text-text p-1"><X size={16} /></button>
    </motion.div>
  );
}

function OrderCard({ order, onAccept, onReject, onReady, onAssignCourier, employees }) {
  const [showCourier, setShowCourier] = useState(false);
  const couriers = employees.filter(e => e.role === 'courier' && e.isOnline);
  const st = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
  const isUrgent = order.priority === 'high';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'rounded-2xl border p-4 mb-3 shadow-sm transition-all',
        order.status === 'pending' ? 'bg-warning/5 border-warning/20' : 'bg-surface border-border',
        isUrgent && 'border-l-4 border-l-danger animate-glow'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-lg font-extrabold text-text">#{String(order.id).slice(-4)}</span>
          <span className="text-xs text-textMuted">{formatTime(order.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          {isUrgent && order.status === 'pending' && (
            <Badge variant="danger" size="xs"><AlertTriangle size={10} />Shoshilinch</Badge>
          )}
          <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border', st.bg)}>
            <span className={cn('w-1.5 h-1.5 rounded-full', st.dot, order.status === 'pending' && 'animate-pulse')} />
            {order.status === 'pending' && 'Yangi'}
            {order.status === 'preparing' && 'Tayyorlanmoqda'}
            {order.status === 'ready' && 'Tayyor'}
            {order.status === 'onTheWay' && "Yo'lda"}
            {order.status === 'delivered' && 'Yetkazildi'}
            {order.status === 'cancelled' && 'Bekor'}
          </span>
        </div>
      </div>

      <p className="font-semibold text-textSecondary mb-2">{order.customerName}</p>

      <div className="space-y-1 mb-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span className="text-textMuted">{item.quantity}x {item.food.name}</span>
            <span className="font-semibold text-textSecondary tabular-nums">{formatPrice(item.price * item.quantity)} so'm</span>
          </div>
        ))}
      </div>

      <div className="h-px bg-border my-3" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-textMuted">Jami</span>
        <span className="text-lg font-extrabold text-text tabular-nums">{formatPrice(order.total)} so'm</span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <TimerDisplay startTime={order.createdAt} />
      </div>

      <div className="flex gap-2">
        {order.status === 'pending' && (
          <>
            <button onClick={() => onAccept(order.id)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-success text-white font-bold rounded-xl shadow-success hover:brightness-110 active:scale-[0.97] transition-all text-sm">
              <Check size={18} /> Qabul qilish
            </button>
            <button onClick={() => onReject(order.id)} className="flex items-center justify-center px-4 py-3 border border-danger/20 bg-danger/5 text-danger font-bold rounded-xl hover:bg-danger/10 active:scale-[0.97] transition-all">
              <X size={16} />
            </button>
          </>
        )}
        {order.status === 'preparing' && (
          <button onClick={() => onReady(order.id)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white font-bold rounded-xl shadow-primary hover:brightness-110 active:scale-[0.97] transition-all text-sm">
            <ChefHat size={18} /> Tayyor
          </button>
        )}
        {order.status === 'ready' && (
          <div className="relative w-full">
            <button onClick={() => setShowCourier(!showCourier)} className="w-full flex items-center justify-center gap-2 py-3 bg-info text-white font-bold rounded-xl shadow-info hover:brightness-110 active:scale-[0.97] transition-all text-sm">
              <Bike size={18} /> Kuryer berish <ArrowRight size={16} />
            </button>
            {showCourier && (
              <div className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-surface border border-border rounded-xl shadow-lg z-10">
                {couriers.length === 0 && <p className="text-xs text-textMuted text-center py-2">Kuryerlar yo'q</p>}
                {couriers.map(c => (
                  <button key={c.id} onClick={() => { onAssignCourier(order.id, c.id); setShowCourier(false); }}
                    className="flex items-center gap-2 w-full p-2.5 rounded-lg hover:bg-surfaceHover transition-all text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text">{c.name}</p>
                      <p className="text-xs text-textMuted">{c.rating} reyting</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function SellerOrders() {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, acceptOrder, readyOrder, assignCourier, employees } = useStore();

  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState(null);
  const prevCountRef = useRef(orders.length);

  useEffect(() => {
    if (orders.length > prevCountRef.current) {
      const newest = orders[0];
      if (newest && newest.status === 'pending') {
        setNotification(newest);
      }
    }
    prevCountRef.current = orders.length;
  }, [orders]);

  const handleReject = useCallback((id) => { updateOrderStatus(id, 'cancelled'); }, [updateOrderStatus]);
  const handleAssignCourier = useCallback((id, courierId) => { assignCourier(id, courierId); }, [assignCourier]);
  const handleAccept = useCallback((id) => { acceptOrder(id); }, [acceptOrder]);
  const handleReady = useCallback((id) => { readyOrder(id); }, [readyOrder]);

  const filteredOrders = orders.filter(o => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    if (search && !String(o.id).includes(search) && !o.customerName?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;

  const filters = [
    { key: 'all', label: `Hammasi (${orders.length})` },
    { key: 'pending', label: `Yangi (${pendingCount})` },
    { key: 'preparing', label: `Tayyorlanmoqda (${preparingCount})` },
    { key: 'ready', label: `Tayyor (${readyCount})` },
    { key: 'delivered', label: 'Yetkazildi' },
    { key: 'cancelled', label: 'Bekor' },
  ];

  const navItems = [
    { label: 'KDS', icon: Home, path: '/seller' },
    { label: 'Buyurtmalar', icon: ShoppingBag, path: '/seller/orders' },
    { label: 'Menyu', icon: UtensilsCrossed, path: '/seller/menu' },
    { label: 'Statistika', icon: BarChart3, path: '/seller/analytics' },
    { label: 'Sozlamalar', icon: Settings, path: '/seller/settings' },
  ];

  return (
    <div className="min-h-full bg-bg pb-24">
      <AnimatePresence>
        {notification && <NotificationBanner order={notification} onDismiss={() => setNotification(null)} />}
      </AnimatePresence>

      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-borderStrong transition-all">
              <ChevronLeft size={18} className="text-text" />
            </button>
            <h1 className="text-lg font-bold text-text">Buyurtmalar</h1>
          </div>
        </div>

        <div className="px-4 pb-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
            <input
              className="w-full pl-9 pr-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-text outline-none transition-all focus:border-primary/40"
              placeholder="Buyurtma ID yoki mijoz..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilterStatus(f.key)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all flex-shrink-0',
                filterStatus === f.key ? 'bg-primary text-white border-primary shadow-sm' : 'bg-surface text-textMuted border-border hover:border-borderStrong'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-3">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <p className="text-2xl font-extrabold text-warning tabular-nums">{pendingCount}</p>
            <p className="text-xs text-textMuted font-medium">Yangi</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <p className="text-2xl font-extrabold text-info tabular-nums">{preparingCount}</p>
            <p className="text-xs text-textMuted font-medium">Tayyorlanmoqda</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <p className="text-2xl font-extrabold text-success tabular-nums">{readyCount}</p>
            <p className="text-xs text-textMuted font-medium">Tayyor</p>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-surface border border-border rounded-2xl p-10 text-center">
            <Package size={48} className="mx-auto mb-3 text-borderStrong" />
            <p className="font-bold text-text">Buyurtmalar yo'q</p>
            <p className="text-sm text-textMuted mt-1">Filtrlarni o'zgartiring</p>
          </div>
        ) : (
          <div>
            {filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onAccept={handleAccept}
                onReject={handleReject}
                onReady={handleReady}
                onAssignCourier={handleAssignCourier}
                employees={employees}
              />
            ))}
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
          {navItems.map((item) => {
            const active = item.path === '/seller/orders';
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full border-none bg-transparent cursor-pointer transition-all"
                style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }}
              >
                <item.icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                <span className="text-[10px] font-semibold" style={{ fontWeight: active ? 700 : 500 }}>{item.label}</span>
                {active && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}