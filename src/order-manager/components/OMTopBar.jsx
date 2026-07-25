import { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Sun, Moon, LogOut, User, ChevronDown } from 'lucide-react';
import useOrderManagerStore from '../store/useOrderManagerStore';

export default function OMTopBar() {
  const {
    toggleSidebar, notifications, darkMode, toggleDarkMode,
    logout, setActivePage, unreadCount,
  } = useOrderManagerStore();
  const [time, setTime] = useState(new Date());
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const today = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const currentTime = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const count = unreadCount();

  return (
    <header className="om-topbar">
      <div className="om-topbar-left">
        <button onClick={toggleSidebar} className="om-topbar-btn om-menu-btn">
          <Menu size={22} />
        </button>
        <div className="om-online-badge">
          <div className="om-online-dot" />
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-success)' }}>Online</span>
        </div>
      </div>

      <div className="om-topbar-right">
        <div className="om-time-display om-topbar-time">
          <span>{today}</span>
          <span style={{ width: '1px', height: '14px', background: 'var(--border)' }} />
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{currentTime}</span>
        </div>

        <button onClick={toggleDarkMode} className="om-topbar-btn" title={darkMode ? 'Light mode' : 'Dark mode'}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="om-topbar-btn" title="Notifications">
          <Bell size={18} />
          {count > 0 && <span className="badge">{count}</span>}
        </button>

        <div ref={profileRef} style={{ position: 'relative' }}>
          <button onClick={() => setProfileOpen(!profileOpen)} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '4px 8px 4px 4px', borderRadius: '10px',
            background: 'none', border: '1.5px solid transparent',
            cursor: 'pointer', transition: 'all 0.2s ease',
          }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Nodira</span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {profileOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: '200px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '14px', boxShadow: '0 12px 40px rgba(0,0,0,0.12)', zIndex: 100, overflow: 'hidden',
            }}>
              <button onClick={() => { setActivePage('profile'); setProfileOpen(false); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-family)',
              }}>
                <User size={16} /> Profile
              </button>
              <div style={{ height: '1px', background: 'var(--border)' }} />
              <button onClick={() => { logout(); setProfileOpen(false); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '13px', color: 'var(--color-danger)', fontFamily: 'var(--font-family)',
              }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
