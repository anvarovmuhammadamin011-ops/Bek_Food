import useStore from '../../store/useStore';
import AdminListPage from '../../components/admin/AdminListPage';

export default function AdminEmployees() {
  const employees = useStore((s) => s.employees);
  const { removeEmployee } = useStore();

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Ism' },
    { key: 'role', label: 'Roli' },
    { key: 'phone', label: 'Telefon' },
    { key: 'rating', label: 'Reyting', render: (v) => `${v || 0}/5` },
    { key: 'isOnline', label: 'Online', render: (v) => (
      <span className="badge" style={{ fontSize: 10, background: v ? 'var(--success-light)' : 'var(--danger-light)', color: v ? 'var(--success)' : 'var(--danger)' }}>{v ? 'HA' : 'YO\'Q'}</span>
    ) },
    { key: 'totalDeliveries', label: 'Yetkazish', render: (v) => v || 0 },
    { key: '', label: '', render: (v, r) => (
      <button type="button" onClick={(e) => { e.stopPropagation(); removeEmployee(r.id); }} style={{ border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer' }}>🗑</button>
    ) },
  ];

  return <AdminListPage title="Xodimlar" columns={columns} rows={employees} />;
}
