import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatPrice } from '../../utils/cn';

import {
  ChevronLeft, Plus, Edit, Trash2, Star, Flame, X, Check, Image,
  LayoutGrid, UtensilsCrossed, ShoppingBag, BarChart3, Settings, ToggleLeft, ToggleRight, Search
} from 'lucide-react';

const emptyProduct = {
  name: '', description: '', price: '', discountPrice: '', categoryId: '',
  image: '', isPopular: false, isNew: false, spiceLevel: 0, available: true,
};

export default function SellerMenu() {
  const navigate = useNavigate();
  const { foods, categories, addProduct, updateProduct, deleteProduct } = useStore();

  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredFoods = useMemo(() => {
    let result = foods;
    if (activeCategory !== 'all') result = result.filter(f => f.categoryId === Number(activeCategory));
    if (search) result = result.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [foods, activeCategory, search]);

  const hasUnavailable = foods.filter(f => f.available === false).length > 0;

  const getCategoryName = (id) => { const cat = categories.find(c => c.id === id); return cat ? cat.name : ''; };

  const openAddModal = () => { setEditingId(null); setForm(emptyProduct); setModalOpen(true); };
  const openEditModal = (food) => {
    setEditingId(food.id);
    setForm({
      name: food.name || '', description: food.description || '', price: String(food.price || ''),
      discountPrice: food.discountPrice ? String(food.discountPrice) : '',
      categoryId: String(food.categoryId || ''), image: food.image || '',
      isPopular: food.isPopular || false, isNew: food.isNew || false,
      spiceLevel: food.spiceLevel || 0, available: food.available !== false,
    });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm(emptyProduct); };
  const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.name.trim() || !form.price || !form.categoryId) return;
    const productData = {
      name: form.name.trim(), description: form.description.trim(), price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      categoryId: Number(form.categoryId),
      image: form.image.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      isPopular: form.isPopular, isNew: form.isNew, spiceLevel: form.spiceLevel,
      available: form.available, calories: 0, ingredients: [], restaurantId: 1,
    };
    if (editingId) updateProduct(editingId, productData);
    else addProduct(productData);
    closeModal();
  };

  const handleDelete = (id) => { deleteProduct(id); setDeleteConfirmId(null); };

  const toggleAvailability = (food) => {
    updateProduct(food.id, { ...food, available: food.available === false ? true : false });
  };

  const canSave = form.name.trim() && form.price && form.categoryId;

  const navItems = [
    { label: 'KDS', icon: LayoutGrid, path: '/seller' },
    { label: 'Buyurtmalar', icon: ShoppingBag, path: '/seller/orders' },
    { label: 'Menyu', icon: UtensilsCrossed, path: '/seller/menu' },
    { label: 'Statistika', icon: BarChart3, path: '/seller/analytics' },
    { label: 'Sozlamalar', icon: Settings, path: '/seller/settings' },
  ];

  return (
    <div className="min-h-full bg-bg pb-24">
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center hover:border-borderStrong transition-all">
              <ChevronLeft size={18} className="text-text" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-text">Menyu</h1>
              <p className="text-xs text-textMuted">{foods.length} ta mahsulot</p>
            </div>
          </div>
          <button onClick={openAddModal} className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl shadow-primary hover:brightness-110 active:scale-[0.97] transition-all text-sm">
            <Plus size={16} /> Qo'shish
          </button>
        </div>

        <div className="px-4 pb-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted pointer-events-none" />
            <input className="w-full pl-9 pr-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-text outline-none transition-all focus:border-primary/40" placeholder="Qidirish..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          <button onClick={() => setActiveCategory('all')}
            className={cn('px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all flex-shrink-0',
              activeCategory === 'all' ? 'bg-primary text-white border-primary' : 'bg-surface text-textMuted border-border'
            )}
          >Barchasi ({foods.length})</button>
          {categories.map(cat => {
            const count = foods.filter(f => f.categoryId === cat.id).length;
            return (
              <button key={cat.id} onClick={() => setActiveCategory(String(cat.id))}
                className={cn('px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all flex-shrink-0',
                  activeCategory === String(cat.id) ? 'bg-primary text-white border-primary' : 'bg-surface text-textMuted border-border'
                )}
              >{cat.icon} {cat.name} ({count})</button>
            );
          })}
        </div>
      </div>

      <div className="px-4 pt-3">
        {hasUnavailable && (
          <div className="flex items-center gap-2 px-3 py-2.5 bg-warning/5 border border-warning/20 rounded-xl mb-3">
            <Flame size={16} className="text-warning" />
            <span className="text-xs font-semibold text-warning">Nofaol mahsulotlar mavjud</span>
          </div>
        )}

        {filteredFoods.length === 0 ? (
          <div className="bg-surface border border-border rounded-2xl p-10 text-center">
            <Image size={48} className="mx-auto mb-3 text-borderStrong" />
            <p className="font-bold text-text">Mahsulotlar yo'q</p>
            <p className="text-sm text-textMuted mt-1">Yangi qo'shing</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFoods.map(food => (
              <motion.div key={food.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={cn('bg-surface border rounded-2xl overflow-hidden transition-all', food.available === false ? 'border-warning/30 opacity-70' : 'border-border')}
              >
                <div className="flex gap-3 p-3">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surfaceHover">
                    <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs text-textMuted">{getCategoryName(food.categoryId)}</span>
                      {food.isPopular && <Badge variant="primary" size="xs"><Star size={8} fill="currentColor" />Top</Badge>}
                      {food.isNew && <Badge variant="success" size="xs"><Flame size={8} />Yangi</Badge>}
                      {food.discountPrice && <Badge variant="warning" size="xs">-{Math.round(((food.price - food.discountPrice) / food.price) * 100)}%</Badge>}
                      {food.available === false && <Badge variant="danger" size="xs">Nofaol</Badge>}
                    </div>
                    <h3 className="font-bold text-text truncate">{food.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {food.discountPrice ? (
                        <>
                          <span className="font-extrabold text-primary tabular-nums">{formatPrice(food.discountPrice)} so'm</span>
                          <span className="text-xs text-textMuted line-through">{formatPrice(food.price)}</span>
                        </>
                      ) : (
                        <span className="font-extrabold text-primary tabular-nums">{formatPrice(food.price)} so'm</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-3 pb-3">
                  <button onClick={() => toggleAvailability(food)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border text-textMuted hover:text-text hover:border-borderStrong transition-all text-xs font-semibold flex-1"
                  >
                    {food.available === false ? <ToggleLeft size={14} /> : <ToggleRight size={14} />}
                    {food.available === false ? 'Faollashtirish' : 'Nofaol'}
                  </button>
                  <button onClick={() => openEditModal(food)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border text-textMuted hover:text-text hover:border-borderStrong transition-all text-xs font-semibold flex-1"
                  >
                    <Edit size={14} /> Tahrirlash
                  </button>
                  <button onClick={() => setDeleteConfirmId(food.id)}
                    className="flex items-center justify-center px-3 py-2 rounded-lg border border-danger/20 text-danger hover:bg-danger/5 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-surface rounded-t-3xl border border-border border-b-0 overflow-hidden shadow-lg max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="font-bold text-text">{editingId ? 'Tahrirlash' : 'Yangi mahsulot'}</h2>
                <button onClick={closeModal} className="w-8 h-8 rounded-xl bg-surfaceHover border border-border flex items-center justify-center"><X size={16} className="text-textMuted" /></button>
              </div>
              <div className="p-5 overflow-y-auto flex-1 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-textSecondary mb-1.5">Nomi *</label>
                  <input className="w-full px-3.5 py-2.5 bg-surfaceHover border border-border rounded-xl text-sm text-text outline-none focus:border-primary/40 transition-all" placeholder="Mahsulot nomi" value={form.name} onChange={(e) => updateField('name', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-textSecondary mb-1.5">Tavsif</label>
                  <textarea className="w-full px-3.5 py-2.5 bg-surfaceHover border border-border rounded-xl text-sm text-text outline-none focus:border-primary/40 transition-all resize-none min-h-[60px]" placeholder="Qisqacha tavsif" value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-textSecondary mb-1.5">Narxi (so'm) *</label>
                    <input className="w-full px-3.5 py-2.5 bg-surfaceHover border border-border rounded-xl text-sm text-text outline-none focus:border-primary/40 transition-all" type="number" placeholder="25000" value={form.price} onChange={(e) => updateField('price', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-textSecondary mb-1.5">Chegirma narxi</label>
                    <input className="w-full px-3.5 py-2.5 bg-surfaceHover border border-border rounded-xl text-sm text-text outline-none focus:border-primary/40 transition-all" type="number" placeholder="20000" value={form.discountPrice} onChange={(e) => updateField('discountPrice', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-textSecondary mb-1.5">Kategoriya *</label>
                  <select className="w-full px-3.5 py-2.5 bg-surfaceHover border border-border rounded-xl text-sm text-text outline-none focus:border-primary/40 transition-all appearance-none"
                    value={form.categoryId} onChange={(e) => updateField('categoryId', e.target.value)}
                  >
                    <option value="">Tanlang</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-textSecondary mb-1.5">Rasm URL</label>
                  <input className="w-full px-3.5 py-2.5 bg-surfaceHover border border-border rounded-xl text-sm text-text outline-none focus:border-primary/40 transition-all" placeholder="https://..." value={form.image} onChange={(e) => updateField('image', e.target.value)} />
                  {form.image && (
                    <div className="mt-2 w-full h-20 rounded-xl overflow-hidden border border-border">
                      <img src={form.image} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-textSecondary mb-1.5">Achchiqlik</label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3].map(level => (
                      <button key={level} onClick={() => updateField('spiceLevel', level)}
                        className={cn('flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all',
                          form.spiceLevel === level ? 'bg-primary/10 text-primary border-primary/30' : 'bg-surfaceHover text-textMuted border-border'
                        )}
                      >
                        {level === 0 ? 'None' : Array.from({ length: level }).map((_, i) => <Flame key={i} size={14} className="inline text-danger" fill="currentColor" />)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => updateField('isPopular', !form.isPopular)}
                    className={cn('flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-semibold transition-all',
                      form.isPopular ? 'bg-primary/10 text-primary border-primary/30' : 'bg-surfaceHover text-textMuted border-border'
                    )}
                  >
                    <Star size={14} fill={form.isPopular ? 'currentColor' : 'none'} /> Top
                  </button>
                  <button onClick={() => updateField('isNew', !form.isNew)}
                    className={cn('flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-semibold transition-all',
                      form.isNew ? 'bg-success/10 text-success border-success/30' : 'bg-surfaceHover text-textMuted border-border'
                    )}
                  >
                    <Flame size={14} fill={form.isNew ? 'currentColor' : 'none'} /> Yangi
                  </button>
                </div>
              </div>
              <div className="flex gap-3 px-5 py-4 border-t border-border">
                <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-border bg-surfaceHover text-textSecondary font-semibold text-sm hover:bg-surfaceActive transition-all">Bekor qilish</button>
                <button onClick={handleSave} disabled={!canSave}
                  className={cn('flex-1 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-primary hover:brightness-110 transition-all flex items-center justify-center gap-2',
                    !canSave && 'opacity-50 cursor-not-allowed'
                  )}
                ><Check size={16} /> {editingId ? 'Saqlash' : "Qo'shish"}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirmId(null)} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-surface border border-border rounded-2xl p-6 max-w-xs w-full text-center shadow-lg">
              <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-3"><Trash2 size={22} className="text-danger" /></div>
              <h3 className="font-bold text-text mb-1">Mahsulotni o'chirish?</h3>
              <p className="text-sm text-textMuted mb-4">Bu amalni qaytarib bo'lmaydi</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 rounded-xl border border-border bg-surfaceHover text-textSecondary font-semibold text-sm hover:bg-surfaceActive transition-all">Bekor</button>
                <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 py-2.5 rounded-xl bg-danger text-white font-semibold text-sm shadow-danger hover:brightness-110 transition-all">O'chirish</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
          {navItems.map((item) => {
            const active = item.path === '/seller/menu';
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full border-none bg-transparent cursor-pointer transition-all"
                style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }}
              >
                <item.icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                <span className="text-[10px] font-semibold" style={{ fontWeight: active ? 700 : 500 }}>{item.label}</span>
                {active && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}