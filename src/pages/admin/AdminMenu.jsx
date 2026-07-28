import { useState, useMemo } from 'react';
import useStore from '../../store/useStore';
import {
  Plus, Edit, Trash2, Star, Flame, X, Check, Grid3x3,
  List, Image, AlertTriangle, ChevronDown, ChevronUp,
  FolderOpen, GripVertical, Tag, CircleDollarSign,
  Utensils, Zap, Package, Palette
} from 'lucide-react';

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  discountPrice: '',
  categoryId: '',
  images: [],
  videoUrl: '',
  calories: '',
  ingredients: '',
  allergenInfo: '',
  weight: '',
  prepTime: '',
  isPopular: false,
  isNew: false,
  isActive: true,
  variants: [],
  extras: [],
};

const emptyCategory = { name: '', icon: '' };

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg)',
    padding: '0 0 100px 0',
  },
  container: {
    maxWidth: 800,
    margin: '0 auto',
    padding: '24px 16px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--text)',
    margin: 0,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 13,
    color: 'var(--text-muted)',
    margin: '4px 0 0 0',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    marginBottom: 16,
    boxShadow: 'var(--shadow-sm)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 16px',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--text)',
    margin: 0,
  },
  sectionSub: {
    fontSize: 12,
    color: 'var(--text-muted)',
    margin: '2px 0 0 0',
  },
  divider: {
    borderTop: '1px solid var(--border)',
    margin: '0 16px',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    gap: 10,
  },
  badge: (bg) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 8px',
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 600,
    background: bg,
    lineHeight: 1.3,
  }),
  iconBtn: (bg = 'var(--surface-active)') => ({
    width: 32,
    height: 32,
    borderRadius: 10,
    background: bg,
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.15s',
  }),
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    fontSize: 14,
    background: 'var(--surface-active)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    outline: 'none',
    color: 'var(--text)',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    fontSize: 14,
    background: 'var(--surface-active)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    outline: 'none',
    color: 'var(--text)',
    minHeight: 80,
    resize: 'none',
    boxSizing: 'border-box',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(8px)',
    zIndex: 1000,
  },
  modal: {
    position: 'relative',
    width: '100%',
    maxWidth: 480,
    maxHeight: '90vh',
    background: 'var(--surface)',
    borderRadius: '20px 20px 0 0',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-lg)',
    marginTop: 'auto',
  },
  modalCenter: {
    position: 'relative',
    width: '100%',
    maxWidth: 360,
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: 24,
    boxShadow: 'var(--shadow-lg)',
  },
  btnPrimary: (disabled) => ({
    flex: 1,
    height: 44,
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: disabled ? 'var(--border-strong)' : 'var(--primary)',
    color: disabled ? 'var(--text-muted)' : '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'all 0.15s',
  }),
  btnSecondary: {
    flex: 1,
    height: 44,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text-secondary)',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'all 0.15s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
  },
  gridItem: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden',
    transition: 'box-shadow 0.15s',
  },
  gridImage: {
    position: 'relative',
    width: '100%',
    paddingTop: '70%',
    overflow: 'hidden',
    background: 'var(--surface-active)',
  },
  gridImageImg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  gridBody: {
    padding: '10px 12px 12px',
  },
  chip: (active) => ({
    padding: '7px 14px',
    borderRadius: 100,
    border: 'none',
    fontSize: 13,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: 'all 0.15s',
    background: active ? 'var(--primary)' : 'var(--surface)',
    color: active ? '#fff' : 'var(--text-muted)',
    boxShadow: active ? '0 2px 8px rgba(249,115,22,0.25)' : '0 1px 2px rgba(0,0,0,0.04)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    flexShrink: 0,
  }),
  toggleWrap: (active, color) => ({
    padding: 12,
    borderRadius: 'var(--radius-sm)',
    border: `1.5px solid ${active ? color : 'var(--border)'}`,
    background: active ? `${color}10` : 'var(--surface-active)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    transition: 'all 0.15s',
  }),
  toggleDot: (active, color) => ({
    width: 28,
    height: 28,
    borderRadius: 8,
    background: active ? color : 'var(--border-strong)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.15s',
  }),
  tab: {
    borderTop: '1px solid var(--border)',
    margin: '0 16px',
  },
};

const inputFocus = (e) => { e.target.style.borderColor = 'var(--primary)'; };
const inputBlur = (e) => { e.target.style.borderColor = 'var(--border)'; };
const iconBtnHover = (e) => { e.currentTarget.style.background = 'var(--surface-active)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; };
const iconBtnLeave = (e) => { e.currentTarget.style.background = 'var(--surface-active)'; e.currentTarget.style.borderColor = 'var(--border)'; };

export default function AdminMenu() {
  const { foods, categories, addProduct, updateProduct, deleteProduct } = useStore();

  const [viewMode, setViewMode] = useState('grid');
  const [categorySectionOpen, setCategorySectionOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteType, setDeleteType] = useState('product');
  const [deleteTargetId, setDeleteTargetId] = useState(null);
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

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : '';
  };

  const getCategoryIcon = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.icon : '';
  };

  const getProductCount = (catId) => foods.filter((f) => f.categoryId === catId).length;

  const openAddModal = () => {
    setEditingId(null);
    setForm({ ...emptyProduct, images: [], variants: [], extras: [] });
    setModalOpen(true);
  };

  const openEditModal = (food) => {
    setEditingId(food.id);
    setForm({
      name: food.name || '',
      description: food.description || '',
      price: String(food.price || ''),
      discountPrice: food.discountPrice ? String(food.discountPrice) : '',
      categoryId: String(food.categoryId || ''),
      images: food.images || (food.image ? [food.image] : []),
      videoUrl: food.videoUrl || '',
      calories: food.calories ? String(food.calories) : '',
      ingredients: Array.isArray(food.ingredients) ? food.ingredients.join(', ') : (food.ingredients || ''),
      allergenInfo: food.allergenInfo || '',
      weight: food.weight || '',
      prepTime: food.prepTime ? String(food.prepTime) : '',
      isPopular: food.isPopular || false,
      isNew: food.isNew || false,
      isActive: food.isActive !== false,
      variants: food.variants || [],
      extras: food.extras || [],
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

  const removeImageUrl = (idx) => {
    updateField('images', form.images.filter((_, i) => i !== idx));
  };

  const addVariant = () => {
    if (variantInput.name.trim() && variantInput.price) {
      updateField('variants', [...form.variants, { name: variantInput.name.trim(), price: Number(variantInput.price) }]);
      setVariantInput({ name: '', price: '' });
    }
  };

  const removeVariant = (idx) => {
    updateField('variants', form.variants.filter((_, i) => i !== idx));
  };

  const addExtra = () => {
    if (extraInput.name.trim() && extraInput.price) {
      updateField('extras', [...form.extras, { name: extraInput.name.trim(), price: Number(extraInput.price) }]);
      setExtraInput({ name: '', price: '' });
    }
  };

  const removeExtra = (idx) => {
    updateField('extras', form.extras.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price || !form.categoryId) return;
    const productData = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      categoryId: Number(form.categoryId),
      image: form.images[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      images: form.images.length > 0 ? form.images : ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'],
      videoUrl: form.videoUrl.trim() || undefined,
      calories: form.calories ? Number(form.calories) : 0,
      ingredients: form.ingredients ? form.ingredients.split(',').map((s) => s.trim()).filter(Boolean) : [],
      allergenInfo: form.allergenInfo.trim() || undefined,
      weight: form.weight.trim() || undefined,
      prepTime: form.prepTime ? Number(form.prepTime) : undefined,
      isPopular: form.isPopular,
      isNew: form.isNew,
      isActive: form.isActive,
      variants: form.variants,
      extras: form.extras,
      restaurantId: 1,
    };
    if (editingId) {
      updateProduct(editingId, productData);
    } else {
      addProduct(productData);
    }
    closeModal();
  };

  const handleDeleteProduct = (id) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
    setDeleteTargetId(null);
  };

  const handleDeleteCategory = (id) => {
    const count = getProductCount(id);
    if (count > 0) {
      alert(`"${getCategoryName(id)}" kategoriyasida ${count} ta mahsulot mavjud. Avval mahsulotlarni o'chiring.`);
      setDeleteConfirmId(null);
      setDeleteTargetId(null);
      return;
    }
    const idx = categories.findIndex((c) => c.id === id);
    if (idx > -1) categories.splice(idx, 1);
    setDeleteConfirmId(null);
    setDeleteTargetId(null);
  };

  const openAddCategory = () => {
    setEditingCategoryId(null);
    setCategoryForm(emptyCategory);
    setCategoryModalOpen(true);
  };

  const openEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setCategoryForm({ name: cat.name, icon: cat.icon });
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name.trim() || !categoryForm.icon.trim()) return;
    if (editingCategoryId) {
      const idx = categories.findIndex((c) => c.id === editingCategoryId);
      if (idx > -1) {
        categories[idx] = { ...categories[idx], name: categoryForm.name.trim(), icon: categoryForm.icon.trim() };
      }
    } else {
      categories.push({ id: Date.now(), name: categoryForm.name.trim(), icon: categoryForm.icon.trim() });
    }
    setCategoryModalOpen(false);
    setEditingCategoryId(null);
    setCategoryForm(emptyCategory);
  };

  const confirmDeleteProduct = (id) => {
    setDeleteType('product');
    setDeleteTargetId(id);
    setDeleteConfirmId(id);
  };

  const confirmDeleteCategory = (id) => {
    setDeleteType('category');
    setDeleteTargetId(id);
    setDeleteConfirmId(id);
  };

  const doDelete = () => {
    if (deleteType === 'product') handleDeleteProduct(deleteTargetId);
    else handleDeleteCategory(deleteTargetId);
  };

  return (
    <div style={s.page}>
      <div style={s.container}>

        <div style={s.header}>
          <div>
            <h1 style={s.title}>Menu management</h1>
            <p style={s.subtitle}>{foods.length} products</p>
          </div>
          <button
            onClick={openAddModal}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'var(--primary)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 8px rgba(249,115,22,0.3)',
              flexShrink: 0,
              transition: 'all 0.15s',
            }}
          >
            <Plus size={16} /> Add product
          </button>
        </div>

        <div style={s.card}>
          <button
            onClick={() => setCategorySectionOpen(!categorySectionOpen)}
            style={{
              width: '100%',
              padding: '16px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FolderOpen size={18} color="var(--primary)" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={s.sectionTitle}>Categories</p>
                <p style={s.sectionSub}>{categories.length} categories</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                onClick={(e) => { e.stopPropagation(); openAddCategory(); }}
                style={{
                  ...s.iconBtn(),
                  width: 30,
                  height: 30,
                }}
              >
                <Plus size={14} color="var(--text-muted)" />
              </div>
              {categorySectionOpen ? (
                <ChevronUp size={16} color="var(--text-muted)" />
              ) : (
                <ChevronDown size={16} color="var(--text-muted)" />
              )}
            </div>
          </button>

          {categorySectionOpen && (
            <div>
              <div style={s.divider} />
              {categories.map((cat, idx) => (
                <div key={cat.id}>
                  <div style={{
                    ...s.listItem,
                    borderBottom: idx < categories.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                      <GripVertical size={14} color="var(--text-muted)" style={{ flexShrink: 0, cursor: 'grab' }} />
                      <span style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: 'var(--surface-active)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        flexShrink: 0,
                      }}>{cat.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {cat.name}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                          {getProductCount(cat.id)} products
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={s.badge('rgba(34,197,94,0.1)')}>Active</span>
                      <button onClick={() => openEditCategory(cat)} style={s.iconBtn()}>
                        <Edit size={12} color="var(--text-muted)" />
                      </button>
                      <button onClick={() => confirmDeleteCategory(cat.id)} style={s.iconBtn()}>
                        <Trash2 size={12} color="var(--danger)" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, padding: '20px 16px' }}>
                  No categories yet
                </p>
              )}
            </div>
          )}
        </div>

        <div style={{
          marginBottom: 16,
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}>
          <div style={{ display: 'flex', gap: 8, paddingBottom: 4, minWidth: 'max-content' }}>
            <button
              onClick={() => setActiveCategory('all')}
              style={s.chip(activeCategory === 'all')}
            >
              <Package size={13} /> All ({foods.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(String(cat.id))}
                style={s.chip(activeCategory === String(cat.id))}
              >
                {cat.icon} {cat.name} ({getProductCount(cat.id)})
              </button>
            ))}
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500, margin: 0 }}>
            {filteredFoods.length} products
          </p>
          <div style={{
            display: 'flex',
            gap: 2,
            background: 'var(--surface)',
            borderRadius: 10,
            padding: 3,
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                width: 32,
                height: 28,
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: viewMode === 'grid' ? 'var(--primary)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >
              <Grid3x3 size={14} color={viewMode === 'grid' ? '#fff' : 'var(--text-muted)'} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                width: 32,
                height: 28,
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: viewMode === 'list' ? 'var(--primary)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >
              <List size={14} color={viewMode === 'list' ? '#fff' : 'var(--text-muted)'} />
            </button>
          </div>
        </div>

        {filteredFoods.length === 0 && (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '48px 24px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--surface-active)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <Image size={24} color="var(--text-muted)" />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500, margin: '0 0 16px' }}>
              No products found
            </p>
            <button
              onClick={openAddModal}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'var(--primary)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Plus size={16} /> Add product
            </button>
          </div>
        )}

        {viewMode === 'grid' && filteredFoods.length > 0 && (
          <div style={s.grid}>
            {filteredFoods.map((food) => (
              <div key={food.id} style={s.gridItem}>
                <div style={s.gridImage}>
                  <img src={food.image} alt={food.name} style={s.gridImageImg} />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)',
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    display: 'flex',
                    gap: 4,
                    zIndex: 2,
                  }}>
                    {food.isPopular && (
                      <span style={s.badge('rgba(239,68,68,0.9)')}>
                        <Star size={9} fill="currentColor" color="#fff" /> Top
                      </span>
                    )}
                    {food.isNew && (
                      <span style={s.badge('rgba(34,197,94,0.9)')}>
                        <Flame size={9} color="#fff" /> New
                      </span>
                    )}
                    {food.discountPrice && (
                      <span style={s.badge('rgba(245,158,11,0.9)')}>
                        -{Math.round(((food.price - food.discountPrice) / food.price) * 100)}%
                      </span>
                    )}
                  </div>
                  {food.isActive === false && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 3,
                    }}>
                      <span style={s.badge('rgba(239,68,68,0.9)')}>Inactive</span>
                    </div>
                  )}
                </div>
                <div style={s.gridBody}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                    <span style={{ fontSize: 11 }}>{getCategoryIcon(food.categoryId)}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 500 }}>
                      {getCategoryName(food.categoryId)}
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--text)',
                    margin: '0 0 6px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.3,
                  }}>
                    {food.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    {food.discountPrice ? (
                      <>
                        <span style={{
                          color: 'var(--primary)',
                          fontSize: 14,
                          fontWeight: 700,
                          fontVariantNumeric: 'tabular-nums',
                        }}>{food.discountPrice.toLocaleString()}</span>
                        <span style={{
                          color: 'var(--text-muted)',
                          fontSize: 11,
                          textDecoration: 'line-through',
                          fontVariantNumeric: 'tabular-nums',
                        }}>{food.price.toLocaleString()}</span>
                      </>
                    ) : (
                      <span style={{
                        color: 'var(--primary)',
                        fontSize: 14,
                        fontWeight: 700,
                        fontVariantNumeric: 'tabular-nums',
                      }}>{food.price.toLocaleString()} so'm</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => openEditModal(food)}
                      style={{
                        flex: 1,
                        height: 32,
                        borderRadius: 8,
                        border: '1px solid var(--border)',
                        background: 'var(--surface-active)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        fontSize: 11,
                        fontWeight: 600,
                        transition: 'all 0.15s',
                      }}
                    >
                      <Edit size={11} /> Edit
                    </button>
                    <button
                      onClick={() => confirmDeleteProduct(food.id)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: '1px solid var(--border)',
                        background: 'var(--surface-active)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--danger)',
                        flexShrink: 0,
                        transition: 'all 0.15s',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'list' && filteredFoods.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '44px 1fr 100px 80px 60px 70px',
              gap: 8,
              padding: '8px 12px',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-muted)',
              alignItems: 'center',
            }}>
              <span></span>
              <span>Product</span>
              <span>Category</span>
              <span style={{ textAlign: 'right' }}>Price</span>
              <span style={{ textAlign: 'center' }}>Status</span>
              <span style={{ textAlign: 'center' }}>Actions</span>
            </div>
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'grid',
                  gridTemplateColumns: '44px 1fr 100px 80px 60px 70px',
                  gap: 8,
                  padding: '10px 12px',
                  alignItems: 'center',
                  fontSize: 12,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  flexShrink: 0,
                  position: 'relative',
                }}>
                  <img src={food.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {food.discountPrice && (
                    <span style={{
                      ...s.badge('rgba(245,158,11,0.9)'),
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      fontSize: 8,
                      padding: '1px 4px',
                      borderRadius: 4,
                    }}>
                      -{Math.round(((food.price - food.discountPrice) / food.price) * 100)}%
                    </span>
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    color: 'var(--text)',
                    fontWeight: 600,
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: 12,
                  }}>
                    {food.name}
                  </p>
                  <div style={{ display: 'flex', gap: 4, marginTop: 3 }}>
                    {food.isPopular && (
                      <span style={s.badge('rgba(239,68,68,0.1)')}>
                        <Star size={8} fill="var(--danger)" color="var(--danger)" /> Top
                      </span>
                    )}
                    {food.isNew && (
                      <span style={s.badge('rgba(34,197,94,0.1)')}>
                        <Flame size={8} color="var(--success)" /> New
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 13 }}>{getCategoryIcon(food.categoryId)}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{getCategoryName(food.categoryId)}</span>
                </div>
                <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  <span style={{
                    color: 'var(--primary)',
                    fontWeight: 700,
                    fontSize: 12,
                  }}>
                    {(food.discountPrice || food.price).toLocaleString()}
                  </span>
                  {food.discountPrice && (
                    <p style={{
                      color: 'var(--text-muted)',
                      fontSize: 10,
                      textDecoration: 'line-through',
                      margin: '1px 0 0',
                    }}>
                      {food.price.toLocaleString()}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: 'center' }}>
                  {food.isActive !== false ? (
                    <span style={s.badge('rgba(34,197,94,0.1)')}>Active</span>
                  ) : (
                    <span style={s.badge('rgba(239,68,68,0.1)')}>Off</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                  <button onClick={() => openEditModal(food)} style={s.iconBtn()}>
                    <Edit size={12} color="var(--text-muted)" />
                  </button>
                  <button onClick={() => confirmDeleteProduct(food.id)} style={s.iconBtn()}>
                    <Trash2 size={12} color="var(--danger)" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}>
          <div onClick={closeModal} style={s.overlay} />
          <div style={{
            ...s.modal,
            animation: 'slideUp 0.25s ease',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
            }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                {editingId ? 'Edit product' : 'New product'}
              </h2>
              <button onClick={closeModal} style={s.iconBtn()}>
                <X size={16} color="var(--text-muted)" />
              </button>
            </div>

            <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={s.label}>Name <span style={{ color: 'var(--primary)' }}>*</span></label>
                  <input
                    placeholder="Product name"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                    style={s.input}
                  />
                </div>

                <div>
                  <label style={s.label}>Description</label>
                  <textarea
                    placeholder="Brief description"
                    value={form.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                    style={s.textarea}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={s.label}>Price (so'm) <span style={{ color: 'var(--primary)' }}>*</span></label>
                    <input
                      type="number"
                      placeholder="25000"
                      value={form.price}
                      onChange={(e) => updateField('price', e.target.value)}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                      style={s.input}
                    />
                  </div>
                  <div>
                    <label style={s.label}>Discount price</label>
                    <input
                      type="number"
                      placeholder="20000"
                      value={form.discountPrice}
                      onChange={(e) => updateField('discountPrice', e.target.value)}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                      style={s.input}
                    />
                  </div>
                </div>

                <div>
                  <label style={s.label}>Category <span style={{ color: 'var(--primary)' }}>*</span></label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => updateField('categoryId', e.target.value)}
                    style={s.input}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={s.label}>Images</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      placeholder="https://image-url..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addImageUrl()}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                      style={{ ...s.input, flex: 1 }}
                    />
                    <button
                      onClick={addImageUrl}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--primary-light)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      <Plus size={16} color="var(--primary)" />
                    </button>
                  </div>
                  {form.images.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 10, overflowX: 'auto', paddingBottom: 4 }}>
                      {form.images.map((url, idx) => (
                        <div key={idx} style={{ position: 'relative', flexShrink: 0 }}>
                          <img
                            src={url}
                            alt=""
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }}
                            style={{
                              width: 72,
                              height: 72,
                              borderRadius: 'var(--radius-sm)',
                              objectFit: 'cover',
                              border: '1px solid var(--border)',
                            }}
                          />
                          <button
                            onClick={() => removeImageUrl(idx)}
                            style={{
                              position: 'absolute',
                              top: -4,
                              right: -4,
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              background: 'var(--danger)',
                              border: '2px solid var(--surface)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <X size={10} color="#fff" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label style={s.label}>Video URL (optional)</label>
                  <input
                    placeholder="https://youtube.com/..."
                    value={form.videoUrl}
                    onChange={(e) => updateField('videoUrl', e.target.value)}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                    style={s.input}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={s.label}>Calories</label>
                    <input
                      type="number"
                      placeholder="450"
                      value={form.calories}
                      onChange={(e) => updateField('calories', e.target.value)}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                      style={s.input}
                    />
                  </div>
                  <div>
                    <label style={s.label}>Time (min)</label>
                    <input
                      type="number"
                      placeholder="15"
                      value={form.prepTime}
                      onChange={(e) => updateField('prepTime', e.target.value)}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                      style={s.input}
                    />
                  </div>
                  <div>
                    <label style={s.label}>Weight</label>
                    <input
                      placeholder="200g"
                      value={form.weight}
                      onChange={(e) => updateField('weight', e.target.value)}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                      style={s.input}
                    />
                  </div>
                </div>

                <div>
                  <label style={s.label}>Ingredients (comma separated)</label>
                  <input
                    placeholder="Meat, Onion, Salt, Spices"
                    value={form.ingredients}
                    onChange={(e) => updateField('ingredients', e.target.value)}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                    style={s.input}
                  />
                </div>

                <div>
                  <label style={s.label}>Allergen info</label>
                  <input
                    placeholder="Milk, Gluten, Nuts..."
                    value={form.allergenInfo}
                    onChange={(e) => updateField('allergenInfo', e.target.value)}
                    onFocus={inputFocus}
                    onBlur={inputBlur}
                    style={s.input}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div
                    onClick={() => updateField('isPopular', !form.isPopular)}
                    style={s.toggleWrap(form.isPopular, 'var(--danger)')}
                  >
                    <div style={s.toggleDot(form.isPopular, 'var(--danger)')}>
                      {form.isPopular ? <Check size={14} color="#fff" /> : <Star size={14} color="var(--text-muted)" />}
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: form.isPopular ? 'var(--text)' : 'var(--text-muted)', margin: 0 }}>
                        Popular
                      </p>
                    </div>
                  </div>
                  <div
                    onClick={() => updateField('isNew', !form.isNew)}
                    style={s.toggleWrap(form.isNew, 'var(--success)')}
                  >
                    <div style={s.toggleDot(form.isNew, 'var(--success)')}>
                      {form.isNew ? <Check size={14} color="#fff" /> : <Flame size={14} color="var(--text-muted)" />}
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: form.isNew ? 'var(--text)' : 'var(--text-muted)', margin: 0 }}>
                        New
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => updateField('isActive', !form.isActive)}
                  style={s.toggleWrap(form.isActive, 'var(--success)')}
                >
                  <div style={s.toggleDot(form.isActive, 'var(--success)')}>
                    {form.isActive ? <Check size={14} color="#fff" /> : <Zap size={14} color="var(--text-muted)" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: form.isActive ? 'var(--text)' : 'var(--text-muted)', margin: 0 }}>
                      Active
                    </p>
                  </div>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: form.isActive ? 'var(--success)' : 'var(--text-muted)',
                  }}>
                    {form.isActive ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <label style={s.label}>Variants (small/large)</label>
                  {form.variants.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                      {form.variants.map((v, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          background: 'var(--surface-active)',
                          borderRadius: 8,
                          border: '1px solid var(--border)',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>{v.name}</span>
                            <span style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 700 }}>{v.price.toLocaleString()} so'm</span>
                          </div>
                          <button onClick={() => removeVariant(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                            <X size={14} color="var(--danger)" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      placeholder="Name (e.g. Small)"
                      value={variantInput.name}
                      onChange={(e) => setVariantInput((p) => ({ ...p, name: e.target.value }))}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                      style={{ ...s.input, flex: 1 }}
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={variantInput.price}
                      onChange={(e) => setVariantInput((p) => ({ ...p, price: e.target.value }))}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                      style={{ ...s.input, width: 100 }}
                    />
                    <button
                      onClick={addVariant}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--primary-light)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      <Plus size={16} color="var(--primary)" />
                    </button>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <label style={s.label}>Extra ingredients</label>
                  {form.extras.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                      {form.extras.map((e, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          background: 'var(--surface-active)',
                          borderRadius: 8,
                          border: '1px solid var(--border)',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>{e.name}</span>
                            <span style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 700 }}>+{e.price.toLocaleString()} so'm</span>
                          </div>
                          <button onClick={() => removeExtra(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                            <X size={14} color="var(--danger)" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      placeholder="Name (e.g. Cheese)"
                      value={extraInput.name}
                      onChange={(e) => setExtraInput((p) => ({ ...p, name: e.target.value }))}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                      style={{ ...s.input, flex: 1 }}
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={extraInput.price}
                      onChange={(e) => setExtraInput((p) => ({ ...p, price: e.target.value }))}
                      onFocus={inputFocus}
                      onBlur={inputBlur}
                      style={{ ...s.input, width: 100 }}
                    />
                    <button
                      onClick={addExtra}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--primary-light)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    >
                      <Plus size={16} color="var(--primary)" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: 10,
            }}>
              <button onClick={closeModal} style={s.btnSecondary}>
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim() || !form.price || !form.categoryId}
                style={s.btnPrimary(!form.name.trim() || !form.price || !form.categoryId)}
              >
                <Check size={16} /> {editingId ? 'Save' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {categoryModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}>
          <div onClick={() => setCategoryModalOpen(false)} style={s.overlay} />
          <div style={s.modalCenter}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                {editingCategoryId ? 'Edit category' : 'New category'}
              </h3>
              <button onClick={() => setCategoryModalOpen(false)} style={s.iconBtn()}>
                <X size={14} color="var(--text-muted)" />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={s.label}>Icon (emoji) <span style={{ color: 'var(--primary)' }}>*</span></label>
                <input
                  placeholder="e.g. meat"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm((p) => ({ ...p, icon: e.target.value }))}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  style={{ ...s.input, textAlign: 'center', fontSize: 24 }}
                />
              </div>
              <div>
                <label style={s.label}>Name <span style={{ color: 'var(--primary)' }}>*</span></label>
                <input
                  placeholder="Category name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                  style={s.input}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setCategoryModalOpen(false)} style={s.btnSecondary}>
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                disabled={!categoryForm.name.trim() || !categoryForm.icon.trim()}
                style={s.btnPrimary(!categoryForm.name.trim() || !categoryForm.icon.trim())}
              >
                <Check size={16} /> {editingCategoryId ? 'Save' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}>
          <div onClick={() => { setDeleteConfirmId(null); setDeleteTargetId(null); }} style={s.overlay} />
          <div style={s.modalCenter}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(239,68,68,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <AlertTriangle size={24} color="var(--danger)" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', margin: '0 0 8px', textAlign: 'center' }}>
              {deleteType === 'product' ? 'Delete product?' : 'Delete category?'}
            </h3>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: 13,
              margin: '0 0 20px',
              lineHeight: 1.5,
              textAlign: 'center',
            }}>
              {deleteType === 'product'
                ? 'This product will be permanently deleted. This action cannot be undone.'
                : 'This category will be permanently deleted. This action cannot be undone.'}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { setDeleteConfirmId(null); setDeleteTargetId(null); }}
                style={s.btnSecondary}
              >
                Cancel
              </button>
              <button onClick={doDelete} style={{
                ...s.btnPrimary(false),
                background: 'var(--danger)',
              }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
