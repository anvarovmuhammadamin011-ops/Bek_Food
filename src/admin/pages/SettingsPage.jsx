import { useState } from 'react';
import { Save, Store, Clock, MapPin, CreditCard, Globe, Palette, Image, Link } from 'lucide-react';
import useAdminStore from '../store/useAdminStore';

export default function SettingsPage() {
  const { settings, updateSettings } = useAdminStore();
  const [formData, setFormData] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Section = ({ icon: Icon, title, children }) => (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '16px',
      border: '1px solid var(--border)',
      overflow: 'hidden',
      marginBottom: '16px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
      }}>
        <Icon size={18} color="var(--color-primary)" />
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
      </div>
      <div style={{ padding: '20px' }}>
        {children}
      </div>
    </div>
  );

  const Field = ({ label, children }) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
        {label}
      </label>
      {children}
    </div>
  );

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1.5px solid var(--border)',
    background: 'var(--bg-secondary)',
    fontSize: '13px',
    color: 'var(--text-primary)',
    outline: 'none',
    fontFamily: 'var(--font-family)',
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>Settings</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>Configure your restaurant</p>
        </div>
        <button
          onClick={handleSave}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            background: saved ? 'var(--color-success)' : 'var(--color-primary)',
            color: 'white',
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <Save size={16} /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Restaurant Info */}
      <Section icon={Store} title="Restaurant Information">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Restaurant Name">
            <input
              value={formData.restaurantName}
              onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
              style={inputStyle}
            />
          </Field>
          <Field label="Phone">
            <input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={inputStyle}
            />
          </Field>
          <Field label="Email">
            <input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={inputStyle}
            />
          </Field>
          <Field label="Address">
            <input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              style={inputStyle}
            />
          </Field>
        </div>
      </Section>

      {/* Hours */}
      <Section icon={Clock} title="Opening Hours">
        <Field label="Business Hours">
          <input
            value={formData.openingHours}
            onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
            style={inputStyle}
          />
        </Field>
      </Section>

      {/* Delivery */}
      <Section icon={MapPin} title="Delivery Settings">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Delivery Radius (km)">
            <input
              type="number"
              value={formData.deliveryRadius}
              onChange={(e) => setFormData({ ...formData, deliveryRadius: Number(e.target.value) })}
              style={inputStyle}
            />
          </Field>
          <Field label="Delivery Fee (so'm)">
            <input
              type="number"
              value={formData.deliveryFee}
              onChange={(e) => setFormData({ ...formData, deliveryFee: Number(e.target.value) })}
              style={inputStyle}
            />
          </Field>
          <Field label="Free Delivery Min Order (so'm)">
            <input
              type="number"
              value={formData.freeDeliveryMin}
              onChange={(e) => setFormData({ ...formData, freeDeliveryMin: Number(e.target.value) })}
              style={inputStyle}
            />
          </Field>
        </div>
      </Section>

      {/* Payment & Tax */}
      <Section icon={CreditCard} title="Payment & Tax">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Tax Rate (%)">
            <input
              type="number"
              value={formData.taxRate}
              onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
              style={inputStyle}
            />
          </Field>
          <Field label="Service Fee Rate (%)">
            <input
              type="number"
              value={formData.serviceFeeRate}
              onChange={(e) => setFormData({ ...formData, serviceFeeRate: Number(e.target.value) })}
              style={inputStyle}
            />
          </Field>
        </div>
        <Field label="Payment Methods">
          <div style={{ display: 'flex', gap: '8px' }}>
            {['cash', 'card'].map((method) => (
              <label key={method} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1.5px solid var(--border)',
                background: formData.paymentMethods.includes(method) ? 'var(--color-primary-light)' : 'var(--bg-card)',
                cursor: 'pointer',
                textTransform: 'capitalize',
                fontSize: '13px',
                fontWeight: 500,
              }}>
                <input
                  type="checkbox"
                  checked={formData.paymentMethods.includes(method)}
                  onChange={(e) => {
                    const methods = e.target.checked
                      ? [...formData.paymentMethods, method]
                      : formData.paymentMethods.filter((m) => m !== method);
                    setFormData({ ...formData, paymentMethods: methods });
                  }}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                {method}
              </label>
            ))}
          </div>
        </Field>
      </Section>

      {/* Languages */}
      <Section icon={Globe} title="Languages">
        <div style={{ display: 'flex', gap: '8px' }}>
          {['uz', 'ru', 'en'].map((lang) => (
            <label key={lang} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1.5px solid var(--border)',
              background: formData.languages.includes(lang) ? 'var(--color-primary-light)' : 'var(--bg-card)',
              cursor: 'pointer',
              textTransform: 'uppercase',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}>
              <input
                type="checkbox"
                checked={formData.languages.includes(lang)}
                onChange={(e) => {
                  const langs = e.target.checked
                    ? [...formData.languages, lang]
                    : formData.languages.filter((l) => l !== lang);
                  setFormData({ ...formData, languages: langs });
                }}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              {lang}
            </label>
          ))}
        </div>
      </Section>

      {/* Social Media */}
      <Section icon={Link} title="Social Media">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Telegram">
            <input
              value={formData.socialMedia?.telegram || ''}
              onChange={(e) => setFormData({ ...formData, socialMedia: { ...formData.socialMedia, telegram: e.target.value } })}
              placeholder="https://t.me/..."
              style={inputStyle}
            />
          </Field>
          <Field label="Instagram">
            <input
              value={formData.socialMedia?.instagram || ''}
              onChange={(e) => setFormData({ ...formData, socialMedia: { ...formData.socialMedia, instagram: e.target.value } })}
              placeholder="https://instagram.com/..."
              style={inputStyle}
            />
          </Field>
        </div>
      </Section>
    </div>
  );
}
