import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  Users,
  UserCog,
  BarChart3,
  Wallet,
  Package,
  Image,
  Star,
  ShieldCheck,
  Settings,
  Building2,
  TrendingUp,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  Store,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Buyurtmalar', path: '/admin/orders', icon: ShoppingCart },
  { label: 'Menyu', path: '/admin/menu', icon: UtensilsCrossed },
  { label: 'Mijozlar', path: '/admin/customers', icon: Users },
  { label: 'Xodimlar', path: '/admin/employees', icon: UserCog },
  { label: 'Analitika', path: '/admin/analytics', icon: BarChart3 },
  { label: 'Moliya', path: '/admin/finance', icon: Wallet },
  { label: 'Ombor', path: '/admin/inventory', icon: Package },
  { label: 'Bannerlar', path: '/admin/banners', icon: Image },
  { label: 'Sharhlar', path: '/admin/reviews', icon: Star },
  { label: 'Audit', path: '/admin/audit', icon: ShieldCheck },
  { label: 'Filiallar', path: '/admin/branches', icon: Building2 },
  { label: 'Statistika', path: '/admin/statistics', icon: TrendingUp },
  { label: 'Sozlamalar', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useStore();
  const user = store?.user || { name: 'Admin' };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unreadCount = 5;

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleNav = (path) => {
    navigate(path);
    setSidebarOpen(false);
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
        @media(max-width:1024px){
          .admin-sidebar{position:fixed;top:0;left:0;bottom:0;z-index:100;transform:translateX(-100%);transition:transform .3s var(--ease)}
          .admin-sidebar.open{transform:translateX(0)}
          .admin-overlay{position:fixed;inset:0;background:rgba(0,0,0,.3);z-index:99;opacity:0;pointer-events:none;transition:opacity .3s}
          .admin-overlay.open{opacity:1;pointer-events:all}
          .admin-content{margin-left:0!important}
        }
        @media(min-width:1029px){
          .admin-mobile-topbar{display:none!important}
        }
      `}</style>

      {/* Mobile overlay */}
      <div
        className={`admin-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
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
        {/* Logo */}
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-primary)',
            }}>
              <Store size={18} color="#fff" />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2, letterSpacing: '-.02em' }}>BEK FOOD</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Admin panel</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                marginLeft: 'auto', display: 'none', background: 'none', border: 'none',
                cursor: 'pointer', padding: 4, color: 'var(--text-muted)',
              }}
              className="lg-hide-close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="admin-sidebar" style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <div
                  key={item.path}
                  className={`admin-nav-item ${active ? 'active' : ''}`}
                  onClick={() => handleNav(item.path)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {active && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: .5 }} />}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
          <div
            className="admin-nav-item"
            onClick={() => { if (store?.logout) store.logout(); navigate('/login'); }}
            style={{ color: 'var(--danger)' }}
          >
            <LogOut size={18} />
            <span>Chiqish</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-content" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Mobile top bar */}
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
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: 'var(--text)', borderRadius: 8 }}
          >
            <Menu size={22} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Store size={16} color="#fff" />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700 }}>BEK FOOD</span>
          </div>
          <div style={{ position: 'relative' }}>
            <Bell size={20} color="var(--text-muted)" />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4, width: 16, height: 16,
                borderRadius: '50%', background: 'var(--danger)', color: '#fff',
                fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{unreadCount}</span>
            )}
          </div>
        </div>

        <style>{`
          @media(max-width:1024px){
            .admin-mobile-topbar{display:flex!important}
          }
        `}</style>

        {/* Page content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
