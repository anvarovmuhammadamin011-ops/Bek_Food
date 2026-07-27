import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Globe,
  Moon,
  LogOut,
  Store,
  Clock,
  MapPin,
  Settings,
} from 'lucide-react';

const SellerSettings = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const [restaurantName, setRestaurantName] = useState('Bekfood Restoran');
  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [workTime, setWorkTime] = useState('10:00 - 23:00');
  const [minOrder, setMinOrder] = useState('0 so\'m');
  const [deliveryPrice, setDeliveryPrice] = useState('Bepul');
  const [deliveryRadius, setDeliveryRadius] = useState('5 km');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const Toggle = ({ enabled, onToggle }) => (
    <div
      onClick={onToggle}
      style={{
        width: '40px',
        height: '22px',
        borderRadius: '11px',
        backgroundColor: enabled ? '#c8a97e' : '#3a3a3a',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          position: 'absolute',
          top: '2px',
          left: enabled ? '20px' : '2px',
          transition: 'left 0.3s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}
      />
    </div>
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#f0e6d3',
      fontFamily: "'Inter', -apple-system, sans-serif",
      paddingBottom: '100px',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px',
      backgroundColor: '#1a1a1a',
      borderBottom: '1px solid #2a2a2a',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    backBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: '#c8a97e',
      fontSize: '14px',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
    },
    title: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#f0e6d3',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    placeholder: {
      width: '60px',
    },
    content: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      animation: 'fadeIn 0.5s ease',
    },
    card: {
      backgroundColor: '#2a2a2a',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #3a3a3a',
    },
    cardHover: {
      backgroundColor: '#2a2a2a',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #3a3a3a',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    profileSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    avatar: {
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      backgroundColor: '#c8a97e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      fontWeight: '700',
      color: '#1a1a1a',
      flexShrink: 0,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#f0e6d3',
      marginBottom: '4px',
    },
    userPhone: {
      fontSize: '14px',
      color: '#8a8a8a',
      marginBottom: '6px',
    },
    roleBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      backgroundColor: 'rgba(200, 169, 126, 0.15)',
      color: '#c8a97e',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#c8a97e',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    inputGroup: {
      marginBottom: '16px',
    },
    inputLabel: {
      display: 'block',
      fontSize: '13px',
      color: '#8a8a8a',
      marginBottom: '6px',
      fontWeight: '500',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      backgroundColor: '#1a1a1a',
      border: '1px solid #3a3a3a',
      borderRadius: '12px',
      color: '#f0e6d3',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box',
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 0',
      borderBottom: '1px solid #3a3a3a',
    },
    menuItemLast: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 0',
    },
    menuItemLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    menuItemIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      backgroundColor: 'rgba(200, 169, 126, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#c8a97e',
    },
    menuItemText: {
      fontSize: '15px',
      fontWeight: '500',
      color: '#f0e6d3',
    },
    menuItemValue: {
      fontSize: '14px',
      color: '#8a8a8a',
    },
    logoutBtn: {
      width: '100%',
      padding: '16px',
      backgroundColor: 'transparent',
      border: '2px solid #e74c3c',
      borderRadius: '12px',
      color: '#e74c3c',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
    },
    btnPrimary: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#c8a97e',
      border: 'none',
      borderRadius: '12px',
      color: '#1a1a1a',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
    },
    chevron: {
      color: '#5a5a5a',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
          <span>Orqaga</span>
        </button>
        <div style={styles.title}>
          <Settings size={20} />
          Sozlamalar
        </div>
        <div style={styles.placeholder}></div>
      </div>

      <div style={styles.content}>
        {/* Profile Section */}
        <div className="card animate-fade-in" style={styles.card}>
          <div style={styles.profileSection}>
            <div style={styles.avatar}>
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>{user?.name || 'Seller'}</div>
              <div style={styles.userPhone}>{user?.phone || '+998 90 123 45 67'}</div>
              <span style={styles.roleBadge}>Sotuvchi</span>
            </div>
          </div>
        </div>

        {/* Restaurant Settings */}
        <div className="card animate-fade-in" style={styles.card}>
          <div style={styles.sectionTitle}>
            <Store size={18} />
            Restoran Sozlamalari
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Restoran nomi</label>
            <input
              className="input"
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Telefon</label>
            <input
              className="input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>
              <Clock size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Ish vaqti
            </label>
            <input
              className="input"
              type="text"
              value={workTime}
              onChange={(e) => setWorkTime(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Minimal buyurtma</label>
            <input
              className="input"
              type="text"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Yetkazish narxi</label>
            <input
              className="input"
              type="text"
              value={deliveryPrice}
              onChange={(e) => setDeliveryPrice(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={{ ...styles.inputGroup, marginBottom: 0 }}>
            <label style={styles.inputLabel}>
              <MapPin size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Yetkazish radiusi
            </label>
            <input
              className="input"
              type="text"
              value={deliveryRadius}
              onChange={(e) => setDeliveryRadius(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>

        {/* Menu Settings */}
        <div className="card animate-fade-in" style={styles.card}>
          <div style={styles.sectionTitle}>
            <Settings size={18} />
            Umumiy Sozlamalar
          </div>

          <div style={styles.menuItem}>
            <div style={styles.menuItemLeft}>
              <div style={styles.menuItemIcon}>
                <Bell size={20} />
              </div>
              <span style={styles.menuItemText}>Bildirishnomalar</span>
            </div>
            <Toggle enabled={notifications} onToggle={() => setNotifications(!notifications)} />
          </div>

          <div style={styles.menuItem}>
            <div style={styles.menuItemLeft}>
              <div style={styles.menuItemIcon}>
                <Globe size={20} />
              </div>
              <span style={styles.menuItemText}>Til</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={styles.menuItemValue}>O'zbek</span>
              <ChevronRight size={18} style={styles.chevron} />
            </div>
          </div>

          <div style={styles.menuItemLast}>
            <div style={styles.menuItemLeft}>
              <div style={styles.menuItemIcon}>
                <Moon size={20} />
              </div>
              <span style={styles.menuItemText}>Dark Mode</span>
            </div>
            <Toggle enabled={darkMode} onToggle={() => setDarkMode(!darkMode)} />
          </div>
        </div>

        {/* Save Button */}
        <button className="btn btn-primary" style={styles.btnPrimary}>
          <Settings size={18} />
          Saqlash
        </button>

        {/* Logout Button */}
        <button
          style={styles.logoutBtn}
          onClick={handleLogout}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e74c3c';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#e74c3c';
          }}
        >
          <LogOut size={18} />
          Tizimdan chiqish
        </button>
      </div>
    </div>
  );
};

export default SellerSettings;
