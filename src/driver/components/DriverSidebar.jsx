import { LayoutDashboard, Package, Clock, DollarSign, User, LogOut, X, ChevronLeft, ChevronRight } from 'lucide-react';
import useDriverStore from '../store/useDriverStore';

const menuItems = [
  { id: 'dashboard', label: 'Boshqaruv paneli', icon: LayoutDashboard },
  { id: 'orders', label: 'Buyurtmalar', icon: Package },
  { id: 'history', label: 'Tarix', icon: Clock },
  { id: 'earnings', label: 'Daromad', icon: DollarSign },
  { id: 'profile', label: 'Profil', icon: User },
];

export default function DriverSidebar() {
  const {
    activePage, setActivePage, sidebarOpen, setSidebarOpen,
    sidebarCollapsed, toggleSidebarCollapsed, logout, profile,
  } = useDriverStore();

  return (
    <>
      {sidebarOpen && <div className="driver-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`driver-sidebar${sidebarCollapsed ? ' driver-collapsed' : ''}${sidebarOpen ? ' driver-open' : ''}`}>
        <div className="driver-sidebar-header">
          <div className="driver-sidebar-brand">
            <div className="driver-sidebar-logo"><span>BF</span></div>
            {!sidebarCollapsed && (
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>BEK FOOD</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Yetkazish xizmati</div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => setSidebarOpen(false)} className="om-modal-close" style={{ display: 'none' }} id="driver-close-sidebar">
              <X size={18} />
            </button>
            <button onClick={toggleSidebarCollapsed} className="driver-topbar-btn" title={sidebarCollapsed ? 'Kengaytirish' : "Yig'ish"}>
              {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </div>

        <nav className="driver-sidebar-nav">
          {!sidebarCollapsed && <div className="driver-sidebar-label">Navigatsiya</div>}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}
                className={`driver-sidebar-item${active ? ' active' : ''}`}
                title={sidebarCollapsed ? item.label : undefined}
                style={sidebarCollapsed ? { justifyContent: 'center', padding: '10px' } : {}}
              >
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="driver-sidebar-user">
          <div className="driver-sidebar-user-card" style={sidebarCollapsed ? { justifyContent: 'center', padding: '8px' } : {}}>
            <div className="driver-sidebar-user-avatar">
              <img src={profile.photo} alt={profile.name} />
            </div>
            {!sidebarCollapsed && (
              <>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{profile.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>⭐ {profile.rating}</div>
                </div>
                <button onClick={logout} className="driver-topbar-btn" title="Chiqish"><LogOut size={16} /></button>
              </>
            )}
          </div>
        </div>
      </aside>

      <style>{`
        @media (max-width: 1023px) {
          #driver-close-sidebar { display: flex !important; }
        }
      `}</style>
    </>
  );
}
