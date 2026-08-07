import useStore from '../../store/useStore';
import AdminListPage from '../../components/admin/AdminListPage';

export default function AdminPromotions() {
  const promoCodes = useStore((s) => s.promoCodes);
  const { togglePromoCode, deletePromoCode } = useStore();

  const discountRender = (v, r) => {
    return r.discountType === 'percent' ? v + '%' : v + " so'm";
  };

  const usedRender = (v, r) => {
    return r.maxUses ? v + ' / ' + r.maxUses : String(v);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'code', label: 'Kod', render: (v) => <code style={{ background: 'var(--surface-active)', padding: '2px 8px', borderRadius: 4 }}>{v}</code> },
    { key: 'discount', label: 'Chegirma', render: discountRender },
    { key: 'active', label: 'Faol', render: (v, r) => (
      <button type="button" onClick={(e) => { e.stopPropagation(); togglePromoCode && togglePromoCode(r.id); }} className="badge" style={{ fontSize: 10, cursor: 'pointer', background: v ? 'var(--success-light)' : 'var(--danger-light)', color: v ? 'var(--success)' : 'var(--danger)' }}>{v ? 'FAOL' : 'SXIR'}</button>
    ) },
    { key: 'usedCount', label: 'Ishlatilgan', render: usedRender },
    { key: '', label: '', render: (v, r) => (
      <button type="button" onClick={(e) => { e.stopPropagation(); deletePromoCode(r.id); }} style={{ border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer' }}>o'chir</button>
    ) },
  ];

  return <AdminListPage title="Akcotlin uz" columns={columns} rows={promoCodes} />;
}
