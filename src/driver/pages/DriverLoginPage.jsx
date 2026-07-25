import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import useDriverStore from '../store/useDriverStore';

export default function DriverLoginPage() {
  const navigate = useNavigate();
  const { login } = useDriverStore();
  const [email, setEmail] = useState('sardor@ajif.uz');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (email === 'sardor@ajif.uz' && password === '123456') {
        login(email, password);
        navigate('/driver');
      } else {
        setError('Email yoki parol noto\'g\'ri');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg-primary)', padding: '20px', zIndex: 9999,
    }}>
      <div style={{ width: '100%', maxWidth: '400px', animation: 'slideUp 0.4s ease-out' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'linear-gradient(135deg, var(--color-success), #1a9a4a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(43, 138, 62, 0.3)', margin: '0 auto 16px',
          }}>
            <span style={{ fontWeight: 900, color: 'white', fontSize: '22px' }}>BF</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Yetkazish Xizmati
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            AJIF Haydovchi Paneli
          </p>
        </div>

        <div style={{
          background: 'var(--bg-card)', borderRadius: '20px', padding: '28px',
          border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(45, 42, 38, 0.06)',
        }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Xush kelibsiz</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Yetkazishni boshlash uchun kiring</p>
            </div>

            {error && (
              <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--color-danger-light)', color: 'var(--color-danger)', fontSize: '13px', fontWeight: 500 }}>
                {error}
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" placeholder="Email manzil" value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px 14px 44px', fontSize: '14px', color: 'var(--text-primary)', fontFamily: 'var(--font-family)', transition: 'all 0.25s ease' }} />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type={showPassword ? 'text' : 'password'} placeholder="Parol" value={password} onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '14px 44px 14px 44px', fontSize: '14px', color: 'var(--text-primary)', fontFamily: 'var(--font-family)', transition: 'all 0.25s ease' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: '12px',
              background: 'var(--color-success)', color: 'white', border: 'none',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(43, 138, 62, 0.3)', opacity: loading ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontFamily: 'var(--font-family)',
            }}>
              {loading ? (
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
              ) : <><Shield size={16} /> Kirish</>}
            </button>

            <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--bg-secondary)', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>Demo: sardor@ajif.uz</div>
              <div>Parol: 123456</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
