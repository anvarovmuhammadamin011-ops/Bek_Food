import React from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Phone, Bike, LogOut, Package, CheckCheck } from 'lucide-react';

const s = {
  page: { padding: '32px', background: 'var(--bg)', minHeight: '100vh' },
  container: { maxWidth: '520px', margin: '0 auto' },
  title: { fontSize: '28px', fontWeight: '800', color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px', marginTop: '20px' },
  avatar: { width: 72, height: 72, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, margin: '0 auto 12px auto' },
  name: { textAlign: 'center', fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 },
  role: { textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 16px 0' },
  row: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderTop: '1px solid var(--border)', fontSize: 13 },
  rowLabel: { color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 },
  logoutBtn: {
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '13px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
    fontSize: 14, fontWeight: 700, background: 'rgba(239,68,68,0.1)', color: 'var(--danger)',
    marginTop: 16, fontFamily: 'inherit',
  },
};

export default function CourierProfile() {
  const navigate = useNavigate();
  const { user, orders, logout } = useStore();

  const courierId = user?.id;
  const deliveredCount = orders.filter((o) => o.courierId === courierId && o.status === 'delivered').length;
  const todayStr = new Date().toDateString();
  const todayEarnings = orders
    .filter((o) => o.courierId === courierId && o.status === 'delivered' && new Date(o.deliveredAt).toDateString() === todayStr)
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <h1 style={s.title}>Profil</h1>
        <div style={s.card}>
          <div style={s.avatar}>{(user?.name || 'K')[0]}</div>
          <p style={s.name}>{user?.name || 'Kuryer'}</p>
          <p style={s.role}>Kuryer</p>

          <div style={s.row}>
            <span style={s.rowLabel}><Phone size={15} /> Telefon</span>
            <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--text)' }}>{user?.phone || '—'}</span>
          </div>
          <div style={s.row}>
            <span style={s.rowLabel}><Bike size={15} /> Onlayn status</span>
            <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--success)' }}>Onlayn</span>
          </div>
          <div style={s.row}>
            <span style={s.rowLabel}><CheckCheck size={15} /> Yetkazilganlar</span>
            <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--text)' }}>{deliveredCount} ta</span>
          </div>
          <div style={s.row}>
            <span style={s.rowLabel}><Package size={15} /> Bugungi daromad</span>
            <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--text)' }}>{todayEarnings.toLocaleString('uz-UZ')} so'm</span>
          </div>

          <button style={s.logoutBtn} onClick={handleLogout}>
            <LogOut size={15} /> Chiqish
          </button>
        </div>
      </div>
    </div>
  );
}
