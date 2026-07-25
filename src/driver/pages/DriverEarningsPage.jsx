import { DollarSign, TrendingUp, Calendar, Clock } from 'lucide-react';
import useDriverStore from '../store/useDriverStore';

export default function DriverEarningsPage() {
  const { stats, weeklyEarnings } = useDriverStore();

  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>Daromad</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px', textAlign: 'center' }}>
          <DollarSign size={20} color="var(--color-success)" style={{ margin: '0 auto 8px' }} />
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{(stats.todayEarnings / 1000).toFixed(0)}K</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bugun</div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px', textAlign: 'center' }}>
          <TrendingUp size={20} color="var(--color-primary)" style={{ margin: '0 auto 8px' }} />
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{(stats.weeklyEarnings / 1000).toFixed(0)}K</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bu hafta</div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px', textAlign: 'center' }}>
          <Calendar size={20} color="#8b5cf6" style={{ margin: '0 auto 8px' }} />
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{(stats.monthlyEarnings / 1000000).toFixed(1)}M</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bu oy</div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Haftalik daromad</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
          {weeklyEarnings.map((day, i) => {
            const max = Math.max(...weeklyEarnings.map((d) => d.earnings));
            const pct = (day.earnings / max) * 100;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)' }}>{(day.earnings / 1000).toFixed(0)}K</span>
                <div style={{ width: '100%', height: '80px', display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{
                    width: '100%', height: `${pct}%`, borderRadius: '6px 6px 2px 2px',
                    background: 'linear-gradient(180deg, var(--color-success), #1a9a4a)',
                    minHeight: '4px',
                  }} />
                </div>
                <span style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)' }}>{day.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '20px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Clock size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>O'rtacha yetkazish</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.avgDeliveryTime} daq</div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <DollarSign size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>O'rtacha to'lov</span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{(stats.avgDeliveryFee / 1000).toFixed(0)}K</div>
        </div>
      </div>
    </div>
  );
}
