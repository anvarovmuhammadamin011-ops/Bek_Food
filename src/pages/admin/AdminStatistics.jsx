import { TrendingUp, TrendingDown } from 'lucide-react';
import useStore from '../../store/useStore';

export default function AdminStatistics() {
  const { orders, inventory } = useStore();

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalCost = inventory.reduce((s, i) => s + i.cost, 0);
  const profit = totalRevenue - totalCost;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="p-4">
        <h1 className="heading">Statistika</h1>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2" style={{ gap: 12 }}>
          <div className="card p-4">
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Jami buyurtmalar</p>
            <p style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 24, fontWeight: 600, marginTop: 4 }}>{totalOrders}</p>
          </div>
          <div className="card p-4">
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Jami tushum</p>
            <p style={{ fontFamily: 'var(--font-display)', color: '#e51e1e', fontSize: 24, fontWeight: 600, marginTop: 4 }}>{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="card p-4">
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Chiqim (ombor)</p>
            <p style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 24, fontWeight: 600, marginTop: 4 }}>{totalCost.toLocaleString()}</p>
          </div>
          <div className="card p-4">
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Foyda</p>
            <p style={{ fontFamily: 'var(--font-display)', color: profit >= 0 ? '#7fbf7f' : '#e51e1e', fontSize: 24, fontWeight: 600, marginTop: 4 }}>
              {profit.toLocaleString()}
            </p>
            {profit >= 0 ? <TrendingUp size={14} color="#7fbf7f" style={{ marginTop: 4 }} /> : <TrendingDown size={14} color="#e51e1e" style={{ marginTop: 4 }} />}
          </div>
        </div>

        <div className="card p-4">
          <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Oxirgi buyurtmalar</h3>
          {orders.slice(0, 5).map((o) => (
            <div key={o.id} className="flex items-center justify-between" style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <p style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>#{String(o.id).slice(-4)}</p>
                <p style={{ color: '#6b6b6b', fontSize: 12 }}>{new Date(o.createdAt).toLocaleDateString()}</p>
              </div>
              <span className="price-sm">{o.total.toLocaleString()} so'm</span>
            </div>
          ))}
          {orders.length === 0 && <p style={{ color: '#6b6b6b', fontSize: 12 }}>Buyurtmalar yo'q</p>}
        </div>
      </div>
    </div>
  );
}
