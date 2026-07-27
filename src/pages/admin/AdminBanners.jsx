import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Edit, Trash2, Image, GripVertical, Eye, EyeOff, ArrowUp, ArrowDown, X } from 'lucide-react';

const initialBanners = [
  { id: 1, title: 'Yangi taomlar keldi!', subtitle: 'Eng so\'nggi lazzatlar bilan tanishing', imageUrl: '/images/banner1.jpg', link: '/menu/new', type: 'slider', active: true, order: 1 },
  { id: 2, title: '50% chegirma', subtitle: 'Faqat bugun barcha kaboblar', imageUrl: '/images/banner2.jpg', link: '/promos/kabob', type: 'popup', active: true, order: 2 },
  { id: 3, title: 'Yetkazib berish bepul', subtitle: '100,000 so\'mdan yuqori buyurtmalarga', imageUrl: '/images/banner3.jpg', link: '/delivery', type: 'promo', active: false, order: 3 },
  { id: 4, title: 'Yangi filial ochildi!', subtitle: 'Toshkent, Amir Temur ko\'chasi', imageUrl: '/images/banner4.jpg', link: '/locations/new', type: 'landing', active: true, order: 4 },
  { id: 5, title: 'Mobil ilova', subtitle: 'Yuklab oling va 10% chegirma oling', imageUrl: '/images/banner5.jpg', link: '/app', type: 'mobile', active: true, order: 5 },
];

const badgeColors = {
  slider: { bg: '#1e3a5f', color: '#60a5fa', border: '#2563eb' },
  popup: { bg: '#3b1f2b', color: '#f87171', border: '#dc2626' },
  promo: { bg: '#1a2e1a', color: '#4ade80', border: '#16a34a' },
  landing: { bg: '#2e2a1a', color: '#facc15', border: '#ca8a04' },
  mobile: { bg: '#2a1a2e', color: '#c084fc', border: '#9333ea' },
};

const containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 50%, #1a0f0a 100%)', padding: '24px', fontFamily: "'Inter', sans-serif" };
const headerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' };
const titleStyle = { fontSize: '28px', fontWeight: '800', color: '#f5f5f5', letterSpacing: '-0.5px' };
const subtitleStyle = { fontSize: '14px', color: '#888', marginTop: '4px' };
const backBtnStyle = { display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ccc', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', transition: 'all 0.2s' };
const primaryBtnStyle = { display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #b45309, #d97706)', border: 'none', color: '#fff', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '700', transition: 'all 0.3s', boxShadow: '0 4px 15px rgba(180,83,9,0.4)' };
const tabsContainerStyle = { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' };
const tabStyle = (active) => ({ padding: '10px 22px', borderRadius: '10px', border: active ? '1px solid #b45309' : '1px solid rgba(255,255,255,0.08)', background: active ? 'linear-gradient(135deg, #b45309, #92400e)' : 'rgba(255,255,255,0.03)', color: active ? '#fff' : '#888', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.3s' });
const listStyle = { display: 'flex', flexDirection: 'column', gap: '12px' };
const cardStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '18px 22px', transition: 'all 0.3s', gap: '16px', flexWrap: 'wrap' };
const imgPreviewStyle = { width: '80px', height: '56px', borderRadius: '10px', objectFit: 'cover', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const infoStyle = { flex: 1, minWidth: '200px' };
const bannerTitleStyle = { fontSize: '16px', fontWeight: '700', color: '#f0f0f0', marginBottom: '4px' };
const bannerSubStyle = { fontSize: '13px', color: '#777' };
const actionsStyle = { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' };
const iconBtnStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#aaa', cursor: 'pointer', transition: 'all 0.2s' };
const toggleTrack = (active) => ({ width: '44px', height: '24px', borderRadius: '12px', background: active ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'rgba(255,255,255,0.1)', border: active ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'all 0.3s' });
const toggleDot = (active) => ({ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: active ? '22px' : '3px', transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' });
const modalOverlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' };
const modalContentStyle = { background: 'linear-gradient(145deg, #1f1f1f, #171717)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' };
const modalTitleStyle = { fontSize: '22px', fontWeight: '800', color: '#f5f5f5', marginBottom: '24px' };
const labelStyle = { fontSize: '13px', fontWeight: '600', color: '#999', marginBottom: '8px', display: 'block' };
const inputStyle = { width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#f0f0f0', fontSize: '14px', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' };
const selectStyle = { ...inputStyle, appearance: 'none', cursor: 'pointer' };
const rowStyle = { display: 'flex', gap: '16px', marginBottom: '18px' };
const fieldStyle = { flex: 1, marginBottom: '18px' };
const saveBtnStyle = { ...primaryBtnStyle, width: '100%', justifyContent: 'center', marginTop: '8px' };
const cancelBtnStyle = { ...backBtnStyle, width: '100%', justifyContent: 'center', marginTop: '8px' };
const emptyStyle = { textAlign: 'center', padding: '60px 20px', color: '#666' };
const emptyIconStyle = { width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#555' };
const counterStyle = { fontSize: '13px', color: '#666', background: 'rgba(255,255,255,0.03)', padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' };
const previewBoxStyle = { width: '100%', height: '160px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', overflow: 'hidden' };
const imgPreviewModalStyle = { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' };

export default function AdminBanners() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState(initialBanners);
  const [activeTab, setActiveTab] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [form, setForm] = useState({ title: '', subtitle: '', imageUrl: '', link: '', type: 'slider', active: true, order: 1 });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const tabs = ['all', 'slider', 'popup', 'promo', 'landing', 'mobile'];
  const tabLabels = { all: 'Hammasi', slider: 'Slider', popup: 'Popup', promo: 'Promo', landing: 'Landing', mobile: 'Mobile' };

  const filtered = activeTab === 'all' ? banners : banners.filter(b => b.type === activeTab);

  const openAdd = () => {
    setEditingBanner(null);
    setForm({ title: '', subtitle: '', imageUrl: '', link: '', type: 'slider', active: true, order: banners.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (banner) => {
    setEditingBanner(banner.id);
    setForm({ title: banner.title, subtitle: banner.subtitle, imageUrl: banner.imageUrl, link: banner.link, type: banner.type, active: banner.active, order: banner.order });
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

  const getBadge = (type) => {
    const c = badgeColors[type] || badgeColors.slider;
    return (
      <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
        {type}
      </span>
    );
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <button
              style={backBtnStyle}
              onClick={() => navigate(-1)}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              <ChevronLeft size={18} /> Orqaga
            </button>
            <div style={{ marginTop: '12px' }}>
              <h1 style={titleStyle}>Banner boshqaruvi</h1>
              <p style={subtitleStyle}>Sahifangizdagi bannerlarni boshqaring</p>
            </div>
          </div>
          <button
            style={primaryBtnStyle}
            onClick={openAdd}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(180,83,9,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(180,83,9,0.4)'; }}
          >
            <Plus size={18} /> Yangi banner
          </button>
        </div>

        {/* Tabs */}
        <div style={tabsContainerStyle}>
          {tabs.map(t => (
            <button key={t} style={tabStyle(activeTab === t)} onClick={() => setActiveTab(t)}>
              {tabLabels[t]}
            </button>
          ))}
          <div style={counterStyle}>{filtered.length} ta banner</div>
        </div>

        {/* Banner List */}
        <div style={listStyle}>
          {filtered.length === 0 ? (
            <div style={emptyStyle}>
              <div style={emptyIconStyle}><Image size={28} /></div>
              <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px', color: '#888' }}>Bannerlar topilmadi</p>
              <p style={{ fontSize: '13px', color: '#555' }}>Yangi banner qo'shish uchun yuqoridagi tugmani bosing</p>
            </div>
          ) : (
            filtered.map((banner, idx) => (
              <div
                key={banner.id}
                style={{
                  ...cardStyle,
                  animation: `fadeSlideIn 0.4s ease ${idx * 0.08}s both`
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(180,83,9,0.3)'; e.currentTarget.style.background = 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {/* Drag handle + image */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                  <GripVertical size={16} style={{ color: '#444', flexShrink: 0, cursor: 'grab' }} />
                  <div style={imgPreviewStyle}>
                    {banner.imageUrl ? (
                      <img src={banner.imageUrl} alt={banner.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                    ) : (
                      <Image size={24} style={{ color: '#444' }} />
                    )}
                  </div>
                  <div style={infoStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <span style={bannerTitleStyle}>{banner.title}</span>
                      {getBadge(banner.type)}
                    </div>
                    <p style={bannerSubStyle}>{banner.subtitle}</p>
                  </div>
                </div>

                {/* Actions */}
                <div style={actionsStyle}>
                  <button
                    style={iconBtnStyle}
                    onClick={() => moveBanner(banner.id, 'up')}
                    title="Tepaga"
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#aaa'; }}
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    style={iconBtnStyle}
                    onClick={() => moveBanner(banner.id, 'down')}
                    title="Pastga"
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#aaa'; }}
                  >
                    <ArrowDown size={15} />
                  </button>
                  <div style={toggleTrack(banner.active)} onClick={() => toggleActive(banner.id)}>
                    <div style={toggleDot(banner.active)} />
                  </div>
                  <button
                    style={iconBtnStyle}
                    onClick={() => openEdit(banner)}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(180,83,9,0.2)'; e.currentTarget.style.color = '#f59e0b'; e.currentTarget.style.borderColor = 'rgba(180,83,9,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#aaa'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  >
                    <Edit size={15} />
                  </button>
                  <button
                    style={iconBtnStyle}
                    onClick={() => setConfirmDelete(banner.id)}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.2)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#aaa'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div style={modalOverlayStyle} onClick={() => setModalOpen(false)}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={modalTitleStyle}>{editingBanner ? 'Banner tahrirlash' : 'Yangi banner'}</h2>
                <button
                  style={{ ...iconBtnStyle, width: '32px', height: '32px' }}
                  onClick={() => setModalOpen(false)}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.2)'; e.currentTarget.style.color = '#f87171'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#aaa'; }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Image Preview */}
              {form.imageUrl ? (
                <div style={previewBoxStyle}>
                  <img src={form.imageUrl} alt="Preview" style={imgPreviewModalStyle} />
                </div>
              ) : (
                <div style={previewBoxStyle}>
                  <div style={{ textAlign: 'center', color: '#555' }}>
                    <Image size={32} style={{ marginBottom: '8px' }} />
                    <p style={{ fontSize: '13px' }}>Rasm URL kiriting</p>
                  </div>
                </div>
              )}

              <div style={fieldStyle}>
                <label style={labelStyle}>Sarlavha *</label>
                <input
                  style={inputStyle}
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Banner sarlavhasi"
                  onFocus={e => { e.target.style.borderColor = '#b45309'; e.target.style.boxShadow = '0 0 0 3px rgba(180,83,9,0.15)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Subtitle</label>
                <input
                  style={inputStyle}
                  value={form.subtitle}
                  onChange={e => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="Qo'shimcha ma'lumot"
                  onFocus={e => { e.target.style.borderColor = '#b45309'; e.target.style.boxShadow = '0 0 0 3px rgba(180,83,9,0.15)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Rasm URL</label>
                <input
                  style={inputStyle}
                  value={form.imageUrl}
                  onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  onFocus={e => { e.target.style.borderColor = '#b45309'; e.target.style.boxShadow = '0 0 0 3px rgba(180,83,9,0.15)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>Havola (Link)</label>
                <input
                  style={inputStyle}
                  value={form.link}
                  onChange={e => setForm({ ...form, link: e.target.value })}
                  placeholder="/menu yoki https://..."
                  onFocus={e => { e.target.style.borderColor = '#b45309'; e.target.style.boxShadow = '0 0 0 3px rgba(180,83,9,0.15)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div style={rowStyle}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Turi</label>
                  <select
                    style={selectStyle}
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="slider">Slider</option>
                    <option value="popup">Popup</option>
                    <option value="promo">Promo</option>
                    <option value="landing">Landing</option>
                    <option value="mobile">Mobile</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Tartib raqami</label>
                  <input
                    style={inputStyle}
                    type="number"
                    min="1"
                    value={form.order}
                    onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 1 })}
                    onFocus={e => { e.target.style.borderColor = '#b45309'; e.target.style.boxShadow = '0 0 0 3px rgba(180,83,9,0.15)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', padding: '14px 18px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {form.active ? <Eye size={16} style={{ color: '#22c55e' }} /> : <EyeOff size={16} style={{ color: '#666' }} />}
                  <span style={{ fontSize: '14px', color: '#ddd', fontWeight: '600' }}>Holat</span>
                </div>
                <div style={toggleTrack(form.active)} onClick={() => setForm({ ...form, active: !form.active })}>
                  <div style={toggleDot(form.active)} />
                </div>
              </div>

              <button
                style={saveBtnStyle}
                onClick={saveBanner}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(180,83,9,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(180,83,9,0.4)'; }}
              >
                {editingBanner ? 'Saqlash' : "Qo'shish"}
              </button>
              <button
                style={cancelBtnStyle}
                onClick={() => setModalOpen(false)}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              >
                Bekor qilish
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {confirmDelete && (
          <div style={modalOverlayStyle} onClick={() => setConfirmDelete(null)}>
            <div style={{ ...modalContentStyle, maxWidth: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <Trash2 size={26} style={{ color: '#f87171' }} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f0f0f0', marginBottom: '8px' }}>O'chirishni xohlaysizmi?</h3>
              <p style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>Bu amalni bekor qilib bo'lmaydi</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  style={{ ...cancelBtnStyle, flex: 1, marginTop: 0 }}
                  onClick={() => setConfirmDelete(null)}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                  Bekor qilish
                </button>
                <button
                  style={{ ...primaryBtnStyle, flex: 1, marginTop: 0, background: 'linear-gradient(135deg, #dc2626, #b91c1c)', boxShadow: '0 4px 15px rgba(220,38,38,0.4)', justifyContent: 'center' }}
                  onClick={() => deleteBanner(confirmDelete)}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  O'chirish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .banner-card { flex-direction: column; align-items: flex-start !important; }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        input::placeholder, select::placeholder { color: #555; }
        select option { background: #1f1f1f; color: #f0f0f0; }
      `}</style>
    </div>
  );
}
