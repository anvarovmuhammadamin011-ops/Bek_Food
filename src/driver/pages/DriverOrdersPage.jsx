import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, Clock, ChevronRight, Navigation, DollarSign, Phone } from 'lucide-react';
import useDriverStore from '../store/useDriverStore';
import StatusBadge from '../components/StatusBadge';
import DeliveryRequestModal from '../components/DeliveryRequestModal';

export default function DriverOrdersPage() {
  const navigate = useNavigate();
  const { availableOrders, activeDelivery, acceptOrder, rejectOrder, requestCountdown, setRequestCountdown, showToast } = useDriverStore();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleTick = useCallback(() => {
    setRequestCountdown(Math.max(0, requestCountdown - 1));
  }, [requestCountdown, setRequestCountdown]);

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '100px', scrollbarWidth: 'none' }}>
      <div style={{ padding: '16px' }}>

        {/* Active Delivery */}
        {activeDelivery && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)',
              letterSpacing: '-0.02em', marginBottom: '12px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)', animation: 'pulse 2s infinite' }} />
              Active Delivery
            </h2>
            <div onClick={() => navigate('/driver/delivery')}
              style={{
                background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                padding: '16px', border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-card)', cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>{activeDelivery.orderNumber}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{activeDelivery.restaurant.name}</div>
                </div>
                <StatusBadge status={activeDelivery.status} size="md" />
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {activeDelivery.distance} km</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {activeDelivery.estimatedTime}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><DollarSign size={12} /> {activeDelivery.deliveryFee.toLocaleString()} so'm</span>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '10px', borderRadius: 'var(--radius-md)',
                background: 'var(--color-primary-light)', color: 'var(--color-primary)',
                fontSize: '13px', fontWeight: 700,
              }}>
                <Navigation size={14} /> View Details <ChevronRight size={14} />
              </div>
            </div>
          </div>
        )}

        {/* Available Orders */}
        <div>
          <h2 style={{
            fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)',
            letterSpacing: '-0.02em', marginBottom: '4px',
          }}>
            Available Orders
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            {availableOrders.length} order{availableOrders.length !== 1 ? 's' : ''} waiting
          </p>

          {availableOrders.length === 0 && (
            <div style={{
              padding: '48px 32px', textAlign: 'center',
              background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
            }}>
              <Package size={40} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>No orders available</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Stay online to receive new delivery requests</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {availableOrders.map((order, i) => (
              <div key={order.id}
                onClick={() => {
                  setSelectedOrder(order);
                  setRequestCountdown(30);
                }}
                style={{
                  background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                  padding: '16px', border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-card)', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  animation: 'slideUp 0.3s ease-out',
                  animationDelay: `${i * 0.05}s`,
                  animationFillMode: 'both',
                }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>{order.orderNumber}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600, marginTop: '2px' }}>{order.restaurant.name}</div>
                  </div>
                  <div style={{
                    padding: '4px 10px', borderRadius: 'var(--radius-full)',
                    background: 'var(--color-primary-light)', color: 'var(--color-primary)',
                    fontSize: '12px', fontWeight: 700,
                  }}>
                    {order.deliveryFee.toLocaleString()} so'm
                  </div>
                </div>

                {/* Details */}
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MapPin size={11} /> {order.distance} km</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Clock size={11} /> {order.estimatedTime}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><DollarSign size={11} /> {order.total.toLocaleString()} so'm</span>
                </div>

                {/* Customer */}
                <div style={{
                  fontSize: '12px', color: 'var(--text-secondary)',
                  padding: '8px 10px', borderRadius: '10px',
                  background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <Phone size={11} color="var(--text-muted)" />
                  {order.customer.name} — {order.customer.address.substring(0, 40)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delivery Request Modal */}
      {selectedOrder && (
        <DeliveryRequestModal
          order={selectedOrder}
          countdown={requestCountdown}
          onTick={handleTick}
          onAccept={() => {
            acceptOrder(selectedOrder.id);
            setSelectedOrder(null);
            setRequestCountdown(30);
            showToast('Order accepted! Navigate to restaurant.', 'success');
          }}
          onReject={() => {
            rejectOrder(selectedOrder.id);
            setSelectedOrder(null);
            setRequestCountdown(30);
          }}
        />
      )}
    </div>
  );
}
