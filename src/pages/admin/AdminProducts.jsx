import useStore from '../../store/useStore';
import AdminListPage from '../../components/admin/AdminListPage';
import { formatPrice } from '../../lib/format';
import { Trash2 } from 'lucide-react';

export default function AdminProducts() {
  const foods = useStore((s) => s.foods);
  const categories = useStore((s) => s.categories);
  const { toggleProductAvailability, deleteProduct } = useStore();

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nomi' },
    { key: 'price', label: 'Narx', render: (v) => formatPrice(v) },
    { key: 'categoryId', label: 'Kategoriya', render: (v) => categories.find((c) => c.id === v)?.name || '—' },
    { key: 'isPopular', label: 'Mashhur', render: (v) => (v ? 'Ha' : 'Yo\'q') },
    { key: 'available', label: 'Mavjud', render: (v, r) => (
      <button type="button" onClick={(e) => { e.stopPropagation(); toggleProductAvailability(r.id); }}
        className="badge" style={{ fontSize: 10, cursor: 'pointer' }}>{r.available === false ? 'SIZ' : 'HA'}</button>
    ) },
    { key: '', label: '', render: (v, r) => (
      <button type="button" onClick={(e) => { e.stopPropagation(); deleteProduct(r.id); }} aria-label="Delete" style={{ width: 28, height: 28, border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer' }}>
        <Trash2 size={14} />
      </button>
    ) },
  ];

  return <AdminListPage title="Mahsulotlar" columns={columns} rows={foods} onAdd={() => {}} />;
}
