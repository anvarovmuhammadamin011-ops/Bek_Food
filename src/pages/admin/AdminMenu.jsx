import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';
import {
  Plus, Edit, Trash2, Star, Flame, X, Check, Grid3x3,
  List, Image, AlertTriangle, ChevronDown, ChevronUp,
  FolderOpen, Package, GripVertical
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

const emptyProduct = {
  name: '', description: '', price: '', discountPrice: '', categoryId: '',
  images: [], videoUrl: '', calories: '', ingredients: '', allergenInfo: '',
  weight: '', prepTime: '', isPopular: false, isNew: false, isActive: true,
  variants: [], extras: [],
};

const emptyCategory = { name: '', icon: '' };

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

const inputBase = {
  width: '100%', padding: '10px 12px', fontSize: 14, background: 'var(--bg)',
  border: '1px solid var(--border)', borderRadius: 10, outline: 'none',
  color: 'var(--text)', transition: 'border-color .15s', boxSizing: 'border-box',
};

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 };

export default function AdminMenu() {
  const { foods, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [viewMode, setViewMode] = useState('grid');
  const [categorySectionOpen, setCategorySectionOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteType, setDeleteType] = useState('product');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [variantInput, setVariantInput] = useState({ name: '', price: '' });
  const [extraInput, setExtraInput] = useState({ name: '', price: '' });

  const filteredFoods = useMemo(() => {
    if (activeCategory === 'all') return foods;
    return foods.filter((f) => f.categoryId === Number(activeCategory));
  }, [foods, activeCategory]);

  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name || '';
  const getCategoryIcon = (id) => categories.find((c) => c.id === id)?.icon || '';
  const getProductCount = (catId) => foods.filter((f) => f.categoryId === catId).length;

  const openAddModal = () => {
    setEditingId(null);
    setForm({ ...emptyProduct, images: [], variants: [], extras: [] });
    setModalOpen(true);
  };

  const openEditModal = (food) => {
    setEditingId(food.id);
    setForm({
      name: food.name || '', description: food.description || '',
      price: String(food.price || ''), discountPrice: food.discountPrice ? String(food.discountPrice) : '',
      categoryId: String(food.categoryId || ''),
      images: food.images || (food.image ? [food.image] : []),
      videoUrl: food.videoUrl || '',
      calories: food.calories ? String(food.calories) : '',
      ingredients: Array.isArray(food.ingredients) ? food.ingredients.join(', ') : (food.ingredients || ''),
      allergenInfo: food.allergenInfo || '',
      weight: food.weight || '', prepTime: food.prepTime ? String(food.prepTime) : '',
      isPopular: food.isPopular || false, isNew: food.isNew || false, isActive: food.isActive !== false,
      variants: food.variants || [], extras: food.extras || [],
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm({ ...emptyProduct, images: [], variants: [], extras: [] });
    setImageUrlInput('');
    setVariantInput({ name: '', price: '' });
    setExtraInput({ name: '', price: '' });
  };

  const updateField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const addImageUrl = () => {
    if (imageUrlInput.trim() && !form.images.includes(imageUrlInput.trim())) {
      updateField('images', [...form.images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const removeImageUrl = (idx) => updateField('images', form.images.filter((_, i) => i !== idx));

  const addVariant = () => {
    if (variantInput.name.trim() && variantInput.price) {
      updateField('variants', [...form.variants, { name: variantInput.name.trim(), price: Number(variantInput.price) }]);
      setVariantInput({ name: '', price: '' });
    }
  };

  const removeVariant = (idx) => updateField('variants', form.variants.filter((_, i) => i !== idx));

  const addExtra = () => {
    if (extraInput.name.trim() && extraInput.price) {
      updateField('extras', [...form.extras, { name: extraInput.name.trim(), price: Number(extraInput.price) }]);
      setExtraInput({ name: '', price: '' });
    }
  };

  const removeExtra = (idx) => updateField('extras', form.extras.filter((_, i) => i !== idx));

  const handleSave = () => {
    if (!form.name.trim() || !form.price || !form.categoryId) return;
    const productData = {
      name: form.name.trim(), description: form.description.trim(), price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      categoryId: Number(form.categoryId),
      image: form.images[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      images: form.images.length > 0 ? form.images : ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'],
      videoUrl: form.videoUrl.trim() || undefined, calories: form.calories ? Number(form.calories) : 0,
      ingredients: form.ingredients ? form.ingredients.split(',').map((s) => s.trim()).filter(Boolean) : [],
      allergenInfo: form.allergenInfo.trim() || undefined, weight: form.weight.trim() || undefined,
      prepTime: form.prepTime ? Number(form.prepTime) : undefined,
      isPopular: form.isPopular, isNew: form.isNew, isActive: form.isActive,
      variants: form.variants, extras: form.extras, restaurantId: 1,
    };
    if (editingId) updateProduct(editingId, productData);
    else addProduct(productData);
    closeModal();
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      if (deleteType === 'product') deleteProduct(deleteConfirm);
      else {
        const idx = categories.findIndex((c) => c.id === deleteConfirm);
        if (idx > -1) categories.splice(idx, 1);
      }
    }
    setDeleteConfirm(null);
  };

  const openCategoryModal = (cat) => {
    if (cat) { setEditingCategoryId(cat.id); setCategoryForm({ name: cat.name, icon: cat.icon }); }
    else { setEditingCategoryId(null); setCategoryForm(emptyCategory); }
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name.trim() || !categoryForm.icon.trim()) return;
    if (editingCategoryId) {
      const idx = categories.findIndex((c) => c.id === editingCategoryId);
      if (idx > -1) categories[idx] = { ...categories[idx], name: categoryForm.name.trim(), icon: categoryForm.icon.trim() };
    } else categories.push({ id: Date.now(), name: categoryForm.name.trim(), icon: categoryForm.icon.trim() });
    setCategoryModalOpen(false); setEditingCategoryId(null); setCategoryForm(emptyCategory);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div variants={itemVariants} style={{ padding: '28px 0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Menyu boshqaruvi</h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '4px 0 0' }}>{foods.length} ta mahsulot</p>
          </div>
          <button onClick={openAddModal}
            style={{ padding: '10px 18px', borderRadius: 12, border: 'none', background: 'var(--primary)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px rgba(249,115,22,0.3)' }}>
            <Plus size={16} /> Yangi mahsulot
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card padding="md" style={{ marginBottom: 16 }}>
          <CardHeader>
            <div onClick={() => setCategorySectionOpen(!categorySectionOpen)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', cursor: 'pointer', border: 'none', background: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FolderOpen size={18} color="var(--primary)" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Kategoriyalar</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>{categories.length} ta kategoriya</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={(e) => { e.stopPropagation(); openCategoryModal(null); }}
                  style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Plus size={14} color="var(--text-muted)" />
                </button>
                {categorySectionOpen ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
              </div>
            </div>
          </CardHeader>
          <AnimatePresence>
            {categorySectionOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                <CardContent>
                  {categories.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: '20px 0' }}>Kategoriyalar yo'q</p>}
                  {categories.map((cat, idx) => (
                    <div key={cat.id}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: idx < categories.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                        <GripVertical size={14} color="var(--text-muted)" style={{ flexShrink: 0, cursor: 'grab', opacity: 0.5 }} />
                        <span style={{ fontSize: 16, width: 32, height: 32, borderRadius: 8, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{cat.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat.name}</p>
                          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>{getProductCount(cat.id)} ta mahsulot</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Badge variant="success" size="sm">Faol</Badge>
                        <button onClick={() => openCategoryModal(cat)}
                          style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Edit size={12} color="var(--text-muted)" />
                        </button>
                        <button onClick={() => { setDeleteType('category'); setDeleteConfirm(cat.id); }}
                          style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Trash2 size={12} color="var(--danger)" />
                        </button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} style={{ marginBottom: 16, overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 8, minWidth: 'max-content' }}>
          <button onClick={() => setActiveCategory('all')}
            style={{
              padding: '7px 16px', borderRadius: 999, border: 'none', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', background: activeCategory === 'all' ? 'var(--primary)' : 'var(--surface)',
              color: activeCategory === 'all' ? '#fff' : 'var(--text-muted)',
              boxShadow: activeCategory === 'all' ? '0 2px 8px rgba(249,115,22,0.25)' : '0 1px 2px rgba(0,0,0,0.04)',
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}>
            <Package size={13} /> Barchasi ({foods.length})
          </button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(String(cat.id))}
              style={{
                padding: '7px 16px', borderRadius: 999, border: 'none', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', background: activeCategory === String(cat.id) ? 'var(--primary)' : 'var(--surface)',
                color: activeCategory === String(cat.id) ? '#fff' : 'var(--text-muted)',
                boxShadow: activeCategory === String(cat.id) ? '0 2px 8px rgba(249,115,22,0.25)' : '0 1px 2px rgba(0,0,0,0.04)',
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}>
              {cat.icon} {cat.name} ({getProductCount(cat.id)})
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500, margin: 0 }}>{filteredFoods.length} ta mahsulot</p>
        <div style={{ display: 'flex', gap: 2, background: 'var(--surface)', borderRadius: 10, padding: 3, border: '1px solid var(--border)' }}>
          <button onClick={() => setViewMode('grid')}
            style={{ width: 32, height: 28, borderRadius: 8, border: 'none', cursor: 'pointer', background: viewMode === 'grid' ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Grid3x3 size={14} color={viewMode === 'grid' ? '#fff' : 'var(--text-muted)'} />
          </button>
          <button onClick={() => setViewMode('list')}
            style={{ width: 32, height: 28, borderRadius: 8, border: 'none', cursor: 'pointer', background: viewMode === 'list' ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <List size={14} color={viewMode === 'list' ? '#fff' : 'var(--text-muted)'} />
          </button>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {filteredFoods.length === 0 && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Image size={24} color="var(--text-muted)" />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500, margin: '0 0 16px' }}>Mahsulotlar topilmadi</p>
            <button onClick={openAddModal} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: 'var(--primary)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Plus size={16} /> Mahsulot qo'shish
            </button>
          </div>
        )}

        {viewMode === 'grid' && filteredFoods.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {filteredFoods.map((food) => (
              <motion.div key={food.id} variants={itemVariants}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ position: 'relative', width: '100%', paddingTop: '70%', overflow: 'hidden', background: 'var(--bg)' }}>
                  <img src={food.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />
                  <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4, zIndex: 2 }}>
                    {food.isPopular && <Badge variant="danger" size="sm"><Star size={9} /> Top</Badge>}
                    {food.isNew && <Badge variant="success" size="sm"><Flame size={9} /> Yangi</Badge>}
                    {food.discountPrice && <Badge variant="warning" size="sm">-{Math.round(((food.price - food.discountPrice) / food.price) * 100)}%</Badge>}
                  </div>
                  {food.isActive === false && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
                      <Badge variant="danger" size="sm">Faol emas</Badge>
                    </div>
                  )}
                </div>
                <div style={{ padding: '10px 12px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                    <span style={{ fontSize: 11 }}>{getCategoryIcon(food.categoryId)}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 500 }}>{getCategoryName(food.categoryId)}</span>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{food.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    {food.discountPrice ? (
                      <>
                        <span style={{ color: 'var(--primary)', fontSize: 14, fontWeight: 700 }}>{food.discountPrice.toLocaleString()}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: 11, textDecoration: 'line-through' }}>{food.price.toLocaleString()}</span>
                      </>
                    ) : (
                      <span style={{ color: 'var(--primary)', fontSize: 14, fontWeight: 700 }}>{food.price.toLocaleString()} so'm</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEditModal(food)}
                      style={{ flex: 1, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}>
                      <Edit size={11} /> Tahrirlash
                    </button>
                    <button onClick={() => { setDeleteType('product'); setDeleteConfirm(food.id); }}
                      style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--danger)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {viewMode === 'list' && filteredFoods.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 100px 80px 60px 70px', gap: 8, padding: '8px 12px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', alignItems: 'center' }}>
              <span></span><span>Mahsulot</span><span>Kategoriya</span><span style={{ textAlign: 'right' }}>Narx</span><span style={{ textAlign: 'center' }}>Holat</span><span style={{ textAlign: 'center' }}>Amallar</span>
            </div>
            {filteredFoods.map((food) => (
              <motion.div key={food.id} variants={itemVariants}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, display: 'grid', gridTemplateColumns: '44px 1fr 100px 80px 60px 70px', gap: 8, padding: '10px 12px', alignItems: 'center', fontSize: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
                  <img src={food.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {food.discountPrice && <span style={{ position: 'absolute', top: 2, right: 2, fontSize: 8, padding: '1px 4px', borderRadius: 4, background: 'rgba(245,158,11,0.9)', color: '#fff', fontWeight: 600 }}>-{Math.round(((food.price - food.discountPrice) / food.price) * 100)}%</span>}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ color: 'var(--text)', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>{food.name}</p>
                  <div style={{ display: 'flex', gap: 4, marginTop: 3 }}>
                    {food.isPopular && <Badge variant="danger" size="sm"><Star size={8} /> Top</Badge>}
                    {food.isNew && <Badge variant="success" size="sm"><Flame size={8} /> Yangi</Badge>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 13 }}>{getCategoryIcon(food.categoryId)}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{getCategoryName(food.categoryId)}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 12 }}>{(food.discountPrice || food.price).toLocaleString()}</span>
                  {food.discountPrice && <p style={{ color: 'var(--text-muted)', fontSize: 10, textDecoration: 'line-through', margin: '1px 0 0' }}>{food.price.toLocaleString()}</p>}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Badge variant={food.isActive !== false ? 'success' : 'danger'} size="sm">{food.isActive !== false ? 'Faol' : 'O\'chirilgan'}</Badge>
                </div>
                <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                  <button onClick={() => openEditModal(food)} style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Edit size={12} color="var(--text-muted)" />
                  </button>
                  <button onClick={() => { setDeleteType('product'); setDeleteConfirm(food.id); }} style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Trash2 size={12} color="var(--danger)" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <div onClick={closeModal} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{ position: 'relative', width: '100%', maxWidth: 480, maxHeight: '90vh', background: 'var(--surface)', borderRadius: '20px 20px 0 0', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -4px 24px rgba(0,0,0,0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{editingId ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}</h2>
                <button onClick={closeModal}
                  style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={16} color="var(--text-muted)" />
                </button>
              </div>
              <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div><label style={labelStyle}>Nomi <span style={{ color: 'var(--primary)' }}>*</span></label>
                    <input placeholder="Mahsulot nomi" value={form.name} onChange={(e) => updateField('name', e.target.value)} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} style={inputBase} /></div>
                  <div><label style={labelStyle}>Tavsif</label>
                    <textarea placeholder="Qisqa tavsif" value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={3} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} style={{ ...inputBase, minHeight: 80, resize: 'none' }} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div><label style={labelStyle}>Narx (so'm) <span style={{ color: 'var(--primary)' }}>*</span></label>
                      <input type="number" placeholder="25000" value={form.price} onChange={(e) => updateField('price', e.target.value)} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} style={inputBase} /></div>
                    <div><label style={labelStyle}>Chegirma narxi</label>
                      <input type="number" placeholder="20000" value={form.discountPrice} onChange={(e) => updateField('discountPrice', e.target.value)} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} style={inputBase} /></div>
                  </div>
                  <div><label style={labelStyle}>Kategoriya <span style={{ color: 'var(--primary)' }}>*</span></label>
                    <select value={form.categoryId} onChange={(e) => updateField('categoryId', e.target.value)} style={inputBase}>
                      <option value="">Kategoriya tanlang</option>
                      {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>))}
                    </select></div>
                  <div><label style={labelStyle}>Rasmlar</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input placeholder="https://image-url..." value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addImageUrl()} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} style={{ ...inputBase, flex: 1 }} />
                      <button onClick={addImageUrl} style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-light)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Plus size={16} color="var(--primary)" />
                      </button>
                    </div>
                    {form.images.length > 0 && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 10, overflowX: 'auto', paddingBottom: 4 }}>
                        {form.images.map((url, idx) => (
                          <div key={idx} style={{ position: 'relative', flexShrink: 0 }}>
                            <img src={url} alt="" onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }} style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover', border: '1px solid var(--border)' }} />
                            <button onClick={() => removeImageUrl(idx)} style={{ position: 'absolute', top: -4, right: -4, width: 20, height: 20, borderRadius: '50%', background: 'var(--danger)', border: '2px solid var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                              <X size={10} color="#fff" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div><label style={labelStyle}>Video URL (ixtiyoriy)</label>
                    <input placeholder="https://youtube.com/..." value={form.videoUrl} onChange={(e) => updateField('videoUrl', e.target.value)} style={inputBase} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    <div><label style={labelStyle}>Kaloriya</label>
                      <input type="number" placeholder="450" value={form.calories} onChange={(e) => updateField('calories', e.target.value)} style={inputBase} /></div>
                    <div><label style={labelStyle}>Vaqt (daq)</label>
                      <input type="number" placeholder="15" value={form.prepTime} onChange={(e) => updateField('prepTime', e.target.value)} style={inputBase} /></div>
                    <div><label style={labelStyle}>Og'irlik</label>
                      <input placeholder="200g" value={form.weight} onChange={(e) => updateField('weight', e.target.value)} style={inputBase} /></div>
                  </div>
                  <div><label style={labelStyle}>Masalliqlar (vergul bilan)</label>
                    <input placeholder="Go'sht, Piyoz, Tuz" value={form.ingredients} onChange={(e) => updateField('ingredients', e.target.value)} style={inputBase} /></div>
                  <div><label style={labelStyle}>Allergen ma'lumotlari</label>
                    <input placeholder="Sut, Gluten, Yong'oq..." value={form.allergenInfo} onChange={(e) => updateField('allergenInfo', e.target.value)} style={inputBase} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                      { key: 'isPopular', label: 'Mashhur', activeColor: 'var(--danger)', icon: Star },
                      { key: 'isNew', label: 'Yangi', activeColor: 'var(--success)', icon: Flame },
                    ].map((t) => {
                      const active = form[t.key];
                      const Icon = t.icon;
                      return (
                        <div key={t.key} onClick={() => updateField(t.key, !active)}
                          style={{ padding: 12, borderRadius: 10, border: `1.5px solid ${active ? t.activeColor : 'var(--border)'}`, background: active ? `${t.activeColor}10` : 'var(--bg)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: active ? t.activeColor : 'var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {active ? <Check size={14} color="#fff" /> : <Icon size={14} color="var(--text-muted)" />}
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: active ? 'var(--text)' : 'var(--text-muted)' }}>{t.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div onClick={() => updateField('isActive', !form.isActive)}
                    style={{ padding: 12, borderRadius: 10, border: `1.5px solid ${form.isActive ? 'var(--success)' : 'var(--border)'}`, background: form.isActive ? 'rgba(34,197,94,0.1)' : 'var(--bg)', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: form.isActive ? 'var(--success)' : 'var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {form.isActive ? <Check size={14} color="#fff" /> : <Package size={14} color="var(--text-muted)" />}
                    </div>
                    <div style={{ flex: 1 }}><span style={{ fontSize: 12, fontWeight: 600, color: form.isActive ? 'var(--text)' : 'var(--text-muted)' }}>Faol</span></div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: form.isActive ? 'var(--success)' : 'var(--text-muted)' }}>{form.isActive ? 'Yoqilgan' : 'O\'chirilgan'}</span>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                    <label style={labelStyle}>Variantlar (kichik/katta)</label>
                    {form.variants.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                        {form.variants.map((v, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>{v.name}</span>
                              <span style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 700 }}>{v.price.toLocaleString()} so'm</span>
                            </div>
                            <button onClick={() => removeVariant(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={14} color="var(--danger)" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input placeholder="Nomi (masalan: Kichik)" value={variantInput.name} onChange={(e) => setVariantInput((p) => ({ ...p, name: e.target.value }))} style={{ ...inputBase, flex: 1 }} />
                      <input type="number" placeholder="Narx" value={variantInput.price} onChange={(e) => setVariantInput((p) => ({ ...p, price: e.target.value }))} style={{ ...inputBase, width: 100 }} />
                      <button onClick={addVariant} style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-light)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Plus size={16} color="var(--primary)" />
                      </button>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                    <label style={labelStyle}>Qo'shimcha masalliqlar</label>
                    {form.extras.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                        {form.extras.map((e, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>{e.name}</span>
                              <span style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 700 }}>+{e.price.toLocaleString()} so'm</span>
                            </div>
                            <button onClick={() => removeExtra(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={14} color="var(--danger)" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input placeholder="Nomi" value={extraInput.name} onChange={(e) => setExtraInput((p) => ({ ...p, name: e.target.value }))} style={{ ...inputBase, flex: 1 }} />
                      <input type="number" placeholder="Narx" value={extraInput.price} onChange={(e) => setExtraInput((p) => ({ ...p, price: e.target.value }))} style={{ ...inputBase, width: 100 }} />
                      <button onClick={addExtra} style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-light)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Plus size={16} color="var(--primary)" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, flexShrink: 0 }}>
                <button onClick={closeModal} style={{ flex: 1, height: 44, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Bekor qilish</button>
                <button onClick={handleSave} disabled={!form.name.trim() || !form.price || !form.categoryId}
                  style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: (!form.name.trim() || !form.price || !form.categoryId) ? 'var(--border-strong)' : 'var(--primary)', color: (!form.name.trim() || !form.price || !form.categoryId) ? 'var(--text-muted)' : '#fff', fontSize: 14, fontWeight: 600, cursor: (!form.name.trim() || !form.price || !form.categoryId) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Check size={16} /> {editingId ? 'Saqlash' : "Qo'shish"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {categoryModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div onClick={() => setCategoryModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{ position: 'relative', width: '100%', maxWidth: 360, background: 'var(--surface)', borderRadius: 16, padding: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{editingCategoryId ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'}</h3>
                <button onClick={() => setCategoryModalOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={14} color="var(--text-muted)" />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div><label style={labelStyle}>Belgisi (emoji) <span style={{ color: 'var(--primary)' }}>*</span></label>
                  <input placeholder="Masalan: 🥩" value={categoryForm.icon} onChange={(e) => setCategoryForm((p) => ({ ...p, icon: e.target.value }))} style={{ ...inputBase, textAlign: 'center', fontSize: 24 }} /></div>
                <div><label style={labelStyle}>Nomi <span style={{ color: 'var(--primary)' }}>*</span></label>
                  <input placeholder="Kategoriya nomi" value={categoryForm.name} onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))} style={inputBase} /></div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button onClick={() => setCategoryModalOpen(false)} style={{ flex: 1, height: 44, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Bekor qilish</button>
                <button onClick={handleSaveCategory} disabled={!categoryForm.name.trim() || !categoryForm.icon.trim()}
                  style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: (!categoryForm.name.trim() || !categoryForm.icon.trim()) ? 'var(--border-strong)' : 'var(--primary)', color: (!categoryForm.name.trim() || !categoryForm.icon.trim()) ? 'var(--text-muted)' : '#fff', fontSize: 14, fontWeight: 600, cursor: (!categoryForm.name.trim() || !categoryForm.icon.trim()) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Check size={16} /> {editingCategoryId ? 'Saqlash' : "Qo'shish"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div onClick={() => setDeleteConfirm(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{ position: 'relative', width: '100%', maxWidth: 360, background: 'var(--surface)', borderRadius: 16, padding: 28, textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <AlertTriangle size={24} color="var(--danger)" />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: '0 0 8px' }}>{deleteType === 'product' ? 'Mahsulotni o\'chirish?' : 'Kategoriyani o\'chirish?'}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '0 0 20px', lineHeight: 1.5 }}>
                {deleteType === 'product' ? 'Bu mahsulot butunlay o\'chiriladi. Bu amalni qaytarib bo\'lmaydi.' : 'Bu kategoriya butunlay o\'chiriladi. Bu amalni qaytarib bo\'lmaydi.'}
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, height: 44, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Bekor qilish</button>
                <button onClick={handleDelete} style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: 'var(--danger)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Trash2 size={14} /> O'chirish
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
