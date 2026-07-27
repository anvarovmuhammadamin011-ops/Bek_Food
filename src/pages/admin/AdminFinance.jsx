import { useState } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
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

const COLORS = {
  bg: '#0a0a0a',
  surface: '#141414',
  surfaceHover: '#1a1a1a',
  surfaceBorder: '#1f1f1f',
  red: '#e51e1e',
  redDark: '#b81818',
  redGlow: 'rgba(229, 30, 30, 0.3)',
  green: '#22c55e',
  greenDark: '#16a34a',
  greenGlow: 'rgba(34, 197, 94, 0.3)',
  yellow: '#eab308',
  yellowDark: '#ca8a04',
  yellowGlow: 'rgba(234, 179, 8, 0.3)',
  blue: '#3b82f6',
  purple: '#a855f7',
  orange: '#f97316',
  text: '#ffffff',
  textSecondary: '#a1a1aa',
  textMuted: '#52525b',
  white: '#ffffff',
};

const formatCurrency = (n) =>
  n.toLocaleString('uz-UZ', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const transactions = [
  { id: 1, type: 'income', desc: 'Bekfood Set #1042', amount: 85000, time: '14:32' },
  { id: 2, type: 'expense', desc: 'Go\'ht yetkazish', amount: -320000, time: '13:15' },
  { id: 3, type: 'income', desc: 'Lavash Classic #1041', amount: 45000, time: '12:48' },
  { id: 4, type: 'income', desc: 'Shashlik Set #1040', amount: 120000, time: '12:10' },
  { id: 5, type: 'expense', desc: 'Kommunal to\'lov', amount: -180000, time: '11:30' },
  { id: 6, type: 'income', desc: 'Burger King #1039', amount: 65000, time: '10:55' },
  { id: 7, type: 'expense', desc: 'Xodimlar ish haqi', amount: -4500000, time: '10:00' },
  { id: 8, type: 'income', desc: 'Pizza Margherita #1038', amount: 72000, time: '09:42' },
  { id: 9, type: 'income', desc: 'Combo Set #1037', amount: 95000, time: '09:15' },
  { id: 10, type: 'expense', desc: 'Mevalar sotib olish', amount: -250000, time: '08:30' },
];

const expenseBreakdown = [
  { name: 'Go\'ht', pct: 45, color: COLORS.red },
  { name: 'Mevalar', pct: 15, color: COLORS.green },
  { name: 'Ichimliklar', pct: 10, color: COLORS.blue },
  { name: 'Xodimlar', pct: 20, color: COLORS.yellow },
  { name: 'Kommunal', pct: 5, color: COLORS.purple },
  { name: 'Boshqa', pct: 5, color: COLORS.orange },
];

const AdminFinance = () => {
  const store = useStore();
  const navigate = useNavigate();

  const [period, setPeriod] = useState('oy');
  const [exportOpen, setExportOpen] = useState(false);

  const revenue = 128500000;
  const expenses = 72000000;
  const profit = revenue - expenses;
  const tax = 17500000;

  const weeklyData = [18000000, 22000000, 19500000, 25000000, 21000000, 28000000, 24000000];
  const weekLabels = ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'];

  const overviewCards = [
    { label: 'Daromad', value: revenue, icon: DollarSign, color: COLORS.green, glow: COLORS.greenGlow, trend: '+12%' },
    { label: 'Xarajatlar', value: expenses, icon: ShoppingCart, color: COLORS.red, glow: COLORS.redGlow, trend: '+5%' },
    { label: 'Sof foyda', value: profit, icon: TrendingUp, color: COLORS.green, glow: COLORS.greenGlow, trend: '+18%' },
    { label: 'Soliq', value: tax, icon: Calculator, color: COLORS.yellow, glow: COLORS.yellowGlow, trend: null },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: "'Inter', -apple-system, sans-serif",
        padding: 0,
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
        .badge { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
        .badge-red { background: rgba(229, 30, 30, 0.15); color: ${COLORS.red}; }
        .badge-green { background: rgba(34, 197, 94, 0.15); color: ${COLORS.green}; }
        .badge-yellow { background: rgba(234, 179, 8, 0.15); color: ${COLORS.yellow}; }
        .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-primary { background: ${COLORS.red}; color: ${COLORS.white}; }
        .btn-primary:hover { background: ${COLORS.redDark}; box-shadow: 0 0 20px ${COLORS.redGlow}; }
        .animate-fade-in { animation: fadeIn 0.5s ease forwards; }
        .stagger > * { opacity: 0; animation: fadeInUp 0.4s ease forwards; }
        .stagger > *:nth-child(1) { animation-delay: 0.05s; }
        .stagger > *:nth-child(2) { animation-delay: 0.1s; }
        .stagger > *:nth-child(3) { animation-delay: 0.15s; }
        .stagger > *:nth-child(4) { animation-delay: 0.2s; }
        .stagger > *:nth-child(5) { animation-delay: 0.25s; }
        .stagger > *:nth-child(6) { animation-delay: 0.3s; }
        .stagger > *:nth-child(7) { animation-delay: 0.35s; }
        .stagger > *:nth-child(8) { animation-delay: 0.4s; }
        .stagger > *:nth-child(9) { animation-delay: 0.45s; }
        .stagger > *:nth-child(10) { animation-delay: 0.5s; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-between { justify-content: space-between; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          .finance-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .finance-two-col { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .finance-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* HEADER */}
      <div className="animate-fade-in" style={{ padding: '20px 24px 0' }}>
        <div
          className="flex items-center justify-between"
          style={{ maxWidth: 1400, margin: '0 auto' }}
        >
          <div className="flex items-center" style={{ gap: 12 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.surfaceBorder}`,
                borderRadius: 10,
                width: 40,
                height: 40,
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
              <ChevronLeft size={20} color={COLORS.textSecondary} />
            </button>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: COLORS.text }}>
              Moliya
            </h1>
          </div>

          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-primary"
              style={{ borderRadius: 10, padding: '10px 16px' }}
              onClick={() => setExportOpen(!exportOpen)}
            >
              <Download size={16} />
              <span>Export</span>
            </button>
            {exportOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 8,
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.surfaceBorder}`,
                  borderRadius: 10,
                  padding: 6,
                  minWidth: 160,
                  zIndex: 50,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                }}
              >
                {[
                  { label: 'Excel', icon: FileText, color: COLORS.green },
                  { label: 'PDF', icon: FileText, color: COLORS.red },
                  { label: 'CSV', icon: FileText, color: COLORS.blue },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setExportOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      padding: '10px 14px',
                      border: 'none',
                      borderRadius: 8,
                      background: 'transparent',
                      color: COLORS.text,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.surfaceHover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <item.icon size={16} color={item.color} />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PERIOD SELECTOR */}
      <div className="animate-fade-in" style={{ padding: '20px 24px 0' }}>
        <div className="flex items-center" style={{ gap: 8, maxWidth: 1400, margin: '0 auto', flexWrap: 'wrap' }}>
          {[
            { key: 'kun', label: 'Kun' },
            { key: 'hafta', label: 'Hafta' },
            { key: 'oy', label: 'Oy' },
            { key: 'yil', label: 'Yil' },
          ].map((p) => (
            <button
              key={p.key}
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                border: `1px solid ${period === p.key ? COLORS.red : COLORS.surfaceBorder}`,
                background: period === p.key ? COLORS.red : COLORS.surface,
                color: period === p.key ? COLORS.white : COLORS.textSecondary,
                transition: 'all 0.2s',
                boxShadow: period === p.key ? `0 0 16px ${COLORS.redGlow}` : 'none',
              }}
              onClick={() => setPeriod(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: '24px 24px 40px', maxWidth: 1400, margin: '0 auto' }}>

        {/* FINANCE OVERVIEW CARDS */}
        <div
          className="finance-grid stagger"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            marginBottom: 24,
          }}
        >
          {overviewCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="flex items-center justify-between">
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: `${card.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={22} color={card.color} />
                  </div>
                  {card.trend && (
                    <span
                      className="badge"
                      style={{
                        background: card.trend.startsWith('+') ? 'rgba(34,197,94,0.15)' : 'rgba(229,30,30,0.15)',
                        color: card.trend.startsWith('+') ? COLORS.green : COLORS.red,
                      }}
                    >
                      {card.trend}
                    </span>
                  )}
                </div>
                <div>
                  <p style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 }}>
                    {card.label}
                  </p>
                  <p style={{ fontSize: 24, fontWeight: 800, color: COLORS.text }}>
                    {formatCurrency(card.value)} <span style={{ fontSize: 12, color: COLORS.textSecondary, fontWeight: 500 }}>so'm</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* TWO COLUMN: CHART + EXPENSE BREAKDOWN */}
        <div
          className="finance-two-col"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr',
            gap: 20,
            marginBottom: 24,
          }}
        >
          {/* REVENUE CHART */}
          <div className="card animate-fade-in" style={{ padding: 24 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>Daromad grafigi</h3>
                <p style={{ fontSize: 12, color: COLORS.textSecondary }}>Haftalik tushum</p>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${COLORS.green}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={16} color={COLORS.green} />
              </div>
            </div>
            <svg viewBox="0 0 700 240" style={{ width: '100%', height: 200 }}>
              <defs>
                <linearGradient id="finBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.green} />
                  <stop offset="100%" stopColor={COLORS.greenDark} />
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
              {weeklyData.map((v, i) => {
                const max = Math.max(...weeklyData);
                const barH = (v / max) * 160;
                const x = i * 100 + 20;
                const y = 200 - barH;
                return (
                  <g key={i}>
                    <rect x={x} y={y} width={60} height={barH} rx="4" fill="url(#finBarGrad)" opacity="0.9">
                      <animate attributeName="height" from="0" to={barH} dur="0.8s" fill="freeze" begin={`${i * 0.1}s`} />
                      <animate attributeName="y" from="200" to={y} dur="0.8s" fill="freeze" begin={`${i * 0.1}s`} />
                    </rect>
                    <text x={x + 30} y={18} textAnchor="middle" fill={COLORS.textSecondary} fontSize="10">
                      {weekLabels[i]}
                    </text>
                    <text x={x + 30} y={y - 5} textAnchor="middle" fill={COLORS.text} fontSize="9" fontWeight="600">
                      {formatCurrency(v)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* EXPENSE BREAKDOWN */}
          <div className="card animate-fade-in" style={{ padding: 24 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>Xarajatlar tarkibi</h3>
                <p style={{ fontSize: 12, color: COLORS.textSecondary }}>Kategoriya bo'yicha</p>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${COLORS.red}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart size={16} color={COLORS.red} />
              </div>
            </div>

            {/* Donut visualization */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <svg viewBox="0 0 120 120" style={{ width: 120, height: 120 }}>
                {(() => {
                  let cumPct = 0;
                  const radius = 42;
                  const circumference = 2 * Math.PI * radius;
                  return expenseBreakdown.map((item, i) => {
                    const dashLen = (item.pct / 100) * circumference;
                    const dashOffset = -cumPct * circumference / 100;
                    cumPct += item.pct;
                    return (
                      <circle
                        key={i}
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        stroke={item.color}
                        strokeWidth="14"
                        strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        style={{ transition: 'all 0.5s ease' }}
                      />
                    );
                  });
                })()}
                <text x="60" y="56" textAnchor="middle" fill={COLORS.text} fontSize="14" fontWeight="800">
                  {formatCurrency(expenses)}
                </text>
                <text x="60" y="70" textAnchor="middle" fill={COLORS.textSecondary} fontSize="8">
                  Jami xarajat
                </text>
              </svg>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {expenseBreakdown.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                    <div className="flex items-center" style={{ gap: 8 }}>
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: item.color,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 12, color: COLORS.textSecondary }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>{item.pct}%</span>
                  </div>
                  <div
                    style={{
                      height: 4,
                      borderRadius: 2,
                      background: COLORS.surfaceBorder,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${item.pct}%`,
                        borderRadius: 2,
                        background: item.color,
                        transition: 'width 0.8s ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CASHBACK & REFUND SECTION */}
        <div
          className="finance-grid stagger"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            marginBottom: 24,
          }}
        >
          {[
            { label: 'Jami cashback', value: 125000, icon: Wallet, color: COLORS.green, bg: 'rgba(34,197,94,0.08)' },
            { label: 'Jami refund', value: 45000, icon: CreditCard, color: COLORS.red, bg: 'rgba(229,30,30,0.08)' },
            { label: 'Promo xarajatlari', value: 280000, icon: Receipt, color: COLORS.yellow, bg: 'rgba(234,179,8,0.08)' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="card card-hover" style={{ padding: 20 }}>
                <div className="flex items-center" style={{ gap: 12, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: item.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={18} color={item.color} />
                  </div>
                  <span style={{ fontSize: 13, color: COLORS.textSecondary, fontWeight: 500 }}>
                    {item.label}
                  </span>
                </div>
                <p style={{ fontSize: 22, fontWeight: 800, color: item.color }}>
                  {formatCurrency(item.value)} <span style={{ fontSize: 12, fontWeight: 500, color: COLORS.textSecondary }}>so'm</span>
                </p>
              </div>
            );
          })}
        </div>

        {/* TWO COLUMN: TRANSACTIONS + EXPORT */}
        <div
          className="finance-two-col"
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 20,
          }}
        >
          {/* TRANSACTION LIST */}
          <div className="card animate-fade-in" style={{ padding: 24 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>Tranzaksiyalar</h3>
                <p style={{ fontSize: 12, color: COLORS.textSecondary }}>So'nggi 10 ta tranzaksiya</p>
              </div>
              <button
                className="btn"
                style={{
                  padding: '6px 12px',
                  fontSize: 12,
                  background: COLORS.surface,
                  border: `1px solid ${COLORS.surfaceBorder}`,
                  color: COLORS.textSecondary,
                  borderRadius: 8,
                }}
              >
                Barchasi
              </button>
            </div>

            <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between"
                  style={{
                    padding: '12px 0',
                    borderBottom: `1px solid ${COLORS.surfaceBorder}`,
                  }}
                >
                  <div className="flex items-center" style={{ gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: tx.type === 'income' ? 'rgba(34,197,94,0.12)' : 'rgba(229,30,30,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {tx.type === 'income' ? (
                        <ArrowUpRight size={16} color={COLORS.green} />
                      ) : (
                        <ArrowDownRight size={16} color={COLORS.red} />
                      )}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{tx.desc}</p>
                      <p style={{ fontSize: 11, color: COLORS.textMuted }}>{tx.time}</p>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: tx.type === 'income' ? COLORS.green : COLORS.red,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)} so'm
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* EXPORT SECTION */}
          <div className="card animate-fade-in" style={{ padding: 24 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text }}>Export qilish</h3>
                <p style={{ fontSize: 12, color: COLORS.textSecondary }}>Hisobotni yuklab olish</p>
              </div>
              <Download size={18} color={COLORS.textSecondary} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Excel fayl', desc: '.xlsx formatida', icon: FileText, color: COLORS.green, bgColor: 'rgba(34,197,94,0.12)' },
                { label: 'PDF hisobot', desc: '.pdf formatida', icon: FileText, color: COLORS.red, bgColor: 'rgba(229,30,30,0.12)' },
                { label: 'CSV ma\'lumot', desc: '.csv formatida', icon: FileText, color: COLORS.blue, bgColor: 'rgba(59,130,246,0.12)' },
              ].map((item, i) => (
                <button
                  key={i}
                  className="btn"
                  style={{
                    justifyContent: 'flex-start',
                    padding: '14px 16px',
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.surfaceBorder}`,
                    borderRadius: 10,
                    color: COLORS.text,
                    fontSize: 13,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = item.color;
                    e.currentTarget.style.boxShadow = `0 0 16px ${item.color}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = COLORS.surfaceBorder;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: item.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <item.icon size={16} color={item.color} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{item.label}</p>
                    <p style={{ fontSize: 11, color: COLORS.textMuted }}>{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.textSecondary, marginBottom: 8 }}>
                Sana oralig'i
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input
                  type="date"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.surfaceBorder}`,
                    borderRadius: 8,
                    color: COLORS.text,
                    fontSize: 13,
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = COLORS.red;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${COLORS.redGlow}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = COLORS.surfaceBorder;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <input
                  type="date"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: COLORS.surface,
                    border: `1px solid ${COLORS.surfaceBorder}`,
                    borderRadius: 8,
                    color: COLORS.text,
                    fontSize: 13,
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = COLORS.red;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${COLORS.redGlow}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = COLORS.surfaceBorder;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{
                width: '100%',
                marginTop: 16,
                borderRadius: 10,
                padding: '12px 20px',
              }}
            >
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
