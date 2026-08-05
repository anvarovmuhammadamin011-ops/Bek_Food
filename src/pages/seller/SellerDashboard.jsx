import React from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  BellRing,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  Bike,
  CheckCheck,
  XCircle,
  ArrowRight,
} from 'lucide-react';

const s = {
  page: { padding: '24px 16px 32px', background: 'var(--bg)', minHeight: '100vh' },
  container: { maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' },
  title: { fontSize: '28px', fontWeight: '800', color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' },
  btnPrimary: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s', fontFamily: 'inherit', background: 'var(--primary)', color: '#fff', boxShadow: '0 2px 8px rgba(249,115,22,0.3)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'all 0.2s' },
  cardIcon: (color, bg) => ({ width: '46px', height: '46px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }),
  cardLabel: { fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, margin: 0 },
  cardValue: { fontSize: '24px', fontWeight: '800', color: 'var(--text)', margin: '2px 0 0 0', fontVariantNumeric: 'tabular-nums' },
  empty: { background: 'var(--surface)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius)', padding: '40px 20px', textAlign: 'center', marginTop: '20px' },
};

export default function SellerDashboard() {
  const navigate = useNavigate();
  const { orders, user } = useStore();

  const count = (status) => orders.filter((o) => o.status === status).length;
  const todayStr = new Date().toDateString();
  const isToday = (o) => new Date(o.createdAt).toDateString() === todayStr;

  const cards = [
    { label: 'Yangi buyurtmalar', value: count('pending'), icon: BellRing, color: '#EF4444', bg: '#FEF2F2', status: 'pending' },
    { label: 'Qabul qilingan', value: count('confirmed'), icon: CheckCircle2, color: '#F59E0B', bg: '#FFFBEB', status: 'confirmed' },
    { label: 'Tayyorlanmoqda', value: count('preparing'), icon: ChefHat, color: 'var(--primary)', bg: 'var(--primary-light)', status: 'preparing' },
    { label: 'Tayyor', value: count('ready'), icon: PackageCheck, color: '#22C55E', bg: '#F0FDF4', status: 'ready' },
    { label: 'Kuryer kutilmoqda', value: orders.filter((o) => o.status === 'ready' && !o.courierId).length, icon: Bike, color: '#3B82F6', bg: '#EFF6FF', status: 'ready' },
    { label: "Bugun yetkazildi", value: orders.filter((o) => o.status === 'delivered' && isToday(o)).length, icon: CheckCheck, color: '#10B981', bg: '#ECFDF5', status: 'delivered' },
    { label: 'Bugun bekor qilingan', value: orders.filter((o) => o.status === 'cancelled' && isToday(o)).length, icon: XCircle, color: '#6B7280', bg: '#F3F4F6', status: 'cancelled' },
  ];

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Dashboard</h1>
            <p style={s.subtitle}>Xush kelibsiz, <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user?.name || 'Sotuvchi'}</span></p>
          </div>
          <button style={s.btnPrimary} onClick={() => navigate('/seller/orders')}>
            Buyurtmalar <ArrowRight size={16} />
          </button>
        </div>

        <style>{`
          .dash-grid-responsive { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
          @media(max-width:900px){
            .dash-grid-responsive { grid-template-columns: repeat(2, 1fr); }
          }
          @media(max-width:480px){
            .dash-grid-responsive { grid-template-columns: 1fr; }
            .dash-grid-responsive > div { padding: 16px; }
          }
        `}</style>

        <div className="dash-grid-responsive">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                style={s.card}
                onClick={() => navigate(`/seller/orders?status=${card.status}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={s.cardIcon(card.color, card.bg)}>
                  <Icon size={22} style={{ color: card.color }} />
                </div>
                <div>
                  <p style={s.cardLabel}>{card.label}</p>
                  <p style={s.cardValue}>{card.value} <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>ta</span></p>
                </div>
              </div>
            );
          })}
        </div>

        {count('pending') === 0 && (
          <div style={s.empty}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🍔</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 4px 0' }}>Yangi buyurtmalar yo'q</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Yangi buyurtma kelganda bu yerda paydo bo'ladi</p>
          </div>
        )}
      </div>
    </div>
  );
}
