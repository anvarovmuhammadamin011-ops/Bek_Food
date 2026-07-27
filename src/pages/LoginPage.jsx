import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const loginAs = useStore((s) => s.loginAs);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone.length < 9) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/verify', { state: { phone } });
    }, 800);
  };

  const formatPhone = (value) => {
    const nums = value.replace(/\D/g, '').slice(0, 9);
    if (nums.length <= 2) return nums;
    if (nums.length <= 5) return `${nums.slice(0, 2)} ${nums.slice(2)}`;
    return `${nums.slice(0, 2)} ${nums.slice(2, 5)} ${nums.slice(5)}`;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-5" style={{ background: '#0a0a0a' }}>
      <div style={{ width: '100%', maxWidth: 320 }}>
        {/* Top bar */}
        <div style={{ width: 40, height: 4, background: '#333', borderRadius: 2, margin: '0 auto 28px' }} />

        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid #e51e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <img
              src="/logo.png"
              alt="BEK FOOD"
              style={{ width: 40, height: 40, objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden" style={{ display: 'none', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: '#e51e1e' }}>BF</span>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#fff', fontSize: 20, marginBottom: 4, textAlign: 'center' }}>
            Bek Food'ga xush kelibsiz
          </div>
          <div style={{ color: '#b8b8b8', fontSize: 12, textAlign: 'center' }}>
            Buyurtma berish uchun telefon raqamingizni kiriting
          </div>
        </div>

        {/* Phone input */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
            <span style={{ color: '#b8b8b8', fontSize: 14, marginRight: 8 }}>+998</span>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="__ ___ __ __"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 14 }}
            />
          </div>

          <button type="submit" disabled={loading || phone.length < 9} className="btn btn-primary w-full" style={{ borderRadius: 10, marginBottom: 14 }}>
            {loading ? <div className="spinner" /> : 'Kod olish'}
          </button>
        </form>

        <div style={{ color: '#6b6b6b', fontSize: 11, textAlign: 'center', marginBottom: 28 }}>
          Kod Telegram orqali yuboriladi
        </div>

        {/* Demo buttons */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { label: 'Sotuvchi', role: 'seller', path: '/seller' },
              { label: 'Kuryer', role: 'courier', path: '/courier' },
              { label: 'Admin', role: 'admin', path: '/admin' },
            ].map((item) => (
              <button
                key={item.role}
                onClick={() => { loginAs(item.role); navigate(item.path); }}
                style={{
                  padding: '10px 0', borderRadius: 8,
                  background: '#141414', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#6b6b6b', fontSize: 11, fontWeight: 500,
                  cursor: 'pointer', transition: 'all .15s'
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
