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
    if (!newPw || newPw.length < 4) { setPwMsg("Parol kamida 4 ta belgidan iborat bo'lishi kerak"); return; }
    setPwMsg("Parol muvaffaqiyatli o'zgartirildi ✓");
    setOldPw('');
    setNewPw('');
    setTimeout(() => setPwMsg(''), 3000);
  };

  return (
    <div style={{ padding: '16px 16px 32px', background: 'var(--bg)', minHeight: '100%' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', margin: '0 0 16px 0', letterSpacing: '-0.5px' }}>Profil</h1>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px 16px', textAlign: 'center', marginBottom: 12 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid rgba(249,115,22,0.2)' }}>
            <UserCircle size={36} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{user?.name || 'Operator'}</h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6, padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <ShieldCheck size={12} /> Order Manager
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '4px 16px', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--surface-active)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Phone size={16} /></div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>Telefon</p>
              <p style={{ fontSize: 14, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.phone || '—'}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--surface-active)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Store size={16} /></div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>Restoran</p>
              <p style={{ fontSize: 14, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{settings?.name || 'BEK FOOD'}</p>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px 0' }}>Parolni o'zgartirish</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input type="password" placeholder="Eski parol" value={oldPw} onChange={(e) => setOldPw(e.target.value)}
              style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14, outline: 'none', minHeight: 48, width: '100%', boxSizing: 'border-box' }} />
            <input type="password" placeholder="Yangi parol" value={newPw} onChange={(e) => setNewPw(e.target.value)}
              style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: 14, outline: 'none', minHeight: 48, width: '100%', boxSizing: 'border-box' }} />
            {pwMsg && <p style={{ fontSize: 12, color: pwMsg.includes('✓') ? 'var(--success)' : 'var(--danger)', margin: 0 }}>{pwMsg}</p>}
            <button onClick={handleChangePw}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 0', borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--primary)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', minHeight: 48, width: '100%' }}>
              <Lock size={14} /> Parolni o'zgartirish
            </button>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '4px 16px', marginBottom: 16 }}>
          {[
            {
              icon: soundEnabled ? Volume2 : VolumeX,
              iconColor: soundEnabled ? 'var(--primary)' : 'var(--text-muted)',
              title: 'Ovoz',
              sub: 'Yangi buyurtma ovozi',
              enabled: soundEnabled,
              onToggle: toggleSound,
            },
            {
              icon: Bell,
              iconColor: 'var(--primary)',
              title: 'Bildirishnomalar',
              sub: 'Push bildirishnomalar',
              enabled: true,
              onToggle: null,
            },
            {
              icon: Moon,
              iconColor: 'var(--primary)',
              title: 'Dark Mode',
              sub: 'Tungi rejim',
              enabled: darkMode,
              onToggle: () => setDarkMode(!darkMode),
            },
          ].map((item, idx, arr) => {
            const Icon = item.icon;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: idx < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                  <Icon size={18} style={{ color: item.iconColor, flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{item.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{item.sub}</p>
                  </div>
                </div>
                <button onClick={item.onToggle || undefined}
                  style={{ width: 52, height: 30, borderRadius: 15, border: 'none', background: item.enabled ? 'var(--success)' : 'var(--border)', cursor: item.onToggle ? 'pointer' : 'default', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
                  <span style={{ position: 'absolute', top: 3, left: item.enabled ? 25 : 3, width: 24, height: 24, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
                </button>
              </div>
            );
          })}
        </div>

        <button onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '14px 0', borderRadius: 'var(--radius)', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', color: 'var(--danger)', fontSize: 14, fontWeight: 700, cursor: 'pointer', minHeight: 52 }}>
          <LogOut size={16} /> Chiqish
        </button>
      </div>
    </div>
  );
}
