import useAdminData from '../../hooks/useAdminData';
import { formatPrice } from '../../lib/format';
import BarChart from '../../components/admin/charts/BarChart';

export default function AdminProfit() {
  const { kpi, revenue, inventory } = useAdminData();
  const stockValue = (inventory || []).reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.unitCost) || 0), 0);
  const revenueSeries = (revenue || []).map((d) => ({ label: d.date, value: d.revenue }));
  const profitSeries = (revenue || []).map((d) => ({ label: d.date, value: Math.max(0, (d.revenue || 0) - stockValue / 12) }));

  return (
    <div className="admin-profit" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Foyda</h2>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <Stat title="Jami daromad" value={formatPrice(kpi?.totalRevenue || 0)} color="var(--success)" />
        <Stat title="Ombor xarajati" value={formatPrice(stockValue)} color="var(--warning)" />
        <Stat title="Taxminiy foyda" value={formatPrice((kpi?.totalRevenue || 0) - stockValue)} color="var(--primary)" />
      </div>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Daromad</h3>
          <BarChart data={revenueSeries} height={160} color="var(--success)" />
        </div>
        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Taxminiy foyda</h3>
          <BarChart data={profitSeries} height={160} color="var(--primary)" />
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value, color }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16 }}>
      <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}
