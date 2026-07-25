import { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Sun, Moon, LogOut, User, ChevronDown } from 'lucide-react';
import useDriverStore from '../store/useDriverStore';

const pageTitles = {
  dashboard: 'Boshqaruv paneli',
  orders: 'Buyurtmalar',
  history: 'Tarix',
  earnings: 'Daromad',
  profile: 'Profil',
};

export default function DriverTopBar() {
  const {
    toggleSidebar, darkMode, toggleDarkMode, logout,
    setActivePage, isOnline, toggleOnline, profile,
  } = useDriverStore();
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

  const today = time.toLocaleDateString('uz-UZ', { weekday: 'short', month: 'short', day: 'numeric' });
  const currentTime = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <header className="driver-topbar">
      <div className="driver-topbar-left">
        <button onClick={toggleSidebar} className="driver-topbar-btn driver-menu-btn">
          <Menu size={22} />
        </button>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {pageTitles[activePage] || 'Boshqaruv paneli'}
        </h1>
      </div>

      <div className="driver-topbar-right">
        <button
          onClick={toggleOnline}
          className="driver-online-badge"
          style={{ cursor: 'pointer', border: 'none' }}
        >
          <div className="driver-online-dot" style={{ background: isOnline ? 'var(--color-success)' : 'var(--text-muted)' }} />
          <span style={{ fontSize: '11px', fontWeight: 600, color: isOnline ? 'var(--color-success)' : 'var(--text-muted)' }}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </button>

        <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: '10px' }}>
          {today} · <span style={{ fontVariantNumeric: 'tabular-nums' }}>{currentTime}</span>
        </div>

        <button onClick={toggleDarkMode} className="driver-topbar-btn">
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div ref={profileRef} style={{ position: 'relative' }}>
          <button onClick={() => setProfileOpen(!profileOpen)} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '4px 8px 4px 4px', borderRadius: '10px',
            background: 'none', border: '1.5px solid transparent',
            cursor: 'pointer', transition: 'all 0.2s ease',
          }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', overflow: 'hidden' }}>
              <img src={profile.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{profile.name.split(' ')[0]}</span>
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
                <User size={16} /> Profil
              </button>
              <div style={{ height: '1px', background: 'var(--border)' }} />
              <button onClick={() => { logout(); setProfileOpen(false); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '13px', color: 'var(--color-danger)', fontFamily: 'var(--font-family)',
              }}>
                <LogOut size={16} /> Chiqish
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
