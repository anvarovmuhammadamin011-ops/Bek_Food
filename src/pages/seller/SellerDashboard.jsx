import { useState, useEffect, useRef } from 'react';
import useStore from '../../store/useStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatPrice, formatTime } from '../../utils/cn';

import {
  Bell, ChefHat, Check, Clock, DollarSign, ShoppingBag, AlertTriangle,
  Home, UtensilsCrossed, BarChart3, Settings, PauseCircle, PlayCircle, Volume2
} from 'lucide-react';

function formatCurrency(v) {
  return (v || 0).toLocaleString('uz-UZ');
}

function TimerCard({ startTime, paused }) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - new Date(startTime).getTime()) / 1000));
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [startTime]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const overdue = elapsed > 900;

  return (
    <div className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-lg font-bold tabular-nums tracking-tight',
      overdue ? 'bg-danger/10 text-danger border border-danger/20' : paused ? 'bg-warning/10 text-warning border border-warning/20' : 'bg-primary/10 text-primary border border-primary/20'
    )}>
      {paused ? <PauseCircle size={16} /> : <Clock size={16} />}
      <span>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
      {overdue && <span className="text-xs font-bold ml-1">Kechikdi!</span>}
    </div>
  );
}

function OrderCard({ order, onAccept, onReady, onPause, onReject, pausedOrders }) {
  const isPaused = pausedOrders.includes(order.id);
  const isUrgent = order.priority === 'high';
  const isNew = order.status === 'pending';
  const isCooking = order.status === 'preparing';

  const cardBg = isNew ? 'bg-warning/5 border-warning/20' : isCooking ? 'bg-info/5 border-info/20' : 'bg-surface border-border';
  const accentBorder = isUrgent ? 'border-l-4 border-l-danger' : isNew ? 'border-l-4 border-l-warning' : isCooking ? 'border-l-4 border-l-info' : 'border-l-4 border-l-transparent';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -80, scale: 0.95 }}
      transition={{ type: 'spring', damping: 22, stiffness: 260 }}
      className={cn('rounded-2xl border p-4 mb-3 shadow-sm', cardBg, accentBorder, isUrgent && 'animate-glow')}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xl font-extrabold text-text tracking-tight">#{String(order.id).slice(-4)}</span>
          <span className="text-sm text-textMuted">{formatTime(order.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          {isUrgent && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-danger/10 text-danger border border-danger/20 rounded-lg text-xs font-bold">
              <AlertTriangle size={12} />
              Shoshilinch
            </span>
          )}
          {order.status === 'pending' && <span className="w-2.5 h-2.5 rounded-full bg-warning animate-pulse" />}
          {order.status === 'preparing' && <span className="w-2.5 h-2.5 rounded-full bg-info animate-pulse" />}
          {order.status === 'ready' && <span className="w-2.5 h-2.5 rounded-full bg-success" />}
        </div>
      </div>

      <p className="text-base font-semibold text-textSecondary mb-2">{order.customerName}</p>

      <div className="space-y-1 mb-3">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span className="text-textMuted">{item.quantity}x {item.food.name}</span>
            <span className="text-textSecondary font-semibold tabular-nums">{formatPrice(item.price * item.quantity)} so'm</span>
          </div>
        ))}
      </div>

      <div className="h-px bg-border my-3" />

      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-textMuted">Jami</span>
        <span className="text-xl font-extrabold text-text tabular-nums">{formatPrice(order.total)} so'm</span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <TimerCard startTime={order.createdAt} paused={isPaused} />
      </div>

      <div className="flex gap-2">
        {order.status === 'pending' && (
          <>
            <button
              onClick={() => onAccept(order.id)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-success text-white font-bold rounded-xl shadow-success hover:brightness-110 active:scale-[0.97] transition-all text-sm"
            >
              <Check size={18} />
              Qabul qilish
            </button>
            <button
              onClick={() => onReject(order.id)}
              className="flex items-center justify-center px-4 py-3 border border-danger/20 bg-danger/5 text-danger font-bold rounded-xl hover:bg-danger/10 active:scale-[0.97] transition-all"
            >
              Bekor
            </button>
          </>
        )}
        {order.status === 'preparing' && (
          <button
            onClick={() => onReady(order.id)}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white font-bold rounded-xl shadow-primary hover:brightness-110 active:scale-[0.97] transition-all text-sm"
          >
            <ChefHat size={18} />
            Tayyor
          </button>
        )}
        {order.status === 'preparing' && (
          <button
            onClick={() => onPause(order.id)}
            className="flex items-center justify-center px-4 py-3 border border-warning/20 bg-warning/5 text-warning font-bold rounded-xl hover:bg-warning/10 active:scale-[0.97] transition-all"
          >
            {isPaused ? <PlayCircle size={20} /> : <PauseCircle size={20} />}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function SellerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user, sellerStats, orders, sellerNotifications, logout, acceptOrder, readyOrder, updateOrderStatus
  } = useStore();

  const [pausedOrders, setPausedOrders] = useState([]);
  const [newAlert, setNewAlert] = useState(null);
  const prevCountRef = useRef(orders.length);

  const stats = sellerStats || {};
  const todayRevenue = stats.todayRevenue || 0;
  const orderStats = stats.orders || {};
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const cookingCount = orders.filter(o => o.status === 'preparing').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;
  const avgPrepTime = stats.avgPrepTime || 0;

  const unreadNotifs = sellerNotifications ? sellerNotifications.filter(n => !n.read).length : 0;

  useEffect(() => {
    if (orders.length > prevCountRef.current) {
      const newest = orders[0];
      if (newest && newest.status === 'pending') {
        setNewAlert(newest);
        setTimeout(() => setNewAlert(null), 4000);
      }
    }
    prevCountRef.current = orders.length;
  }, [orders]);

  const handleAccept = (id) => { acceptOrder(id); };
  const handleReady = (id) => { readyOrder(id); };
  const handleReject = (id) => { updateOrderStatus(id, 'cancelled'); };
  const handlePause = (id) => {
    setPausedOrders(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing');
  const recentOrders = orders.slice(0, 8);

  const navItems = [
    { label: 'KDS', icon: Home, path: '/seller' },
    { label: 'Buyurtmalar', icon: ShoppingBag, path: '/seller/orders' },
    { label: 'Menyu', icon: UtensilsCrossed, path: '/seller/menu' },
    { label: 'Statistika', icon: BarChart3, path: '/seller/analytics' },
    { label: 'Sozlamalar', icon: Settings, path: '/seller/settings' },
  ];

  const isActive = (path) => {
    if (path === '/seller') return location.pathname === '/seller';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-full bg-bg pb-24">
      <AnimatePresence>
        {newAlert && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.9 }}
            className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto bg-surface border border-primary/20 rounded-2xl p-4 shadow-lg flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Volume2 size={24} className="text-primary animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-text">Yangi buyurtma!</p>
              <p className="text-sm text-textMuted">#{String(newAlert.id).slice(-4)} - {formatPrice(newAlert.total)} so'm</p>
            </div>
            <button onClick={() => setNewAlert(null)} className="text-textMuted hover:text-text p-1">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-text tracking-tight">KDS Panel</h1>
            {user && <p className="text-sm text-textMuted mt-0.5">{user.name || user.phone}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/seller/orders')}
              className="relative w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-borderStrong transition-all"
            >
              <Bell size={20} className="text-textMuted" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center px-1">
                  {unreadNotifs > 9 ? '9+' : unreadNotifs}
                </span>
              )}
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-danger/30 hover:bg-danger/5 transition-all"
            >
              <span className="text-textMuted text-lg">⇥</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <p className="text-2xl font-extrabold text-warning tabular-nums">{pendingCount}</p>
            <p className="text-xs text-textMuted font-medium">Yangi</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <p className="text-2xl font-extrabold text-info tabular-nums">{cookingCount}</p>
            <p className="text-xs text-textMuted font-medium">Tayyorlanmoqda</p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-3 text-center">
            <p className="text-2xl font-extrabold text-success tabular-nums">{readyCount}</p>
            <p className="text-xs text-textMuted font-medium">Tayyor</p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4 mb-4 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-primary/5 pointer-events-none" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-textMuted">Bugungi tushum</p>
              <p className="text-3xl font-extrabold text-text tabular-nums tracking-tight">
                {formatCurrency(todayRevenue)} <span className="text-base text-textMuted font-medium">so'm</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <DollarSign size={24} className="text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-text">Faol buyurtmalar</h2>
          <span className="text-xs text-textMuted">{activeOrders.length} ta</span>
        </div>

        {activeOrders.length === 0 ? (
          <div className="bg-surface border border-border rounded-2xl p-8 text-center">
            <ChefHat size={40} className="mx-auto mb-3 text-borderStrong" />
            <p className="font-semibold text-text">Buyurtmalar yo'q</p>
            <p className="text-sm text-textMuted mt-1">Yangi buyurtmalarni kuting</p>
          </div>
        ) : (
          <div>
            {activeOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onAccept={handleAccept}
                onReady={handleReady}
                onReject={handleReject}
                onPause={handlePause}
                pausedOrders={pausedOrders}
              />
            ))}
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
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