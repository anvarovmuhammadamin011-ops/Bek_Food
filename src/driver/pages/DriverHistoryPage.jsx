import { useState } from 'react';
import { Calendar, MapPin, Clock, Filter, Star, ChevronDown } from 'lucide-react';
import useDriverStore from '../store/useDriverStore';
import StatusBadge from '../components/StatusBadge';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'failed', label: 'Failed' },
];

export default function DriverHistoryPage() {
  const { deliveryHistory } = useDriverStore();
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? deliveryHistory
    : deliveryHistory.filter(d => d.status === activeFilter);

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '100px', scrollbarWidth: 'none' }}>
      <div style={{ padding: '16px' }}>
        <h2 style={{
          fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)',
          letterSpacing: '-0.02em', marginBottom: '14px',
        }}>
          Delivery History
        </h2>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex', gap: '8px', overflowX: 'auto',
          paddingBottom: '12px', scrollbarWidth: 'none',
          margin: '0 -16px', paddingLeft: '16px', paddingRight: '16px',
        }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setActiveFilter(f.id)}
              style={{
                flexShrink: 0, padding: '8px 16px', borderRadius: 'var(--radius-full)',
                border: activeFilter === f.id ? '1.5px solid var(--color-primary)' : '1.5px solid var(--border)',
                background: activeFilter === f.id ? 'var(--color-primary)' : 'var(--bg-card)',
                color: activeFilter === f.id ? 'white' : 'var(--text-secondary)',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s ease', fontFamily: 'var(--font-family)',
              }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* History List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.length === 0 && (
            <div style={{
              padding: '48px 32px', textAlign: 'center',
              background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
            }}>
              <Filter size={36} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>No deliveries found</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No {activeFilter !== 'all' ? activeFilter : ''} deliveries yet</p>
            </div>
          )}

          {filtered.map((item, i) => (
            <div key={item.id}
              style={{
                background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                padding: '14px', border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-card)',
                animation: 'slideUp 0.3s ease-out',
                animationDelay: `${i * 0.04}s`,
                animationFillMode: 'both',
              }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.orderNumber}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{item.customer}</div>
                </div>
                <StatusBadge status={item.status} />
              </div>

              {/* Details */}
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '11px',
                color: 'var(--text-muted)', marginBottom: '8px',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Calendar size={10} /> {item.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <MapPin size={10} /> {item.distance} km
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Clock size={10} /> {item.timeTaken} min
                </span>
                {item.rating && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#D4A017' }}>
                    <Star size={10} fill="#D4A017" /> {item.rating}
                  </span>
                )}
              </div>

              {/* Earnings */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: '8px', borderTop: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Earnings</span>
                <span style={{
                  fontSize: '14px', fontWeight: 800,
                  color: item.status === 'completed' ? 'var(--color-success)' : 'var(--text-muted)',
                }}>
                  {item.status === 'completed' ? `+${item.earnings.toLocaleString()} so'm` : '—'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
