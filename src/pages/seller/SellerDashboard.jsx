import React, { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Package,
  XCircle,
  ChefHat,
  Clock,
  TrendingUp,
  Bell,
  LogOut,
  Utensils,
  BarChart3,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';

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
        stroke="#e51e1e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return (
          <circle key={i} cx={x} cy={y} r="2.5" fill="#e51e1e" />
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
              rx="4"
              fill="#e51e1e"
              style={{ transition: 'height 0.6s ease, y 0.6s ease' }}
            />
            <text
              x={x + barWidth / 2}
              y={chartHeight + 18}
              textAnchor="middle"
              fill="#888"
              fontSize="11"
            >
              {days && days[i] ? days[i] : ''}
            </text>
            <text
              x={x + barWidth / 2}
              y={y - 6}
              textAnchor="middle"
              fill="#ccc"
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
    { key: 'yangi', label: 'Yangi', count: orderStats.yangi || 0, color: '#e51e1e' },
    { key: 'tasdiqlandi', label: 'Tasdiqlandi', count: orderStats.tasdiqlandi || 0, color: '#3b82f6' },
    { key: 'tayyor', label: "Tayyor", count: orderStats.tayyor || 0, color: '#22c55e' },
    { key: 'kuryerga', label: 'Kuryerga', count: orderStats.kuryerga || 0, color: '#f59e0b' },
    { key: 'yakunlandi', label: 'Yakunlandi', count: orderStats.yakunlandi || 0, color: '#8b5cf6' },
  ];

  const quickActions = [
    { label: 'Buyurtmalar', icon: ClipboardList, path: '/seller/orders', color: '#e51e1e' },
    { label: 'Menyu', icon: Utensils, path: '/seller/menu', color: '#22c55e' },
    { label: 'Inventarizatsiya', icon: Package, path: '/seller/inventory', color: '#f59e0b' },
    { label: 'Statistika', icon: BarChart3, path: '/seller/stats', color: '#3b82f6' },
  ];

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="p-4">
        {/* Header */}
        <div
          className="flex items-center justify-between animate-fade-in"
          style={{ marginBottom: 20 }}
        >
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: '#fff',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Sotuvchi paneli
            </h1>
            {user && (
              <p style={{ color: '#888', fontSize: 13, margin: '2px 0 0 0' }}>
                {user.name || user.phone || 'Sotuvchi'}
              </p>
            )}
          </div>
          <div className="flex items-center" style={{ gap: 12 }}>
            <button
              className="card-interactive"
              onClick={() => navigate('/seller/notifications')}
              style={{
                position: 'relative',
                width: 40,
                height: 40,
                borderRadius: 12,
                background: '#141414',
                border: '1px solid #222',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <Bell size={20} color="#aaa" />
              {unreadNotifs > 0 && (
                <span
                  className="badge badge-red"
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#e51e1e',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                  }}
                >
                  {unreadNotifs > 9 ? '9+' : unreadNotifs}
                </span>
              )}
            </button>
            <button
              onClick={handleLogout}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: '#141414',
                border: '1px solid #222',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <LogOut size={18} color="#aaa" />
            </button>
          </div>
        </div>

        {/* Revenue Hero */}
        <div
          className={`card card-hover animate-fade-in-up ${isLoaded ? '' : ''}`}
          style={{
            background: 'linear-gradient(135deg, #141414 0%, #1a1a1a 50%, #1f1012 100%)',
            border: '1px solid #222',
            borderRadius: 16,
            padding: 24,
            marginBottom: 16,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(229,30,30,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#888', fontSize: 13, margin: '0 0 4px 0' }}>
                Bugungi tushum
              </p>
              <p
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: '#fff',
                  margin: 0,
                  letterSpacing: '-0.02em',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatCurrency(animatedRevenue)} <span style={{ fontSize: 18, color: '#888', fontWeight: 500 }}>so'm</span>
              </p>
              <div
                className="flex items-center"
                style={{ gap: 4, marginTop: 8 }}
              >
                <TrendingUp
                  size={14}
                  color={revenueChange >= 0 ? '#22c55e' : '#e51e1e'}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: revenueChange >= 0 ? '#22c55e' : '#e51e1e',
                  }}
                >
                  {revenueChange >= 0 ? '+' : ''}
                  {revenueChange}%
                </span>
                <span style={{ color: '#666', fontSize: 12 }}>kechagiga nisbatan</span>
              </div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Sparkline data={sparklineData.length ? sparklineData : [10, 18, 15, 22, 28, 24, 32]} />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10,
            marginBottom: 16,
          }}
        >
          {[
            { icon: Package, label: 'Buyurtmalar', value: orderStats.total || 0, color: '#3b82f6', cls: 'animate-fade-in-up' },
            { icon: XCircle, label: 'Bekor qilinganlar', value: orderStats.cancelled || 0, color: '#e51e1e', cls: 'animate-fade-in-up' },
            { icon: ChefHat, label: 'Tayyorlanayotganlar', value: orderStats.preparing || 0, color: '#f59e0b', cls: 'animate-fade-in-up' },
            { icon: Clock, label: 'Kuryer kutayotganlar', value: orderStats.waitingCourier || 0, color: '#60a5fa', cls: 'animate-fade-in-up' },
            { icon: Clock, label: "O'rtacha tayyorlash", value: `${avgPrepTime} daq`, color: '#a78bfa', cls: 'animate-fade-in-up' },
            { icon: DollarSign, label: 'Daromad', value: formatCurrency(todayRevenue), color: '#22c55e', cls: 'animate-fade-in-up' },
          ].map((s, i) => (
            <div
              key={i}
              className={`card card-hover ${s.cls}`}
              style={{
                background: '#141414',
                border: '1px solid #1e1e1e',
                borderRadius: 14,
                padding: 14,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                transition: 'border-color 0.2s, transform 0.15s',
                cursor: 'default',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `${s.color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <s.icon size={18} color={s.color} />
              </div>
              <div>
                <p style={{ color: '#777', fontSize: 11, margin: 0, fontWeight: 500 }}>
                  {s.label}
                </p>
                <p
                  style={{
                    color: '#fff',
                    fontSize: 18,
                    fontWeight: 700,
                    margin: '2px 0 0 0',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Kanban Preview */}
        <div
          className="card animate-fade-in-up"
          style={{
            background: '#141414',
            border: '1px solid #1e1e1e',
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
            <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: 0 }}>
              Buyurtmalar holati
            </h3>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/seller/orders')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#e51e1e',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 0',
              }}
            >
              Barchasi <ArrowRight size={14} />
            </button>
          </div>
          <div
            className="flex"
            style={{
              gap: 6,
              overflowX: 'auto',
              paddingBottom: 4,
            }}
          >
            {kanbanColumns.map((col, i) => (
              <div
                key={col.key}
                onClick={() => navigate('/seller/orders')}
                style={{
                  minWidth: 72,
                  background: '#1a1a1a',
                  border: '1px solid #222',
                  borderRadius: 10,
                  padding: '10px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, transform 0.15s',
                  flex: '0 0 auto',
                }}
              >
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: col.color,
                    margin: 0,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {col.count}
                </p>
                <p style={{ color: '#888', fontSize: 10, margin: '4px 0 0 0', fontWeight: 500 }}>
                  {col.label}
                </p>
                {i < kanbanColumns.length - 1 && (
                  <span
                    style={{
                      display: 'none',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Items */}
        {topSelling.length > 0 && (
          <div
            className="card animate-fade-in-up"
            style={{
              background: '#141414',
              border: '1px solid #1e1e1e',
              borderRadius: 14,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: '0 0 12px 0' }}>
              Eng ko'p sotilgan
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topSelling.slice(0, 5).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between"
                  style={{
                    padding: '10px 12px',
                    background: '#1a1a1a',
                    borderRadius: 10,
                    border: '1px solid #222',
                  }}
                >
                  <div className="flex items-center" style={{ gap: 10 }}>
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 8,
                        background: i === 0 ? '#e51e1e20' : '#222',
                        color: i === 0 ? '#e51e1e' : '#888',
                        fontSize: 11,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p style={{ color: '#ddd', fontSize: 13, margin: 0, fontWeight: 600 }}>
                        {item.name}
                      </p>
                      <p style={{ color: '#777', fontSize: 11, margin: '2px 0 0 0' }}>
                        {item.sold} ta sotildi
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      color: '#22c55e',
                      fontSize: 13,
                      fontWeight: 700,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {formatCurrency(item.revenue)} so'm
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Revenue Chart */}
        {weekChart.length > 0 && (
          <div
            className="card animate-fade-in-up"
            style={{
              background: '#141414',
              border: '1px solid #1e1e1e',
              borderRadius: 14,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: '0 0 14px 0' }}>
              Haftalik tushum
            </h3>
            <WeekBarChart data={weekChart} days={weekDays} />
          </div>
        )}

        {/* Quick Actions */}
        <div
          className="animate-fade-in-up"
          style={{ marginBottom: 16 }}
        >
          <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: '0 0 10px 0' }}>
            Tezkor amallar
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 10,
            }}
          >
            {quickActions.map((action) => (
              <button
                key={action.path}
                className="btn btn-primary card-hover"
                onClick={() => navigate(action.path)}
                style={{
                  background: '#141414',
                  border: '1px solid #1e1e1e',
                  borderRadius: 14,
                  padding: '16px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, transform 0.15s',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: `${action.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <action.icon size={20} color={action.color} />
                </div>
                <span style={{ color: '#ddd', fontSize: 14, fontWeight: 600 }}>
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
