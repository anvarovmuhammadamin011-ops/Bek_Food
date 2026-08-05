import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderOpen, ArrowUp, ArrowDown, X, Image, Eye, EyeOff } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import useStore from '../../store/useStore';

const ICON_OPTIONS = ['🌭', '🌯', '🍔', '🥙', '🍟', '🍕', '🥗', '🍗', '🍛', '🍜', '🍝', '🥪', '🍞', '🥩', '🍦', '🥤', '🍹', '☕'];

const s = {
  page: { padding: '24px 16px 32px', background: 'var(--bg)', minHeight: '100vh' },
  container: { maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' },
  title: { fontSize: '28px', fontWeight: '800', color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' },
  headerActions: { display: 'flex', gap: '10px', alignItems: 'center' },
  btn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s', fontFamily: 'inherit', minHeight: '44px' },
  btnPrimary: { background: 'var(--primary)', color: '#fff', boxShadow: '0 2px 8px rgba(249,115,22,0.3)' },
  btnSecondary: { background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-strong)' },
  btnDanger: { background: 'var(--danger)', color: '#fff' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  card: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 18px', transition: 'all 0.2s', gap: '14px', flexWrap: 'wrap' },
  cardLeft: { display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 },
  iconBox: { width: '46px', height: '46px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 },
  cardInfo: { flex: 1, minWidth: 0 },
  cardTitle: { fontSize: '15px', fontWeight: '700', color: 'var(--text)', margin: 0 },
  cardSub: { fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 },
  actions: { display: 'flex', alignItems: 'center', gap: '6px' },
  iconBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', minWidth: '44px', minHeight: '44px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s', padding: 0 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px', width: '100%', maxWidth: '460px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' },
  modalTitle: { fontSize: '20px', fontWeight: '800', color: 'var(--text)', margin: 0 },
  closeBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 },
  field: { marginBottom: '16px' },
  label: { fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' },
  input: { width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box', fontFamily: 'inherit' },
  iconGrid: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' },
  iconOption: (active) => ({ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '42px', borderRadius: '10px', fontSize: '20px', cursor: 'pointer', border: active ? '1.5px solid var(--primary)' : '1px solid var(--border)', background: active ? 'var(--primary-light)' : 'var(--surface)', transition: 'all 0.15s' }),
  chipToggle: (on, color = 'var(--primary)') => ({
    padding: '6px 12px', borderRadius: '8px', border: `1px solid ${on ? color : 'var(--border)'}`,
    background: on ? color + '14' : 'var(--surface)', color: on ? color : 'var(--text-muted)',
    cursor: 'pointer', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: 6,
    transition: 'all 0.2s', fontFamily: 'inherit',
  }),
  empty: { textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' },
  emptyIcon: { width: '64px', height: '64px', borderRadius: '16px', background: 'var(--surface-active)', border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-muted)' },
  emptyTitle: { fontSize: '16px', fontWeight: '600', color: 'var(--text-secondary)', margin: '0 0 4px 0' },
  emptySub: { fontSize: '13px', color: 'var(--text-muted)', margin: 0 },
};

export default function AdminCategories() {
  const { categories, foods, addCategory, updateCategory, deleteCategory, moveCategory, toggleCategoryActive } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ name: '', icon: '🍔', image: '' });

  const countIn = (id) => foods.filter((f) => String(f.categoryId) === String(id)).length;

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: '', icon: '🍔', image: '' });
    setModalOpen(true);
  };

  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.get('new')) {
      openAdd();
      searchParams.delete('new');
      window.history.replaceState({}, '', '/admin/categories');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = (cat) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, icon: cat.icon || '🍔', image: cat.image || '' });
    setModalOpen(true);
  };

  const saveCategory = () => {
    if (!form.name.trim()) return;
    const data = { name: form.name.trim(), icon: form.icon, image: form.image || undefined };
    if (editingId) updateCategory(editingId, data);
    else addCategory(data);
    setModalOpen(false);
  };

  return (
    <div style={s.page}>
      <style>{`
        .admin-categories-card{width:100%;max-width:100%}
        @media (max-width: 768px) {
          .admin-categories-header{flex-direction:column;align-items:stretch!important}
          .admin-categories-actions{width:100%}
          .admin-categories-btn{width:100%;justify-content:center}
          .admin-categories-card{flex-direction:column;align-items:flex-start!important}
          .admin-categories-actions{flex-wrap:wrap;justify-content:flex-start}
          .admin-categories-actions button{min-height:44px}
        }
      `}</style>
      <div style={s.container}>
        <div className="admin-categories-header" style={s.header}>
          <div>
            <h1 style={s.title}>Kategoriyalar</h1>
            <p style={s.subtitle}>Menyu bo'limlarini boshqaring va tartiblang</p>
          </div>
          <div className="admin-categories-actions" style={s.headerActions}>
            <button className="admin-categories-btn" style={{ ...s.btn, ...s.btnPrimary }} onClick={openAdd}>
              <Plus size={16} /> Yangi kategoriya
            </button>
          </div>
        </div>

        <div style={s.list}>
          {categories.length === 0 ? (
            <div style={s.empty}>
              <div style={s.emptyIcon}><FolderOpen size={28} /></div>
              <p style={s.emptyTitle}>Kategoriyalar yo'q</p>
              <p style={s.emptySub}>Yangi kategoriya qo'shish uchun yuqoridagi tugmani bosing</p>
            </div>
          ) : (
            categories.map((cat, idx) => (
              <div key={cat.id} className="admin-categories-card" style={{ ...s.card, opacity: cat.isActive === false ? 0.55 : 1 }}>
                <div style={s.cardLeft}>
                  <div style={s.iconBox}>
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} onError={(e) => { e.currentTarget.style.display = 'none'; }} style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: 6 }} />
                    ) : (
                      cat.icon
                    )}
                  </div>
                  <div style={s.cardInfo}>
                    <h3 style={s.cardTitle}>{cat.name}</h3>
                    <p style={s.cardSub}>{countIn(cat.id)} ta mahsulot</p>
                  </div>
                </div>
                <div style={s.actions}>
                  <button
                    style={s.chipToggle(cat.isActive !== false, 'var(--success)')}
                    onClick={() => toggleCategoryActive(cat.id)}
                    title={cat.isActive === false ? 'Faollashtirish' : 'Nofaol qilish'}
                  >
                    {cat.isActive === false ? <EyeOff size={13} /> : <Eye size={13} />}
                    {cat.isActive === false ? 'Nofaol' : 'Faol'}
                  </button>
                  <button style={s.iconBtn} onClick={() => moveCategory(cat.id, 'up')} title="Tepaga" disabled={idx === 0}>
                    <ArrowUp size={15} style={{ opacity: idx === 0 ? 0.3 : 1 }} />
                  </button>
                  <button style={s.iconBtn} onClick={() => moveCategory(cat.id, 'down')} title="Pastga" disabled={idx === categories.length - 1}>
                    <ArrowDown size={15} style={{ opacity: idx === categories.length - 1 ? 0.3 : 1 }} />
                  </button>
                  <button style={s.iconBtn} onClick={() => openEdit(cat)} title="Tahrirlash">
                    <Edit size={15} />
                  </button>
                  <button style={{ ...s.iconBtn, color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }} onClick={() => setConfirmDelete(cat.id)} title="O'chirish">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {modalOpen && (
        <div style={s.overlay} onClick={() => setModalOpen(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editingId ? "Kategoriyani tahrirlash" : 'Yangi kategoriya'}</h2>
              <button style={s.closeBtn} onClick={() => setModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div style={s.field}>
              <label style={s.label}>Nomi *</label>
              <input style={s.input} value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Masalan: Hot-doglar"
                onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-strong)'; }} />
            </div>

            <div style={s.field}>
              <label style={s.label}>Ikona</label>
              <div style={s.iconGrid}>
                {ICON_OPTIONS.map((ic) => (
                  <button key={ic} style={s.iconOption(form.icon === ic)} onClick={() => setForm({ ...form, icon: ic })}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ ...s.field, marginBottom: 24 }}>
              <label style={s.label}>Rasm URL (ixtiyoriy)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input style={s.input} value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="/food/hotdog.svg" />
                <Image size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ ...s.btn, ...s.btnSecondary, flex: 1, justifyContent: 'center' }} onClick={() => setModalOpen(false)}>
                Bekor qilish
              </button>
              <button style={{ ...s.btn, ...s.btnPrimary, flex: 1, justifyContent: 'center' }} onClick={saveCategory}>
                {editingId ? 'Saqlash' : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={s.overlay} onClick={() => setConfirmDelete(null)}>
          <div style={{ ...s.modal, maxWidth: 400, textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={24} style={{ color: 'var(--danger)' }} />
            </div>
            <h3 style={s.modalTitle}>O'chirishni xohlaysizmi?</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '6px 0 24px 0' }}>
              Bu kategoriyadagi {countIn(confirmDelete)} ta mahsulot o'chirilmaydi, faqat kategoriya o'chadi
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{ ...s.btn, ...s.btnSecondary, flex: 1, justifyContent: 'center' }} onClick={() => setConfirmDelete(null)}>
                Bekor qilish
              </button>
              <button style={{ ...s.btn, ...s.btnDanger, flex: 1, justifyContent: 'center' }} onClick={() => { deleteCategory(confirmDelete); setConfirmDelete(null); }}>
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
