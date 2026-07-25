import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import useDriverStore from './store/useDriverStore';
import DriverTopBar from './components/DriverTopBar';
import './driver.css';

const DriverLoginPage = lazy(() => import('./pages/DriverLoginPage'));
const DriverDashboard = lazy(() => import('./pages/DriverDashboard'));
const DriverOrdersPage = lazy(() => import('./pages/DriverOrdersPage'));
const DriverDeliveryDetailPage = lazy(() => import('./pages/DriverDeliveryDetailPage'));
const DriverHistoryPage = lazy(() => import('./pages/DriverHistoryPage'));
const DriverEarningsPage = lazy(() => import('./pages/DriverEarningsPage'));
const DriverProfilePage = lazy(() => import('./pages/DriverProfilePage'));
const DriverNotificationsPage = lazy(() => import('./pages/DriverNotificationsPage'));

function DriverLoader() {
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
      }}>
        <div style={{
          width: '42px', height: '42px', borderRadius: '14px',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-terracotta))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(232, 89, 12, 0.3)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>
          <span style={{ fontWeight: 900, color: 'white', fontSize: '13px' }}>BF</span>
        </div>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
          Loading...
        </span>
      </div>
    </div>
  );
}

/* ── Toast Component ── */
function DriverToast() {
  const toast = useDriverStore((s) => s.toast);
  if (!toast) return null;
  return (
    <div className={`driver-toast ${toast.type}`} style={{ animation: 'slideDown 0.3s ease-out' }}>
      {toast.message}
    </div>
  );
}

/* ── Bottom Navigation (mobile) ── */
const navTabs = [
  { path: '/driver/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/driver/orders', label: 'Orders', icon: '📦' },
  { path: '/driver/history', label: 'History', icon: '🕐' },
  { path: '/driver/profile', label: 'Profile', icon: '👤' },
];

function DriverBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const availableOrders = useDriverStore((s) => s.availableOrders);

  const hide = ['/driver/login', '/driver/delivery'].some(p => location.pathname.startsWith(p));
  if (hide) return null;

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50,
      padding: '0 12px',
      paddingBottom: 'env(safe-area-inset-bottom, 10px)',
    }}>
      <div style={{
        maxWidth: '480px', margin: '0 auto', borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 40px rgba(45, 42, 38, 0.12), 0 0 1px rgba(45, 42, 38, 0.08)',
        padding: '0 6px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '64px' }}>
          {navTabs.map((tab) => {
            const active = location.pathname === tab.path;
            return (
              <button key={tab.path} onClick={() => navigate(tab.path)}
                style={{
                  position: 'relative', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: '2px', padding: '6px 14px',
                  borderRadius: 'var(--radius-md)', background: 'none', border: 'none',
                  cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: active ? 'var(--color-primary)' : 'var(--text-muted)',
                }}>
                <div style={{
                  padding: '6px', borderRadius: 'var(--radius-md)',
                  background: active ? 'var(--color-primary-light)' : 'transparent',
                  transition: 'all 0.25s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <span style={{ fontSize: '18px' }}>{tab.icon}</span>
                  {tab.path === '/driver/orders' && availableOrders.length > 0 && (
                    <span style={{
                      position: 'absolute', top: '-4px', right: '-6px',
                      background: 'var(--color-danger)', color: 'white',
                      fontSize: '9px', fontWeight: 700,
                      borderRadius: 'var(--radius-full)',
                      minWidth: '18px', height: '18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(224, 49, 49, 0.3)',
                      padding: '0 4px',
                    }}>
                      {availableOrders.length}
                    </span>
                  )}
                </div>
                <span style={{
                  fontSize: '10px', fontWeight: active ? 600 : 500,
                  color: active ? 'var(--color-primary)' : 'var(--text-muted)',
                  transition: 'all 0.25s ease',
                }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DriverLayout({ children }) {
  const location = useLocation();
  const isDetailPage = ['/driver/delivery'].some(p => location.pathname.startsWith(p));

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-primary)', position: 'relative',
    }}>
      {!isDetailPage && <DriverTopBar />}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {children}
      </div>
      <DriverBottomNav />
      <DriverToast />
    </div>
  );
}

export default function DriverApp() {
  const { isAuthenticated } = useDriverStore();

  return (
    <Routes>
      <Route path="/driver/login" element={
        isAuthenticated ? <Navigate to="/driver/dashboard" /> : <DriverLoginPage />
      } />
      <Route path="/driver/*" element={
        isAuthenticated ? (
          <DriverLayout>
            <Suspense fallback={<DriverLoader />}>
              <Routes>
                <Route path="dashboard" element={<DriverDashboard />} />
                <Route path="orders" element={<DriverOrdersPage />} />
                <Route path="delivery" element={<DriverDeliveryDetailPage />} />
                <Route path="history" element={<DriverHistoryPage />} />
                <Route path="earnings" element={<DriverEarningsPage />} />
                <Route path="profile" element={<DriverProfilePage />} />
                <Route path="notifications" element={<DriverNotificationsPage />} />
                <Route path="*" element={<Navigate to="/driver/dashboard" />} />
              </Routes>
            </Suspense>
          </DriverLayout>
        ) : (
          <Navigate to="/driver/login" />
        )
      } />
    </Routes>
  );
}
