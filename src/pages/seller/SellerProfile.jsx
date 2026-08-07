import { useState } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Phone, ShieldCheck, Store, LogOut, Volume2, VolumeX, Bell, Moon, Lock, Check } from 'lucide-react';

export default function SellerProfile() {
  const { user, settings, logout, soundEnabled, toggleSound } = useStore();
  const navigate = useNavigate();
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => { logout?.(); navigate('/login'); };
  const handleChangePw = () => {
    if (!newPw || newPw.length < 4) { setPwMsg('Parol kamida 4 ta belgidan iborat bo\'lishi kerak'); return; }
    setPwMsg('Parol muvaffaqiyatli o\'zgartirildi ✓');
    setOldPw('');
    setNewPw('');
    setTimeout(() => setPwMsg(''), 3000);
  };

  return (
    <div style={{ padding: '20px 16px 32px', background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', margin: '0 0 20px 0', letterSpacing: '-0.5px' }}>Profil</h1>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, textAlign: 'center', marginBottom: 16 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid rgba(249,115,22,0.2)' }}>
            <UserCircle size={36} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{user?.name || 'Operator'}</h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6, padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <ShieldCheck size={12} /> Order Manager
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-active)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={16} /></div>
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>Telefon</p>
              <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{user?.phone || '—'}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-active)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Store size={16} /></div>
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>Restoran</p>
              <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{settings?.name || 'BEK FOOD'}</p>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px 20px', marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px 0' }}>Change Password</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input type="password" placeholder="Eski parol" value={oldPw} onChange={(e) => setOldPw(e.target.value)} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 13, outline: 'none' }} />
            <input type="password" placeholder="Yangi parol" value={newPw} onChange={(e) => setNewPw(e.target.value)} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 13, outline: 'none' }} />
            {pwMsg && <p style={{ fontSize: 12, color: pwMsg.includes('✓') ? 'var(--success)' : 'var(--danger)', margin: 0 }}>{pwMsg}</p>}
            <button onClick={handleChangePw} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 0', borderRadius: 10, border: 'none', background: 'var(--primary)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <Lock size={14} /> Parolni o'zgartirish
            </button>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '8px 20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {soundEnabled ? <Volume2 size={18} style={{ color: 'var(--primary)' }} /> : <VolumeX size={18} style={{ color: 'var(--text-muted)' }} />}
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Notification Sound</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>Yangi buyurtma ovozi</p>
              </div>
            </div>
            <button onClick={toggleSound} style={{ width: 48, height: 28, borderRadius: 14, border: 'none', background: soundEnabled ? 'var(--success)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'background .2s' }}>
              <span style={{ position: 'absolute', top: 3, left: soundEnabled ? 23 : 3, width: 22, height: 22, borderRadius: '50%', background: '#fff', transition: 'left .2s' }} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Bell size={18} style={{ color: 'var(--primary)' }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Notifications</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>Push bildirishnomalar</p>
              </div>
            </div>
            <div style={{ width: 48, height: 28, borderRadius: 14, border: 'none', background: 'var(--success)', cursor: 'pointer', position: 'relative' }}>
              <span style={{ position: 'absolute', top: 3, left: 23, width: 22, height: 22, borderRadius: '50%', background: '#fff' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Moon size={18} style={{ color: 'var(--primary)' }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Dark Mode</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>Tungi rejim</p>
              </div>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} style={{ width: 48, height: 28, borderRadius: 14, border: 'none', background: darkMode ? 'var(--success)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'background .2s' }}>
              <span style={{ position: 'absolute', top: 3, left: darkMode ? 23 : 3, width: 22, height: 22, borderRadius: '50%', background: '#fff', transition: 'left .2s' }} />
            </button>
          </div>
        </div>

        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '14px 0', borderRadius: 12, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', color: 'var(--danger)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          <LogOut size={16} /> Chiqish
        </button>
      </div>
    </div>
  );
}
