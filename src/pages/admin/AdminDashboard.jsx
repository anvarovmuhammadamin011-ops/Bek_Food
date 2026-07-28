import { useState, useEffect } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DollarSign, Package, Clock, ChefHat, Truck, TrendingUp, Users,
  BarChart3, ArrowRight, ShoppingCart, Menu, Star, XCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

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

const Sparkline = ({ data, width = 120, height = 40 }) => {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height }}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${pts} ${width},${height}`} fill="url(#sg)" />
      <polyline points={pts} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const BarChart = ({ data, labels, height = 200 }) => {
  const max = Math.max(...data);
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <svg viewBox="0 0 700 240" style={{ width: '100%', height }}>
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <line key={i} x1="0" y1={20 + (1 - p) * 180} x2="700" y2={20 + (1 - p) * 180} stroke="var(--border)" strokeWidth="1" />
        ))}
        {data.map((v, i) => {
          const barH = (v / max) * 160;
          const x = i * 100 + 20;
          const y = 200 - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={60} height={barH} rx="4" fill="url(#bg)" opacity="0.85">
                <animate attributeName="height" from="0" to={barH} dur="0.6s" fill="freeze" begin={`${i * 0.08}s`} />
                <animate attributeName="y" from="200" to={y} dur="0.6s" fill="freeze" begin={`${i * 0.08}s`} />
              </rect>
              <text x={x + 30} y={18} textAnchor="middle" fill="var(--text-muted)" fontSize="10">{labels[i]}</text>
              <text x={x + 30} y={y - 5} textAnchor="middle" fill="var(--text-secondary)" fontSize="9" fontWeight="600">{v.toLocaleString()}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function AdminDashboard() {
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
    { label: 'Buyurtmalar soni', value: 1247, icon: Package, trend: '+12%' },
    { label: 'Faol buyurtmalar', value: 23, icon: Clock, trend: '+5%' },
    { label: 'Bekor qilingan', value: 18, icon: XCircle, trend: '-3%' },
    { label: "O'rtacha summa", value: 68000, icon: DollarSign, trend: '+8%' },
    { label: "O'rtacha tayyorlash", value: 15, icon: ChefHat, trend: '-2%', suffix: ' daq' },
    { label: "O'rtacha yetkazish", value: 28, icon: Truck, trend: '+1%', suffix: ' daq' },
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
    { label: 'Menyu', path: '/admin/menu', icon: Menu, desc: 'Menyuni boshqarish' },
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
        const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        return [{ time: ts, text: item.text, type: item.type }, ...prev].slice(0, 5);
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const activityDotColor = (type) => ({
    create: 'var(--primary)',
    ready: 'var(--success)',
    delivered: '#8B5CF6',
    accepted: 'var(--warning)',
    preparing: 'var(--primary)',
  }[type] || 'var(--text-muted)');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div variants={item} initial="hidden" animate="visible" style={{ padding: '28px 0 24px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', margin: '0 0 4px' }}>Dashboard</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
          Xush kelibsiz, <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user.name || 'Admin'}</span>
        </p>
      </motion.div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {[{ key: 'today', label: 'Bugun' }, { key: 'week', label: 'Bu hafta' }, { key: 'month', label: 'Bu oy' }, { key: 'year', label: 'Bu yil' }].map((f) => (
          <button key={f.key} onClick={() => setTimeFilter(f.key)}
            style={{
              padding: '7px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              border: '1px solid ' + (timeFilter === f.key ? 'var(--primary)' : 'var(--border)'),
              background: timeFilter === f.key ? 'var(--primary)' : 'var(--surface)',
              color: timeFilter === f.key ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.2s',
            }}
          >{f.label}</button>
        ))}
      </div>

      <motion.div variants={container} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <motion.div variants={item}>
          <Card padding="lg" variant="elevated">
            <CardHeader align="between">
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Jami tushum</p>
              <Badge variant="success" size="sm"><TrendingUp size={13} /> +24.5%</Badge>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                <div>
                  <p style={{ fontSize: 32, fontWeight: 700, color: 'var(--text)', margin: '0 0 4px' }}>
                    {revenueAnimated.toLocaleString()} <span style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 500 }}>so'm</span>
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Oldingi davr: {103200000 .toLocaleString()} so'm</p>
                </div>
                <div style={{ width: 160 }}><Sparkline data={[30, 45, 38, 52, 48, 61, 55, 70, 65, 78, 72, 85]} width={160} height={50} /></div>
              </div>
            </CardContent>
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                  { label: 'Sof foyda', value: profit.toLocaleString() + " so'm", color: 'var(--success)' },
                  { label: 'Xarajatlar', value: expenses.toLocaleString() + " so'm", color: 'var(--primary)' },
                  { label: 'Soliq', value: tax.toLocaleString() + " so'm", color: 'var(--warning)' },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 4px' }}>{s.label}</p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: s.color, margin: 0 }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {kpis.map((kpi, i) => {
              const Icon = kpi.icon;
              return (
                <motion.div key={i} variants={item}>
                  <Card padding="md" hoverable>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={19} style={{ color: 'var(--primary)' }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 2px' }}>{kpi.label}</p>
                        <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{kpi.value.toLocaleString()}{kpi.suffix || ''}</p>
                        <span style={{ fontSize: 11, fontWeight: 600, color: kpi.trend.startsWith('+') ? 'var(--success)' : 'var(--danger)' }}>{kpi.trend}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <Card padding="lg">
                <CardHeader align="between">
                  <div>
                    <CardTitle>Haftalik tushum</CardTitle>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>Bu haftaning kunlik tushumlari</p>
                  </div>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BarChart3 size={16} style={{ color: 'var(--primary)' }} />
                  </div>
                </CardHeader>
                <CardContent><BarChart data={weeklyData} labels={weekLabels} height={180} /></CardContent>
              </Card>

              <Card padding="lg">
                <CardHeader align="between">
                  <div>
                    <CardTitle>Eng ko'p sotilgan</CardTitle>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>Top 5 mahsulot</p>
                  </div>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Star size={16} style={{ color: 'var(--warning)' }} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {topProducts.map((p) => {
                      const pct = (p.revenue / topProducts[0].revenue) * 100;
                      return (
                        <div key={p.rank} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, background: p.rank === 1 ? 'var(--primary)' : p.rank <= 3 ? 'var(--primary-light)' : 'var(--surface-active)', color: p.rank === 1 ? '#fff' : p.rank <= 3 ? 'var(--primary)' : 'var(--text-muted)' }}>{p.rank}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{p.name}</span>
                              <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{p.sold} dona</span>
                            </div>
                            <div style={{ height: 5, borderRadius: 999, background: 'var(--surface-active)', overflow: 'hidden' }}>
                              <div style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, var(--primary), #FB923C)', width: pct + '%' }} />
                            </div>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 0' }}>{p.revenue.toLocaleString()} so'm</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <Card padding="lg">
                <CardHeader>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
                    <CardTitle>Jonli kuzatish</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
                    {[
                      { label: 'Tayyorlanmoqda', value: 3, color: 'var(--warning)' },
                      { label: "Kuryer yo'lda", value: 2, color: '#3B82F6' },
                      { label: 'Navbatda', value: 5, color: '#8B5CF6' },
                    ].map((s, i) => (
                      <div key={i} style={{ background: 'var(--surface-active)', borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
                        <p style={{ fontSize: 20, fontWeight: 700, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 0' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>So'nggi faoliyat</p>
                  {liveActivity.map((a, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < liveActivity.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, minWidth: 40, fontVariantNumeric: 'tabular-nums' }}>{a.time}</span>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: activityDotColor(a.type), flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{a.text}</span>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              <Card padding="lg">
                <CardTitle style={{ marginBottom: 16 }}>Tezkor harakatlar</CardTitle>
                <CardContent>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {quickActions.map((action, i) => {
                      const Icon = action.icon;
                      return (
                        <motion.div key={i} whileHover={{ y: -2, borderColor: 'var(--primary)' }}
                          style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s' }}
                          onClick={() => navigate(action.path)}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon size={17} style={{ color: 'var(--primary)' }} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', margin: 0 }}>{action.label}</p>
                            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>{action.desc}</p>
                          </div>
                          <ArrowRight size={14} style={{ color: 'var(--text-muted)', marginLeft: 'auto', flexShrink: 0 }} />
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
