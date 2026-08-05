import { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Package,
  Clock,
  XCircle,
  ChefHat,
  CheckCircle2,
  Star,
  TrendingUp,
  BarChart3,
  ReceiptText,
  ArrowRight,
  ShoppingCart,
  Sparkles,
  Plus,
  FolderPlus,
  Tag,
  Bike,
  Timer,
  PackageCheck,
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
  (n || 0).toLocaleString('uz-UZ', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const BarChart = ({ data, labels, height = 200 }) => {
  const max = Math.max(...data, 1);
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
              <rect x={x} y={y} width={60} height={barH} rx="4" fill="url(#barGrad)" opacity="0.85" />
              <text x={x + 30} y={18} textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-sans)">
                {labels[i]}
              </text>
              <text x={x + 30} y={y - 5} textAnchor="middle" fill="var(--text-secondary)" fontSize="9" fontWeight="600" fontFamily="var(--font-sans)">
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
  const orders = store.orders || [];

  const statusCount = (status) => orders.filter((o) => o.status === status).length;

  const employees = store.employees || [];
  const activeCouriers = employees.filter((e) => e.role === 'courier' && e.isOnline).length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');
  const deliveredTimes = deliveredOrders
    .filter((o) => o.assignedAt && o.deliveredAt)
    .map((o) => new Date(o.deliveredAt).getTime() - new Date(o.assignedAt).getTime());
  const avgDeliveryMin = deliveredTimes.length
    ? Math.round(deliveredTimes.reduce((s, t) => s + t, 0) / deliveredTimes.length / 60000)
    : 0;
  const cancelledDeliveries = orders.filter((o) => o.status === 'cancelled' && o.deliveryType === 'delivery').length;

  const todayOrders = orders;
  const todayRevenue = todayOrders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
  const revenueAnimated = useCountUp(todayRevenue);
  const pending = statusCount('pending');
  const preparing = statusCount('preparing');
  const ready = statusCount('ready');
  const completed = statusCount('delivered');
  const cancelled = statusCount('cancelled');

  const salesByFood = {};
  orders.forEach((o) => {
    (o.items || []).forEach((i) => {
      const name = i.food?.name || 'Noma’lum';
      salesByFood[name] = salesByFood[name] || { name, count: 0, revenue: 0 };
      salesByFood[name].count += i.quantity || 1;
      salesByFood[name].revenue += (i.price || 0) * (i.quantity || 1);
    });
  });
  const topFoods = Object.values(salesByFood)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const topFoodName = topFoods[0]?.name || '—';
  const topFoodCount = topFoods[0]?.count || 0;

  const dayNames = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
  const weekStats = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toDateString();
    const dayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === key && o.status !== 'cancelled');
    return {
      label: dayNames[d.getDay()],
      orders: dayOrders.length,
      revenue: dayOrders.reduce((s, o) => s + (o.total || 0), 0),
    };
  });

  const kpis = [
    { label: "Bugungi tushum", value: revenueAnimated, prefix: '', icon: DollarSign, colorVar: '--primary', bg: 'var(--primary-light)' },
    { label: "Bugungi buyurtmalar", value: todayOrders.length, prefix: 'ta', icon: ShoppingCart, colorVar: '--success', bg: '#F0FDF4' },
    { label: 'Kutilmoqda', value: pending, prefix: 'ta', icon: Clock, colorVar: '--warning', bg: '#FFFBEB', link: 'pending' },
    { label: 'Tayyorlanmoqda', value: preparing, prefix: 'ta', icon: ChefHat, colorVar: '--primary', bg: 'var(--primary-light)', link: 'preparing' },
    { label: 'Tayyor', value: ready, prefix: 'ta', icon: CheckCircle2, colorVar: '#3B82F6', bg: '#EFF6FF', link: 'ready' },
    { label: 'Yetkazildi', value: completed, prefix: 'ta', icon: Package, colorVar: '--success', bg: '#F0FDF4', link: 'delivered' },
    { label: 'Bekor qilingan', value: cancelled, prefix: 'ta', icon: XCircle, colorVar: '--danger', bg: '#FEF2F2', link: 'cancelled' },
    { label: 'Eng ko\'p sotilgan', value: topFoodName, prefix: `${topFoodCount} ta`, icon: Star, colorVar: '--warning', bg: '#FFFBEB' },
  ];

  const quickActions = [
    { label: "Mahsulot qo'shish", path: '/admin/products?new=1', icon: Plus, colorVar: '--primary', bg: 'var(--primary-light)' },
    { label: "Kategoriya qo'shish", path: '/admin/categories?new=1', icon: FolderPlus, colorVar: '--success', bg: '#F0FDF4' },
    { label: 'Promo kod yaratish', path: '/admin/promotions?new=1', icon: Tag, colorVar: '--warning', bg: '#FFFBEB' },
  ];

  const statusMeta = {
    pending: { label: 'Kutilmoqda', color: '#F59E0B' },
    confirmed: { label: 'Tasdiqlandi', color: '#F59E0B' },
    preparing: { label: 'Tayyorlanmoqda', color: 'var(--primary)' },
    ready: { label: 'Tayyor', color: '#3B82F6' },
    assigned: { label: 'Kuryer tayinlandi', color: '#F59E0B' },
    onTheWay: { label: 'Yetkazilmoqda', color: '#8B5CF6' },
    pickedUp: { label: 'Olib ketildi', color: '#8B5CF6' },
    delivered: { label: 'Yetkazildi', color: 'var(--success)' },
    cancelled: { label: 'Bekor qilingan', color: 'var(--danger)' },
  };

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="page-enter" style={{ padding: '0 0 48px', maxWidth: 1400, margin: '0 auto' }}>
      <style>{`
        .dash-page-header{padding:24px 16px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;width:100%;overflow-x:hidden}
        .dash-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .dash-two-col { display: grid; grid-template-columns: 1fr 380px; gap: 20px; }
        .dash-revenue-bar { height: 5px; border-radius: 999px; background: var(--surface-active); overflow: hidden; }
        .dash-revenue-bar-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--primary), #FB923C); }
        .dash-chart-shell { overflow-x: auto; margin: 0 -4px; padding: 0 4px; }
        .dash-chart-shell > div { min-width: 320px; }
        @media (max-width: 1100px) { .dash-two-col { grid-template-columns: 1fr; } }
        @media (max-width: 768px) { .dash-kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; } .dash-quick-actions{flex-direction:column;align-items:stretch} .dash-quick-actions .card{width:100%;justify-content:flex-start;padding:12px 14px;min-width:0} .dash-kpi-grid .card{padding:14px 12px;gap:10px} .dash-kpi-grid .card .price-lg{font-size:16px;white-space:normal;line-height:1.2;overflow:visible} .dash-kpi-grid .card .caption{font-size:11px} .dash-recent-list button{flex-wrap:wrap;gap:8px;padding:12px 2px} .dash-recent-list .recent-amount{margin-left:auto} }
        @media (max-width: 480px) { .dash-page-header{padding:20px 12px 16px!important} .dash-kpi-grid { grid-template-columns: 1fr; } .dash-delivery{grid-template-columns:1fr!important} .dash-two-col .card{padding:16px!important} .dash-recent-list .recent-status{margin-left:auto} .dash-recent-list .recent-name{width:100%} .dash-quick-actions .card{padding:12px 12px} }
      `}</style>

      <div className="dash-page-header">
        <div>
          <h1 className="display-2" style={{ marginBottom: 4 }}>Dashboard</h1>
          <p className="body">Xush kelibsiz, <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user.name || 'Admin'}</span></p>
        </div>
        <button
          onClick={() => navigate('/admin/orders')}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <ReceiptText size={16} /> Buyurtmalar
        </button>
      </div>

      <div className="dash-quick-actions" style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {quickActions.map((qa, i) => {
          const Icon = qa.icon;
          return (
            <button
              key={i}
              onClick={() => navigate(qa.path)}
              className="card card-hover"
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px',
                border: '1px dashed rgba(249,115,22,0.35)', cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 14, fontWeight: 600, color: 'var(--text)', background: 'var(--surface)',
              }}
            >
              <span
                style={{
                  width: 34, height: 34, borderRadius: 10, background: qa.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                <Icon size={16} style={{ color: `var(${qa.colorVar})` }} />
              </span>
              {qa.label}
            </button>
          );
        })}
      </div>

      <div className="dash-kpi-grid" style={{ marginBottom: 20 }}>
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          const card = (
            <div
              key={i}
              className="card card-hover"
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px',
                cursor: kpi.link ? 'pointer' : 'default', height: '100%',
              }}
              onClick={kpi.link ? () => navigate(`/admin/orders?status=${kpi.link}`) : undefined}
            >
              <div
                style={{
                  width: 42, height: 42, borderRadius: 'var(--radius-sm)', background: kpi.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}
              >
                <Icon size={19} style={{ color: `var(${kpi.colorVar})` }} />
              </div>
              <div style={{ minWidth: 0, width: '100%' }}>
                <p className="caption" style={{ marginBottom: 2 }}>{kpi.label}</p>
                <p className="price-lg" style={{ fontSize: 18, whiteSpace: 'normal', overflow: 'visible', lineHeight: 1.2, wordBreak: 'break-word' }}>
                  {typeof kpi.value === 'number' ? formatCurrency(kpi.value) : kpi.value}
                </p>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{kpi.prefix}</span>
              </div>
            </div>
          );
          return card;
        })}
      </div>

      <div className="dash-delivery" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Bike size={17} style={{ color: 'var(--primary)' }} />
          </span>
          <div>
            <p className="caption" style={{ marginBottom: 1 }}>Faol kuryerlar</p>
            <p className="price-lg" style={{ fontSize: 17 }}>{activeCouriers} ta</p>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <PackageCheck size={17} style={{ color: 'var(--success)' }} />
          </span>
          <div>
            <p className="caption" style={{ marginBottom: 1 }}>Yetkazilgan buyurtmalar</p>
            <p className="price-lg" style={{ fontSize: 17 }}>{deliveredOrders.length} ta</p>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Timer size={17} style={{ color: '#3B82F6' }} />
          </span>
          <div>
            <p className="caption" style={{ marginBottom: 1 }}>O'rtacha yetkazish vaqti</p>
            <p className="price-lg" style={{ fontSize: 17 }}>{avgDeliveryMin} daqiqa</p>
          </div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <XCircle size={17} style={{ color: 'var(--danger)' }} />
          </span>
          <div>
            <p className="caption" style={{ marginBottom: 1 }}>Bekor qilingan yetkazishlar</p>
            <p className="price-lg" style={{ fontSize: 17 }}>{cancelledDeliveries} ta</p>
          </div>
        </div>
        <style>{`
          @media(max-width:1100px){ .dash-delivery{ grid-template-columns: repeat(2, 1fr) !important; } }
          @media(max-width:480px){ .dash-delivery{ grid-template-columns: 1fr !important; } }
        `}</style>
      </div>

      <div className="dash-two-col">
        <div className="space-y-6">
          <div className="card card-elevated animate-fade-in-up" style={{ padding: 24 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
              <div>
                <h3 className="heading" style={{ marginBottom: 2 }}>Haftalik tushum</h3>
                <p className="caption">Oxirgi 7 kunlik tushumlar</p>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-xs)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 size={16} style={{ color: 'var(--primary)' }} />
              </div>
            </div>
            <div className="dash-chart-shell">
              <BarChart data={weekStats.map((d) => d.revenue)} labels={weekStats.map((d) => d.label)} height={180} />
            </div>
          </div>

          <div className="card card-elevated animate-fade-in-up" style={{ padding: 24 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
              <div>
                <h3 className="heading" style={{ marginBottom: 2 }}>So'nggi buyurtmalar</h3>
                <p className="caption">Oxirgi 5 ta buyurtma</p>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-xs)', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ReceiptText size={16} style={{ color: 'var(--success)' }} />
              </div>
            </div>
            {recentOrders.length === 0 ? (
              <p className="caption" style={{ padding: '20px 0', textAlign: 'center' }}>Hali buyurtmalar yo'q</p>
            ) : (
              <div className="dash-recent-list">
                {recentOrders.map((o, i) => {
                  const st = statusMeta[o.status] || { label: o.status, color: 'var(--text-muted)' };
                  return (
                    <button
                      key={o.id}
                      onClick={() => navigate('/admin/orders')}
                      className="w-full"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
                        padding: '11px 4px', border: 'none', borderBottom: i < recentOrders.length - 1 ? '1px solid var(--border)' : 'none',
                        background: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12, fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)',
                          padding: '4px 9px', borderRadius: 8, flexShrink: 0,
                        }}
                      >
                        #{o.id}
                      </span>
                      <span className="text-sm font-semibold truncate recent-name" style={{ color: 'var(--text)', flex: 1, minWidth: 0 }}>
                        {o.customerName || 'Mijoz'}
                      </span>
                      <span className="text-sm font-semibold recent-amount" style={{ color: 'var(--text)', flexShrink: 0 }}>
                        {formatCurrency(o.total)} so'm
                      </span>
                      <span
                        className="recent-status"
                        style={{
                          fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
                          background: st.color + '14', color: st.color, flexShrink: 0,
                        }}
                      >
                        {st.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card card-elevated animate-fade-in-up" style={{ padding: 24 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
              <div>
                <h3 className="heading" style={{ marginBottom: 2 }}>Eng ko'p sotilgan mahsulotlar</h3>
                <p className="caption">Top 5 mahsulot</p>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-xs)', background: 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={16} style={{ color: 'var(--warning)' }} />
              </div>
            </div>
            {topFoods.length === 0 ? (
              <p className="caption" style={{ padding: '20px 0', textAlign: 'center' }}>Hali buyurtmalar yo'q</p>
            ) : (
              <div className="space-y-4">
                {topFoods.map((p, i) => {
                  const pct = (p.count / topFoods[0].count) * 100;
                  return (
                    <div key={p.name} className="flex items-center" style={{ gap: 12 }}>
                      <div
                        className="dash-rank"
                        style={{
                          width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, flexShrink: 0,
                          background: i === 0 ? 'var(--primary)' : i <= 2 ? 'var(--primary-light)' : 'var(--surface-active)',
                          color: i === 0 ? '#fff' : i <= 2 ? 'var(--primary)' : 'var(--text-muted)',
                        }}
                      >
                        {i + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: 5 }}>
                          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{p.name}</p>
                          <span className="caption" style={{ flexShrink: 0, marginLeft: 8 }}>{p.count} dona</span>
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
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card card-elevated animate-fade-in-up" style={{ padding: 24 }}>
            <div className="flex items-center" style={{ gap: 10, marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', animation: 'livePulse 2s ease-in-out infinite' }} />
              <h3 className="heading">Haftalik statistika</h3>
            </div>
            <div className="space-y-2">
              {weekStats.map((d, i) => (
                <div key={i} className="flex items-center justify-between" style={{ padding: '9px 0', borderBottom: i < weekStats.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 34, fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{d.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{d.orders} ta</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>{formatCurrency(d.revenue)} so'm</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-elevated animate-fade-in-up" style={{ padding: 24, background: 'linear-gradient(135deg, var(--primary-light), #FFFFFF)', border: '1px solid rgba(249,115,22,0.15)' }}>
            <div className="flex items-center" style={{ gap: 10, marginBottom: 14 }}>
              <Sparkles size={18} style={{ color: 'var(--primary)' }} />
              <h3 className="heading" style={{ color: 'var(--primary)' }}>Hafta yakuni</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="caption">Jami buyurtmalar</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  {weekStats.reduce((s, d) => s + d.orders, 0)} ta
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="caption">Jami tushum</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  {formatCurrency(weekStats.reduce((s, d) => s + d.revenue, 0))} so'm
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="caption">O'rtacha buyurtma</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  {formatCurrency(orders.reduce((s, o) => s + (o.total || 0), 0) / Math.max(orders.length, 1))} so'm
                </span>
              </div>
              <div className="divider" />
              <button
                onClick={() => navigate('/admin/analytics')}
                className="w-full"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 0', borderRadius: 'var(--radius-sm)', background: 'var(--primary)', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <TrendingUp size={16} /> To'liq analitika <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
