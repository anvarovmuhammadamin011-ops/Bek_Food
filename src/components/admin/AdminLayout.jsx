import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';
import AdminNav from './AdminNav';
import { AdminProvider, useAdminContext } from './AdminContext';
import { RANGE_OPTIONS } from '../../lib/constants';

function AdminHeader({ onMenuClick, mobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { range, setRange, setDays, searchQuery, setSearchQuery } = useAdminContext();
  const title = ADMIN_TITLE[location.pathname] || 'Dashboard';

  return (
    <header className="admin-header" style={{
      position: 'sticky', top: 0, zIndex: 10, background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      padding: mobile ? '12px 16px' : '16px 24px', display: 'flex', alignItems: 'center', gap: 12, minHeight: 56,
    }}>
      <button type="button" onClick={onMenuClick} className="admin-menu-btn" aria-label="Menu" style={{
        display: mobile ? 'flex' : 'none', width: 38, height: 38, borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)',
        background: 'var(--surface-hover)', cursor: 'pointer', alignItems: 'center', justifyContent: 'center',
      }}>
        <Menu size={18} />
      </button>
      <h1 style={{ fontSize: mobile ? 18 : 20, fontWeight: 700, color: 'var(--text)', margin: 0, flex: 1, minWidth: 0 }}>{title}</h1>

      {!mobile && (
        <div className="admin-date-range" style={{ display: 'flex', gap: 6, marginRight: 8 }}>
          {RANGE_OPTIONS.map((o) => (
            <button key={o.value} type="button" onClick={() => { setRange(o.value); setDays(o.days); }}
              className="btn btn-sm btn-secondary" style={{ fontSize: 12, height: 34, borderWidth: o.value === range ? 2 : 1, borderColor: o.value === range ? 'var(--primary)' : 'var(--border)', background: o.value === range ? 'var(--primary-light)' : 'var(--surface)' }}>
              {o.label}
            </button>
          ))}
        </div>
      )}

      <div className="admin-search" style={{ position: 'relative', display: mobile ? 'none' : 'flex', alignItems: 'center' }}>
        <Search size={15} style={{ position: 'absolute', left: 10, color: 'var(--text-dim)' }} />
        <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Qidirish..." className="input" style={{ paddingLeft: 36, height: 36, maxWidth: 220, fontSize: 13 }} />
      </div>

      <button type="button" onClick={() => navigate('/admin/notifications')} aria-label="Notifications" style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Bell size={17} />
      </button>
      <button type="button" onClick={() => navigate('/admin/settings')} aria-label="Profile" style={{ width: 36, height: 36, borderRadius: 'var(--radius-full)', border: '1.5px solid var(--border)', background: 'var(--primary-light)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 14 }}>AD</span>
      </button>
    </header>
  );
}

const ADMIN_TITLE = {
  '/admin': 'Dashboard',
  '/admin/analytics': 'Tahlillar',
  '/admin/orders': 'Buyurtmalar',
  '/admin/products': 'Mahsulotlar',
  '/admin/categories': 'Kategoriyalar',
  '/admin/promotions': 'Akcotlin uz',
  '/admin/inventory': 'Ombor',
  '/admin/suppliers': "Ta'minotchilar",
  '/admin/purchases': 'Xaridlar',
  '/admin/expenses': 'Xarajatlar',
  '/admin/profit': 'Foyda',
  '/admin/employees': 'Xodimlar',
  '/admin/notifications': 'Eslatmalar',
  '/admin/settings': 'Sozlamalar',
};

function AdminShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobile, setMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const location = useLocation();

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const onResize = () => setMobile(window.innerWidth < 768);
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="admin-root" style={{ display: 'flex', minHeight: '100dvh', background: 'var(--bg)', overflow: 'hidden' }}>
      {!mobile && <aside className="admin-sidebar" style={{ width: 256, borderRight: '1px solid var(--border)', background: 'var(--surface)', overflowY: 'auto', flexShrink: 0 }}><AdminNav onItemClick={() => setDrawerOpen(false)} /></aside>}
      <div className="admin-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AdminHeader onMenuClick={() => setDrawerOpen(true)} mobile={mobile} />
        <main className="admin-content" style={{ flex: 1, overflow: 'auto', padding: mobile ? '16px' : '24px' }}>
          <Outlet />
        </main>
      </div>

      <div className="admin-drawer-backdrop" onClick={() => setDrawerOpen(false)} style={{ display: drawerOpen && mobile ? 'block' : 'none', position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 90 }} />
      <aside className={`admin-drawer ${mobile ? 'open' : ''}`} style={{ display: mobile ? 'block' : 'none', position: 'fixed', top: 0, left: 0, width: 264, height: '100dvh', background: 'var(--surface)', borderRight: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)', zIndex: 95, transform: (drawerOpen && mobile) ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform .25s var(--ease)' }}>
        <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close" style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)', background: 'var(--surface-hover)', cursor: 'pointer' }}>
            <Menu size={18} />
          </button>
        </div>
        <AdminNav onItemClick={() => setDrawerOpen(false)} />
      </aside>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AdminProvider>
      <AdminShell>
        <Outlet />
      </AdminShell>
    </AdminProvider>
  );
}
