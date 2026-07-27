import React, { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Clock,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const formatCurrency = (v) => v.toLocaleString('uz-UZ');

const Sparkline = ({ data, width = 140, height = 40, color = '#e51e1e' }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - 4 - ((v - min) / range) * (height - 8);
      return `${x},${y}`;
    })
    .join(' ');
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#sparkFill)" />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - 4 - ((v - min) / range) * (height - 8);
        return <circle key={i} cx={x} cy={y} r="2.5" fill={color} />;
      })}
    </svg>
  );
};

const BarChart = ({ data, labels, height = 140, color = '#e51e1e' }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const barWidth = 36;
  const gap = 12;
  const svgWidth = data.length * (barWidth + gap) - gap;
  return (
    <svg
      width="100%"
      height={height + 30}
      viewBox={`0 0 ${svgWidth} ${height + 30}`}
      style={{ display: 'block' }}
      preserveAspectRatio="xMidYMid meet"
    >
      {data.map((v, i) => {
        const barH = (v / max) * height;
        const x = i * (barWidth + gap);
        const y = height - barH;
        const isMax = v === max;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barH}
              rx="5"
              fill={isMax ? color : `${color}88`}
              style={{ transition: 'height 0.6s ease, y 0.6s ease' }}
            />
            <text
              x={x + barWidth / 2}
              y={y - 8}
              textAnchor="middle"
              fill="#ccc"
              fontSize="10"
              fontWeight="700"
            >
              {formatCurrency(v)}
            </text>
            <text
              x={x + barWidth / 2}
              y={height + 20}
              textAnchor="middle"
              fill="#666"
              fontSize="11"
              fontWeight="500"
            >
              {labels && labels[i] ? labels[i] : ''}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const HorizontalBarChart = ({ data, maxValue, color = '#e51e1e' }) => {
  if (!data || data.length === 0) return null;
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.map((item, i) => {
        const pct = (item.value / max) * 100;
        const isPeak = item.value === max;
        return (
          <div key={i}>
            <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
              <span style={{ color: '#bbb', fontSize: 12, fontWeight: 600 }}>
                {item.label}
              </span>
              <span
                style={{
                  color: isPeak ? '#e51e1e' : '#888',
                  fontSize: 12,
                  fontWeight: isPeak ? 700 : 500,
                }}
              >
                {item.value} buyurtma
              </span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 4,
                background: '#1e1e1e',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  borderRadius: 4,
                  background: isPeak
                    ? `linear-gradient(90deg, ${color}, #ff4444)`
                    : `${color}99`,
                  transition: 'width 0.8s ease',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function SellerAnalytics() {
  const navigate = useNavigate();
  const { sellerStats } = useStore();

  const [period, setPeriod] = useState('today');
  const [isLoaded, setIsLoaded] = useState(false);
  const [animatedRevenue, setAnimatedRevenue] = useState(0);

  const stats = sellerStats || {};
  const periodData = stats[period] || stats.today || {};
  const revenue = periodData.revenue || 0;
  const ordersCount = periodData.orders || 0;
  const avgOrder = ordersCount > 0 ? Math.round(revenue / ordersCount) : 0;
  const topItems = stats.topItems || [];
  const weekChart = stats.weekChart || [];

  const weekDays = ['Dush', 'Sesh', 'Chor', 'Pay', 'Juma', 'Shan', 'Yak'];

  const revenueTrend = period === 'today' ? 12.5 : period === 'week' ? 8.3 : 15.2;
  const isUp = revenueTrend >= 0;

  const hoursData = [
    { label: '08:00 - 10:00', value: 18 },
    { label: '10:00 - 12:00', value: 34 },
    { label: '12:00 - 14:00', value: 52 },
    { label: '14:00 - 16:00', value: 28 },
    { label: '16:00 - 18:00', value: 45 },
    { label: '18:00 - 20:00', value: 61 },
    { label: '20:00 - 22:00', value: 38 },
    { label: '22:00 - 00:00', value: 12 },
  ];

  const paymentMethods = [
    { label: 'Naqd', pct: 70, color: '#22c55e' },
    { label: 'Karta', pct: 20, color: '#3b82f6' },
    { label: 'Click', pct: 10, color: '#f59e0b' },
  ];

  const sparklineData =
    period === 'today'
      ? [120, 180, 150, 220, 280, 240, 310, 290, 350, 320]
      : period === 'week'
      ? weekChart
      : [1200, 1350, 1100, 1420, 1580, 1300, 1500, 1650, 1400, 1700, 1550, 1800];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || revenue === 0) {
      setAnimatedRevenue(0);
      return;
    }
    let start = 0;
    const duration = 1200;
    const step = revenue / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= revenue) {
        start = revenue;
        clearInterval(timer);
      }
      setAnimatedRevenue(Math.round(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isLoaded, revenue, period]);

  const bestSellingItem = topItems.length > 0 ? topItems[0].name : '—';
  const worstSellingItem = topItems.length > 0 ? topItems[topItems.length - 1].name : '—';

  const statCards = [
    {
      icon: Package,
      label: 'Buyurtmalar',
      value: ordersCount,
      color: '#3b82f6',
      badge: null,
    },
    {
      icon: DollarSign,
      label: "O'rtacha summa",
      value: `${formatCurrency(avgOrder)} so'm`,
      color: '#22c55e',
      badge: null,
    },
    {
      icon: ArrowUpRight,
      label: "Eng ko'p sotilgan",
      value: bestSellingItem,
      color: '#e51e1e',
      badge: 'badge-green',
    },
    {
      icon: ArrowDownRight,
      label: 'Eng kam sotilgan',
      value: worstSellingItem,
      color: '#f59e0b',
      badge: 'badge-yellow',
    },
  ];

  const periods = [
    { key: 'today', label: 'Kun' },
    { key: 'week', label: 'Hafta' },
    { key: 'month', label: 'Oy' },
  ];

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="p-4">
        {/* Header */}
        <div
          className="flex items-center justify-between animate-fade-in"
          style={{ marginBottom: 20 }}
        >
          <div className="flex items-center" style={{ gap: 12 }}>
            <button
              onClick={() => navigate(-1)}
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
              <ChevronLeft size={20} color="#aaa" />
            </button>
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
                Statistika
              </h1>
              <p style={{ color: '#888', fontSize: 13, margin: '2px 0 0 0' }}>
                Sotuv tahlillari
              </p>
            </div>
          </div>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: '#e51e1e18',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BarChart3 size={20} color="#e51e1e" />
          </div>
        </div>

        {/* Period Toggle */}
        <div
          className="animate-fade-in"
          style={{
            display: 'flex',
            background: '#141414',
            border: '1px solid #1e1e1e',
            borderRadius: 12,
            padding: 4,
            marginBottom: 16,
            gap: 4,
          }}
        >
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 700,
                transition: 'all 0.2s ease',
                background: period === p.key ? '#e51e1e' : 'transparent',
                color: period === p.key ? '#fff' : '#666',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Revenue Hero Card */}
        <div
          className="card card-hover animate-fade-in"
          style={{
            background:
              'linear-gradient(135deg, #141414 0%, #1a1a1a 50%, #1f1012 100%)',
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
              background:
                'radial-gradient(circle, rgba(229,30,30,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: '#888', fontSize: 13, margin: '0 0 4px 0' }}>
                {period === 'today'
                  ? 'Bugungi tushum'
                  : period === 'week'
                  ? 'Haftalik tushum'
                  : 'Oylik tushum'}
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
                {formatCurrency(animatedRevenue)}{' '}
                <span style={{ fontSize: 18, color: '#888', fontWeight: 500 }}>
                  so'm
                </span>
              </p>
              <div
                className="flex items-center"
                style={{ gap: 6, marginTop: 8 }}
              >
                {isUp ? (
                  <TrendingUp size={14} color="#22c55e" />
                ) : (
                  <TrendingDown size={14} color="#e51e1e" />
                )}
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: isUp ? '#22c55e' : '#e51e1e',
                  }}
                >
                  {isUp ? '+' : ''}
                  {revenueTrend}%
                </span>
                <span style={{ color: '#666', fontSize: 12 }}>
                  o'tgan davrga nisbatan
                </span>
              </div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Sparkline data={sparklineData} />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div
          className="stagger"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10,
            marginBottom: 16,
          }}
        >
          {statCards.map((s, i) => (
            <div
              key={i}
              className="card card-hover animate-fade-in"
              style={{
                background: '#141414',
                border: '1px solid #1e1e1e',
                borderRadius: 14,
                padding: 14,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                transition: 'border-color 0.2s, transform 0.15s',
                animationDelay: `${i * 0.08}s`,
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
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    color: '#777',
                    fontSize: 11,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </p>
                <p
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 700,
                    margin: '4px 0 0 0',
                    fontVariantNumeric: 'tabular-nums',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Top Items List */}
        {topItems.length > 0 && (
          <div
            className="card animate-fade-in"
            style={{
              background: '#141414',
              border: '1px solid #1e1e1e',
              borderRadius: 14,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
              <h3
                style={{
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                Top mahsulotlar
              </h3>
              <span
                className="badge badge-red"
                style={{
                  fontSize: 11,
                  padding: '3px 8px',
                  borderRadius: 6,
                }}
              >
                {topItems.length} ta
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topItems.map((item, i) => {
                const maxRevenue = topItems[0]?.revenue || 1;
                const barPct = (item.revenue / maxRevenue) * 100;
                const rankColors = ['#e51e1e', '#f59e0b', '#3b82f6'];
                return (
                  <div
                    key={i}
                    style={{
                      padding: '12px',
                      background: '#1a1a1a',
                      borderRadius: 10,
                      border: '1px solid #222',
                    }}
                  >
                    <div
                      className="flex items-center justify-between"
                      style={{ marginBottom: 8 }}
                    >
                      <div className="flex items-center" style={{ gap: 10 }}>
                        <span
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 8,
                            background:
                              i < 3
                                ? `${rankColors[i]}20`
                                : '#222',
                            color:
                              i < 3
                                ? rankColors[i]
                                : '#888',
                            fontSize: 12,
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          #{i + 1}
                        </span>
                        <div>
                          <p
                            style={{
                              color: '#ddd',
                              fontSize: 13,
                              margin: 0,
                              fontWeight: 600,
                            }}
                          >
                            {item.name}
                          </p>
                          <p
                            style={{
                              color: '#777',
                              fontSize: 11,
                              margin: '2px 0 0 0',
                            }}
                          >
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
                    <div
                      style={{
                        height: 6,
                        borderRadius: 3,
                        background: '#222',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${barPct}%`,
                          borderRadius: 3,
                          background:
                            i < 3
                              ? `linear-gradient(90deg, ${rankColors[i]}, ${rankColors[i]}88)`
                              : 'linear-gradient(90deg, #555, #333)',
                          transition: 'width 0.8s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Revenue Chart - Weekly Bar Chart */}
        {weekChart.length > 0 && (
          <div
            className="card animate-fade-in"
            style={{
              background: '#141414',
              border: '1px solid #1e1e1e',
              borderRadius: 14,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
              <h3
                style={{
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                Haftalik tushum
              </h3>
              <span style={{ color: '#666', fontSize: 12 }}>
                So'm
              </span>
            </div>
            <BarChart data={weekChart} labels={weekDays} color="#e51e1e" />
          </div>
        )}

        {/* Orders by Hour */}
        <div
          className="card animate-fade-in"
          style={{
            background: '#141414',
            border: '1px solid #1e1e1e',
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
            <h3
              style={{
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                margin: 0,
              }}
            >
              Soatlik buyurtmalar
            </h3>
            <Clock size={16} color="#666" />
          </div>
          <HorizontalBarChart data={hoursData} color="#e51e1e" />
        </div>

        {/* Payment Methods */}
        <div
          className="card animate-fade-in"
          style={{
            background: '#141414',
            border: '1px solid #1e1e1e',
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <h3
            style={{
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              margin: '0 0 14px 0',
            }}
          >
            To'lov usullari
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {paymentMethods.map((m, i) => (
              <div key={i}>
                <div
                  className="flex items-center justify-between"
                  style={{ marginBottom: 6 }}
                >
                  <div className="flex items-center" style={{ gap: 8 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: m.color,
                      }}
                    />
                    <span
                      style={{
                        color: '#ccc',
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {m.label}
                    </span>
                  </div>
                  <span
                    style={{
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 700,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {m.pct}%
                  </span>
                </div>
                <div
                  style={{
                    height: 10,
                    borderRadius: 5,
                    background: '#1e1e1e',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${m.pct}%`,
                      borderRadius: 5,
                      background: m.color,
                      transition: 'width 0.8s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
