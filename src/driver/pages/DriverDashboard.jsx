import { useNavigate } from 'react-router-dom';
import { DollarSign, Package, MapPin, Clock, Star, Zap, Navigation, ChevronRight, TrendingUp, Target, Percent } from 'lucide-react';
import useDriverStore from '../store/useDriverStore';
import StatCard from '../components/StatCard';

export default function DriverDashboard() {
  const navigate = useNavigate();
  const { stats, activeDelivery, isOnline } = useDriverStore();

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '100px', scrollbarWidth: 'none' }}>
      <div style={{ padding: '16px' }}>

        {/* Active Delivery Banner */}
        {activeDelivery && (
          <div onClick={() => navigate('/driver/delivery')}
            style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-terracotta))',
              borderRadius: 'var(--radius-xl)', padding: '20px', color: 'white',
              marginBottom: '20px', cursor: 'pointer', position: 'relative', overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(232, 89, 12, 0.3)',
              animation: 'slideUp 0.3s ease-out',
            }}>
            <div style={{ position: 'absolute', top: '-30px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ADE80', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>Active Delivery</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em' }}>{activeDelivery.orderNumber}</div>
            <div style={{ fontSize: '13px', opacity: 0.8, marginTop: '4px' }}>→ {activeDelivery.restaurant.name}</div>
            <div style={{
              marginTop: '14px', padding: '10px 16px', borderRadius: 'var(--radius-full)',
              background: 'white', color: 'var(--color-primary)', fontWeight: 700, fontSize: '13px',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}>
              <Navigation size={14} /> View Delivery <ChevronRight size={14} />
            </div>
          </div>
        )}

        {/* Online Status */}
        {!isOnline && (
          <div style={{
            background: 'var(--color-danger-light)', borderRadius: 'var(--radius-lg)',
            padding: '14px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px',
            border: '1px solid rgba(224, 49, 49, 0.15)',
            animation: 'slideUp 0.3s ease-out',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-danger)' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-danger)' }}>
              You're offline. Go online to receive orders.
            </span>
          </div>
        )}

        {/* Today's Stats */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{
            fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)',
            letterSpacing: '-0.02em', marginBottom: '12px',
          }}>
            Today's Overview
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <StatCard
              icon={<DollarSign size={18} color="var(--color-success)" />}
              value={`${stats.todayEarnings.toLocaleString()} so'm`}
              label="Earnings"
              color="var(--color-success)"
              bgColor="var(--color-success-light)"
            />
            <StatCard
              icon={<Package size={18} color="var(--color-primary)" />}
              value={stats.todayDeliveries}
              label="Deliveries"
              color="var(--color-primary)"
              bgColor="var(--color-primary-light)"
            />
            <StatCard
              icon={<MapPin size={18} color="#1565C0" />}
              value={`${stats.todayDistance} km`}
              label="Distance"
              color="#1565C0"
              bgColor="rgba(21, 101, 192, 0.10)"
            />
            <StatCard
              icon={<Clock size={18} color="var(--color-warning)" />}
              value={`${stats.avgDeliveryTime} min`}
              label="Avg Time"
              color="var(--color-warning)"
              bgColor="var(--color-warning-light)"
            />
            <StatCard
              icon={<Star size={18} color="#D4A017" />}
              value={stats.avgRating}
              label="Rating"
              color="#D4A017"
              bgColor="rgba(212, 160, 23, 0.10)"
            />
            <StatCard
              icon={<Zap size={18} color="var(--color-terracotta)" />}
              value={`${stats.onlineHoursToday}h`}
              label="Online"
              color="var(--color-terracotta)"
              bgColor="rgba(199, 91, 57, 0.10)"
            />
          </div>
        </div>

        {/* Performance Metrics */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
          padding: '16px', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)', marginBottom: '20px',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Performance</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              flex: 1, padding: '12px', borderRadius: 'var(--radius-md)',
              background: 'var(--color-success-light)', textAlign: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>
                <Target size={14} color="var(--color-success)" />
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-success)' }}>{stats.completionRate}%</span>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500 }}>Completion</span>
            </div>
            <div style={{
              flex: 1, padding: '12px', borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary-light)', textAlign: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>
                <Percent size={14} color="var(--color-primary)" />
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary)' }}>{stats.acceptanceRate}%</span>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500 }}>Acceptance</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{
            fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)',
            letterSpacing: '-0.02em', marginBottom: '12px',
          }}>
            Quick Actions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icon: <Package size={18} />, label: 'View Orders', desc: 'Manage deliveries', path: '/driver/orders', color: 'var(--color-primary)' },
              { icon: <TrendingUp size={18} />, label: 'Earnings', desc: 'Track your income', path: '/driver/earnings', color: 'var(--color-success)' },
              { icon: <Clock size={18} />, label: 'History', desc: 'Past deliveries', path: '/driver/history', color: '#1565C0' },
            ].map((action) => (
              <button key={action.path} onClick={() => navigate(action.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px', padding: '16px',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                  transition: 'all 0.2s ease', boxShadow: 'var(--shadow-card)',
                  fontFamily: 'var(--font-family)', textAlign: 'left',
                }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '12px',
                  background: `${action.color}15`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: action.color,
                  flexShrink: 0,
                }}>
                  {action.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{action.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '1px' }}>{action.desc}</div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Summary */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
          padding: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>This Week</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {[
              { value: stats.weeklyDeliveries, label: 'Deliveries' },
              { value: `${stats.weeklyDistance} km`, label: 'Distance' },
              { value: `${(stats.weeklyEarnings / 1000).toFixed(0)}k`, label: 'Earned' },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{item.value}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
