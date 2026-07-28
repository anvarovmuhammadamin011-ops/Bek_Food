import React, { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DollarSign,
  Package,
  XCircle,
  ChefHat,
  Clock,
  TrendingUp,
  TrendingDown,
  Bell,
  LogOut,
  Utensils,
  BarChart3,
  ClipboardList,
  ArrowRight,
  Home,
  ShoppingBag,
  Settings,
  LayoutGrid,
} from 'lucide-react';

const s = {
  page: {
    minHeight: '100dvh',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    paddingBottom: 88,
  },
  content: {
    padding: '16px',
    maxWidth: 600,
    margin: '0 auto',
    width: '100%',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: 'var(--text)',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  headerSub: {
    color: 'var(--text-muted)',
    fontSize: 13,
    margin: '2px 0 0 0',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 12,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: 'var(--shadow-sm)',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    background: 'var(--danger)',
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
    lineHeight: 1,
  },
  heroCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: 24,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-md)',
  },
  heroGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroLabel: {
    color: 'var(--text-muted)',
    fontSize: 13,
    margin: '0 0 4px 0',
  },
  heroValue: {
    fontSize: 32,
    fontWeight: 800,
    color: 'var(--text)',
    margin: 0,
    letterSpacing: '-0.02em',
    fontVariantNumeric: 'tabular-nums',
  },
  heroUnit: {
    fontSize: 16,
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  changeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  changeText: (pos) => ({
    fontSize: 13,
    fontWeight: 600,
    color: pos ? 'var(--success)' : 'var(--danger)',
  }),
  changeSub: {
    color: 'var(--text-muted)',
    fontSize: 12,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: 14,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    transition: 'all 0.2s ease',
    cursor: 'default',
  },
  statIcon: (color) => ({
    width: 36,
    height: 36,
    borderRadius: 10,
    background: `${color}12`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),
  statLabel: {
    color: 'var(--text-muted)',
    fontSize: 11,
    margin: 0,
    fontWeight: 500,
  },
  statValue: {
    color: 'var(--text)',
    fontSize: 18,
    fontWeight: 700,
    margin: '2px 0 0 0',
    fontVariantNumeric: 'tabular-nums',
  },
  sectionCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: 'var(--text)',
    fontSize: 15,
    fontWeight: 700,
    margin: 0,
  },
  seeAllBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 0',
  },
  kanbanRow: {
    display: 'flex',
    gap: 6,
    overflowX: 'auto',
    paddingBottom: 4,
  },
  kanbanItem: {
    minWidth: 72,
    background: 'var(--surface-hover)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '10px 8px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flex: '0 0 auto',
  },
  kanbanCount: (color) => ({
    fontSize: 20,
    fontWeight: 800,
    color,
    margin: 0,
    fontVariantNumeric: 'tabular-nums',
  }),
  kanbanLabel: {
    color: 'var(--text-muted)',
    fontSize: 10,
    margin: '4px 0 0 0',
    fontWeight: 500,
  },
  topItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    background: 'var(--surface-hover)',
    borderRadius: 10,
    border: '1px solid var(--border)',
  },
  rankBadge: (isFirst) => ({
    width: 24,
    height: 24,
    borderRadius: 8,
    background: isFirst ? 'var(--primary-light)' : 'var(--surface-active)',
    color: isFirst ? 'var(--primary)' : 'var(--text-muted)',
    fontSize: 11,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  itemName: {
    color: 'var(--text)',
    fontSize: 13,
    margin: 0,
    fontWeight: 600,
  },
  itemSub: {
    color: 'var(--text-muted)',
    fontSize: 11,
    margin: '2px 0 0 0',
  },
  itemRevenue: {
    color: 'var(--success)',
    fontSize: 13,
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 10,
    marginBottom: 16,
  },
  actionBtn: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '16px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%',
    textAlign: 'left',
    boxShadow: 'var(--shadow-sm)',
  },
  actionIcon: (color) => ({
    width: 40,
    height: 40,
    borderRadius: 12,
    background: `${color}10`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),
  actionLabel: {
    color: 'var(--text)',
    fontSize: 14,
    fontWeight: 600,
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: 'rgba(255,255,255,0.82)',
    WebkitBackdropFilter: 'blur(20px)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid var(--border)',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
  },
  bottomNavInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 60,
    maxWidth: 600,
    margin: '0 auto',
  },
  navItem: (active) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    flex: 1,
    height: '100%',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    color: active ? 'var(--primary)' : 'var(--text-muted)',
  }),
  navIcon: {
    width: 24,
    height: 24,
  },
  navLabel: (active) => ({
    fontSize: 10,
    fontWeight: active ? 700 : 500,
    color: 'inherit',
    margin: 0,
    lineHeight: 1,
  }),
  navActiveDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    background: 'var(--primary)',
    marginTop: 1,
  },
};

const formatCurrency = (v) => v.toLocaleString('uz-UZ');

const Sparkline = ({ data, width = 120, height = 32 }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline
        points={points}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return (
          <circle key={i} cx={x} cy={y} r="2.5" fill="var(--primary)" />
        );
      })}
    </svg>
  );
};

const WeekBarChart = ({ data, days }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const barWidth = 36;
  const gap = 12;
  const chartHeight = 120;
  const svgWidth = data.length * (barWidth + gap) - gap;
  return (
    <svg
      width="100%"
      height={chartHeight + 28}
      viewBox={`0 0 ${svgWidth} ${chartHeight + 28}`}
      style={{ display: 'block' }}
      preserveAspectRatio="xMidYMid meet"
    >
      {data.map((v, i) => {
        const barH = (v / max) * chartHeight;
        const x = i * (barWidth + gap);
        const y = chartHeight - barH;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barH}
              rx="6"
              fill="var(--primary)"
              opacity="0.15"
              style={{ transition: 'height 0.6s ease, y 0.6s ease' }}
            />
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barH}
              rx="6"
              fill="var(--primary)"
              style={{ transition: 'height 0.6s ease, y 0.6s ease' }}
            />
            <text
              x={x + barWidth / 2}
              y={chartHeight + 18}
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize="11"
            >
              {days && days[i] ? days[i] : ''}
            </text>
            <text
              x={x + barWidth / 2}
              y={y - 6}
              textAnchor="middle"
              fill="var(--text-secondary)"
              fontSize="10"
              fontWeight="600"
            >
              {formatCurrency(v)}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default function SellerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    sellerStats,
    orders,
    sellerNotifications,
    logout,
  } = useStore();

  const [animatedRevenue, setAnimatedRevenue] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const stats = sellerStats || {};
  const todayRevenue = stats.todayRevenue || 0;
  const revenueChange = stats.revenueChange || 0;
  const sparklineData = stats.sparklineData || [];
  const weekChart = stats.weekChart || [];
  const weekDays = stats.weekDays || ['Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan', 'Yak'];
  const topSelling = stats.topSelling || [];
  const orderStats = stats.orders || {};
  const avgPrepTime = stats.avgPrepTime || 0;

  const unreadNotifs = sellerNotifications
    ? sellerNotifications.filter((n) => !n.read).length
    : 0;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (todayRevenue === 0) {
      setAnimatedRevenue(0);
      return;
    }
    let start = 0;
    const duration = 1200;
    const step = todayRevenue / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= todayRevenue) {
        start = todayRevenue;
        clearInterval(timer);
      }
      setAnimatedRevenue(Math.round(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isLoaded, todayRevenue]);

  const kanbanColumns = [
    { key: 'yangi', label: 'Yangi', count: orderStats.yangi || 0, color: 'var(--primary)' },
    { key: 'tasdiqlandi', label: 'Tasdiqlandi', count: orderStats.tasdiqlandi || 0, color: '#3B82F6' },
    { key: 'tayyor', label: 'Tayyor', count: orderStats.tayyor || 0, color: 'var(--success)' },
    { key: 'kuryerga', label: 'Kuryerga', count: orderStats.kuryerga || 0, color: 'var(--warning)' },
    { key: 'yakunlandi', label: 'Yakunlandi', count: orderStats.yakunlandi || 0, color: '#8B5CF6' },
  ];

  const quickActions = [
    { label: 'Buyurtmalar', icon: ClipboardList, path: '/seller/orders', color: 'var(--primary)' },
    { label: 'Menyu', icon: Utensils, path: '/seller/menu', color: 'var(--success)' },
    { label: 'Inventarizatsiya', icon: Package, path: '/seller/inventory', color: 'var(--warning)' },
    { label: 'Statistika', icon: BarChart3, path: '/seller/stats', color: '#3B82F6' },
  ];

  const navItems = [
    { label: 'Bosh sahifa', icon: Home, path: '/seller' },
    { label: 'Buyurtmalar', icon: ShoppingBag, path: '/seller/orders' },
    { label: 'Menyu', icon: Utensils, path: '/seller/menu' },
    { label: 'Analitika', icon: BarChart3, path: '/seller/analytics' },
    { label: 'Sozlamalar', icon: Settings, path: '/seller/settings' },
  ];

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/seller') return location.pathname === '/seller';
    return location.pathname.startsWith(path);
  };

  return (
    <div style={s.page}>
      <div style={s.scrollArea}>
        <div style={s.content}>
          <div style={s.header}>
            <div>
              <h1 style={s.headerTitle}>Sotuvchi paneli</h1>
              {user && (
                <p style={s.headerSub}>
                  {user.name || user.phone || 'Sotuvchi'}
                </p>
              )}
            </div>
            <div style={s.headerActions}>
              <button
                style={s.iconBtn}
                onClick={() => navigate('/seller/notifications')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <Bell size={20} color="var(--text-muted)" />
                {unreadNotifs > 0 && (
                  <span style={s.badge}>
                    {unreadNotifs > 9 ? '9+' : unreadNotifs}
                  </span>
                )}
              </button>
              <button
                style={s.iconBtn}
                onClick={handleLogout}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--danger)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <LogOut size={18} color="var(--text-muted)" />
              </button>
            </div>
          </div>

          <div style={s.heroCard}>
            <div style={s.heroGlow} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={s.heroLabel}>Bugungi tushum</p>
                <p style={s.heroValue}>
                  {formatCurrency(animatedRevenue)}{' '}
                  <span style={s.heroUnit}>so'm</span>
                </p>
                <div style={s.changeRow}>
                  {revenueChange >= 0 ? (
                    <TrendingUp size={14} color="var(--success)" />
                  ) : (
                    <TrendingDown size={14} color="var(--danger)" />
                  )}
                  <span style={s.changeText(revenueChange >= 0)}>
                    {revenueChange >= 0 ? '+' : ''}
                    {revenueChange}%
                  </span>
                  <span style={s.changeSub}>kechagiga nisbatan</span>
                </div>
              </div>
              <div style={{ flexShrink: 0 }}>
                <Sparkline data={sparklineData.length ? sparklineData : [10, 18, 15, 22, 28, 24, 32]} />
              </div>
            </div>
          </div>

          <div style={s.statsGrid}>
            {[
              { icon: Package, label: 'Buyurtmalar', value: orderStats.total || 0, color: '#3B82F6' },
              { icon: XCircle, label: 'Bekor qilingan', value: orderStats.cancelled || 0, color: 'var(--danger)' },
              { icon: ChefHat, label: 'Tayyorlanayotgan', value: orderStats.preparing || 0, color: 'var(--warning)' },
              { icon: Clock, label: 'Kuryer kutayotgan', value: orderStats.waitingCourier || 0, color: '#60A5FA' },
              { icon: Clock, label: "O'rtacha tayyorlash", value: `${avgPrepTime} daq`, color: '#8B5CF6' },
              { icon: DollarSign, label: 'Daromad', value: formatCurrency(todayRevenue), color: 'var(--success)' },
            ].map((stat, i) => (
              <div
                key={i}
                style={s.statCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={s.statIcon(stat.color)}>
                  <stat.icon size={18} color={stat.color} />
                </div>
                <div>
                  <p style={s.statLabel}>{stat.label}</p>
                  <p style={s.statValue}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={s.sectionCard}>
            <div style={s.sectionHeader}>
              <h3 style={s.sectionTitle}>Buyurtmalar holati</h3>
              <button
                style={s.seeAllBtn}
                onClick={() => navigate('/seller/orders')}
              >
                Barchasi <ArrowRight size={14} />
              </button>
            </div>
            <div style={s.kanbanRow}>
              {kanbanColumns.map((col) => (
                <div
                  key={col.key}
                  style={s.kanbanItem}
                  onClick={() => navigate('/seller/orders')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-strong)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <p style={s.kanbanCount(col.color)}>{col.count}</p>
                  <p style={s.kanbanLabel}>{col.label}</p>
                </div>
              ))}
            </div>
          </div>

          {topSelling.length > 0 && (
            <div style={s.sectionCard}>
              <h3 style={{ ...s.sectionTitle, marginBottom: 12 }}>Eng ko'p sotilgan</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {topSelling.slice(0, 5).map((item, i) => (
                  <div key={i} style={s.topItem}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={s.rankBadge(i === 0)}>{i + 1}</span>
                      <div>
                        <p style={s.itemName}>{item.name}</p>
                        <p style={s.itemSub}>{item.sold} ta sotildi</p>
                      </div>
                    </div>
                    <span style={s.itemRevenue}>
                      {formatCurrency(item.revenue)} so'm
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {weekChart.length > 0 && (
            <div style={s.sectionCard}>
              <h3 style={{ ...s.sectionTitle, marginBottom: 14 }}>Haftalik tushum</h3>
              <WeekBarChart data={weekChart} days={weekDays} />
            </div>
          )}

          <div>
            <h3 style={{ ...s.sectionTitle, marginBottom: 10 }}>Tezkor amallar</h3>
            <div style={s.actionsGrid}>
              {quickActions.map((action) => (
                <button
                  key={action.path}
                  style={s.actionBtn}
                  onClick={() => navigate(action.path)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-strong)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <div style={s.actionIcon(action.color)}>
                    <action.icon size={20} color={action.color} />
                  </div>
                  <span style={s.actionLabel}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <nav style={s.bottomNav}>
        <div style={s.bottomNavInner}>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                style={s.navItem(active)}
                onClick={() => navigate(item.path)}
              >
                <item.icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                <span style={s.navLabel(active)}>{item.label}</span>
                {active && <div style={s.navActiveDot} />}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
