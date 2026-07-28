import { useState, useMemo } from 'react';
import { Plus, MapPin, Clock, Phone, Search, Store, Edit, Trash2, X, Check, Power, ChevronDown } from 'lucide-react';
import useStore from '../../store/useStore';

const s = {
  page: { minHeight: '100vh', background: 'var(--bg)', fontFamily: "'Inter', -apple-system, sans-serif" },
  container: { maxWidth: 1200, margin: '0 auto', padding: '24px 20px' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 },
  headerLeft: { flex: 1, minWidth: 0 },
  title: { fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--text)' },
  subtitle: { fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' },
  headerActions: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' },
  searchWrap: { position: 'relative', width: 280 },
  searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' },
  searchInput: { width: '100%', padding: '10px 14px 10px 40px', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit', boxSizing: 'border-box' },
  btn: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all 0.2s', fontFamily: 'inherit' },
  btnPrimary: { background: 'var(--primary)', color: '#fff', boxShadow: '0 2px 8px rgba(249,115,22,0.3)' },
  btnSecondary: { background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-strong)' },
  btnDanger: { background: 'var(--danger)', color: '#fff' },
  btnGhost: { background: 'transparent', color: 'var(--text-muted)', padding: '8px 12px' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 },
  statCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 20, display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s' },
  statIcon: (accent) => ({
    width: 46, height: 46, borderRadius: 12,
    background: accent === 'primary' ? 'var(--primary-light)' : accent === 'success' ? '#ECFDF5' : accent === 'warning' ? '#FEF9C3' : '#EFF6FF',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    color: accent === 'primary' ? 'var(--primary)' : accent === 'success' ? 'var(--success)' : accent === 'warning' ? 'var(--warning)' : '#3B82F6',
  }),
  statValue: { fontSize: 24, fontWeight: 700, margin: '2px 0 0', color: 'var(--text)' },
  statLabel: { fontSize: 11, color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: 0.5 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16, marginBottom: 40 },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 20, transition: 'all 0.2s', cursor: 'default' },
  cardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  cardTitleRow: { display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 },
  cardIcon: (isOpen) => ({
    width: 44, height: 44, borderRadius: 12,
    background: isOpen ? 'var(--primary-light)' : 'var(--surface-active)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    color: isOpen ? 'var(--primary)' : 'var(--text-muted)',
  }),
  cardName: { fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  cardBadge: (isOpen) => ({
    display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 8,
    fontSize: 11, fontWeight: 600,
    background: isOpen ? '#ECFDF5' : 'var(--surface-active)',
    color: isOpen ? 'var(--success)' : 'var(--text-muted)',
    border: `1px solid ${isOpen ? 'rgba(34,197,94,0.2)' : 'var(--border)'}`,
    whiteSpace: 'nowrap', flexShrink: 0,
  }),
  cardDetails: { display: 'flex', flexDirection: 'column', gap: 8 },
  detailRow: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' },
  cardActions: { display: 'flex', gap: 8, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' },
  iconBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s', padding: 0 },
  empty: { textAlign: 'center', padding: 80, color: 'var(--text-muted)' },
  emptyIcon: { width: 64, height: 64, borderRadius: 16, background: 'var(--surface-active)', border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-muted)' },
  emptyTitle: { fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 4px' },
  emptySub: { fontSize: 13, color: 'var(--text-muted)', margin: 0 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
  modal: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', maxWidth: 480, width: '100%', maxHeight: '85vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border)' },
  modalTitle: { margin: 0, fontSize: 17, fontWeight: 700, color: 'var(--text)' },
  closeBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 },
  modalBody: { padding: 22 },
  field: { marginBottom: 16 },
  label: { display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 },
  input: { width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 14px', color: 'var(--text)', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit', boxSizing: 'border-box' },
  modalFooter: { display: 'flex', gap: 10, marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 18 },
  confirmIcon: { width: 52, height: 52, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: 'var(--danger)' },
  confirmTitle: { margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: 'var(--text)', textAlign: 'center' },
  confirmSub: { fontSize: 13, color: 'var(--text-muted)', margin: '0 0 24px', lineHeight: 1.5, textAlign: 'center' },
  confirmBtns: { display: 'flex', gap: 10 },
};

export default function AdminBranches() {
  const { branches = [], addBranch } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editBranch, setEditBranch] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({ name: '', address: '', phone: '', workingHours: '' });

  const filtered = useMemo(() => {
    if (!searchQuery) return branches;
    const q = searchQuery.toLowerCase();
    return branches.filter(b => b.name.toLowerCase().includes(q) || (b.address && b.address.toLowerCase().includes(q)));
  }, [branches, searchQuery]);

  const stats = useMemo(() => ({
    total: branches.length,
    open: branches.filter(b => b.isOpen !== false).length,
    closed: branches.filter(b => b.isOpen === false).length,
  }), [branches]);

  const openAdd = () => {
    setEditBranch(null);
    setForm({ name: '', address: '', phone: '', workingHours: '' });
    setShowForm(true);
  };

  const openEdit = (branch) => {
    setEditBranch(branch);
    setForm({ name: branch.name || '', address: branch.address || '', phone: branch.phone || '', workingHours: branch.workingHours || '' });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editBranch) {
      if (addBranch) addBranch({ ...editBranch, ...form });
    } else {
      addBranch({ ...form, coverImage: '', logo: '', cuisine: 'Fastfood', rating: 0, deliveryTime: 0, distance: '', minOrder: 0, isOpen: true, coordinates: {} });
    }
    setForm({ name: '', address: '', phone: '', workingHours: '' });
    setEditBranch(null);
    setShowForm(false);
  };

  const handleClose = () => {
    setForm({ name: '', address: '', phone: '', workingHours: '' });
    setEditBranch(null);
    setShowForm(false);
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <div style={s.headerLeft}>
            <h1 style={s.title}>Filiallar</h1>
            <p style={s.subtitle}>Barcha filiallarni boshqarish</p>
          </div>
          <div style={s.headerActions}>
            <div style={s.searchWrap}>
              <Search size={16} style={s.searchIcon} />
              <input
                style={s.searchInput}
                placeholder="Filial qidirish..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border-strong)'; }}
              />
            </div>
            <button style={{ ...s.btn, ...s.btnPrimary }} onClick={openAdd}>
              <Plus size={16} /> Yangi filial
            </button>
          </div>
        </div>

        <div style={{ ...s.stats, gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { label: 'Jami filiallar', value: stats.total, accent: 'primary', icon: <Store size={20} /> },
            { label: 'Ochiq', value: stats.open, accent: 'success', icon: <Power size={20} /> },
            { label: 'Yopiq', value: stats.closed, accent: 'warning', icon: <Clock size={20} /> },
          ].map((item, i) => (
            <div key={i} style={s.statCard}>
              <div style={s.statIcon(item.accent)}>{item.icon}</div>
              <div>
                <p style={s.statLabel}>{item.label}</p>
                <p style={s.statValue}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyIcon}><Store size={28} /></div>
            <p style={s.emptyTitle}>Filiallar topilmadi</p>
            <p style={s.emptySub}>{searchQuery ? "Qidiruv bo'yicha natija yo'q" : "Yangi filial qo'shish uchun yuqoridagi tugmani bosing"}</p>
          </div>
        ) : (
          <div style={s.grid}>
            {filtered.map((b) => (
              <div
                key={b.id}
                style={s.card}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={s.cardHeader}>
                  <div style={s.cardTitleRow}>
                    <div style={s.cardIcon(b.isOpen !== false)}>
                      <Store size={20} />
                    </div>
                    <h3 style={s.cardName}>{b.name}</h3>
                  </div>
                  <span style={s.cardBadge(b.isOpen !== false)}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: b.isOpen !== false ? 'var(--success)' : 'var(--text-muted)' }} />
                    {b.isOpen !== false ? 'Ochiq' : 'Yopiq'}
                  </span>
                </div>
                <div style={s.cardDetails}>
                  {b.address && (
                    <div style={s.detailRow}><MapPin size={14} /> {b.address}</div>
                  )}
                  {b.workingHours && (
                    <div style={s.detailRow}><Clock size={14} /> {b.workingHours}</div>
                  )}
                  {b.phone && (
                    <div style={s.detailRow}><Phone size={14} /> {b.phone}</div>
                  )}
                </div>
                <div style={s.cardActions}>
                  <button style={s.iconBtn} onClick={() => openEdit(b)} title="Tahrirlash">
                    <Edit size={15} />
                  </button>
                  <button
                    style={{ ...s.iconBtn, color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}
                    onClick={() => setDeleteConfirm(b.id)}
                    title="O'chirish"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div style={s.overlay} onClick={handleClose}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>{editBranch ? 'Filialni tahrirlash' : 'Yangi filial'}</h3>
              <button style={s.closeBtn} onClick={handleClose}><X size={18} /></button>
            </div>
            <div style={s.modalBody}>
              <div style={s.field}>
                <label style={s.label}>Filial nomi *</label>
                <input
                  style={s.input}
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Filial nomi"
                  onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
                />
              </div>
              <div style={s.field}>
                <label style={s.label}>Manzil</label>
                <input
                  style={s.input}
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="To'liq manzil"
                  onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
                />
              </div>
              <div style={s.field}>
                <label style={s.label}>Telefon</label>
                <input
                  style={s.input}
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+998 9X XXX XX XX"
                  onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
                />
              </div>
              <div style={s.field}>
                <label style={s.label}>Ish vaqti</label>
                <input
                  style={s.input}
                  value={form.workingHours}
                  onChange={e => setForm({ ...form, workingHours: e.target.value })}
                  placeholder="10:00 - 23:00"
                  onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
                />
              </div>
            </div>
            <div style={s.modalFooter}>
              <button style={{ ...s.btn, ...s.btnSecondary, flex: 1, justifyContent: 'center' }} onClick={handleClose}>Bekor qilish</button>
              <button style={{ ...s.btn, ...s.btnPrimary, flex: 1, justifyContent: 'center' }} onClick={handleSave}>
                <Check size={14} /> {editBranch ? 'Saqlash' : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div style={s.overlay} onClick={() => setDeleteConfirm(null)}>
          <div style={{ ...s.modal, padding: 32, maxWidth: 400, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={s.confirmIcon}><Trash2 size={24} /></div>
            <h3 style={s.confirmTitle}>Filialni o'chirish</h3>
            <p style={s.confirmSub}>Bu filialni o'chirishni xohlaysizmi? Amalga qaytarib bo'lmaydi.</p>
            <div style={s.confirmBtns}>
              <button style={{ ...s.btn, ...s.btnSecondary, flex: 1, justifyContent: 'center' }} onClick={() => setDeleteConfirm(null)}>Bekor qilish</button>
              <button
                style={{ ...s.btn, ...s.btnDanger, flex: 1, justifyContent: 'center' }}
                onClick={() => { if (addBranch) addBranch({ isOpen: 'deleted', id: deleteConfirm }); setDeleteConfirm(null); }}
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
