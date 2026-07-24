import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, MapPin } from 'lucide-react';
import useStore from '../store/useStore';
import Logo from './Logo';

export default function Header({ title, showBack = false, showNotifications = true, transparent = false }) {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const notifications = useStore((s) => s.notifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      padding: '12px 16px',
      paddingTop: 'env(safe-area-inset-top, 12px)',
      background: transparent ? 'transparent' : 'rgba(255, 248, 241, 0.88)',
      backdropFilter: transparent ? 'none' : 'blur(30px)',
      WebkitBackdropFilter: transparent ? 'none' : 'blur(30px)',
      borderBottom: transparent ? 'none' : '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: 'var(--text-primary)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {title ? (
            <>
              <Logo size="sm" />
              <h1 style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
              }}>{title}</h1>
            </>
          ) : (
            <>
              <Logo size="sm" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: 'var(--text-secondary)',
                  fontSize: '10px',
                }}>
                  <MapPin size={10} color="var(--color-primary)" />
                  <span>Tashkent, Uzbekistan</span>
                </div>
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>{user?.name || 'Welcome'}</span>
              </div>
            </>
          )}
        </div>
        {showNotifications && (
          <button
            onClick={() => navigate('/notifications')}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: 'var(--text-secondary)',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
            }}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
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
              }}>
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
