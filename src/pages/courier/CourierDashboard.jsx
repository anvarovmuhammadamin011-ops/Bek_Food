import React from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  Banknote,
  Package,
  CheckCheck,
  Bike,
  BellRing,
  ArrowRight,
  MapPin,
  Phone,
  Navigation,
  CreditCard,
  Banknote as CashIcon,
} from 'lucide-react';

const s = {
  page: { padding: '32px', background: 'var(--bg)', minHeight: '100vh' },
  container: { maxWidth: '860px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  title: { fontSize: '28px', fontWeight: '800', color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' },
  statCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px' },
  statIcon: (color, bg) => ({ width: 40, height: 40, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }),
  statValue: { fontSize: '22px', fontWeight: '800', color: 'var(--text)', margin: 0, fontVariantNumeric: 'tabular-nums' },
  statLabel: { fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px', marginBottom: '16px' },
  cardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' },
  cardTitle: { fontSize: '15px', fontWeight: '700', color: 'var(--text)', margin: 0 },
  activeBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999,
    background: 'rgba(34,197,94,0.1)', color: 'var(--success)', fontSize: '11px', fontWeight: '700',
  },
  row: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' },
  actionBtn: (bg, color) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '11px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
    fontSize: 13, fontWeight: 700, background: bg, color, flex: 1, fontFamily: 'inherit',
  }),
  outlineBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '11px 0', borderRadius: 10, border: '1px solid var(--border)',
    background: 'var(--surface)', color: 'var(--text-secondary)', cursor: 'pointer',
    fontSize: 13, fontWeight: 600, flex: 1, fontFamily: 'inherit',
  },
  empty: { background: 'var(--surface)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius)', padding: '36px 20px', textAlign: 'center' },
};

export default function CourierDashboard() {
  const navigate = useNavigate();
  const { user, orders } = useStore();

  const courierId = user?.id;
  const todayStr = new Date().toDateString();
  const isToday = (d) => new Date(d).toDateString() === todayStr;

  const myOrders = orders.filter((o) => o.courierId === courierId);
  const activeOrder = myOrders.find((o) => ['assigned', 'onTheWay', 'pickedUp'].includes(o.status)) || null;
  const availableOrders = orders.filter((o) => o.status === 'assigned' && o.courierId === courierId);
  const deliveredToday = myOrders.filter((o) => o.status === 'delivered' && isToday(o.deliveredAt));
  const todayEarnings = deliveredToday.reduce((s, o) => s + (o.total || 0), 0);

  const openMaps = (address) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || '')}`, '_blank');
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Dashboard</h1>
            <p style={s.subtitle}>Xush kelibsiz, <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user?.name || 'Kuryer'}</span></p>
          </div>
        </div>

        <div style={s.statsGrid}>
          <div style={s.statCard}>
            <div style={s.statIcon('var(--success)', '#F0FDF4')}><Banknote size={19} style={{ color: 'var(--success)' }} /></div>
            <p style={s.statValue}>{todayEarnings.toLocaleString('uz-UZ')}</p>
            <p style={s.statLabel}>Bugungi daromad (so'm)</p>
          </div>
          <div style={s.statCard}>
            <div style={s.statIcon('var(--primary)', 'var(--primary-light)')}><Package size={19} style={{ color: 'var(--primary)' }} /></div>
            <p style={s.statValue}>{myOrders.filter((o) => o.status === 'delivered').length}</p>
            <p style={s.statLabel}>Yetkazilganlar</p>
          </div>
          <div style={s.statCard}>
            <div style={s.statIcon('#3B82F6', '#EFF6FF')}><Bike size={19} style={{ color: '#3B82F6' }} /></div>
            <p style={s.statValue}>{activeOrder ? 1 : 0}</p>
            <p style={s.statLabel}>Faol buyurtma</p>
          </div>
          <div style={s.statCard}>
            <div style={s.statIcon('#EF4444', '#FEF2F2')}><BellRing size={19} style={{ color: '#EF4444' }} /></div>
            <p style={s.statValue}>{availableOrders.length}</p>
            <p style={s.statLabel}>Yangi buyurtmalar</p>
          </div>
        </div>

        <style>{`
          @media(max-width:900px){
            .courier-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media(max-width:480px){
            .courier-stats-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {activeOrder ? (
          <div style={{ ...s.card, borderColor: 'rgba(34,197,94,0.3)' }}>
            <div style={s.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCheck size={17} style={{ color: 'var(--success)' }} />
                <h2 style={s.cardTitle}>Aktiv buyurtma #{String(activeOrder.id).slice(-4)}</h2>
              </div>
              <span style={s.activeBadge}>Faol</span>
            </div>
            <div style={s.row}>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{activeOrder.customerName}</span>
              <span>{activeOrder.customerPhone}</span>
            </div>
            <div style={s.row}>
              <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{activeOrder.address || 'Olib ketish'}</span>
              <button onClick={() => openMaps(activeOrder.address)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: 2, display: 'flex' }}>
                <Navigation size={16} />
              </button>
            </div>
            <div style={s.row}>
              <span>
                {(activeOrder.items || []).map((i) => `${i.quantity}x ${i.food?.name}`).join(', ')}
              </span>
              <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--text)' }}>
                {(activeOrder.total || 0).toLocaleString('uz-UZ')} so'm
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button style={s.outlineBtn} onClick={() => { if (activeOrder.customerPhone) window.location.href = 'tel:' + activeOrder.customerPhone; }}>
                <Phone size={14} /> Qo'ng'iroq
              </button>
              <button style={s.actionBtn('var(--primary)', '#fff')} onClick={() => navigate('/courier/delivery')}>
                Boshqarish <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ ...s.empty, marginBottom: 16 }}>
            <div style={{ fontSize: 38, marginBottom: 8 }}>🚚</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 4px 0' }}>Faol buyurtma yo'q</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Yangi buyurtma tayinlanganda shu yerda ko'rinadi</p>
          </div>
        )}

        <div style={s.card}>
          <div style={s.cardHeader}>
            <h2 style={s.cardTitle}>Yangi buyurtmalar</h2>
            {availableOrders.length > 0 && (
              <span style={{ padding: '3px 10px', borderRadius: 999, background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: 11, fontWeight: 700 }}>
                {availableOrders.length} ta
              </span>
            )}
          </div>
          {availableOrders.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Hozircha yangi buyurtmalar yo'q</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {availableOrders.map((order) => (
                <div key={order.id} style={{ background: 'var(--surface-active)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>#{String(order.id).slice(-4)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
                      {order.paymentMethod === 'card' ? <CreditCard size={13} /> : <CashIcon size={13} />}
                      {order.paymentMethod === 'card' ? 'Karta' : 'Naqd'} · {(order.total || 0).toLocaleString('uz-UZ')} so'm
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                    {order.customerName} · {order.address || 'Olib ketish'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
