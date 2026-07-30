import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
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
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
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
  { name: 'Hot-dog oddiy', count: 342, pct: 100 },
  { name: 'Hot-dog oddiy', count: 278, pct: 81 },
  { name: 'Lavash', count: 245, pct: 72 },
  { name: 'Doner kichik', count: 198, pct: 58 },
  { name: 'Doner kichik', count: 176, pct: 51 },
];

const bottomProducts = [
  { name: 'Fri', count: 34, pct: 100 },
  { name: 'PomidorSalat', count: 28, pct: 82 },
  { name: 'Fri', count: 22, pct: 65 },
  { name: 'Lavash', count: 18, pct: 53 },
  { name: 'Lavash', count: 12, pct: 35 },
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
  { name: 'Naqd', pct: 65, icon: Banknote },
  { name: 'Karta', pct: 20, icon: CreditCard },
  { name: 'Click', pct: 10, icon: CreditCard },
  { name: 'Payme', pct: 5, icon: CreditCard },
];

const categoryPerformance = [
  { name: 'Hot-doglar', pct: 45 },
  { name: 'Burgerlar', pct: 30 },
  { name: 'Lavashlar', pct: 15 },
  { name: 'Nonburgerlar & Donar', pct: 5 },
  { name: 'Frilar', pct: 5 },
];

const insights = [
  "Hot-dog oddiy eng ko'p sotilmoqda â€” zaxirani oshiring",
  "Hot-dog oddiy kam sotilmoqda â€” aksiya tashkil qiling",
  '12:00-14:00 va 18:00-20:00 band vaqtlar',
  "O'rtacha tayyorlash vaqti 18 daqiqa â€” 15 ga tushiring",
  'Yangi mijozlarga 10% cashback tavsiya qilinadi',
];

const animateKeyframes = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fadeIn 0.4s ease forwards; }
.stagger-1 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.05s; opacity: 0; }
.stagger-2 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.1s; opacity: 0; }
.stagger-3 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.15s; opacity: 0; }
.stagger-4 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.2s; opacity: 0; }
.stagger-5 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.25s; opacity: 0; }
.stagger-6 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.3s; opacity: 0; }
.stagger-7 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.35s; opacity: 0; }
.stagger-8 { animation: fadeIn 0.4s ease forwards; animation-delay: 0.4s; opacity: 0; }
`;

const S = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    padding: '24px',
    maxWidth: 1400,
    margin: '0 auto',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 12,
  },
  titleBlock: {},
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: 'var(--text)',
    margin: 0,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 14,
    color: 'var(--text-muted)',
    marginTop: 4,
  },
  periodBar: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
  },
  pill: {
    padding: '7px 18px',
    borderRadius: 20,
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text-muted)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none',
  },
  pillActive: {
    background: 'var(--primary)',
    color: '#FFFFFF',
    border: '1px solid var(--primary)',
    boxShadow: '0 2px 8px rgba(249,115,22,0.25)',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: 24,
    marginBottom: 20,
    boxShadow: 'var(--shadow-sm)',
    transition: 'box-shadow 0.2s, transform 0.2s',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    marginBottom: 20,
  },
  metricCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    boxShadow: 'var(--shadow-sm)',
  },
  metricIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--text)',
    lineHeight: 1.2,
  },
  metricTrend: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    fontSize: 12,
    fontWeight: 600,
  },
  trendUp: {
    color: 'var(--success)',
    background: 'rgba(34,197,94,0.1)',
    padding: '2px 8px',
    borderRadius: 6,
  },
  trendDown: {
    color: 'var(--danger)',
    background: 'rgba(239,68,68,0.1)',
    padding: '2px 8px',
    borderRadius: 6,
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 20,
    marginBottom: 20,
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 20,
    marginBottom: 20,
  },
  sectionHead: {
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--text)',
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
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
    transition: 'width 0.6s ease',
  }),
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '11px 0',
    borderBottom: '1px solid var(--border)',
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
    background: i === 0 ? 'var(--primary-light)' : 'var(--surface-active)',
    color: i === 0 ? 'var(--primary)' : 'var(--text-muted)',
    flexShrink: 0,
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
      background:
        intensity === 0
          ? 'var(--surface-active)'
          : `rgba(249,115,22,${0.1 + intensity * 0.8})`,
      transition: 'background 0.3s',
      cursor: 'pointer',
    };
  },
  heatmapLabel: {
    fontSize: 10,
    color: 'var(--text-muted)',
    textAlign: 'center',
    marginTop: 4,
  },
  insightItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '9px 0',
    borderBottom: '1px solid var(--border)',
  },
  insightDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--primary)',
    marginTop: 6,
    flexShrink: 0,
  },
};

function MiniLineChart({ data, width = 600, height = 160 }) {
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
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#areaGrad)" />
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => {
        const x = padX + (i / (data.length - 1)) * chartW;
        const y = padY + chartH - ((v - min) / range) * chartH;
        return (
          <circle key={i} cx={x} cy={y} r="3.5" fill="var(--primary)" stroke="var(--surface)" strokeWidth="2" />
        );
      })}
      {revenueLabels.map((label, i) => {
        const x = padX + (i / (data.length - 1)) * chartW;
        return (
          <text key={i} x={x} y={height - 2} textAnchor="middle" fill="var(--text-muted)" fontSize="11">
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

  const metrics = [
    { label: 'Umumiy daromad', value: '12,450,000', suffix: "so'm", trend: '+12.4%', up: true, icon: BarChart3, color: 'var(--primary)', bg: 'var(--primary-light)' },
    { label: 'Buyurtmalar', value: '1,284', suffix: 'ta', trend: '+8.2%', up: true, icon: Package, color: 'var(--success)', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Mijozlar', value: '847', suffix: 'nafar', trend: '+5.1%', up: true, icon: Users, color: '#6366F1', bg: 'rgba(99,102,241,0.1)' },
    { label: 'O\'rtacha buyurtma', value: '96,800', suffix: "so'm", trend: '-2.3%', up: false, icon: CreditCard, color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)' },
  ];

  return (
    <div style={S.page}>
      <style>{animateKeyframes}</style>

      <div style={S.topRow} className="animate-fade-in">
        <div style={S.titleBlock}>
          <h1 style={S.title}>Analitika</h1>
          <p style={S.subtitle}>Biznesingizning batafsil statistikasi</p>
        </div>
        <div style={S.periodBar}>
          {periods.map((p) => (
            <button
              key={p.id}
              style={{
                ...S.pill,
                ...(activePeriod === p.id ? S.pillActive : {}),
              }}
              onClick={() => setActivePeriod(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={S.metricsGrid} className="animate-fade-in stagger-1">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} style={S.metricCard}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ ...S.metricIconWrap, background: m.bg }}>
                  <Icon size={20} style={{ color: m.color }} />
                </div>
                <div style={{ ...S.metricTrend, ...(m.up ? S.trendUp : S.trendDown) }}>
                  {m.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {m.trend}
                </div>
              </div>
              <span style={S.metricLabel}>{m.label}</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={S.metricValue}>{m.value}</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{m.suffix}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={S.card} className="animate-fade-in stagger-2">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={S.sectionHead}>
            <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
            Daromad ko'rsatkichlari
          </div>
          <div style={{ ...S.metricTrend, ...S.trendUp }}>
            <TrendingUp size={13} />
            +12.4% o'tgan haftaga nisbatan
          </div>
        </div>
        <MiniLineChart data={revenueData} />
      </div>

      <div style={S.grid2}>
        <div style={S.card} className="animate-fade-in stagger-3">
          <div style={S.sectionHead}>
            <Star size={18} style={{ color: 'var(--warning)' }} />
            Eng ko'p sotilgan mahsulotlar
          </div>
          {topProducts.map((item, i) => (
            <div key={i} style={{ ...S.listItem, borderBottom: i === topProducts.length - 1 ? 'none' : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                <div style={S.rank(i)}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>{item.name}</div>
                  <div style={S.barTrack}>
                    <div style={S.barFill(item.pct)} />
                  </div>
                </div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginLeft: 12, whiteSpace: 'nowrap' }}>
                {item.count} ta
              </span>
            </div>
          ))}
        </div>

        <div style={S.card} className="animate-fade-in stagger-4">
          <div style={S.sectionHead}>
            <TrendingDown size={18} style={{ color: 'var(--danger)' }} />
            Eng kam sotilgan mahsulotlar
          </div>
          {bottomProducts.map((item, i) => (
            <div key={i} style={{ ...S.listItem, borderBottom: i === bottomProducts.length - 1 ? 'none' : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                <div style={S.rank(i)}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>{item.name}</div>
                  <div style={S.barTrack}>
                    <div style={{ ...S.barFill(item.pct), background: 'var(--danger)' }} />
                  </div>
                </div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginLeft: 12, whiteSpace: 'nowrap' }}>
                {item.count} ta
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={S.grid2}>
        <div style={S.card} className="animate-fade-in stagger-5">
          <div style={S.sectionHead}>
            <Users size={18} style={{ color: '#6366F1' }} />
            Top mijozlar
          </div>
          {topCustomers.map((item, i) => (
            <div key={i} style={{ ...S.listItem, borderBottom: i === topCustomers.length - 1 ? 'none' : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={S.rank(i)}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.orders} ta buyurtma</div>
                </div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#6366F1' }}>
                {(item.spent / 1000).toLocaleString()}K
              </span>
            </div>
          ))}
        </div>

        <div style={S.card} className="animate-fade-in stagger-6">
          <div style={S.sectionHead}>
            <Package size={18} style={{ color: 'var(--success)' }} />
            Top kuryerlar
          </div>
          {topCouriers.map((item, i) => (
            <div key={i} style={{ ...S.listItem, borderBottom: i === topCouriers.length - 1 ? 'none' : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={S.rank(i)}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.deliveries} ta yetkazish</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={13} style={{ color: 'var(--warning)', fill: 'var(--warning)' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--warning)' }}>{item.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.card} className="animate-fade-in stagger-7">
        <div style={S.sectionHead}>
          <Clock size={18} style={{ color: '#8B5CF6' }} />
          Soatlik buyurtmalar
        </div>
        <div style={{ marginBottom: 8 }}>
          <div style={S.heatmapGrid}>
            {hourlyOrders.map((val, i) => (
              <div key={i} style={S.heatmapCell(val, maxHourly)} title={`${i}:00 â€” ${val} ta buyurtma`} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', gap: 3, marginTop: 6 }}>
            {hourlyOrders.map((_, i) => (
              <div key={i} style={S.heatmapLabel}>
                {i % 3 === 0 ? i : ''}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Kam</span>
          {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1].map((o, i) => (
            <div
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: 3,
                background: `rgba(249,115,22,${0.1 + o * 0.8})`,
              }}
            />
          ))}
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Ko'p</span>
        </div>
      </div>

      <div style={S.grid3}>
        <div style={S.card} className="animate-fade-in stagger-5">
          <div style={S.sectionHead}>
            <CreditCard size={18} style={{ color: '#6366F1' }} />
            To'lov usullari
          </div>
          {paymentMethods.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} style={{ marginBottom: i < paymentMethods.length - 1 ? 16 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={14} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{item.pct}%</span>
                </div>
                <div style={S.barTrack}>
                  <div style={{ ...S.barFill(item.pct), background: i === 0 ? 'var(--success)' : i === 1 ? '#6366F1' : i === 2 ? 'var(--warning)' : '#8B5CF6' }} />
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            ...S.card,
            background: 'linear-gradient(135deg, var(--primary-light), #FFFFFF)',
            border: '1px solid rgba(249,115,22,0.15)',
          }}
          className="animate-fade-in stagger-6"
        >
          <div style={{ ...S.sectionHead, color: 'var(--primary)' }}>
            <Lightbulb size={18} style={{ color: 'var(--primary)' }} />
            Sun'iy intellekt tavsiyalari
          </div>
          {insights.map((text, i) => (
            <div key={i} style={{ ...S.insightItem, borderBottom: i === insights.length - 1 ? 'none' : undefined }}>
              <div style={S.insightDot} />
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
        </div>

        <div style={S.card} className="animate-fade-in stagger-7">
          <div style={S.sectionHead}>
            <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
            Kategoriya samaradorligi
          </div>
          {categoryPerformance.map((item, i) => (
            <div key={i} style={{ marginBottom: i < categoryPerformance.length - 1 ? 16 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.name}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{item.pct}%</span>
              </div>
              <div style={S.barTrack}>
                <div style={{ ...S.barFill(item.pct), background: i === 0 ? 'var(--danger)' : i === 1 ? 'var(--primary)' : i === 2 ? '#6366F1' : i === 3 ? '#8B5CF6' : 'var(--success)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



