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
    <div className="h-full flex flex-col items-center justify-center px-5" style={{ background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(249,115,22,.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-30%', left: '-20%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(249,115,22,.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 320, position: 'relative', zIndex: 1 }}>
        <div className="animate-fade-in" style={{ width: 40, height: 4, background: 'var(--border-strong)', borderRadius: 2, margin: '0 auto 32px' }} />

        <div className="flex flex-col items-center animate-fade-in-up" style={{ marginBottom: 32 }}>
          <div className="animate-pop-in" style={{
            width: 80, height: 80, borderRadius: 'var(--radius-xl)',
            background: 'var(--primary-light)',
            border: '2px solid rgba(249,115,22,.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
            boxShadow: '0 8px 30px rgba(249,115,22,.1)',
          }}>
            <img
              src="/logo.png"
              alt="BEK FOOD"
              style={{ width: 48, height: 48, objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden" style={{ display: 'none', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--primary)' }}>BF</span>
            </div>
          </div>
          <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 24, marginBottom: 6, textAlign: 'center', letterSpacing: '-.02em', lineHeight: 1.2 }}>
            Bek Food
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', lineHeight: 1.5 }}>
            Buyurtma berish uchun telefon raqamingizni kiriting
          </div>
        </div>

        <form onSubmit={handleSubmit} className="animate-fade-in-up" style={{ animationDelay: '.1s' }}>
          <div className="input-group" style={{ marginBottom: 16 }}>
            <span className="input-group-icon" style={{ fontWeight: 600, color: 'var(--text-muted)' }}>+998</span>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="__ ___ __ __"
              className="input"
              style={{ paddingLeft: 60, fontSize: 16, fontWeight: 500, letterSpacing: '.05em' }}
            />
          </div>

          <button type="submit" disabled={loading || phone.length < 9} className="btn btn-primary w-full">
            {loading ? <div className="spinner" style={{ borderTopColor: '#fff' }} /> : 'Kod olish'}
          </button>
        </form>

        <div className="animate-fade-in" style={{ color: 'var(--text-dim)', fontSize: 12, textAlign: 'center', marginTop: 14, marginBottom: 32 }}>
          Kod Telegram orqali yuboriladi
        </div>

        <div className="animate-fade-in-up" style={{ borderTop: '1px solid var(--border)', paddingTop: 20, animationDelay: '.2s' }}>
          <div className="grid grid-cols-3" style={{ gap: 8 }}>
            {[
              { label: 'Sotuvchi', role: 'seller', path: '/seller' },
              { label: 'Kuryer', role: 'courier', path: '/courier' },
              { label: 'Admin', role: 'admin', path: '/admin' },
            ].map((item) => (
              <button
                key={item.role}
                onClick={() => { loginAs(item.role); navigate(item.path); }}
                className="card card-hover"
                style={{
                  padding: '12px 0', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: 12, fontWeight: 500,
                  background: 'var(--surface)', border: '1px solid var(--border)',
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
