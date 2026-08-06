import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import {
  LayoutDashboard,
  Hamburger,
  FolderOpen,
  Gift,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  Search,
  UserCircle2,
  ShoppingBag,
  Box,
  TrendingDown,
  Users,
  ShoppingCart,
  UserCheck,
  DollarSign,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Buyurtmalar', path: '/admin/orders', icon: ShoppingBag },
  { label: 'Mahsulotlar', path: '/admin/products', icon: Hamburger },
  { label: 'Kategoriyalar', path: '/admin/categories', icon: FolderOpen },
  { label: 'Promotions', path: '/admin/promotions', icon: Gift },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { label: 'Inventory', path: '/admin/inventory', icon: Box },
  { label: 'Expenses', path: '/admin/expenses', icon: TrendingDown },
  { label: 'Suppliers', path: '/admin/suppliers', icon: Users },
  { label: 'Purchases', path: '/admin/purchases', icon: ShoppingCart },
  { label: 'Employees', path: '/admin/employees', icon: UserCheck },
  { label: 'Profit', path: '/admin/profit', icon: DollarSign },
  { label: 'Notifications', path: '/admin/notifications', icon: Bell },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useStore();
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
    <div className="admin-shell" style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      overflowX: 'hidden',
      background: 'var(--bg)',
      color: 'var(--text)',
      fontFamily: 'var(--font-sans)',
    }}>
      <style>{`
        .admin-shell{display:flex;min-height:100vh;width:100%;overflow-x:hidden;background:var(--bg);color:var(--text)}
        .admin-aside::-webkit-scrollbar{width:0}
        .admin-nav-item{display:flex;align-items:center;gap:10px;padding:12px 12px;border-radius:12px;font-size:13px;font-weight:500;color:var(--text-muted);cursor:pointer;transition:all .15s var(--ease);white-space:nowrap;min-height:44px}
        .admin-nav-item:hover{background:var(--surface-active);color:var(--text)}
        .admin-nav-item.active{background:var(--primary-light);color:var(--primary);font-weight:600}
        .admin-nav-item.active svg{color:var(--primary)}
        .admin-content{overflow-x:hidden!important;min-width:0;display:flex;flex-direction:column}
        .admin-content-shell{flex:1;overflow:auto}
        .admin-mobile-topbar{display:none;align-items:center;justify-content:space-between;padding:12px 14px;background:var(--surface);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:50;backdrop-filter:blur(12px)}
        .admin-mobile-topbar button{min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;border-radius:10px}
        .admin-mobile-topbar .brand-pill{display:flex;align-items:center;gap:8px;min-width:0}
        .admin-mobile-topbar .brand-pill span{font-size:14px;font-weight:700;white-space:nowrap}
        @media(max-width:1024px){
          .admin-mobile-topbar{display:flex!important}
          .admin-aside{position:fixed;top:0;left:0;bottom:0;z-index:100;transform:translateX(-100%);transition:transform .3s var(--ease);width:min(84vw,280px)!important;min-width:min(84vw,280px)!important}
          .admin-aside.open{transform:translateX(0)}
          .admin-overlay{position:fixed;inset:0;background:rgba(0,0,0,.3);z-index:99;opacity:0;pointer-events:none;transition:opacity .3s}
          .admin-overlay.open{opacity:1;pointer-events:all}
          .admin-content{margin-left:0!important}
          .admin-close-btn{display:flex!important}
        }
        @media(max-width:768px){
          .admin-mobile-topbar{padding:12px 12px!important}
          .admin-nav-item{padding:12px 12px;font-size:14px}
          .admin-sidebar-header{padding:16px 14px 14px!important}
          .admin-content-shell > div{padding-left:12px!important;padding-right:12px!important}
        }
        @media(min-width:1025px){
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
        className={`admin-aside ${sidebarOpen ? 'open' : ''}`}
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
        <div className="admin-sidebar-header" style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <img src="/logo.png" alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2, letterSpacing: '-.02em' }}>BEK FOOD</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Admin panel</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="admin-close-btn"
              style={{
                marginLeft: 'auto', display: 'none', background: 'none', border: 'none',
                cursor: 'pointer', padding: 4, color: 'var(--text-muted)',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="admin-nav-list" style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
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
            padding: '12px 14px',
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
          <div className="brand-pill" style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <img src="/logo.png" alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' }}>BEK FOOD</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button style={{ background: 'var(--surface-active)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: 0 }}>
              <Search size={18} />
            </button>
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
            <button style={{ background: 'var(--surface-active)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: 0 }}>
              <UserCircle2 size={20} />
            </button>
          </div>
        </div>

        <style>{`
          @media(max-width:1024px){
            .admin-mobile-topbar{display:flex!important}
          }
        `}</style>

        {/* Page content */}
        <div className="admin-content-shell" style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}