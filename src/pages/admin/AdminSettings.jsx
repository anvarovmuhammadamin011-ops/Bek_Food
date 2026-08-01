import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { Store, Clock, MapPin, Truck, CreditCard, Save, Upload, Check, Banknote, Landmark, Smartphone } from 'lucide-react';
import GoogleMap from '../../components/GoogleMap';

const PAYMENT_OPTIONS = [
  { key: 'cash', label: 'Naqd pul', icon: Banknote },
  { key: 'card', label: 'Karta', icon: CreditCard },
  { key: 'click', label: 'Click', icon: Smartphone },
  { key: 'payme', label: 'Payme', icon: Landmark },
];

const AdminSettings = () => {
  const { settings, updateSettings } = useStore();
  const [form, setForm] = useState({
    name: settings.name,
    phone: settings.phone,
    address: settings.address,
    logo: settings.logo,
    lat: settings.lat,
    lng: settings.lng,
    openTime: settings.openTime,
    closeTime: settings.closeTime,
    deliveryFee: String(settings.deliveryFee || 0),
    minOrder: String(settings.minOrder || 0),
    paymentMethods: { ...settings.paymentMethods },
  });
  const [saved, setSaved] = useState(false);
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
    updateSettings({
      name: form.name,
      phone: form.phone,
      address: form.address,
      logo: logoPreview || form.logo || '/logo.png',
      lat: Number(form.lat) || 41.2995,
      lng: Number(form.lng) || 69.2401,
      openTime: form.openTime,
      closeTime: form.closeTime,
      deliveryFee: Number(form.deliveryFee) || 0,
      minOrder: Number(form.minOrder) || 0,
      paymentMethods: form.paymentMethods,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const togglePayment = (key) => {
    setForm({ ...form, paymentMethods: { ...form.paymentMethods, [key]: !form.paymentMethods[key] } });
  };

  const s = {
    page: { minHeight: '100vh', background: 'var(--bg)', padding: '32px 24px', maxWidth: '860px', margin: '0 auto' },
    title: { fontSize: '26px', fontWeight: '700', color: 'var(--text)', margin: '0 0 4px 0' },
    subtitle: { fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 28px 0' },
    card: { background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', padding: '24px', marginBottom: '20px' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' },
    cardIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', color: 'var(--primary)' },
    cardTitle: { fontSize: '17px', fontWeight: '600', color: 'var(--text)', margin: 0 },
    logoUploadArea: { width: '100px', height: '100px', borderRadius: '50%', background: 'var(--surface-hover)', border: '2px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', margin: '0 auto 20px', position: 'relative', transition: 'border-color 0.2s ease' },
    logoImage: { width: '100%', height: '100%', objectFit: 'cover' },
    logoOverlay: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.45)', opacity: 0, transition: 'opacity 0.2s ease' },
    formGroup: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px' },
    input: { width: '100%', padding: '12px 14px', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s ease, box-shadow 0.2s ease', boxSizing: 'border-box' },
    twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    threeCol: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' },
    toggleRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' },
    toggleLabel: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text)' },
    toggleSwitch: { position: 'relative', width: '44px', height: '24px', cursor: 'pointer', flexShrink: 0 },
    toggleTrack: { position: 'absolute', inset: 0, borderRadius: '12px', transition: 'background 0.2s ease' },
    toggleThumb: { position: 'absolute', top: '2px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' },
    saveBtn: { width: '100%', padding: '14px', background: 'var(--primary)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'opacity 0.2s ease', boxShadow: '0 2px 8px rgba(249,115,22,0.25)' },
    hiddenInput: { display: 'none' },
    hint: { fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', display: 'block' },
  };

  return (
    <div style={s.page}>
      <style>{`
        .admin-set-input:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
        .admin-set-logo:hover { border-color: var(--primary) !important; }
        .admin-set-logo:hover .admin-set-overlay { opacity: 1 !important; }
        .admin-set-save:hover { opacity: 0.9; }
        @media (max-width: 640px) {
          .admin-set-two { grid-template-columns: 1fr !important; }
          .admin-set-three { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <h1 style={s.title}>Sozlamalar</h1>
      <p style={s.subtitle}>Restoran haqidagi asosiy ma'lumotlar</p>

      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.cardIcon}><Store size={20} /></div>
          <h2 style={s.cardTitle}>Restoran ma'lumotlari</h2>
        </div>

        <div className="admin-set-logo" style={s.logoUploadArea} onClick={() => document.getElementById('settingsLogo').click()}>
          <img
            src={logoPreview || form.logo || '/logo.png'}
            alt="Logo"
            onError={(e) => { e.currentTarget.src = '/logo.png'; }}
            style={s.logoImage}
          />
          <div className="admin-set-overlay" style={s.logoOverlay}>
            <Upload size={18} color="#fff" />
            <span style={{ fontSize: '11px', color: '#fff', marginTop: 4 }}>Yuklash</span>
          </div>
          <input id="settingsLogo" type="file" accept="image/*" style={s.hiddenInput} onChange={handleLogoUpload} />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Restoran nomi</label>
          <input className="admin-set-input" style={s.input} value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Telefon</label>
          <input className="admin-set-input" style={s.input} value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Manzil</label>
          <input className="admin-set-input" style={s.input} value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.cardIcon}><MapPin size={20} /></div>
          <h2 style={s.cardTitle}>Google Maps</h2>
        </div>
        <GoogleMap center={{ lat: Number(form.lat) || 41.2995, lng: Number(form.lng) || 69.2401 }} height={220} showMyLocation={false} />
        <div className="admin-set-two" style={{ ...s.twoCol, marginTop: 16 }}>
          <div style={s.formGroup}>
            <label style={s.label}>Kenglik (Latitude)</label>
            <input className="admin-set-input" style={s.input} type="number" step="0.0001" value={form.lat}
              onChange={(e) => setForm({ ...form, lat: e.target.value })} />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Uzunlik (Longitude)</label>
            <input className="admin-set-input" style={s.input} type="number" step="0.0001" value={form.lng}
              onChange={(e) => setForm({ ...form, lng: e.target.value })} />
          </div>
        </div>
        <span style={s.hint}>Koordinatalar o'zgarganda xarita avtomatik yangilanadi</span>
      </div>

      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.cardIcon}><Clock size={20} /></div>
          <h2 style={s.cardTitle}>Ish vaqti</h2>
        </div>
        <div className="admin-set-two" style={s.twoCol}>
          <div style={s.formGroup}>
            <label style={s.label}>Ochilish</label>
            <input className="admin-set-input" style={s.input} type="time" value={form.openTime}
              onChange={(e) => setForm({ ...form, openTime: e.target.value })} />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Yopilish</label>
            <input className="admin-set-input" style={s.input} type="time" value={form.closeTime}
              onChange={(e) => setForm({ ...form, closeTime: e.target.value })} />
          </div>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.cardIcon}><Truck size={20} /></div>
          <h2 style={s.cardTitle}>Yetkazib berish</h2>
        </div>
        <div className="admin-set-two" style={s.twoCol}>
          <div style={s.formGroup}>
            <label style={s.label}>Yetkazish narxi (so'm)</label>
            <input className="admin-set-input" style={s.input} type="number" min="0" value={form.deliveryFee}
              onChange={(e) => setForm({ ...form, deliveryFee: e.target.value })} />
            <span style={s.hint}>0 bo'lsa — bepul yetkazish</span>
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Minimal buyurtma (so'm)</label>
            <input className="admin-set-input" style={s.input} type="number" min="0" value={form.minOrder}
              onChange={(e) => setForm({ ...form, minOrder: e.target.value })} />
          </div>
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardHeader}>
          <div style={s.cardIcon}><CreditCard size={20} /></div>
          <h2 style={s.cardTitle}>To'lov usullari</h2>
        </div>
        {PAYMENT_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const checked = !!form.paymentMethods[opt.key];
          return (
            <div key={opt.key} style={s.toggleRow}>
              <span style={s.toggleLabel}>
                <Icon size={16} style={{ color: checked ? 'var(--success)' : 'var(--text-muted)' }} />
                {opt.label}
              </span>
              <div style={s.toggleSwitch} onClick={() => togglePayment(opt.key)}>
                <div style={{ ...s.toggleTrack, background: checked ? 'var(--success)' : 'var(--border-strong)' }} />
                <div style={{ ...s.toggleThumb, left: checked ? '22px' : '2px' }} />
              </div>
            </div>
          );
        })}
      </div>

      <button className="admin-set-save" style={s.saveBtn} onClick={handleSave}>
        {saved ? <Check size={18} /> : <Save size={18} />}
        {saved ? 'Saqlandi!' : 'Saqlash'}
      </button>
    </div>
  );
};

export default AdminSettings;
