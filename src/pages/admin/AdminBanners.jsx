import React, { useState } from 'react';
import { Plus, Edit, Trash2, Image, GripVertical, Eye, EyeOff, ArrowUp, ArrowDown, X, Search, Upload, Calendar, Clock, ChevronDown } from 'lucide-react';

const initialBanners = [
  { id: 1, title: 'Yangi taomlar keldi!', subtitle: "Eng so'nggi lazzatlar bilan tanishing", imageUrl: '/images/banner1.jpg', link: '/menu/new', type: 'slider', active: true, order: 1, startDate: '', endDate: '' },
  { id: 2, title: '50% chegirma', subtitle: 'Faqat bugun barcha kaboblar', imageUrl: '/images/banner2.jpg', link: '/promos/kabob', type: 'popup', active: true, order: 2, startDate: '', endDate: '' },
  { id: 3, title: "Yetkazib berish bepul", subtitle: "100,000 so'mdan yuqori buyurtmalarga", imageUrl: '/images/banner3.jpg', link: '/delivery', type: 'promo', active: false, order: 3, startDate: '', endDate: '' },
  { id: 4, title: 'Yangi filial ochildi!', subtitle: "Toshkent, Amir Temur ko'chasi", imageUrl: '/images/banner4.jpg', link: '/locations/new', type: 'landing', active: true, order: 4, startDate: '', endDate: '' },
  { id: 5, title: 'Mobil ilova', subtitle: "Yuklab oling va 10% chegirma oling", imageUrl: '/images/banner5.jpg', link: '/app', type: 'mobile', active: true, order: 5, startDate: '', endDate: '' },
];

const typeColors = {
  slider: '#3B82F6',
  popup: '#EF4444',
  promo: '#22C55E',
  landing: '#F59E0B',
  mobile: '#8B5CF6',
};

const s = {
  page: { padding: '32px', background: 'var(--bg)', minHeight: '100vh' },
  container: { maxWidth: '1100px', margin: '0 auto' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' },
  title: { fontSize: '28px', fontWeight: '800', color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' },
  subtitle: { fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px', margin: '4px 0 0 0' },
  headerActions: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
  btn: { display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s', fontFamily: 'inherit' },
  btnPrimary: { background: 'var(--primary)', color: '#fff', boxShadow: '0 2px 8px rgba(249,115,22,0.3)' },
  btnSecondary: { background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border-strong)' },
  btnDanger: { background: 'var(--danger)', color: '#fff' },
  btnGhost: { background: 'transparent', color: 'var(--text-muted)', padding: '8px 12px' },
  searchWrap: { position: 'relative', flex: 1, maxWidth: '320px', minWidth: '200px' },
  searchInput: { width: '100%', padding: '10px 14px 10px 40px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', background: 'var(--surface)', color: 'var(--text)', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s' },
  searchIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' },
  tabs: { display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' },
  tab: (active) => ({
    padding: '8px 18px', borderRadius: '10px', border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
    background: active ? 'var(--primary-light)' : 'var(--surface)', color: active ? 'var(--primary)' : 'var(--text-muted)',
    cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s', fontFamily: 'inherit',
  }),
  counter: { fontSize: '13px', color: 'var(--text-muted)', marginLeft: 'auto' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  card: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px', transition: 'all 0.2s', gap: '16px', flexWrap: 'wrap' },
  cardLeft: { display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 },
  grip: { color: 'var(--text-muted)', flexShrink: 0, cursor: 'grab', opacity: 0.5 },
  imgThumb: { width: '80px', height: '56px', borderRadius: '10px', objectFit: 'cover', background: 'var(--surface-active)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' },
  cardInfo: { flex: 1, minWidth: '180px' },
  cardTitleRow: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '2px' },
  cardTitle: { fontSize: '15px', fontWeight: '700', color: 'var(--text)', margin: 0 },
  badge: (color) => ({
    display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '6px',
    fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3px',
    background: color + '14', color: color, border: `1px solid ${color}30`,
  }),
  cardSub: { fontSize: '13px', color: 'var(--text-muted)', margin: 0 },
  cardMeta: { display: 'flex', gap: '12px', marginTop: '4px', flexWrap: 'wrap' },
  metaItem: { fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' },
  actions: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' },
  iconBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s', padding: 0 },
  toggleWrap: { display: 'flex', alignItems: 'center', gap: '8px' },
  toggleTrack: (active) => ({
    width: '42px', height: '22px', borderRadius: '11px', cursor: 'pointer', position: 'relative',
    transition: 'all 0.2s', border: 'none', padding: 0,
    background: active ? 'var(--success)' : 'var(--border-strong)',
  }),
  toggleDot: (active) => ({
    width: '16px', height: '16px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px',
    left: active ? '23px' : '3px', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
  }),
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' },
  modalTitle: { fontSize: '20px', fontWeight: '800', color: 'var(--text)', margin: 0 },
  closeBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', padding: 0 },
  previewBox: { width: '100%', height: '140px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-active)', border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', overflow: 'hidden' },
  previewImg: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' },
  field: { marginBottom: '16px' },
  label: { fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' },
  input: { width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box', fontFamily: 'inherit' },
  select: { width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: '10px', color: 'var(--text)', fontSize: '14px', outline: 'none', cursor: 'pointer', appearance: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },
  row: { display: 'flex', gap: '14px' },
  rowField: { flex: 1 },
  statusRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--surface-active)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '20px' },
  statusLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '600' },
  scheduleToggle: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', padding: '6px 12px', borderRadius: '8px', border: 'none', background: 'var(--primary-light)', marginBottom: '16px', fontFamily: 'inherit', transition: 'all 0.2s' },
  empty: { textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' },
  emptyIcon: { width: '64px', height: '64px', borderRadius: '16px', background: 'var(--surface-active)', border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-muted)' },
  emptyTitle: { fontSize: '16px', fontWeight: '600', color: 'var(--text-secondary)', margin: '0 0 4px 0' },
  emptySub: { fontSize: '13px', color: 'var(--text-muted)', margin: 0 },
  confirmModal: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '28px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: 'var(--shadow-lg)' },
  confirmIcon: { width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  confirmTitle: { fontSize: '17px', fontWeight: '700', color: 'var(--text)', margin: '0 0 6px 0' },
  confirmSub: { fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 24px 0' },
  confirmBtns: { display: 'flex', gap: '10px' },
  orderNum: { width: '28px', height: '28px', borderRadius: '8px', background: 'var(--surface-active)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', flexShrink: 0 },
  uploadArea: { width: '100%', padding: '24px', borderRadius: 'var(--radius-sm)', border: '2px dashed var(--border-strong)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s', background: 'var(--surface-active)', marginBottom: '12px' },
  uploadText: { fontSize: '13px', color: 'var(--text-muted)', margin: 0 },
  uploadHint: { fontSize: '12px', color: 'var(--text-muted)', opacity: 0.6, margin: 0 },
  divider: { height: '1px', background: 'var(--border)', margin: '12px 0' },
};

export default function AdminBanners() {
  const [banners, setBanners] = useState(initialBanners);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [form, setForm] = useState({ title: '', subtitle: '', imageUrl: '', link: '', type: 'slider', active: true, order: 1, startDate: '', endDate: '' });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [imageInputMode, setImageInputMode] = useState('url');

  const tabs = ['all', 'slider', 'popup', 'promo', 'landing', 'mobile'];
  const tabLabels = { all: 'Hammasi', slider: 'Slider', popup: 'Popup', promo: 'Promo', landing: 'Landing', mobile: 'Mobile' };

  const filtered = banners.filter(b => {
    const matchTab = activeTab === 'all' || b.type === activeTab;
    const matchSearch = !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  const openAdd = () => {
    setEditingBanner(null);
    setForm({ title: '', subtitle: '', imageUrl: '', link: '', type: 'slider', active: true, order: banners.length + 1, startDate: '', endDate: '' });
    setShowSchedule(false);
    setImageInputMode('url');
    setModalOpen(true);
  };

  const openEdit = (banner) => {
    setEditingBanner(banner.id);
    setForm({ title: banner.title, subtitle: banner.subtitle, imageUrl: banner.imageUrl, link: banner.link, type: banner.type, active: banner.active, order: banner.order, startDate: banner.startDate || '', endDate: banner.endDate || '' });
    setShowSchedule(!!banner.startDate || !!banner.endDate);
    setImageInputMode('url');
    setModalOpen(true);
  };

  const saveBanner = () => {
    if (!form.title.trim()) return;
    if (editingBanner) {
      setBanners(banners.map(b => b.id === editingBanner ? { ...b, ...form } : b));
    } else {
      setBanners([...banners, { id: Date.now(), ...form }]);
    }
    setModalOpen(false);
  };

  const deleteBanner = (id) => {
    setBanners(banners.filter(b => b.id !== id));
    setConfirmDelete(null);
  };

  const toggleActive = (id) => {
    setBanners(banners.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const moveBanner = (id, dir) => {
    const idx = banners.findIndex(b => b.id === id);
    if (idx === -1) return;
    const arr = [...banners];
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= arr.length) return;
    [arr[idx].order, arr[swapIdx].order] = [arr[swapIdx].order, arr[idx].order];
    [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
    setBanners(arr);
  };

  const formatDate = (d) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Banner boshqaruvi</h1>
            <p style={s.subtitle}>Sahifangizdagi bannerlarni boshqaring</p>
          </div>
          <div style={s.headerActions}>
            <div style={s.searchWrap}>
              <Search size={16} style={s.searchIcon} />
              <input
                style={s.searchInput}
                placeholder="Banner qidirish..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border-strong)'; }}
              />
            </div>
            <button style={{ ...s.btn, ...s.btnPrimary }} onClick={openAdd}>
              <Plus size={16} /> Yangi banner
            </button>
          </div>
        </div>

        <div style={s.tabs}>
          {tabs.map(t => (
            <button key={t} style={s.tab(activeTab === t)} onClick={() => setActiveTab(t)}>
              {tabLabels[t]}
            </button>
          ))}
          <span style={s.counter}>{filtered.length} ta banner</span>
        </div>

        <div style={s.list}>
          {filtered.length === 0 ? (
            <div style={s.empty}>
              <div style={s.emptyIcon}><Image size={28} /></div>
              <p style={s.emptyTitle}>Bannerlar topilmadi</p>
              <p style={s.emptySub}>Yangi banner qo'shish uchun yuqoridagi tugmani bosing</p>
            </div>
          ) : (
            filtered.map((banner) => (
              <div key={banner.id} style={s.card}>
                <div style={s.cardLeft}>
                  <div style={s.orderNum}>{banner.order}</div>
                  <div style={s.imgThumb}>
                    {banner.imageUrl ? (
                      <img src={banner.imageUrl} alt={banner.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Image size={22} style={{ color: 'var(--text-muted)' }} />
                    )}
                  </div>
                  <div style={s.cardInfo}>
                    <div style={s.cardTitleRow}>
                      <h3 style={s.cardTitle}>{banner.title}</h3>
                      <span style={s.badge(typeColors[banner.type] || '#6B7280')}>{banner.type}</span>
                      {!banner.active && <span style={s.badge('#9CA3AF')}>nofaol</span>}
                    </div>
                    <p style={s.cardSub}>{banner.subtitle}</p>
                    {(banner.startDate || banner.endDate) && (
                      <div style={s.cardMeta}>
                        {banner.startDate && (
                          <span style={s.metaItem}><Calendar size={12} /> {formatDate(banner.startDate)}</span>
                        )}
                        {banner.endDate && (
                          <span style={s.metaItem}><Clock size={12} /> {formatDate(banner.endDate)}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div style={s.actions}>
                  <button style={s.iconBtn} onClick={() => moveBanner(banner.id, 'up')} title="Tepaga">
                    <ArrowUp size={15} />
                  </button>
                  <button style={s.iconBtn} onClick={() => moveBanner(banner.id, 'down')} title="Pastga">
                    <ArrowDown size={15} />
                  </button>
                  <div style={s.toggleWrap}>
                    <button
                      style={s.toggleTrack(banner.active)}
                      onClick={() => toggleActive(banner.id)}
                      title={banner.active ? 'Faollashtirilgan' : 'O\'chirilgan'}
                    >
                      <div style={s.toggleDot(banner.active)} />
                    </button>
                  </div>
                  <button style={s.iconBtn} onClick={() => openEdit(banner)} title="Tahrirlash">
                    <Edit size={15} />
                  </button>
                  <button style={{ ...s.iconBtn, color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }} onClick={() => setConfirmDelete(banner.id)} title="O'chirish">
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
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editingBanner ? 'Banner tahrirlash' : 'Yangi banner'}</h2>
              <button style={s.closeBtn} onClick={() => setModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div style={s.previewBox}>
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="Preview" style={s.previewImg} />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Image size={28} style={{ marginBottom: '6px', opacity: 0.5 }} />
                  <p style={{ fontSize: '13px', margin: 0 }}>Rasm URL kiriting</p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
              <button
                style={{ ...s.btn, padding: '6px 14px', fontSize: '12px', background: imageInputMode === 'url' ? 'var(--primary-light)' : 'var(--surface-active)', color: imageInputMode === 'url' ? 'var(--primary)' : 'var(--text-muted)', border: imageInputMode === 'url' ? '1px solid rgba(249,115,22,0.2)' : '1px solid var(--border)' }}
                onClick={() => setImageInputMode('url')}
              >
                URL
              </button>
              <button
                style={{ ...s.btn, padding: '6px 14px', fontSize: '12px', background: imageInputMode === 'upload' ? 'var(--primary-light)' : 'var(--surface-active)', color: imageInputMode === 'upload' ? 'var(--primary)' : 'var(--text-muted)', border: imageInputMode === 'upload' ? '1px solid rgba(249,115,22,0.2)' : '1px solid var(--border)' }}
                onClick={() => setImageInputMode('upload')}
              >
                <Upload size={12} /> Yuklash
              </button>
            </div>

            {imageInputMode === 'url' ? (
              <div style={s.field}>
                <label style={s.label}>Rasm URL</label>
                <input
                  style={s.input}
                  value={form.imageUrl}
                  onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border-strong)'; }}
                />
              </div>
            ) : (
              <div style={s.uploadArea}>
                <Upload size={24} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                <p style={s.uploadText}>Faylni bu yerga tashlang yoki bosing</p>
                <p style={s.uploadHint}>JPG, PNG, WebP. Maks. 5MB</p>
              </div>
            )}

            <div style={s.field}>
              <label style={s.label}>Sarlavha *</label>
              <input
                style={s.input}
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Banner sarlavhasi"
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border-strong)'; }}
              />
            </div>

            <div style={s.field}>
              <label style={s.label}>Subtitle</label>
              <input
                style={s.input}
                value={form.subtitle}
                onChange={e => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Qo'shimcha ma'lumot"
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border-strong)'; }}
              />
            </div>

            <div style={s.field}>
              <label style={s.label}>Havola (Link)</label>
              <input
                style={s.input}
                value={form.link}
                onChange={e => setForm({ ...form, link: e.target.value })}
                placeholder="/menu yoki https://..."
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border-strong)'; }}
              />
            </div>

            <div style={{ ...s.row, marginBottom: '16px' }}>
              <div style={s.rowField}>
                <label style={s.label}>Turi</label>
                <div style={{ position: 'relative' }}>
                  <select
                    style={s.select}
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="slider">Slider</option>
                    <option value="popup">Popup</option>
                    <option value="promo">Promo</option>
                    <option value="landing">Landing</option>
                    <option value="mobile">Mobile</option>
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                </div>
              </div>
              <div style={s.rowField}>
                <label style={s.label}>Tartib raqami</label>
                <input
                  style={s.input}
                  type="number"
                  min="1"
                  value={form.order}
                  onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 1 })}
                  onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border-strong)'; }}
                />
              </div>
            </div>

            <div style={s.statusRow}>
              <div style={s.statusLabel}>
                {form.active ? <Eye size={16} style={{ color: 'var(--success)' }} /> : <EyeOff size={16} style={{ color: 'var(--text-muted)' }} />}
                Holat
              </div>
              <button
                style={s.toggleTrack(form.active)}
                onClick={() => setForm({ ...form, active: !form.active })}
              >
                <div style={s.toggleDot(form.active)} />
              </button>
            </div>

            <button style={s.scheduleToggle} onClick={() => setShowSchedule(!showSchedule)}>
              <Calendar size={14} /> Jadval belgilash <ChevronDown size={12} style={{ transform: showSchedule ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
            </button>

            {showSchedule && (
              <div style={{ ...s.row, marginBottom: '20px' }}>
                <div style={s.rowField}>
                  <label style={s.label}>Boshlanish</label>
                  <input
                    style={s.input}
                    type="date"
                    value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })}
                    onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border-strong)'; }}
                  />
                </div>
                <div style={s.rowField}>
                  <label style={s.label}>Tugash</label>
                  <input
                    style={s.input}
                    type="date"
                    value={form.endDate}
                    onChange={e => setForm({ ...form, endDate: e.target.value })}
                    onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border-strong)'; }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button style={{ ...s.btn, ...s.btnSecondary, flex: 1, justifyContent: 'center' }} onClick={() => setModalOpen(false)}>
                Bekor qilish
              </button>
              <button style={{ ...s.btn, ...s.btnPrimary, flex: 1, justifyContent: 'center' }} onClick={saveBanner}>
                {editingBanner ? 'Saqlash' : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div style={s.overlay} onClick={() => setConfirmDelete(null)}>
          <div style={s.confirmModal} onClick={e => e.stopPropagation()}>
            <div style={s.confirmIcon}>
              <Trash2 size={24} style={{ color: 'var(--danger)' }} />
            </div>
            <h3 style={s.confirmTitle}>O'chirishni xohlaysizmi?</h3>
            <p style={s.confirmSub}>Bu amalni bekor qilib bo'lmaydi</p>
            <div style={s.confirmBtns}>
              <button style={{ ...s.btn, ...s.btnSecondary, flex: 1, justifyContent: 'center' }} onClick={() => setConfirmDelete(null)}>
                Bekor qilish
              </button>
              <button style={{ ...s.btn, ...s.btnDanger, flex: 1, justifyContent: 'center' }} onClick={() => deleteBanner(confirmDelete)}>
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
