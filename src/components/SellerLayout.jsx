import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import { on, off } from '../lib/socket';
import {
  LayoutDashboard, ShoppingBag, Bike, Bell, UserCircle,
  LogOut, Menu, X, ChevronRight, Check, Volume2, VolumeX,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/seller', icon: LayoutDashboard },
  { label: 'Buyurtmalar', path: '/seller/orders', icon: ShoppingBag },
  { label: 'Yetkazish', path: '/seller/delivery', icon: Bike },
  { label: 'Bildirishnomalar', path: '/seller/notifications', icon: Bell },
  { label: 'Profil', path: '/seller/profile', icon: UserCircle },
];

const PAGE_TITLES = {
  '/seller': 'Dashboard',
  '/seller/orders': 'Buyurtmalar',
  '/seller/delivery': 'Yetkazish',
  '/seller/notifications': 'Bildirishnomalar',
  '/seller/profile': 'Profil',
};

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
  } catch {}
};

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
  const unreadNotifs = (store.sellerNotifications || []).filter((n) => !n.isRead).length;
  const soundEnabled = store.soundEnabled !== false;

  const pageTitle = useMemo(() => {
    const exact = PAGE_TITLES[location.pathname];
    if (exact) return exact;
    const prefix = Object.keys(PAGE_TITLES).find((p) => p !== '/seller' && location.pathname.startsWith(p));
    return prefix ? PAGE_TITLES[prefix] : 'Buyurtmachi';
  }, [location.pathname]);

  useEffect(() => {
    if (!prevOrdersRef.current) { prevOrdersRef.current = orders; return; }
    const prevIds = new Set(prevOrdersRef.current.map((o) => o.id));
    const newPending = orders.find((o) => !prevIds.has(o.id) && o.status === 'pending');
    if (newPending && !beepedIdsRef.current.includes(newPending.id)) {
      beepedIdsRef.current = [...beepedIdsRef.current, newPending.id];
      if (soundEnabled) playBeep();
      setQuickOrder(newPending);
    }
    prevOrdersRef.current = orders;
  }, [orders.length, orders.map((o) => o.id).join(',')]);

  useEffect(() => {
    if (!quickOrder) return;
    const t = setTimeout(() => setQuickOrder(null), 12000);
    return () => clearTimeout(t);
  }, [quickOrder]);

  useEffect(() => {
    const handler = (n) => {
      store.pushSellerNotif?.(n);
      if (soundEnabled && n.type === 'order') playBeep();
    };
    on('seller:notify', handler);
    return () => off('seller:notify', handler);
  }, [soundEnabled]);

  const isActive = (path) => {
    if (path === '/seller') return location.pathname === '/seller';
    return location.pathname.startsWith(path);
  };
  const handleNav = (path) => { navigate(path); setSidebarOpen(false); };
  const handleLogout = () => { store?.logout?.(); navigate('/login'); };
  const handleQuickAccept = () => { if (quickOrder) { store.acceptOrder(quickOrder.id); setQuickOrder(null); } };
  const handleQuickReject = () => { if (quickOrder) { store.rejectOrder(quickOrder.id); setQuickOrder(null); } };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', minHeight: '100dvh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--font-sans)' }}>
      <style>{`
        .sl-nav-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:var(--radius-sm);font-size:14px;font-weight:500;color:var(--text-muted);cursor:pointer;transition:all .15s var(--ease);white-space:nowrap;min-height:48px}
        .sl-nav-item:hover{background:var(--surface-active);color:var(--text)}
        .sl-nav-item.active{background:var(--primary-light);color:var(--primary);font-weight:600}
        .sl-nav-item.active svg{color:var(--primary)}

        .sl-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:99;opacity:0;pointer-events:none;transition:opacity .25s var(--ease);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px)}
        .sl-overlay.open{opacity:1;pointer-events:all}

        @media(max-width:1023px){
          .sl-sidebar{position:fixed!important;top:0;left:0;bottom:0;z-index:100;width:min(82vw,300px)!important;min-width:min(82vw,300px)!important;transform:translateX(-100%);transition:transform .3s var(--ease);box-shadow:none}
          .sl-sidebar.open{transform:translateX(0);box-shadow:var(--shadow-xl)}
          .sl-content{margin-left:0!important}
          .sl-desktop-only{display:none!important}
        }
        @media(min-width:1024px){
          .sl-overlay{display:none}
          .sl-topbar-mobile{display:none!important}
          .sl-quick-toast{top:16px!important;right:16px!important}
        }
        @media(max-width:1023px) and (min-height:700px){
          .sl-sidebar{padding-bottom:env(safe-area-inset-bottom,0px)}
        }
        @media(max-width:480px){
          .sl-topbar-mobile{padding:10px 12px!important}
          .sl-topbar-title{font-size:17px!important}
        }
        @keyframes slideInLeft{from{transform:translateX(-100%)}to{transform:translateX(0)}}
      `}</style>

      {quickOrder && (
        <div className="sl-quick-toast" style={{ position: 'fixed', top: 16, right: 16, left: 'max(16px, calc(50% - 170px))', zIndex: 200, width: 'min(340px, calc(100vw - 32px))', animation: 'fadeInDown .35s var(--ease)', background: 'var(--surface)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: '0 12px 40px rgba(239,68,68,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'linear-gradient(135deg, #FEF2F2, #FFF7ED)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bell size={16} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)', margin: 0 }}>Yangi buyurtma #{String(quickOrder.id).slice(-4)}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>{quickOrder.customerName}</p>
            </div>
            <button onClick={() => setQuickOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 8, minWidth: 36, minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}><X size={16} /></button>
          </div>
          <div style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {(quickOrder.items || []).slice(0, 2).map((it, i) => <span key={i}>{it.quantity}x {it.food?.name}{i < Math.min(quickOrder.items.length, 2) - 1 ? ', ' : ''}</span>)}
              {quickOrder.items?.length > 2 ? ` +${quickOrder.items.length - 2}` : ''}
            </span>
            <span style={{ color: 'var(--primary)', fontWeight: 700, whiteSpace: 'nowrap' }}>{(quickOrder.total || 0).toLocaleString('uz-UZ')} so'm</span>
          </div>
          <div style={{ display: 'flex', gap: 8, padding: '0 16px 14px' }}>
            <button onClick={handleQuickAccept} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '13px 0', borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--success)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', minHeight: 48 }}>
              <Check size={16} /> Qabul qilish
            </button>
            <button onClick={handleQuickReject} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '13px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', color: 'var(--danger)', fontSize: 14, fontWeight: 700, cursor: 'pointer', minHeight: 48, minWidth: 48 }}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className={`sl-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`sl-sidebar ${sidebarOpen ? 'open' : ''}`} style={{ width: 260, minWidth: 260, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100vh', height: '100dvh', position: 'sticky', top: 0, overflowY: 'auto' }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/logo.png" alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>BEK FOOD</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Buyurtmachi paneli</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: 'var(--text-muted)', minWidth: 36, minHeight: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 8 }} className="sl-nav-close"><X size={18} /></button>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const badge = item.path === '/seller/orders' ? pendingCount : item.path === '/seller/notifications' ? unreadNotifs : 0;
              return (
                <div key={item.path} className={`sl-nav-item ${active ? 'active' : ''}`} onClick={() => handleNav(item.path)}>
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {badge > 0 && (
                    <span style={{ marginLeft: 'auto', minWidth: 20, height: 20, borderRadius: 10, background: 'var(--danger)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                  {active && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: .5 }} />}
                </div>
              );
            })}
          </div>
        </nav>

        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div className="sl-nav-item" onClick={() => store.toggleSound?.()} title="Bildirishnoma ovozi">
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            <span>Ovoz {soundEnabled ? 'yoqilgan' : "o'chirilgan"}</span>
          </div>
          <div className="sl-nav-item" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
            <LogOut size={20} />
            <span>Chiqish</span>
          </div>
        </div>
      </aside>

      <div className="sl-content" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="sl-topbar-mobile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50, minHeight: 56 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 10, color: 'var(--text)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 44, minHeight: 44 }}><Menu size={22} /></button>
          <h1 className="sl-topbar-title" style={{ fontSize: 18, fontWeight: 700, margin: 0, flex: 1, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pageTitle}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button onClick={() => navigate('/seller/notifications')} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 10, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)' }}>
              <Bell size={20} color="var(--text-muted)" />
              {unreadNotifs > 0 && (
                <span style={{ position: 'absolute', top: 4, right: 4, minWidth: 18, height: 18, padding: '0 4px', borderRadius: 9, background: 'var(--danger)', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadNotifs > 99 ? '99+' : unreadNotifs}
                </span>
              )}
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>{children}</div>
      </div>
    </div>
  );
}
