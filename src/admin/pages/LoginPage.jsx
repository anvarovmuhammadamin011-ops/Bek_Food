import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, Package, Truck } from 'lucide-react';
import useAdminStore from '../store/useAdminStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAdminStore();
  const [email, setEmail] = useState('admin@ajif.uz');
  const [password, setPassword] = useState('admin123');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (email === 'admin@ajif.uz' && password === 'admin123') {
        login(email, password);
        navigate('/admin');
      } else {
        setError('Email yoki parol noto\'g\'ri');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg-primary)', padding: '20px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px', animation: 'slideUp 0.4s ease-out' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-primary)', margin: '0 auto 16px',
          }}>
            <span style={{ fontWeight: 800, color: 'white', fontSize: '22px', letterSpacing: '-0.02em' }}>AC</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Alif Cafe
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Admin Panel
          </p>
        </div>

        <div style={{
          background: 'var(--bg-card)', borderRadius: '20px', padding: '28px',
          border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(45, 42, 38, 0.06)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>Xush kelibsiz</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Restoranni boshqarish uchun kiring</p>
            </div>

            {error && (
              <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--color-danger-light)', color: 'var(--color-danger)', fontSize: '13px', fontWeight: 500 }}>
                {error}
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" placeholder="Email manzil" value={email} onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px 14px 44px', fontSize: '14px', color: 'var(--text-primary)', transition: 'all 0.25s ease', fontFamily: 'var(--font-family)' }} />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type={showPass ? 'text' : 'password'} placeholder="Parol" value={password} onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '14px 44px 14px 44px', fontSize: '14px', color: 'var(--text-primary)', transition: 'all 0.25s ease', fontFamily: 'var(--font-family)' }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }} />
                Eslab qolish
              </label>
              <button type="button" style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
                Parolni unutdingizmi?
              </button>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: '12px',
              background: 'var(--color-primary)', color: 'white', border: 'none',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(232, 89, 12, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              opacity: loading ? 0.7 : 1, transition: 'all 0.25s ease', fontFamily: 'var(--font-family)',
            }}>
              {loading ? (
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
              ) : (
                <><Shield size={16} /> Kirish</>
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>Demo Ma'lumotlari</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--bg-secondary)', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>admin@ajif.uz</div>
              <div>admin123</div>
            </div>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '20px' }}>
          © 2026 AJIF Admin
        </p>

        {/* Order Manager */}
        <button onClick={() => window.location.href = '/order-manager'} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          background: 'var(--bg-card)', border: '1.5px solid var(--border)',
          borderRadius: '12px', padding: '12px', marginTop: '12px',
          fontSize: '12px', fontWeight: 600, cursor: 'pointer',
          color: 'var(--text-muted)', fontFamily: 'var(--font-family)', transition: 'all 0.2s ease',
        }}>
          <Package size={14} /> Buyurtma Boshqaruvi
        </button>

        {/* Delivery */}
        <button onClick={() => window.location.href = '/driver'} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          background: 'var(--bg-card)', border: '1.5px solid var(--border)',
          borderRadius: '12px', padding: '12px', marginTop: '8px',
          fontSize: '12px', fontWeight: 600, cursor: 'pointer',
          color: 'var(--text-muted)', fontFamily: 'var(--font-family)', transition: 'all 0.2s ease',
        }}>
          <Truck size={14} /> Yetkazish Paneli
        </button>
      </div>
    </div>
  );
}
