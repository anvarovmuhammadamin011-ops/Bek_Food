import { useState } from 'react';
import useStore from '../../store/useStore';
import { motion } from 'framer-motion';
import {
  DollarSign, ShoppingCart, TrendingUp, Calculator, Download, FileText,
  ArrowUpRight, ArrowDownRight, CreditCard, Wallet, Receipt,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const formatCurrency = (n) =>
  n.toLocaleString('uz-UZ', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const transactions = [
  { id: 1, type: 'income', desc: 'Bekfood Set #1042', amount: 85000, time: '14:32' },
  { id: 2, type: 'expense', desc: "Go'ht yetkazish", amount: -320000, time: '13:15' },
  { id: 3, type: 'income', desc: 'Lavash Classic #1041', amount: 45000, time: '12:48' },
  { id: 4, type: 'income', desc: 'Shashlik Set #1040', amount: 120000, time: '12:10' },
  { id: 5, type: 'expense', desc: "Kommunal to'lov", amount: -180000, time: '11:30' },
  { id: 6, type: 'income', desc: 'Burger King #1039', amount: 65000, time: '10:55' },
  { id: 7, type: 'expense', desc: 'Xodimlar ish haqi', amount: -4500000, time: '10:00' },
  { id: 8, type: 'income', desc: 'Pizza Margherita #1038', amount: 72000, time: '09:42' },
  { id: 9, type: 'income', desc: 'Combo Set #1037', amount: 95000, time: '09:15' },
  { id: 10, type: 'expense', desc: "Mevalar sotib olish", amount: -250000, time: '08:30' },
];

const expenseBreakdown = [
  { name: "Go'ht", pct: 45, color: 'var(--danger)' },
  { name: 'Mevalar', pct: 15, color: 'var(--success)' },
  { name: 'Ichimliklar', pct: 10, color: '#3B82F6' },
  { name: 'Xodimlar', pct: 20, color: 'var(--warning)' },
  { name: 'Kommunal', pct: 5, color: '#A855F7' },
  { name: 'Boshqa', pct: 5, color: 'var(--primary)' },
];

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const AdminFinance = () => {
  const store = useStore();
  const [period, setPeriod] = useState('oy');
  const [exportOpen, setExportOpen] = useState(false);

  const revenue = 128500000;
  const expenses = 72000000;
  const profit = revenue - expenses;
  const tax = 17500000;

  const weeklyData = [18000000, 22000000, 19500000, 25000000, 21000000, 28000000, 24000000];
  const weekLabels = ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'];

  const overviewCards = [
    { label: 'Daromad', value: revenue, icon: DollarSign, color: 'var(--success)', bg: 'rgba(34,197,94,0.08)', trend: '+12%' },
    { label: 'Xarajatlar', value: expenses, icon: ShoppingCart, color: 'var(--danger)', bg: 'rgba(239,68,68,0.08)', trend: '+5%' },
    { label: 'Sof foyda', value: profit, icon: TrendingUp, color: 'var(--success)', bg: 'rgba(34,197,94,0.08)', trend: '+18%' },
    { label: 'Soliq', value: tax, icon: Calculator, color: 'var(--warning)', bg: 'rgba(245,158,11,0.08)', trend: null },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div variants={container} initial="hidden" animate="visible">
        <motion.div variants={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', margin: 0 }}>Moliya</h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '4px 0 0' }}>Moliyaviy hisobot va tahlillar</p>
          </div>
          <div style={{ position: 'relative' }}>
            <Button variant="primary" size="md" leftIcon={<Download size={16} />} onClick={() => setExportOpen(!exportOpen)}>Export</Button>
            {exportOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 6, minWidth: 160, zIndex: 50, boxShadow: 'var(--shadow-lg)' }}>
                {[{ label: 'Excel', icon: FileText, color: 'var(--success)' }, { label: 'PDF', icon: FileText, color: 'var(--danger)' }, { label: 'CSV', icon: FileText, color: '#3B82F6' }].map((item) => (
                  <button key={item.label} onClick={() => setExportOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', border: 'none', borderRadius: 8, background: 'transparent', color: 'var(--text)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-active)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <item.icon size={16} color={item.color} />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={item} style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {[{ key: 'kun', label: 'Kun' }, { key: 'hafta', label: 'Hafta' }, { key: 'oy', label: 'Oy' }, { key: 'yil', label: 'Yil' }].map((p) => (
            <button key={p.key} onClick={() => setPeriod(p.key)}
              style={{
                padding: '8px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${period === p.key ? 'var(--primary)' : 'var(--border)'}`,
                background: period === p.key ? 'var(--primary)' : 'var(--surface)',
                color: period === p.key ? '#fff' : 'var(--text-secondary)', transition: 'all 0.2s',
                boxShadow: period === p.key ? '0 4px 12px rgba(249,115,22,0.3)' : 'none',
              }}
            >{p.label}</button>
          ))}
        </motion.div>

        <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {overviewCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Card key={i} padding="md" hoverable>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} color={card.color} />
                  </div>
                  {card.trend && (
                    <Badge variant={card.trend.startsWith('+') ? 'success' : 'danger'} size="xs">{card.trend}</Badge>
                  )}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '12px 0 0' }}>{card.label}</p>
                <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', margin: '4px 0 0' }}>
                  {formatCurrency(card.value)} <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>so'm</span>
                </p>
              </Card>
            );
          })}
        </motion.div>

        <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, marginBottom: 24 }}>
          <Card padding="lg">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <CardTitle>Daromad grafigi</CardTitle>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>Haftalik tushum</p>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(34,197,94,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={16} color="var(--success)" />
              </div>
            </div>
            <svg viewBox="0 0 700 240" style={{ width: '100%', height: 200 }}>
              <defs>
                <linearGradient id="afBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
              {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                <line key={i} x1="0" y1={20 + (1 - p) * 180} x2="700" y2={20 + (1 - p) * 180} stroke="var(--border)" strokeWidth="1" />
              ))}
              {weeklyData.map((v, i) => {
                const max = Math.max(...weeklyData);
                const barH = (v / max) * 160;
                const x = i * 100 + 20;
                const y = 200 - barH;
                return (
                  <g key={i}>
                    <rect x={x} y={y} width={60} height={barH} rx="6" fill="url(#afBarGrad)" opacity="0.9">
                      <animate attributeName="height" from="0" to={barH} dur="0.8s" fill="freeze" begin={`${i * 0.1}s`} />
                      <animate attributeName="y" from="200" to={y} dur="0.8s" fill="freeze" begin={`${i * 0.1}s`} />
                    </rect>
                    <text x={x + 30} y={18} textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontWeight="500">{weekLabels[i]}</text>
                    <text x={x + 30} y={y - 5} textAnchor="middle" fill="var(--text)" fontSize="9" fontWeight="600">{formatCurrency(v)}</text>
                  </g>
                );
              })}
            </svg>
          </Card>

          <Card padding="lg">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <CardTitle>Xarajatlar tarkibi</CardTitle>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>Kategoriya bo'yicha</p>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart size={16} color="var(--danger)" />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <svg viewBox="0 0 120 120" style={{ width: 120, height: 120 }}>
                {(() => {
                  let cumPct = 0;
                  const radius = 42;
                  const circumference = 2 * Math.PI * radius;
                  return expenseBreakdown.map((item, i) => {
                    const dashLen = (item.pct / 100) * circumference;
                    const dashOffset = (-cumPct * circumference) / 100;
                    cumPct += item.pct;
                    return (
                      <circle key={i} cx="60" cy="60" r={radius} fill="none" stroke={item.color} strokeWidth="14" strokeDasharray={`${dashLen} ${circumference - dashLen}`} strokeDashoffset={dashOffset} strokeLinecap="round" style={{ transition: 'all 0.5s ease' }} />
                    );
                  });
                })()}
                <text x="60" y="56" textAnchor="middle" fill="var(--text)" fontSize="14" fontWeight="800">{formatCurrency(expenses)}</text>
                <text x="60" y="70" textAnchor="middle" fill="var(--text-muted)" fontSize="8">Jami xarajat</text>
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {expenseBreakdown.map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{item.pct}%</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: 'var(--border)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.pct}%`, borderRadius: 2, background: item.color, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Jami cashback', value: 125000, icon: Wallet, color: 'var(--success)', bg: 'rgba(34,197,94,0.08)' },
            { label: 'Jami refund', value: 45000, icon: CreditCard, color: 'var(--danger)', bg: 'rgba(239,68,68,0.08)' },
            { label: 'Promo xarajatlari', value: 280000, icon: Receipt, color: 'var(--warning)', bg: 'rgba(245,158,11,0.08)' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Card key={i} padding="md" hoverable>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={item.color} />
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</span>
                </div>
                <p style={{ fontSize: 22, fontWeight: 800, color: item.color, margin: 0 }}>
                  {formatCurrency(item.value)} <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>so'm</span>
                </p>
              </Card>
            );
          })}
        </motion.div>

        <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          <Card padding="lg">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <CardTitle>Tranzaksiyalar</CardTitle>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>So'nggi 10 ta tranzaksiya</p>
              </div>
              <Button variant="ghost" size="sm">Barchasi</Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {transactions.map((tx) => (
                <div key={tx.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: tx.type === 'income' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {tx.type === 'income' ? <ArrowUpRight size={16} color="var(--success)" /> : <ArrowDownRight size={16} color="var(--danger)" />}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', margin: 0 }}>{tx.desc}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>{tx.time}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)', fontVariantNumeric: 'tabular-nums' }}>
                    {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)} so'm
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="lg">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <CardTitle>Export qilish</CardTitle>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>Hisobotni yuklab olish</p>
              </div>
              <Download size={18} color="var(--text-muted)" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Excel fayl', desc: '.xlsx formatida', icon: FileText, color: 'var(--success)', bgColor: 'rgba(34,197,94,0.1)' },
                { label: 'PDF hisobot', desc: '.pdf formatida', icon: FileText, color: 'var(--danger)', bgColor: 'rgba(239,68,68,0.1)' },
                { label: "CSV ma'lumot", desc: '.csv formatida', icon: FileText, color: '#3B82F6', bgColor: 'rgba(59,130,246,0.1)' },
              ].map((item, i) => (
                <button key={i}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', fontFamily: 'inherit', width: '100%' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.boxShadow = `0 4px 12px ${item.bgColor}`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: item.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <item.icon size={16} color={item.color} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', margin: 0 }}>{item.label}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 8px' }}>Sana oralig'i</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input type="date"
                style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <input type="date"
                style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <Button variant="primary" size="md" leftIcon={<Download size={16} />} style={{ width: '100%', marginTop: 16 }}>Export qilish</Button>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AdminFinance;
