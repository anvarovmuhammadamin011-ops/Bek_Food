import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MapPin } from 'lucide-react';
import useDriverStore from '../store/useDriverStore';

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function DriverTopBar({ hideOnline = false }) {
  const navigate = useNavigate();
  const profile = useDriverStore((s) => s.profile);
  const isOnline = useDriverStore((s) => s.isOnline);
  const toggleOnline = useDriverStore((s) => s.toggleOnline);
  const unreadCount = useDriverStore((s) => s.unreadCount);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={styles.bar}>
      <div style={styles.inner}>
        {/* Left: photo + name */}
        <div style={styles.left}>
          <img
            src={profile.photo}
            alt={profile.name}
            style={styles.avatar}
          />
          <div style={styles.nameBlock}>
            <span style={styles.name}>{profile.name}</span>
            <div style={styles.locationRow}>
              <MapPin size={10} color="var(--text-muted)" />
              <span style={styles.location}>Tashkent</span>
            </div>
          </div>
        </div>

        {/* Right: time, bell, toggle */}
        <div style={styles.right}>
          <span style={styles.time}>{formatTime(time)}</span>

          <button onClick={() => navigate('/driver/notifications')} style={styles.bellBtn}>
            <Bell size={18} color="var(--text-primary)" />
            {unreadCount() > 0 && (
              <span style={styles.bellBadge}>{unreadCount()}</span>
            )}
          </button>

          {!hideOnline && (
            <button
              onClick={toggleOnline}
              style={{
                ...styles.toggle,
                background: isOnline ? 'var(--color-success)' : 'var(--border-strong)',
                boxShadow: isOnline ? '0 2px 12px rgba(43, 138, 62, 0.35)' : 'none',
              }}
              aria-label={isOnline ? 'Go offline' : 'Go online'}
            >
              <div
                style={{
                  ...styles.knob,
                  left: isOnline ? 29 : 3,
                }}
              />
              <span
                style={{
                  ...styles.toggleLabel,
                  color: isOnline ? 'white' : 'var(--text-muted)',
                }}
              >
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  bar: {
    position: 'sticky',
    top: 0,
    zIndex: 40,
    background: 'rgba(255, 248, 241, 0.88)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    borderBottom: '1px solid var(--border)',
    padding: '10px 16px',
  },
  inner: {
    maxWidth: 480,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 'var(--radius-full)',
    objectFit: 'cover',
    border: '2px solid var(--border)',
    flexShrink: 0,
  },
  nameBlock: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  name: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 600,
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  locationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 3,
  },
  location: {
    fontSize: 10,
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  time: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-family)',
  },
  bellBtn: {
    position: 'relative',
    width: 36,
    height: 36,
    borderRadius: 'var(--radius-full)',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: 'var(--shadow-sm)',
    padding: 0,
  },
  bellBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    background: 'var(--color-danger)',
    color: 'white',
    fontSize: 9,
    fontWeight: 700,
    borderRadius: 'var(--radius-full)',
    minWidth: 16,
    height: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(224, 49, 49, 0.3)',
    padding: '0 4px',
  },
  toggle: {
    position: 'relative',
    width: 56,
    height: 30,
    borderRadius: 15,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },
  knob: {
    position: 'absolute',
    top: 3,
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: 'white',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  toggleLabel: {
    position: 'absolute',
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    transition: 'color 0.3s ease',
    pointerEvents: 'none',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
};
