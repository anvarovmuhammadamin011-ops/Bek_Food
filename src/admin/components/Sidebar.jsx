import { useState, useEffect } from 'react';
import {
  LayoutDashboard, ShoppingCart, Truck, UtensilsCrossed, Tag, Users,
  Package, BarChart3, Settings, Bell, LogOut, X, ChevronLeft, ChevronRight,
  TrendingUp, ClipboardList,
} from 'lucide-react';
import useAdminStore from '../store/useAdminStore';

const menuItems = [
  { id: 'dashboard', label: 'Boshqaruv paneli', icon: LayoutDashboard },
  { id: 'orders', label: 'Buyurtmalar', icon: ShoppingCart },
  { id: 'delivery', label: 'Yetkazish', icon: Truck },
  { id: 'drivers', label: 'Haydovchilar', icon: Users },
  { id: 'food', label: 'Mahsulotlar', icon: UtensilsCrossed },
  { id: 'categories', label: 'Kategoriyalar', icon: Tag },
  { id: 'promotions', label: 'Aksiyalar', icon: TrendingUp },
  { id: 'customers', label: 'Mijozlar', icon: Users },
  { id: 'inventory', label: 'Ombor', icon: Package },
  { id: 'analytics', label: 'Analitika', icon: BarChart3 },
  { id: 'notifications', label: 'Bildirishnomalar', icon: Bell },
  { id: 'settings', label: 'Sozlamalar', icon: Settings },
];

export default function Sidebar() {
  const {
    activePage, setActivePage, sidebarOpen, setSidebarOpen,
    sidebarCollapsed, toggleSidebarCollapsed, logout, notifications,
  } = useAdminStore();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const collapsed = sidebarCollapsed;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar${collapsed ? ' collapsed' : ''}${sidebarOpen ? ' mobile-open' : ''}`}
      >
        {/* Header */}
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">
            <div className="admin-sidebar-logo">
              <span>AC</span>
            </div>
            {!collapsed && (
              <div className="admin-sidebar-brand-text">
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  Alif Cafe
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Admin Panel
                </div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Close button (mobile) */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="admin-sidebar-close"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px',
              }}
            >
              <X size={18} />
            </button>
            {/* Collapse button (desktop) */}
            <button
              onClick={toggleSidebarCollapsed}
              className="admin-sidebar-collapse-btn"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="admin-sidebar-nav">
          <div className="admin-sidebar-label" style={collapsed ? { textAlign: 'center', padding: '12px 4px 6px', fontSize: '8px' } : {}}>
            {collapsed ? '—' : 'Main Menu'}
          </div>
          {menuItems.slice(0, 6).map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setSidebarOpen(false);
                }}
                className={`admin-sidebar-item${active ? ' active' : ''}`}
                title={collapsed ? item.label : undefined}
                style={collapsed ? { justifyContent: 'center', padding: '10px' } : {}}
              >
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                {!collapsed && <span className="admin-sidebar-item-label">{item.label}</span>}
              </button>
            );
          })}

          <div className="admin-sidebar-label" style={collapsed ? { textAlign: 'center', padding: '12px 4px 6px', fontSize: '8px' } : {}}>
            {collapsed ? '—' : 'Management'}
          </div>
          {menuItems.slice(6).map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            const showBadge = item.id === 'notifications' && unreadCount > 0;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setSidebarOpen(false);
                }}
                className={`admin-sidebar-item${active ? ' active' : ''}`}
                title={collapsed ? item.label : undefined}
                style={collapsed ? { justifyContent: 'center', padding: '10px' } : {}}
              >
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                {!collapsed && <span className="admin-sidebar-item-label">{item.label}</span>}
                {showBadge && (
                  <span className="admin-sidebar-badge" style={collapsed ? {
                    position: 'absolute', top: '4px', right: '4px', minWidth: '14px', height: '14px', fontSize: '8px',
                  } : {}}>
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="admin-sidebar-user">
          <div className="admin-sidebar-user-card" style={collapsed ? { justifyContent: 'center', padding: '8px' } : {}}>
            <div className="admin-sidebar-user-avatar">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                alt="Admin"
              />
            </div>
            {!collapsed && (
              <div className="admin-sidebar-user-info">
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Alif Admin</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Super Admin</div>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={logout}
                className="admin-sidebar-logout-btn"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Style for close button visibility */}
      <style>{`
        @media (max-width: 1023px) {
          .admin-sidebar-close { display: flex !important; }
        }
      `}</style>
    </>
  );
}
