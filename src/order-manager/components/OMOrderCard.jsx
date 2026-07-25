import { useEffect, useState } from 'react';
import { Clock, MapPin, Phone, CreditCard, MessageSquare, Truck, ChevronRight } from 'lucide-react';
import useOrderManagerStore from '../store/useOrderManagerStore';

function Countdown({ orderTime }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - new Date(orderTime).getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [orderTime]);
  const min = Math.floor(elapsed / 60);
  const sec = elapsed % 60;
  return (
    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
      {min}:{sec.toString().padStart(2, '0')}
    </span>
  );
}

export default function OMOrderCard({ order, onClick }) {
  const { acceptOrder, rejectOrder, startPreparing, markReady, openDriverModal, completeOrder, openConfirm } = useOrderManagerStore();

  const statusLabel = {
    pending: 'Kutilmoqda', accepted: 'Qabul qilingan', preparing: 'Tayyorlanmoqda',
    ready: 'Tayyor', out_for_delivery: 'Yetkazilmoqda', delivered: 'Yetkazilgan', cancelled: 'Bekor qilingan',
  };

  const getActions = () => {
    switch (order.status) {
      case 'pending':
        return (
          <div className="om-actions">
            <button className="om-action-btn accept" onClick={(e) => { e.stopPropagation(); openConfirm('Bu buyurtmani qabul qilasizmi?', () => acceptOrder(order.id)); }}>✓ Qabul qilish</button>
            <button className="om-action-btn reject" onClick={(e) => { e.stopPropagation(); openConfirm('Bu buyurtmani bekor qilasizmi?', () => rejectOrder(order.id)); }}>✕ Bekor qilish</button>
          </div>
        );
      case 'accepted':
        return (
          <div className="om-actions">
            <button className="om-action-btn prepare" onClick={(e) => { e.stopPropagation(); startPreparing(order.id); }}>👨‍🍳 Tayyorlashni boshlash</button>
          </div>
        );
      case 'preparing':
        return (
          <div className="om-actions">
            <button className="om-action-btn ready" onClick={(e) => { e.stopPropagation(); markReady(order.id); }}>🍔 Tayyor deb belgilash</button>
          </div>
        );
      case 'ready':
        return order.type === 'delivery' ? (
          <div className="om-actions">
            <button className="om-action-btn assign" onClick={(e) => { e.stopPropagation(); openDriverModal(order.id); }}>🚚 Haydovchi tayinlash</button>
          </div>
        ) : (
          <div className="om-actions">
            <button className="om-action-btn accept" onClick={(e) => { e.stopPropagation(); completeOrder(order.id); }}>✅ Olib ketishni yakunlash</button>
          </div>
        );
      case 'out_for_delivery':
        return (
          <div className="om-actions">
            <button className="om-action-btn print" onClick={(e) => e.stopPropagation()}>🖨 Chek</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`om-order-card${order.status === 'pending' ? ' new-order' : ''}`} onClick={() => onClick?.(order)}>
      <div className="om-order-header">
        <span className="om-order-number">{order.orderNumber}</span>
        <span className={`om-status-badge ${order.status}`}>{statusLabel[order.status]}</span>
      </div>

      <div className="om-order-customer">{order.customerName}</div>

      {order.type === 'delivery' && order.deliveryAddress && (
        <div className="om-order-address">
          <MapPin size={11} style={{ display: 'inline', marginRight: '4px' }} />
          {order.deliveryAddress}
        </div>
      )}

      <div className="om-order-items">
        {order.items.map((item, i) => (
          <div key={i} className="om-order-item">
            <span className="om-order-item-name">{item.image} {item.name}</span>
            <span className="om-order-item-qty">x{item.qty}</span>
            <span className="om-order-item-price">{(item.price * item.qty).toLocaleString()}</span>
          </div>
        ))}
      </div>

      {order.notes && (
        <div className="om-order-notes">
          <MessageSquare size={12} />
          {order.notes}
        </div>
      )}

      <div className="om-order-footer">
        <div>
          <span className="om-order-total">{order.total.toLocaleString()} so'm</span>
          <span className={`om-order-type ${order.type}`} style={{ marginLeft: '8px' }}>{order.type}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <Clock size={12} />
          <Countdown orderTime={order.orderTime} />
        </div>
      </div>

      {order.driverName && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '11px', color: '#8b5cf6', fontWeight: 500 }}>
          <Truck size={12} /> {order.driverName}
        </div>
      )}

      {getActions()}
    </div>
  );
}
