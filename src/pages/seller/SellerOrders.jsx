import { useState, useEffect, useCallback } from 'react';
import useStore from '../../store/useStore';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { printReceipt } from '../../utils/receipt';
import {
  Check, X, Clock, ChefHat, Bell, Package, ArrowRight, Search,
  Bike, CheckCircle2, PackageCheck, Banknote, CreditCard, Phone,
  Printer, LayoutGrid, List, MapPin, ChevronLeft, User,
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
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: overdue ? 'var(--danger)' : 'var(--primary)', background: overdue ? 'rgba(239,68,68,0.08)' : 'var(--primary-light)', padding: '4px 10px', borderRadius: 8, border: overdue ? '1px solid rgba(239,68,68,0.15)' : '1px solid rgba(249,115,22,0.15)', fontVariantNumeric: 'tabular-nums' }}>
      <Clock size={12} />
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      {overdue && <span style={{ fontSize: 10, marginLeft: 4 }}>Kechikdi!</span>}
    </span>
  );
}

function OrderCard({ order, onAction, onView, employees }) {
  const [showCouriers, setShowCouriers] = useState(false);
  const couriers = employees.filter((e) => e.role === 'courier' && e.isOnline);
  const isPickup = order.deliveryType === 'pickup';
  const meta = STATUS_META[order.status] || STATUS_META.pending;
  const col = COLUMNS.find((c) => c.key === order.status);

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'all .15s' }}
      onClick={() => onView(order)}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{shortId(order.id)}</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatTime(order.createdAt)}</span>
        </div>
        {order.priority === 'high' && (
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--danger)', background: 'rgba(239,68,68,0.08)', padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.15)' }}>Tezkor</span>
        )}
      </div>

      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', margin: '0 0 2px 0' }}>{order.customerName}</p>
      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 8px 0' }}>{order.customerPhone}</p>

      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 999, fontSize: 10, fontWeight: 600, color: isPickup ? '#8B5CF6' : '#3B82F6', background: isPickup ? 'rgba(139,92,246,0.08)' : 'rgba(59,130,246,0.08)' }}>
          {isPickup ? 'Olib ketish' : 'Yetkazish'}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 999, fontSize: 10, fontWeight: 600, color: '#10B981', background: 'rgba(16,185,129,0.08)' }}>
          {order.paymentMethod === 'card' ? <CreditCard size={10} /> : <Banknote size={10} />}
          {order.paymentMethod === 'card' ? 'Karta' : 'Naqd'}
        </span>
      </div>

      <div style={{ marginBottom: 8 }}>
        {order.items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', fontSize: 12 }}>
            <span style={{ color: 'var(--text-muted)' }}>{item.quantity}x {item.food?.name}</span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{formatPrice(order.total)}</span>
        {(order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing') && (
          <Timer startTime={order.createdAt} />
        )}
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        {order.status === 'pending' && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => onAction(order.id, 'accept')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px 0', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: 'var(--success)', color: '#fff' }}>
              <Check size={14} /> Qabul qilish
            </button>
            <button onClick={() => onAction(order.id, 'reject')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '11px 14px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', color: 'var(--danger)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              <X size={14} />
            </button>
          </div>
        )}
        {order.status === 'confirmed' && (
          <button onClick={() => onAction(order.id, 'prepare')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px 0', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: 'var(--primary)', color: '#fff' }}>
            <ChefHat size={14} /> Tayyorlashni boshlash
          </button>
        )}
        {order.status === 'preparing' && (
          <button onClick={() => onAction(order.id, 'ready')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px 0', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: 'var(--success)', color: '#fff' }}>
            <PackageCheck size={14} /> Tayyor
          </button>
        )}
        {order.status === 'ready' && isPickup && (
          <button onClick={() => onAction(order.id, 'pickedUp')} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px 0', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: '#8B5CF6', color: '#fff' }}>
            <CheckCircle2 size={14} /> Customer Picked Up
          </button>
        )}
        {order.status === 'ready' && !isPickup && (
          <div style={{ position: 'relative', display: 'flex', gap: 8 }}>
            <button onClick={() => setShowCouriers(!showCouriers)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px 0', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', background: '#3B82F6', color: '#fff' }}>
              <Bike size={14} /> Assign Driver <ArrowRight size={14} />
            </button>
            {showCouriers && (
              <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: 6, padding: 6, zIndex: 10, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, boxShadow: 'var(--shadow-lg)' }}>
                {couriers.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 11, padding: '6px 8px', textAlign: 'center', margin: 0 }}>Kuryerlar yo'q</p>}
                {couriers.map((c) => (
                  <button key={c.id} onClick={() => { onAction(order.id, 'assign', c.id); setShowCouriers(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 10px', background: 'transparent', border: 'none', borderRadius: 8, cursor: 'pointer', color: 'var(--text)', fontSize: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--primary)' }}>{c.name.charAt(0)}</div>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, margin: 0 }}>{c.name}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0 }}>{c.rating} reyting</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {['assigned', 'onTheWay', 'pickedUp', 'delivered'].includes(order.status) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, flex: 1 }}>
              {order.status === 'assigned' && 'Kuryer kutilmoqda'}
              {order.status === 'onTheWay' && 'Kuryer yo\'lda'}
              {order.status === 'pickedUp' && 'Yetkazilmoqda'}
              {order.status === 'delivered' && 'Yetkazildi ✓'}
            </p>
            {order.status !== 'delivered' && order.courierId && (() => {
              const c = employees.find((e) => e.id === order.courierId);
              return c ? (
                <button onClick={() => { if (c.phone) window.location.href = 'tel:' + c.phone; }} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                  <Bike size={13} /> {c.name}
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
  const timeline = [
    { key: 'received', label: 'Order received', done: true, time: order.createdAt },
    { key: 'accepted', label: 'Accepted', done: order.acceptedAt, time: order.acceptedAt },
    { key: 'preparing', label: 'Preparing', done: order.preparingAt, time: order.preparingAt },
    { key: 'ready', label: 'Ready', done: order.readyAt, time: order.readyAt },
    { key: 'delivery', label: 'Out for delivery', done: order.pickedUpAt || order.courierAcceptedAt, time: order.pickedUpAt || order.courierAcceptedAt },
    { key: 'delivered', label: 'Delivered', done: order.status === 'delivered', time: order.deliveredAt },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--bg)', overflowY: 'auto' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={onClose} style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)' }}>
            <ChevronLeft size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Order {shortId(order.id)}</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{new Date(order.createdAt).toLocaleString('uz-UZ')}</p>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, color: STATUS_META[order.status]?.color || '#6B7280', background: STATUS_META[order.status]?.bg || 'rgba(107,114,128,0.08)' }}>
            {STATUS_META[order.status]?.label || order.status}
          </span>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 20, marginBottom: 16, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} style={{ color: 'var(--primary)' }} /></div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{order.customerName}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{order.customerPhone}</p>
            </div>
            <button onClick={() => { if (order.customerPhone) window.location.href = 'tel:' + order.customerPhone; }} style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Phone size={16} /></button>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600, color: isPickup ? '#8B5CF6' : '#3B82F6', background: isPickup ? 'rgba(139,92,246,0.08)' : 'rgba(59,130,246,0.08)' }}>
              {isPickup ? 'Olib ketish' : '🚚 Delivery'}
            </span>
            {!isPickup && order.address && (
              <button onClick={() => window.open('https://maps.google.com/?q=' + encodeURIComponent(order.address), '_blank')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-light)', border: 'none', cursor: 'pointer' }}>
                <MapPin size={11} /> {order.address}
              </button>
            )}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600, color: '#10B981', background: 'rgba(16,185,129,0.08)' }}>
              {order.paymentMethod === 'card' ? <CreditCard size={11} /> : <Banknote size={11} />}
              {order.paymentMethod === 'card' ? 'Karta' : 'Naqd'} · Paid
            </span>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 20, marginBottom: 16, border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px 0' }}>Products</h3>
          {order.items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
              <span style={{ color: 'var(--text-secondary)' }}>{item.quantity} × {item.food?.name}</span>
              <span style={{ fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800 }}>
            <span>TOTAL</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          {order.notes && <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '8px 0 0 0' }}>📝 {order.notes}</p>}
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 20, marginBottom: 16, border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 14px 0' }}>Order Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {timeline.map((step, i) => (
              <div key={step.key} style={{ display: 'flex', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: step.done ? '#22C55E' : 'var(--surface-active)', color: step.done ? '#fff' : 'var(--text-dim)', flexShrink: 0 }}>
                    {step.done ? <Check size={12} /> : <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border-strong)', display: 'block' }} />}
                  </div>
                  {i < timeline.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 20, background: step.done ? '#22C55E' : 'var(--border)' }} />}
                </div>
                <div style={{ paddingBottom: 14, flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: step.done ? 600 : 500, color: step.done ? 'var(--text)' : 'var(--text-muted)', margin: 0 }}>{step.label}</p>
                  {step.time && <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>{new Date(step.time).toLocaleString('uz-UZ')}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {courier && (
          <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 20, marginBottom: 16, border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px 0' }}>Driver</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#3B82F6' }}>{courier.name.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{courier.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{courier.phone}</p>
              </div>
              <button onClick={() => { if (courier.phone) window.location.href = 'tel:' + courier.phone; }} style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Phone size={16} /></button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingBottom: 32 }}>
          {order.status === 'pending' && (
            <>
              <button onClick={() => onAction(order.id, 'accept')} style={{ flex: 1, minWidth: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '14px 0', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', background: 'var(--success)', color: '#fff' }}>
                <Check size={16} /> ACCEPT ORDER
              </button>
              <button onClick={() => onAction(order.id, 'reject')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px 20px', borderRadius: 12, border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.06)', color: 'var(--danger)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </>
          )}
          {order.status === 'confirmed' && (
            <button onClick={() => onAction(order.id, 'prepare')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '14px 0', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', background: 'var(--primary)', color: '#fff' }}>
              <ChefHat size={16} /> START PREPARING
            </button>
          )}
          {order.status === 'preparing' && (
            <button onClick={() => onAction(order.id, 'ready')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '14px 0', borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', background: 'var(--success)', color: '#fff' }}>
              <PackageCheck size={16} /> MARK AS READY
            </button>
          )}
          {order.status === 'ready' && (
            <button onClick={onClose} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '14px 0', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Buyurtmani yoping
            </button>
          )}
          <button onClick={() => printReceipt(order, settings)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '14px 20px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            <Printer size={16} /> Chek
          </button>
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
    employees, settings, startOrderTimer, activeOrderTimers,
  } = useStore();

  const [viewMode, setViewMode] = useState('kanban');
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const filters = [
    { key: 'all', label: 'Hammasi' },
    { key: 'pending', label: 'Yangi' },
    { key: 'confirmed', label: 'Tasdiqlandi' },
    { key: 'preparing', label: 'Tayyorlanmoqda' },
    { key: 'ready', label: 'Tayyor' },
    { key: 'assigned', label: 'Kuryer tayinlandi' },
    { key: 'onTheWay', label: 'Yetkazish' },
    { key: 'delivered', label: 'Yakunlangan' },
    { key: 'cancelled', label: 'Bekor' },
  ];

  let filteredOrders = orders;
  if (filterStatus !== 'all') filteredOrders = orders.filter((o) => o.status === filterStatus);
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    filteredOrders = filteredOrders.filter((o) =>
      String(o.id).includes(q) || (o.customerName || '').toLowerCase().includes(q) ||
      (o.customerPhone || '').replace(/\s+/g, '').includes(q.replace(/\s+/g, ''))
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(24px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Buyurtmalar</h1>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{filteredOrders.length} ta</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'var(--surface)', borderRadius: 10, padding: 3, border: '1px solid var(--border)' }}>
            <button onClick={() => setViewMode('kanban')} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', background: viewMode === 'kanban' ? 'var(--primary)' : 'transparent', color: viewMode === 'kanban' ? '#fff' : 'var(--text-muted)' }}>
              <LayoutGrid size={13} />
            </button>
            <button onClick={() => setViewMode('list')} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', background: viewMode === 'list' ? 'var(--primary)' : 'transparent', color: viewMode === 'list' ? '#fff' : 'var(--text-muted)' }}>
              <List size={13} />
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px 12px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200, maxWidth: 320 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input style={{ width: '100%', padding: '9px 14px 9px 36px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} placeholder="ID, telefon yoki mijoz..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
            {filters.map((f) => (
              <button key={f.key} onClick={() => setFilterStatus(f.key)} style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', background: filterStatus === f.key ? 'var(--primary-light)' : 'var(--surface)', color: filterStatus === f.key ? 'var(--primary)' : 'var(--text-muted)', boxShadow: filterStatus === f.key ? '0 0 0 1.5px var(--primary)' : 'var(--shadow-sm)' }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 16px 60px' }}>
        {viewMode === 'kanban' ? (
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16 }}>
            {COLUMNS.map((col) => {
              const colOrders = filteredOrders.filter((o) => o.status === col.key);
              const Icon = col.icon;
              return (
                <div key={col.key} style={{ flex: '0 0 280px', minWidth: 280, display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 200px)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '12px 12px 0 0', background: 'var(--surface)', border: '1px solid var(--border)', borderBottom: `2px solid ${col.accent}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.accent }} />
                      <Icon size={13} style={{ color: col.accent }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{col.label}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: `${col.accent}12`, color: col.accent }}>{colOrders.length}</span>
                  </div>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {colOrders.length === 0 ? (
                      <div style={{ padding: '32px 12px', textAlign: 'center', background: 'var(--surface)', borderRadius: '0 0 12px 12px', border: '1px solid var(--border)', borderTop: 'none' }}>
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
        ) : (
          <div style={{ overflowX: 'auto', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 860, padding: '10px 14px', borderBottom: '1px solid var(--border-strong)', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span style={{ flex: '0 0 70px' }}>ID</span>
              <span style={{ flex: '0 0 55px' }}>Vaqt</span>
              <span style={{ flex: 1.2 }}>Mijoz</span>
              <span style={{ flex: '0 0 80px', textAlign: 'center' }}>To'lov</span>
              <span style={{ flex: '0 0 90px', textAlign: 'right' }}>Summa</span>
              <span style={{ flex: '0 0 110px', textAlign: 'center' }}>Holat</span>
              <span style={{ flex: '0 0 80px', textAlign: 'center' }}>Amal</span>
            </div>
            {filteredOrders.length === 0 ? (
              <div style={{ padding: '48px 16px', textAlign: 'center' }}><Package size={32} style={{ color: 'var(--border-strong)' }} /><p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Buyurtmalar yo'q</p></div>
            ) : (
              [...filteredOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order) => {
                const st = STATUS_META[order.status] || STATUS_META.pending;
                return (
                  <div key={order.id} style={{ display: 'flex', alignItems: 'center', minWidth: 860, padding: '12px 14px', borderBottom: '1px solid var(--border)', fontSize: 13, gap: 8, cursor: 'pointer' }} onClick={() => setSelectedOrder(order)}>
                    <span style={{ flex: '0 0 70px', fontWeight: 600 }}>{shortId(order.id)}</span>
                    <span style={{ flex: '0 0 55px', color: 'var(--text-muted)', fontSize: 11 }}>{formatTime(order.createdAt)}</span>
                    <span style={{ flex: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.customerName}</span>
                    <div style={{ flex: '0 0 80px', display: 'flex', justifyContent: 'center' }}>
                      <span style={{ display: 'inline-flex', gap: 3, padding: '3px 8px', borderRadius: 999, fontSize: 10, fontWeight: 600, color: order.paymentMethod === 'card' ? '#0EA5E9' : '#10B981', background: 'rgba(16,185,129,0.08)' }}>
                        {order.paymentMethod === 'card' ? 'Karta' : 'Naqd'}
                      </span>
                    </div>
                    <span style={{ flex: '0 0 90px', textAlign: 'right', fontWeight: 600, fontSize: 12 }}>{formatPrice(order.total)}</span>
                    <div style={{ flex: '0 0 110px', display: 'flex', justifyContent: 'center' }}>
                      <span style={{ display: 'inline-flex', gap: 3, padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 600, color: st.color, background: st.bg }}>{st.label}</span>
                    </div>
                    <div style={{ flex: '0 0 80px', display: 'flex', justifyContent: 'center', gap: 4 }}>
                      {order.status === 'pending' && (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); handleAction(order.id, 'accept'); }} style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--success)', border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Check size={12} /></button>
                          <button onClick={(e) => { e.stopPropagation(); handleAction(order.id, 'reject'); }} style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={12} /></button>
                        </>
                      )}
                      {order.status === 'confirmed' && <button onClick={(e) => { e.stopPropagation(); handleAction(order.id, 'prepare'); }} style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ChefHat size={12} /></button>}
                      {order.status === 'preparing' && <button onClick={(e) => { e.stopPropagation(); handleAction(order.id, 'ready'); }} style={{ background: 'var(--success)', color: '#fff', border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><PackageCheck size={12} /></button>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onAction={(action, extra) => { handleAction(selectedOrder.id, action, extra); if (action === 'reject') setSelectedOrder(null); }}
          employees={employees}
          settings={settings}
        />
      )}
    </div>
  );
}
