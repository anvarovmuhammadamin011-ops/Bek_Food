import { useState } from 'react';
import { TrendingUp, TrendingDown, ShoppingBag, CreditCard, Wallet, Receipt } from 'lucide-react';

const s = {
  page: { padding: '24px 16px 32px', background: 'var(--bg)', minHeight: '100vh' },
  container: { maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' },
  title: { fontSize: '26px', fontWeight: '800', color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' },
  periodBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', cursor: 'pointer', fontSize: '13px', fontWeight: '600', background: 'var(--surface)', color: 'var(--text)', fontFamily: 'inherit', marginRight: '8px' },
  activePeriod: { background: 'var(--primary)', color: '#fff', borderColor: 'var(--primary)' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' },
  statCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '18px' },
  statValue: { fontSize: '22px', fontWeight: '800', color: 'var(--text)', lineHeight: 1.1 },
  statLabel: { fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: 6 },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px' },
  cardTitle: { fontSize: '15px', fontWeight: '700', color: 'var(--text)', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: 8 },
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' },
  rowLabel: { fontSize: '13px', color: 'var(--text-secondary)' },
  rowValue: { fontSize: '13px', fontWeight: '700', color: 'var(--text)' },
  bar: { height: '10px', borderRadius: 999, background: 'var(--border)' },
  barFill: { height: '100%', borderRadius: 999 },
};

const EXPENSES_KEY = 'bekfood_expenses_v1';
const EMPLOYEES_KEY = 'bekfood_employees_v1';
const PURCHASES_KEY = 'bekfood_purchases_v1';

function read(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}

const MONTHS = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];

function seedSales() {
  const out = [];
  for (let m = 0; m < 6; m++) {
    const d = new Date(); d.setMonth(d.getMonth() - (5 - m));
    const base = 6000000 + (m % 3) * 1800000 + (5 - m) * 400000;
    out.push({ month: MONTHS[d.getMonth()], value: base });
  }
  return out;
}

export default function AdminProfit() {
  const [period, setPeriod] = useState('month');
  const [sales] = useState(seedSales);

  const expenses = read(EXPENSES_KEY);
  const employees = read(EMPLOYEES_KEY);
  const purchases = read(PURCHASES_KEY);

  const totalExpense = expenses.reduce((s, i) => s + Number(i.amount || 0), 0);
  const salaries = employees.filter((i) => i.status === 'active').reduce((s, i) => s + Number(i.salary || 0), 0);
  const purchaseTotal = purchases.reduce((s, i) => s + Number(i.total || 0), 0);
  const otherExpenses = totalExpense - salaries;

  const totalSales = sales.reduce((s, i) => s + i.value, 0);
  const net = totalSales - totalExpense - purchaseTotal;
  const margin = totalSales > 0 ? ((net / totalSales) * 100).toFixed(1) : '0';

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const todaySales = expenses.filter((i) => i.date === todayStr).reduce((s, i) => s + Number(i.amount || 0), 0);

  const expByCat = {};
  [...expenses, ...purchases].forEach((i) => {
    const label = i.category && expenses.find((e) => e.id === i.id) ? 'Boshqa' : 'Mahsulot xaridi';
    expByCat[label] = (expByCat[label] || 0) + Number(i.amount || i.total || 0);
  });

  const catData = Object.entries(expByCat);
  const maxCat = Math.max(1, ...catData.map(([, v]) => v));

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Foyda (Profit)</h1>
            <p style={s.subtitle}>Savdo, xarajat va sof foyda tahlili</p>
          </div>
          <div>
            {['month', 'quarter', 'year'].map((p) => (
              <button key={p} onClick={() => setPeriod(p)} style={{ ...s.periodBtn, ...(period === p ? s.activePeriod : {}) }}>
                {p === 'month' ? 'Bu oy' : p === 'quarter' ? 'Kvartal' : 'Yil'}
              </button>
            ))}
          </div>
        </div>

        <div style={s.statsGrid}>
          <div style={s.statCard}>
            <div style={{ ...s.statValue, color: 'var(--success)' }}>+{totalSales.toLocaleString()} so'm</div>
            <div style={s.statLabel}><TrendingUp size={13} color="var(--success)" /> Jami savdo (6 oy)</div>
          </div>
          <div style={s.statCard}>
            <div style={{ ...s.statValue, color: 'var(--danger)' }}>-{(totalExpense + purchaseTotal).toLocaleString()} so'm</div>
            <div style={s.statLabel}><TrendingDown size={13} color="var(--danger)" /> Jami xarajatlar</div>
          </div>
          <div style={s.statCard}>
            <div style={{ ...s.statValue, color: net >= 0 ? 'var(--success)' : 'var(--danger)' }}>{net >= 0 ? '+' : ''}{net.toLocaleString()} so'm</div>
            <div style={s.statLabel}><Wallet size={13} color="var(--primary)" /> Sof foyda</div>
          </div>
          <div style={s.statCard}>
            <div style={s.statValue}>{margin}%</div>
            <div style={s.statLabel}>Marja</div>
          </div>
        </div>

        <div style={s.grid2}>
          <div style={s.card}>
            <h3 style={s.cardTitle}><TrendingUp size={16} color="var(--success)" /> Savdo dinamikasi (6 oy)</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160, paddingTop: 8 }}>
              {sales.map((i) => (
                <div key={i.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{(i.value / 1000000).toFixed(1)}M</div>
                  <div style={{ ...s.bar, width: '100%', background: 'transparent', height: 'auto', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ ...s.barFill, width: '100%', background: 'var(--primary)', height: `${(i.value / totalSales) * 100}%`, minHeight: 12, borderRadius: 6 }} />
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{i.month.slice(0, 3)}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={s.card}>
            <h3 style={s.cardTitle}><Receipt size={16} color="var(--primary)" /> Xarajatlar tarkibi</h3>
            {catData.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Ma'lumot yo'q</div>}
            {catData.map(([label, value]) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={s.row}><span style={s.rowLabel}>{label}</span><span style={s.rowValue}>{value.toLocaleString()} so'm</span></div>
                <div style={s.bar}><div style={{ ...s.barFill, width: `${(value / maxCat) * 100}%`, background: 'var(--danger)' }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...s.grid2, marginTop: 14 }}>
          <div style={s.card}>
            <h3 style={s.cardTitle}><ShoppingBag size={16} color="var(--success)" /> Tushum manbalari</h3>
            <div style={s.row}><span style={s.rowLabel}>Savdo tushumi</span><span style={{ ...s.rowValue, color: 'var(--success)' }}>+{totalSales.toLocaleString()}</span></div>
            <div style={s.row}><span style={s.rowLabel}>Bugungi xarajat</span><span style={{ ...s.rowValue, color: 'var(--danger)' }}>-{todaySales.toLocaleString()}</span></div>
          </div>
          <div style={s.card}>
            <h3 style={s.cardTitle}><CreditCard size={16} color="var(--warning)" /> Xarajat turlari</h3>
            <div style={s.row}><span style={s.rowLabel}>Mahsulot xaridlari</span><span style={s.rowValue}>{purchaseTotal.toLocaleString()} so'm</span></div>
            <div style={s.row}><span style={s.rowLabel}>Ish haqi</span><span style={s.rowValue}>{salaries.toLocaleString()} so'm</span></div>
            <div style={s.row}><span style={s.rowLabel}>Boshqa xarajatlar</span><span style={s.rowValue}>{otherExpenses.toLocaleString()} so'm</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}