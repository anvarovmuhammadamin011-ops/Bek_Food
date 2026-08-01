import { useState, useEffect } from 'react';
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
  Users,
  BarChart3,
  ArrowRight,
  ShoppingCart,
  Star,
  Tag,
} from 'lucide-react';

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

const Sparkline = ({ data, width = 120, height = 40 }) => {
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
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height }}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#sparkGrad)" />
      <polyline
        points={points}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const BarChart = ({ data, labels, height = 200 }) => {
  const max = Math.max(...data);
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <svg viewBox="0 0 700 240" style={{ width: '100%', height }}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--primary-hover)" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line
            key={i}
            x1="0"
            y1={20 + (1 - p) * 180}
            x2="700"
            y2={20 + (1 - p) * 180}
            stroke="var(--border)"
            strokeWidth="1"
          />
        ))}
        {data.map((v, i) => {
          const barH = (v / max) * 160;
          const x = i * 100 + 20;
          const y = 200 - barH;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={60}
                height={barH}
                rx="4"
                fill="url(#barGrad)"
                opacity="0.85"
              />
              <text
                x={x + 30}
                y={18}
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize="10"
                fontFamily="var(--font-sans)"
              >
                {labels[i]}
              </text>
              <text
                x={x + 30}
                y={y - 5}
                textAnchor="middle"
                fill="var(--text-secondary)"
                fontSize="9"
                fontWeight="600"
                fontFamily="var(--font-sans)"
              >
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
  const [liveActivity, setLiveActivity] = useState([
    { time: '14:32', text: "#1001 buyurtma yaratildi", type: 'create' },
    { time: '14:35', text: "#1002 tayyor bo'ldi", type: 'ready' },
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
    { label: 'Buyurtmalar soni', value: 1247, icon: Package, colorVar: '--primary', trend: '+12%' },
    { label: 'Faol buyurtmalar', value: 23, icon: Clock, colorVar: '--warning', trend: '+5%' },
    { label: 'Bekor qilingan', value: 18, icon: XCircle, colorVar: '--danger', trend: '-3%' },
    { label: "O'rtacha summa", value: 68000, icon: DollarSign, colorVar: '--success', trend: '+8%' },
    { label: "O'rtacha tayyorlash", value: 15, icon: ChefHat, colorVar: '--primary', trend: '-2%', suffix: ' daq' },
    { label: "O'rtacha yetkazish", value: 28, icon: Truck, colorVar: '--primary', trend: '+1%', suffix: ' daq' },
  ];

  const weeklyData = [18000000, 22000000, 19500000, 25000000, 21000000, 28000000, 24000000];
  const weekLabels = ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'];

  const topProducts = [
    { rank: 1, name: 'Hot-dog 2x (Double)', sold: 342, revenue: 45200000 },
    { rank: 2, name: 'Lavash', sold: 289, revenue: 28900000 },
    { rank: 3, name: 'Hot-dog oddiy', sold: 234, revenue: 35100000 },
    { rank: 4, name: 'Doner kichik', sold: 198, revenue: 23760000 },
    { rank: 5, name: 'Gamburger', sold: 167, revenue: 21710000 },
  ];

  const quickActions = [
    { label: 'Buyurtmalar', path: '/admin/orders', icon: ShoppingCart, desc: 'Barcha buyurtmalar' },
    { label: 'Promo kodlar', path: '/admin/promos', icon: Tag, desc: 'Chegirma kodlari' },
    { label: 'Mijozlar', path: '/admin/customers', icon: Users, desc: "Mijozlar ro'yxati" },
    { label: 'Xodimlar', path: '/admin/employees', icon: Users, desc: 'Xodimlar boshqaruvi' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveActivity((prev) => {
        const types = [
          { text: `#${1000 + Math.floor(Math.random() * 999)} buyurtma yaratildi`, type: 'create' },
          { text: `#${1000 + Math.floor(Math.random() * 999)} tayyor bo'ldi`, type: 'ready' },
          { text: `#${1000 + Math.floor(Math.random() * 999)} yetkazildi`, type: 'delivered' },
        ];
        const item = types[Math.floor(Math.random() * types.length)];
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        return [{ time: timeStr, text: item.text, type: item.type }, ...prev].slice(0, 5);
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const activityTypeColor = (type) => {
    switch (type) {
      case 'create': return 'var(--primary)';
      case 'ready': return 'var(--success)';
      case 'delivered': return '#8B5CF6';
      case 'accepted': return 'var(--warning)';
      case 'preparing': return 'var(--primary)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="page-enter" style={{ padding: '0 0 48px', maxWidth: 1400, margin: '0 auto' }}>

      <style>{`
        .dash-kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .dash-two-col { display: grid; grid-template-columns: 1fr 380px; gap: 20px; }
        .dash-hero-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .dash-live-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .dash-qa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .dash-time-pill { padding: 7px 16px; border-radius: 999px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid var(--border); background: var(--surface); color: var(--text-muted); transition: all 0.2s; font-family: var(--font-sans); }
        .dash-time-pill.active { background: var(--primary); color: #fff; border-color: var(--primary); }
        .dash-time-pill:hover:not(.active) { border-color: var(--border-strong); color: var(--text); }
        .dash-activity-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }
        .dash-activity-item:last-child { border-bottom: none; }
        .dash-activity-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .dash-rank { width: 28px; height: 28px; border-radius: var(--radius-xs); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
        .dash-qa-card { display: flex; align-items: center; gap: 14px; padding: 16px; border-radius: var(--radius-sm); background: var(--surface); border: 1px solid var(--border); cursor: pointer; transition: all 0.2s; }
        .dash-qa-card:hover { border-color: var(--primary); background: var(--surface-hover); transform: translateY(-1px); box-shadow: var(--shadow-sm); }
        .dash-revenue-bar { height: 5px; border-radius: 999px; background: var(--surface-active); overflow: hidden; }
        .dash-revenue-bar-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--primary), #FB923C); }
        .dash-live-indicator { width: 8px; height: 8px; border-radius: 50%; background: var(--success); animation: livePulse 2s ease-in-out infinite; }
        @media (max-width: 1100px) { .dash-two-col { grid-template-columns: 1fr; } }
        @media (max-width: 768px) { .dash-kpi-grid { grid-template-columns: repeat(2, 1fr); } .dash-hero-stats { grid-template-columns: 1fr; } .dash-qa-grid { grid-template-columns: 1fr; } }
        @media (max-width: 480px) { .dash-kpi-grid { grid-template-columns: 1fr; } .dash-time-pills { flex-wrap: wrap; gap: 6px !important; } }
      `}</style>

      <div style={{ padding: '32px 0 24px' }}>
        <h1 className="display-2" style={{ marginBottom: 4 }}>Dashboard</h1>
        <p className="body">Xush kelibsiz, <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user.name || 'Admin'}</span></p>
      </div>

      <div className="dash-time-pills flex items-center" style={{ gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {[
          { key: 'today', label: 'Bugun' },
          { key: 'week', label: 'Bu hafta' },
          { key: 'month', label: 'Bu oy' },
          { key: 'year', label: 'Bu yil' },
        ].map((f) => (
          <button
            key={f.key}
            className={`dash-time-pill ${timeFilter === f.key ? 'active' : ''}`}
            onClick={() => setTimeFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">

        <div className="card card-elevated animate-fade-in-up" style={{ padding: '28px 32px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
            <p className="overline">Jami tushum</p>
            <div className="badge badge-success" style={{ gap: 4 }}>
              <TrendingUp size={13} />
              +24.5%
            </div>
          </div>
          <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 20 }}>
            <div>
              <p className="display-1" style={{ color: 'var(--text)', marginBottom: 4 }}>
                {formatCurrency(revenueAnimated)} <span className="heading" style={{ color: 'var(--text-muted)', fontWeight: 500 }}>so'm</span>
              </p>
              <p className="caption">Oldingi davr: {formatCurrency(103200000)} so'm</p>
            </div>
            <div style={{ width: 160 }}>
              <Sparkline data={[30, 45, 38, 52, 48, 61, 55, 70, 65, 78, 72, 85]} width={160} height={50} />
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 24, paddingTop: 20 }}>
            <div className="dash-hero-stats">
              {[
                { label: 'Sof foyda', value: formatCurrency(profit) + " so'm", color: 'var(--success)' },
                { label: 'Xarajatlar', value: formatCurrency(expenses) + " so'm", color: 'var(--primary)' },
                { label: 'Soliq', value: formatCurrency(tax) + " so'm", color: 'var(--warning)' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <p className="overline" style={{ marginBottom: 4 }}>{s.label}</p>
                  <p className="heading" style={{ fontWeight: 700, color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dash-kpi-grid stagger">
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div key={i} className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px' }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 'var(--radius-sm)',
                    background: `color-mix(in srgb, var(${kpi.colorVar}) 10%, transparent)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={19} style={{ color: `var(${kpi.colorVar})` }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p className="caption" style={{ marginBottom: 2 }}>{kpi.label}</p>
                  <p className="price-lg">{formatCurrency(kpi.value)}{kpi.suffix || ''}</p>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: kpi.trend.startsWith('+') ? 'var(--success)' : 'var(--danger)',
                    }}
                  >
                    {kpi.trend}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="dash-two-col">
          <div className="space-y-6">

            <div className="card card-elevated animate-fade-in-up" style={{ padding: 24 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
                <div>
                  <h3 className="heading" style={{ marginBottom: 2 }}>Haftalik tushum</h3>
                  <p className="caption">Bu haftaning kunlik tushumlari</p>
                </div>
                <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-xs)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BarChart3 size={16} style={{ color: 'var(--primary)' }} />
                </div>
              </div>
              <BarChart data={weeklyData} labels={weekLabels} height={180} />
            </div>

            <div className="card card-elevated animate-fade-in-up" style={{ padding: 24 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
                <div>
                  <h3 className="heading" style={{ marginBottom: 2 }}>Eng ko'p sotilgan</h3>
                  <p className="caption">Top 5 mahsulot</p>
                </div>
                <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-xs)', background: 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={16} style={{ color: 'var(--warning)' }} />
                </div>
              </div>
              <div className="space-y-4">
                {topProducts.map((p) => {
                  const pct = (p.revenue / topProducts[0].revenue) * 100;
                  return (
                    <div key={p.rank} className="flex items-center" style={{ gap: 12 }}>
                      <div
                        className="dash-rank"
                        style={{
                          background: p.rank === 1 ? 'var(--primary)' : p.rank <= 3 ? 'var(--primary-light)' : 'var(--surface-active)',
                          color: p.rank === 1 ? '#fff' : p.rank <= 3 ? 'var(--primary)' : 'var(--text-muted)',
                        }}
                      >
                        {p.rank}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: 5 }}>
                          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
                            {p.name}
                          </p>
                          <span className="caption" style={{ flexShrink: 0, marginLeft: 8 }}>
                            {p.sold} dona
                          </span>
                        </div>
                        <div className="dash-revenue-bar">
                          <div className="dash-revenue-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-xs" style={{ color: 'var(--text-dim)', marginTop: 4 }}>
                          {formatCurrency(p.revenue)} so'm
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">

            <div className="card card-elevated animate-fade-in-up" style={{ padding: 24 }}>
              <div className="flex items-center" style={{ gap: 10, marginBottom: 20 }}>
                <div className="dash-live-indicator" />
                <h3 className="heading">Jonli kuzatish</h3>
              </div>

              <div className="dash-live-stats" style={{ marginBottom: 20 }}>
                {[
                  { label: 'Tayyorlanmoqda', value: 3, color: 'var(--warning)' },
                  { label: "Kuryer yo'lda", value: 2, color: '#3B82F6' },
                  { label: 'Navbatda', value: 5, color: '#8B5CF6' },
                ].map((s, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--surface-hover)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 8px',
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ fontSize: 20, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="overline" style={{ marginBottom: 10 }}>So'nggi faoliyat</p>
                {liveActivity.map((a, i) => (
                  <div key={i} className="dash-activity-item" style={{ animation: `fadeIn 0.3s ease ${i * 0.05}s both` }}>
                    <span style={{ fontSize: 12, color: 'var(--text-dim)', fontWeight: 600, minWidth: 40, fontFamily: 'var(--font-sans)', fontVariantNumeric: 'tabular-nums' }}>
                      {a.time}
                    </span>
                    <div className="dash-activity-dot" style={{ background: activityTypeColor(a.type) }} />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{a.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card card-elevated animate-fade-in-up" style={{ padding: 24 }}>
              <h3 className="heading" style={{ marginBottom: 16 }}>Tezkor harakatlar</h3>
              <div className="dash-qa-grid">
                {quickActions.map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <div
                      key={i}
                      className="dash-qa-card"
                      onClick={() => navigate(action.path)}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 'var(--radius-xs)',
                          background: 'var(--primary-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={17} style={{ color: 'var(--primary)' }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{action.label}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{action.desc}</p>
                      </div>
                      <ArrowRight size={14} style={{ color: 'var(--text-dim)', marginLeft: 'auto', flexShrink: 0 }} />
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

export default AdminDashboard;

