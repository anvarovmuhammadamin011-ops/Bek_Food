import { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, Sun, Moon, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import useAdminStore from '../store/useAdminStore';

const pageTitles = {
  dashboard: 'Boshqaruv paneli',
  orders: 'Buyurtmalar boshqaruvi',
  delivery: 'Yetkazish boshqaruvi',
  drivers: 'Haydovchilar boshqaruvi',
  food: 'Mahsulotlar',
  categories: 'Kategoriyalar boshqaruvi',
  promotions: 'Aksiyalar',
  customers: 'Mijozlar boshqaruvi',
  inventory: 'Ombor boshqaruvi',
  analytics: 'Analitika',
  notifications: 'Bildirishnomalar',
  settings: 'Sozlamalar',
};

export default function AdminHeader() {
  const {
    toggleSidebar, notifications, activePage, setActivePage,
    darkMode, toggleDarkMode, logout,
  } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="admin-header">
      {/* Left */}
      <div className="admin-header-left">
        <button
          onClick={toggleSidebar}
          className="admin-header-btn admin-header-menu-btn"
          style={{ display: 'none' }}
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="admin-header-title">
            {pageTitles[activePage] || 'Dashboard'}
          </h1>
        </div>
      </div>

      {/* Right */}
      <div className="admin-header-right">
        {/* Search */}
        <div className="admin-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Date */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '10px',
          background: 'var(--bg-secondary)',
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--text-secondary)',
        }}>
          {today}
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="admin-header-btn"
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => setActivePage('notifications')}
          className="admin-header-btn"
          title="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="badge">{unreadCount}</span>
          )}
        </button>

        {/* Live indicator */}
        <div className="admin-live-indicator">
          <div className="admin-live-dot" />
          <span className="admin-live-text">Live</span>
        </div>

        {/* Profile */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="admin-profile-btn"
          >
            <div className="admin-profile-avatar">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                alt="Admin"
              />
            </div>
            <span className="admin-profile-name">Bekzod</span>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          {profileOpen && (
            <div className="admin-profile-dropdown">
              <button
                className="admin-profile-dropdown-item"
                onClick={() => { setActivePage('settings'); setProfileOpen(false); }}
              >
                <User size={16} />
                Profile
              </button>
              <button
                className="admin-profile-dropdown-item"
                onClick={() => { setActivePage('settings'); setProfileOpen(false); }}
              >
                <Settings size={16} />
                Settings
              </button>
              <div className="admin-profile-dropdown-divider" />
              <button
                className="admin-profile-dropdown-item danger"
                onClick={() => { logout(); setProfileOpen(false); }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
