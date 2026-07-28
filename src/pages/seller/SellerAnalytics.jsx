import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
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

const Sparkline = ({ data, width = 140, height = 40 }) => {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const color = '#F97316';
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
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
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

const BarChart = ({ data, labels, height = 140 }) => {
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
              fill={isMax ? 'var(--primary)' : 'rgba(249,115,22,0.3)'}
              style={{ transition: 'height 0.6s ease, y 0.6s ease' }}
            />
            <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontWeight="700">
              {formatCurrency(v)}
            </text>
            <text x={x + barWidth / 2} y={height + 20} textAnchor="middle" fill="var(--text-muted)" fontSize="11" fontWeight="500">
              {labels && labels[i] ? labels[i] : ''}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const HorizontalBarChart = ({ data, maxValue }) => {
  if (!data || data.length === 0) return null;
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.map((item, i) => {
        const pct = (item.value / max) * 100;
        const isPeak = item.value === max;
        return (
          <div key={i}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600 }}>{item.label}</span>
              <span style={{ color: isPeak ? 'var(--primary)' : 'var(--text-muted)', fontSize: 12, fontWeight: isPeak ? 700 : 500 }}>
                {item.value} buyurtma
              </span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: 'var(--surface-active)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  borderRadius: 4,
                  background: isPeak ? 'var(--primary)' : 'rgba(249,115,22,0.35)',
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
    { label: 'Naqd', pct: 70, color: 'var(--success)' },
    { label: 'Karta', pct: 20, color: '#3B82F6' },
    { label: 'Click', pct: 10, color: 'var(--warning)' },
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
    { icon: Package, label: 'Buyurtmalar', value: ordersCount, color: '#3B82F6' },
    { icon: DollarSign, label: "O'rtacha summa", value: `${formatCurrency(avgOrder)} so'm`, color: 'var(--success)' },
    { icon: ArrowUpRight, label: "Eng ko'p sotilgan", value: bestSellingItem, color: 'var(--primary)' },
    { icon: ArrowDownRight, label: 'Eng kam sotilgan', value: worstSellingItem, color: 'var(--warning)' },
  ];

  const periods = [
    { key: 'today', label: 'Kun' },
    { key: 'week', label: 'Hafta' },
    { key: 'month', label: 'Oy' },
  ];

  const s = {
    page: {
      minHeight: '100%',
      background: 'var(--bg)',
      paddingBottom: 100,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 16px 12px',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'var(--text)',
    },
    titleBlock: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      fontSize: 20,
      fontWeight: 700,
      color: 'var(--text)',
      margin: 0,
      letterSpacing: '-0.01em',
    },
    subtitle: {
      fontSize: 12,
      color: 'var(--text-muted)',
      margin: '2px 0 0 0',
    },
    iconBtn: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-sm)',
      background: 'var(--primary-light)',
      border: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--primary)',
    },
    periodToggle: {
      display: 'flex',
      margin: '0 16px 16px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: 4,
      gap: 4,
    },
    periodBtn: (active) => ({
      flex: 1,
      padding: '8px 0',
      borderRadius: 10,
      border: 'none',
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: 600,
      transition: 'all 0.15s ease',
      background: active ? 'var(--primary)' : 'transparent',
      color: active ? '#fff' : 'var(--text-muted)',
    }),
    heroCard: {
      margin: '0 16px 16px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
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
      fontSize: 13,
      color: 'var(--text-muted)',
      margin: '0 0 4px 0',
      fontWeight: 500,
    },
    heroValue: {
      fontSize: 30,
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
    trendRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 8,
    },
    trendValue: (up) => ({
      fontSize: 13,
      fontWeight: 600,
      color: up ? 'var(--success)' : 'var(--danger)',
    }),
    trendLabel: {
      fontSize: 12,
      color: 'var(--text-muted)',
    },
    grid2: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 10,
      margin: '0 16px 16px',
    },
    statCard: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: 14,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
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
      fontSize: 11,
      color: 'var(--text-muted)',
      fontWeight: 500,
      margin: 0,
    },
    statValue: {
      fontSize: 15,
      fontWeight: 700,
      color: 'var(--text)',
      margin: '2px 0 0 0',
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    sectionCard: {
      margin: '0 16px 16px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 16,
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: 700,
      color: 'var(--text)',
      margin: 0,
    },
    badgeCount: {
      fontSize: 11,
      fontWeight: 600,
      padding: '3px 8px',
      borderRadius: 6,
      background: 'var(--primary-light)',
      color: 'var(--primary)',
    },
    topItem: {
      padding: 12,
      background: 'var(--bg)',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border)',
      marginBottom: 8,
    },
    topItemInner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    rankBadge: (i) => ({
      width: 26,
      height: 26,
      borderRadius: 8,
      background: i < 3 ? 'var(--primary-light)' : 'var(--surface-active)',
      color: i < 3 ? 'var(--primary)' : 'var(--text-muted)',
      fontSize: 11,
      fontWeight: 800,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }),
    topItemName: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text)',
      margin: 0,
    },
    topItemSold: {
      fontSize: 11,
      color: 'var(--text-muted)',
      margin: '2px 0 0 0',
    },
    topItemRevenue: {
      fontSize: 13,
      fontWeight: 700,
      color: 'var(--success)',
      fontVariantNumeric: 'tabular-nums',
    },
    barTrack: {
      height: 6,
      borderRadius: 3,
      background: 'var(--surface-active)',
      overflow: 'hidden',
    },
    barFill: (pct) => ({
      height: '100%',
      width: `${pct}%`,
      borderRadius: 3,
      background: 'var(--primary)',
      transition: 'width 0.8s ease',
    }),
    payLabel: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-secondary)',
    },
    payPct: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--text)',
      fontVariantNumeric: 'tabular-nums',
    },
    payTrack: {
      height: 10,
      borderRadius: 5,
      background: 'var(--surface-active)',
      overflow: 'hidden',
    },
    payFill: (pct, color) => ({
      height: '100%',
      width: `${pct}%`,
      borderRadius: 5,
      background: color,
      transition: 'width 0.8s ease',
    }),
    sectionIcon: {
      color: 'var(--text-muted)',
      flexShrink: 0,
    },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.headerLeft}>
          <button onClick={() => navigate(-1)} style={s.backBtn}>
            <ChevronLeft size={18} />
          </button>
          <div style={s.titleBlock}>
            <h1 style={s.title}>Statistika</h1>
            <p style={s.subtitle}>Sotuv tahlillari</p>
          </div>
        </div>
        <div style={s.iconBtn}>
          <BarChart3 size={18} />
        </div>
      </div>

      <div style={s.periodToggle}>
        {periods.map((p) => (
          <button key={p.key} onClick={() => setPeriod(p.key)} style={s.periodBtn(period === p.key)}>
            {p.label}
          </button>
        ))}
      </div>

      <div style={s.heroCard}>
        <div style={s.heroGlow} />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={s.heroLabel}>
              {period === 'today' ? 'Bugungi tushum' : period === 'week' ? 'Haftalik tushum' : 'Oylik tushum'}
            </p>
            <p style={s.heroValue}>
              {formatCurrency(animatedRevenue)} <span style={s.heroUnit}>so'm</span>
            </p>
            <div style={s.trendRow}>
              {isUp ? <TrendingUp size={14} style={{ color: 'var(--success)' }} /> : <TrendingDown size={14} style={{ color: 'var(--danger)' }} />}
              <span style={s.trendValue(isUp)}>{isUp ? '+' : ''}{revenueTrend}%</span>
              <span style={s.trendLabel}>o'tgan davrga nisbatan</span>
            </div>
          </div>
          <Sparkline data={sparklineData} />
        </div>
      </div>

      <div style={s.grid2}>
        {statCards.map((st, i) => (
          <div key={i} style={s.statCard}>
            <div style={s.statIcon(st.color)}>
              <st.icon size={17} style={{ color: st.color }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={s.statLabel}>{st.label}</p>
              <p style={s.statValue}>{st.value}</p>
            </div>
          </div>
        ))}
      </div>

      {topItems.length > 0 && (
        <div style={s.sectionCard}>
          <div style={s.sectionHeader}>
            <h3 style={s.sectionTitle}>Top mahsulotlar</h3>
            <span style={s.badgeCount}>{topItems.length} ta</span>
          </div>
          <div>
            {topItems.map((item, i) => {
              const maxRevenue = topItems[0]?.revenue || 1;
              const barPct = (item.revenue / maxRevenue) * 100;
              return (
                <div key={i} style={{ ...s.topItem, marginBottom: i === topItems.length - 1 ? 0 : 8 }}>
                  <div style={s.topItemInner}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={s.rankBadge(i)}>#{i + 1}</div>
                      <div>
                        <p style={s.topItemName}>{item.name}</p>
                        <p style={s.topItemSold}>{item.sold} ta sotildi</p>
                      </div>
                    </div>
                    <span style={s.topItemRevenue}>{formatCurrency(item.revenue)} so'm</span>
                  </div>
                  <div style={s.barTrack}>
                    <div style={s.barFill(barPct)} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {weekChart.length > 0 && (
        <div style={s.sectionCard}>
          <div style={s.sectionHeader}>
            <h3 style={s.sectionTitle}>Haftalik tushum</h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>So'm</span>
          </div>
          <BarChart data={weekChart} labels={weekDays} />
        </div>
      )}

      <div style={s.sectionCard}>
        <div style={s.sectionHeader}>
          <h3 style={s.sectionTitle}>Soatlik buyurtmalar</h3>
          <Clock size={15} style={s.sectionIcon} />
        </div>
        <HorizontalBarChart data={hoursData} />
      </div>

      <div style={s.sectionCard}>
        <h3 style={{ ...s.sectionTitle, marginBottom: 14 }}>To'lov usullari</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {paymentMethods.map((m, i) => (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.color }} />
                  <span style={s.payLabel}>{m.label}</span>
                </div>
                <span style={s.payPct}>{m.pct}%</span>
              </div>
              <div style={s.payTrack}>
                <div style={s.payFill(m.pct, m.color)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
