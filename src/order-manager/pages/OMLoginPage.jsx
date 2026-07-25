import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import useOrderManagerStore from '../store/useOrderManagerStore';

export default function OMLoginPage() {
  const navigate = useNavigate();
  const { login } = useOrderManagerStore();
  const [email, setEmail] = useState('nodira@ajif.uz');
  const [password, setPassword] = useState('order123');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (email === 'nodira@ajif.uz' && password === 'order123') {
        login();
        navigate('/order-manager');
      } else {
        setError('Email yoki parol noto\'g\'ri');
      }
      setLoading(false);
    }, 800);
  };

  const inputStyle = {
    width: '100%', background: 'var(--bg-card)', border: '1.5px solid var(--border)',
    borderRadius: '12px', padding: '14px 16px', fontSize: '14px',
    color: 'var(--text-primary)', fontFamily: 'var(--font-family)',
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
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-terracotta))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(232, 89, 12, 0.3)', margin: '0 auto 16px',
          }}>
            <span style={{ fontWeight: 900, color: 'white', fontSize: '22px' }}>BF</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>Buyurtma Boshqaruvi</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>AJIF Operator Paneli</p>
        </div>

        <div style={{
          background: 'var(--bg-card)', borderRadius: '20px', padding: '28px',
          border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(45,42,38,0.06)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && (
              <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--color-danger-light)', color: 'var(--color-danger)', fontSize: '13px', fontWeight: 500 }}>
                {error}
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" placeholder="Email manzil" value={email} onChange={(e) => setEmail(e.target.value)} style={{ ...inputStyle, paddingLeft: '44px' }} />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type={showPass ? 'text' : 'password'} placeholder="Parol" value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...inputStyle, paddingLeft: '44px', paddingRight: '44px' }} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: '12px',
              background: 'var(--color-primary)', color: 'white', border: 'none',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(232, 89, 12, 0.3)', opacity: loading ? 0.7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontFamily: 'var(--font-family)',
            }}>
              {loading ? (
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
              ) : <><Shield size={16} /> Kirish</>}
            </button>

            <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--bg-secondary)', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>Demo: nodira@ajif.uz</div>
              <div>Parol: order123</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
