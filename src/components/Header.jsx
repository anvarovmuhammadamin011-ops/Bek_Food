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
      background: transparent ? 'transparent' : 'rgba(10, 10, 10, 0.88)',
      backdropFilter: transparent ? 'none' : 'blur(30px)',
      WebkitBackdropFilter: transparent ? 'none' : 'blur(30px)',
      borderBottom: transparent ? 'none' : '1px solid var(--ajif-border)',
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
                borderRadius: 'var(--radius-sm)',
                background: 'var(--ajif-black-soft)',
                border: '1px solid var(--ajif-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: 'var(--ajif-white)',
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
                color: 'var(--ajif-white)',
              }}>{title}</h1>
            </>
          ) : (
            <>
              <Logo size="sm" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 700,
                  color: 'var(--ajif-white)',
                  fontFamily: 'var(--font-family-display)',
                  fontStyle: 'italic',
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
              borderRadius: 'var(--radius-sm)',
              background: 'var(--ajif-black-soft)',
              border: '1px solid var(--ajif-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: 'var(--ajif-white-muted)',
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
                background: 'var(--ajif-red)',
                color: 'white',
                fontSize: '9px',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                minWidth: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px var(--ajif-red-glow)',
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
