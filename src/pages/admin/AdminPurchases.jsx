import useAdminData from '../../hooks/useAdminData';
import AdminTable from '../../components/admin/AdminTable';

export default function AdminPurchases() {
  const { orders, loading } = useAdminData();
  const purchases = (orders || []).filter((o) => o.status === 'delivered' || o.status === 'completed');

  const columns = [
    { key: 'id', label: 'Buyurtma ID' },
    { key: 'customerName', label: 'Mijoz' },
    { key: 'total', label: 'Summa', render: (v) => `soʻm ${(Number(v) || 0).toLocaleString('uz-UZ')}` },
    { key: 'paymentMethod', label: 'Toʻlov' },
    { key: 'createdAt', label: 'Sana' },
  ];

  return (
    <div className="admin-purchases">
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 16px' }}>Xaridlar (yetkazilgan buyurtmalar)</h2>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading && <div style={{ padding: 16, color: 'var(--text-dim)' }}>Yuklanmoqda...</div>}
        <AdminTable columns={columns} rows={purchases} hover={false} />
      </div>
    </div>
  );
}
