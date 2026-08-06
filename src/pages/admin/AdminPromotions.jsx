import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, Search, X, Calendar, Percent, Coins, Copy, Check, Gift, Package, FolderOpen, Clock } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import useStore from '../../store/useStore';

const s = {
  page: { padding: '32px', background: 'var(--bg)', minHeight: '100vh' },
  container: { maxWidth: '1100px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
  title: { fontSize: '28px', fontWeight: '800', color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' },
  headerActions: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
  btn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s', fontFamily: 'inherit' },
  btnPrimary: { background: 'var(--primary)', color: '#fff', boxShadow: '0 2px 8px rgba(249,115,22,0.3)' },
  btnSecondary: { background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-strong)' },
  btnDanger: { background: 'var(--danger)', color: '#fff' },
  searchWrap: { position: 'relative', flex: 1, maxWidth: '320px', minWidth: '200px' },
  searchInput: { width: '100%', padding: '10px 14px 10px 40px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', background: 'var(--surface)', color: 'var(--text)', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s' },
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' },
  tabs: { display: 'flex', gap: '6px', marginBottom: '22px', flexWrap: 'wrap' },
  tab: (active) => ({ padding: '9px 20px', borderRadius: '10px', border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`, background: active ? 'var(--primary-light)' : 'var(--surface)', color: active ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6 }),
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px', transition: 'all 0.2s', gap: '16px', flexWrap: 'wrap' },
  cardLeft: { display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 },
  codeBox: { minWidth: '120px', padding: '8px 14px', borderRadius: '10px', background: 'var(--primary-light)', border: '1px solid rgba(249,115,22,0.2)', textAlign: 'center' },
  code: { fontSize: '15px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.04em', margin: 0 },
  cardTitleRow: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' },
  cardTitle: { fontSize: '15px', fontWeight: '700', color: 'var(--text)', margin: 0 },
  badge: (color) => ({ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', background: color + '14', color, border: `1px solid ${color}30` }),
  cardMeta: { display: 'flex', gap: '14px', marginTop: '4px', flexWrap: 'wrap' },
  metaItem: { fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' },
  actions: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' },
  iconBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s', padding: 0 },
  toggleTrack: (active) => ({ width: '42px', height: '22px', borderRadius: '11px', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', border: 'none', padding: 0, background: active ? 'var(--success)' : 'var(--border-strong)' }),
  toggleDot: (active) => ({ width: '16px', height: '16px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: active ? '23px' : '3px', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }),
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' },
  modalTitle: { fontSize: '20px', fontWeight: '800', color: 'var(--text)', margin: 0 },
  closeBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 },
  field: { marginBottom: '16px' },
  label: { fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' },
  input: { width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box', fontFamily: 'inherit' },
  row: { display: 'flex', gap: '14px' },
  rowField: { flex: 1 },
  statusRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--surface-active)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '20px' },
  statusLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '600' },
  empty: { textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' },
  emptyIcon: { width: '64px', height: '64px', borderRadius: '16px', background: 'var(--surface-active)', border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-muted)' },
  emptyTitle: { fontSize: '16px', fontWeight: '600', color: 'var(--text-secondary)', margin: '0 0 4px 0' },
  emptySub: { fontSize: '13px', color: 'var(--text-muted)', margin: 0 },
  confirmModal: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: 'var(--shadow-lg)' },
  confirmIcon: { width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  confirmTitle: { fontSize: '17px', fontWeight: '700', color: 'var(--text)', margin: '0 0 6px 0' },
  confirmSub: { fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 24px 0' },
  confirmBtns: { display: 'flex', gap: '10px' },
};

const formatMoney = (n) => (n ? n.toLocaleString('uz-UZ') : '0');

export default function AdminPromotions() {
  const {
    promoCodes, addPromoCode, updatePromoCode, deletePromoCode,
    foods, categories,
    productDiscounts, categoryDiscounts,
    applyProductDiscount, removeProductDiscount,
    applyCategoryDiscount, removeCategoryDiscount,
  } = useStore();

  const [tab, setTab] = useState('codes');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [discountForm, setDiscountForm] = useState({ targetId: '', percent: '', expiresAt: '' });
  const [codeForm, setCodeForm] = useState({ code: '', discountType: 'percent', discount: '', minOrder: 0, maxUses: 0, active: true, startDate: '', endDate: '' });

  const filteredCodes = promoCodes.filter((p) =>
    !searchQuery || p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const foodName = (id) => foods.find((f) => String(f.id) === String(id))?.name || '—';
  const catName = (id) => categories.find((c) => String(c.id) === String(id))?.name || '—';

  const openAddCode = () => {
    setEditingId(null);
    setCodeForm({ code: '', discountType: 'percent', discount: '', minOrder: 0, maxUses: 0, active: true, startDate: '', endDate: '' });
    setModalOpen(true);
  };

  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.get('new')) {
      openAddCode();
      searchParams.delete('new');
      window.history.replaceState({}, '', '/admin/promotions');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEditCode = (promo) => {
    setEditingId(promo.id);
    setCodeForm({ code: promo.code, discountType: promo.discountType, discount: String(promo.discount), minOrder: promo.minOrder || 0, maxUses: promo.maxUses || 0, active: promo.active, startDate: promo.startDate || '', endDate: promo.endDate || '' });
    setModalOpen(true);
  };

  const saveCode = () => {
    const code = codeForm.code.trim().toUpperCase().replace(/\s+/g, '');
    const discount = Number(codeForm.discount) || 0;
    if (!code || discount <= 0) return;
    const data = {
      code, discountType: codeForm.discountType, discount,
      minOrder: Number(codeForm.minOrder) || 0, maxUses: Number(codeForm.maxUses) || 0,
      active: codeForm.active, startDate: codeForm.startDate, endDate: codeForm.endDate,
      usedCount: editingId ? (promoCodes.find((p) => p.id === editingId)?.usedCount || 0) : 0,
    };
    if (editingId) updatePromoCode(editingId, data);
    else addPromoCode(data);
    setModalOpen(false);
  };

  const toggleActive = (id) => {
    const promo = promoCodes.find((p) => p.id === id);
    if (promo) updatePromoCode(id, { active: !promo.active });
  };

  const copyCode = (code) => {
    if (navigator.clipboard) navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  const discountLabel = (p) => (p.discountType === 'percent' ? `${p.discount}%` : `${formatMoney(p.discount)} so'm`);

  const handleApplyProductDiscount = () => {
    if (!discountForm.targetId || !discountForm.percent) return;
    applyProductDiscount(Number(discountForm.targetId), Number(discountForm.percent), discountForm.expiresAt);
    setDiscountForm({ targetId: '', percent: '', expiresAt: '' });
  };

  const handleApplyCategoryDiscount = () => {
    if (!discountForm.targetId || !discountForm.percent) return;
    applyCategoryDiscount(Number(discountForm.targetId), Number(discountForm.percent), discountForm.expiresAt);
    setDiscountForm({ targetId: '', percent: '', expiresAt: '' });
  };

  return (
    <div style={s.page}>
      <style>{`
        @media(max-width:768px){
          .promo-page{padding:16px!important}
          .promo-row{flex-direction:column!important}
          .promo-row>div{min-width:100%!important;flex-basis:100%!important}
          .promo-modal-grid{grid-template-columns:1fr!important}
        }
      `}</style>
      <div className="promo-page" style={s.container}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Promotions</h1>
            <p style={s.subtitle}>Chegirma kodlari va aksiyalarni boshqaring</p>
          </div>
          <div style={s.headerActions}>
            {tab === 'codes' && (
              <>
                <div style={s.searchWrap}>
                  <Search size={16} style={s.searchIcon} />
                  <input style={s.searchInput} placeholder="Kod qidirish..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border-strong)'; }} />
                </div>
                <button style={{ ...s.btn, ...s.btnPrimary }} onClick={openAddCode}>
                  <Plus size={16} /> Yangi kod
                </button>
              </>
            )}
          </div>
        </div>

        <div style={s.tabs}>
          {[
            { key: 'codes', label: 'Promo kodlar', icon: Tag },
            { key: 'product', label: "Mahsulot chegirmasi", icon: Package },
            { key: 'category', label: "Kategoriya chegirmasi", icon: FolderOpen },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.key} style={s.tab(tab === t.key)} onClick={() => setTab(t.key)}>
                <Icon size={15} /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'codes' && (
          <div style={s.list}>
            {filteredCodes.length === 0 ? (
              <div style={s.empty}>
                <div style={s.emptyIcon}><Tag size={28} /></div>
                <p style={s.emptyTitle}>Promo kodlar topilmadi</p>
                <p style={s.emptySub}>Yangi kod qo'shish uchun yuqoridagi tugmani bosing</p>
              </div>
            ) : (
              filteredCodes.map((promo) => (
                <div key={promo.id} style={s.card}>
                  <div style={s.cardLeft}>
                    <div style={s.codeBox}>
                      <p style={s.code}>{promo.code}</p>
                    </div>
                    <div>
                      <div style={s.cardTitleRow}>
                        <h3 style={s.cardTitle}>{discountLabel(promo)}</h3>
                        <span style={s.badge(promo.discountType === 'percent' ? '#8B5CF6' : '#3B82F6')}>
                          {promo.discountType === 'percent' ? 'Foiz' : 'Summa'}
                        </span>
                        {!promo.active && <span style={s.badge('#9CA3AF')}>nofaol</span>}
                      </div>
                      <div style={s.cardMeta}>
                        {promo.minOrder > 0 && <span style={s.metaItem}><Coins size={12} /> Min: {formatMoney(promo.minOrder)} so'm</span>}
                        <span style={s.metaItem}><Check size={12} /> {promo.maxUses ? `${promo.usedCount || 0} / ${promo.maxUses} ishlatildi` : `${promo.usedCount || 0} marta ishlatildi`}</span>
                        {promo.endDate && (
                          <span style={s.metaItem}><Calendar size={12} /> {new Date(promo.endDate).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' })} gacha</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={s.actions}>
                    <button style={{ ...s.iconBtn, color: 'var(--primary)', borderColor: 'rgba(249,115,22,0.2)' }} onClick={() => copyCode(promo.code)} title="Nusxalash">
                      {copiedCode === promo.code ? <Check size={15} /> : <Copy size={15} />}
                    </button>
                    <button style={s.toggleTrack(promo.active)} onClick={() => toggleActive(promo.id)} title={promo.active ? 'Faol' : 'Nofaol'}>
                      <div style={s.toggleDot(promo.active)} />
                    </button>
                    <button style={s.iconBtn} onClick={() => openEditCode(promo)} title="Tahrirlash">
                      <Edit size={15} />
                    </button>
                    <button style={{ ...s.iconBtn, color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }} onClick={() => setConfirmDelete(promo.id)} title="O'chirish">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'product' && (
          <div style={s.list}>
            <div style={{ ...s.card, flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Gift size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ ...s.cardTitle, fontSize: 16 }}>Mahsulotga chegirma qo'llash</h3>
              </div>
              <div style={{ ...s.row, flexWrap: 'wrap' }}>
                <div style={{ flex: 2, minWidth: 220 }}>
                  <label style={s.label}>Mahsulot</label>
                  <select style={s.input} value={discountForm.targetId} onChange={(e) => setDiscountForm({ ...discountForm, targetId: e.target.value })}>
                    <option value="">Tanlang...</option>
                    {foods.map((f) => (
                      <option key={f.id} value={f.id}>{f.name} — {f.price.toLocaleString()} so'm</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <label style={s.label}>Chegirma (%)</label>
                  <input style={s.input} type="number" min="1" max="90" value={discountForm.percent}
                    onChange={(e) => setDiscountForm({ ...discountForm, percent: e.target.value })}
                    placeholder="Masalan: 20" />
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <label style={s.label}>Muddati (ixtiyoriy)</label>
                  <input style={s.input} type="date" value={discountForm.expiresAt}
                    onChange={(e) => setDiscountForm({ ...discountForm, expiresAt: e.target.value })} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button style={{ ...s.btn, ...s.btnPrimary }} onClick={handleApplyProductDiscount}>
                    <Gift size={15} /> Qo'llash
                  </button>
                </div>
              </div>
            </div>

            {productDiscounts.length === 0 ? (
              <div style={s.empty}>
                <div style={s.emptyIcon}><Package size={28} /></div>
                <p style={s.emptyTitle}>Faol mahsulot chegirmalari yo'q</p>
                <p style={s.emptySub}>Yuqoridagi formadan foydalanib chegirma qo'shing</p>
              </div>
            ) : (
              productDiscounts.map((d) => (
                <div key={d.id} style={s.card}>
                  <div style={s.cardLeft}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={20} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div>
                      <div style={s.cardTitleRow}>
                        <h3 style={s.cardTitle}>{foodName(d.productId)}</h3>
                        <span style={s.badge('#EF4444')}>-{d.percent}%</span>
                      </div>
                      <div style={s.cardMeta}>
                        {d.expiresAt && <span style={s.metaItem}><Clock size={12} /> {new Date(d.expiresAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' })} gacha</span>}
                      </div>
                    </div>
                  </div>
                  <div style={s.actions}>
                    <button style={{ ...s.iconBtn, color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }} onClick={() => removeProductDiscount(d.productId)} title="Chegirmani olib tashlash">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'category' && (
          <div style={s.list}>
            <div style={{ ...s.card, flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Gift size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ ...s.cardTitle, fontSize: 16 }}>Kategoriyaga chegirma qo'llash</h3>
              </div>
              <div style={{ ...s.row, flexWrap: 'wrap' }}>
                <div style={{ flex: 2, minWidth: 220 }}>
                  <label style={s.label}>Kategoriya</label>
                  <select style={s.input} value={discountForm.targetId} onChange={(e) => setDiscountForm({ ...discountForm, targetId: e.target.value })}>
                    <option value="">Tanlang...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <label style={s.label}>Chegirma (%)</label>
                  <input style={s.input} type="number" min="1" max="90" value={discountForm.percent}
                    onChange={(e) => setDiscountForm({ ...discountForm, percent: e.target.value })}
                    placeholder="Masalan: 15" />
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <label style={s.label}>Muddati (ixtiyoriy)</label>
                  <input style={s.input} type="date" value={discountForm.expiresAt}
                    onChange={(e) => setDiscountForm({ ...discountForm, expiresAt: e.target.value })} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button style={{ ...s.btn, ...s.btnPrimary }} onClick={handleApplyCategoryDiscount}>
                    <Gift size={15} /> Qo'llash
                  </button>
                </div>
              </div>
            </div>

            {categoryDiscounts.length === 0 ? (
              <div style={s.empty}>
                <div style={s.emptyIcon}><FolderOpen size={28} /></div>
                <p style={s.emptyTitle}>Faol kategoriya chegirmalari yo'q</p>
                <p style={s.emptySub}>Yuqoridagi formadan foydalanib chegirma qo'shing</p>
              </div>
            ) : (
              categoryDiscounts.map((d) => (
                <div key={d.id} style={s.card}>
                  <div style={s.cardLeft}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FolderOpen size={20} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div>
                      <div style={s.cardTitleRow}>
                        <h3 style={s.cardTitle}>{catName(d.categoryId)}</h3>
                        <span style={s.badge('#EF4444')}>-{d.percent}%</span>
                      </div>
                      <div style={s.cardMeta}>
                        {d.expiresAt && <span style={s.metaItem}><Clock size={12} /> {new Date(d.expiresAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' })} gacha</span>}
                      </div>
                    </div>
                  </div>
                  <div style={s.actions}>
                    <button style={{ ...s.iconBtn, color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }} onClick={() => removeCategoryDiscount(d.categoryId)} title="Chegirmani olib tashlash">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {modalOpen && (
        <div style={s.overlay} onClick={() => setModalOpen(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editingId ? 'Kodni tahrirlash' : 'Yangi promo kod'}</h2>
              <button style={s.closeBtn} onClick={() => setModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div style={s.field}>
              <label style={s.label}>Promo kod *</label>
              <input style={{ ...s.input, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em' }} value={codeForm.code}
                onChange={(e) => setCodeForm({ ...codeForm, code: e.target.value })}
                placeholder="MASALAN: BEK20" />
            </div>

            <div className="promo-row" style={{ ...s.row, marginBottom: '16px' }}>
              <div style={s.rowField}>
                <label style={s.label}>Chegirma turi</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={{
                    ...s.btn, padding: '8px 14px', fontSize: '13px', flex: 1, justifyContent: 'center',
                    background: codeForm.discountType === 'percent' ? 'var(--primary-light)' : 'var(--surface-active)',
                    color: codeForm.discountType === 'percent' ? 'var(--primary)' : 'var(--text-muted)',
                    border: codeForm.discountType === 'percent' ? '1px solid rgba(249,115,22,0.2)' : '1px solid var(--border)',
                  }} onClick={() => setCodeForm({ ...codeForm, discountType: 'percent' })}>
                    <Percent size={13} /> Foiz
                  </button>
                  <button style={{
                    ...s.btn, padding: '8px 14px', fontSize: '13px', flex: 1, justifyContent: 'center',
                    background: codeForm.discountType === 'fixed' ? 'var(--primary-light)' : 'var(--surface-active)',
                    color: codeForm.discountType === 'fixed' ? 'var(--primary)' : 'var(--text-muted)',
                    border: codeForm.discountType === 'fixed' ? '1px solid rgba(249,115,22,0.2)' : '1px solid var(--border)',
                  }} onClick={() => setCodeForm({ ...codeForm, discountType: 'fixed' })}>
                    <Coins size={13} /> Summa
                  </button>
                </div>
              </div>
              <div style={s.rowField}>
                <label style={s.label}>Chegirma miqdori *</label>
                <input style={s.input} type="number" min="0" value={codeForm.discount}
                  onChange={(e) => setCodeForm({ ...codeForm, discount: e.target.value })}
                  placeholder={codeForm.discountType === 'percent' ? 'Masalan: 20' : 'Masalan: 5000'} />
              </div>
            </div>

            <div className="promo-row" style={{ ...s.row, marginBottom: '16px' }}>
              <div style={s.rowField}>
                <label style={s.label}>Minimal buyurtma (so'm)</label>
                <input style={s.input} type="number" min="0" value={codeForm.minOrder}
                  onChange={(e) => setCodeForm({ ...codeForm, minOrder: e.target.value })}
                  placeholder="0 = cheklovsiz" />
              </div>
              <div style={s.rowField}>
                <label style={s.label}>Maksimal foydalanish</label>
                <input style={s.input} type="number" min="0" value={codeForm.maxUses}
                  onChange={(e) => setCodeForm({ ...codeForm, maxUses: e.target.value })}
                  placeholder="0 = cheklovsiz" />
              </div>
            </div>

            <div className="promo-row" style={{ ...s.row, marginBottom: '20px' }}>
              <div style={s.rowField}>
                <label style={s.label}>Boshlanish</label>
                <input style={s.input} type="date" value={codeForm.startDate}
                  onChange={(e) => setCodeForm({ ...codeForm, startDate: e.target.value })} />
              </div>
              <div style={s.rowField}>
                <label style={s.label}>Tugash</label>
                <input style={s.input} type="date" value={codeForm.endDate}
                  onChange={(e) => setCodeForm({ ...codeForm, endDate: e.target.value })} />
              </div>
            </div>

            <div style={s.statusRow}>
              <div style={s.statusLabel}>
                <Check size={16} style={{ color: codeForm.active ? 'var(--success)' : 'var(--text-muted)' }} />
                Holat
              </div>
              <button style={s.toggleTrack(codeForm.active)} onClick={() => setCodeForm({ ...codeForm, active: !codeForm.active })}>
                <div style={s.toggleDot(codeForm.active)} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button style={{ ...s.btn, ...s.btnSecondary, flex: 1, justifyContent: 'center' }} onClick={() => setModalOpen(false)}>
                Bekor qilish
              </button>
              <button style={{ ...s.btn, ...s.btnPrimary, flex: 1, justifyContent: 'center' }} onClick={saveCode}>
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
              <button style={{ ...s.btn, ...s.btnDanger, flex: 1, justifyContent: 'center' }} onClick={() => { deletePromoCode(confirmDelete); setConfirmDelete(null); }}>
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
