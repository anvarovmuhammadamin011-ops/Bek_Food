import { LayoutDashboard, Package, Truck, FileText, User, LogOut, X, ChevronLeft, ChevronRight } from 'lucide-react';
import useOrderManagerStore from '../store/useOrderManagerStore';

const menuItems = [
  { id: 'dashboard', label: 'Boshqaruv paneli', icon: LayoutDashboard },
  { id: 'orders', label: 'Buyurtmalar', icon: Package },
  { id: 'delivery', label: 'Yetkazish buyurtmalari', icon: Truck },
  { id: 'receipts', label: 'Chek tarixi', icon: FileText },
  { id: 'profile', label: 'Profil', icon: User },
];

export default function OMSidebar() {
  const {
    activePage, setActivePage, sidebarOpen, setSidebarOpen,
    sidebarCollapsed, toggleSidebarCollapsed, logout, operator,
  } = useOrderManagerStore();

  return (
    <>
      {sidebarOpen && <div className="om-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`om-sidebar${sidebarCollapsed ? ' om-collapsed' : ''}${sidebarOpen ? ' om-open' : ''}`}>
        <div className="om-sidebar-header">
          <div className="om-sidebar-brand">
            <div className="om-sidebar-logo"><span style={{ fontFamily: 'var(--font-family-display)', fontStyle: 'italic' }}>AJif</span></div>
            {!sidebarCollapsed && (
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-family-display)', fontStyle: 'italic' }}>AJIF</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Order Manager</div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => setSidebarOpen(false)} className="om-modal-close" style={{ display: 'none' }} id="om-close-sidebar">
              <X size={18} />
            </button>
            <button onClick={toggleSidebarCollapsed} className="om-topbar-btn" title={sidebarCollapsed ? 'Kengaytirish' : 'Yig\'ish'}>
              {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </div>

        <nav className="om-sidebar-nav">
          {!sidebarCollapsed && <div className="om-sidebar-label">Navigatsiya</div>}
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}
                className={`om-sidebar-item${active ? ' active' : ''}`}
                title={sidebarCollapsed ? item.label : undefined}
                style={sidebarCollapsed ? { justifyContent: 'center', padding: '10px' } : {}}
              >
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="om-sidebar-user">
          <div className="om-sidebar-user-card" style={sidebarCollapsed ? { justifyContent: 'center', padding: '8px' } : {}}>
            <div className="om-sidebar-user-avatar">
              <img src={operator.photo} alt={operator.name} />
            </div>
            {!sidebarCollapsed && (
              <>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{operator.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{operator.role}</div>
                </div>
                <button onClick={logout} className="om-topbar-btn" title="Logout"><LogOut size={16} /></button>
              </>
            )}
          </div>
        </div>
      </aside>

      <style>{`
        @media (max-width: 1023px) {
          #om-close-sidebar { display: flex !important; }
        }
      `}</style>
    </>
  );
}
