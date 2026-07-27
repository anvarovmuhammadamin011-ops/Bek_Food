import { useState, useEffect, useRef } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Package,
  Clock,
  XCircle,
  ChefHat,
  Truck,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  Bell,
  LogOut,
  Activity,
  ArrowRight,
  ShoppingCart,
  Star
} from 'lucide-react';

const COLORS = {
  bg: '#0a0a0a',
  surface: '#141414',
  surfaceHover: '#1a1a1a',
  surfaceBorder: '#1f1f1f',
  red: '#e51e1e',
  redDark: '#b81818',
  redGlow: 'rgba(229, 30, 30, 0.3)',
  green: '#22c55e',
  yellow: '#eab308',
  blue: '#3b82f6',
  purple: '#a855f7',
  orange: '#f97316',
  text: '#ffffff',
  textSecondary: '#a1a1aa',
  textMuted: '#52525b',
  white: '#ffffff',
};

const useCountUp = (target, duration = 1200) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = null;
    let raf;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
};

const formatCurrency = (n) =>
  n.toLocaleString('uz-UZ', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const Sparkline = ({ data, color = COLORS.red, width = 120, height = 40 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: height }}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#sparkGrad)" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const BarChart = ({ data, labels, height = 200 }) => {
  const max = Math.max(...data);
  const barWidth = 100 / data.length;
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <svg viewBox="0 0 700 240" style={{ width: '100%', height: height }}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLORS.red} />
            <stop offset="100%" stopColor={COLORS.redDark} />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line
            key={i}
            x1="0"
            y1={20 + (1 - p) * 180}
            x2="700"
            y2={20 + (1 - p) * 180}
            stroke={COLORS.surfaceBorder}
            strokeWidth="1"
          />
        ))}
        {data.map((v, i) => {
          const barH = (v / max) * 160;
          const x = i * 100 + 20;
          const y = 200 - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={60} height={barH} rx="4" fill="url(#barGrad)" opacity="0.9" />
              <text x={x + 30} y={18} textAnchor="middle" fill={COLORS.textSecondary} fontSize="10">
                {labels[i]}
              </text>
              <text x={x + 30} y={y - 5} textAnchor="middle" fill={COLORS.text} fontSize="9" fontWeight="600">
                {formatCurrency(v)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const AdminDashboard = () => {
  const store = useStore();
  const navigate = useNavigate();
  const user = store?.user || { name: 'Admin' };
  const [timeFilter, setTimeFilter] = useState('week');
  const [unreadCount] = useState(5);
  const [liveActivity, setLiveActivity] = useState([
    { time: '14:32', text: '#1001 buyurtma yaratildi', type: 'create' },
    { time: '14:35', text: '#1002 tayyor bo\'ldi', type: 'ready' },
    { time: '14:38', text: '#1003 yetkazildi', type: 'delivered' },
    { time: '14:41', text: '#1004 qabul qilindi', type: 'accepted' },
    { time: '14:45', text: '#1005 tayyorlanmoqda', type: 'preparing' },
  ]);

  const revenue = 128500000;
  const revenueAnimated = useCountUp(revenue);
  const profit = 38500000;
  const expenses = 72000000;
  const tax = 17500000;

  const kpis = [
    { label: 'Buyurtmalar soni', value: 1247, icon: Package, color: COLORS.blue, trend: '+12%' },
    { label: 'Faol buyurtmalar', value: 23, icon: Clock, color: COLORS.yellow, trend: '+5%' },
    { label: 'Bekor qilingan', value: 18, icon: XCircle, color: COLORS.red, trend: '-3%' },
    { label: 'O\'rtacha summa', value: 68000, icon: DollarSign, color: COLORS.green, trend: '+8%' },
    { label: 'O\'rtacha tayyorlash', value: 15, icon: ChefHat, color: COLORS.purple, trend: '-2%', suffix: ' daq' },
    { label: 'O\'rtacha yetkazish', value: 28, icon: Truck, color: COLORS.orange, trend: '+1%', suffix: ' daq' },
  ];

  const weeklyData = [18000000, 22000000, 19500000, 25000000, 21000000, 28000000, 24000000];
  const weekLabels = ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'];

  const topProducts = [
    { rank: 1, name: 'Bekfood Set', sold: 342, revenue: 45200000 },
    { rank: 2, name: 'Lavash Classic', sold: 289, revenue: 28900000 },
    { rank: 3, name: 'Shashlik Set', sold: 234, revenue: 35100000 },
    { rank: 4, name: 'Burger King', sold: 198, revenue: 23760000 },
    { rank: 5, name: 'Pizza Margherita', sold: 167, revenue: 21710000 },
  ];

  const quickActions = [
    { label: 'Buyurtmalar', path: '/admin/orders', icon: ShoppingCart, desc: 'Barcha buyurtmalar' },
    { label: 'Menyu', path: '/admin/menu', icon: MenuIcon, desc: 'Menyuni boshqarish' },
    { label: 'Mijozlar', path: '/admin/customers', icon: Users, desc: 'Mijozlar ro\'yxati' },
    { label: 'Xodimlar', path: '/admin/employees', icon: Users, desc: 'Xodimlar boshqaruvi' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveActivity((prev) => {
        const newActivity = [...prev];
        const idx = Math.floor(Math.random() * 3);
        const types = [
          { text: `#${1000 + Math.floor(Math.random() * 999)} buyurtma yaratildi`, type: 'create' },
          { text: `#${1000 + Math.floor(Math.random() * 999)} tayyor bo'ldi`, type: 'ready' },
          { text: `#${1000 + Math.floor(Math.random() * 999)} yetkazildi`, type: 'delivered' },
        ];
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const item = types[idx];
        newActivity.unshift({ time: timeStr, text: item.text, type: item.type });
        return newActivity.slice(0, 5);
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: "'Inter', -apple-system, sans-serif",
        padding: '0',
      }}
    >
      <style>{`
        .card {
          background: ${COLORS.surface};
          border: 1px solid ${COLORS.surfaceBorder};
          border-radius: 12px;
          padding: 20px;
          transition: all 0.2s ease;
        }
        .card-hover:hover {
          border-color: ${COLORS.red};
          box-shadow: 0 0 20px ${COLORS.redGlow};
          transform: translateY(-2px);
        }
        .card-interactive {
          cursor: pointer;
          user-select: none;
        }
        .card-interactive:active {
          transform: scale(0.98);
        }
        .glass-floating {
          background: rgba(20, 20, 20, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
        }
        .glass-hero {
          background: linear-gradient(135deg, rgba(229, 30, 30, 0.15) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(229, 30, 30, 0.08) 100%);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(229, 30, 30, 0.2);
          border-radius: 16px;
        }
        .badge { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
        .badge-red { background: rgba(229, 30, 30, 0.15); color: ${COLORS.red}; }
        .badge-green { background: rgba(34, 197, 94, 0.15); color: ${COLORS.green}; }
        .badge-yellow { background: rgba(234, 179, 8, 0.15); color: ${COLORS.yellow}; }
        .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-primary { background: ${COLORS.red}; color: ${COLORS.white}; }
        .btn-primary:hover { background: ${COLORS.redDark}; }
        .btn-glow { box-shadow: 0 0 20px ${COLORS.redGlow}; }
        .btn-glow:hover { box-shadow: 0 0 30px ${COLORS.redGlow}; }
        .animate-fade-in { animation: fadeIn 0.5s ease forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease forwards; }
        .stagger > * { opacity: 0; animation: fadeInUp 0.4s ease forwards; }
        .stagger > *:nth-child(1) { animation-delay: 0.05s; }
        .stagger > *:nth-child(2) { animation-delay: 0.1s; }
        .stagger > *:nth-child(3) { animation-delay: 0.15s; }
        .stagger > *:nth-child(4) { animation-delay: 0.2s; }
        .stagger > *:nth-child(5) { animation-delay: 0.25s; }
        .stagger > *:nth-child(6) { animation-delay: 0.3s; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        .space-y-4 > * + * { margin-top: 16px; }
        .space-y-6 > * + * { margin-top: 24px; }
        .pulsing-dot {
          width: 8px; height: 8px; border-radius: 50%; background: ${COLORS.green};
          animation: pulse 2s infinite;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }
        @keyframes countUp { from { opacity: 0; } to { opacity: 1; } }
        .time-pill {
          padding: 8px 16px; border-radius: 999px; font-size: 13px; font-weight: 600; cursor: pointer;
          border: 1px solid ${COLORS.surfaceBorder}; background: ${COLORS.surface}; color: ${COLORS.textSecondary};
          transition: all 0.2s;
        }
        .time-pill.active {
          background: ${COLORS.red}; color: ${COLORS.white}; border-color: ${COLORS.red};
          box-shadow: 0 0 16px ${COLORS.redGlow};
        }
        .time-pill:hover:not(.active) { border-color: ${COLORS.textMuted}; color: ${COLORS.text}; }
        .activity-item {
          display: flex; align-items: center; gap: 12px; padding: 10px 0;
          border-bottom: 1px solid ${COLORS.surfaceBorder};
        }
        .activity-item:last-child { border-bottom: none; }
        .rank-badge {
          width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700;
        }
        .revenue-bar {
          height: 6px; border-radius: 3px; background: ${COLORS.surfaceBorder}; overflow: hidden;
        }
        .revenue-bar-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, ${COLORS.red}, ${COLORS.redDark}); }
        .quick-action {
          display: flex; align-items: center; gap: 16px; padding: 20px; border-radius: 12px;
          background: ${COLORS.surface}; border: 1px solid ${COLORS.surfaceBorder}; cursor: pointer;
          transition: all 0.2s;
        }
        .quick-action:hover {
          border-color: ${COLORS.red}; background: ${COLORS.surfaceHover};
          box-shadow: 0 0 20px ${COLORS.redGlow}; transform: translateY(-2px);
        }
        .notification-badge {
          position: absolute; top: -4px; right: -4px; width: 18px; height: 18px; border-radius: 50%;
          background: ${COLORS.red}; color: ${COLORS.white}; font-size: 10px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        @media (max-width: 768px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .top-products-section { grid-template-columns: 1fr !important; }
          .quick-actions-grid { grid-template-columns: 1fr !important; }
          .hero-stats-row { flex-direction: column !important; }
        }
        @media (max-width: 480px) {
          .kpi-grid { grid-template-columns: 1fr !important; }
          .header-row { flex-direction: column; gap: 12px; align-items: flex-start !important; }
          .time-pills { flex-wrap: wrap; gap: 6px; }
        }
      `}</style>

      {/* HEADER */}
      <div className="animate-fade-in" style={{ padding: '20px 24px 0' }}>
        <div
          className="header-row flex items-center justify-between"
          style={{ maxWidth: 1400, margin: '0 auto' }}
        >
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.text, marginBottom: 4 }}>
              Admin Paneli
            </h1>
            <p style={{ fontSize: 14, color: COLORS.textSecondary }}>
              Xush kelibsiz, <span style={{ color: COLORS.red, fontWeight: 600 }}>{user.name || 'Admin'}</span>
            </p>
          </div>
          <div className="flex items-center" style={{ gap: 16 }}>
            <button
              style={{
                position: 'relative',
                background: COLORS.surface,
                border: `1px solid ${COLORS.surfaceBorder}`,
                borderRadius: 10,
                width: 42,
                height: 42,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = COLORS.red;
                e.currentTarget.style.boxShadow = `0 0 12px ${COLORS.redGlow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = COLORS.surfaceBorder;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Bell size={18} color={COLORS.textSecondary} />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            <button
              className="btn btn-primary"
              style={{ borderRadius: 10, padding: '10px 16px' }}
              onClick={() => {
                if (store?.logout) store.logout();
                navigate('/login');
              }}
            >
              <LogOut size={16} />
              <span style={{ display: 'inline' }}>Chiqish</span>
            </button>
          </div>
        </div>
      </div>

      {/* TIME FILTER */}
      <div className="animate-fade-in-up" style={{ padding: '20px 24px 0' }}>
        <div className="time-pills flex items-center" style={{ gap: 8, maxWidth: 1400, margin: '0 auto', flexWrap: 'wrap' }}>
          {[
            { key: 'today', label: 'Bugun' },
            { key: 'week', label: 'Bu hafta' },
            { key: 'month', label: 'Bu oy' },
            { key: 'year', label: 'Bu yil' },
          ].map((f) => (
            <button
              key={f.key}
              className={`time-pill ${timeFilter === f.key ? 'active' : ''}`}
              onClick={() => setTimeFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="space-y-6" style={{ padding: '24px 24px 40px', maxWidth: 1400, margin: '0 auto' }}>

        {/* REVENUE HERO */}
        <div className="glass-hero animate-fade-in-up" style={{ padding: '28px 32px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
            <p style={{ fontSize: 13, color: COLORS.textSecondary, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 }}>
              Jami tushum
            </p>
            <div className="flex items-center" style={{ gap: 6 }}>
              <TrendingUp size={14} color={COLORS.green} />
              <span style={{ fontSize: 13, color: COLORS.green, fontWeight: 600 }}>+24.5%</span>
            </div>
          </div>
          <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 20 }}>
            <div>
              <p style={{ fontSize: 42, fontWeight: 800, color: COLORS.text, lineHeight: 1.1 }}>
                {formatCurrency(revenueAnimated)} <span style={{ fontSize: 18, color: COLORS.textSecondary, fontWeight: 500 }}>so'm</span>
              </p>
              <p style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 4 }}>
                Oldingi davr: {formatCurrency(103200000)} so'm
              </p>
            </div>
            <div style={{ width: 160 }}>
              <Sparkline data={[30, 45, 38, 52, 48, 61, 55, 70, 65, 78, 72, 85]} color={COLORS.red} width={160} height={50} />
            </div>
          </div>
          <div
            className="hero-stats-row flex items-center justify-between"
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: `1px solid ${COLORS.surfaceBorder}`,
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            {[
              { label: 'Sof foyda', value: formatCurrency(profit) + ' so\'m', color: COLORS.green },
              { label: 'Xarajatlar', value: formatCurrency(expenses) + ' so\'m', color: COLORS.orange },
              { label: 'Soliq', value: formatCurrency(tax) + ' so\'m', color: COLORS.yellow },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', flex: 1, minWidth: 100 }}>
                <p style={{ fontSize: 11, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                  {s.label}
                </p>
                <p style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* KPI GRID */}
        <div
          className="kpi-grid stagger"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}
        >
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div key={i} className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${kpi.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} color={kpi.color} />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 2 }}>
                    {kpi.label}
                  </p>
                  <p style={{ fontSize: 22, fontWeight: 800, color: COLORS.text }}>
                    {formatCurrency(kpi.value)}{kpi.suffix || ''}
                  </p>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: kpi.trend.startsWith('+') ? COLORS.green : COLORS.red,
                    }}
                  >
                    {kpi.trend}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div
          className="top-products-section"
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 20,
          }}
        >
          {/* LEFT: Weekly Chart + Top Products */}
          <div className="space-y-6">
            {/* WEEKLY REVENUE CHART */}
            <div className="card animate-fade-in-up" style={{ padding: 24 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>Haftalik tushum</h3>
                  <p style={{ fontSize: 12, color: COLORS.textSecondary }}>Bu haftaning kunlik tushumlari</p>
                </div>
                <BarChart3 size={18} color={COLORS.red} />
              </div>
              <BarChart data={weeklyData} labels={weekLabels} height={180} />
            </div>

            {/* TOP SELLING PRODUCTS */}
            <div className="card animate-fade-in-up" style={{ padding: 24 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>Eng ko'p sotilgan</h3>
                  <p style={{ fontSize: 12, color: COLORS.textSecondary }}>Top 5 mahsulot</p>
                </div>
                <Star size={18} color={COLORS.yellow} />
              </div>
              <div className="space-y-4">
                {topProducts.map((p) => {
                  const maxRev = topProducts[0].revenue;
                  const pct = (p.revenue / maxRev) * 100;
                  return (
                    <div key={p.rank} className="flex items-center" style={{ gap: 12 }}>
                      <div
                        className="rank-badge"
                        style={{
                          background: p.rank === 1 ? COLORS.red : p.rank <= 3 ? `${COLORS.red}30` : COLORS.surface,
                          color: p.rank === 1 ? COLORS.white : COLORS.textSecondary,
                          border: `1px solid ${p.rank <= 3 ? COLORS.red : COLORS.surfaceBorder}`,
                        }}
                      >
                        {p.rank}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.name}
                          </p>
                          <p style={{ fontSize: 12, color: COLORS.textSecondary, flexShrink: 0 }}>
                            {p.silled || p.sold} dona
                          </p>
                        </div>
                        <div className="revenue-bar">
                          <div className="revenue-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <p style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>
                          {formatCurrency(p.revenue)} so'm
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* REAL-TIME MONITORING */}
            <div className="glass-floating animate-fade-in-up" style={{ padding: 24 }}>
              <div className="flex items-center" style={{ gap: 10, marginBottom: 20 }}>
                <div className="pulsing-dot" />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>Jonli kuzatish</h3>
              </div>

              {/* Live Stats Row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                {[
                  { label: 'Tayyorlanmoqda', value: 3, color: COLORS.yellow },
                  { label: "Kuryer yo'lda", value: 2, color: COLORS.blue },
                  { label: 'Navbatda', value: 5, color: COLORS.purple },
                ].map((s, i) => (
                  <div
                    key={i}
                    style={{
                      background: COLORS.surface,
                      borderRadius: 8,
                      padding: '10px 8px',
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</p>
                    <p style={{ fontSize: 9, color: COLORS.textSecondary, marginTop: 2 }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Activity Feed */}
              <div>
                <p style={{ fontSize: 11, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                  So'nggi faoliyat
                </p>
                {liveActivity.map((a, i) => {
                  const typeColor =
                    a.type === 'create'
                      ? COLORS.blue
                      : a.type === 'ready'
                      ? COLORS.green
                      : a.type === 'delivered'
                      ? COLORS.purple
                      : a.type === 'accepted'
                      ? COLORS.yellow
                      : COLORS.orange;
                  return (
                    <div key={i} className="activity-item" style={{ animation: `fadeIn 0.3s ease ${i * 0.05}s both` }}>
                      <span style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600, minWidth: 40, fontFamily: 'monospace' }}>
                        {a.time}
                      </span>
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: typeColor,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 13, color: COLORS.textSecondary }}>{a.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="card animate-fade-in-up" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>
                Tezkor harakatlar
              </h3>
              <div className="quick-actions-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {quickActions.map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <div
                      key={i}
                      className="quick-action"
                      style={{ padding: 14, flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}
                      onClick={() => navigate(action.path)}
                    >
                      <div className="flex items-center" style={{ gap: 10, width: '100%' }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: `${COLORS.red}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon size={16} color={COLORS.red} />
                        </div>
                        <ArrowRight size={14} color={COLORS.textMuted} style={{ marginLeft: 'auto' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{action.label}</p>
                        <p style={{ fontSize: 11, color: COLORS.textMuted }}>{action.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function MenuIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

export default AdminDashboard;
