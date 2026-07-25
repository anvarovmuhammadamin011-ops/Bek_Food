import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import useDriverStore from '../store/useDriverStore';

export default function DriverLoginPage() {
  const navigate = useNavigate();
  const login = useDriverStore((s) => s.login);
  const [email, setEmail] = useState('sardor@bekfood.uz');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      setLoading(false);
      navigate('/driver/dashboard');
    }, 1000);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg-primary)', padding: '24px', zIndex: 9999,
    }}>
      <div style={{
        width: '100%', maxWidth: '380px', animation: 'slideUp 0.5s ease-out',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-terracotta))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 8px 32px rgba(232, 89, 12, 0.3)',
          }}>
            <span style={{ fontWeight: 900, color: 'white', fontSize: '22px' }}>BF</span>
          </div>
          <h1 style={{
            fontSize: '24px', fontWeight: 900, color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            BEK FOOD Yetkazish
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Yetkazishni boshlash uchun kiring
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Email */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
              }}>
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email manzil"
                style={{
                  width: '100%', padding: '14px 14px 14px 44px',
                  background: 'var(--bg-card)', border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-md)', fontSize: '14px',
                  color: 'var(--text-primary)', fontFamily: 'var(--font-family)',
                  transition: 'all 0.2s ease', outline: 'none',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px var(--color-primary-glow)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Password */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
              }}>
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parol"
                style={{
                  width: '100%', padding: '14px 44px 14px 44px',
                  background: 'var(--bg-card)', border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-md)', fontSize: '14px',
                  color: 'var(--text-primary)', fontFamily: 'var(--font-family)',
                  transition: 'all 0.2s ease', outline: 'none',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px var(--color-primary-glow)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)',
                  cursor: 'pointer', padding: '4px', display: 'flex',
                }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{
              width: '100%', padding: '16px', marginTop: '24px',
              borderRadius: 'var(--radius-md)', background: 'var(--color-primary)',
              color: 'white', border: 'none', fontSize: '15px', fontWeight: 800,
              cursor: loading ? 'default' : 'pointer',
              boxShadow: '0 6px 24px rgba(232, 89, 12, 0.30)',
              transition: 'all 0.25s ease', fontFamily: 'var(--font-family)',
              opacity: loading ? 0.8 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
            {loading ? (
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%',
                border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff',
                animation: 'spin 0.8s linear infinite',
              }} />
            ) : 'Kirish'}
          </button>
        </form>

        <p style={{
          textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)',
          marginTop: '20px',
        }}>
          Demo: sardor@bekfood.uz / 123456
        </p>
      </div>
    </div>
  );
}
