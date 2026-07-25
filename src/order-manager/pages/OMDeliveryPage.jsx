import useOrderManagerStore from '../store/useOrderManagerStore';
import OMOrderCard from '../components/OMOrderCard';

export default function OMDeliveryPage() {
  const { orders, setSelectedOrder } = useOrderManagerStore();
  const deliveryOrders = orders.filter((o) => o.type === 'delivery' && o.status !== 'delivered' && o.status !== 'cancelled');

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>
        Delivery Orders
      </h2>

      <div className="om-orders-grid">
        {deliveryOrders.map((order) => (
          <OMOrderCard key={order.id} order={order} onClick={setSelectedOrder} />
        ))}
      </div>

      {deliveryOrders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '14px' }}>No active delivery orders</p>
        </div>
      )}
    </div>
  );
}
