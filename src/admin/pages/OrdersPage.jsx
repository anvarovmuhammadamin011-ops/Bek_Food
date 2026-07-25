import { useState } from 'react';
import { Clock, MapPin, Phone, CheckCircle, XCircle, ChefHat, Package, Truck, RotateCcw, Printer, MoreVertical, Filter, Search, Eye } from 'lucide-react';
import useAdminStore from '../store/useAdminStore';
import Modal from '../components/Modal';

const statusConfig = {
  pending: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)', label: 'Pending', icon: Clock },
  accepted: { bg: 'var(--color-primary-light)', color: 'var(--color-primary)', label: 'Accepted', icon: CheckCircle },
  preparing: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', label: 'Preparing', icon: ChefHat },
  ready: { bg: 'var(--color-success-light)', color: 'var(--color-success)', label: 'Ready', icon: Package },
  assigned: { bg: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', label: 'Assigned', icon: Truck },
  out_for_delivery: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', label: 'Out for Delivery', icon: Truck },
  delivered: { bg: 'var(--color-success-light)', color: 'var(--color-success)', label: 'Delivered', icon: CheckCircle },
  cancelled: { bg: 'var(--color-danger-light)', color: 'var(--color-danger)', label: 'Cancelled', icon: XCircle },
};

const statusFlow = {
  pending: ['accepted', 'cancelled'],
  accepted: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['assigned'],
  assigned: ['out_for_delivery'],
  out_for_delivery: ['delivered'],
  delivered: [],
  cancelled: [],
};

function OrderCard({ order, onViewDetails, onStatusChange }) {
  const config = statusConfig[order.status] || statusConfig.pending;
  const Icon = config.icon;
  const nextStatuses = statusFlow[order.status] || [];

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '16px',
      border: '1px solid var(--border)',
      boxShadow: '0 2px 12px rgba(45, 42, 38, 0.04)',
      overflow: 'hidden',
      transition: 'all 0.25s ease',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {order.orderNumber}
          </span>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: '9999px',
            background: config.bg,
            color: config.color,
          }}>
            <Icon size={12} />
            {config.label}
          </span>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {new Date(order.orderTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px' }}>
        {/* Customer Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--color-primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--color-primary)',
          }}>
            {order.customerName.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{order.customerName}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Phone size={10} /> {order.customerPhone}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-primary)' }}>
              {order.total.toLocaleString()} so'm
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              {order.paymentMethod}
            </div>
          </div>
        </div>

        {/* Address */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          padding: '10px',
          borderRadius: '10px',
          background: 'var(--bg-secondary)',
          marginBottom: '12px',
        }}>
          <MapPin size={14} color="var(--color-danger)" style={{ marginTop: '1px', flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {order.deliveryAddress}
          </span>
        </div>

        {/* Items */}
        <div style={{ marginBottom: '12px' }}>
          {order.items.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
              padding: '4px 0',
              color: 'var(--text-secondary)',
            }}>
              <span>{item.qty}x {item.name}</span>
              <span style={{ fontWeight: 600 }}>{(item.price * item.qty).toLocaleString()} so'm</span>
            </div>
          ))}
          {order.notes && (
            <div style={{
              marginTop: '8px',
              padding: '8px 10px',
              borderRadius: '8px',
              background: 'rgba(232, 89, 12, 0.06)',
              fontSize: '11px',
              color: 'var(--color-primary)',
              fontStyle: 'italic',
            }}>
              "{order.notes}"
            </div>
          )}
        </div>

        {/* Summary */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          padding: '10px 0',
          borderTop: '1px solid var(--border)',
          marginBottom: '12px',
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Delivery Fee</span>
          <span style={{ fontWeight: 600, color: order.deliveryFee === 0 ? 'var(--color-success)' : 'var(--text-primary)' }}>
            {order.deliveryFee === 0 ? 'Free' : `${order.deliveryFee.toLocaleString()} so'm`}
          </span>
        </div>
      </div>

      {/* Actions */}
      {nextStatuses.length > 0 && (
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}>
          {nextStatuses.map((status) => {
            const cfg = statusConfig[status];
            const StatusIcon = cfg.icon;
            return (
              <button
                key={status}
                onClick={() => onStatusChange(order.id, status)}
                style={{
                  flex: 1,
                  minWidth: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: status === 'cancelled' ? '1.5px solid rgba(224, 49, 49, 0.2)' : 'none',
                  background: status === 'cancelled' ? 'var(--color-danger-light)' : cfg.bg,
                  color: status === 'cancelled' ? 'var(--color-danger)' : cfg.color,
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-family)',
                }}
              >
                <StatusIcon size={14} />
                {cfg.label}
              </button>
            );
          })}
        </div>
      )}

      {/* View Details */}
      <div style={{ padding: '0 16px 12px' }}>
        <button
          onClick={() => onViewDetails(order)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px',
            borderRadius: '10px',
            border: '1.5px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'var(--font-family)',
          }}
        >
          <Eye size={14} />
          View Details
        </button>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { orders, updateOrderStatus, drivers } = useAdminStore();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [orderToAssign, setOrderToAssign] = useState(null);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'ready', label: 'Ready' },
    { id: 'out_for_delivery', label: 'Out for Delivery' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filter === 'all' || o.status === filter;
    const matchesSearch = searchQuery === '' ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusChange = (orderId, newStatus) => {
    if (newStatus === 'assigned') {
      setOrderToAssign(orderId);
      setShowAssignModal(true);
      return;
    }
    updateOrderStatus(orderId, newStatus);
  };

  const handleAssignDriver = (driverId) => {
    if (orderToAssign) {
      const store = useAdminStore.getState();
      store.assignDriver(orderToAssign, driverId);
      setShowAssignModal(false);
      setOrderToAssign(null);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px' }}>
      {/* Filters */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              borderRadius: '10px',
              border: '1.5px solid var(--border)',
              background: 'var(--bg-card)',
              fontSize: '13px',
              color: 'var(--text-primary)',
              outline: 'none',
              fontFamily: 'var(--font-family)',
            }}
          />
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                border: '1.5px solid',
                borderColor: filter === f.id ? 'var(--color-primary)' : 'var(--border)',
                background: filter === f.id ? 'var(--color-primary)' : 'var(--bg-card)',
                color: filter === f.id ? 'white' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'var(--font-family)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '16px',
      }}>
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onViewDetails={setSelectedOrder}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--text-muted)',
        }}>
          <Package size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <p style={{ fontSize: '15px', fontWeight: 600 }}>No orders found</p>
        </div>
      )}

      {/* Assign Driver Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => { setShowAssignModal(false); setOrderToAssign(null); }}
        title="Assign Driver"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {drivers.filter((d) => d.status === 'available').map((driver) => (
            <button
              key={driver.id}
              onClick={() => handleAssignDriver(driver.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                borderRadius: '12px',
                border: '1.5px solid var(--border)',
                background: 'var(--bg-card)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                fontFamily: 'var(--font-family)',
              }}
            >
              <img src={driver.photo} alt={driver.name} style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{driver.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{driver.vehicleType} • ⭐ {driver.rating}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-success)' }}>Available</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{driver.completedToday} today</div>
              </div>
            </button>
          ))}
          {drivers.filter((d) => d.status === 'available').length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>No available drivers</p>
          )}
        </div>
      </Modal>

      {/* Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order ${selectedOrder?.orderNumber || ''}`}
        maxWidth="560px"
      >
        {selectedOrder && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Customer */}
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {selectedOrder.customerName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{selectedOrder.customerName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{selectedOrder.customerPhone}</div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delivery Address</h4>
                <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--bg-secondary)', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '8px' }}>
                  <MapPin size={14} color="var(--color-danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  {selectedOrder.deliveryAddress}
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Items</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: '10px', background: 'var(--bg-secondary)' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.qty}x {item.name}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>{(item.price * item.qty).toLocaleString()} so'm</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--color-primary-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Total</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary)' }}>{selectedOrder.total.toLocaleString()} so'm</span>
              </div>

              {selectedOrder.notes && (
                <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(232, 89, 12, 0.06)', fontSize: '13px', color: 'var(--color-primary)', fontStyle: 'italic' }}>
                  "{selectedOrder.notes}"
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
