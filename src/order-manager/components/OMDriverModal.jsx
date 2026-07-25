import { X } from 'lucide-react';
import useOrderManagerStore from '../store/useOrderManagerStore';

export default function OMDriverModal() {
  const { showDriverModal, closeDriverModal, driverModalOrderId, getAvailableDrivers, assignDriver, drivers } = useOrderManagerStore();

  if (!showDriverModal) return null;

  const available = drivers.filter((d) => d.status === 'available' || d.status === 'busy');

  const handleAssign = (driver) => {
    assignDriver(driverModalOrderId, driver.id, driver.name);
    closeDriverModal();
  };

  return (
    <div className="om-modal-overlay" onClick={closeDriverModal}>
      <div className="om-modal" onClick={(e) => e.stopPropagation()}>
        <div className="om-modal-header">
          <h2 className="om-modal-title">Assign Driver</h2>
          <button onClick={closeDriverModal} className="om-modal-close"><X size={18} /></button>
        </div>
        <div className="om-modal-body">
          {available.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>No drivers available</p>
          ) : (
            available.map((driver) => (
              <div key={driver.id} className="om-driver-card" onClick={() => handleAssign(driver)}>
                <div className="om-driver-avatar">
                  <img src={driver.photo} alt={driver.name} />
                </div>
                <div className="om-driver-info">
                  <div className="om-driver-name">{driver.name}</div>
                  <div className="om-driver-meta">
                    {driver.vehicleType} · ⭐ {driver.rating} · {driver.completedToday} today
                  </div>
                  <div className="om-driver-meta">
                    {driver.activeDeliveries} active · {driver.status}
                  </div>
                </div>
                <span style={{
                  padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 600,
                  background: driver.status === 'available' ? 'var(--color-success-light)' : 'var(--color-warning-light)',
                  color: driver.status === 'available' ? 'var(--color-success)' : 'var(--color-warning)',
                }}>
                  Select
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
