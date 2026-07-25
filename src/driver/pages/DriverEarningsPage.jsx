import { DollarSign, TrendingUp, Package, Star, MapPin, Clock, Award } from 'lucide-react';
import useDriverStore from '../store/useDriverStore';

export default function DriverEarningsPage() {
  const { stats, weeklyEarnings } = useDriverStore();
  const maxEarning = Math.max(...weeklyEarnings.map(d => d.earnings), 1);

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '100px', scrollbarWidth: 'none' }}>
      <div style={{ padding: '16px' }}>
        <h2 style={{
          fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)',
          letterSpacing: '-0.02em', marginBottom: '16px',
        }}>
          My Earnings
        </h2>

        {/* Today's Earnings Hero */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-success), #1E7E34)',
          borderRadius: 'var(--radius-xl)', padding: '24px', color: 'white',
          marginBottom: '20px', position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(43, 138, 62, 0.3)',
        }}>
          <div style={{ position: 'absolute', top: '-30px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85 }}>Today's Earnings</div>
          <div style={{ fontSize: '32px', fontWeight: 900, marginTop: '6px', letterSpacing: '-0.02em' }}>
            {stats.todayEarnings.toLocaleString()} so'm
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '12px', opacity: 0.85 }}>
            <span>{stats.todayDeliveries} deliveries</span>
            <span>{stats.todayDistance} km</span>
            <span>{stats.avgDeliveryTime} min avg</span>
          </div>
        </div>

        {/* Period Earnings */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {[
            { label: 'This Week', value: `${(stats.weeklyEarnings / 1000).toFixed(0)}k so'm`, icon: <TrendingUp size={16} color="var(--color-primary)" /> },
            { label: 'This Month', value: `${(stats.monthlyEarnings / 1000).toFixed(0)}k so'm`, icon: <DollarSign size={16} color="var(--color-success)" /> },
            { label: 'Avg Fee', value: `${stats.avgDeliveryFee.toLocaleString()} so'm`, icon: <Award size={16} color="#D4A017" /> },
            { label: 'Completion', value: `${stats.completionRate}%`, icon: <Star size={16} color="var(--color-warning)" /> },
          ].map((item) => (
            <div key={item.label} style={{
              background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
              padding: '14px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-card)',
            }}>
              <div style={{ marginBottom: '8px' }}>{item.icon}</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>{item.value}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Weekly Chart */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
          padding: '16px', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)', marginBottom: '20px',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Weekly Earnings
          </h3>
          <div className="earnings-bar">
            {weeklyEarnings.map((day, i) => {
              const height = day.earnings > 0 ? Math.max((day.earnings / maxEarning) * 100, 8) : 4;
              const isToday = i === new Date().getDay() - 1 || (i === 6 && new Date().getDay() === 0);
              return (
                <div key={day.day} className="bar-col">
                  <div className={`bar ${isToday ? 'active' : ''}`}
                    style={{ height: `${height}%` }} />
                  <span className="bar-label">{day.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
          padding: '16px', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
            Summary
          </h3>
          {[
            { label: 'Total Deliveries', value: stats.monthlyDeliveries, icon: <Package size={14} /> },
            { label: 'Total Distance', value: `${stats.monthlyDistance} km`, icon: <MapPin size={14} /> },
            { label: 'Avg Rating', value: stats.avgRating, icon: <Star size={14} fill="#D4A017" color="#D4A017" /> },
            { label: 'Online Hours (Week)', value: `${stats.onlineHoursWeek}h`, icon: <Clock size={14} /> },
          ].map((item, i) => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
                {item.label}
              </div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
