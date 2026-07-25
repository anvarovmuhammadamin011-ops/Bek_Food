import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ icon, iconBg, label, value, change, changeType, style = {} }) {
  return (
    <div className="admin-stat-card" style={style}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div className="admin-stat-icon" style={{ background: iconBg || 'var(--color-primary-light)' }}>
          {icon}
        </div>
        {change !== undefined && (
          <span className={`admin-stat-trend ${changeType === 'up' ? 'up' : 'down'}`}>
            {changeType === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {change}%
          </span>
        )}
      </div>
      <div className="admin-stat-value">{value}</div>
      <div className="admin-stat-label">{label}</div>
    </div>
  );
}
