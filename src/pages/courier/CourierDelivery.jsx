import React, { useState } from 'react';
import useStore from '../../store/useStore';
import {
  MapPin,
  Phone,
  Navigation,
  PackageCheck,
  CheckCheck,
  Bike,
  BellRing,
  Banknote,
  CreditCard,
  MessageSquare,
} from 'lucide-react';

const s = {
  page: { padding: '32px', background: 'var(--bg)', minHeight: '100vh' },
  container: { maxWidth: '620px', margin: '0 auto' },
  header: { marginBottom: '24px' },
  title: { fontSize: '28px', fontWeight: '800', color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '22px', marginBottom: '16px' },
  cardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: 'var(--text)', margin: 0 },
  statusChip: (color, bg) => ({ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 999, fontSize: '11px', fontWeight: '700', color, background: bg }),
  row: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' },
  label: { fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 4px 0' },
  infoBox: { background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: '12px' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' },
  itemRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '2px 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '800', color: 'var(--text)', padding: '10px 0', borderTop: '1px solid var(--border)' },
  btn: (bg, color, flex = '1') => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '13px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
    fontSize: 14, fontWeight: 700, background: bg, color, flex, fontFamily: 'inherit',
  }),
  outlineBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '13px 0', borderRadius: 12, border: '1px solid var(--border-strong)',
    background: 'var(--surface)', color: 'var(--text-secondary)', cursor: 'pointer',
    fontSize: 13, fontWeight: 600, flex: 1, fontFamily: 'inherit',
  },
  empty: { background: 'var(--surface)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius)', padding: '48px 20px', textAlign: 'center' },
};

const openMaps = (address) => {
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || '')}`, '_blank');
};

const STATUS_INFO = {
  assigned: { label: 'Kuryer tayinlandi — qabul qiling', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  onTheWay: { label: 'Qabul qilindi — olib ketish kutilmoqda', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  pickedUp: { label: 'Olib ketildi — yetkazilmoqda', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
};

export default function CourierDelivery() {
  const { user, orders, courierAcceptOrder, courierPickedUp, courierDelivered } = useStore();
  const [acceptedId, setAcceptedId] = useState(null);

  const courierId = user?.id;
  const myAssigned = orders.filter((o) => o.status === 'assigned' && o.courierId === courierId);
  const activeOrder = orders.find((o) => o.courierId === courierId && ['assigned', 'onTheWay', 'pickedUp'].includes(o.status)) || null;

  const handleAccept = (order) => {
    const ok = courierAcceptOrder(order.id);
    if (ok) setAcceptedId(order.id);
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <h1 style={s.title}>Aktiv yetkazish</h1>
          <p style={s.subtitle}>Har bir kuryerga bir vaqtning o'zida bitta aktiv buyurtma</p>
        </div>

        {activeOrder ? (
          <div style={{ ...s.card, borderColor: 'rgba(34,197,94,0.35)' }}>
            <div style={s.cardHeader}>
              <h2 style={s.cardTitle}>#{String(activeOrder.id).slice(-4)}</h2>
              <span style={s.statusChip(STATUS_INFO[activeOrder.status]?.color || 'var(--text-muted)', STATUS_INFO[activeOrder.status]?.bg || 'var(--surface-active)')}>
                {STATUS_INFO[activeOrder.status]?.label || activeOrder.status}
              </span>
            </div>

            <p style={s.label}>Mijoz</p>
            <div style={s.infoBox}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{activeOrder.customerName}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>{activeOrder.customerPhone}</p>
                </div>
                <button onClick={() => { if (activeOrder.customerPhone) window.location.href = 'tel:' + activeOrder.customerPhone; }} style={{ ...s.btn('#F0FDF4', 'var(--success)', 'auto'), padding: '10px 16px' }}>
                  <Phone size={15} /> Qo'ng'iroq
                </button>
              </div>
            </div>

            <p style={s.label}>Manzil</p>
            <div style={s.infoBox}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1, lineHeight: 1.45 }}>
                  {activeOrder.address || 'Olib ketish (restorandan)'}
                </span>
                <button onClick={() => openMaps(activeOrder.address)} style={{ ...s.btn('var(--primary-light)', 'var(--primary)', 'auto'), padding: '10px 14px' }}>
                  <Navigation size={15} /> Google Maps
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: '12px' }}>
              <span style={s.statusChip(activeOrder.paymentMethod === 'card' ? '#0EA5E9' : '#10B981', 'rgba(16,185,129,0.08)')}>
                {activeOrder.paymentMethod === 'card' ? <CreditCard size={11} /> : <Banknote size={11} />}
                {activeOrder.paymentMethod === 'card' ? 'Karta' : 'Naqd pul'}
              </span>
              {activeOrder.deliveryType === 'pickup' && (
                <span style={s.statusChip('#8B5CF6', 'rgba(139,92,246,0.08)')}>Olib ketish</span>
              )}
            </div>

            <div style={s.itemsList}>
              {(activeOrder.items || []).map((item, i) => (
                <div key={i} style={s.itemRow}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.quantity}x {item.food?.name}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>{(item.price * item.quantity).toLocaleString('uz-UZ')} so'm</span>
                </div>
              ))}
            </div>
            <div style={s.totalRow}>
              <span>Jami</span>
              <span>{(activeOrder.total || 0).toLocaleString('uz-UZ')} so'm</span>
            </div>

            {(activeOrder.notes || activeOrder.notes === '') && (
              <div style={{ ...s.infoBox, marginTop: 12, borderLeft: '3px solid var(--warning)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <MessageSquare size={14} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    {activeOrder.notes || 'Izoh yo\'q'}
                  </span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              {activeOrder.status === 'assigned' && (
                <button style={s.btn('var(--success)', '#fff')} onClick={() => handleAccept(activeOrder)}>
                  <CheckCheck size={16} /> Qabul qilish
                </button>
              )}
              {activeOrder.status === 'onTheWay' && (
                <button style={s.btn('var(--primary)', '#fff')} onClick={() => courierPickedUp(activeOrder.id)}>
                  <PackageCheck size={16} /> Buyurtmani oldim
                </button>
              )}
              {activeOrder.status === 'pickedUp' && (
                <button style={s.btn('var(--success)', '#fff')} onClick={() => courierDelivered(activeOrder.id)}>
                  <CheckCheck size={16} /> Yetkazib berdim
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={s.empty}>
            <div style={{ width: 68, height: 68, borderRadius: 20, background: 'var(--surface-active)', border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Bike size={30} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 4px 0' }}>Aktiv buyurtma yo'q</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Buyurtma tayinlanganda shu yerda ko'rinadi</p>
          </div>
        )}

        {!activeOrder && myAssigned.length === 0 && (
          <div style={{ ...s.empty, marginTop: 16 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🔔</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 4px 0' }}>Yangi buyurtmalar yo'q</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
              Order Manager buyurtmani Ready qilgach va sizni tayinlagach shu yerda paydo bo'ladi
            </p>
          </div>
        )}

        {!activeOrder && myAssigned.map((order) => (
          <div key={order.id} style={s.card}>
            <div style={s.cardHeader}>
              <h2 style={s.cardTitle}>#{String(order.id).slice(-4)} — sizga tayinlandi</h2>
              <span style={s.statusChip('#F59E0B', 'rgba(245,158,11,0.1)')}>
                <BellRing size={11} /> Qabul qilinmagan
              </span>
            </div>
            <div style={s.row}>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{order.customerName}</span>
              <span>{order.customerPhone}</span>
            </div>
            <div style={s.row}>
              <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span>{order.address || 'Olib ketish'}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button style={s.btn('var(--success)', '#fff')} onClick={() => handleAccept(order)}>
                <CheckCheck size={15} /> Qabul qilish
              </button>
              <button style={s.outlineBtn} onClick={() => { if (order.customerPhone) window.location.href = 'tel:' + order.customerPhone; }}>
                <Phone size={14} /> Qo'ng'iroq
              </button>
            </div>
            {acceptedId === order.id && (
              <p style={{ fontSize: 12, color: 'var(--success)', marginTop: 10, fontWeight: 600 }}>Qabul qilindi! Buyurtmani olib ketish uchun restoranga boring.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
