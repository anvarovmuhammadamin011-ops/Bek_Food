import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Clock, Target, Repeat } from 'lucide-react';
import useAdminStore from '../store/useAdminStore';

function BarChart({ data, label }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '120px', paddingTop: '10px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{d.value}</span>
          <div style={{
            width: '100%',
            height: `${(d.value / max) * 90}px`,
            borderRadius: '4px 4px 0 0',
            background: 'linear-gradient(180deg, var(--color-primary), var(--color-terracotta))',
            transition: 'height 0.5s ease',
          }} />
          <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments, size = 120 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let cumulative = 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        {segments.map((seg, i) => {
          const offset = (cumulative / total) * circumference;
          const length = (seg.value / total) * circumference;
          cumulative += seg.value;
          return (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="12"
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 50 50)"
            />
          );
        })}
        <text x="50" y="50" textAnchor="middle" dy="5" fontSize="16" fontWeight="800" fill="var(--text-primary)">{total}</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {segments.map((seg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: seg.color }} />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{seg.label}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { dailyStats, weeklyData, monthlyData, topFoods, peakHours } = useAdminStore();

  const orderStatusData = [
    { label: 'Completed', value: dailyStats.completed, color: 'var(--color-success)' },
    { label: 'Active', value: dailyStats.activeOrders, color: '#3b82f6' },
    { label: 'Cancelled', value: dailyStats.cancelled, color: 'var(--color-danger)' },
    { label: 'Pending', value: dailyStats.pending, color: 'var(--color-warning)' },
  ];

  const categoryData = [
    { label: 'Burgers', value: 156, color: 'var(--color-primary)' },
    { label: 'Pizza', value: 134, color: '#3b82f6' },
    { label: 'Chicken', value: 112, color: 'var(--color-warning)' },
    { label: 'Wraps', value: 87, color: 'var(--color-success)' },
    { label: 'Drinks', value: 65, color: '#8b5cf6' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px' }}>
      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {[
          { label: 'Total Revenue', value: `${(dailyStats.revenue * 30 / 1000000).toFixed(1)}M`, change: '+12%', up: true, icon: DollarSign, color: 'var(--color-success)' },
          { label: 'Total Orders', value: dailyStats.orders * 30, change: '+8%', up: true, icon: ShoppingCart, color: 'var(--color-primary)' },
          { label: 'New Customers', value: 156, change: '+23%', up: true, icon: Users, color: '#3b82f6' },
          { label: 'Avg Delivery', value: `${dailyStats.avgDeliveryTime} min`, change: '-5%', up: false, icon: Clock, color: 'var(--color-warning)' },
          { label: 'Repeat Rate', value: '68%', change: '+4%', up: true, icon: Repeat, color: '#8b5cf6' },
          { label: 'Cancellation Rate', value: '8.5%', change: '-2%', up: false, icon: Target, color: 'var(--color-danger)' },
        ].map((kpi, i) => (
          <div key={i} style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 12px rgba(45, 42, 38, 0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon size={18} color={kpi.color} />
              </div>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '11px',
                fontWeight: 600,
                color: kpi.up ? 'var(--color-success)' : 'var(--color-danger)',
              }}>
                {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {kpi.change}
              </span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{kpi.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {/* Weekly Orders */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid var(--border)',
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Weekly Orders</h3>
          <BarChart data={weeklyData.map((d) => ({ label: d.day, value: d.orders }))} />
        </div>

        {/* Order Status */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid var(--border)',
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Order Status Distribution</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <DonutChart segments={orderStatusData} />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '16px',
      }}>
        {/* Peak Hours */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid var(--border)',
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Peak Hours</h3>
          <BarChart data={peakHours.map((d) => ({ label: d.hour.split(':')[0], value: d.orders }))} />
        </div>

        {/* Top Categories */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid var(--border)',
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Top Categories</h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <DonutChart segments={categoryData} size={140} />
          </div>
        </div>

        {/* Monthly Revenue */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid var(--border)',
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Monthly Revenue</h3>
          <BarChart data={monthlyData.map((d) => ({ label: d.month, value: Math.round(d.revenue / 1000000) }))} />
        </div>

        {/* Top Foods */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid var(--border)',
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Top Selling Foods</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topFoods.map((food, i) => (
              <div key={food.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '8px',
                  background: i < 3 ? 'var(--color-primary)' : 'var(--bg-secondary)',
                  color: i < 3 ? 'white' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{food.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{food.orders} orders</div>
                </div>
                <div style={{ width: '80px', height: '6px', borderRadius: '3px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    borderRadius: '3px',
                    background: 'var(--color-primary)',
                    width: `${(food.orders / topFoods[0].orders) * 100}%`,
                  }} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)', width: '60px', textAlign: 'right' }}>
                  {(food.revenue / 1000).toFixed(0)}K
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
