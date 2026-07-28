import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { motion } from 'framer-motion';
import { cn, formatPrice } from '../../utils/cn';

import {
  ChevronLeft, TrendingUp, TrendingDown, DollarSign, Package, Clock,
  BarChart3, ArrowUpRight, ArrowDownRight, Home, ShoppingBag, UtensilsCrossed, Settings
} from 'lucide-react';

function formatCurrency(v) {
  return (v || 0).toLocaleString('uz-UZ');
}

function Sparkline({ data, width = 120, height = 36 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - 4 - ((v - min) / range) * (height - 8);
    return `${x},${y}`;
  }).join(' ');
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  return (
    <svg width={width} height={height} className="block">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#sparkFill)" />
      <polyline points={points} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarChart({ data, labels, height = 120 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const barWidth = 32;
  const gap = 10;
  const svgWidth = data.length * (barWidth + gap) - gap;
  return (
    <svg width="100%" height={height + 28} viewBox={`0 0 ${svgWidth} ${height + 28}`} className="block" preserveAspectRatio="xMidYMid meet">
      {data.map((v, i) => {
        const barH = (v / max) * height;
        const x = i * (barWidth + gap);
        const y = height - barH;
        const isMax = v === max;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={barH} rx="5" fill={isMax ? 'var(--primary)' : 'rgba(249,115,22,0.25)'} style={{ transition: 'height 0.6s ease, y 0.6s ease' }} />
            <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontWeight="700">{formatCurrency(v)}</text>
            <text x={x + barWidth / 2} y={height + 18} textAnchor="middle" fill="var(--text-muted)" fontSize="10">{labels && labels[i] ? labels[i] : ''}</text>
          </g>
        );
      })}
    </svg>
  );
}

function HorzBar({ data }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((item, i) => {
        const pct = (item.value / max) * 100;
        const isPeak = item.value === max;
        return (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-textSecondary">{item.label}</span>
              <span className={cn('text-xs font-semibold', isPeak ? 'text-primary' : 'text-textMuted')}>{item.value} ta</span>
            </div>
            <div className="h-2 rounded-full bg-surfaceActive overflow-hidden">
              <div className={cn('h-full rounded-full transition-all duration-700', isPeak ? 'bg-primary' : 'bg-primary/30')} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

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
    { label: '08-10', value: 18 }, { label: '10-12', value: 34 }, { label: '12-14', value: 52 },
    { label: '14-16', value: 28 }, { label: '16-18', value: 45 }, { label: '18-20', value: 61 },
    { label: '20-22', value: 38 }, { label: '22-00', value: 12 },
  ];

  const paymentMethods = [
    { label: 'Naqd', pct: 70, color: 'var(--success)' },
    { label: 'Karta', pct: 20, color: 'var(--info)' },
    { label: 'Click', pct: 10, color: 'var(--warning)' },
  ];

  const sparklineData = period === 'today'
    ? [120, 180, 150, 220, 280, 240, 310, 290, 350, 320]
    : period === 'week' ? weekChart : [1200, 1350, 1100, 1420, 1580, 1300, 1500, 1650, 1400, 1700, 1550, 1800];

  useEffect(() => { setIsLoaded(true); }, []);

  useEffect(() => {
    if (!isLoaded || revenue === 0) { setAnimatedRevenue(0); return; }
    let start = 0;
    const duration = 1200;
    const step = revenue / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= revenue) { start = revenue; clearInterval(timer); }
      setAnimatedRevenue(Math.round(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isLoaded, revenue, period]);

  const bestSellingItem = topItems.length > 0 ? topItems[0].name : '—';
  const worstSellingItem = topItems.length > 0 ? topItems[topItems.length - 1].name : '—';

  const statCards = [
    { icon: Package, label: 'Buyurtmalar', value: ordersCount, color: 'var(--info)' },
    { icon: DollarSign, label: "O'rtacha summa", value: `${formatCurrency(avgOrder)} so'm`, color: 'var(--success)' },
    { icon: ArrowUpRight, label: "Eng ko'p", value: bestSellingItem, color: 'var(--primary)' },
    { icon: ArrowDownRight, label: 'Eng kam', value: worstSellingItem, color: 'var(--warning)' },
  ];

  const periods = [
    { key: 'today', label: 'Kun' },
    { key: 'week', label: 'Hafta' },
    { key: 'month', label: 'Oy' },
  ];

  const navItems = [
    { label: 'KDS', icon: Home, path: '/seller' },
    { label: 'Buyurtmalar', icon: ShoppingBag, path: '/seller/orders' },
    { label: 'Menyu', icon: UtensilsCrossed, path: '/seller/menu' },
    { label: 'Statistika', icon: BarChart3, path: '/seller/analytics' },
    { label: 'Sozlamalar', icon: Settings, path: '/seller/settings' },
  ];

  return (
    <div className="min-h-full bg-bg pb-24">
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-borderStrong transition-all">
              <ChevronLeft size={18} className="text-text" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-text">Statistika</h1>
              <p className="text-xs text-textMuted">Sotuv tahlillari</p>
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 size={18} className="text-primary" />
          </div>
        </div>

        <div className="flex bg-surface border border-border rounded-xl p-1 gap-1 mb-4">
          {periods.map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)}
              className={cn('flex-1 py-2 rounded-lg text-xs font-semibold transition-all border-none cursor-pointer',
                period === p.key ? 'bg-primary text-white shadow-sm' : 'bg-transparent text-textMuted hover:text-text'
              )}
            >{p.label}</button>
          ))}
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4 mb-4 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-primary/5 pointer-events-none" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-textMuted">{period === 'today' ? 'Bugungi tushum' : period === 'week' ? 'Haftalik tushum' : 'Oylik tushum'}</p>
              <p className="text-3xl font-extrabold text-text tabular-nums tracking-tight mt-0.5">
                {formatCurrency(animatedRevenue)} <span className="text-base text-textMuted font-medium">so'm</span>
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                {isUp ? <TrendingUp size={14} className="text-success" /> : <TrendingDown size={14} className="text-danger" />}
                <span className={cn('text-xs font-bold', isUp ? 'text-success' : 'text-danger')}>{isUp ? '+' : ''}{revenueTrend}%</span>
                <span className="text-xs text-textMuted">o'tgan davrga nisbatan</span>
              </div>
            </div>
            <Sparkline data={sparklineData} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {statCards.map((st, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-3 flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${st.color}12` }}>
                <st.icon size={16} style={{ color: st.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-textMuted font-medium">{st.label}</p>
                <p className="text-sm font-bold text-text tabular-nums truncate">{st.value}</p>
              </div>
            </div>
          ))}
        </div>

        {topItems.length > 0 && (
          <div className="bg-surface border border-border rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-text">Top mahsulotlar</h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-primary/10 text-primary">{topItems.length} ta</span>
            </div>
            <div className="space-y-2">
              {topItems.map((item, i) => {
                const maxRevenue = topItems[0]?.revenue || 1;
                const barPct = (item.revenue / maxRevenue) * 100;
                return (
                  <div key={i} className="p-3 bg-bg border border-border rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center text-xs font-extrabold', i < 3 ? 'bg-primary/10 text-primary' : 'bg-surfaceActive text-textMuted')}>
                          #{i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text">{item.name}</p>
                          <p className="text-xs text-textMuted">{item.sold} ta sotildi</p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-success tabular-nums">{formatCurrency(item.revenue)} so'm</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surfaceActive overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${barPct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {weekChart.length > 0 && (
          <div className="bg-surface border border-border rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-text">Haftalik tushum</h3>
              <span className="text-xs text-textMuted">So'm</span>
            </div>
            <BarChart data={weekChart} labels={weekDays} />
          </div>
        )}

        <div className="bg-surface border border-border rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-text">Soatlik buyurtmalar</h3>
            <Clock size={15} className="text-textMuted" />
          </div>
          <HorzBar data={hoursData} />
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4">
          <h3 className="font-bold text-text mb-3">To'lov usullari</h3>
          <div className="space-y-3">
            {paymentMethods.map((m, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }} />
                    <span className="text-sm font-semibold text-textSecondary">{m.label}</span>
                  </div>
                  <span className="text-sm font-bold text-text tabular-nums">{m.pct}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-surfaceActive overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${m.pct}%`, background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
          {navItems.map((item) => {
            const active = item.path === '/seller/analytics';
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full border-none bg-transparent cursor-pointer transition-all"
                style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }}
              >
                <item.icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                <span className="text-[10px] font-semibold" style={{ fontWeight: active ? 700 : 500 }}>{item.label}</span>
                {active && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}