import { useLocation, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, ShoppingCart, ClipboardList, User, Heart } from 'lucide-react';
import useStore from '../store/useStore';

const tabs = [
  { path: '/', icon: UtensilsCrossed, label: 'Menu' },
  { path: '/favorites', icon: Heart, label: 'Favorites' },
  { path: '/cart', icon: ShoppingCart, label: 'Cart' },
  { path: '/orders', icon: ClipboardList, label: 'Orders' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = useStore((s) => s.cart);
  const hide = ['/splash', '/login', '/register', '/otp', '/forgot', '/food/', '/checkout'].some(p => location.pathname.startsWith(p));
  if (hide) return null;

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      padding: '0 12px',
      paddingBottom: 'env(safe-area-inset-bottom, 10px)',
    }}>
      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--border)',
        boxShadow: '0 8px 40px rgba(45, 42, 38, 0.12), 0 0 1px rgba(45, 42, 38, 0.08)',
        padding: '0 6px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: '64px',
        }}>
          {tabs.map((tab) => {
            const active = location.pathname === tab.path;
            const Icon = tab.icon;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  color: active ? 'var(--color-primary)' : 'var(--text-muted)',
                }}
              >
                <div style={{
                  padding: '6px',
                  borderRadius: 'var(--radius-md)',
                  background: active ? 'var(--color-primary-light)' : 'transparent',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}>
                  <Icon size={active ? 19 : 21} strokeWidth={active ? 2.3 : 1.8} />
                  {tab.label === 'Cart' && totalItems > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-6px',
                      background: 'var(--color-danger)',
                      color: 'white',
                      fontSize: '9px',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-full)',
                      minWidth: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(224, 49, 49, 0.3)',
                      padding: '0 4px',
                      animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}>
                      {totalItems}
                    </span>
                  )}
                </div>
                <span style={{
                  fontSize: '10px',
                  fontWeight: active ? 600 : 500,
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
