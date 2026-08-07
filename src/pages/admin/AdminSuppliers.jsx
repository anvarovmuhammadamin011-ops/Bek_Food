import useStore from '../../store/useStore';
import AdminListPage from '../../components/admin/AdminListPage';
import { AlertTriangle } from 'lucide-react';

export default function AdminSuppliers() {
  const inventory = useStore((s) => s.inventory || []);
  const lowStock = inventory.filter((i) => Number(i.quantity) <= Number(i.minQuantity) || ['low', 'critical'].includes(i.status));

  const columns = [
    { key: 'id', label: "Ta'minotchi ID" },
    { key: 'name', label: 'Mahsulot' },
    { key: 'quantity', label: 'Mavjud', render: (v) => `${v} dona/kg` },
    { key: 'unitCost', label: 'Narx (so\'m)' },
    { key: 'status', label: 'Holat', render: (v) => (
      <span className="badge" style={{ fontSize: 10, background: v === 'ok' ? 'var(--success-light)' : v === 'low' ? 'var(--warning-light)' : 'var(--danger-light)', color: v === 'ok' ? 'var(--success)' : v === 'low' ? 'var(--warning)' : 'var(--danger)' }}>{v === 'ok' ? 'Yetarli' : v === 'low' ? 'Kam' : 'Kritik'}</span>
    ) },
  ];

  return (
    <div className="admin-suppliers">
      <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <AlertTriangle size={20} color="var(--warning)" />
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Ta'minotchilar</h2>
        <span className="badge badge-warning" style={{ fontSize: 11 }}>{lowStock.length} ta kamstock</span>
      </div>
      <AdminListPage title="Ta'minotchilar" columns={columns} rows={inventory.map((i) => ({ ...i, supplier: 'Bek Food LLC' }))} />
    </div>
  );
}
