import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import {
  ChevronLeft, Plus, Edit, Trash2, Star, Flame, X, Check,
  Grid, List, GripVertical, Image, Clock, AlertTriangle
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

function Label({ children, required }) {
  return (
    <label style={{ display: 'block', color: '#888', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
      {children}{required && <span style={{ color: '#e51e1e', marginLeft: 2 }}>*</span>}
    </label>
  );
}

function Toggle({ active, onClick, color = '#e51e1e', children }) {
  return (
    <button
      onClick={onClick}
      className="card-interactive"
      style={{
        padding: '12px',
        borderRadius: 12,
        border: `1.5px solid ${active ? color : '#222'}`,
        background: active ? `${color}14` : '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: active ? color : '#2a2a2a',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {active ? <Check size={14} color="#fff" /> : children}
      </div>
      <span style={{ color: active ? '#fff' : '#888', fontSize: 12, fontWeight: 600 }}>{active ? 'Yoqilgan' : 'O\'chirilgan'}</span>
    </button>
  );
}

export default function AdminMenu() {
  const navigate = useNavigate();
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

  const inputStyle = { fontSize: 14, background: '#1a1a1a', borderColor: '#222' };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in" style={{ marginBottom: 20 }}>
          <div className="flex items-center" style={{ gap: 12 }}>
            <button
              className="card-interactive"
              onClick={() => navigate(-1)}
              style={{
                width: 40, height: 40, borderRadius: 12, background: '#141414',
                border: '1px solid #222', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s',
              }}
            >
              <ChevronLeft size={20} color="#aaa" />
            </button>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
                Menyu boshqaruvi
              </h1>
              <p style={{ color: '#666', fontSize: 12, margin: '2px 0 0 0' }}>{foods.length} ta mahsulot</p>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={openAddModal} style={{
            borderRadius: 10, padding: '8px 14px', minHeight: 36, fontSize: 13,
            fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Plus size={16} />
            <span style={{ display: 'inline' }}>Yangi mahsulot</span>
          </button>
        </div>

        {/* Category Management Section */}
        <div className="card animate-fade-in" style={{ marginBottom: 16, overflow: 'hidden' }}>
          <button
            onClick={() => setCategorySectionOpen(!categorySectionOpen)}
            className="card-interactive flex items-center justify-between"
            style={{
              width: '100%', padding: '14px 16px', background: 'transparent', border: 'none',
              cursor: 'pointer', color: '#fff',
            }}
          >
            <div className="flex items-center" style={{ gap: 10 }}>
              <span style={{ fontSize: 18 }}>📂</span>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Kategoriyalar</p>
                <p style={{ fontSize: 11, color: '#666', margin: '2px 0 0 0' }}>{categories.length} ta kategoriya</p>
              </div>
            </div>
            <div className="flex items-center" style={{ gap: 8 }}>
              <button
                onClick={(e) => { e.stopPropagation(); openAddCategory(); }}
                className="card-interactive"
                style={{
                  width: 30, height: 30, borderRadius: 8, background: 'rgba(229,30,30,0.1)',
                  border: '1px solid #331111', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer',
                }}
              >
                <Plus size={14} color="#e51e1e" />
              </button>
              <ChevronLeft
                size={16} color="#666"
                style={{
                  transform: categorySectionOpen ? 'rotate(90deg)' : 'rotate(-90deg)',
                  transition: 'transform 0.2s',
                }}
              />
            </div>
          </button>

          {categorySectionOpen && (
            <div style={{ padding: '0 16px 14px' }}>
              <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: 12 }}>
                {categories.map((cat, idx) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between stagger"
                    style={{
                      padding: '10px 0',
                      borderBottom: idx < categories.length - 1 ? '1px solid #1a1a1a' : 'none',
                    }}
                  >
                    <div className="flex items-center" style={{ gap: 10, flex: 1 }}>
                      <GripVertical size={16} color="#444" style={{ flexShrink: 0, cursor: 'grab' }} />
                      <span style={{ fontSize: 22, flexShrink: 0 }}>{cat.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>{cat.name}</p>
                        <p style={{ fontSize: 11, color: '#666', margin: '2px 0 0 0' }}>{getProductCount(cat.id)} ta mahsulot</p>
                      </div>
                    </div>
                    <div className="flex items-center" style={{ gap: 6 }}>
                      <span className="badge badge-green" style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6 }}>Faol</span>
                      <button
                        onClick={() => openEditCategory(cat)}
                        className="card-interactive"
                        style={{
                          width: 30, height: 30, borderRadius: 8, background: '#1a1a1a',
                          border: '1px solid #222', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
                        }}
                      >
                        <Edit size={13} color="#aaa" />
                      </button>
                      <button
                        onClick={() => confirmDeleteCategory(cat.id)}
                        className="card-interactive"
                        style={{
                          width: 30, height: 30, borderRadius: 8, background: '#1a1a1a',
                          border: '1px solid #222', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
                        }}
                      >
                        <Trash2 size={13} color="#e51e1e" />
                      </button>
                    </div>
                  </div>
                ))}
                {categories.length === 0 && (
                  <p style={{ textAlign: 'center', color: '#666', fontSize: 13, padding: 20 }}>Kategoriyalar yo'q</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="animate-fade-in" style={{ marginBottom: 16, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div className="flex" style={{ gap: 8, paddingBottom: 4, minWidth: 'max-content' }}>
            <button
              onClick={() => setActiveCategory('all')}
              className="card-interactive"
              style={{
                padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.2s',
                background: activeCategory === 'all' ? '#e51e1e' : '#1a1a1a',
                color: activeCategory === 'all' ? '#fff' : '#888', flexShrink: 0,
              }}
            >
              Barchasi ({foods.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(String(cat.id))}
                className="card-interactive"
                style={{
                  padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.2s',
                  background: activeCategory === String(cat.id) ? '#e51e1e' : '#1a1a1a',
                  color: activeCategory === String(cat.id) ? '#fff' : '#888',
                  display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
                }}
              >
                <span>{cat.icon}</span>
                {cat.name} ({getProductCount(cat.id)})
              </button>
            ))}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between animate-fade-in" style={{ marginBottom: 14 }}>
          <p style={{ color: '#888', fontSize: 12, fontWeight: 500 }}>{filteredFoods.length} ta mahsulot</p>
          <div className="flex" style={{ gap: 4, background: '#141414', borderRadius: 8, padding: 2, border: '1px solid #1e1e1e' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                width: 32, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer',
                background: viewMode === 'grid' ? '#e51e1e' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <Grid size={14} color={viewMode === 'grid' ? '#fff' : '#666'} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                width: 32, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer',
                background: viewMode === 'list' ? '#e51e1e' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <List size={14} color={viewMode === 'list' ? '#fff' : '#666'} />
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredFoods.length === 0 && (
          <div className="empty-state animate-fade-in" style={{ padding: '48px 24px' }}>
            <div className="empty-state-icon">
              <Image size={36} color="#555" />
            </div>
            <p style={{ color: '#888', fontSize: 14, fontWeight: 500 }}>Mahsulotlar topilmadi</p>
            <button className="btn btn-primary btn-sm" onClick={openAddModal} style={{ marginTop: 16, borderRadius: 10, fontSize: 13 }}>
              <Plus size={16} /> Yangi qo'shish
            </button>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && filteredFoods.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }} className="stagger">
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                className="card card-hover"
                style={{
                  background: '#141414', border: '1px solid #1e1e1e', borderRadius: 14,
                  overflow: 'hidden', transition: 'border-color 0.2s, transform 0.15s',
                }}
              >
                <div style={{ position: 'relative', width: '100%', paddingTop: '70%', overflow: 'hidden' }}>
                  <img
                    src={food.image}
                    alt={food.name}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)' }} />
                  <div className="flex" style={{ position: 'absolute', top: 8, left: 8, gap: 4, zIndex: 2 }}>
                    {food.isPopular && (
                      <span className="badge badge-red" style={{ fontSize: 10, padding: '3px 7px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Star size={10} fill="currentColor" /> Top
                      </span>
                    )}
                    {food.isNew && (
                      <span className="badge badge-green" style={{ fontSize: 10, padding: '3px 7px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Flame size={10} /> Yangi
                      </span>
                    )}
                    {food.discountPrice && (
                      <span className="badge badge-yellow" style={{ fontSize: 10, padding: '3px 7px', borderRadius: 6 }}>
                        -{Math.round(((food.price - food.discountPrice) / food.price) * 100)}%
                      </span>
                    )}
                  </div>
                  {food.isActive === false && (
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3,
                    }}>
                      <span className="badge badge-red" style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8 }}>Nofaol</span>
                    </div>
                  )}
                </div>
                <div style={{ padding: '10px 12px 12px' }}>
                  <div className="flex items-center" style={{ gap: 4, marginBottom: 4 }}>
                    <span style={{ fontSize: 12 }}>{getCategoryIcon(food.categoryId)}</span>
                    <span style={{ color: '#666', fontSize: 11, fontWeight: 500 }}>{getCategoryName(food.categoryId)}</span>
                  </div>
                  <h3 style={{ color: '#fff', fontSize: 13, fontWeight: 700, margin: '0 0 6px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                    {food.name}
                  </h3>
                  <div className="flex items-center" style={{ gap: 6, marginBottom: 10 }}>
                    {food.discountPrice ? (
                      <>
                        <span style={{ color: '#e51e1e', fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{food.discountPrice.toLocaleString()}</span>
                        <span style={{ color: '#555', fontSize: 11, textDecoration: 'line-through', fontVariantNumeric: 'tabular-nums' }}>{food.price.toLocaleString()}</span>
                      </>
                    ) : (
                      <span style={{ color: '#e51e1e', fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{food.price.toLocaleString()} so'm</span>
                    )}
                  </div>
                  <div className="flex" style={{ gap: 6 }}>
                    <button
                      className="card-interactive"
                      onClick={() => openEditModal(food)}
                      style={{
                        flex: 1, height: 32, borderRadius: 8, border: '1px solid #2a2a2a',
                        background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: 4, cursor: 'pointer', color: '#aaa', fontSize: 11, fontWeight: 600, transition: 'all 0.2s',
                      }}
                    >
                      <Edit size={12} /> Tahrirlash
                    </button>
                    <button
                      className="card-interactive"
                      onClick={() => confirmDeleteProduct(food.id)}
                      style={{
                        width: 32, height: 32, borderRadius: 8, border: '1px solid #2a2a2a',
                        background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#e51e1e', transition: 'all 0.2s', flexShrink: 0,
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && filteredFoods.length > 0 && (
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* Table Header */}
            <div className="card" style={{
              display: 'grid', gridTemplateColumns: '48px 1fr 1fr 90px 70px 60px 80px',
              gap: 8, padding: '10px 12px', fontSize: 11, fontWeight: 600, color: '#666',
              alignItems: 'center',
            }}>
              <span>Rasm</span>
              <span>Nomi</span>
              <span>Kategoriya</span>
              <span style={{ textAlign: 'right' }}>Narx</span>
              <span style={{ textAlign: 'right' }}>Chegirma</span>
              <span style={{ textAlign: 'center' }}>Holat</span>
              <span style={{ textAlign: 'center' }}>Amallar</span>
            </div>

            {filteredFoods.map((food) => (
              <div
                key={food.id}
                className="card card-hover"
                style={{
                  display: 'grid', gridTemplateColumns: '48px 1fr 1fr 90px 70px 60px 80px',
                  gap: 8, padding: '10px 12px', alignItems: 'center', fontSize: 12,
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 8, overflow: 'hidden',
                  border: '1px solid #222', flexShrink: 0, position: 'relative',
                }}>
                  <img src={food.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {food.discountPrice && (
                    <span className="badge badge-yellow" style={{
                      position: 'absolute', top: 2, right: 2, fontSize: 8, padding: '1px 4px', borderRadius: 4,
                    }}>
                      -{Math.round(((food.price - food.discountPrice) / food.price) * 100)}%
                    </span>
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ color: '#fff', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12 }}>
                    {food.name}
                  </p>
                  <div className="flex" style={{ gap: 4, marginTop: 3 }}>
                    {food.isPopular && (
                      <span className="badge badge-red" style={{ fontSize: 9, padding: '1px 5px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Star size={8} fill="currentColor" /> Top
                      </span>
                    )}
                    {food.isNew && (
                      <span className="badge badge-green" style={{ fontSize: 9, padding: '1px 5px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Flame size={8} /> Yangi
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center" style={{ gap: 4 }}>
                  <span style={{ fontSize: 14 }}>{getCategoryIcon(food.categoryId)}</span>
                  <span style={{ color: '#888', fontSize: 11 }}>{getCategoryName(food.categoryId)}</span>
                </div>
                <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  <span style={{ color: '#e51e1e', fontWeight: 700, fontSize: 12 }}>
                    {(food.discountPrice || food.price).toLocaleString()}
                  </span>
                  {food.discountPrice && (
                    <p style={{ color: '#555', fontSize: 10, textDecoration: 'line-through', margin: '1px 0 0 0' }}>
                      {food.price.toLocaleString()}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  {food.discountPrice ? (
                    <span className="badge badge-yellow" style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>
                      -{Math.round(((food.price - food.discountPrice) / food.price) * 100)}%
                    </span>
                  ) : (
                    <span style={{ color: '#555', fontSize: 11 }}>—</span>
                  )}
                </div>
                <div style={{ textAlign: 'center' }}>
                  {food.isActive !== false ? (
                    <span className="badge badge-green" style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>Faol</span>
                  ) : (
                    <span className="badge badge-red" style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>Nofaol</span>
                  )}
                </div>
                <div className="flex items-center" style={{ gap: 4, justifyContent: 'center' }}>
                  <button
                    onClick={() => openEditModal(food)}
                    className="card-interactive"
                    style={{
                      width: 30, height: 30, borderRadius: 8, background: '#1a1a1a',
                      border: '1px solid #222', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    <Edit size={12} color="#aaa" />
                  </button>
                  <button
                    onClick={() => confirmDeleteProduct(food.id)}
                    className="card-interactive"
                    style={{
                      width: 30, height: 30, borderRadius: 8, background: '#1a1a1a',
                      border: '1px solid #222', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
                    }}
                  >
                    <Trash2 size={12} color="#e51e1e" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={closeModal} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />
          <div className="animate-slide-up" style={{
            position: 'relative', width: '100%', maxWidth: 480, maxHeight: '90vh',
            background: '#111', borderRadius: '20px 20px 0 0', border: '1px solid #222',
            borderBottom: 'none', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }}>
            {/* Modal Header */}
            <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: '1px solid #1e1e1e' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>
                {editingId ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}
              </h2>
              <button onClick={closeModal} className="card-interactive" style={{
                width: 32, height: 32, borderRadius: 10, background: '#1a1a1a',
                border: '1px solid #222', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer',
              }}>
                <X size={16} color="#888" />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Nomi */}
                <div>
                  <Label required>Nomi</Label>
                  <input className="input" placeholder="Mahsulot nomi" value={form.name}
                    onChange={(e) => updateField('name', e.target.value)} style={inputStyle} />
                </div>

                {/* Tavsif */}
                <div>
                  <Label>Tavsif</Label>
                  <textarea className="input" placeholder="Qisqacha tavsif" value={form.description}
                    onChange={(e) => updateField('description', e.target.value)} rows={3}
                    style={{ ...inputStyle, minHeight: 80, resize: 'none' }} />
                </div>

                {/* Narx & Chegirma */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <Label required>Narx (so'm)</Label>
                    <input className="input" type="number" placeholder="25000" value={form.price}
                      onChange={(e) => updateField('price', e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <Label>Chegirma narxi</Label>
                    <input className="input" type="number" placeholder="20000" value={form.discountPrice}
                      onChange={(e) => updateField('discountPrice', e.target.value)} style={inputStyle} />
                  </div>
                </div>

                {/* Kategoriya */}
                <div>
                  <Label required>Kategoriya</Label>
                  <select className="input" value={form.categoryId}
                    onChange={(e) => updateField('categoryId', e.target.value)} style={inputStyle}>
                    <option value="">Kategoriyani tanlang</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Rasmlar (URL) */}
                <div>
                  <Label>Rasmlar</Label>
                  <div className="flex" style={{ gap: 6 }}>
                    <input className="input" placeholder="https://rasm-url..." value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addImageUrl()}
                      style={{ ...inputStyle, flex: 1 }} />
                    <button onClick={addImageUrl} className="card-interactive" style={{
                      width: 40, height: 40, borderRadius: 10, background: 'rgba(229,30,30,0.1)',
                      border: '1px solid #331111', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
                    }}>
                      <Plus size={16} color="#e51e1e" />
                    </button>
                  </div>
                  {form.images.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 10, overflowX: 'auto', paddingBottom: 4 }}>
                      {form.images.map((url, idx) => (
                        <div key={idx} style={{ position: 'relative', flexShrink: 0 }}>
                          <img src={url} alt="" onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }}
                            style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover', border: '1px solid #222' }} />
                          <button onClick={() => removeImageUrl(idx)} style={{
                            position: 'absolute', top: -4, right: -4, width: 20, height: 20, borderRadius: '50%',
                            background: '#e51e1e', border: 'none', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', cursor: 'pointer',
                          }}>
                            <X size={10} color="#fff" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video URL */}
                <div>
                  <Label>Video URL (ixtiyoriy)</Label>
                  <input className="input" placeholder="https://youtube.com/..." value={form.videoUrl}
                    onChange={(e) => updateField('videoUrl', e.target.value)} style={inputStyle} />
                </div>

                {/* Kaloriya & Tayyorlash vaqti & Og'irlik */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  <div>
                    <Label>Kaloriya</Label>
                    <input className="input" type="number" placeholder="450" value={form.calories}
                      onChange={(e) => updateField('calories', e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <Label>Vaqt (daqiqa)</Label>
                    <input className="input" type="number" placeholder="15" value={form.prepTime}
                      onChange={(e) => updateField('prepTime', e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <Label>Og'irlik</Label>
                    <input className="input" placeholder="200g" value={form.weight}
                      onChange={(e) => updateField('weight', e.target.value)} style={inputStyle} />
                  </div>
                </div>

                {/* Ingredientlar */}
                <div>
                  <Label>Ingredientlar (vergul bilan)</Label>
                  <input className="input" placeholder="Go'sht, Piyoz, Tuz, Ziravorlar" value={form.ingredients}
                    onChange={(e) => updateField('ingredients', e.target.value)} style={inputStyle} />
                </div>

                {/* Allergiya */}
                <div>
                  <Label>Allergiya ma'lumoti</Label>
                  <input className="input" placeholder="Sut, Gluten, Yong'oq..." value={form.allergenInfo}
                    onChange={(e) => updateField('allergenInfo', e.target.value)} style={inputStyle} />
                </div>

                {/* Toggles */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <Toggle active={form.isPopular} onClick={() => updateField('isPopular', !form.isPopular)} color="#e51e1e">
                    <Star size={14} color="#666" />
                  </Toggle>
                  <Toggle active={form.isNew} onClick={() => updateField('isNew', !form.isNew)} color="#22c55e">
                    <Flame size={14} color="#666" />
                  </Toggle>
                </div>

                {/* Active Toggle */}
                <Toggle active={form.isActive} onClick={() => updateField('isActive', !form.isActive)} color="#22c55e">
                  <Check size={14} color="#666" />
                </Toggle>

                {/* Variants Section */}
                <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: 16 }}>
                  <Label>Variantlar (kichik/katta)</Label>
                  {form.variants.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                      {form.variants.map((v, idx) => (
                        <div key={idx} className="flex items-center justify-between" style={{
                          padding: '8px 12px', background: '#1a1a1a', borderRadius: 8,
                          border: '1px solid #222',
                        }}>
                          <div className="flex items-center" style={{ gap: 8 }}>
                            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{v.name}</span>
                            <span style={{ color: '#e51e1e', fontSize: 12, fontWeight: 700 }}>{v.price.toLocaleString()} so'm</span>
                          </div>
                          <button onClick={() => removeVariant(idx)} style={{
                            background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                          }}>
                            <X size={14} color="#e51e1e" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex" style={{ gap: 6 }}>
                    <input className="input" placeholder="Nom (masalan: Small)" value={variantInput.name}
                      onChange={(e) => setVariantInput((p) => ({ ...p, name: e.target.value }))}
                      style={{ ...inputStyle, flex: 1 }} />
                    <input className="input" type="number" placeholder="Narx" value={variantInput.price}
                      onChange={(e) => setVariantInput((p) => ({ ...p, price: e.target.value }))}
                      style={{ ...inputStyle, width: 100 }} />
                    <button onClick={addVariant} className="card-interactive" style={{
                      width: 40, height: 40, borderRadius: 10, background: 'rgba(229,30,30,0.1)',
                      border: '1px solid #331111', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
                    }}>
                      <Plus size={16} color="#e51e1e" />
                    </button>
                  </div>
                </div>

                {/* Extras Section */}
                <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: 16 }}>
                  <Label>Qo'shimcha ingredientlar</Label>
                  {form.extras.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                      {form.extras.map((e, idx) => (
                        <div key={idx} className="flex items-center justify-between" style={{
                          padding: '8px 12px', background: '#1a1a1a', borderRadius: 8,
                          border: '1px solid #222',
                        }}>
                          <div className="flex items-center" style={{ gap: 8 }}>
                            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{e.name}</span>
                            <span style={{ color: '#e51e1e', fontSize: 12, fontWeight: 700 }}>+{e.price.toLocaleString()} so'm</span>
                          </div>
                          <button onClick={() => removeExtra(idx)} style={{
                            background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                          }}>
                            <X size={14} color="#e51e1e" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex" style={{ gap: 6 }}>
                    <input className="input" placeholder="Nom (masalan: Pishloq)" value={extraInput.name}
                      onChange={(e) => setExtraInput((p) => ({ ...p, name: e.target.value }))}
                      style={{ ...inputStyle, flex: 1 }} />
                    <input className="input" type="number" placeholder="Narx" value={extraInput.price}
                      onChange={(e) => setExtraInput((p) => ({ ...p, price: e.target.value }))}
                      style={{ ...inputStyle, width: 100 }} />
                    <button onClick={addExtra} className="card-interactive" style={{
                      width: 40, height: 40, borderRadius: 10, background: 'rgba(229,30,30,0.1)',
                      border: '1px solid #331111', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
                    }}>
                      <Plus size={16} color="#e51e1e" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid #1e1e1e', display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary btn-sm" onClick={closeModal} style={{
                flex: 1, borderRadius: 10, fontSize: 13, fontWeight: 600, minHeight: 40,
                background: '#1a1a1a', border: '1px solid #222', color: '#888',
              }}>
                Bekor qilish
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleSave}
                disabled={!form.name.trim() || !form.price || !form.categoryId}
                style={{ flex: 1, borderRadius: 10, fontSize: 13, fontWeight: 600, minHeight: 40 }}>
                <Check size={16} /> {editingId ? 'Saqlash' : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {categoryModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={() => setCategoryModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />
          <div className="animate-scale-in" style={{
            position: 'relative', width: '100%', maxWidth: 340, background: '#141414',
            border: '1px solid #222', borderRadius: 20, padding: '24px 20px',
          }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>
                {editingCategoryId ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'}
              </h3>
              <button onClick={() => setCategoryModalOpen(false)} className="card-interactive" style={{
                width: 30, height: 30, borderRadius: 8, background: '#1a1a1a',
                border: '1px solid #222', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer',
              }}>
                <X size={14} color="#888" />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <Label required>Ikonka (emoji)</Label>
                <input className="input" placeholder="🥩" value={categoryForm.icon}
                  onChange={(e) => setCategoryForm((p) => ({ ...p, icon: e.target.value }))}
                  style={{ ...inputStyle, textAlign: 'center', fontSize: 24 }} />
              </div>
              <div>
                <Label required>Nomi</Label>
                <input className="input" placeholder="Kategoriya nomi" value={categoryForm.name}
                  onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))} style={inputStyle} />
              </div>
            </div>
            <div className="flex" style={{ gap: 10, marginTop: 20 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setCategoryModalOpen(false)} style={{
                flex: 1, borderRadius: 10, fontSize: 13, fontWeight: 600, minHeight: 40,
                background: '#1a1a1a', border: '1px solid #222', color: '#888',
              }}>
                Bekor qilish
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleSaveCategory}
                disabled={!categoryForm.name.trim() || !categoryForm.icon.trim()}
                style={{ flex: 1, borderRadius: 10, fontSize: 13, fontWeight: 600, minHeight: 40 }}>
                <Check size={16} /> {editingCategoryId ? 'Saqlash' : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={() => { setDeleteConfirmId(null); setDeleteTargetId(null); }} style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          }} />
          <div className="animate-scale-in" style={{
            position: 'relative', width: '100%', maxWidth: 320, background: '#141414',
            border: '1px solid #222', borderRadius: 20, padding: '24px 20px', textAlign: 'center',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: 'rgba(229,30,30,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
            }}>
              <AlertTriangle size={24} color="#e51e1e" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 8px 0' }}>
              {deleteType === 'product' ? "Mahsulotni o'chirish?" : "Kategoriyani o'chirish?"}
            </h3>
            <p style={{ color: '#888', fontSize: 13, margin: '0 0 20px 0', lineHeight: 1.5 }}>
              {deleteType === 'product'
                ? 'Bu mahsulot butunlay o\'chiriladi. Amalni qaytarib bo\'lmaydi.'
                : "Bu kategoriya o'chiriladi. Amalni qaytarib bo'lmaydi."}
            </p>
            <div className="flex" style={{ gap: 10 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => { setDeleteConfirmId(null); setDeleteTargetId(null); }} style={{
                flex: 1, borderRadius: 10, fontSize: 13, fontWeight: 600, minHeight: 40,
                background: '#1a1a1a', border: '1px solid #222', color: '#888',
              }}>
                Bekor qilish
              </button>
              <button className="btn btn-primary btn-sm" onClick={doDelete} style={{
                flex: 1, borderRadius: 10, fontSize: 13, fontWeight: 600, minHeight: 40,
                background: 'linear-gradient(135deg, #e51e1e, #c41a1a)',
              }}>
                <Trash2 size={14} /> O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
