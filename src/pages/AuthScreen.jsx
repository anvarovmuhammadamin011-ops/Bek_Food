import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Eye, EyeOff, ChevronRight, Camera } from 'lucide-react';
import useStore from '../store/useStore';

export default function AuthScreen() {
  const navigate = useNavigate();
  const login = useStore((s) => s.login);
  const [mode, setMode] = useState('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login({ id: 1, name: name || 'Bekzod', phone: phone || '+998901234567', email: 'bekzod@example.com', photo: null, language: 'uz' });
      setLoading(false);
      navigate('/');
    }, 1200);
  };

  const handleSocial = () => {
    setLoading(true);
    setTimeout(() => {
      login({ id: 1, name: 'Bekzod', phone: '+998901234567', email: 'bekzod@example.com', photo: null, language: 'uz' });
      setLoading(false);
      navigate('/');
    }, 800);
  };

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-card)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '14px 16px',
    fontSize: '14px',
    color: 'var(--text-primary)',
    transition: 'all 0.25s ease',
    fontFamily: 'var(--font-family)',
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '32px 24px',
        position: 'relative',
        zIndex: 10,
        maxWidth: '480px',
        margin: '0 auto',
        width: '100%',
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-terracotta))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(232, 89, 12, 0.3)',
            margin: '0 auto 12px',
          }}>
            <span style={{ fontWeight: 900, color: 'white', fontSize: '18px' }}>BF</span>
          </div>
          <p style={{
            fontSize: '10px',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            marginTop: '4px',
          }}>
            Tez va Mazali
          </p>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.3s ease-out' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Welcome Back!</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>Sign in to continue ordering</p>
            </div>

            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="tel" placeholder="+998 __ ___ __ __" value={phone} onChange={(e) => setPhone(e.target.value)}
                style={{ ...inputStyle, paddingLeft: '44px' }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: '16px', height: '16px', borderRadius: '4px', accentColor: 'var(--color-primary)' }} /> Remember me
              </label>
              <button type="button" style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-family)' }}>Forgot Password?</button>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-primary)',
              transition: 'all 0.25s ease',
              marginTop: '8px',
              fontFamily: 'var(--font-family)',
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} /> : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>Sign In <ChevronRight size={16} /></span>}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button type="button" onClick={handleSocial} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)',
                padding: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                color: 'var(--text-primary)', fontFamily: 'var(--font-family)', transition: 'all 0.2s ease',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
              <button type="button" onClick={handleSocial} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)',
                padding: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                color: 'var(--text-primary)', fontFamily: 'var(--font-family)', transition: 'all 0.2s ease',
              }}>
                <svg width="14" height="16" viewBox="0 0 17 20" fill="var(--text-primary)"><path d="M8.5 0C6.4 0 4.8 1.5 4.8 3.7v1.3H3.2C1.7 5 0 6.7 0 8.8v3.7c0 2.1 1.7 3.8 3.2 3.8h10.7c1.5 0 3.2-1.7 3.2-3.8V8.8c0-2.1-1.7-3.8-3.2-3.8h-1.6V3.7C12.3 1.5 10.6 0 8.5 0zm0 2.2c.9 0 1.6.7 1.6 1.5v1.3H6.9V3.7c0-.8.7-1.5 1.6-1.5z"/></svg>
                Apple
              </button>
            </div>

            <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)', marginTop: '16px' }}>
              Don't have an account?{' '}
              <button type="button" onClick={() => setMode('register')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer', fontSize: '14px', fontFamily: 'var(--font-family)' }}>
                Sign Up
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', animation: 'fadeIn 0.3s ease-out' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Create Account</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>Join BEK FOOD today</p>
            </div>

            {/* Avatar upload */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'var(--bg-card)', border: '2px dashed var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s ease',
                flexDirection: 'column', gap: '2px',
              }}>
                <Camera size={18} color="var(--text-secondary)" />
                <span style={{ fontSize: '9px', fontWeight: 500, color: 'var(--text-muted)' }}>Photo</span>
              </div>
            </div>

            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />

            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="tel" placeholder="+998 __ ___ __ __" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ ...inputStyle, paddingLeft: '44px' }} />
            </div>

            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary)', color: 'white', border: 'none',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              boxShadow: 'var(--shadow-primary)', transition: 'all 0.25s ease',
              marginTop: '8px', fontFamily: 'var(--font-family)', opacity: loading ? 0.7 : 1,
            }}>
              {loading ? <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} /> : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>Create Account <ChevronRight size={16} /></span>}
            </button>

            <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)', marginTop: '16px' }}>
              Already have an account?{' '}
              <button type="button" onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer', fontSize: '14px', fontFamily: 'var(--font-family)' }}>
                Sign In
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
