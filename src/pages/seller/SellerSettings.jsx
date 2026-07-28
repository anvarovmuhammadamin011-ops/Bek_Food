import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  Globe,
  Sun,
  LogOut,
  Store,
  Clock,
  MapPin,
  Settings,
  User,
  Phone,
  Save,
} from 'lucide-react';

const Toggle = ({ enabled, onToggle }) => (
  <div
    onClick={onToggle}
    style={{
      width: 40,
      height: 22,
      borderRadius: 11,
      background: enabled ? 'var(--primary)' : 'var(--surface-active)',
      position: 'relative',
      cursor: 'pointer',
      transition: 'background 0.2s ease',
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: '#fff',
        position: 'absolute',
        top: 2,
        left: enabled ? 20 : 2,
        transition: 'left 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      }}
    />
  </div>
);

const SellerSettings = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const [restaurantName, setRestaurantName] = useState('Bekfood Restoran');
  const [phone, setPhone] = useState('+998 90 123 45 67');
  const [workTime, setWorkTime] = useState('10:00 - 23:00');
  const [minOrder, setMinOrder] = useState("0 so'm");
  const [deliveryPrice, setDeliveryPrice] = useState('Bepul');
  const [deliveryRadius, setDeliveryRadius] = useState('5 km');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const s = {
    page: {
      minHeight: '100%',
      background: 'var(--bg)',
      paddingBottom: 100,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 16px 12px',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'var(--text)',
    },
    title: {
      fontSize: 20,
      fontWeight: 700,
      color: 'var(--text)',
      margin: 0,
      letterSpacing: '-0.01em',
    },
    placeholder: {
      width: 36,
    },
    content: {
      padding: '0 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    },
    card: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 20,
    },
    profileRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: 'var(--primary-light)',
      border: '2px solid var(--primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    userName: {
      fontSize: 16,
      fontWeight: 700,
      color: 'var(--text)',
      margin: '0 0 2px 0',
    },
    userPhone: {
      fontSize: 13,
      color: 'var(--text-muted)',
      margin: '0 0 6px 0',
    },
    roleBadge: {
      display: 'inline-block',
      padding: '3px 10px',
      background: 'var(--primary-light)',
      color: 'var(--primary)',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 600,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--primary)',
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    fieldGroup: {
      marginBottom: 14,
    },
    fieldLabel: {
      display: 'block',
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--text-secondary)',
      marginBottom: 6,
    },
    fieldInput: {
      width: '100%',
      padding: '10px 12px',
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--text)',
      fontSize: 13,
      outline: 'none',
      transition: 'border-color 0.15s',
      boxSizing: 'border-box',
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 0',
      borderBottom: '1px solid var(--border)',
    },
    menuItemLast: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 0',
    },
    menuItemLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    menuItemIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      background: 'var(--primary-light)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--primary)',
      flexShrink: 0,
    },
    menuItemText: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--text)',
    },
    menuItemValue: {
      fontSize: 13,
      color: 'var(--text-muted)',
    },
    saveBtn: {
      width: '100%',
      padding: '12px',
      background: 'var(--primary)',
      border: 'none',
      borderRadius: 'var(--radius-sm)',
      color: '#fff',
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      transition: 'opacity 0.15s',
    },
    logoutBtn: {
      width: '100%',
      padding: '12px',
      background: 'var(--surface)',
      border: '1px solid var(--danger)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--danger)',
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      transition: 'all 0.15s',
    },
    chevron: {
      color: 'var(--text-muted)',
    },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.headerLeft}>
          <button onClick={() => navigate(-1)} style={s.backBtn}>
            <ChevronLeft size={18} />
          </button>
          <h1 style={s.title}>Sozlamalar</h1>
        </div>
        <div style={s.placeholder} />
      </div>

      <div style={s.content}>
        <div style={s.card}>
          <div style={s.profileRow}>
            <div style={s.avatar}>
              <User size={24} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <div style={s.userName}>{user?.name || 'Seller'}</div>
              <div style={s.userPhone}>{user?.phone || '+998 90 123 45 67'}</div>
              <span style={s.roleBadge}>Sotuvchi</span>
            </div>
          </div>
        </div>

        <div style={s.card}>
          <div style={s.sectionTitle}>
            <Store size={16} />
            Restoran Sozlamalari
          </div>

          <div style={s.fieldGroup}>
            <label style={s.fieldLabel}>Restoran nomi</label>
            <input
              style={s.fieldInput}
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
            />
          </div>

          <div style={s.fieldGroup}>
            <label style={s.fieldLabel}>
              <Phone size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              Telefon
            </label>
            <input
              style={s.fieldInput}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div style={s.fieldGroup}>
            <label style={s.fieldLabel}>
              <Clock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              Ish vaqti
            </label>
            <input
              style={s.fieldInput}
              type="text"
              value={workTime}
              onChange={(e) => setWorkTime(e.target.value)}
            />
          </div>

          <div style={s.fieldGroup}>
            <label style={s.fieldLabel}>Minimal buyurtma</label>
            <input
              style={s.fieldInput}
              type="text"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
            />
          </div>

          <div style={s.fieldGroup}>
            <label style={s.fieldLabel}>Yetkazish narxi</label>
            <input
              style={s.fieldInput}
              type="text"
              value={deliveryPrice}
              onChange={(e) => setDeliveryPrice(e.target.value)}
            />
          </div>

          <div style={{ ...s.fieldGroup, marginBottom: 0 }}>
            <label style={s.fieldLabel}>
              <MapPin size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
              Yetkazish radiusi
            </label>
            <input
              style={s.fieldInput}
              type="text"
              value={deliveryRadius}
              onChange={(e) => setDeliveryRadius(e.target.value)}
            />
          </div>
        </div>

        <div style={s.card}>
          <div style={s.sectionTitle}>
            <Settings size={16} />
            Umumiy Sozlamalar
          </div>

          <div style={s.menuItem}>
            <div style={s.menuItemLeft}>
              <div style={s.menuItemIcon}>
                <Bell size={18} />
              </div>
              <span style={s.menuItemText}>Bildirishnomalar</span>
            </div>
            <Toggle enabled={notifications} onToggle={() => setNotifications(!notifications)} />
          </div>

          <div style={s.menuItem}>
            <div style={s.menuItemLeft}>
              <div style={s.menuItemIcon}>
                <Globe size={18} />
              </div>
              <span style={s.menuItemText}>Til</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={s.menuItemValue}>O'zbek</span>
              <ChevronRight size={16} style={s.chevron} />
            </div>
          </div>

          <div style={s.menuItemLast}>
            <div style={s.menuItemLeft}>
              <div style={s.menuItemIcon}>
                <Sun size={18} />
              </div>
              <span style={s.menuItemText}>Yorug' rejim</span>
            </div>
            <Toggle enabled={darkMode} onToggle={() => setDarkMode(!darkMode)} />
          </div>
        </div>

        <button style={s.saveBtn}>
          <Save size={16} />
          Saqlash
        </button>

        <button style={s.logoutBtn} onClick={handleLogout}>
          <LogOut size={16} />
          Tizimdan chiqish
        </button>
      </div>
    </div>
  );
};

export default SellerSettings;
