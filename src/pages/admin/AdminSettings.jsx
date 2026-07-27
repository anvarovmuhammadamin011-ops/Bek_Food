import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import {
  ChevronLeft,
  Store,
  Phone,
  Globe,
  Clock,
  Bell,
  Moon,
  Save,
  Trash2,
  AlertTriangle,
  Upload,
  Image,
  Settings,
  Shield,
} from 'lucide-react';

const AdminSettings = () => {
  const navigate = useNavigate();
  const { user, logout } = useStore();

  const [restaurantInfo, setRestaurantInfo] = useState({
    name: 'Bekfood Steakhouse',
    phone: '+998 90 123 45 67',
    telegram: '@bekfood_uz',
    instagram: '@bekfood_stakehouse',
    facebook: '',
  });

  const [operatingSettings, setOperatingSettings] = useState({
    openTime: '09:00',
    closeTime: '23:00',
    deliveryPrice: 'Bepul',
    minOrder: '0 so\'m',
    commission: '2%',
    currency: 'So\'m',
    region: 'Toshkent',
  });

  const [notifications, setNotifications] = useState({
    push: true,
    sms: false,
    telegram: true,
    email: false,
  });

  const [appearance, setAppearance] = useState({
    darkMode: true,
    language: 'O\'zbek',
  });

  const [seo, setSeo] = useState({
    siteTitle: 'Bekfood - Eng mazali taomlar',
    description: 'Bekfood restorani - sifatli va mazali taomlar, tez yetkazib berish xizmati.',
    keywords: 'ovqat, restoran, yetkazib berish, Bekfood, Toshkent',
  });

  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    alert('Sozlamalar saqlandi!');
  };

  const handleClearAll = () => {
    if (window.confirm('Barcha ma\'lumotlarni tozalashni xohlaysizmi?')) {
      alert('Ma\'lumotlar tozalandi!');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Hisobingiz o\'chiriladi. Davom etishni xohlaysizmi?')) {
      logout();
      navigate('/login');
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
      color: '#f5f5f5',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      padding: '24px',
      maxWidth: '800px',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '32px',
      animation: 'fadeIn 0.5s ease',
    },
    backBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      background: '#2a2a2a',
      border: '1px solid #3a3a3a',
      color: '#f5f5f5',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#f5f5f5',
      margin: 0,
    },
    card: {
      background: '#242424',
      borderRadius: '16px',
      border: '1px solid #333',
      padding: '24px',
      marginBottom: '20px',
      animation: 'fadeIn 0.5s ease',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
      paddingBottom: '16px',
      borderBottom: '1px solid #333',
    },
    cardIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      background: '#c8a97e20',
      color: '#c8a97e',
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#f5f5f5',
      margin: 0,
    },
    logoUploadArea: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      background: '#1a1a1a',
      border: '2px dashed #c8a97e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      overflow: 'hidden',
      margin: '0 auto 20px',
      position: 'relative',
      transition: 'all 0.3s ease',
    },
    logoImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    logoOverlay: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.5)',
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
    formGroup: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '500',
      color: '#aaa',
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      background: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '10px',
      color: '#f5f5f5',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      background: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '10px',
      color: '#f5f5f5',
      fontSize: '14px',
      outline: 'none',
      resize: 'vertical',
      minHeight: '100px',
      boxSizing: 'border-box',
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      background: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '10px',
      color: '#f5f5f5',
      fontSize: '14px',
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23c8a97e' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 16px center',
      boxSizing: 'border-box',
    },
    timeRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
    },
    toggleRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 0',
      borderBottom: '1px solid #333',
    },
    toggleLabel: {
      fontSize: '14px',
      color: '#f5f5f5',
    },
    toggleSwitch: {
      position: 'relative',
      width: '44px',
      height: '24px',
      cursor: 'pointer',
    },
    toggleTrack: (active) => ({
      position: 'absolute',
      inset: 0,
      borderRadius: '12px',
      background: active ? '#c8a97e' : '#3a3a3a',
      transition: 'background 0.3s ease',
    }),
    toggleThumb: (active) => ({
      position: 'absolute',
      top: '2px',
      left: active ? '22px' : '2px',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: '#fff',
      transition: 'left 0.3s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    }),
    saveBtn: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(135deg, #c8a97e, #b8956a)',
      border: 'none',
      borderRadius: '12px',
      color: '#1a1a1a',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transition: 'all 0.3s ease',
      marginBottom: '20px',
    },
    dangerCard: {
      background: '#242424',
      borderRadius: '16px',
      border: '1px solid #5c2a2a',
      padding: '24px',
      marginBottom: '20px',
    },
    dangerHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
      paddingBottom: '16px',
      borderBottom: '1px solid #5c2a2a',
    },
    dangerIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      background: '#e53e3e20',
      color: '#e53e3e',
    },
    dangerTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#f5f5f5',
      margin: 0,
    },
    dangerBtn: {
      width: '100%',
      padding: '14px',
      background: '#e53e3e',
      border: 'none',
      borderRadius: '10px',
      color: '#fff',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '12px',
      transition: 'all 0.2s ease',
    },
    dangerBtnOutline: {
      width: '100%',
      padding: '14px',
      background: 'transparent',
      border: '1px solid #e53e3e',
      borderRadius: '10px',
      color: '#e53e3e',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.2s ease',
    },
    hiddenInput: {
      display: 'none',
    },
    twoCol: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
    },
    uploadArea: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      background: '#1a1a1a',
      border: '1px dashed #333',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    uploadText: {
      fontSize: '13px',
      color: '#888',
    },
    uploadIcon: {
      color: '#c8a97e',
    },
    stagger1: { animationDelay: '0.1s' },
    stagger2: { animationDelay: '0.2s' },
    stagger3: { animationDelay: '0.3s' },
    stagger4: { animationDelay: '0.4s' },
    stagger5: { animationDelay: '0.5s' },
    stagger6: { animationDelay: '0.6s' },
    stagger7: { animationDelay: '0.7s' },
  };

  const Toggle = ({ label, checked, onChange }) => (
    <div style={styles.toggleRow}>
      <span style={styles.toggleLabel}>{label}</span>
      <div style={styles.toggleSwitch} onClick={onChange}>
        <div style={styles.toggleTrack(checked)} />
        <div style={styles.toggleThumb(checked)} />
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-hover:hover {
          border-color: #c8a97e44 !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(200, 169, 126, 0.1);
        }
        .card-hover { transition: all 0.3s ease; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(200, 169, 126, 0.3); }
        .input:focus { border-color: #c8a97e !important; box-shadow: 0 0 0 3px rgba(200, 169, 126, 0.1); }
        .danger-btn:hover { background: #c53030 !important; }
        .danger-btn-outline:hover { background: #e53e3e20 !important; }
        .back-btn:hover { background: #3a3a3a !important; }
        .logo-area:hover .logo-overlay { opacity: 1 !important; }
        .upload-area:hover { border-color: #c8a97e !important; }
      `}</style>

      <header style={styles.header}>
        <button
          className="back-btn"
          style={styles.backBtn}
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={20} />
        </button>
        <h1 style={styles.title}>Sozlamalar</h1>
      </header>

      {/* Restaurant Info */}
      <div
        className="card card-hover"
        style={{ ...styles.card, ...styles.stagger1 }}
      >
        <div style={styles.cardHeader}>
          <div style={styles.cardIcon}>
            <Store size={20} />
          </div>
          <h2 style={styles.cardTitle}>Restoran Ma'lumotlari</h2>
        </div>

        <div className="logo-area" style={styles.logoUploadArea} onClick={() => document.getElementById('logoInput').click()}>
          {logoPreview ? (
            <img src={logoPreview} alt="Logo" style={styles.logoImage} />
          ) : (
            <Image size={32} color="#c8a97e" />
          )}
          <div style={styles.logoOverlay}>
            <Upload size={20} color="#fff" />
            <span style={{ fontSize: '11px', color: '#fff', marginTop: '4px' }}>Yuklash</span>
          </div>
          <input
            id="logoInput"
            type="file"
            accept="image/*"
            style={styles.hiddenInput}
            onChange={handleLogoUpload}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Restoran nomi</label>
          <input
            className="input"
            style={styles.input}
            value={restaurantInfo.name}
            onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Telefon</label>
          <input
            className="input"
            style={styles.input}
            value={restaurantInfo.phone}
            onChange={(e) => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
          />
        </div>

        <div style={styles.twoCol}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Telegram</label>
            <input
              className="input"
              style={styles.input}
              value={restaurantInfo.telegram}
              onChange={(e) => setRestaurantInfo({ ...restaurantInfo, telegram: e.target.value })}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Instagram</label>
            <input
              className="input"
              style={styles.input}
              value={restaurantInfo.instagram}
              onChange={(e) => setRestaurantInfo({ ...restaurantInfo, instagram: e.target.value })}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Facebook</label>
          <input
            className="input"
            style={styles.input}
            value={restaurantInfo.facebook}
            onChange={(e) => setRestaurantInfo({ ...restaurantInfo, facebook: e.target.value })}
            placeholder="Facebook sahifa linki"
          />
        </div>
      </div>

      {/* Operating Settings */}
      <div
        className="card card-hover"
        style={{ ...styles.card, ...styles.stagger2 }}
      >
        <div style={styles.cardHeader}>
          <div style={styles.cardIcon}>
            <Clock size={20} />
          </div>
          <h2 style={styles.cardTitle}>Ishlash Sozlamalari</h2>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Ish vaqti</label>
          <div style={styles.timeRow}>
            <div>
              <input
                className="input"
                style={styles.input}
                type="time"
                value={operatingSettings.openTime}
                onChange={(e) => setOperatingSettings({ ...operatingSettings, openTime: e.target.value })}
              />
              <span style={{ fontSize: '11px', color: '#888', marginTop: '4px', display: 'block' }}>Boshlanish</span>
            </div>
            <div>
              <input
                className="input"
                style={styles.input}
                type="time"
                value={operatingSettings.closeTime}
                onChange={(e) => setOperatingSettings({ ...operatingSettings, closeTime: e.target.value })}
              />
              <span style={{ fontSize: '11px', color: '#888', marginTop: '4px', display: 'block' }}>Tugash</span>
            </div>
          </div>
        </div>

        <div style={styles.twoCol}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Yetkazish narxi</label>
            <input
              className="input"
              style={styles.input}
              value={operatingSettings.deliveryPrice}
              onChange={(e) => setOperatingSettings({ ...operatingSettings, deliveryPrice: e.target.value })}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Minimal buyurtma</label>
            <input
              className="input"
              style={styles.input}
              value={operatingSettings.minOrder}
              onChange={(e) => setOperatingSettings({ ...operatingSettings, minOrder: e.target.value })}
            />
          </div>
        </div>

        <div style={styles.twoCol}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Komissiya (%)</label>
            <input
              className="input"
              style={styles.input}
              value={operatingSettings.commission}
              onChange={(e) => setOperatingSettings({ ...operatingSettings, commission: e.target.value })}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Valyuta</label>
            <select
              className="input"
              style={styles.select}
              value={operatingSettings.currency}
              onChange={(e) => setOperatingSettings({ ...operatingSettings, currency: e.target.value })}
            >
              <option value="So'm">So'm</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Viloyat</label>
          <input
            className="input"
            style={styles.input}
            value={operatingSettings.region}
            onChange={(e) => setOperatingSettings({ ...operatingSettings, region: e.target.value })}
          />
        </div>
      </div>

      {/* Notification Settings */}
      <div
        className="card card-hover"
        style={{ ...styles.card, ...styles.stagger3 }}
      >
        <div style={styles.cardHeader}>
          <div style={styles.cardIcon}>
            <Bell size={20} />
          </div>
          <h2 style={styles.cardTitle}>Bildirishnoma Sozlamalari</h2>
        </div>

        <Toggle
          label="Push notifications"
          checked={notifications.push}
          onChange={() => setNotifications({ ...notifications, push: !notifications.push })}
        />
        <Toggle
          label="SMS notifications"
          checked={notifications.sms}
          onChange={() => setNotifications({ ...notifications, sms: !notifications.sms })}
        />
        <Toggle
          label="Telegram bot"
          checked={notifications.telegram}
          onChange={() => setNotifications({ ...notifications, telegram: !notifications.telegram })}
        />
        <Toggle
          label="Email notifications"
          checked={notifications.email}
          onChange={() => setNotifications({ ...notifications, email: !notifications.email })}
          style={{ borderBottom: 'none' }}
        />
      </div>

      {/* Appearance */}
      <div
        className="card card-hover"
        style={{ ...styles.card, ...styles.stagger4 }}
      >
        <div style={styles.cardHeader}>
          <div style={styles.cardIcon}>
            <Moon size={20} />
          </div>
          <h2 style={styles.cardTitle}>Ko'rinish</h2>
        </div>

        <Toggle
          label="Dark Mode"
          checked={appearance.darkMode}
          onChange={() => {}}
        />

        <div style={{ ...styles.formGroup, marginTop: '16px', marginBottom: 0 }}>
          <label style={styles.label}>Til</label>
          <select
            className="input"
            style={styles.select}
            value={appearance.language}
            onChange={(e) => setAppearance({ ...appearance, language: e.target.value })}
          >
            <option value="O'zbek">O'zbek</option>
            <option value="Русский">Русский</option>
            <option value="English">English</option>
          </select>
        </div>

        <div style={{ marginTop: '16px' }}>
          <label style={styles.label}>Logo Yuklash</label>
          <div className="upload-area" style={styles.uploadArea} onClick={() => document.getElementById('logoUpload').click()}>
            <Upload size={18} style={styles.uploadIcon} />
            <span style={styles.uploadText}>Logo faylni tanlang</span>
            <input id="logoUpload" type="file" accept="image/*" style={styles.hiddenInput} />
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <label style={styles.label}>Favicon Yuklash</label>
          <div className="upload-area" style={styles.uploadArea} onClick={() => document.getElementById('faviconUpload').click()}>
            <Image size={18} style={styles.uploadIcon} />
            <span style={styles.uploadText}>Favicon faylni tanlang</span>
            <input id="faviconUpload" type="file" accept="image/*" style={styles.hiddenInput} />
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div
        className="card card-hover"
        style={{ ...styles.card, ...styles.stagger5 }}
      >
        <div style={styles.cardHeader}>
          <div style={styles.cardIcon}>
            <Globe size={20} />
          </div>
          <h2 style={styles.cardTitle}>SEO Sozlamalari</h2>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Sarlavha (Title)</label>
          <input
            className="input"
            style={styles.input}
            value={seo.siteTitle}
            onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Tavsif (Description)</label>
          <textarea
            className="input"
            style={styles.textarea}
            value={seo.description}
            onChange={(e) => setSeo({ ...seo, description: e.target.value })}
          />
        </div>

        <div style={{ ...styles.formGroup, marginBottom: 0 }}>
          <label style={styles.label}>Kalit so'zlar (Keywords)</label>
          <input
            className="input"
            style={styles.input}
            value={seo.keywords}
            onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
            placeholder="Kalit so'zlarni vergul bilan ajrating"
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        className="btn btn-primary"
        style={styles.saveBtn}
        onClick={handleSave}
      >
        <Save size={18} />
        Saqlash
      </button>

      {/* Danger Zone */}
      <div
        className="card card-hover"
        style={{ ...styles.dangerCard, ...styles.stagger6 }}
      >
        <div style={styles.dangerHeader}>
          <div style={styles.dangerIcon}>
            <AlertTriangle size={20} />
          </div>
          <h2 style={styles.dangerTitle}>Xavfli Zona</h2>
        </div>

        <button
          className="danger-btn"
          style={styles.dangerBtn}
          onClick={handleClearAll}
        >
          <Trash2 size={16} />
          Barcha ma'lumotlarni tozalash
        </button>

        <button
          className="danger-btn-outline"
          style={styles.dangerBtnOutline}
          onClick={handleDeleteAccount}
        >
          <AlertTriangle size={16} />
          Hisobni o'chirish
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
