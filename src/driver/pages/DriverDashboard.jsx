import { DollarSign, Package, Clock, Star, TrendingUp, Truck, CheckCircle, MapPin } from 'lucide-react';
import useDriverStore from '../store/useDriverStore';

export default function DriverDashboard() {
  const { stats, availableOrders, activeDelivery, profile, setActivePage } = useDriverStore();

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>
        Yetkazish paneli
      </h2>

      {/* Stats */}
      <div className="driver-stats-grid">
        {[
          { label: "Bugungi daromad", value: `${(stats.todayEarnings / 1000).toFixed(0)}K`, icon: DollarSign, bg: 'var(--color-success-light)', color: 'var(--color-success)' },
          { label: "Bugun yetkazilgan", value: stats.todayDeliveries, icon: Package, bg: 'var(--color-primary-light)', color: 'var(--color-primary)' },
          { label: "O'rtacha vaqt", value: `${stats.avgDeliveryTime} daq`, icon: Clock, bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
          { label: "Reyting", value: `⭐ ${stats.avgRating}`, icon: Star, bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
        ].map((card, i) => (
          <div key={i} className="driver-stat-card" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="driver-stat-icon" style={{ background: card.bg }}>
              <card.icon size={20} color={card.color} />
            </div>
            <div className="driver-stat-value">{card.value}</div>
            <div className="driver-stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Active Delivery */}
      {activeDelivery && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={18} color="var(--color-primary)" /> Joriy yetkazish
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{activeDelivery.orderNumber}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{activeDelivery.customer.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                <MapPin size={11} style={{ display: 'inline' }} /> {activeDelivery.customer.address}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, padding: '3px 10px', borderRadius: '9999px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                {activeDelivery.status}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '4px' }}>
                {activeDelivery.deliveryFee.toLocaleString()} so'm
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <TrendingUp size={16} color="var(--color-success)" />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Haftalik daromad</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{(stats.weeklyEarnings / 1000).toFixed(0)}K so'm</div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <CheckCircle size={16} color="var(--color-success)" />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Bajarilish darajasi</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-success)' }}>%{stats.completionRate}</div>
        </div>
      </div>

      {/* Available Orders */}
      {availableOrders.length > 0 && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Yangi buyurtmalar ({availableOrders.length})
            </h3>
            <button onClick={() => setActivePage('orders')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              Hammasi →
            </button>
          </div>
          {availableOrders.slice(0, 3).map((order) => (
            <div key={order.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px', borderRadius: '10px', background: 'var(--bg-secondary)',
              marginBottom: '8px',
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{order.orderNumber}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.customer.name} · {order.distance} km</div>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-success)' }}>{order.deliveryFee.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
