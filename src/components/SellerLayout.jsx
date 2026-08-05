import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import {
  LayoutDashboard,
  ShoppingBag,
  Bike,
  ReceiptText,
  UserCircle,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  Check,
  ShoppingCart,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/seller', icon: LayoutDashboard },
  { label: 'Buyurtmalar', path: '/seller/orders', icon: ShoppingBag },
  { label: 'Yetkazish', path: '/seller/delivery', icon: Bike },
  { label: 'Cheklar tarixi', path: '/seller/receipts', icon: ReceiptText },
  { label: 'Profil', path: '/seller/profile', icon: UserCircle },
];

const playBeep = () => {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const playTone = (freq, start, dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.05);
    };
    playTone(880, 0, 0.18);
    playTone(1320, 0.22, 0.25);
    setTimeout(() => ctx.close(), 1000);
  } catch {
    /* ovoz qo'llab-quvvatlanmasa */
  }
}

export default function SellerLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickOrder, setQuickOrder] = useState(null);
  const beepedIdsRef = useRef([]);
  const prevOrdersRef = useRef(null);

  const orders = store.orders || [];
  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  useEffect(() => {
    if (!prevOrdersRef.current) {
      prevOrdersRef.current = orders;
      return;
    }
    const prevIds = new Set(prevOrdersRef.current.map((o) => o.id));
    const newOnes = orders.filter((o) => !prevIds.has(o.id));
    const newPending = newOnes.find((o) => o.status === 'pending');
    if (newPending && !beepedIdsRef.current.includes(newPending.id)) {
      beepedIdsRef.current = [...beepedIdsRef.current, newPending.id];
      playBeep();
      setQuickOrder(newPending);
    }
    prevOrdersRef.current = orders;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders.length, orders.map((o) => o.id).join(',')]);

  useEffect(() => {
    if (!quickOrder) return;
    const t = setTimeout(() => setQuickOrder(null), 10000);
    return () => clearTimeout(t);
  }, [quickOrder]);

  const isActive = (path) => {
    if (path === '/seller') return location.pathname === '/seller';
    return location.pathname.startsWith(path);
  };

  const handleNav = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    if (store?.logout) store.logout();
    navigate('/login');
  };

  const handleQuickAccept = () => {
    if (!quickOrder) return;
    store.acceptOrder(quickOrder.id);
    setQuickOrder(null);
  };

  const handleQuickReject = () => {
    if (!quickOrder) return;
    store.cancelOrder(quickOrder.id);
    setQuickOrder(null);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: 'var(--font-sans)',
    }}>
      <style>{`
        .admin-sidebar::-webkit-scrollbar{width:0}
        .admin-nav-item{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:12px;font-size:13px;font-weight:500;color:var(--text-muted);cursor:pointer;transition:all .15s var(--ease);white-space:nowrap}
        .admin-nav-item:hover{background:var(--surface-active);color:var(--text)}
        .admin-nav-item.active{background:var(--primary-light);color:var(--primary);font-weight:600}
        .admin-nav-item.active svg{color:var(--primary)}
        .quick-accept{position:fixed;top:16px;right:16px;z-index:200;width:340px;max-width:calc(100vw - 32px);animation:quickIn .35s var(--ease)}
        @keyframes quickIn{from{opacity:0;transform:translateY(-16px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        .quick-pulse{animation:quickPulse 1s ease-in-out 3}
        @keyframes quickPulse{0%,100%{box-shadow:0 8px 30px rgba(239,68,68,.25)}50%{box-shadow:0 8px 30px rgba(239,68,68,.5)}}
        @media(max-width:1024px){
          .admin-sidebar{position:fixed;top:0;left:0;bottom:0;z-index:100;transform:translateX(-100%);transition:transform .3s var(--ease)}
          .admin-sidebar.open{transform:translateX(0)}
          .admin-overlay{position:fixed;inset:0;background:rgba(0,0,0,.3);z-index:99;opacity:0;pointer-events:none;transition:opacity .3s}
          .admin-overlay.open{opacity:1;pointer-events:all}
          .admin-content{margin-left:0!important}
          .admin-close-btn{display:flex!important}
        }
        @media(min-width:1029px){
          .admin-mobile-topbar{display:none!important}
        }
      `}</style>

      {quickOrder && (
        <div className="quick-accept quick-pulse" style={{ background: 'var(--surface)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'linear-gradient(135deg, #FEF2F2, #FFF7ED)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bell size={16} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)', margin: 0 }}>Yangi buyurtma #{String(quickOrder.id).slice(-4)}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>{quickOrder.customerName} · {quickOrder.customerPhone || ''}</p>
            </div>
            <button onClick={() => setQuickOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
              <X size={15} />
            </button>
          </div>
          <div style={{ padding: '12px 16px' }}>
            {(quickOrder.items || []).map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '2px 0', color: 'var(--text-secondary)' }}>
                <span>{item.quantity}x {item.food?.name}</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{(item.price * item.quantity).toLocaleString('uz-UZ')} so'm</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700, marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
              <span>Jami</span>
              <span>{(quickOrder.total || 0).toLocaleString('uz-UZ')} so'm</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, padding: '0 16px 14px' }}>
            <button onClick={handleQuickAccept} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 0', borderRadius: 10, border: 'none', background: 'var(--success)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              <Check size={15} /> Qabul qilish
            </button>
            <button onClick={handleQuickReject} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 0', borderRadius: 10, border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.06)', color: 'var(--danger)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              <X size={15} /> Rad etish
            </button>
          </div>
        </div>
      )}

      <div className={`admin-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside
        className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          width: 256,
          minWidth: 256,
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2, letterSpacing: '-.02em' }}>BEK FOOD</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Sotuvchi paneli</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{ marginLeft: 'auto', display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-muted)' }}
              className="admin-close-btn"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <div key={item.path} className={`admin-nav-item ${active ? 'active' : ''}`} onClick={() => handleNav(item.path)}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.path === '/seller/orders' && pendingCount > 0 && (
                    <span style={{ marginLeft: 'auto', minWidth: 18, height: 18, borderRadius: 9, background: 'var(--danger)', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>
                      {pendingCount > 9 ? '9+' : pendingCount}
                    </span>
                  )}
                  {active && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: .5 }} />}
                </div>
              );
            })}
          </div>
        </nav>

        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
          <div className="admin-nav-item" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
            <LogOut size={18} />
            <span>Chiqish</span>
          </div>
        </div>
      </aside>

      <div className="admin-content" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div
          className="admin-mobile-topbar"
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: 'var(--text)', borderRadius: 8 }}>
            <Menu size={22} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/logo.png" alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ fontSize: 14, fontWeight: 700 }}>BEK FOOD</span>
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => navigate('/seller/orders?status=pending')} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <ShoppingCart size={20} color="var(--text-muted)" />
              {pendingCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, padding: '0 4px',
                  borderRadius: '50%', background: 'var(--danger)', color: '#fff', fontSize: 9, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'livePulse 1.2s ease-in-out infinite',
                }}>{pendingCount > 9 ? '9+' : pendingCount}</span>
              )}
            </button>
          </div>
        </div>

        <style>{`
          @media(max-width:1024px){
            .admin-mobile-topbar{display:flex!important}
          }
        `}</style>

        <div style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
