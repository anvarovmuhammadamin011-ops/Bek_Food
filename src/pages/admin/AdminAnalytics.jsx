import { useEffect } from 'react';
import useAdminData from '../../hooks/useAdminData';
import { useAdminContext } from '../../components/admin/AdminContext';
import { RANGE_OPTIONS } from '../../lib/constants';
import LineChart from '../../components/admin/charts/LineChart';
import BarChart from '../../components/admin/charts/BarChart';
import PieChart from '../../components/admin/charts/PieChart';
import { formatPrice } from '../../lib/format';

const COLORS = ['#F97316', '#22C55E', '#3B82F8', '#8B5CF6'];
const COLORS2 = ['#10B981', '#3B82F8', '#F59E0B', '#EF4444'];

function Stat({ label, value }) {
  return (
    <div style={{ padding: 12, background: 'var(--surface-active)', borderRadius: 'var(--radius-sm)' }}>
      <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{value ?? '—'}</div>
    </div>
  );
}

export default function AdminAnalytics() {
  const { range, setRange } = useAdminContext();
  const { kpi, revenue, trend, peakHours, payments, delivery, refetch } = useAdminData();
  const opt = RANGE_OPTIONS.find((o) => o.value === range) || RANGE_OPTIONS[0];

  useEffect(() => {
    refetch({ days: opt.days });
  }, [opt.days, refetch]);

  const paymentsData = (payments || []).map((p, i) => ({ name: p.name, value: p.count, color: COLORS[i] || '#CBD5E1' }));
  const deliveryData = (delivery || []).map((d, i) => ({ name: d.name, value: d.count, color: COLORS2[i] || '#CBD5E1' }));

  return (
    <div className="admin-analytics" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="flex items-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Tahlillar</h2>
        <div className="flex items-center gap-2" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {RANGE_OPTIONS.map((o) => (
            <button key={o.value} type="button" onClick={() => { setRange(o.value); setDays(o.days); }}
              className="btn btn-sm btn-secondary" style={{ fontSize: 12, borderWidth: o.value === range ? 2 : 1, borderColor: o.value === range ? 'var(--primary)' : 'var(--border)', background: o.value === range ? 'var(--primary-light)' : 'var(--surface)' }}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Daromad — {opt.label}</h3>
          <LineChart data={(revenue || []).map((d) => ({ label: d.date, value: d.revenue }))} height={160} color="var(--primary)" />
        </div>
        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Buyurtmalar soni — {opt.label}</h3>
          <BarChart data={(trend || []).map((d) => ({ label: d.date, value: d.count }))} height={160} color="var(--success)" />
        </div>
      </div>

      <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>To'plash markazi (soatlar)</h3>
          <BarChart data={(peakHours || []).map((d) => ({ label: d.hour, value: d.count }))} height={160} color="var(--primary)" labels />
        </div>
        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>To'lov uslobi</h3>
          <PieChart data={paymentsData.map((d) => ({ ...d, label: d.name }))} size={160} unit="buyurtma" />
        </div>
        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Yetkazish / Olish</h3>
          <PieChart data={deliveryData.map((d) => ({ ...d, label: d.name }))} size={160} unit="buyurtma" />
        </div>
        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Umumiy statistika</h3>
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Stat label="Jami daromad" value={formatPrice(kpi?.totalRevenue)} />
            <Stat label="Jami buyurtma" value={kpi?.totalOrders} />
            <Stat label="Mijozlar" value={kpi?.totalCustomers} />
            <Stat label="O'rt. chekka" value={formatPrice(kpi?.avgOrderValue)} />
          </div>
        </div>
      </div>
    </div>
  );
}
