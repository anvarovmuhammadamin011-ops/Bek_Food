import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff, ChevronRight, Camera, Phone, LayoutDashboard, Package, Truck, User } from 'lucide-react';
import useStore from '../store/useStore';

const staffAccounts = {
  'admin@ajif.uz': { password: 'admin123', route: '/admin', label: 'Admin Paneli' },
  'driver@ajif.uz': { password: 'driver123', route: '/driver', label: 'Yetkazish Paneli' },
};

export default function AuthScreen() {
  const navigate = useNavigate();
  const login = useStore((s) => s.login);
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check for staff accounts first
    const staffAccount = staffAccounts[email.toLowerCase()];
    if (staffAccount && password === staffAccount.password) {
      setLoading(false);
      window.location.href = staffAccount.route;
      return;
    }

    // Use store login (handles backend + fallback)
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      navigate('/');
    } else {
      setError('Login failed. Check your credentials.');
    }
  };

  const handleQuickLogin = (route) => {
    window.location.href = route;
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login({ id: 1, name: 'Bekzod', phone: '+998901234567', email: 'bekzod@gmail.com', photo: null, language: 'uz' });
      setLoading(false);
      navigate('/');
    }, 800);
  };

  const handleAppleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login({ id: 1, name: 'Bekzod', phone: '+998901234567', email: 'bekzod@icloud.com', photo: null, language: 'uz' });
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

  const quickAccessBtn = () => ({
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '12px 14px', borderRadius: '12px',
    background: 'var(--bg-card)', border: '1.5px solid var(--border)',
    cursor: 'pointer', transition: 'all 0.2s ease',
    width: '100%', fontFamily: 'var(--font-family)',
  });

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-primary)', position: 'relative', overflow: 'auto',
    }}>
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '32px 24px', position: 'relative', zIndex: 10,
        maxWidth: '480px', margin: '0 auto', width: '100%',
      }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-terracotta))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(232, 89, 12, 0.3)', margin: '0 auto 12px',
          }}>
            <span style={{ fontWeight: 900, color: 'white', fontSize: '18px' }}>BF</span>
          </div>
          <p style={{
            fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.3em', marginTop: '4px',
          }}>
            Tez va Mazali
          </p>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeIn 0.3s ease-out' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Xush kelibsiz!</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>Hisobingizga kiring</p>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'var(--color-danger-light)', color: 'var(--color-danger)', fontSize: '13px', fontWeight: 500 }}>
                {error}
              </div>
            )}

            {/* Google */}
            <button type="button" onClick={handleGoogleLogin} disabled={loading} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              background: 'white', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)',
              padding: '13px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              color: 'var(--text-primary)', fontFamily: 'var(--font-family)', transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)', width: '100%',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google orqali kirish
            </button>

            {/* Apple */}
            <button type="button" onClick={handleAppleLogin} disabled={loading} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              background: 'var(--text-primary)', border: 'none', borderRadius: 'var(--radius-md)',
              padding: '13px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              color: 'white', fontFamily: 'var(--font-family)', transition: 'all 0.2s ease', width: '100%',
            }}>
              <svg width="18" height="20" viewBox="0 0 17 20" fill="white"><path d="M8.5 0C6.4 0 4.8 1.5 4.8 3.7v1.3H3.2C1.7 5 0 6.7 0 8.8v3.7c0 2.1 1.7 3.8 3.2 3.8h10.7c1.5 0 3.2-1.7 3.2-3.8V8.8c0-2.1-1.7-3.8-3.2-3.8h-1.6V3.7C12.3 1.5 10.6 0 8.5 0zm0 2.2c.9 0 1.6.7 1.6 1.5v1.3H6.9V3.7c0-.8.7-1.5 1.6-1.5z"/></svg>
              Apple orqali kirish
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '2px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>yoki email bilan kirish</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            {/* Email */}
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" placeholder="Email manzil" value={email} onChange={(e) => setEmail(e.target.value)} style={{ ...inputStyle, paddingLeft: '44px' }} />
            </div>

            {/* Password */}
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} placeholder="Parol" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: '16px', height: '16px', borderRadius: '4px', accentColor: 'var(--color-primary)' }} /> Eslab qolish
              </label>
              <button type="button" style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer', fontSize: '12px', fontFamily: 'var(--font-family)' }}>Parolni unutdingizmi?</button>
            </div>

            {/* Sign In */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary)', color: 'white', border: 'none',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              boxShadow: 'var(--shadow-primary)', transition: 'all 0.25s ease',
              marginTop: '2px', fontFamily: 'var(--font-family)', opacity: loading ? 0.7 : 1,
            }}>
              {loading ? <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} /> : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>Kirish <ChevronRight size={16} /></span>}
            </button>

            <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Hisobingiz yo'qmi?{' '}
              <button type="button" onClick={() => setMode('register')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer', fontSize: '14px', fontFamily: 'var(--font-family)' }}>
                Ro'yxatdan o'tish
              </button>
            </p>

            {/* Staff Panels Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Xodimlar paneli</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            {/* Staff Quick Access */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button type="button" onClick={() => handleQuickLogin('/admin')} style={quickAccessBtn()}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <LayoutDashboard size={16} color="var(--color-primary)" />
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Admin Paneli</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>admin@ajif.uz</div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </button>

              <button type="button" onClick={() => handleQuickLogin('/order-manager')} style={quickAccessBtn()}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Package size={16} color="#8b5cf6" />
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Buyurtma Boshqaruvi</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>nodira@ajif.uz</div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </button>

              <button type="button" onClick={() => handleQuickLogin('/driver')} style={quickAccessBtn()}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--color-success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Truck size={16} color="var(--color-success)" />
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Yetkazish Paneli</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>driver@ajif.uz</div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeIn 0.3s ease-out' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Hisob yaratish</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>AJIF ga qo'shiling</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'var(--bg-card)', border: '2px dashed var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexDirection: 'column', gap: '2px',
              }}>
                <Camera size={18} color="var(--text-secondary)" />
                <span style={{ fontSize: '9px', fontWeight: 500, color: 'var(--text-muted)' }}>Rasm</span>
              </div>
            </div>

            <input type="text" placeholder="To'liq ism" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />

            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" placeholder="Email manzil" value={email} onChange={(e) => setEmail(e.target.value)} style={{ ...inputStyle, paddingLeft: '44px' }} />
            </div>

            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="tel" placeholder="Telefon (ixtiyoriy)" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ ...inputStyle, paddingLeft: '44px' }} />
            </div>

            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} placeholder="Parol" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
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
              {loading ? <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} /> : <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>Yaratish <ChevronRight size={16} /></span>}
            </button>

            <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)', marginTop: '12px' }}>
              Hisobingiz bormi?{' '}
              <button type="button" onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer', fontSize: '14px', fontFamily: 'var(--font-family)' }}>
                Kirish
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
