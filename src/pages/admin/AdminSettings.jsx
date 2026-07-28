import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { motion } from 'framer-motion';
import {
  Store, Phone, Globe, Clock, Bell, Moon, Save, Trash2, AlertTriangle, Upload, Image, Settings, Shield, ChevronDown,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const Toggle = ({ label, checked, onChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
    <span style={{ fontSize: 14, color: 'var(--text)' }}>{label}</span>
    <div onClick={onChange} style={{ position: 'relative', width: 44, height: 24, cursor: 'pointer', flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 12, transition: 'background 0.2s ease', background: checked ? 'var(--primary)' : 'var(--border-strong)' }} />
      <div style={{ position: 'absolute', top: 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s ease', left: checked ? '22px' : '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
    </div>
  </div>
);

const AdminSettings = () => {
  const navigate = useNavigate();
  const { user, logout } = useStore();

  const [restaurantInfo, setRestaurantInfo] = useState({
    name: 'Bekfood Steakhouse', phone: '+998 90 123 45 67', telegram: '@bekfood_uz', instagram: '@bekfood_stakehouse', facebook: '',
  });

  const [operatingSettings, setOperatingSettings] = useState({
    openTime: '09:00', closeTime: '23:00', deliveryPrice: 'Bepul', minOrder: "0 so'm", commission: '2%', currency: "So'm", region: 'Toshkent',
  });

  const [notifications, setNotifications] = useState({ push: true, sms: false, telegram: true, email: false });

  const [appearance, setAppearance] = useState({ darkMode: false, language: "O'zbek" });

  const [seo, setSeo] = useState({
    siteTitle: 'Bekfood - Eng mazali taomlar', description: 'Bekfood restorani - sifatli va mazali taomlar, tez yetkazib berish xizmati.', keywords: "ovqat, restoran, yetkazib berish, Bekfood, Toshkent",
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

  const handleSave = () => alert('Sozlamalar saqlandi!');

  const handleClearAll = () => {
    if (window.confirm("Barcha ma'lumotlarni tozalashni xohlaysizmi?")) alert("Ma'lumotlar tozalandi!");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Hisobingiz o'chiriladi. Davom etishni xohlaysizmi?")) { logout(); navigate('/login'); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div variants={container} initial="hidden" animate="visible" style={{ maxWidth: 800, margin: '0 auto' }}>
        <motion.div variants={item}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', margin: '0 0 28px' }}>Sozlamalar</h1>
        </motion.div>

        <motion.div variants={item} style={{ marginBottom: 20 }}>
          <Card padding="lg">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Store size={20} /></div>
              <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', margin: 0 }}>Restoran Ma'lumotlari</h2>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div onClick={() => document.getElementById('logoInput').click()}
                style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--surface-hover)', border: '2px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', margin: '0 auto', position: 'relative' }}>
                {logoPreview ? <img src={logoPreview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Image size={32} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />}
              </div>
              <input id="logoInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoUpload} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Restoran nomi</label>
              <input value={restaurantInfo.name} onChange={e => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
                style={{ width: '100%', padding: '12px 14px', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Telefon</label>
              <input value={restaurantInfo.phone} onChange={e => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
                style={{ width: '100%', padding: '12px 14px', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Telegram</label>
                <input value={restaurantInfo.telegram} onChange={e => setRestaurantInfo({ ...restaurantInfo, telegram: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Instagram</label>
                <input value={restaurantInfo.instagram} onChange={e => setRestaurantInfo({ ...restaurantInfo, instagram: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>
            <div style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Facebook</label>
              <input value={restaurantInfo.facebook} onChange={e => setRestaurantInfo({ ...restaurantInfo, facebook: e.target.value })} placeholder="Facebook sahifa linki"
                style={{ width: '100%', padding: '12px 14px', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item} style={{ marginBottom: 20 }}>
          <Card padding="lg">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Clock size={20} /></div>
              <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', margin: 0 }}>Ishlash Sozlamalari</h2>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Ish vaqti</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <input type="time" value={operatingSettings.openTime} onChange={e => setOperatingSettings({ ...operatingSettings, openTime: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, display: 'block' }}>Boshlanish</span>
                </div>
                <div>
                  <input type="time" value={operatingSettings.closeTime} onChange={e => setOperatingSettings({ ...operatingSettings, closeTime: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, display: 'block' }}>Tugash</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Yetkazish narxi</label>
                <input value={operatingSettings.deliveryPrice} onChange={e => setOperatingSettings({ ...operatingSettings, deliveryPrice: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Minimal buyurtma</label>
                <input value={operatingSettings.minOrder} onChange={e => setOperatingSettings({ ...operatingSettings, minOrder: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Komissiya (%)</label>
                <input value={operatingSettings.commission} onChange={e => setOperatingSettings({ ...operatingSettings, commission: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Valyuta</label>
                <select value={operatingSettings.currency} onChange={e => setOperatingSettings({ ...operatingSettings, currency: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 14, outline: 'none', cursor: 'pointer', appearance: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                >
                  <option value="So'm">So'm</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Viloyat</label>
              <input value={operatingSettings.region} onChange={e => setOperatingSettings({ ...operatingSettings, region: e.target.value })}
                style={{ width: '100%', padding: '12px 14px', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item} style={{ marginBottom: 20 }}>
          <Card padding="lg">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Bell size={20} /></div>
              <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', margin: 0 }}>Bildirishnoma Sozlamalari</h2>
            </div>
            <Toggle label="Push notifications" checked={notifications.push} onChange={() => setNotifications({ ...notifications, push: !notifications.push })} />
            <Toggle label="SMS notifications" checked={notifications.sms} onChange={() => setNotifications({ ...notifications, sms: !notifications.sms })} />
            <Toggle label="Telegram bot" checked={notifications.telegram} onChange={() => setNotifications({ ...notifications, telegram: !notifications.telegram })} />
            <div style={{ borderBottom: 'none' }}>
              <Toggle label="Email notifications" checked={notifications.email} onChange={() => setNotifications({ ...notifications, email: !notifications.email })} />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item} style={{ marginBottom: 20 }}>
          <Card padding="lg">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Moon size={20} /></div>
              <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', margin: 0 }}>Ko'rinish</h2>
            </div>
            <Toggle label="Dark Mode" checked={appearance.darkMode} onChange={() => setAppearance({ ...appearance, darkMode: !appearance.darkMode })} />
            <div style={{ marginTop: 16, marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Til</label>
              <select value={appearance.language} onChange={e => setAppearance({ ...appearance, language: e.target.value })}
                style={{ width: '100%', padding: '12px 14px', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 14, outline: 'none', cursor: 'pointer', appearance: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              >
                <option value="O'zbek">O'zbek</option>
                <option value="Русский">Русский</option>
                <option value="English">English</option>
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Logo Yuklash</label>
              <div onClick={() => document.getElementById('logoUpload').click()}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--surface-hover)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                <Upload size={18} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Logo faylni tanlang</span>
                <input id="logoUpload" type="file" accept="image/*" style={{ display: 'none' }} />
              </div>
            </div>
            <div style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Favicon Yuklash</label>
              <div onClick={() => document.getElementById('faviconUpload').click()}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--surface-hover)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                <Image size={18} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Favicon faylni tanlang</span>
                <input id="faviconUpload" type="file" accept="image/*" style={{ display: 'none' }} />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item} style={{ marginBottom: 20 }}>
          <Card padding="lg">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Globe size={20} /></div>
              <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', margin: 0 }}>SEO Sozlamalari</h2>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Sarlavha (Title)</label>
              <input value={seo.siteTitle} onChange={e => setSeo({ ...seo, siteTitle: e.target.value })}
                style={{ width: '100%', padding: '12px 14px', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Tavsif (Description)</label>
              <textarea value={seo.description} onChange={e => setSeo({ ...seo, description: e.target.value })} rows={4}
                style={{ width: '100%', padding: '12px 14px', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 14, outline: 'none', resize: 'vertical', minHeight: 100, fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div style={{ marginBottom: 0 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>Kalit so'zlar (Keywords)</label>
              <input value={seo.keywords} onChange={e => setSeo({ ...seo, keywords: e.target.value })} placeholder="Kalit so'zlarni vergul bilan ajrating"
                style={{ width: '100%', padding: '12px 14px', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Button variant="primary" size="lg" leftIcon={<Save size={18} />} style={{ width: '100%', marginBottom: 20, boxShadow: '0 2px 8px rgba(249,115,22,0.25)' }} onClick={handleSave}>Saqlash</Button>
        </motion.div>

        <motion.div variants={item} style={{ marginBottom: 20 }}>
          <Card padding="lg" style={{ border: '1px solid rgba(239,68,68,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(239,68,68,0.1)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}><AlertTriangle size={20} /></div>
              <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', margin: 0 }}>Xavfli Zona</h2>
            </div>
            <Button variant="danger" size="md" leftIcon={<Trash2 size={16} />} style={{ width: '100%', marginBottom: 12 }} onClick={handleClearAll}>Barcha ma'lumotlarni tozalash</Button>
            <Button variant="outline" size="md" style={{ width: '100%', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.25)' }} onClick={handleDeleteAccount}><AlertTriangle size={16} /> Hisobni o'chirish</Button>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AdminSettings;
