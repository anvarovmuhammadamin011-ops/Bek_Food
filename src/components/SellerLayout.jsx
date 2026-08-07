import { useState, useEffect, useRef } from 'react';
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
  } catch { /* ovoz qo'llab-quvvatlanmasa */ }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        .sl-nav-item{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:12px;font-size:13px;font-weight:500;color:var(--text-muted);cursor:pointer;transition:all .15s var(--ease);white-space:nowrap}
        .sl-nav-item:hover{background:var(--surface-active);color:var(--text)}
        .sl-nav-item.active{background:var(--primary-light);color:var(--primary);font-weight:600}
        .sl-nav-item.active svg{color:var(--primary)}
        .sl-topbar button{min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;border-radius:10px}
        .quick-accept{position:fixed;top:16px;right:16px;z-index:200;width:340px;max-width:calc(100vw - 32px);animation:quickIn .35s var(--ease)}
        @keyframes quickIn{from{opacity:0;transform:translateY(-16px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        .quick-pulse{animation:quickPulse 1s ease-in-out 3}
        @keyframes quickPulse{0%,100%{box-shadow:0 8px 30px rgba(239,68,68,.25)}50%{box-shadow:0 8px 30px rgba(239,68,68,.5)}}
        @media(max-width:1024px){
          .sl-sidebar{position:fixed;top:0;left:0;bottom:0;z-index:100;transform:translateX(-100%);transition:transform .3s var(--ease);width:min(84vw,280px)!important;min-width:min(84vw,280px)!important}
          .sl-sidebar.open{transform:translateX(0)}
          .sl-overlay{position:fixed;inset:0;background:rgba(0,0,0,.3);z-index:99;opacity:0;pointer-events:none;transition:opacity .3s}
          .sl-overlay.open{opacity:1;pointer-events:all}
          .sl-content{margin-left:0!important}
          .sl-close-btn{display:flex!important}
        }
        @media(max-width:768px){
          .sl-topbar{padding:12px 14px!important}
          .sl-nav-item{padding:12px 12px;font-size:14px}
        }
        @media(min-width:1029px){.sl-topbar{display:none!important}}
      `}</style>

      {quickOrder && (
        <div className="quick-accept quick-pulse" style={{ background: 'var(--surface)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'linear-gradient(135deg, #FEF2F2, #FFF7ED)', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bell size={16} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)', margin: 0 }}>Yangi buyurtma #{String(quickOrder.id).slice(-4)}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>{quickOrder.customerName}</p>
            </div>
            <button onClick={() => setQuickOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}><X size={15} /></button>
          </div>
          <div style={{ padding: '10px 16px', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
            {(quickOrder.items || []).slice(0, 2).map((it, i) => <span key={i}>{it.quantity}x {it.food?.name}{i < Math.min(quickOrder.items.length, 2) - 1 ? ', ' : ''}</span>)}
            {quickOrder.items?.length > 2 ? ` +${quickOrder.items.length - 2} ta` : ''}
            <span style={{ float: 'right', color: 'var(--primary)' }}>{(quickOrder.total || 0).toLocaleString('uz-UZ')} so'm</span>
          </div>
          <div style={{ display: 'flex', gap: 8, padding: '0 16px 14px' }}>
            <button onClick={handleQuickAccept} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 0', borderRadius: 10, border: 'none', background: 'var(--success)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              <Check size={16} /> Qabul qilish
            </button>
            <button onClick={handleQuickReject} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.06)', color: 'var(--danger)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className={`sl-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`sl-sidebar ${sidebarOpen ? 'open' : ''}`} style={{ width: 256, minWidth: 256, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100vh', height: '100dvh', position: 'sticky', top: 0, overflowY: 'auto' }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>BEK FOOD</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Buyurtmachi paneli</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} style={{ marginLeft: 'auto', display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-muted)' }} className="sl-close-btn"><X size={18} /></button>
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
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {badge > 0 && (
                    <span style={{ marginLeft: 'auto', minWidth: 18, height: 18, borderRadius: 9, background: 'var(--danger)', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                  {active && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: .5 }} />}
                </div>
              );
            })}
          </div>
        </nav>

        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div className="sl-nav-item" onClick={() => { store.toggleSound?.(); }} title="Bildirishnoma ovozi">
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span>Ovoz {soundEnabled ? 'yoqilgan' : 'o\'chirilgan'}</span>
          </div>
          <div className="sl-nav-item" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
            <LogOut size={18} />
            <span>Chiqish</span>
          </div>
        </div>
      </aside>

      <div className="sl-content" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="sl-topbar" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: 'var(--text)', borderRadius: 8 }}><Menu size={22} /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/logo.png" alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
            <span style={{ fontSize: 14, fontWeight: 700 }}>BEK FOOD</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => navigate('/seller/notifications')} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <Bell size={20} color="var(--text-muted)" />
              {unreadNotifs > 0 && (
                <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, padding: '0 4px', borderRadius: '50%', background: 'var(--danger)', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadNotifs > 9 ? '9+' : unreadNotifs}
                </span>
              )}
            </button>
            <button onClick={() => navigate('/seller/orders?status=pending')} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <ShoppingBag size={20} color="var(--text-muted)" />
              {pendingCount > 0 && (
                <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, padding: '0 4px', borderRadius: '50%', background: 'var(--danger)', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'livePulse 1.2s ease-in-out infinite' }}>
                  {pendingCount > 9 ? '9+' : pendingCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
      </div>
    </div>
  );
}
