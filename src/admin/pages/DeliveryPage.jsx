import { useState } from 'react';
import { Truck, MapPin, Phone, Clock, CheckCircle, AlertCircle, RotateCcw, Navigation, X } from 'lucide-react';
import useAdminStore from '../store/useAdminStore';
import Modal from '../components/Modal';

export default function DeliveryPage() {
  const { orders, drivers, updateOrderStatus, assignDriver } = useAdminStore();
  const [selectedTab, setSelectedTab] = useState('active');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const activeDeliveries = orders.filter((o) => ['assigned', 'out_for_delivery'].includes(o.status));
  const pendingAssignment = orders.filter((o) => o.status === 'ready');
  const completedDeliveries = orders.filter((o) => o.status === 'delivered');

  const tabs = [
    { id: 'active', label: 'Active', count: activeDeliveries.length },
    { id: 'pending', label: 'Pending Assignment', count: pendingAssignment.length },
    { id: 'completed', label: 'Completed', count: completedDeliveries.length },
  ];

  const getDriver = (driverId) => drivers.find((d) => d.id === driverId);

  const handleAssign = (orderId, driverId) => {
    assignDriver(orderId, driverId);
    setShowAssignModal(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = (orderId, status) => {
    updateOrderStatus(orderId, status);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px' }}>
      {/* Driver Status Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {['available', 'busy', 'offline', 'on_break'].map((status) => {
          const count = drivers.filter((d) => d.status === status).length;
          const labels = { available: 'Available', busy: 'Busy', offline: 'Offline', on_break: 'On Break' };
          const colors = {
            available: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
            busy: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
            offline: { bg: 'var(--bg-secondary)', color: 'var(--text-muted)' },
            on_break: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' },
          };
          const c = colors[status];
          return (
            <div key={status} style={{
              padding: '16px',
              borderRadius: '14px',
              background: c.bg,
              border: `1px solid ${c.color}20`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: c.color }}>{count}</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: c.color }}>{labels[status]}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '12px',
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              background: selectedTab === tab.id ? 'var(--color-primary)' : 'transparent',
              color: selectedTab === tab.id ? 'white' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'var(--font-family)',
            }}
          >
            {tab.label}
            <span style={{
              padding: '2px 8px',
              borderRadius: '9999px',
              background: selectedTab === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--bg-secondary)',
              fontSize: '11px',
              fontWeight: 700,
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Delivery Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '16px',
      }}>
        {selectedTab === 'active' && activeDeliveries.map((order) => {
          const driver = getDriver(order.driverId);
          return (
            <div key={order.id} style={{
              background: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              boxShadow: '0 2px 12px rgba(45, 42, 38, 0.04)',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '14px 16px',
                borderBottom: '1px solid var(--border)',
                background: order.status === 'out_for_delivery' ? 'rgba(139, 92, 246, 0.06)' : 'var(--bg-secondary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800 }}>{order.orderNumber}</span>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    background: order.status === 'out_for_delivery' ? 'rgba(139, 92, 246, 0.1)' : 'var(--color-primary-light)',
                    color: order.status === 'out_for_delivery' ? '#8b5cf6' : 'var(--color-primary)',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}>
                    {order.status === 'assigned' ? 'Assigned' : 'Out for Delivery'}
                  </span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {order.total.toLocaleString()} so'm
                </span>
              </div>

              <div style={{ padding: '14px 16px' }}>
                {/* Driver Info */}
                {driver && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px',
                    borderRadius: '10px',
                    background: 'var(--bg-secondary)',
                    marginBottom: '12px',
                  }}>
                    <img src={driver.photo} alt={driver.name} style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{driver.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{driver.vehicleType} • ⭐ {driver.rating}</div>
                    </div>
                    <button style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'var(--color-primary-light)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--color-primary)',
                    }}>
                      <Phone size={16} />
                    </button>
                  </div>
                )}

                {/* Customer */}
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{order.customerName}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '6px', marginBottom: '12px' }}>
                  <MapPin size={12} style={{ flexShrink: 0, marginTop: '2px' }} />
                  {order.deliveryAddress}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {order.status === 'assigned' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'out_for_delivery')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '10px',
                        background: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Truck size={14} /> Start Delivery
                    </button>
                  )}
                  {order.status === 'out_for_delivery' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'delivered')}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '10px',
                        background: 'var(--color-success)',
                        color: 'white',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <CheckCircle size={14} /> Mark Delivered
                    </button>
                  )}
                  <button style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <Navigation size={14} /> Track
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {selectedTab === 'pending' && pendingAssignment.map((order) => (
          <div key={order.id} style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 12px rgba(45, 42, 38, 0.04)',
            padding: '16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800 }}>{order.orderNumber}</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>
                {order.total.toLocaleString()} so'm
              </span>
            </div>
            <div style={{ fontSize: '13px', marginBottom: '4px' }}>{order.customerName}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', gap: '6px' }}>
              <MapPin size={12} style={{ flexShrink: 0 }} />
              {order.deliveryAddress}
            </div>
            <button
              onClick={() => { setSelectedOrder(order); setShowAssignModal(true); }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Truck size={16} /> Assign Driver
            </button>
          </div>
        ))}

        {selectedTab === 'completed' && completedDeliveries.map((order) => {
          const driver = getDriver(order.driverId);
          return (
            <div key={order.id} style={{
              background: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              padding: '16px',
              opacity: 0.8,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800 }}>{order.orderNumber}</span>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  background: 'var(--color-success-light)',
                  color: 'var(--color-success)',
                  fontSize: '11px',
                  fontWeight: 600,
                }}>
                  Delivered
                </span>
              </div>
              <div style={{ fontSize: '13px', marginBottom: '2px' }}>{order.customerName}</div>
              {driver && <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>by {driver.name}</div>}
            </div>
          );
        })}
      </div>

      {/* Assign Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => { setShowAssignModal(false); setSelectedOrder(null); }}
        title="Assign Driver"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {drivers.filter((d) => d.status === 'available').map((driver) => (
            <button
              key={driver.id}
              onClick={() => handleAssign(selectedOrder?.id, driver.id)}
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
                <div style={{ fontSize: '14px', fontWeight: 700 }}>{driver.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{driver.vehicleType} • ⭐ {driver.rating}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-success)' }}>Available</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{driver.completedToday} today</div>
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
