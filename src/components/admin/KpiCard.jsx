import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ICON_SIZE = 18;

export default function KpiCard({ title, value, subtitle, trend, icon: Icon, color = 'var(--primary)', loading = false, onClick }) {
  const Trend = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? 'var(--success)' : trend < 0 ? 'var(--danger)' : 'var(--text-dim)';
  return (
    <div className="card card-hover" onClick={onClick} style={{ padding: 18, cursor: onClick ? 'pointer' : 'default' }}>
      <div className="flex items-center justify-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        {Icon && (
          <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-sm)', background: `${color}20`, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={ICON_SIZE} />
          </div>
        )}
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{title}</div>
        {loading && <div className="spinner" style={{ width: 16, height: 16, borderTopColor: color }} />}
      </div>
      {loading ? (
        <div className="skeleton skeleton-title" style={{ height: 24, width: '70%' }} />
      ) : (
        <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{value}</div>
      )}
      {subtitle && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{subtitle}</div>}
      {trend !== undefined && !loading && (
        <div className="flex items-center gap-1" style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 12, fontWeight: 600, color: trendColor }}>
          <Trend size={13} />
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  );
}
