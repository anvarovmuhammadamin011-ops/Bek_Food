import { MapPin, Phone, Clock, Navigation, CheckCircle, Package, Truck } from 'lucide-react';
import useDriverStore from '../store/useDriverStore';

export default function DriverOrdersPage() {
  const { availableOrders, activeDelivery, acceptOrder, rejectOrder, updateDeliveryStatus, completeDelivery } = useDriverStore();

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>
        Buyurtmalar
      </h2>

      {/* Active Delivery */}
      {activeDelivery && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={18} color="var(--color-primary)" /> Joriy yetkazish
          </h3>
          <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--bg-secondary)', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{activeDelivery.orderNumber}</span>
              <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 10px', borderRadius: '9999px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                {activeDelivery.status}
              </span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{activeDelivery.customer.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={11} /> {activeDelivery.customer.address}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Phone size={11} /> {activeDelivery.customer.phone}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <a href={`tel:${activeDelivery.customer.phone}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>
              <Phone size={14} /> Qo'ng'iroq
            </a>
            <a href={`https://maps.google.com/?q=${encodeURIComponent(activeDelivery.customer.address)}`} target="_blank" rel="noreferrer" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>
              <Navigation size={14} /> Xarita
            </a>
            {activeDelivery.status === 'accepted' && (
              <button onClick={() => updateDeliveryStatus('picked_up')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '10px', background: '#3b82f6', border: 'none', fontSize: '12px', fontWeight: 600, color: 'white', cursor: 'pointer' }}>
                <Package size={14} /> Olish
              </button>
            )}
            {activeDelivery.status === 'picked_up' && (
              <button onClick={() => completeDelivery('delivered')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', borderRadius: '10px', background: 'var(--color-success)', border: 'none', fontSize: '12px', fontWeight: 600, color: 'white', cursor: 'pointer' }}>
                <CheckCircle size={14} /> Yetkazildi
              </button>
            )}
          </div>
        </div>
      )}

      {/* Available Orders */}
      <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
        Yangi buyurtmalar ({availableOrders.length})
      </h3>
      <div className="driver-orders-grid">
        {availableOrders.map((order) => (
          <div key={order.id} className="driver-order-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{order.orderNumber}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={11} /> {order.estimatedTime}
              </span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{order.customer.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={11} /> {order.customer.address}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
              📏 {order.distance} km · {order.items.length} ta mahsulot
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-success)' }}>{order.deliveryFee.toLocaleString()} so'm</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => rejectOrder(order.id)} className="driver-action-btn reject">Bekor</button>
                <button onClick={() => acceptOrder(order.id)} className="driver-action-btn accept">Qabul qilish</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {availableOrders.length === 0 && !activeDelivery && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
          <Package size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <p style={{ fontSize: '14px' }}>Yangi buyurtmalar yo'q</p>
        </div>
      )}
    </div>
  );
}
