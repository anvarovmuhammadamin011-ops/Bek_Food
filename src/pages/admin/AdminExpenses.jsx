import useStore from '../../store/useStore';
import { formatPrice } from '../../lib/format';

export default function AdminExpenses() {
  const inventory = useStore((s) => s.inventory || []);
  const settings = useStore((s) => s.settings) || {};
  const deliveryFee = Number(settings.deliveryFee) || 0;
  const stockValue = inventory.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.unitCost) || 0), 0);

  return (
    <div className="admin-expenses" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Xarajatlar</h2>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <Stat title="Ombor qiymati" value={formatPrice(stockValue)} color="var(--warning)" />
        <Stat title="Yetkazish fee" value={formatPrice(deliveryFee)} color="var(--primary)" subtitle="Har bir buyurtma uchun" />
        <Stat title="Mahsulotlari" value={inventory.length} color="var(--text-dim)" />
      </div>
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>Ombor xarajatlari</h3>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--text-dim)' }}>
              <th style={{ padding: '8px', fontSize: 11 }}>Mahsulot</th>
              <th style={{ padding: '8px', fontSize: 11 }}>Miqdori</th>
              <th style={{ padding: '8px', fontSize: 11 }}>Birlik narxi</th>
              <th style={{ padding: '8px', fontSize: 11, textAlign: 'right' }}>Jami (soʻm)</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((i) => {
              const total = (Number(i.quantity) || 0) * (Number(i.unitCost) || 0);
              return (
                <tr key={i.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '8px' }}>{i.name}</td>
                  <td style={{ padding: '8px' }}>{i.quantity} {i.unit}</td>
                  <td style={{ padding: '8px' }}>{formatPrice(i.unitCost)}</td>
                  <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>{formatPrice(total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ title, value, color, subtitle }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16 }}>
      <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
      {subtitle && <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>{subtitle}</div>}
    </div>
  );
}
