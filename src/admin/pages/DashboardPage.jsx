import { useState, useEffect, useRef } from 'react';
import {
  ShoppingCart, DollarSign, Clock, CheckCircle, XCircle, TrendingUp, Users,
  Package, AlertTriangle, Flame, Timer, ArrowUpRight, ArrowDownRight,
  Plus, FolderPlus, Tag as TagIcon, BarChart3, Settings, UserPlus,
  CircleAlert, Edit3, Trash2, Wifi, Database, HardDrive, Server,
  Clock3, Shield, ArrowRight, ChevronRight, Activity, Zap,
} from 'lucide-react';
import useAdminStore from '../store/useAdminStore';

/* ── Animated Counter ── */
function AnimatedNumber({ value, prefix = '', suffix = '', duration = 800 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const numericValue = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g, ''), 10) || 0;

  useEffect(() => {
    let start = 0;
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (numericValue - start) * eased));
      if (progress < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [numericValue, duration]);

  return <>{prefix}{display.toLocaleString()}{suffix}</>;
}

/* ── SVG Mini Chart ── */
function MiniChart({ data, color = 'var(--color-primary)', height = 40 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 80;
    return `${x},${y}`;
  }).join(' ');
  const id = `mg-${color.replace(/[^a-z0-9]/gi, '')}-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height }}>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,100 ${points} 100,100`} fill={`url(#${id})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Bar Chart ── */
function BarChart({ data, maxVal, labelKey, valueKey, color }) {
  const max = maxVal || Math.max(...data.map(d => d[valueKey]));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '120px', padding: '0 4px' }}>
      {data.map((d, i) => {
        const pct = (d[valueKey] / max) * 100;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)' }}>{d[valueKey]}</span>
            <div style={{ width: '100%', height: '80px', display: 'flex', alignItems: 'flex-end' }}>
              <div style={{
                width: '100%',
                height: `${pct}%`,
                borderRadius: '6px 6px 2px 2px',
                background: color || 'linear-gradient(180deg, var(--color-primary), var(--color-terracotta))',
                transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: '4px',
              }} />
            </div>
            <span style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)' }}>{d[labelKey]}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Status Colors Map ── */
const statusColors = {
  pending: { bg: 'var(--color-warning-light)', color: 'var(--color-warning)' },
  accepted: { bg: 'var(--color-primary-light)', color: 'var(--color-primary)' },
  preparing: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
  ready: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  out_for_delivery: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' },
  delivered: { bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  cancelled: { bg: 'var(--color-danger-light)', color: 'var(--color-danger)' },
  assigned: { bg: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9' },
};

const activityIcons = {
  plus: { icon: Plus, bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  edit: { icon: Edit3, bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
  tag: { icon: TagIcon, bg: 'var(--color-primary-light)', color: 'var(--color-primary)' },
  folder: { icon: FolderPlus, bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' },
  'user-plus': { icon: UserPlus, bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  trash: { icon: Trash2, bg: 'var(--color-danger-light)', color: 'var(--color-danger)' },
  settings: { icon: Settings, bg: 'var(--bg-secondary)', color: 'var(--text-secondary)' },
};

/* ═══════════════════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const {
    dailyStats, weeklyData, orders, topFoods, peakHours,
    topCategories, recentActivity, inventory, restaurantStatus,
    systemHealth, setActivePage,
  } = useAdminStore();

  const recentOrders = orders.slice(0, 5);
  const lowStockItems = inventory.filter((i) => i.stock <= i.lowStock);

  return (
    <div>
      {/* ── STAT CARDS ── */}
      <div className="admin-grid-stats">
        {[
          { icon: DollarSign, label: "Today's Revenue", value: dailyStats.revenue, prefix: '', format: true, suffix: " so'm", color: 'var(--color-success)', bg: 'var(--color-success-light)', change: 8, up: true },
          { icon: ShoppingCart, label: "Today's Orders", value: dailyStats.orders, color: 'var(--color-primary)', bg: 'var(--color-primary-light)', change: 12, up: true },
          { icon: Clock, label: 'Pending Orders', value: dailyStats.pending, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
          { icon: Flame, label: 'Preparing', value: dailyStats.preparing, color: 'var(--color-warning)', bg: 'var(--color-warning-light)' },
        ].map((stat, i) => (
          <div key={i} className={`admin-stat-card admin-animate-in admin-animate-in-delay-${i + 1}`}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div className="admin-stat-icon" style={{ background: stat.bg }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              {stat.change !== undefined && (
                <span className={`admin-stat-trend ${stat.up ? 'up' : 'down'}`}>
                  {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.change}%
                </span>
              )}
            </div>
            <div className="admin-stat-value">
              {stat.format
                ? <><AnimatedNumber value={Math.round(stat.value / 1000)} />K</>
                : <AnimatedNumber value={stat.value} />
              }
            </div>
            <div className="admin-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Second row of stats */}
      <div className="admin-grid-stats" style={{ marginBottom: '24px' }}>
        {[
          { icon: CheckCircle, label: 'Completed', value: dailyStats.completed, color: 'var(--color-success)', bg: 'var(--color-success-light)', change: 15, up: true },
          { icon: XCircle, label: 'Cancelled', value: dailyStats.cancelled, color: 'var(--color-danger)', bg: 'var(--color-danger-light)', change: 5, up: false },
          { icon: Users, label: 'Total Customers', value: dailyStats.totalCustomers, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
          { icon: Timer, label: 'Avg Order Value', value: dailyStats.avgOrderValue, prefix: '', format: true, suffix: '', color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
        ].map((stat, i) => (
          <div key={i} className={`admin-stat-card admin-animate-in admin-animate-in-delay-${i + 5}`}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div className="admin-stat-icon" style={{ background: stat.bg }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              {stat.change !== undefined && (
                <span className={`admin-stat-trend ${stat.up ? 'up' : 'down'}`}>
                  {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.change}%
                </span>
              )}
            </div>
            <div className="admin-stat-value">
              {stat.format
                ? <>{stat.prefix || ''}<AnimatedNumber value={Math.round(stat.value / 1000)} />K</>
                : <>{stat.prefix || ''}<AnimatedNumber value={stat.value} /></>
              }
            </div>
            <div className="admin-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="admin-section-title">Quick Actions</div>
      <div className="admin-grid-quick" style={{ marginBottom: '28px' }}>
        {[
          { icon: Plus, label: 'Add Product', bg: 'var(--color-primary-light)', color: 'var(--color-primary)', page: 'food' },
          { icon: FolderPlus, label: 'New Category', bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', page: 'categories' },
          { icon: TagIcon, label: 'Promotion', bg: 'var(--color-success-light)', color: 'var(--color-success)', page: 'promotions' },
          { icon: BarChart3, label: 'Analytics', bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', page: 'analytics' },
          { icon: Settings, label: 'Settings', bg: 'var(--bg-secondary)', color: 'var(--text-secondary)', page: 'settings' },
          { icon: UserPlus, label: 'Manage Staff', bg: 'var(--color-warning-light)', color: 'var(--color-warning)', page: 'drivers' },
        ].map((action, i) => (
          <button
            key={i}
            className={`admin-quick-action admin-animate-in admin-animate-in-delay-${i + 1}`}
            onClick={() => setActivePage(action.page)}
          >
            <div className="admin-quick-action-icon" style={{ background: action.bg }}>
              <action.icon size={22} color={action.color} />
            </div>
            <span className="admin-quick-action-label">{action.label}</span>
          </button>
        ))}
      </div>

      {/* ── CHARTS ROW: Weekly Sales + Top Foods ── */}
      <div className="admin-grid-2">
        {/* Weekly Sales */}
        <div className="admin-card admin-animate-in">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-title">Weekly Sales</div>
              <div className="admin-card-subtitle">Revenue trend this week</div>
            </div>
            <div className="admin-badge info">This Week</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {weeklyData.map((day) => (
              <div key={day.day} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', width: '30px' }}>{day.day}</span>
                <div className="admin-chart-bar" style={{ flex: 1 }}>
                  <div className="admin-chart-bar-fill" style={{ width: `${(day.revenue / 1500000) * 100}%` }} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', width: '60px', textAlign: 'right' }}>
                  {(day.revenue / 1000).toFixed(0)}K
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Foods */}
        <div className="admin-card admin-animate-in admin-animate-in-delay-2">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-title">Top Selling Foods</div>
              <div className="admin-card-subtitle">Best performers this month</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topFoods.map((food, i) => (
              <div key={food.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '26px', height: '26px', borderRadius: '8px',
                  background: i === 0 ? 'var(--color-primary)' : 'var(--bg-secondary)',
                  color: i === 0 ? 'white' : 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700, flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{food.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{food.orders} orders</div>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {(food.revenue / 1000).toFixed(0)}K
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Charts Row 2: Peak Hours + Top Categories ── */}
      <div className="admin-grid-2">
        {/* Peak Hours */}
        <div className="admin-card admin-animate-in">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-title">Peak Hours</div>
              <div className="admin-card-subtitle">Orders by hour today</div>
            </div>
          </div>
          <BarChart data={peakHours} maxVal={35} labelKey="hour" valueKey="orders" />
        </div>

        {/* Top Categories */}
        <div className="admin-card admin-animate-in admin-animate-in-delay-2">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-title">Top Categories</div>
              <div className="admin-card-subtitle">Sales distribution</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {topCategories.map((cat) => (
              <div key={cat.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>{cat.percentage}%</span>
                </div>
                <div className="admin-chart-bar">
                  <div className="admin-chart-bar-fill" style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Activity + Low Stock Alerts ── */}
      <div className="admin-grid-2">
        {/* Recent Activity */}
        <div className="admin-card admin-animate-in">
          <div className="admin-card-header">
            <div className="admin-card-title">Recent Activity</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recentActivity.map((item) => {
              const ai = activityIcons[item.icon] || activityIcons.plus;
              const Icon = ai.icon;
              return (
                <div key={item.id} className="admin-activity-item">
                  <div className="admin-activity-icon" style={{ background: ai.bg }}>
                    <Icon size={16} color={ai.color} />
                  </div>
                  <div className="admin-activity-info">
                    <div className="admin-activity-action">{item.action}</div>
                    <div className="admin-activity-detail">{item.detail}</div>
                    <div className="admin-activity-meta">
                      <span>{item.user}</span>
                      <span>·</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="admin-card admin-animate-in admin-animate-in-delay-2">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-title">Low Stock Alerts</div>
              <div className="admin-card-subtitle">{lowStockItems.length} items need restocking</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {lowStockItems.map((item) => {
              const critical = item.stock <= item.lowStock * 0.5;
              return (
                <div key={item.id} className={`admin-low-stock-item${critical ? ' critical' : ''}`}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: critical ? 'var(--color-danger-light)' : 'var(--color-warning-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <AlertTriangle size={18} color={critical ? 'var(--color-danger)' : 'var(--color-warning)'} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: critical ? 'var(--color-danger)' : 'var(--color-warning)' }}>
                      {item.stock} {item.unit} remaining
                    </div>
                  </div>
                  <button className="admin-restock-btn primary">Restock</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <div className="admin-card admin-animate-in" style={{ marginBottom: '24px' }}>
        <div className="admin-card-header">
          <div className="admin-card-title">Recent Orders</div>
          <button
            onClick={() => setActivePage('orders')}
            style={{
              background: 'none', border: 'none', color: 'var(--color-primary)',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-family)',
            }}
          >
            View All <ArrowUpRight size={12} />
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr>
                {['Order', 'Customer', 'Items', 'Total', 'Status', 'Time'].map((h) => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 12px', fontSize: '11px',
                    fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase',
                    letterSpacing: '0.05em', borderBottom: '1px solid var(--border)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const sc = statusColors[order.status] || statusColors.pending;
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {order.orderNumber}
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {order.customerName}
                    </td>
                    <td style={{ padding: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {order.items.map((it) => `${it.qty}x ${it.name}`).join(', ')}
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {order.total.toLocaleString()} so'm
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        fontSize: '10px', fontWeight: 600, padding: '3px 10px',
                        borderRadius: '9999px', background: sc.bg, color: sc.color,
                        textTransform: 'capitalize', display: 'inline-block',
                      }}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(order.orderTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Restaurant Status + System Health ── */}
      <div className="admin-grid-2">
        {/* Restaurant Status */}
        <div className="admin-card admin-animate-in">
          <div className="admin-card-header">
            <div className="admin-card-title">Restaurant Status</div>
            <span className={`admin-badge ${restaurantStatus.isOpen ? 'success' : 'danger'}`}>
              {restaurantStatus.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Working Hours', value: `${restaurantStatus.openTime} — ${restaurantStatus.closeTime}`, icon: Clock3 },
              { label: 'Current Orders', value: restaurantStatus.currentOrders, icon: ShoppingCart },
              { label: 'Kitchen Status', value: restaurantStatus.kitchenStatus, icon: Flame, dot: 'green' },
              { label: 'Online Status', value: restaurantStatus.onlineStatus, icon: Wifi, dot: 'green' },
              { label: 'Delivery Status', value: restaurantStatus.deliveryStatus, icon: Activity, dot: 'green' },
            ].map((item, i) => (
              <div key={i} style={{
                padding: '14px', borderRadius: '12px',
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <item.icon size={14} color="var(--text-muted)" />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>{item.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {item.dot && <span className={`admin-status-dot ${item.dot}`} />}
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                    {typeof item.value === 'number' ? item.value : item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="admin-card admin-animate-in admin-animate-in-delay-2">
          <div className="admin-card-header">
            <div className="admin-card-title">System Health</div>
            <div className="admin-badge success">All Operational</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Server Status', value: systemHealth.serverStatus, icon: Server, dot: 'green' },
              { label: 'Database Status', value: systemHealth.databaseStatus, icon: Database, dot: 'green' },
              { label: 'API Status', value: systemHealth.apiStatus, icon: Zap, dot: 'green' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <item.icon size={16} color="var(--text-muted)" />
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{item.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className={`admin-status-dot ${item.dot}`} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-success)', textTransform: 'capitalize' }}>
                    {item.value}
                  </span>
                </div>
              </div>
            ))}

            {/* Storage */}
            <div style={{
              padding: '12px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <HardDrive size={16} color="var(--text-muted)" />
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>Storage Usage</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{systemHealth.storageUsage}%</span>
              </div>
              <div className="admin-chart-bar">
                <div className="admin-chart-bar-fill" style={{
                  width: `${systemHealth.storageUsage}%`,
                  background: systemHealth.storageUsage > 80
                    ? 'linear-gradient(90deg, var(--color-danger), #ff6b6b)'
                    : 'linear-gradient(90deg, var(--color-primary), var(--color-terracotta))',
                }} />
              </div>
            </div>

            {/* Meta info */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px',
              padding: '12px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Last Backup</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{systemHealth.lastBackup}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Version</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>v{systemHealth.version}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


