import useStore from '../../store/useStore';
import AdminListPage from '../../components/admin/AdminListPage';

export default function AdminCategories() {
  const categories = useStore((s) => s.categories);
  const { toggleCategoryActive, moveCategory, deleteCategory } = useStore();

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nomi' },
    { key: 'icon', label: 'Ikonka' },
    { key: 'isActive', label: 'Faol', render: (v, r) => (
      <button type="button" onClick={(e) => { e.stopPropagation(); toggleCategoryActive(r.id); }} className="badge" style={{ fontSize: 10, cursor: 'pointer' }}>{v === false ? 'SIZ' : 'HA'}</button>
    ) },
    { key: '', label: '', render: (v, r) => (
      <div className="flex gap-1" style={{ display: 'flex', gap: 4 }}>
        <button type="button" onClick={(e) => { e.stopPropagation(); moveCategory(r.id, 'up'); }} style={{ border: 'none', background: 'transparent', fontSize: 12 }}>▲</button>
        <button type="button" onClick={(e) => { e.stopPropagation(); moveCategory(r.id, 'down'); }} style={{ border: 'none', background: 'transparent', fontSize: 12 }}>▼</button>
        <button type="button" onClick={(e) => { e.stopPropagation(); deleteCategory(r.id); }} style={{ border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer' }}>🗑</button>
      </div>
    ) },
  ];

  return <AdminListPage title="Kategoriyalar" columns={columns} rows={categories} />;
}
