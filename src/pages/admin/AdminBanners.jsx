import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Edit, Trash2, Image, Eye, EyeOff, ArrowUp, ArrowDown, X,
  Search, Upload, Calendar, Clock, ChevronDown,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

const initialBanners = [
  { id: 1, title: 'Yangi taomlar keldi!', subtitle: "Eng so'nggi lazzatlar bilan tanishing", imageUrl: '/images/banner1.jpg', link: '/menu/new', type: 'slider', active: true, order: 1, startDate: '', endDate: '' },
  { id: 2, title: '50% chegirma', subtitle: 'Faqat bugun barcha kaboblar', imageUrl: '/images/banner2.jpg', link: '/promos/kabob', type: 'popup', active: true, order: 2, startDate: '', endDate: '' },
  { id: 3, title: "Yetkazib berish bepul", subtitle: "100,000 so'mdan yuqori buyurtmalarga", imageUrl: '/images/banner3.jpg', link: '/delivery', type: 'promo', active: false, order: 3, startDate: '', endDate: '' },
  { id: 4, title: 'Yangi filial ochildi!', subtitle: "Toshkent, Amir Temur ko'chasi", imageUrl: '/images/banner4.jpg', link: '/locations/new', type: 'landing', active: true, order: 4, startDate: '', endDate: '' },
  { id: 5, title: 'Mobil ilova', subtitle: "Yuklab oling va 10% chegirma oling", imageUrl: '/images/banner5.jpg', link: '/app', type: 'mobile', active: true, order: 5, startDate: '', endDate: '' },
];

const typeColors = {
  slider: '#3B82F6', popup: '#EF4444', promo: '#22C55E', landing: '#F59E0B', mobile: '#8B5CF6',
};

const typeBadgeVariant = {
  slider: 'info', popup: 'danger', promo: 'success', landing: 'warning', mobile: 'info',
};

const tabs = ['all', 'slider', 'popup', 'promo', 'landing', 'mobile'];
const tabLabels = { all: 'Hammasi', slider: 'Slider', popup: 'Popup', promo: 'Promo', landing: 'Landing', mobile: 'Mobile' };

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

function formatDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' });
}

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
    if (editingBanner) setBanners(banners.map(b => b.id === editingBanner ? { ...b, ...form } : b));
    else setBanners([...banners, { id: Date.now(), ...form }]);
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div variants={container} initial="hidden" animate="visible" style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div variants={item} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' }}>Banner boshqaruvi</h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '4px 0 0' }}>Sahifangizdagi bannerlarni boshqaring</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: 280 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input placeholder="Banner qidirish..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 14px 10px 40px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
              />
            </div>
            <Button variant="primary" size="md" leftIcon={<Plus size={16} />} onClick={openAdd}>Yangi banner</Button>
          </div>
        </motion.div>

        <motion.div variants={item} style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              style={{
                padding: '8px 18px', borderRadius: 10, fontFamily: 'inherit', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                border: `1px solid ${activeTab === t ? 'var(--primary)' : 'var(--border)'}`,
                background: activeTab === t ? 'var(--primary-light)' : 'var(--surface)',
                color: activeTab === t ? 'var(--primary)' : 'var(--text-muted)',
              }}
            >{tabLabels[t]}</button>
          ))}
          <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 'auto' }}>{filtered.length} ta banner</span>
        </motion.div>

        <motion.div variants={item} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--surface-active)', border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-muted)' }}>
                <Image size={28} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 4px 0' }}>Bannerlar topilmadi</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Yangi banner qo'shish uchun yuqoridagi tugmani bosing</p>
            </div>
          ) : (
            filtered.map((banner) => (
              <div key={banner.id}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 20px', gap: 16, flexWrap: 'wrap', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--surface-active)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0 }}>{banner.order}</div>
                  <div style={{ width: 80, height: 56, borderRadius: 10, background: 'var(--surface-active)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                    {banner.imageUrl ? <img src={banner.imageUrl} alt={banner.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Image size={22} style={{ color: 'var(--text-muted)' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 2 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{banner.title}</h3>
                      <Badge variant={typeBadgeVariant[banner.type]} size="xs">{banner.type}</Badge>
                      {!banner.active && <Badge variant="default" size="xs">nofaol</Badge>}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{banner.subtitle}</p>
                    {(banner.startDate || banner.endDate) && (
                      <div style={{ display: 'flex', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
                        {banner.startDate && <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {formatDate(banner.startDate)}</span>}
                        {banner.endDate && <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {formatDate(banner.endDate)}</span>}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <button onClick={() => moveBanner(banner.id, 'up')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  ><ArrowUp size={15} /></button>
                  <button onClick={() => moveBanner(banner.id, 'down')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  ><ArrowDown size={15} /></button>
                  <button onClick={() => toggleActive(banner.id)}
                    style={{ width: 42, height: 22, borderRadius: 11, cursor: 'pointer', position: 'relative', transition: 'all 0.2s', border: 'none', padding: 0, background: banner.active ? 'var(--success)' : 'var(--border-strong)' }}
                  >
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: banner.active ? 23 : 3, transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
                  </button>
                  <button onClick={() => openEdit(banner)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', cursor: 'pointer' }}
                  ><Edit size={15} /></button>
                  <button onClick={() => setConfirmDelete(banner.id)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 10, border: '1px solid rgba(239,68,68,0.2)', background: 'var(--surface)', color: 'var(--danger)', cursor: 'pointer' }}
                  ><Trash2 size={15} /></button>
                </div>
              </div>
            ))
          )}
        </motion.div>
      </motion.div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} size="md">
        <div style={{ padding: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', margin: 0 }}>{editingBanner ? 'Banner tahrirlash' : 'Yangi banner'}</h2>
            <button onClick={() => setModalOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={16} /></button>
          </div>
          <div style={{ width: '100%', height: 140, borderRadius: 'var(--radius-sm)', background: 'var(--surface-active)', border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, overflow: 'hidden' }}>
            {form.imageUrl ? <img src={form.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}><Image size={28} style={{ marginBottom: 6, opacity: 0.5 }} /><p style={{ fontSize: 13, margin: 0 }}>Rasm URL kiriting</p></div>}
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            <button onClick={() => setImageInputMode('url')}
              style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: 8, fontFamily: 'inherit', cursor: 'pointer', background: imageInputMode === 'url' ? 'var(--primary-light)' : 'var(--surface-active)', color: imageInputMode === 'url' ? 'var(--primary)' : 'var(--text-muted)', border: imageInputMode === 'url' ? '1px solid rgba(249,115,22,0.2)' : '1px solid var(--border)' }}
            >URL</button>
            <button onClick={() => setImageInputMode('upload')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: 8, fontFamily: 'inherit', cursor: 'pointer', background: imageInputMode === 'upload' ? 'var(--primary-light)' : 'var(--surface-active)', color: imageInputMode === 'upload' ? 'var(--primary)' : 'var(--text-muted)', border: imageInputMode === 'upload' ? '1px solid rgba(249,115,22,0.2)' : '1px solid var(--border)' }}
            ><Upload size={12} /> Yuklash</button>
          </div>
          {imageInputMode === 'url' ? (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Rasm URL</label>
              <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg"
                style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
              />
            </div>
          ) : (
            <div style={{ width: '100%', padding: 24, borderRadius: 'var(--radius-sm)', border: '2px dashed var(--border-strong)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', background: 'var(--surface-active)', marginBottom: 12 }}>
              <Upload size={24} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Faylni bu yerga tashlang yoki bosing</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', opacity: 0.6, margin: 0 }}>JPG, PNG, WebP. Maks. 5MB</p>
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Sarlavha *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Banner sarlavhasi"
              style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Subtitle</label>
            <input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} placeholder="Qo'shimcha ma'lumot"
              style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Havola (Link)</label>
            <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="/menu yoki https://..."
              style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
            />
          </div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Turi</label>
              <div style={{ position: 'relative' }}>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none', cursor: 'pointer', appearance: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                >
                  <option value="slider">Slider</option>
                  <option value="popup">Popup</option>
                  <option value="promo">Promo</option>
                  <option value="landing">Landing</option>
                  <option value="mobile">Mobile</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Tartib raqami</label>
              <input type="number" min="1" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 1 })}
                style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--surface-active)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>
              {form.active ? <Eye size={16} style={{ color: 'var(--success)' }} /> : <EyeOff size={16} style={{ color: 'var(--text-muted)' }} />}
              Holat
            </div>
            <button onClick={() => setForm({ ...form, active: !form.active })}
              style={{ width: 42, height: 22, borderRadius: 11, cursor: 'pointer', position: 'relative', transition: 'all 0.2s', border: 'none', padding: 0, background: form.active ? 'var(--success)' : 'var(--border-strong)' }}
            >
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: form.active ? 23 : 3, transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
            </button>
          </div>
          <button onClick={() => setShowSchedule(!showSchedule)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: '6px 12px', borderRadius: 8, border: 'none', background: 'var(--primary-light)', marginBottom: 16, fontFamily: 'inherit' }}
          ><Calendar size={14} /> Jadval belgilash <ChevronDown size={12} style={{ transform: showSchedule ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} /></button>
          {showSchedule && (
            <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Boshlanish</label>
                <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Tugash</label>
                <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border-strong)', borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                />
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <Button variant="secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setModalOpen(false)}>Bekor qilish</Button>
            <Button variant="primary" style={{ flex: 1, justifyContent: 'center' }} onClick={saveBanner}>{editingBanner ? 'Saqlash' : "Qo'shish"}</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} size="sm">
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Trash2 size={24} style={{ color: 'var(--danger)' }} />
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px' }}>O'chirishni xohlaysizmi?</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 24px' }}>Bu amalni bekor qilib bo'lmaydi</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setConfirmDelete(null)}>Bekor qilish</Button>
            <Button variant="danger" style={{ flex: 1, justifyContent: 'center' }} onClick={() => deleteBanner(confirmDelete)}>O'chirish</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
