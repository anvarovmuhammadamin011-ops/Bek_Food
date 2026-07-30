import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import GoogleLoginButton from '../components/GoogleLoginButton';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useStore((s) => s.login);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 9) return;
    setLoading(true);
    setError('');
    try {
      const fullPhone = `998${cleaned}`;
      const userId = Math.abs([...fullPhone].reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)) % 99999 || 1;
      const userData = { id: userId, name: 'User', phone: fullPhone, role: 'CUSTOMER', email: '', avatar: '' };
      login(userData);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Xatolik');
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (value) => {
    const nums = value.replace(/\D/g, '').slice(0, 9);
    if (nums.length <= 2) return nums;
    if (nums.length <= 5) return `${nums.slice(0, 2)} ${nums.slice(2)}`;
    return `${nums.slice(0, 2)} ${nums.slice(2, 5)} ${nums.slice(5)}`;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-5" style={{ background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(249,115,22,.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-30%', left: '-20%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(249,115,22,.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 320, position: 'relative', zIndex: 1 }}>
        <div style={{ width: 40, height: 4, background: 'var(--border-strong)', borderRadius: 2, margin: '0 auto 32px' }} />

        <div className="flex flex-col items-center" style={{ marginBottom: 32 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 'var(--radius-xl)',
            background: 'var(--primary-light)',
            border: '2px solid rgba(249,115,22,.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
            boxShadow: '0 8px 30px rgba(249,115,22,.1)',
          }}>
            <img src="/logo.png" alt="BEK FOOD" style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: '50%' }}
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            <div className="hidden" style={{ display: 'none', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>BF</span>
            </div>
          </div>
          <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 24, marginBottom: 6, textAlign: 'center', letterSpacing: '-.02em', lineHeight: 1.2 }}>Bek Food</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', lineHeight: 1.5 }}>Telefon raqamingizni kiriting</div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="input-group" style={{ marginBottom: 16 }}>
            <span className="input-group-icon" style={{ fontWeight: 600, color: 'var(--text-muted)' }}>+998</span>
            <input type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="__ ___ __ __" className="input" style={{ paddingLeft: 60, fontSize: 16, fontWeight: 500, letterSpacing: '.05em' }} />
          </div>
          {error && <div style={{ color: 'var(--danger)', fontSize: 13, textAlign: 'center', marginBottom: 12, fontWeight: 500 }}>{error}</div>}
          <button type="submit" disabled={phone.replace(/\D/g, '').length < 9 || loading} className="btn btn-primary w-full">
            {loading ? <div className="spinner" style={{ borderTopColor: '#fff' }} /> : 'Kirish'}
          </button>
        </form>

        <div style={{ color: 'var(--text-dim)', fontSize: 12, textAlign: 'center', marginTop: 14 }}>Telefon raqamingiz orqali tez kiring</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ color: 'var(--text-dim)', fontSize: 12, fontWeight: 500, flexShrink: 0 }}>yoki</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <GoogleLoginButton />
      </div>
    </div>
  );
}
