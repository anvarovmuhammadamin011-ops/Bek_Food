import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Star, Eye, EyeOff, UtensilsCrossed, Flame, Image } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import useStore from '../../store/useStore';

const s = {
  page: { padding: '32px', background: 'var(--bg)', minHeight: '100vh' },
  container: { maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' },
  title: { fontSize: '28px', fontWeight: '800', color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' },
  headerActions: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
  btn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s', fontFamily: 'inherit' },
  btnPrimary: { background: 'var(--primary)', color: '#fff', boxShadow: '0 2px 8px rgba(249,115,22,0.3)' },
  btnSecondary: { background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-strong)' },
  btnDanger: { background: 'var(--danger)', color: '#fff' },
  searchWrap: { position: 'relative', flex: 1, maxWidth: '300px', minWidth: '200px' },
  searchInput: { width: '100%', padding: '10px 14px 10px 40px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', background: 'var(--surface)', color: 'var(--text)', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s' },
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' },
  statCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '12px' },
  statIcon: { width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statValue: { fontSize: '18px', fontWeight: '700', color: 'var(--text)', lineHeight: 1.1 },
  statLabel: { fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' },
  tabs: { display: 'flex', gap: '6px', marginBottom: '18px', flexWrap: 'wrap', alignItems: 'center' },
  tab: (active) => ({ padding: '8px 18px', borderRadius: '10px', border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`, background: active ? 'var(--primary-light)' : 'var(--surface)', color: active ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s', fontFamily: 'inherit' }),
  counter: { fontSize: '13px', color: 'var(--text-muted)', marginLeft: 'auto' },
  table: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' },
  th: { fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--border)', background: 'var(--surface-active)' },
  td: { padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--text)', verticalAlign: 'middle' },
  productCell: { display: 'flex', alignItems: 'center', gap: '12px' },
  thumb: { width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', background: 'var(--surface-active)', flexShrink: 0 },
  badge: (color) => ({ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', background: color + '14', color, border: `1px solid ${color}30` }),
  iconBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s', padding: 0 },
  empty: { textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' },
  emptyIcon: { width: '64px', height: '64px', borderRadius: '16px', background: 'var(--surface-active)', border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-muted)' },
  emptyTitle: { fontSize: '16px', fontWeight: '600', color: 'var(--text-secondary)', margin: '0 0 4px 0' },
  emptySub: { fontSize: '13px', color: 'var(--text-muted)', margin: 0 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' },
  modalTitle: { fontSize: '20px', fontWeight: '800', color: 'var(--text)', margin: 0 },
  closeBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 },
  field: { marginBottom: '16px' },
  label: { fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' },
  input: { width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box', fontFamily: 'inherit' },
  row: { display: 'flex', gap: '14px' },
  rowField: { flex: 1 },
  preview: { width: '100%', height: '120px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-active)', border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', overflow: 'hidden' },
  confirmModal: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: 'var(--shadow-lg)' },
  confirmIcon: { width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  confirmTitle: { fontSize: '17px', fontWeight: '700', color: 'var(--text)', margin: '0 0 6px 0' },
  confirmSub: { fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 24px 0' },
  confirmBtns: { display: 'flex', gap: '10px' },
  chipToggle: (on, color = 'var(--primary)') => ({
    padding: '6px 12px', borderRadius: '8px', border: `1px solid ${on ? color : 'var(--border)'}`,
    background: on ? color + '14' : 'var(--surface)', color: on ? color : 'var(--text-muted)',
    cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: 6,
    transition: 'all 0.2s', fontFamily: 'inherit',
  }),
};

export default function AdminProducts() {
  const { foods, categories, addProduct, updateProduct, deleteProduct, toggleProductAvailability, toggleProductPopular } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', discountPrice: '', categoryId: '', image: '', isPopular: false, isNew: false, available: true });

  const catName = (id) => categories.find((c) => c.id === id)?.name || '—';

  const filtered = foods.filter((f) => {
    const matchSearch = !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = activeCategory === 'all' || String(f.categoryId) === String(activeCategory);
    return matchSearch && matchCat;
  });

  const activeCount = foods.filter((f) => f.available !== false).length;
  const onSaleCount = foods.filter((f) => f.discountPrice).length;
  const popularCount = foods.filter((f) => f.isPopular).length;

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: '', description: '', price: '', discountPrice: '', categoryId: categories[0]?.id || '', image: '', isPopular: false, isNew: false, available: true });
    setModalOpen(true);
  };

  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.get('new')) {
      openAdd();
      searchParams.delete('new');
      window.history.replaceState({}, '', '/admin/products');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = (food) => {
    setEditingId(food.id);
    setForm({
      name: food.name,
      description: food.description || '',
      price: String(food.price),
      discountPrice: food.discountPrice ? String(food.discountPrice) : '',
      categoryId: String(food.categoryId),
      image: food.image || '',
      isPopular: !!food.isPopular,
      isNew: !!food.isNew,
      available: food.available !== false,
    });
    setModalOpen(true);
  };

  const saveProduct = () => {
    if (!form.name.trim() || !form.price) return;
    const data = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      categoryId: Number(form.categoryId),
      image: form.image || '/food/placeholder.svg',
      isPopular: form.isPopular,
      isNew: form.isNew,
      available: form.available,
      restaurantId: 1,
      spiceLevel: 0,
      ingredients: [],
    };
    if (editingId) updateProduct(editingId, data);
    else addProduct(data);
    setModalOpen(false);
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Mahsulotlar</h1>
            <p style={s.subtitle}>Menyudagi mahsulotlarni boshqaring</p>
          </div>
          <div style={s.headerActions}>
            <div style={s.searchWrap}>
              <Search size={16} style={s.searchIcon} />
              <input style={s.searchInput} placeholder="Mahsulot qidirish..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-strong)'; }} />
            </div>
            <button style={{ ...s.btn, ...s.btnPrimary }} onClick={openAdd}>
              <Plus size={16} /> Yangi mahsulot
            </button>
          </div>
        </div>

        <div style={s.statsGrid}>
          {[
            { label: 'Jami mahsulotlar', value: foods.length, icon: UtensilsCrossed, bg: 'var(--primary-light)', color: 'var(--primary)' },
            { label: 'Faol', value: activeCount, icon: Eye, bg: '#F0FDF4', color: 'var(--success)' },
            { label: 'Aksiyadagi', value: onSaleCount, icon: Flame, bg: '#FFFBEB', color: 'var(--warning)' },
            { label: 'Mashhur', value: popularCount, icon: Star, bg: '#FEF2F2', color: 'var(--danger)' },
          ].map((st, i) => {
            const Icon = st.icon;
            return (
              <div key={i} style={s.statCard}>
                <div style={{ ...s.statIcon, background: st.bg }}>
                  <Icon size={18} style={{ color: st.color }} />
                </div>
                <div>
                  <div style={s.statValue}>{st.value}</div>
                  <div style={s.statLabel}>{st.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={s.tabs}>
          <button style={s.tab(activeCategory === 'all')} onClick={() => setActiveCategory('all')}>Hammasi</button>
          {categories.map((c) => (
            <button key={c.id} style={s.tab(String(activeCategory) === String(c.id))} onClick={() => setActiveCategory(c.id)}>
              {c.icon} {c.name}
            </button>
          ))}
          <span style={s.counter}>{filtered.length} ta mahsulot</span>
        </div>

        {filtered.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyIcon}><UtensilsCrossed size={28} /></div>
            <p style={s.emptyTitle}>Mahsulotlar topilmadi</p>
            <p style={s.emptySub}>Yangi mahsulot qo'shish uchun yuqoridagi tugmani bosing</p>
          </div>
        ) : (
          <div style={{ ...s.table, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
              <thead>
                <tr>
                  <th style={s.th}>Mahsulot</th>
                  <th style={s.th}>Kategoriya</th>
                  <th style={s.th}>Narx</th>
                  <th style={s.th}>Mavjudlik</th>
                  <th style={s.th}>Bestseller</th>
                  <th style={{ ...s.th, textAlign: 'right' }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((food) => (
                  <tr key={food.id}>
                    <td style={s.td}>
                      <div style={s.productCell}>
                        <img src={food.image} alt={food.name} onError={(e) => { e.currentTarget.src = '/food/placeholder.svg'; }} style={s.thumb} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{food.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                            {food.isNew && <span style={{ marginRight: 6 }}>Yangi</span>}
                            {food.isPopular && <span style={{ marginRight: 6, color: 'var(--danger)' }}>Mashhur</span>}
                            {food.discountPrice && <span style={{ color: 'var(--success)' }}>Chegirma</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={s.td}>
                      <span style={s.badge('#6366F1')}>{catName(food.categoryId)}</span>
                    </td>
                    <td style={s.td}>
                      {food.discountPrice ? (
                        <>
                          <div style={{ fontWeight: 700, color: 'var(--danger)' }}>{food.discountPrice.toLocaleString()} so'm</div>
                          <div style={{ fontSize: 11, color: 'var(--text-dim)', textDecoration: 'line-through' }}>{food.price.toLocaleString()} so'm</div>
                        </>
                      ) : (
                        <div style={{ fontWeight: 700 }}>{food.price.toLocaleString()} so'm</div>
                      )}
                    </td>
                    <td style={s.td}>
                      <button
                        style={s.chipToggle(food.available !== false, food.available !== false ? 'var(--success)' : 'var(--danger)')}
                        onClick={() => toggleProductAvailability(food.id)}
                      >
                        {food.available !== false ? <Eye size={13} /> : <EyeOff size={13} />}
                        {food.available !== false ? 'Faol' : 'Nofaol'}
                      </button>
                    </td>
                    <td style={s.td}>
                      <button
                        style={s.chipToggle(!!food.isPopular, 'var(--danger)')}
                        onClick={() => toggleProductPopular(food.id)}
                      >
                        <Star size={13} />
                        {food.isPopular ? 'Ha' : "Yo'q"}
                      </button>
                    </td>
                    <td style={{ ...s.td, textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button style={s.iconBtn} onClick={() => openEdit(food)} title="Tahrirlash">
                          <Edit size={15} />
                        </button>
                        <button style={{ ...s.iconBtn, color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }} onClick={() => setConfirmDelete(food.id)} title="O'chirish">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div style={s.overlay} onClick={() => setModalOpen(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editingId ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}</h2>
              <button style={s.closeBtn} onClick={() => setModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div style={s.preview}>
              {form.image ? (
                <img src={form.image} alt="Preview" onError={(e) => { e.currentTarget.src = '/food/placeholder.svg'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Image size={28} style={{ marginBottom: 6, opacity: 0.5 }} />
                  <p style={{ fontSize: 13, margin: 0 }}>Rasm URL kiriting</p>
                </div>
              )}
            </div>

            <div style={s.field}>
              <label style={s.label}>Rasm URL</label>
              <input style={s.input} value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="/food/hotdog.svg yoki https://..." />
            </div>

            <div style={s.field}>
              <label style={s.label}>Nomi *</label>
              <input style={s.input} value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Mahsulot nomi" />
            </div>

            <div style={s.field}>
              <label style={s.label}>Kategoriya</label>
              <select style={s.input} value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>

            <div style={{ ...s.row, marginBottom: '16px' }}>
              <div style={s.rowField}>
                <label style={s.label}>Narx (so'm) *</label>
                <input style={s.input} type="number" min="0" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="12000" />
              </div>
              <div style={s.rowField}>
                <label style={s.label}>Chegirma narxi (so'm)</label>
                <input style={s.input} type="number" min="0" value={form.discountPrice}
                  onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                  placeholder="Ixtiyoriy" />
              </div>
            </div>

            <div style={s.field}>
              <label style={s.label}>Tavsif</label>
              <textarea style={{ ...s.input, minHeight: 64, resize: 'vertical' }} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Qisqa tavsif" />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <button style={s.chipToggle(form.available, 'var(--success)')} onClick={() => setForm({ ...form, available: !form.available })}>
                {form.available ? <Eye size={13} /> : <EyeOff size={13} />} Mavjud
              </button>
              <button style={s.chipToggle(form.isPopular, 'var(--danger)')} onClick={() => setForm({ ...form, isPopular: !form.isPopular })}>
                <Star size={13} /> Bestseller
              </button>
              <button style={s.chipToggle(form.isNew, 'var(--primary)')} onClick={() => setForm({ ...form, isNew: !form.isNew })}>
                <Flame size={13} /> Yangi
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ ...s.btn, ...s.btnSecondary, flex: 1, justifyContent: 'center' }} onClick={() => setModalOpen(false)}>
                Bekor qilish
              </button>
              <button style={{ ...s.btn, ...s.btnPrimary, flex: 1, justifyContent: 'center' }} onClick={saveProduct}>
                {editingId ? 'Saqlash' : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={s.overlay} onClick={() => setConfirmDelete(null)}>
          <div style={s.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div style={s.confirmIcon}>
              <Trash2 size={24} style={{ color: 'var(--danger)' }} />
            </div>
            <h3 style={s.confirmTitle}>O'chirishni xohlaysizmi?</h3>
            <p style={s.confirmSub}>Bu amalni bekor qilib bo'lmaydi</p>
            <div style={s.confirmBtns}>
              <button style={{ ...s.btn, ...s.btnSecondary, flex: 1, justifyContent: 'center' }} onClick={() => setConfirmDelete(null)}>
                Bekor qilish
              </button>
              <button style={{ ...s.btn, ...s.btnDanger, flex: 1, justifyContent: 'center' }} onClick={() => { deleteProduct(confirmDelete); setConfirmDelete(null); }}>
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
