import { LayoutDashboard, Package, Clock, User } from 'lucide-react';
import useDriverStore from '../store/useDriverStore';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'profile', label: 'Profile', icon: User },
];

const styles = {
  nav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    padding: '0 12px',
    paddingBottom: 'env(safe-area-inset-bottom, 10px)',
  },
  inner: {
    maxWidth: 480,
    margin: '0 auto',
    borderRadius: 24,
    background: 'rgba(255, 255, 255, 0.92)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid var(--border)',
    boxShadow: '0 8px 40px rgba(45, 42, 38, 0.12), 0 0 1px rgba(45, 42, 38, 0.08)',
    padding: '0 6px',
  },
  tabs: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 64,
  },
  tab: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    padding: '6px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'var(--font-family)',
  },
  iconWrap: {
    padding: 6,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.25s ease',
  },
  label: {
    fontSize: 10,
    fontWeight: 500,
    transition: 'all 0.25s ease',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    background: 'var(--color-danger)',
    color: 'white',
    fontSize: 9,
    fontWeight: 700,
    borderRadius: 'var(--radius-full)',
    minWidth: 18,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(224, 49, 49, 0.3)',
    padding: '0 4px',
  },
};

const activeColor = 'var(--color-primary)';
const inactiveColor = 'var(--text-muted)';

export default function DriverBottomNav() {
  const activePage = useDriverStore((s) => s.activePage);
  const setActivePage = useDriverStore((s) => s.setActivePage);
  const availableOrders = useDriverStore((s) => s.availableOrders);

  const pendingCount = availableOrders.length;

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <div style={styles.tabs}>
          {tabs.map((tab) => {
            const isActive = activePage === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePage(tab.id)}
                style={{
                  ...styles.tab,
                  color: isActive ? activeColor : inactiveColor,
                }}
              >
                <div
                  style={{
                    ...styles.iconWrap,
                    background: isActive ? 'var(--color-primary-light)' : 'transparent',
                  }}
                >
                  <Icon size={20} color={isActive ? activeColor : inactiveColor} />
                </div>
                <span
                  style={{
                    ...styles.label,
                    color: isActive ? activeColor : inactiveColor,
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  {tab.label}
                </span>
                {tab.id === 'orders' && pendingCount > 0 && (
                  <span style={styles.badge}>{pendingCount}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
