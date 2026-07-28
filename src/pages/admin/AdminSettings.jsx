import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import {
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
  ChevronDown,
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
    minOrder: "0 so'm",
    commission: '2%',
    currency: "So'm",
    region: 'Toshkent',
  });

  const [notifications, setNotifications] = useState({
    push: true,
    sms: false,
    telegram: true,
    email: false,
  });

  const [appearance, setAppearance] = useState({
    darkMode: false,
    language: "O'zbek",
  });

  const [seo, setSeo] = useState({
    siteTitle: 'Bekfood - Eng mazali taomlar',
    description: 'Bekfood restorani - sifatli va mazali taomlar, tez yetkazib berish xizmati.',
    keywords: "ovqat, restoran, yetkazib berish, Bekfood, Toshkent",
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
    if (window.confirm("Barcha ma'lumotlarni tozalashni xohlaysizmi?")) {
      alert("Ma'lumotlar tozalandi!");
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Hisobingiz o'chiriladi. Davom etishni xohlaysizmi?")) {
      logout();
      navigate('/login');
    }
  };

  const Toggle = ({ label, checked, onChange }) => (
    <div style={s.toggleRow}>
      <span style={s.toggleLabel}>{label}</span>
      <div style={s.toggleSwitch} onClick={onChange}>
        <div style={{ ...s.toggleTrack, background: checked ? 'var(--primary)' : 'var(--border-strong)' }} />
        <div style={{ ...s.toggleThumb, left: checked ? '22px' : '2px' }} />
      </div>
    </div>
  );

  const s = {
    page: {
      minHeight: '100vh',
      background: 'var(--bg)',
      padding: '32px 24px',
      maxWidth: '800px',
      margin: '0 auto',
    },
    title: {
      fontSize: '26px',
      fontWeight: '700',
      color: 'var(--text)',
      margin: '0 0 28px 0',
    },
    subtitle: {
      fontSize: '14px',
      color: 'var(--text-muted)',
      margin: '-20px 0 28px 0',
    },
    card: {
      background: 'var(--surface)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      padding: '24px',
      marginBottom: '20px',
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
      paddingBottom: '16px',
      borderBottom: '1px solid var(--border)',
    },
    cardIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--primary-light)',
      color: 'var(--primary)',
    },
    cardTitle: {
      fontSize: '17px',
      fontWeight: '600',
      color: 'var(--text)',
      margin: 0,
    },
    logoUploadArea: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      background: 'var(--surface-hover)',
      border: '2px dashed var(--border-strong)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      overflow: 'hidden',
      margin: '0 auto 20px',
      position: 'relative',
      transition: 'border-color 0.2s ease',
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
      background: 'rgba(0,0,0,0.45)',
      opacity: 0,
      transition: 'opacity 0.2s ease',
    },
    formGroup: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '500',
      color: 'var(--text-secondary)',
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '12px 14px',
      background: 'var(--surface-hover)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--text)',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '12px 14px',
      background: 'var(--surface-hover)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--text)',
      fontSize: '14px',
      outline: 'none',
      resize: 'vertical',
      minHeight: '100px',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    },
    select: {
      width: '100%',
      padding: '12px 14px',
      background: 'var(--surface-hover)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--text)',
      fontSize: '14px',
      outline: 'none',
      cursor: 'pointer',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 14px center',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s ease',
    },
    twoCol: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
    },
    toggleRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: '1px solid var(--border)',
    },
    toggleLabel: {
      fontSize: '14px',
      color: 'var(--text)',
    },
    toggleSwitch: {
      position: 'relative',
      width: '44px',
      height: '24px',
      cursor: 'pointer',
      flexShrink: 0,
    },
    toggleTrack: {
      position: 'absolute',
      inset: 0,
      borderRadius: '12px',
      transition: 'background 0.2s ease',
    },
    toggleThumb: {
      position: 'absolute',
      top: '2px',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: '#fff',
      transition: 'left 0.2s ease',
      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    },
    saveBtn: {
      width: '100%',
      padding: '14px',
      background: 'var(--primary)',
      border: 'none',
      borderRadius: 'var(--radius-sm)',
      color: '#fff',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transition: 'opacity 0.2s ease, box-shadow 0.2s ease',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(249,115,22,0.25)',
    },
    dangerCard: {
      background: 'var(--surface)',
      borderRadius: 'var(--radius)',
      border: '1px solid rgba(239,68,68,0.15)',
      boxShadow: 'var(--shadow-sm)',
      padding: '24px',
      marginBottom: '20px',
    },
    dangerHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px',
      paddingBottom: '16px',
      borderBottom: '1px solid rgba(239,68,68,0.1)',
    },
    dangerIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: 'var(--radius-sm)',
      background: 'rgba(239,68,68,0.08)',
      color: 'var(--danger)',
    },
    dangerTitle: {
      fontSize: '17px',
      fontWeight: '600',
      color: 'var(--text)',
      margin: 0,
    },
    dangerBtn: {
      width: '100%',
      padding: '13px',
      background: 'var(--danger)',
      border: 'none',
      borderRadius: 'var(--radius-sm)',
      color: '#fff',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '12px',
      transition: 'opacity 0.2s ease',
    },
    dangerBtnOutline: {
      width: '100%',
      padding: '13px',
      background: 'transparent',
      border: '1px solid rgba(239,68,68,0.25)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--danger)',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'background 0.2s ease',
    },
    hiddenInput: {
      display: 'none',
    },
    uploadArea: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px',
      background: 'var(--surface-hover)',
      border: '1px dashed var(--border-strong)',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      transition: 'border-color 0.2s ease',
    },
    uploadText: {
      fontSize: '13px',
      color: 'var(--text-muted)',
    },
    uploadIcon: {
      color: 'var(--primary)',
    },
    logoArea: {
      className: 'logo-area',
    },
    timeHint: {
      fontSize: '12px',
      color: 'var(--text-muted)',
      marginTop: '6px',
      display: 'block',
    },
  };

  return (
    <div style={s.page}>
      <style>{`
        .admin-settings-input:focus,
        .admin-settings-textarea:focus,
        .admin-settings-select:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 3px rgba(249,115,22,0.1);
        }
        .admin-settings-save:hover {
          opacity: 0.9;
          box-shadow: 0 4px 14px rgba(249,115,22,0.35) !important;
        }
        .admin-settings-danger:hover {
          opacity: 0.9;
        }
        .admin-settings-danger-outline:hover {
          background: rgba(239,68,68,0.05);
        }
        .admin-settings-logo-area:hover {
          border-color: var(--primary) !important;
        }
        .admin-settings-logo-area:hover .admin-settings-logo-overlay {
          opacity: 1 !important;
        }
        .admin-settings-upload:hover {
          border-color: var(--primary) !important;
        }
        @media (max-width: 640px) {
          .admin-settings-two-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <h1 style={s.title}>Sozlamalar</h1>

      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.cardIcon}>
            <Store size={20} />
          </div>
          <h2 style={s.cardTitle}>Restoran Ma'lumotlari</h2>
        </div>

        <div
          className="admin-settings-logo-area"
          style={s.logoUploadArea}
          onClick={() => document.getElementById('logoInput').click()}
        >
          {logoPreview ? (
            <img src={logoPreview} alt="Logo" style={s.logoImage} />
          ) : (
            <Image size={32} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
          )}
          <div className="admin-settings-logo-overlay" style={s.logoOverlay}>
            <Upload size={18} color="#fff" />
            <span style={{ fontSize: '11px', color: '#fff', marginTop: '4px' }}>Yuklash</span>
          </div>
          <input
            id="logoInput"
            type="file"
            accept="image/*"
            style={s.hiddenInput}
            onChange={handleLogoUpload}
          />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Restoran nomi</label>
          <input
            className="admin-settings-input"
            style={s.input}
            value={restaurantInfo.name}
            onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
          />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Telefon</label>
          <input
            className="admin-settings-input"
            style={s.input}
            value={restaurantInfo.phone}
            onChange={(e) => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
          />
        </div>

        <div className="admin-settings-two-col" style={s.twoCol}>
          <div style={s.formGroup}>
            <label style={s.label}>Telegram</label>
            <input
              className="admin-settings-input"
              style={s.input}
              value={restaurantInfo.telegram}
              onChange={(e) => setRestaurantInfo({ ...restaurantInfo, telegram: e.target.value })}
            />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Instagram</label>
            <input
              className="admin-settings-input"
              style={s.input}
              value={restaurantInfo.instagram}
              onChange={(e) => setRestaurantInfo({ ...restaurantInfo, instagram: e.target.value })}
            />
          </div>
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Facebook</label>
          <input
            className="admin-settings-input"
            style={s.input}
            value={restaurantInfo.facebook}
            onChange={(e) => setRestaurantInfo({ ...restaurantInfo, facebook: e.target.value })}
            placeholder="Facebook sahifa linki"
          />
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.cardIcon}>
            <Clock size={20} />
          </div>
          <h2 style={s.cardTitle}>Ishlash Sozlamalari</h2>
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Ish vaqti</label>
          <div className="admin-settings-two-col" style={s.twoCol}>
            <div>
              <input
                className="admin-settings-input"
                style={s.input}
                type="time"
                value={operatingSettings.openTime}
                onChange={(e) => setOperatingSettings({ ...operatingSettings, openTime: e.target.value })}
              />
              <span style={s.timeHint}>Boshlanish</span>
            </div>
            <div>
              <input
                className="admin-settings-input"
                style={s.input}
                type="time"
                value={operatingSettings.closeTime}
                onChange={(e) => setOperatingSettings({ ...operatingSettings, closeTime: e.target.value })}
              />
              <span style={s.timeHint}>Tugash</span>
            </div>
          </div>
        </div>

        <div className="admin-settings-two-col" style={s.twoCol}>
          <div style={s.formGroup}>
            <label style={s.label}>Yetkazish narxi</label>
            <input
              className="admin-settings-input"
              style={s.input}
              value={operatingSettings.deliveryPrice}
              onChange={(e) => setOperatingSettings({ ...operatingSettings, deliveryPrice: e.target.value })}
            />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Minimal buyurtma</label>
            <input
              className="admin-settings-input"
              style={s.input}
              value={operatingSettings.minOrder}
              onChange={(e) => setOperatingSettings({ ...operatingSettings, minOrder: e.target.value })}
            />
          </div>
        </div>

        <div className="admin-settings-two-col" style={s.twoCol}>
          <div style={s.formGroup}>
            <label style={s.label}>Komissiya (%)</label>
            <input
              className="admin-settings-input"
              style={s.input}
              value={operatingSettings.commission}
              onChange={(e) => setOperatingSettings({ ...operatingSettings, commission: e.target.value })}
            />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Valyuta</label>
            <select
              className="admin-settings-select"
              style={s.select}
              value={operatingSettings.currency}
              onChange={(e) => setOperatingSettings({ ...operatingSettings, currency: e.target.value })}
            >
              <option value="So'm">So'm</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <div style={{ ...s.formGroup, marginBottom: 0 }}>
          <label style={s.label}>Viloyat</label>
          <input
            className="admin-settings-input"
            style={s.input}
            value={operatingSettings.region}
            onChange={(e) => setOperatingSettings({ ...operatingSettings, region: e.target.value })}
          />
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.cardIcon}>
            <Bell size={20} />
          </div>
          <h2 style={s.cardTitle}>Bildirishnoma Sozlamalari</h2>
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
        <div style={{ borderBottom: 'none' }}>
          <Toggle
            label="Email notifications"
            checked={notifications.email}
            onChange={() => setNotifications({ ...notifications, email: !notifications.email })}
          />
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.cardIcon}>
            <Moon size={20} />
          </div>
          <h2 style={s.cardTitle}>Ko'rinish</h2>
        </div>

        <Toggle
          label="Dark Mode"
          checked={appearance.darkMode}
          onChange={() => setAppearance({ ...appearance, darkMode: !appearance.darkMode })}
        />

        <div style={{ ...s.formGroup, marginTop: '16px', marginBottom: 0 }}>
          <label style={s.label}>Til</label>
          <select
            className="admin-settings-select"
            style={s.select}
            value={appearance.language}
            onChange={(e) => setAppearance({ ...appearance, language: e.target.value })}
          >
            <option value="O'zbek">O'zbek</option>
            <option value="Русский">Русский</option>
            <option value="English">English</option>
          </select>
        </div>

        <div style={{ marginTop: '16px' }}>
          <label style={s.label}>Logo Yuklash</label>
          <div
            className="admin-settings-upload"
            style={s.uploadArea}
            onClick={() => document.getElementById('logoUpload').click()}
          >
            <Upload size={18} style={s.uploadIcon} />
            <span style={s.uploadText}>Logo faylni tanlang</span>
            <input id="logoUpload" type="file" accept="image/*" style={s.hiddenInput} />
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <label style={s.label}>Favicon Yuklash</label>
          <div
            className="admin-settings-upload"
            style={s.uploadArea}
            onClick={() => document.getElementById('faviconUpload').click()}
          >
            <Image size={18} style={s.uploadIcon} />
            <span style={s.uploadText}>Favicon faylni tanlang</span>
            <input id="faviconUpload" type="file" accept="image/*" style={s.hiddenInput} />
          </div>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.cardIcon}>
            <Globe size={20} />
          </div>
          <h2 style={s.cardTitle}>SEO Sozlamalari</h2>
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Sarlavha (Title)</label>
          <input
            className="admin-settings-input"
            style={s.input}
            value={seo.siteTitle}
            onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
          />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Tavsif (Description)</label>
          <textarea
            className="admin-settings-textarea"
            style={s.textarea}
            value={seo.description}
            onChange={(e) => setSeo({ ...seo, description: e.target.value })}
          />
        </div>

        <div style={{ ...s.formGroup, marginBottom: 0 }}>
          <label style={s.label}>Kalit so'zlar (Keywords)</label>
          <input
            className="admin-settings-input"
            style={s.input}
            value={seo.keywords}
            onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
            placeholder="Kalit so'zlarni vergul bilan ajrating"
          />
        </div>
      </div>

      <button
        className="admin-settings-save"
        style={s.saveBtn}
        onClick={handleSave}
      >
        <Save size={18} />
        Saqlash
      </button>

      <div style={s.dangerCard}>
        <div style={s.dangerHeader}>
          <div style={s.dangerIcon}>
            <AlertTriangle size={20} />
          </div>
          <h2 style={s.dangerTitle}>Xavfli Zona</h2>
        </div>

        <button
          className="admin-settings-danger"
          style={s.dangerBtn}
          onClick={handleClearAll}
        >
          <Trash2 size={16} />
          Barcha ma'lumotlarni tozalash
        </button>

        <button
          className="admin-settings-danger-outline"
          style={s.dangerBtnOutline}
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
