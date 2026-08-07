import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BarChart3, ShoppingBasket, Grid3X3, Tag, TrendingUp, Warehouse,
  Users, Building, ShoppingCart, IndianRupee, Bell, Settings,
} from 'lucide-react';
import useStore from '../../store/useStore';

const ADMIN_NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/analytics', icon: BarChart3, label: "Tahlillar", exact: true },
  { to: '/admin/orders', icon: ShoppingBasket, label: 'Buyurtmalar' },
  { to: '/admin/products', icon: Grid3X3, label: 'Mahsulotlar' },
  { to: '/admin/categories', icon: ShoppingBasket, label: 'Kategoriyalar' },
  { to: '/admin/promotions', icon: Tag, label: 'Akcotlin uz' },
  { to: '/admin/inventory', icon: Warehouse, label: 'Ombor' },
  { to: '/admin/suppliers', icon: Building, label: 'Ta\'minotchilar' },
  { to: '/admin/purchases', icon: ShoppingCart, label: 'Xaridlar' },
  { to: '/admin/expenses', icon: IndianRupee, label: 'Xarajatlar' },
  { to: '/admin/profit', icon: TrendingUp, label: 'Foyda' },
  { to: '/admin/employees', icon: Users, label: 'Xodimlar' },
  { to: '/admin/notifications', icon: Bell, label: 'Eslatmalar' },
  { to: '/admin/settings', icon: Settings, label: 'Sozlamalar' },
];

export default function AdminNav({ vertical = true, onItemClick }) {
  const { user } = useStore();
  const roleLabel = user?.role;
  return (
    <nav className={vertical ? 'admin-nav-vertical' : 'admin-nav-horizontal'}>
      <div className="admin-nav-section" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
        <div className="flex items-center gap-3" style={{ gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700, flexShrink: 0 }}>
            {user?.name?.[0] || 'A'}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Admin'}</div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{roleLabel} / BEK FOOD</div>
          </div>
        </div>
      </div>
      {ADMIN_NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.exact}
          onClick={onItemClick}
          className={({ isActive }) =>
            `admin-nav-item ${isActive ? 'active' : ''}`
          }
          style={{
            display: 'flex', alignItems: 'center', gap: 12, margin: '2px 8px', padding: '11px 14px', borderRadius: 'var(--radius-sm)',
            fontSize: 13, fontWeight: 500, transition: 'all .18s var(--ease)', flexShrink: 0,
          }}
        >
          <item.icon size={17} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
