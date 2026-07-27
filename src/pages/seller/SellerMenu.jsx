import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { ChevronLeft, Plus, Edit, Trash2, Star, Flame, X, Check, Image } from 'lucide-react';

const emptyProduct = {
  name: '',
  description: '',
  price: '',
  discountPrice: '',
  categoryId: '',
  image: '',
  isPopular: false,
  isNew: false,
  spiceLevel: 0,
};

export default function SellerMenu() {
  const navigate = useNavigate();
  const { foods, categories, addProduct, updateProduct, deleteProduct } = useStore();

  const [activeCategory, setActiveCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

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

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyProduct);
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
      image: food.image || '',
      isPopular: food.isPopular || false,
      isNew: food.isNew || false,
      spiceLevel: food.spiceLevel || 0,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyProduct);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price || !form.categoryId) return;

    const productData = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      categoryId: Number(form.categoryId),
      image: form.image.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      isPopular: form.isPopular,
      isNew: form.isNew,
      spiceLevel: form.spiceLevel,
      calories: 0,
      ingredients: [],
      restaurantId: 1,
    };

    if (editingId) {
      updateProduct(editingId, productData);
    } else {
      addProduct(productData);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
  };

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="p-4">
        {/* Header */}
        <div
          className="flex items-center justify-between animate-fade-in"
          style={{ marginBottom: 20 }}
        >
          <div className="flex items-center" style={{ gap: 12 }}>
            <button
              className="card-interactive"
              onClick={() => navigate(-1)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: '#141414',
                border: '1px solid #222',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              <ChevronLeft size={20} color="#aaa" />
            </button>
            <div>
              <h1
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#fff',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                Menyu boshqaruvi
              </h1>
              <p style={{ color: '#666', fontSize: 12, margin: '2px 0 0 0' }}>
                {foods.length} ta mahsulot
              </p>
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={openAddModal}
            style={{
              borderRadius: 10,
              padding: '8px 14px',
              minHeight: 36,
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Plus size={16} />
            <span className="hidden" style={{ display: 'inline' }}>Yangi mahsulot</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div
          className="animate-fade-in"
          style={{
            marginBottom: 16,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div
            className="flex"
            style={{
              gap: 8,
              paddingBottom: 4,
              minWidth: 'max-content',
            }}
          >
            <button
              onClick={() => setActiveCategory('all')}
              className="card-interactive"
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                background: activeCategory === 'all' ? '#e51e1e' : '#1a1a1a',
                color: activeCategory === 'all' ? '#fff' : '#888',
                flexShrink: 0,
              }}
            >
              Barchasi ({foods.length})
            </button>
            {categories.map((cat) => {
              const count = foods.filter((f) => f.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(String(cat.id))}
                  className="card-interactive"
                  style={{
                    padding: '8px 16px',
                    borderRadius: 20,
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    background: activeCategory === String(cat.id) ? '#e51e1e' : '#1a1a1a',
                    color: activeCategory === String(cat.id) ? '#fff' : '#888',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    flexShrink: 0,
                  }}
                >
                  <span>{cat.icon}</span>
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        {filteredFoods.length === 0 ? (
          <div
            className="empty-state animate-fade-in"
            style={{ padding: '48px 24px' }}
          >
            <div className="empty-state-icon">
              <Image size={36} color="#555" />
            </div>
            <p style={{ color: '#888', fontSize: 14, fontWeight: 500 }}>
              Mahsulotlar topilmadi
            </p>
            <button
              className="btn btn-primary btn-sm"
              onClick={openAddModal}
              style={{ marginTop: 16, borderRadius: 10, fontSize: 13 }}
            >
              <Plus size={16} /> Yangi qo'shish
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 10,
            }}
            className="stagger"
          >
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                className="card card-hover"
                style={{
                  background: '#141414',
                  border: '1px solid #1e1e1e',
                  borderRadius: 14,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s, transform 0.15s',
                }}
              >
                {/* Image */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '70%',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={food.image}
                    alt={food.name}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)',
                    }}
                  />

                  {/* Badges */}
                  <div
                    className="flex"
                    style={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      gap: 4,
                      zIndex: 2,
                    }}
                  >
                    {food.isPopular && (
                      <span
                        className="badge badge-red"
                        style={{
                          fontSize: 10,
                          padding: '3px 7px',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <Star size={10} fill="currentColor" />
                        Top
                      </span>
                    )}
                    {food.isNew && (
                      <span
                        className="badge badge-green"
                        style={{
                          fontSize: 10,
                          padding: '3px 7px',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <Flame size={10} />
                        Yangi
                      </span>
                    )}
                    {food.discountPrice && (
                      <span
                        className="badge badge-yellow"
                        style={{
                          fontSize: 10,
                          padding: '3px 7px',
                          borderRadius: 6,
                        }}
                      >
                        -{Math.round(((food.price - food.discountPrice) / food.price) * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Spice Level */}
                  {food.spiceLevel > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 2,
                        fontSize: 12,
                      }}
                    >
                      {'🌶️'.repeat(food.spiceLevel)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '10px 12px 12px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontSize: 12 }}>{getCategoryIcon(food.categoryId)}</span>
                    <span
                      style={{
                        color: '#666',
                        fontSize: 11,
                        fontWeight: 500,
                      }}
                    >
                      {getCategoryName(food.categoryId)}
                    </span>
                  </div>

                  <h3
                    style={{
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 700,
                      margin: '0 0 6px 0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.3,
                    }}
                  >
                    {food.name}
                  </h3>

                  <div
                    className="flex items-center"
                    style={{ gap: 6, marginBottom: 10 }}
                  >
                    {food.discountPrice ? (
                      <>
                        <span
                          style={{
                            color: '#e51e1e',
                            fontSize: 14,
                            fontWeight: 700,
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {food.discountPrice.toLocaleString()}
                        </span>
                        <span
                          style={{
                            color: '#555',
                            fontSize: 11,
                            textDecoration: 'line-through',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {food.price.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      <span
                        style={{
                          color: '#e51e1e',
                          fontSize: 14,
                          fontWeight: 700,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {food.price.toLocaleString()} so'm
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div
                    className="flex"
                    style={{ gap: 6 }}
                  >
                    <button
                      className="card-interactive"
                      onClick={() => openEditModal(food)}
                      style={{
                        flex: 1,
                        height: 32,
                        borderRadius: 8,
                        border: '1px solid #2a2a2a',
                        background: '#1a1a1a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        cursor: 'pointer',
                        color: '#aaa',
                        fontSize: 11,
                        fontWeight: 600,
                        transition: 'all 0.2s',
                      }}
                    >
                      <Edit size={12} />
                      Tahrirlash
                    </button>
                    <button
                      className="card-interactive"
                      onClick={() => setDeleteConfirmId(food.id)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: '1px solid #2a2a2a',
                        background: '#1a1a1a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#e51e1e',
                        transition: 'all 0.2s',
                        flexShrink: 0,
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
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          {/* Overlay */}
          <div
            onClick={closeModal}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Modal Content */}
          <div
            className="animate-slide-up"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 480,
              maxHeight: '90vh',
              background: '#111',
              borderRadius: '20px 20px 0 0',
              border: '1px solid #222',
              borderBottom: 'none',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #1e1e1e',
              }}
            >
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#fff',
                  margin: 0,
                }}
              >
                {editingId ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}
              </h2>
              <button
                onClick={closeModal}
                className="card-interactive"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: '#1a1a1a',
                  border: '1px solid #222',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} color="#888" />
              </button>
            </div>

            {/* Modal Body */}
            <div
              style={{
                padding: '16px 20px',
                overflowY: 'auto',
                flex: 1,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Name */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: '#888',
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    Nomi *
                  </label>
                  <input
                    className="input"
                    placeholder="Mahsulot nomi"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    style={{ fontSize: 14, background: '#1a1a1a', borderColor: '#222' }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: '#888',
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    Tavsif
                  </label>
                  <textarea
                    className="input"
                    placeholder="Qisqacha tavsif"
                    value={form.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={2}
                    style={{
                      fontSize: 14,
                      background: '#1a1a1a',
                      borderColor: '#222',
                      minHeight: 72,
                      resize: 'none',
                    }}
                  />
                </div>

                {/* Price & Discount Price */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: '#888',
                        fontSize: 12,
                        fontWeight: 600,
                        marginBottom: 6,
                      }}
                    >
                      Narxi (so'm) *
                    </label>
                    <input
                      className="input"
                      type="number"
                      placeholder="25000"
                      value={form.price}
                      onChange={(e) => updateField('price', e.target.value)}
                      style={{ fontSize: 14, background: '#1a1a1a', borderColor: '#222' }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        color: '#888',
                        fontSize: 12,
                        fontWeight: 600,
                        marginBottom: 6,
                      }}
                    >
                      Chegirma narxi
                    </label>
                    <input
                      className="input"
                      type="number"
                      placeholder="20000"
                      value={form.discountPrice}
                      onChange={(e) => updateField('discountPrice', e.target.value)}
                      style={{ fontSize: 14, background: '#1a1a1a', borderColor: '#222' }}
                    />
                  </div>
                </div>

                {/* Category Select */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: '#888',
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    Kategoriya *
                  </label>
                  <select
                    className="input"
                    value={form.categoryId}
                    onChange={(e) => updateField('categoryId', e.target.value)}
                    style={{ fontSize: 14, background: '#1a1a1a', borderColor: '#222' }}
                  >
                    <option value="">Kategoriyani tanlang</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image URL */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: '#888',
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    Rasm URL
                  </label>
                  <input
                    className="input"
                    placeholder="https://..."
                    value={form.image}
                    onChange={(e) => updateField('image', e.target.value)}
                    style={{ fontSize: 14, background: '#1a1a1a', borderColor: '#222' }}
                  />
                  {form.image && (
                    <div
                      style={{
                        marginTop: 8,
                        width: '100%',
                        height: 100,
                        borderRadius: 10,
                        overflow: 'hidden',
                        border: '1px solid #222',
                      }}
                    >
                      <img
                        src={form.image}
                        alt="Preview"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Spice Level */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: '#888',
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: 6,
                    }}
                  >
                    Achchiqlik darajasi
                  </label>
                  <div className="flex" style={{ gap: 8 }}>
                    {[0, 1, 2, 3].map((level) => (
                      <button
                        key={level}
                        onClick={() => updateField('spiceLevel', level)}
                        className="card-interactive"
                        style={{
                          flex: 1,
                          height: 40,
                          borderRadius: 10,
                          border: `1.5px solid ${form.spiceLevel === level ? '#e51e1e' : '#222'}`,
                          background: form.spiceLevel === level ? 'rgba(229,30,30,0.1)' : '#1a1a1a',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: 16,
                          transition: 'all 0.2s',
                        }}
                      >
                        {level === 0 ? '😐' : '🌶️'.repeat(level)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {/* isPopular Toggle */}
                  <button
                    onClick={() => updateField('isPopular', !form.isPopular)}
                    className="card-interactive"
                    style={{
                      padding: '12px',
                      borderRadius: 12,
                      border: `1.5px solid ${form.isPopular ? '#e51e1e' : '#222'}`,
                      background: form.isPopular ? 'rgba(229,30,30,0.08)' : '#1a1a1a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: form.isPopular ? '#e51e1e' : '#2a2a2a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {form.isPopular ? (
                        <Check size={14} color="#fff" />
                      ) : (
                        <Star size={14} color="#666" />
                      )}
                    </div>
                    <span
                      style={{
                        color: form.isPopular ? '#fff' : '#888',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      Top mahsulot
                    </span>
                  </button>

                  {/* isNew Toggle */}
                  <button
                    onClick={() => updateField('isNew', !form.isNew)}
                    className="card-interactive"
                    style={{
                      padding: '12px',
                      borderRadius: 12,
                      border: `1.5px solid ${form.isNew ? '#22c55e' : '#222'}`,
                      background: form.isNew ? 'rgba(34,197,94,0.08)' : '#1a1a1a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: form.isNew ? '#22c55e' : '#2a2a2a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {form.isNew ? (
                        <Check size={14} color="#fff" />
                      ) : (
                        <Flame size={14} color="#666" />
                      )}
                    </div>
                    <span
                      style={{
                        color: form.isNew ? '#fff' : '#888',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      Yangi mahsulot
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '14px 20px',
                borderTop: '1px solid #1e1e1e',
                display: 'flex',
                gap: 10,
              }}
            >
              <button
                className="btn btn-secondary btn-sm"
                onClick={closeModal}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  minHeight: 40,
                  background: '#1a1a1a',
                  border: '1px solid #222',
                  color: '#888',
                }}
              >
                Bekor qilish
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSave}
                disabled={!form.name.trim() || !form.price || !form.categoryId}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  minHeight: 40,
                }}
              >
                <Check size={16} />
                {editingId ? 'Saqlash' : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            onClick={() => setDeleteConfirmId(null)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)',
            }}
          />
          <div
            className="animate-scale-in"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 320,
              background: '#141414',
              border: '1px solid #222',
              borderRadius: 20,
              padding: '24px 20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(229,30,30,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Trash2 size={24} color="#e51e1e" />
            </div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#fff',
                margin: '0 0 8px 0',
              }}
            >
              Mahsulotni o'chirish?
            </h3>
            <p
              style={{
                color: '#888',
                fontSize: 13,
                margin: '0 0 20px 0',
                lineHeight: 1.5,
              }}
            >
              Bu mahsulot butunlay o'chiriladi. Amalni qaytarib bo'lmaydi.
            </p>
            <div className="flex" style={{ gap: 10 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setDeleteConfirmId(null)}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  minHeight: 40,
                  background: '#1a1a1a',
                  border: '1px solid #222',
                  color: '#888',
                }}
              >
                Bekor qilish
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleDelete(deleteConfirmId)}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  minHeight: 40,
                  background: 'linear-gradient(135deg, #e51e1e, #c41a1a)',
                }}
              >
                <Trash2 size={14} />
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
