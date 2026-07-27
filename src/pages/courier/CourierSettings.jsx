import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Lock,
  Globe,
  Bell,
  Moon,
  Clock,
  LogOut,
  Star,
  Shield
} from 'lucide-react';

const CourierSettings = () => {
  const navigate = useNavigate();
  const { user, logout } = useStore();
  const [isOnline, setIsOnline] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: User, label: "Profil ma'lumotlari", path: '/courier/profile/edit' },
    { icon: Phone, label: 'Telefon', value: user?.phone || '+998 90 123 45 67' },
    { icon: Lock, label: 'Parol', path: '/courier/password' },
    { icon: Globe, label: "Til", value: "O'zbek" },
    {
      icon: Bell,
      label: 'Bildirishnomalar',
      toggle: true,
      checked: notifications,
      onChange: () => setNotifications(!notifications)
    },
    {
      icon: Moon,
      label: 'Dark Mode',
      toggle: true,
      checked: darkMode,
      onChange: () => setDarkMode(!darkMode),
      disabled: true
    },
    {
      icon: Clock,
      label: 'Ish rejimi',
      badge: 'Faol'
    }
  ];

  return (
    <div className="animate-fade-in" style={styles.container}>
      {/* Header */}
      <div className="flex items-center justify-between" style={styles.header}>
        <button
          className="btn btn-primary"
          onClick={() => navigate(-1)}
          style={styles.backBtn}
        >
          <ChevronLeft size={20} />
        </button>
        <h1 style={styles.title}>Sozlamalar</h1>
        <div style={{ width: 40 }} />
      </div>

      {/* Profile Card */}
      <div className="card card-hover animate-fade-in" style={styles.profileCard}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div style={styles.avatar}>
              <span style={styles.avatarText}>
                {user?.name?.charAt(0)?.toUpperCase() || 'C'}
              </span>
            </div>
            <div style={styles.profileInfo}>
              <h2 style={styles.profileName}>{user?.name || 'Kuryer'}</h2>
              <p style={styles.profilePhone}>{user?.phone || '+998 90 123 45 67'}</p>
              <div className="flex items-center" style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    style={{
                      ...styles.star,
                      fill: star <= (user?.rating || 5) ? '#fbbf24' : 'transparent',
                      color: star <= (user?.rating || 5) ? '#fbbf24' : '#6b7280'
                    }}
                  />
                ))}
                <span style={styles.ratingText}>{user?.rating || 5.0}</span>
              </div>
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/courier/profile/edit')}
            style={styles.editBtn}
          >
            Tahrirlash
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="stagger" style={styles.menuCard}>
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`card-hover ${index !== menuItems.length - 1 ? 'menu-border' : ''}`}
            style={styles.menuItem}
            onClick={item.toggle ? undefined : () => navigate(item.path)}
          >
            <div className="flex items-center">
              <div style={styles.menuIcon}>
                <item.icon size={20} color="#d4a574" />
              </div>
              <span style={styles.menuLabel}>{item.label}</span>
            </div>
            <div className="flex items-center">
              {item.value && <span style={styles.menuValue}>{item.value}</span>}
              {item.badge && (
                <span style={styles.badge}>{item.badge}</span>
              )}
              {item.toggle ? (
                <div
                  style={{
                    ...styles.toggle,
                    backgroundColor: item.checked ? '#b8860b' : '#4a5568',
                    opacity: item.disabled ? 0.7 : 1
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!item.disabled && item.onChange) item.onChange();
                  }}
                >
                  <div
                    style={{
                      ...styles.toggleDot,
                      transform: item.checked ? 'translateX(18px)' : 'translateX(2px)'
                    }}
                  />
                </div>
              ) : (
                <ChevronRight size={18} color="#718096" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Status Toggle Card */}
      <div className="card card-hover animate-fade-in" style={styles.statusCard}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div style={styles.statusIcon}>
              <Shield size={24} color="#d4a574" />
            </div>
            <div>
              <h3 style={styles.statusTitle}>Ish holati</h3>
              <p style={styles.statusText}>
                {isOnline ? 'Siz hozir online’asiz' : 'Siz hozir offline’asiz'}
              </p>
            </div>
          </div>
          <div
            style={{
              ...styles.statusToggle,
              backgroundColor: isOnline ? '#22c55e' : '#6b7280'
            }}
            onClick={() => setIsOnline(!isOnline)}
          >
            <div
              style={{
                ...styles.statusToggleDot,
                transform: isOnline ? 'translateX(22px)' : 'translateX(2px)'
              }}
            />
          </div>
        </div>
        <p style={styles.statusDescription}>
          Online bo’lganingizda buyurtmalar sizga taqdim etiladi
        </p>
      </div>

      {/* Emergency Contact */}
      <div className="card card-hover animate-fade-in" style={styles.emergencyCard}>
        <div className="flex items-center justify-between">
          <div>
            <h3 style={styles.emergencyTitle}>Tez yordam</h3>
            <p style={styles.emergencyText}>Muammo bo’lganda bog’laning</p>
          </div>
          <button className="btn btn-primary" style={styles.emergencyBtn}>
            <Phone size={16} />
            <span>Qo’ng’iroq</span>
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <button
        className="card card-hover animate-fade-in"
        onClick={handleLogout}
        style={styles.logoutBtn}
      >
        <LogOut size={20} color="#ef4444" />
        <span style={styles.logoutText}>Chiqish</span>
      </button>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#1a1a1a',
    padding: '20px',
    paddingBottom: '100px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingTop: 10
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2d2d2d',
    border: '1px solid #3d3d3d',
    color: '#d4a574',
    cursor: 'pointer'
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: '#f5f5f5',
    margin: 0
  },
  profileCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    border: '1px solid #3d3d3d'
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    backgroundColor: '#b8860b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 700,
    color: '#fff'
  },
  profileInfo: {
    flex: 1
  },
  profileName: {
    fontSize: 18,
    fontWeight: 600,
    color: '#f5f5f5',
    margin: '0 0 4px 0'
  },
  profilePhone: {
    fontSize: 14,
    color: '#a0a0a0',
    margin: '0 0 6px 0'
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 2
  },
  star: {
    fill: '#fbbf24'
  },
  ratingText: {
    fontSize: 13,
    color: '#a0a0a0',
    marginLeft: 6
  },
  editBtn: {
    padding: '8px 16px',
    fontSize: 13,
    backgroundColor: '#b8860b',
    borderRadius: 8,
    border: 'none',
    color: '#fff',
    cursor: 'pointer'
  },
  menuCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    marginBottom: 20,
    border: '1px solid #3d3d3d',
    overflow: 'hidden'
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    cursor: 'pointer',
    borderBottom: '1px solid #3d3d3d',
    backgroundColor: 'transparent',
    transition: 'background-color 0.2s'
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(212, 165, 116, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  menuLabel: {
    fontSize: 15,
    color: '#f5f5f5',
    fontWeight: 500
  },
  menuValue: {
    fontSize: 13,
    color: '#a0a0a0',
    marginRight: 8
  },
  badge: {
    padding: '4px 10px',
    borderRadius: 20,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    color: '#22c55e',
    fontSize: 12,
    fontWeight: 600,
    marginRight: 8
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    display: 'flex',
    alignItems: 'center'
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: '#fff',
    transition: 'transform 0.3s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  statusCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    border: '1px solid #3d3d3d'
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(212, 165, 116, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#f5f5f5',
    margin: '0 0 4px 0'
  },
  statusText: {
    fontSize: 13,
    color: '#a0a0a0',
    margin: 0
  },
  statusToggle: {
    width: 52,
    height: 28,
    borderRadius: 14,
    padding: 2,
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    display: 'flex',
    alignItems: 'center'
  },
  statusToggleDot: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: '#fff',
    transition: 'transform 0.3s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  statusDescription: {
    fontSize: 13,
    color: '#718096',
    marginTop: 14,
    marginBottom: 0,
    fontStyle: 'italic'
  },
  emergencyCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    border: '1px solid #3d3d3d'
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#f5f5f5',
    margin: '0 0 4px 0'
  },
  emergencyText: {
    fontSize: 13,
    color: '#a0a0a0',
    margin: 0
  },
  emergencyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    backgroundColor: '#b8860b',
    borderRadius: 10,
    border: 'none',
    color: '#fff',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer'
  },
  logoutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '16px 20px',
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    border: '1px solid #ef4444',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 600,
    color: '#ef4444'
  }
};

export default CourierSettings;
