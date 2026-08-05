import React from 'react';
import useStore from '../../store/useStore';
import { Bike, Phone, CheckCheck, PackageCheck, Clock } from 'lucide-react';

const s = {
  page: { padding: '24px 16px 32px', background: 'var(--bg)', minHeight: '100vh' },
  container: { maxWidth: '900px', margin: '0 auto' },
  header: { marginBottom: '24px' },
  title: { fontSize: '28px', fontWeight: '800', color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px 20px' },
  cardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' },
  id: { fontSize: '15px', fontWeight: '700', color: 'var(--text)', margin: 0 },
  statusBadge: (color, bg) => ({ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 999, fontSize: '11px', fontWeight: '700', color, background: bg }),
  row: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' },
  timeline: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' },
  step: (done) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '12px',
    color: done ? 'var(--text)' : 'var(--text-muted)',
    fontWeight: done ? 600 : 500,
  }),
  dot: (done, color = '#22C55E') => ({
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: done ? color + '18' : 'var(--surface-active)',
    color: done ? color : 'var(--text-dim)',
    flexShrink: 0,
  }),
  iconBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border)',
    background: 'var(--surface)', color: 'var(--text-secondary)', cursor: 'pointer',
    fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
  },
  empty: { textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' },
};

const formatTime = (d) => (d ? new Date(d).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) : null);

export default function SellerDelivery() {
  const { orders, employees } = useStore();

  const courierName = (id) => employees.find((e) => e.id === id)?.name || 'Kuryer';
  const courierPhone = (id) => employees.find((e) => e.id === id)?.phone || '';

  const deliveryOrders = orders
    .filter((o) => o.courierId && ['assigned', 'onTheWay', 'pickedUp', 'delivered'].includes(o.status))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const STATUS_META = {
    assigned: { label: 'Kuryer tayinlandi', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', icon: Clock },
    onTheWay: { label: 'Kuryer ketdi', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', icon: Bike },
    pickedUp: { label: 'Olib ketildi, yetkazilmoqda', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', icon: PackageCheck },
    delivered: { label: 'Yetkazildi', color: '#6B7280', bg: 'rgba(107,114,128,0.08)', icon: CheckCheck },
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <h1 style={s.title}>Yetkazish</h1>
          <p style={s.subtitle}>Kuryer tayinlangan buyurtmalar holati</p>
        </div>

        {deliveryOrders.length === 0 ? (
          <div style={s.empty}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--surface-active)', border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Bike size={28} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 4px 0' }}>Yetkazish buyurtmalari yo'q</p>
            <p style={{ fontSize: 13, margin: 0 }}>Kuryer tayinlangan buyurtmalar shu yerda ko'rinadi</p>
          </div>
        ) : (
          <div style={s.list}>
            {deliveryOrders.map((order) => {
              const meta = STATUS_META[order.status] || STATUS_META.delivered;
              const StatusIcon = meta.icon;
              const delivered = order.status === 'delivered';
              return (
                <div key={order.id} style={s.card}>
                  <div style={s.cardHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bike size={17} style={{ color: 'var(--primary)' }} />
                      </div>
                      <div>
                        <p style={s.id}>#{String(order.id).slice(-4)}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{courierName(order.courierId)}</p>
                      </div>
                    </div>
                    <span style={s.statusBadge(meta.color, meta.bg)}>
                      <StatusIcon size={12} />
                      {meta.label}
                    </span>
                  </div>

                  <div style={s.row}>
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{order.customerName}</span>
                    <span>{order.customerPhone}</span>
                  </div>
                  <div style={s.row}>
                    <span>Manzil:</span>
                    <span>{order.address || 'Olib ketish'}</span>
                  </div>
                  <div style={s.row}>
                    <span>Summa:</span>
                    <span style={{ fontWeight: 700, color: 'var(--text)' }}>{(order.total || 0).toLocaleString('uz-UZ')} so'm</span>
                  </div>

                  <div style={s.timeline}>
                    <div style={s.step(order.assignedAt)}>
                      <div style={s.dot(order.assignedAt, '#3B82F6')}>
                        <PackageCheck size={12} />
                      </div>
                      <span>Kuryer tayinlandi{order.assignedAt ? ` · ${formatTime(order.assignedAt)}` : ''}</span>
                    </div>
                    <div style={s.step(order.courierAcceptedAt)}>
                      <div style={s.dot(order.courierAcceptedAt, '#8B5CF6')}>
                        <Bike size={12} />
                      </div>
                      <span>Kuryer qabul qildi{order.courierAcceptedAt ? ` · ${formatTime(order.courierAcceptedAt)}` : ''}</span>
                    </div>
                    <div style={s.step(order.pickedUpAt)}>
                      <div style={s.dot(order.pickedUpAt, '#F97316')}>
                        <PackageCheck size={12} />
                      </div>
                      <span>Buyurtmani oldi{order.pickedUpAt ? ` · ${formatTime(order.pickedUpAt)}` : ''}</span>
                    </div>
                    <div style={s.step(delivered)}>
                      <div style={s.dot(delivered)}>
                        <CheckCheck size={12} />
                      </div>
                      <span>Yetkazib berildi{order.deliveredAt ? ` · ${formatTime(order.deliveredAt)}` : ''}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    <button
                      style={s.iconBtn}
                      onClick={() => { if (courierPhone(order.courierId)) window.location.href = 'tel:' + courierPhone(order.courierId); }}
                    >
                      <Phone size={13} /> Kuryerga qo'ng'iroq
                    </button>
                    <button
                      style={s.iconBtn}
                      onClick={() => { if (order.customerPhone) window.location.href = 'tel:' + order.customerPhone; }}
                    >
                      <Phone size={13} /> Mijozga qo'ng'iroq
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
