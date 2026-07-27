import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Clock,
  Users,
  Package,
  Star,
  Bot,
  CreditCard,
  Banknote,
} from 'lucide-react';

const periods = [
  { id: 'hourly', label: 'Soatlik' },
  { id: 'daily', label: 'Kunlik' },
  { id: 'weekly', label: 'Haftalik' },
  { id: 'monthly', label: 'Oylik' },
  { id: 'yearly', label: 'Yillik' },
];

const revenueData = [1200, 1900, 1500, 2200, 1800, 2600, 2100];
const revenueLabels = ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'];

const topProducts = [
  { name: 'Qiyma Shashlik', count: 342, pct: 100 },
  { name: 'Tovuq Shashlik', count: 278, pct: 81 },
  { name: 'Lavash', count: 245, pct: 72 },
  { name: 'Sho\'rva', count: 198, pct: 58 },
  { name: 'Kabob', count: 176, pct: 51 },
];

const bottomProducts = [
  { name: 'KartoshkaFri', count: 34, pct: 100 },
  { name: 'PomidorSalat', count: 28, pct: 82 },
  { name: 'Muzqaymoq', count: 22, pct: 65 },
  { name: 'Kompot', count: 18, pct: 53 },
  { name: 'Choy', count: 12, pct: 35 },
];

const topCustomers = [
  { name: 'Abdullayev S.', spent: 2450000, orders: 48 },
  { name: 'Karimov B.', spent: 1980000, orders: 36 },
  { name: 'Toshmatov J.', spent: 1650000, orders: 31 },
  { name: 'Rahimov D.', spent: 1420000, orders: 27 },
  { name: 'Mirzayev A.', spent: 1180000, orders: 22 },
];

const topCouriers = [
  { name: 'Sardor B.', deliveries: 189, rating: 4.9 },
  { name: 'Jamshid K.', deliveries: 167, rating: 4.8 },
  { name: 'Dilshod R.', deliveries: 154, rating: 4.7 },
  { name: 'Nodir T.', deliveries: 142, rating: 4.7 },
  { name: 'Oybek M.', deliveries: 128, rating: 4.6 },
];

const hourlyOrders = [
  2, 1, 0, 0, 0, 1, 3, 8, 14, 18, 22, 28,
  35, 32, 24, 16, 14, 18, 26, 30, 24, 16, 8, 4,
];

const paymentMethods = [
  { name: 'Naqd', pct: 65, color: '#4ade80' },
  { name: 'Karta', pct: 20, color: '#60a5fa' },
  { name: 'Click', pct: 10, color: '#facc15' },
  { name: 'Payme', pct: 5, color: '#c084fc' },
];

const categoryPerformance = [
  { name: 'Shashliklar', pct: 45, color: '#ef4444' },
  { name: 'Fastfud', pct: 30, color: '#f97316' },
  { name: 'Ichimliklar', pct: 15, color: '#3b82f6' },
  { name: 'Desertlar', pct: 5, color: '#a855f7' },
  { name: 'Gazaklar', pct: 5, color: '#22c55e' },
];

const insights = [
  'Qiyma Shashlik eng ko\'p sotilmoqda — zaxirani oshiring',
  'Tovuq shashlik kam sotilmoqda — aksiya tashkil qiling',
  '12:00–14:00 va 18:00–20:00 band vaqtlar',
  'O\'rtacha tayyorlash vaqti 18 daqiqa — 15 ga tushiring',
  'Yangi mijozlarga 10% cashback tavsiya qilinadi',
];

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    color: '#e2e8f0',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: '24px',
    maxWidth: 1400,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#f8fafc',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  periodBar: {
    display: 'flex',
    gap: 8,
    marginBottom: 28,
    flexWrap: 'wrap',
  },
  pill: {
    padding: '8px 20px',
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.25s',
  },
  pillActive: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: '#fff',
    border: '1px solid #ef4444',
    boxShadow: '0 0 20px rgba(239,68,68,0.3)',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  cardHover: {
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: 24,
    marginBottom: 24,
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#f1f5f9',
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  revenueLarge: {
    fontSize: 42,
    fontWeight: 800,
    color: '#f8fafc',
    lineHeight: 1.1,
  },
  trendUp: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 10px',
    borderRadius: 8,
    background: 'rgba(74,222,128,0.12)',
    color: '#4ade80',
    fontSize: 13,
    fontWeight: 600,
  },
  trendDown: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 10px',
    borderRadius: 8,
    background: 'rgba(248,113,113,0.12)',
    color: '#f87171',
    fontSize: 13,
    fontWeight: 600,
  },
  badgeRed: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 6,
    background: 'rgba(239,68,68,0.15)',
    color: '#fca5a5',
    fontSize: 11,
    fontWeight: 600,
  },
  badgeGreen: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 6,
    background: 'rgba(74,222,128,0.15)',
    color: '#86efac',
    fontSize: 11,
    fontWeight: 600,
  },
  badgeYellow: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 6,
    background: 'rgba(250,204,21,0.15)',
    color: '#fde68a',
    fontSize: 11,
    fontWeight: 600,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    background: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  barFill: (pct, color) => ({
    height: '100%',
    width: `${pct}%`,
    borderRadius: 4,
    background: `linear-gradient(90deg, ${color}, ${color}cc)`,
    transition: 'width 0.8s ease',
  }),
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  rank: (i) => ({
    width: 28,
    height: 28,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    background: i === 0 ? 'rgba(250,204,21,0.2)' : i === 1 ? 'rgba(148,163,184,0.15)' : i === 2 ? 'rgba(180,83,9,0.15)' : 'rgba(255,255,255,0.06)',
    color: i === 0 ? '#fde68a' : i === 1 ? '#cbd5e1' : i === 2 ? '#fbbf24' : '#94a3b8',
  }),
  heatmapGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(24, 1fr)',
    gap: 3,
  },
  heatmapCell: (val, max) => {
    const intensity = max > 0 ? val / max : 0;
    return {
      aspectRatio: '1',
      borderRadius: 4,
      background: intensity === 0
        ? 'rgba(255,255,255,0.03)'
        : `rgba(239,68,68,${0.1 + intensity * 0.8})`,
      transition: 'background 0.3s',
      cursor: 'pointer',
      position: 'relative',
    };
  },
  heatmapLabel: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
  },
  insightItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  insightDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#ef4444',
    marginTop: 6,
    flexShrink: 0,
  },
  glassCard: {
    background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08))',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  animate: {
    animation: 'fadeIn 0.5s ease forwards',
  },
};

const animateKeyframes = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes stagger1 { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes stagger2 { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes stagger3 { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes stagger4 { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes stagger5 { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes stagger6 { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes stagger7 { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes stagger8 { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
.animate-fade-in { animation: fadeIn 0.5s ease forwards; }
.stagger-1 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.05s; opacity: 0; }
.stagger-2 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.1s; opacity: 0; }
.stagger-3 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.15s; opacity: 0; }
.stagger-4 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.2s; opacity: 0; }
.stagger-5 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.25s; opacity: 0; }
.stagger-6 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.3s; opacity: 0; }
.stagger-7 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.35s; opacity: 0; }
.stagger-8 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.4s; opacity: 0; }
`;

function MiniLineChart({ data, width = 600, height = 140, color = '#ef4444' }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padX = 40;
  const padY = 20;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const points = data.map((v, i) => {
    const x = padX + (i / (data.length - 1)) * chartW;
    const y = padY + chartH - ((v - min) / range) * chartH;
    return `${x},${y}`;
  });

  const areaPoints = [
    `${padX},${padY + chartH}`,
    ...points,
    `${padX + chartW},${padY + chartH}`,
  ].join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#lineGrad)" />
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => {
        const x = padX + (i / (data.length - 1)) * chartW;
        const y = padY + chartH - ((v - min) / range) * chartH;
        return (
          <circle key={i} cx={x} cy={y} r="4" fill={color} stroke="#1a1a2e" strokeWidth="2" />
        );
      })}
      {revenueLabels.map((label, i) => {
        const x = padX + (i / (data.length - 1)) * chartW;
        return (
          <text key={i} x={x} y={height - 2} textAnchor="middle" fill="#64748b" fontSize="11">
            {label}
          </text>
        );
      })}
    </svg>
  );
}

export default function AdminAnalytics() {
  const [activePeriod, setActivePeriod] = useState('daily');
  const navigate = useNavigate();
  const store = useStore();

  const maxHourly = Math.max(...hourlyOrders);
  const maxHourlyIdx = hourlyOrders.indexOf(maxHourly);

  return (
    <div style={styles.page}>
      <style>{animateKeyframes}</style>

      {/* Header */}
      <div className="animate-fade-in" style={styles.header}>
        <button
          style={styles.backBtn}
          onClick={() => navigate(-1)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = '#f8fafc';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 style={styles.title}>Analitika</h1>
          <p style={styles.subtitle}>Biznesingizning batafsil statistikasi</p>
        </div>
      </div>

      {/* Period Selector */}
      <div className="animate-fade-in stagger-1" style={styles.periodBar}>
        {periods.map((p) => (
          <button
            key={p.id}
            style={{
              ...styles.pill,
              ...(activePeriod === p.id ? styles.pillActive : {}),
            }}
            onClick={() => setActivePeriod(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Revenue Overview */}
      <div className="card card-hover animate-fade-in stagger-2" style={styles.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={styles.sectionTitle}>
            <BarChart3 size={18} style={{ color: '#ef4444' }} />
            Daromad ko'rsatkichlari
          </div>
          <span style={styles.badgeGreen}>+12.4%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
          <span style={styles.revenueLarge}>12,450,000</span>
          <span style={{ color: '#64748b', fontSize: 16, marginBottom: 4 }}>so'm</span>
          <span style={styles.trendUp}>
            <TrendingUp size={14} />
            +12.4%
          </span>
        </div>
        <MiniLineChart data={revenueData} />
      </div>

      {/* Top Lists */}
      <div style={styles.grid2}>
        {/* Eng ko'p sotilgan */}
        <div className="card card-hover animate-fade-in stagger-3" style={styles.card}>
          <div style={styles.sectionTitle}>
            <Star size={18} style={{ color: '#facc15' }} />
            Eng ko'p sotilgan mahsulotlar
          </div>
          {topProducts.map((item, i) => (
            <div key={i} style={{ ...styles.listItem, border: i === topProducts.length - 1 ? 'none' : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                <div style={styles.rank(i)}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0', marginBottom: 6 }}>{item.name}</div>
                  <div style={styles.barTrack}>
                    <div style={styles.barFill(item.pct, '#ef4444')} />
                  </div>
                </div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', marginLeft: 12, whiteSpace: 'nowrap' }}>
                {item.count} ta
              </span>
            </div>
          ))}
        </div>

        {/* Eng kam sotilgan */}
        <div className="card card-hover animate-fade-in stagger-4" style={styles.card}>
          <div style={styles.sectionTitle}>
            <TrendingDown size={18} style={{ color: '#f87171' }} />
            Eng kam sotilgan mahsulotlar
          </div>
          {bottomProducts.map((item, i) => (
            <div key={i} style={{ ...styles.listItem, border: i === bottomProducts.length - 1 ? 'none' : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                <div style={styles.rank(i)}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0', marginBottom: 6 }}>{item.name}</div>
                  <div style={styles.barTrack}>
                    <div style={styles.barFill(item.pct, '#f97316')} />
                  </div>
                </div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8', marginLeft: 12, whiteSpace: 'nowrap' }}>
                {item.count} ta
              </span>
            </div>
          ))}
        </div>

        {/* Top mijozlar */}
        <div className="card card-hover animate-fade-in stagger-5" style={styles.card}>
          <div style={styles.sectionTitle}>
            <Users size={18} style={{ color: '#60a5fa' }} />
            Top mijozlar
          </div>
          {topCustomers.map((item, i) => (
            <div key={i} style={{ ...styles.listItem, border: i === topCustomers.length - 1 ? 'none' : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={styles.rank(i)}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0' }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{item.orders} ta buyurtma</div>
                </div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#60a5fa' }}>
                {(item.spent / 1000).toLocaleString()}K
              </span>
            </div>
          ))}
        </div>

        {/* Top kuryerlar */}
        <div className="card card-hover animate-fade-in stagger-6" style={styles.card}>
          <div style={styles.sectionTitle}>
            <Package size={18} style={{ color: '#4ade80' }} />
            Top kuryerlar
          </div>
          {topCouriers.map((item, i) => (
            <div key={i} style={{ ...styles.listItem, border: i === topCouriers.length - 1 ? 'none' : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={styles.rank(i)}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0' }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{item.deliveries} ta yetkazish</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={12} style={{ color: '#facc15', fill: '#facc15' }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#facc15' }}>{item.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders by Hour Heatmap */}
      <div className="card card-hover animate-fade-in stagger-5" style={styles.card}>
        <div style={styles.sectionTitle}>
          <Clock size={18} style={{ color: '#a78bfa' }} />
          Soatlik buyurtmalar
        </div>
        <div style={{ marginBottom: 8 }}>
          <div style={styles.heatmapGrid}>
            {hourlyOrders.map((val, i) => (
              <div key={i} style={styles.heatmapCell(val, maxHourly)} title={`${i}:00 — ${val} ta buyurtma`} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', gap: 3, marginTop: 6 }}>
            {hourlyOrders.map((_, i) => (
              <div key={i} style={styles.heatmapLabel}>
                {i % 3 === 0 ? i : ''}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <span style={{ fontSize: 11, color: '#64748b' }}>Kam</span>
          {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1].map((o, i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: 3,
                background: `rgba(239,68,68,${0.1 + o * 0.8})`,
              }}
            />
          ))}
          <span style={{ fontSize: 11, color: '#64748b' }}>Ko'p</span>
        </div>
      </div>

      {/* Payment + AI Insights + Category */}
      <div style={styles.grid3}>
        {/* Payment Methods */}
        <div className="card card-hover animate-fade-in stagger-6" style={styles.card}>
          <div style={styles.sectionTitle}>
            <CreditCard size={18} style={{ color: '#60a5fa' }} />
            To'lov usullari
          </div>
          {paymentMethods.map((item, i) => (
            <div key={i} style={{ marginBottom: i < paymentMethods.length - 1 ? 16 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {item.name === 'Naqd' ? (
                    <Banknote size={14} style={{ color: item.color }} />
                  ) : (
                    <CreditCard size={14} style={{ color: item.color }} />
                  )}
                  <span style={{ fontSize: 13, color: '#cbd5e1' }}>{item.name}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: item.color }}>{item.pct}%</span>
              </div>
              <div style={styles.barTrack}>
                <div style={styles.barFill(item.pct, item.color)} />
              </div>
            </div>
          ))}
        </div>

        {/* AI Insights */}
        <div className="animate-fade-in stagger-7" style={styles.glassCard}>
          <div style={{ ...styles.sectionTitle, color: '#c4b5fd' }}>
            <Bot size={20} style={{ color: '#a78bfa' }} />
            Sun'iy intellekt tavsiyalari
          </div>
          {insights.map((text, i) => (
            <div key={i} style={styles.insightItem}>
              <div style={styles.insightDot} />
              <span style={{ fontSize: 13, color: '#d4d4d8', lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Category Performance */}
        <div className="card card-hover animate-fade-in stagger-8" style={styles.card}>
          <div style={styles.sectionTitle}>
            <BarChart3 size={18} style={{ color: '#f97316' }} />
            Kategoriya samaradorligi
          </div>
          {categoryPerformance.map((item, i) => (
            <div key={i} style={{ marginBottom: i < categoryPerformance.length - 1 ? 18 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#cbd5e1' }}>{item.name}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: item.color }}>{item.pct}%</span>
              </div>
              <div style={styles.barTrack}>
                <div style={styles.barFill(item.pct, item.color)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
