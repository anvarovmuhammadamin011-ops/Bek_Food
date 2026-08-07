import { useState, useEffect, useCallback } from 'react';
import useStore from '../../store/useStore';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { printReceipt } from '../../utils/receipt';
import {
  Check, X, Clock, ChefHat, Bell, Package, ArrowRight, Search,
  Bike, CheckCircle2, PackageCheck, Banknote, CreditCard, Phone,
  Printer, LayoutGrid, List, MapPin, ChevronLeft, User, SlidersHorizontal,
} from 'lucide-react';

const COLUMNS = [
  { key: 'pending', label: 'NEW', icon: Bell, accent: '#EF4444', action: 'accept', actionLabel: 'ACCEPT ORDER' },
  { key: 'confirmed', label: 'ACCEPTED', icon: CheckCircle2, accent: '#F59E0B', action: 'prepare', actionLabel: 'START PREPARING' },
  { key: 'preparing', label: 'PREPARING', icon: ChefHat, accent: '#F97316', action: 'ready', actionLabel: 'MARK AS READY' },
  { key: 'ready', label: 'READY', icon: PackageCheck, accent: '#22C55E', action: null, actionLabel: null },
  { key: 'assigned', label: 'ASSIGNED', icon: Bike, accent: '#3B82F6', action: null, actionLabel: null },
  { key: 'onTheWay', label: 'ON THE WAY', icon: Bike, accent: '#8B5CF6', action: null, actionLabel: null },
  { key: 'delivered', label: 'COMPLETED', icon: Package, accent: '#6B7280', action: null, actionLabel: null },
];

const STATUS_META = {
  pending: { label: 'Yangi', color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
  confirmed: { label: 'Tasdiqlandi', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  preparing: { label: 'Tayyorlanmoqda', color: '#F97316', bg: 'rgba(249,115,22,0.08)' },
  ready: { label: 'Tayyor', color: '#22C55E', bg: 'rgba(34,197,94,0.08)' },
  assigned: { label: 'Kuryer tayinlandi', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
  onTheWay: { label: "Yo'lda", color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' },
  pickedUp: { label: 'Olib ketildi', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' },
  delivered: { label: 'Yetkazildi', color: '#6B7280', bg: 'rgba(107,114,128,0.08)' },
  cancelled: { label: 'Bekor', color: '#9CA3AF', bg: 'rgba(156,163,175,0.08)' },
};

const FILTERS = [
  { key: 'all', label: 'Hammasi' },
  { key: 'pending', label: 'Yangi' },
  { key: 'confirmed', label: 'Tasdiqlandi' },
  { key: 'preparing', label: 'Tayyorlanmoqda' },
  { key: 'ready', label: 'Tayyor' },
  { key: 'assigned', label: 'Kuryer' },
  { key: 'onTheWay', label: "Yo'lda" },
  { key: 'delivered', label: 'Yakunlangan' },
  { key: 'cancelled', label: 'Bekor' },
];

const formatTime = (d) => new Date(d).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
const formatPrice = (n) => Number(n || 0).toLocaleString('uz-UZ') + " so'm";
const shortId = (id) => '#' + String(id).slice(-4);

function Timer({ startTime }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const tick = () => setElapsed(Math.floor((Date.now() - new Date(startTime).getTime()) / 1000));
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [startTime]);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const overdue = elapsed > 900;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: overdue ? 'var(--danger)' : 'var(--primary)', background: overdue ? 'rgba(239,68,68,0.08)' : 'var(--primary-light)', padding: '4px 8px', borderRadius: 8, border: overdue ? '1px solid rgba(239,68,68,0.15)' : '1px solid rgba(249,115,22,0.15)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
      <Clock size={11} />
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      {overdue && <span style={{ fontSize: 10, marginLeft: 2 }}>!</span>}
    </span>
  );
}

function OrderCard({ order, onAction, onView, employees }) {
  const [showCouriers, setShowCouriers] = useState(false);
  const couriers = employees.filter((e) => e.role === 'courier' && e.isOnline);
  const isPickup = order.deliveryType === 'pickup';
  const meta = STATUS_META[order.status] || STATUS_META.pending;

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 14, cursor: 'pointer', transition: 'all .15s', position: 'relative', overflow: 'hidden' }}
      onClick={() => onView(order)}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: meta.color }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{shortId(order.id)}</span>
          {order.priority === 'high' && (
            <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--danger)', background: 'rgba(239,68,68,0.08)', padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.15)' }}>TEZKOR</span>
          )}
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatTime(order.createdAt)}</span>
      </div>

      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: '0 0 2px 0' }}>{order.customerName}</p>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 8px 0' }}>{order.customerPhone}</p>

      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, color: isPickup ? '#8B5CF6' : '#3B82F6', background: isPickup ? 'rgba(139,92,246,0.08)' : 'rgba(59,130,246,0.08)' }}>
          {isPickup ? 'Olib ketish' : 'Yetkazish'}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, color: '#10B981', background: 'rgba(16,185,129,0.08)' }}>
          {order.paymentMethod === 'card' ? <CreditCard size={10} /> : <Banknote size={10} />}
          {order.paymentMethod === 'card' ? 'Karta' : 'Naqd'}
        </span>
      </div>

      <div style={{ marginBottom: 8 }}>
        {(order.items || []).slice(0, 3).map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: 12 }}>
            <span style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: 8 }}>{item.quantity}x {item.food?.name}</span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap' }}>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        {order.items?.length > 3 && <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>+{order.items.length - 3} ta mahsulot</p>}
      </div>

      <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{formatPrice(order.total)}</span>
        {(order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing') && (
          <Timer startTime={order.createdAt} />
        )}
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        {order.status === 'pending' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => onAction(order.id, 'accept')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 0', borderRadius: 'var(--radius-sm)', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: 'var(--success)', color: '#fff', minHeight: 48 }}>
              <Check size={15} /> Qabul qilish
            </button>
            <button onClick={() => onAction(order.id, 'reject')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', color: 'var(--danger)', fontSize: 13, fontWeight: 700, cursor: 'pointer', minHeight: 48, minWidth: 48 }}>
              <X size={15} />
            </button>
          </div>
        )}
        {order.status === 'confirmed' && (
          <button onClick={() => onAction(order.id, 'prepare')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 0', borderRadius: 'var(--radius-sm)', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: 'var(--primary)', color: '#fff', minHeight: 48 }}>
            <ChefHat size={15} /> Tayyorlashni boshlash
          </button>
        )}
        {order.status === 'preparing' && (
          <button onClick={() => onAction(order.id, 'ready')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 0', borderRadius: 'var(--radius-sm)', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: 'var(--success)', color: '#fff', minHeight: 48 }}>
            <PackageCheck size={15} /> Tayyor
          </button>
        )}
        {order.status === 'ready' && isPickup && (
          <button onClick={() => onAction(order.id, 'pickedUp')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 0', borderRadius: 'var(--radius-sm)', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: '#8B5CF6', color: '#fff', minHeight: 48 }}>
            <CheckCircle2 size={15} /> Customer Picked Up
          </button>
        )}
        {order.status === 'ready' && !isPickup && (
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowCouriers(!showCouriers)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 0', borderRadius: 'var(--radius-sm)', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: '#3B82F6', color: '#fff', minHeight: 48 }}>
              <Bike size={15} /> Assign Driver
            </button>
            {showCouriers && (
              <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: 6, padding: 6, zIndex: 10, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-lg)' }}>
                {couriers.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 11, padding: '8px', textAlign: 'center', margin: 0 }}>Kuryerlar yo'q</p>}
                {couriers.map((c) => (
                  <button key={c.id} onClick={() => { onAction(order.id, 'assign', c.id); setShowCouriers(false); }} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px', background: 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer', color: 'var(--text)', fontSize: 13, minHeight: 44 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>{c.name.charAt(0)}</div>
                    <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{c.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{c.rating} reyting</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {['assigned', 'onTheWay', 'pickedUp', 'delivered'].includes(order.status) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '4px 0' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, flex: 1 }}>
              {order.status === 'assigned' && 'Kuryer kutilmoqda'}
              {order.status === 'onTheWay' && "Kuryer yo'lda"}
              {order.status === 'pickedUp' && 'Yetkazilmoqda'}
              {order.status === 'delivered' && 'Yetkazildi ✓'}
            </p>
            {order.status !== 'delivered' && order.courierId && (() => {
              const c = employees.find((e) => e.id === order.courierId);
              return c ? (
                <button onClick={() => { if (c.phone) window.location.href = 'tel:' + c.phone; }} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600, cursor: 'pointer', minHeight: 36 }}>
                  <Bike size={12} /> {c.name}
                </button>
              ) : null;})()}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderDetail({ order, onClose, onAction, employees, settings }) {
  const courier = employees.find((e) => e.id === order.courierId);
  const isPickup = order.deliveryType === 'pickup';
  const meta = STATUS_META[order.status] || STATUS_META.pending;

  const timeline = [
    { key: 'received', label: 'Buyurtma qabul qilindi', done: true, time: order.createdAt },
    { key: 'accepted', label: 'Qabul qilindi', done: order.acceptedAt, time: order.acceptedAt },
    { key: 'preparing', label: 'Tayyorlanmoqda', done: order.preparingAt, time: order.preparingAt },
    { key: 'ready', label: 'Tayyor', done: order.readyAt, time: order.readyAt },
    { key: 'delivery', label: 'Yetkazishga chiqdi', done: order.pickedUpAt || order.courierAcceptedAt, time: order.pickedUpAt || order.courierAcceptedAt },
    { key: 'delivered', label: 'Yetkazildi', done: order.status === 'delivered', time: order.deliveredAt },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--bg)', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <style>{`
        .od-header{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border);background:var(--surface);position:sticky;top:0;z-index:10}
        .od-back{width:44px;height:44px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text);flex-shrink:0}
        .od-section{background:var(--surface);border-radius:var(--radius);padding:16px;margin-bottom:12px;border:1px solid var(--border)}
        .od-section h3{font-size:13px;font-weight:700;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:0.04em;color:var(--text-muted)}
        .od-action-bar{position:sticky;bottom:0;background:var(--surface);border-top:1px solid var(--border);padding:12px 16px;display:flex;gap:8px;flex-wrap:wrap}
        .od-action-primary{flex:1;min-height:52px;display:flex;align-items:center;justify-content:center;gap:8px;border-radius:var(--radius-sm);border:none;font-size:14px;font-weight:700;cursor:pointer}
        .od-action-secondary{display:flex;align-items:center;justify-content:center;gap:8px;padding:0 20px;min-height:52px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface);color:var(--text-secondary);font-size:14px;font-weight:600;cursor:pointer}
        @media(min-width:768px){
          .od-body{max-width:700px;margin:0 auto;padding:20px 24px}
        }
        @media(max-width:767px){
          .od-body{padding:12px 16px 100px}
        }
      `}</style>

      <div className="od-header">
        <button className="od-back" onClick={onClose}><ChevronLeft size={20} /></button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Order {shortId(order.id)}</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{new Date(order.createdAt).toLocaleString('uz-UZ')}</p>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, color: meta.color, background: meta.bg, whiteSpace: 'nowrap' }}>
          {meta.label}
        </span>
      </div>

      <div className="od-body">
        <div className="od-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><User size={22} style={{ color: 'var(--primary)' }} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{order.customerName}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{order.customerPhone}</p>
            </div>
            <button onClick={() => { if (order.customerPhone) window.location.href = 'tel:' + order.customerPhone; }}
              style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
              <Phone size={16} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, color: isPickup ? '#8B5CF6' : '#3B82F6', background: isPickup ? 'rgba(139,92,246,0.08)' : 'rgba(59,130,246,0.08)' }}>
              {isPickup ? 'Olib ketish' : 'Yetkazish'}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, color: '#10B981', background: 'rgba(16,185,129,0.08)' }}>
              {order.paymentMethod === 'card' ? <CreditCard size={11} /> : <Banknote size={11} />}
              {order.paymentMethod === 'card' ? 'Karta' : 'Naqd'}
            </span>
          </div>
          {!isPickup && order.address && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.address}</span>
              <button onClick={() => window.open('https://maps.google.com/?q=' + encodeURIComponent(order.address), '_blank')}
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600, color: '#fff', background: 'var(--primary)', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', minHeight: 32 }}>
                <MapPin size={11} /> Xaritada
              </button>
            </div>
          )}
        </div>

        <div className="od-section">
          <h3>Mahsulotlar</h3>
          {order.items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13, gap: 8 }}>
              <span style={{ color: 'var(--text-secondary)', flex: 1, minWidth: 0 }}>{item.quantity} × {item.food?.name}</span>
              <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 800 }}>
            <span>JAMI</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          {order.notes && <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '8px 0 0 0', padding: '8px 10px', borderRadius: 8, background: 'var(--bg)' }}>📝 {order.notes}</p>}
        </div>

        <div className="od-section">
          <h3>Buyurtma tarixi</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {timeline.map((step, i) => (
              <div key={step.key} style={{ display: 'flex', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: step.done ? '#22C55E' : 'var(--surface-active)', color: step.done ? '#fff' : 'var(--text-dim)', flexShrink: 0 }}>
                    {step.done ? <Check size={12} /> : <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border-strong)', display: 'block' }} />}
                  </div>
                  {i < timeline.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 16, background: step.done ? '#22C55E' : 'var(--border)' }} />}
                </div>
                <div style={{ paddingBottom: 12, flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: step.done ? 600 : 500, color: step.done ? 'var(--text)' : 'var(--text-muted)', margin: 0 }}>{step.label}</p>
                  {step.time && <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>{new Date(step.time).toLocaleString('uz-UZ')}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {courier && (
          <div className="od-section">
            <h3>Kuryer</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#3B82F6', flexShrink: 0 }}>{courier.name.charAt(0)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{courier.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{courier.phone}</p>
              </div>
              <button onClick={() => { if (courier.phone) window.location.href = 'tel:' + courier.phone; }}
                style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <Phone size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="od-action-bar">
        {order.status === 'pending' && (
          <>
            <button onClick={() => onAction(order.id, 'accept')} className="od-action-primary" style={{ background: 'var(--success)', color: '#fff' }}>
              <Check size={18} /> ACCEPT ORDER
            </button>
            <button onClick={() => onAction(order.id, 'reject')} className="od-action-secondary" style={{ color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.06)' }}>
              <X size={18} />
            </button>
          </>
        )}
        {order.status === 'confirmed' && (
          <button onClick={() => onAction(order.id, 'prepare')} className="od-action-primary" style={{ background: 'var(--primary)', color: '#fff' }}>
            <ChefHat size={18} /> START PREPARING
          </button>
        )}
        {order.status === 'preparing' && (
          <button onClick={() => onAction(order.id, 'ready')} className="od-action-primary" style={{ background: 'var(--success)', color: '#fff' }}>
            <PackageCheck size={18} /> MARK AS READY
          </button>
        )}
        {order.status === 'ready' && !isPickup && (
          <button onClick={onClose} className="od-action-primary" style={{ background: '#3B82F6', color: '#fff' }}>
            <Bike size={18} /> ASSIGN DRIVER
          </button>
        )}
        {order.status === 'ready' && isPickup && (
          <button onClick={() => onAction(order.id, 'pickedUp')} className="od-action-primary" style={{ background: '#8B5CF6', color: '#fff' }}>
            <CheckCircle2 size={18} /> MARK PICKED UP
          </button>
        )}
        {['assigned', 'onTheWay', 'pickedUp', 'delivered'].includes(order.status) && (
          <button onClick={onClose} className="od-action-primary" style={{ background: 'var(--surface-active)', color: 'var(--text)' }}>
            Yopish
          </button>
        )}
        <button onClick={() => printReceipt(order, settings)} className="od-action-secondary">
          <Printer size={16} /> Chek
        </button>
      </div>
    </div>
  );
}

function FilterSheet({ open, onClose, active, onApply }) {
  const [temp, setTemp] = useState(active);
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 110 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--surface)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', padding: '16px 16px calc(16px + env(safe-area-inset-bottom, 0px))', maxHeight: '70vh', overflowY: 'auto', animation: 'slideUp .3s var(--ease)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Filtrlash</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, minWidth: 36, minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {FILTERS.map((f) => (
            <button key={f.key} onClick={() => { onApply(f.key); onClose(); }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', background: temp === f.key ? 'var(--primary-light)' : 'transparent', color: temp === f.key ? 'var(--primary)' : 'var(--text)', fontSize: 15, fontWeight: temp === f.key ? 700 : 500, minHeight: 52, textAlign: 'left' }}>
              <span>{f.label}</span>
              {temp === f.key && <Check size={18} style={{ color: 'var(--primary)' }} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SellerOrders() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    orders, updateOrderStatus, acceptOrder, rejectOrder, startPreparing, readyOrder, assignCourier, markPickedUp,
    employees, settings, startOrderTimer, activeOrderTimers, isAppLoading,
  } = useStore();

  const [viewMode, setViewMode] = useState('kanban');
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    orders.forEach((o) => {
      if ((o.status === 'preparing' || o.status === 'confirmed') && !activeOrderTimers[o.id]) startOrderTimer(o.id);
    });
  }, [orders, activeOrderTimers, startOrderTimer]);

  const handleAction = useCallback((id, action, extra) => {
    switch (action) {
      case 'accept': acceptOrder(id); break;
      case 'reject': rejectOrder(id); break;
      case 'prepare': startPreparing(id); break;
      case 'ready': readyOrder(id); break;
      case 'assign': assignCourier(id, extra); break;
      case 'pickedUp': markPickedUp(id); break;
      default: updateOrderStatus(id, action);
    }
  }, [acceptOrder, rejectOrder, startPreparing, readyOrder, assignCourier, markPickedUp, updateOrderStatus]);

  let filteredOrders = orders;
  if (filterStatus !== 'all') filteredOrders = orders.filter((o) => o.status === filterStatus);
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    filteredOrders = filteredOrders.filter((o) =>
      String(o.id).includes(q) || (o.customerName || '').toLowerCase().includes(q) ||
      (o.customerPhone || '').replace(/\s+/g, '').includes(q.replace(/\s+/g, ''))
    );
  }

  const statusCounts = {};
  FILTERS.forEach((f) => {
    statusCounts[f.key] = f.key === 'all' ? orders.length : orders.filter((o) => o.status === f.key).length;
  });

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg)' }}>
      <style>{`
        .so-sticky{position:sticky;top:0;z-index:50;background:var(--surface);border-bottom:1px solid var(--border);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px)}
        .so-tabs{display:flex;gap:0;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding:0 12px}
        .so-tabs::-webkit-scrollbar{display:none}
        .so-tab{display:flex;align-items:center;gap:4px;padding:12px 14px;border:none;cursor:pointer;font-size:13px;font-weight:600;white-space:nowrap;background:transparent;color:var(--text-muted);border-bottom:2px solid transparent;transition:all .15s;min-height:44px}
        .so-tab.active{color:var(--primary);border-bottom-color:var(--primary)}
        .so-tab-count{min-width:18px;height:18px;border-radius:9px;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 5px}
        @media(min-width:768px){
          .so-sticky-top{padding:12px 20px;display:flex;align-items:center;justify-content:space-between}
          .so-sticky-bottom{padding:0 20px 10px}
          .so-search{max-width:300px}
        }
        @media(max-width:767px){
          .so-sticky-top{padding:10px 14px;display:flex;align-items:center;justify-content:space-between}
          .so-sticky-bottom{padding:0 0 0}
          .so-search-wrap{padding:0 14px 0}
          .so-filter-btn{display:flex!important}
          .so-view-toggle{display:none!important}
        }
      `}</style>

      <div className="so-sticky">
        <div className="so-sticky-top">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Buyurtmalar</h1>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filteredOrders.length} ta</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button className="so-filter-btn" onClick={() => setShowFilters(true)}
              style={{ display: 'none', alignItems: 'center', gap: 4, padding: '8px 12px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', minHeight: 40 }}>
              <SlidersHorizontal size={14} />
              {filterStatus !== 'all' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />}
            </button>
            <div className="so-view-toggle" style={{ display: 'flex', gap: 2, background: 'var(--surface-active)', borderRadius: 10, padding: 3 }}>
              <button onClick={() => setViewMode('kanban')} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', background: viewMode === 'kanban' ? 'var(--primary)' : 'transparent', color: viewMode === 'kanban' ? '#fff' : 'var(--text-muted)', minHeight: 32 }}>
                <LayoutGrid size={13} />
              </button>
              <button onClick={() => setViewMode('list')} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', background: viewMode === 'list' ? 'var(--primary)' : 'transparent', color: viewMode === 'list' ? '#fff' : 'var(--text-muted)', minHeight: 32 }}>
                <List size={13} />
              </button>
            </div>
          </div>
        </div>

        <div className="so-sticky-bottom">
          <div className="so-tabs">
            {FILTERS.map((f) => (
              <button key={f.key} className={`so-tab ${filterStatus === f.key ? 'active' : ''}`} onClick={() => setFilterStatus(f.key)}>
                {f.label}
                {statusCounts[f.key] > 0 && (
                  <span className="so-tab-count" style={{ background: filterStatus === f.key ? 'var(--primary)' : 'var(--surface-active)', color: filterStatus === f.key ? '#fff' : 'var(--text-muted)' }}>
                    {statusCounts[f.key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="so-search-wrap" style={{ padding: '12px 16px 0' }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input style={{ width: '100%', padding: '11px 14px 11px 40px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, outline: 'none', boxSizing: 'border-box', minHeight: 44 }} placeholder="Buyurtma ID, mijoz yoki telefon..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div style={{ padding: '12px 16px 80px' }}>
        {isAppLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {[1,2,3].map((i) => <div key={i} className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-sm)' }} />)}
          </div>
        ) : viewMode === 'kanban' && !isMobile ? (
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16 }}>
            {COLUMNS.map((col) => {
              const colOrders = filteredOrders.filter((o) => o.status === col.key);
              const Icon = col.icon;
              return (
                <div key={col.key} style={{ flex: '0 0 300px', minWidth: 300, display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 220px)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', background: 'var(--surface)', border: '1px solid var(--border)', borderBottom: `2px solid ${col.accent}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.accent }} />
                      <Icon size={14} style={{ color: col.accent }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{col.label}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: `${col.accent}12`, color: col.accent }}>{colOrders.length}</span>
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {colOrders.length === 0 ? (
                      <div style={{ padding: '36px 12px', textAlign: 'center', background: 'var(--surface)', borderRadius: '0 0 var(--radius-sm) var(--radius-sm)', border: '1px solid var(--border)', borderTop: 'none' }}>
                        <Package size={24} style={{ color: 'var(--border-strong)', margin: '0 auto 8px', display: 'block' }} />
                        <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: 0 }}>Bo'sh</p>
                      </div>
                    ) : (
                      colOrders.map((order) => (
                        <OrderCard key={order.id} order={order} onAction={handleAction} onView={setSelectedOrder} employees={employees} />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--surface-active)', border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Package size={28} style={{ color: 'var(--text-muted)' }} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 4px 0' }}>Buyurtmalar topilmadi</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Filtrlarni o'zgartirib ko'ring</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} onAction={handleAction} onView={setSelectedOrder} employees={employees} />
            ))}
          </div>
        )}
      </div>

      <FilterSheet open={showFilters} onClose={() => setShowFilters(false)} active={filterStatus} onApply={setFilterStatus} />

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onAction={(action, extra) => { handleAction(selectedOrder.id, action, extra); if (['reject', 'accept'].includes(action)) setSelectedOrder(null); }}
          employees={employees}
          settings={settings}
        />
      )}
    </div>
  );
}
