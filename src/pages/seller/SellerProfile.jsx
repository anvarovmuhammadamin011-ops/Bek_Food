import React from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Phone, ShieldCheck, LogOut, Store } from 'lucide-react';

const s = {
  page: { padding: '24px 16px 32px', background: 'var(--bg)', minHeight: '100vh' },
  container: { maxWidth: '560px', margin: '0 auto' },
  title: { fontSize: '28px', fontWeight: '800', color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px', textAlign: 'center' },
  avatar: {
    width: 84, height: 84, borderRadius: '50%', margin: '0 auto 14px',
    background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '3px solid rgba(249,115,22,0.2)',
  },
  name: { fontSize: '20px', fontWeight: '800', color: 'var(--text)', margin: 0 },
  roleBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8,
    padding: '4px 12px', borderRadius: 999, fontSize: '11px', fontWeight: '700',
    background: 'var(--primary-light)', color: 'var(--primary)',
  },
  infoCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px', marginTop: '16px' },
  infoRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0' },
  infoIcon: { width: 36, height: 36, borderRadius: 10, background: 'var(--surface-active)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  infoLabel: { fontSize: '11px', color: 'var(--text-muted)', margin: 0 },
  infoValue: { fontSize: '14px', fontWeight: 600, color: 'var(--text)', margin: 0 },
  logoutBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    width: '100%', marginTop: 16, padding: '12px 0', borderRadius: 'var(--radius-sm)',
    border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)',
    color: 'var(--danger)', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  },
};

export default function SellerProfile() {
  const { user, settings, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={s.title}>Profil</h1>
          <p style={s.subtitle}>Shaxsiy ma'lumotlar</p>
        </div>

        <div style={s.card}>
          <div style={s.avatar}>
            <UserCircle size={44} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={s.name}>{user?.name || 'Sotuvchi'}</h2>
          <div style={s.roleBadge}>
            <ShieldCheck size={12} /> Operator
          </div>
        </div>

        <div style={s.infoCard}>
          <div style={{ ...s.infoRow, borderBottom: '1px solid var(--border)' }}>
            <div style={s.infoIcon}>
              <Phone size={16} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <div>
              <p style={s.infoLabel}>Telefon</p>
              <p style={s.infoValue}>{user?.phone || '—'}</p>
            </div>
          </div>
          <div style={s.infoRow}>
            <div style={s.infoIcon}>
              <Store size={16} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <div>
              <p style={s.infoLabel}>Restoran</p>
              <p style={s.infoValue}>{settings?.name || 'BEK FOOD'}</p>
            </div>
          </div>
        </div>

        <button style={s.logoutBtn} onClick={handleLogout}>
          <LogOut size={16} /> Chiqish
        </button>
      </div>
    </div>
  );
}
