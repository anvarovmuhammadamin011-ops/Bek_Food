import useStore from '../../store/useStore';
import AdminListPage from '../../components/admin/AdminListPage';
import { formatPrice } from '../../lib/format';
import { AlertTriangle } from 'lucide-react';

export default function AdminInventory() {
  const inventory = useStore((s) => s.inventory || []);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Mahsulot' },
    { key: 'quantity', label: 'Soni', render: (v) => `${v}` },
    { key: 'unit', label: 'Birlik' },
    { key: 'minQuantity', label: 'Min.' },
    { key: 'unitCost', label: 'Narxi', render: (v) => formatPrice(v) },
    { key: 'status', label: 'Holat', render: (v) => (
      <span className="badge" style={{ fontSize: 10, background: v === 'ok' ? 'var(--success-light)' : v === 'low' ? 'var(--warning-light)' : 'var(--danger-light)', color: v === 'ok' ? 'var(--success)' : v === 'low' ? 'var(--warning)' : 'var(--danger)' }}>{v === 'ok' ? 'Yetarli' : v === 'low' ? 'Kam' : 'Kritik'}</span>
    ) },
  ];

  const critical = inventory.filter((i) => i.status === 'critical' || Number(i.quantity) <= Number(i.minQuantity));

  return (
    <div className="admin-inventory">
      <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <AlertTriangle size={20} color="var(--danger)" />
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Ombor</h2>
        {critical.length > 0 && <span className="badge badge-danger" style={{ fontSize: 11 }}>{critical.length} ta kritik</span>}
      </div>
      <AdminListPage title="Inventar" columns={columns} rows={inventory} />
    </div>
  );
}
