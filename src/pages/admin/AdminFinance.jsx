import { useState } from 'react';
import useStore from '../../store/useStore';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Calculator,
  Download,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Wallet,
  Receipt,
} from 'lucide-react';

const formatCurrency = (n) =>
  n.toLocaleString('uz-UZ', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const transactions = [
  { id: 1, type: 'income', desc: 'Hot-dog 2x (Double) #1042', amount: 85000, time: '14:32' },
  { id: 2, type: 'expense', desc: "Go'ht yetkazish", amount: -320000, time: '13:15' },
  { id: 3, type: 'income', desc: 'Lavash #1041', amount: 45000, time: '12:48' },
  { id: 4, type: 'income', desc: 'Hot-dog oddiy #1040', amount: 120000, time: '12:10' },
  { id: 5, type: 'expense', desc: "Kommunal to'lov", amount: -180000, time: '11:30' },
  { id: 6, type: 'income', desc: 'Cheeseburger #1039', amount: 65000, time: '10:55' },
  { id: 7, type: 'expense', desc: 'Xodimlar ish haqi', amount: -4500000, time: '10:00' },
  { id: 8, type: 'income', desc: 'Cheeseburger #1038', amount: 72000, time: '09:42' },
  { id: 9, type: 'income', desc: 'Hot-dog 2x (Double) #1037', amount: 95000, time: '09:15' },
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
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        .af-fade { animation: afFadeIn 0.5s ease forwards; }
        .af-stagger > * { opacity: 0; animation: afFadeUp 0.4s ease forwards; }
        .af-stagger > *:nth-child(1) { animation-delay: 0.05s; }
        .af-stagger > *:nth-child(2) { animation-delay: 0.1s; }
        .af-stagger > *:nth-child(3) { animation-delay: 0.15s; }
        .af-stagger > *:nth-child(4) { animation-delay: 0.2s; }
        .af-stagger > *:nth-child(5) { animation-delay: 0.25s; }
        .af-stagger > *:nth-child(6) { animation-delay: 0.3s; }
        .af-stagger > *:nth-child(7) { animation-delay: 0.35s; }
        .af-stagger > *:nth-child(8) { animation-delay: 0.4s; }
        .af-stagger > *:nth-child(9) { animation-delay: 0.45s; }
        .af-stagger > *:nth-child(10) { animation-delay: 0.5s; }
        @keyframes afFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes afFadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .af-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .af-card:hover {
          border-color: var(--border-strong);
        }
        .af-card-lift:hover {
          border-color: var(--primary);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        .af-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: none;
          border-radius: var(--radius-sm);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .af-btn-primary {
          background: var(--primary);
          color: #fff;
        }
        .af-btn-primary:hover {
          background: #ea580c;
          box-shadow: 0 4px 14px rgba(249,115,22,0.35);
        }
        .af-badge {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
        }
        .af-badge-green { background: rgba(34,197,94,0.1); color: var(--success); }
        .af-badge-red { background: rgba(239,68,68,0.1); color: var(--danger); }
        .af-input {
          width: 100%;
          padding: 10px 14px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text);
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .af-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(249,115,22,0.12);
        }
        @media (max-width: 1024px) {
          .af-overview-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .af-two-col { grid-template-columns: 1fr !important; }
          .af-bottom-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .af-overview-grid { grid-template-columns: 1fr !important; }
          .af-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="af-fade" style={{ padding: '0 0 24px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', margin: 0 }}>Moliya</h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '4px 0 0' }}>Moliyaviy hisobot va tahlillar</p>
          </div>
          <div style={{ position: 'relative' }}>
            <button className="af-btn af-btn-primary" style={{ padding: '10px 16px', borderRadius: 10 }} onClick={() => setExportOpen(!exportOpen)}>
              <Download size={16} />
              <span>Export</span>
            </button>
            {exportOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 6, minWidth: 160, zIndex: 50, boxShadow: 'var(--shadow-lg)' }}>
                {[{ label: 'Excel', icon: FileText, color: 'var(--success)' }, { label: 'PDF', icon: FileText, color: 'var(--danger)' }, { label: 'CSV', icon: FileText, color: '#3B82F6' }].map((item) => (
                  <button key={item.label} onClick={() => setExportOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', border: 'none', borderRadius: 8, background: 'transparent', color: 'var(--text)', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-active)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                    <item.icon size={16} color={item.color} />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {[{ key: 'kun', label: 'Kun' }, { key: 'hafta', label: 'Hafta' }, { key: 'oy', label: 'Oy' }, { key: 'yil', label: 'Yil' }].map((p) => (
            <button key={p.key} style={{ padding: '8px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: `1px solid ${period === p.key ? 'var(--primary)' : 'var(--border)'}`, background: period === p.key ? 'var(--primary)' : 'var(--surface)', color: period === p.key ? '#fff' : 'var(--text-secondary)', transition: 'all 0.2s', boxShadow: period === p.key ? '0 4px 12px rgba(249,115,22,0.3)' : 'none' }} onClick={() => setPeriod(p.key)}>
              {p.label}
            </button>
          ))}
        </div>

        <div className="af-overview-grid af-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {overviewCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="af-card af-card-lift" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} color={card.color} />
                  </div>
                  {card.trend && (
                    <span className={`af-badge ${card.trend.startsWith('+') ? 'af-badge-green' : 'af-badge-red'}`}>
                      {card.trend}
                    </span>
                  )}
                </div>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{card.label}</p>
                  <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', margin: '4px 0 0' }}>
                    {formatCurrency(card.value)} <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>so'm</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="af-two-col" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, marginBottom: 24 }}>
          <div className="af-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Daromad grafigi</h3>
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
                    <text x={x + 30} y={18} textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontWeight="500">
                      {weekLabels[i]}
                    </text>
                    <text x={x + 30} y={y - 5} textAnchor="middle" fill="var(--text)" fontSize="9" fontWeight="600">
                      {formatCurrency(v)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="af-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Xarajatlar tarkibi</h3>
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
                <text x="60" y="56" textAnchor="middle" fill="var(--text)" fontSize="14" fontWeight="800">
                  {formatCurrency(expenses)}
                </text>
                <text x="60" y="70" textAnchor="middle" fill="var(--text-muted)" fontSize="8">
                  Jami xarajat
                </text>
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
          </div>
        </div>

        <div className="af-stats-grid af-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Jami cashback', value: 125000, icon: Wallet, color: 'var(--success)', bg: 'rgba(34,197,94,0.08)' },
            { label: 'Jami refund', value: 45000, icon: CreditCard, color: 'var(--danger)', bg: 'rgba(239,68,68,0.08)' },
            { label: 'Promo xarajatlari', value: 280000, icon: Receipt, color: 'var(--warning)', bg: 'rgba(245,158,11,0.08)' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="af-card af-card-lift" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={item.color} />
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</span>
                </div>
                <p style={{ fontSize: 22, fontWeight: 800, color: item.color, margin: 0 }}>
                  {formatCurrency(item.value)} <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' }}>so'm</span>
                </p>
              </div>
            );
          })}
        </div>

        <div className="af-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          <div className="af-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Tranzaksiyalar</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 0' }}>So'nggi 10 ta tranzaksiya</p>
              </div>
              <button style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, background: 'var(--surface-active)', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                Barchasi
              </button>
            </div>

            <div className="af-stagger" style={{ display: 'flex', flexDirection: 'column' }}>
              {transactions.map((tx) => (
                <div key={tx.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: tx.type === 'income' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {tx.type === 'income' ? (
                        <ArrowUpRight size={16} color="var(--success)" />
                      ) : (
                        <ArrowDownRight size={16} color="var(--danger)" />
                      )}
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
          </div>

          <div className="af-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Export qilish</h3>
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
                <button key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.boxShadow = `0 4px 12px ${item.bgColor}`; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none'; }}>
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

            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 8px' }}>Sana oralig'i</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input type="date" className="af-input" />
                <input type="date" className="af-input" />
              </div>
            </div>

            <button className="af-btn af-btn-primary" style={{ width: '100%', marginTop: 16, padding: '12px 20px', borderRadius: 'var(--radius-sm)' }}>
              <Download size={16} />
              Export qilish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFinance;

