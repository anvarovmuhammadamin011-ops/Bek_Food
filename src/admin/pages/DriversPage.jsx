import { useState } from 'react';
import { Phone, Star, MapPin, Clock, DollarSign, TrendingUp, Car, Bike, Scooter, CheckCircle, XCircle, Coffee, WifiOff } from 'lucide-react';
import useAdminStore from '../store/useAdminStore';
import Modal from '../components/Modal';

export default function DriversPage() {
  const { drivers, updateDriverStatus } = useAdminStore();
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredDrivers = filter === 'all' ? drivers : drivers.filter((d) => d.status === filter);

  const statusConfig = {
    available: { bg: 'var(--color-success-light)', color: 'var(--color-success)', label: 'Available', icon: CheckCircle },
    busy: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)', label: 'Busy', icon: Clock },
    offline: { bg: 'var(--bg-secondary)', color: 'var(--text-muted)', label: 'Offline', icon: WifiOff },
    on_break: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', label: 'On Break', icon: Coffee },
  };

  const vehicleIcons = {
    Bike: Bike,
    Car: Car,
    Scooter: Scooter,
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px' }}>
      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--color-success-light)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-success)' }}>
            {drivers.filter((d) => d.status === 'available').length}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-success)' }}>Available</div>
        </div>
        <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--color-warning-light)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-warning)' }}>
            {drivers.filter((d) => d.status === 'busy').length}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-warning)' }}>Busy</div>
        </div>
        <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-secondary)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-muted)' }}>
            {drivers.filter((d) => d.status === 'offline').length}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Offline</div>
        </div>
        <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(139, 92, 246, 0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#8b5cf6' }}>
            {drivers.reduce((s, d) => s + d.completedToday, 0)}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#8b5cf6' }}>Total Deliveries</div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['all', 'available', 'busy', 'offline', 'on_break'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: '1.5px solid',
              borderColor: filter === f ? 'var(--color-primary)' : 'var(--border)',
              background: filter === f ? 'var(--color-primary)' : 'var(--bg-card)',
              color: filter === f ? 'white' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textTransform: 'capitalize',
            }}
          >
            {f === 'all' ? 'All Drivers' : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Drivers Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '16px',
      }}>
        {filteredDrivers.map((driver) => {
          const st = statusConfig[driver.status];
          const StIcon = st.icon;
          const VIcon = vehicleIcons[driver.vehicleType] || Car;

          return (
            <div
              key={driver.id}
              onClick={() => setSelectedDriver(driver)}
              style={{
                background: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                boxShadow: '0 2px 12px rgba(45, 42, 38, 0.04)',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <img src={driver.photo} alt={driver.name} style={{ width: '52px', height: '52px', borderRadius: '14px', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: st.color,
                    border: '2px solid var(--bg-card)',
                  }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{driver.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <VIcon size={12} color="var(--text-muted)" />
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{driver.vehicleType}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>•</span>
                    <Star size={12} fill="var(--color-warning)" color="var(--color-warning)" />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{driver.rating}</span>
                  </div>
                </div>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  background: st.bg,
                  color: st.color,
                  fontSize: '11px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <StIcon size={12} />
                  {st.label}
                </span>
              </div>

              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '10px',
                padding: '14px',
                borderRadius: '12px',
                background: 'var(--bg-secondary)',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{driver.completedToday}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Today</div>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary)' }}>{driver.currentOrders}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Active</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-success)' }}>{(driver.earnings / 1000).toFixed(0)}K</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Earned</div>
                </div>
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'var(--bg-secondary)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                }}>
                  <Phone size={14} />
                  {driver.phone}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Driver Details Modal */}
      <Modal
        isOpen={!!selectedDriver}
        onClose={() => setSelectedDriver(null)}
        title={selectedDriver?.name || ''}
        maxWidth="480px"
      >
        {selectedDriver && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img src={selectedDriver.photo} alt={selectedDriver.name} style={{ width: '80px', height: '80px', borderRadius: '20px', objectFit: 'cover', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{selectedDriver.name}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{selectedDriver.vehicleType} Driver</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-secondary)', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{selectedDriver.completedToday}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Today's Deliveries</div>
              </div>
              <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-secondary)', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-success)' }}>{(selectedDriver.earnings / 1000).toFixed(0)}K so'm</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Today's Earnings</div>
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '12px', background: 'var(--bg-secondary)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Star size={16} fill="var(--color-warning)" color="var(--color-warning)" />
                <span style={{ fontSize: '16px', fontWeight: 700 }}>{selectedDriver.rating}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Rating</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} color="var(--text-muted)" />
                <span style={{ fontSize: '13px' }}>{selectedDriver.phone}</span>
              </div>
            </div>

            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Change Status
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {Object.entries(statusConfig).map(([key, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <button
                    key={key}
                    onClick={() => { updateDriverStatus(selectedDriver.id, key); setSelectedDriver({ ...selectedDriver, status: key }); }}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: `1.5px solid ${selectedDriver.status === key ? cfg.color : 'var(--border)'}`,
                      background: selectedDriver.status === key ? cfg.bg : 'var(--bg-card)',
                      color: selectedDriver.status === key ? cfg.color : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Icon size={14} /> {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
