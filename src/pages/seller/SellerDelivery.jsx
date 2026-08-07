import { useState } from 'react';
import useStore from '../../store/useStore';
import { Bike, Phone, CheckCheck, PackageCheck, Clock, MapPin, Navigation } from 'lucide-react';

const formatTime = (d) => (d ? new Date(d).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) : null);
const formatPrice = (n) => Number(n || 0).toLocaleString('uz-UZ') + " so'm";

export default function SellerDelivery() {
  const { orders, employees } = useStore();
  const [tab, setTab] = useState('active');

  const courierName = (id) => employees.find((e) => e.id === id)?.name || 'Kuryer';
  const courierPhone = (id) => employees.find((e) => e.id === id)?.phone || '';

  const activeDeliveries = orders
    .filter((o) => o.courierId && ['assigned', 'onTheWay', 'pickedUp'].includes(o.status))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const delivered = orders
    .filter((o) => o.status === 'delivered')
    .sort((a, b) => new Date(b.deliveredAt || b.createdAt) - new Date(a.deliveredAt || a.createdAt))
    .slice(0, 20);

  const drivers = employees.filter((e) => e.role === 'courier');

  const STATUS_META = {
    assigned: { label: 'Kuryer tayinlandi', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', icon: Clock },
    onTheWay: { label: "Yo'lda", color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', icon: Bike },
    pickedUp: { label: 'Yetkazilmoqda', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', icon: PackageCheck },
    delivered: { label: 'Yetkazildi', color: '#22C55E', bg: 'rgba(34,197,94,0.08)', icon: CheckCheck },
  };

  const estimateETA = (order) => {
    const start = new Date(order.pickedUpAt || order.courierAcceptedAt || order.assignedAt || order.createdAt);
    const mins = Math.max(1, Math.round((Date.now() - start.getTime()) / 60000));
    const remaining = Math.max(1, 25 - mins);
    return `~${remaining} min`;
  };

  return (
    <div style={{ padding: '20px 16px 32px', background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>Yetkazish</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 20px 0' }}>Kuryer tayinlangan buyurtmalar holati</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[
            { key: 'active', label: `Active Deliveries (${activeDeliveries.length})` },
            { key: 'drivers', label: `Available Drivers (${drivers.filter((d) => d.isOnline).length})` },
            { key: 'history', label: 'Delivery History' },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '8px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', background: tab === t.key ? 'var(--primary)' : 'var(--surface)', color: tab === t.key ? '#fff' : 'var(--text-muted)', border: tab === t.key ? 'none' : '1px solid var(--border)' }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'active' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeDeliveries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--surface-active)', border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Bike size={28} style={{ color: 'var(--text-muted)' }} />
                </div>
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 4px 0' }}>Faol yetkazishlar yo'q</p>
                <p style={{ fontSize: 13, margin: 0 }}>Kuryer tayinlangan buyurtmalar shu yerda ko'rinadi</p>
              </div>
            ) : (
              activeDeliveries.map((order) => {
                const meta = STATUS_META[order.status] || STATUS_META.assigned;
                const StatusIcon = meta.icon;
                return (
                  <div key={order.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Bike size={18} style={{ color: 'var(--primary)' }} />
                        </div>
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>#{String(order.id).slice(-4)}</p>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{courierName(order.courierId)}</p>
                        </div>
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, color: meta.color, background: meta.bg }}>
                        <StatusIcon size={12} /> {meta.label}
                      </span>
                    </div>

                    <div style={{ fontSize: 13, marginBottom: 6 }}><span style={{ fontWeight: 600 }}>{order.customerName}</span> <span style={{ color: 'var(--text-muted)' }}>{order.customerPhone}</span></div>
                    {order.address && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                        <MapPin size={12} /> {order.address}
                        <button onClick={() => window.open('https://maps.google.com/?q=' + encodeURIComponent(order.address), '_blank')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 11, fontWeight: 600, padding: 0 }}>
                          <Navigation size={11} /> Map
                        </button>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>{formatPrice(order.total)}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#3B82F6', background: '#EFF6FF', padding: '4px 10px', borderRadius: 8 }}>
                        <Clock size={12} /> ETA {estimateETA(order)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => { if (courierPhone(order.courierId)) window.location.href = 'tel:' + courierPhone(order.courierId); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                        <Phone size={13} /> Kuryerga qo'ng'iroq
                      </button>
                      <button onClick={() => { if (order.customerPhone) window.location.href = 'tel:' + order.customerPhone; }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                        <Phone size={13} /> Mijozga qo'ng'iroq
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {tab === 'drivers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {drivers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}><p>Kuryerlar yo'q</p></div>
            ) : (
              drivers.map((d) => (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: d.isOnline ? '#F0FDF4' : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <Bike size={18} style={{ color: d.isOnline ? '#22C55E' : '#9CA3AF' }} />
                    <span style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: d.isOnline ? '#22C55E' : '#9CA3AF', border: '2px solid #fff' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{d.name}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, color: d.isOnline ? '#22C55E' : '#9CA3AF', background: d.isOnline ? '#F0FDF4' : '#F3F4F6' }}>
                        {d.isOnline ? 'Available' : 'Offline'}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.phone} · ⭐ {d.rating}</div>
                  </div>
                  <button onClick={() => { if (d.phone) window.location.href = 'tel:' + d.phone; }} style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Phone size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {delivered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}><p>Yetkazilgan buyurtmalar yo'q</p></div>
            ) : (
              delivered.map((o) => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCheck size={16} style={{ color: '#22C55E' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>#{String(o.id).slice(-4)}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>{o.customerName}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{formatPrice(o.total)}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatTime(o.deliveredAt)}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
