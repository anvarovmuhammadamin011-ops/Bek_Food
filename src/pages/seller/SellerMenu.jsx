import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import {
  ChevronLeft,
  Plus,
  Edit,
  Trash2,
  Star,
  Flame,
  X,
  Check,
  Image,
  LayoutGrid,
  UtensilsCrossed,
  ShoppingBag,
  BarChart3,
  Settings,
} from 'lucide-react';

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

const styles = {
  root: {
    minHeight: '100%',
    background: 'var(--bg)',
    paddingBottom: 100,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 20px 0',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-sm)',
    transition: 'all 0.2s',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: 'var(--text)',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  headerSub: {
    fontSize: 12,
    color: 'var(--text-muted)',
    margin: '2px 0 0 0',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 16px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(249,115,22,0.3)',
    transition: 'all 0.2s',
  },
  categoryScroll: {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    padding: '16px 0 4px',
    margin: '0 20px',
  },
  categoryRow: {
    display: 'flex',
    gap: 8,
    minWidth: 'max-content',
  },
  catChip: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    borderRadius: 20,
    border: active ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
    background: active ? 'var(--primary-light)' : 'var(--surface)',
    color: active ? 'var(--primary)' : 'var(--text-muted)',
    fontSize: 13,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: active ? '0 2px 8px rgba(249,115,22,0.15)' : 'none',
    flexShrink: 0,
  }),
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
    padding: '0 20px',
  },
  card: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
    transition: 'all 0.2s',
  },
  cardImgWrap: {
    position: 'relative',
    width: '100%',
    paddingTop: '70%',
    overflow: 'hidden',
  },
  cardImg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardImgGradient: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.05) 100%)',
  },
  badge: (bg, color) => ({
    fontSize: 10,
    padding: '3px 8px',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    gap: 3,
    fontWeight: 600,
    background: bg,
    color: color,
  }),
  cardBody: {
    padding: '10px 12px 12px',
  },
  cardCat: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  cardCatIcon: {
    fontSize: 12,
  },
  cardCatName: {
    fontSize: 11,
    fontWeight: 500,
    color: 'var(--text-muted)',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--text)',
    margin: '0 0 6px 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: 1.3,
  },
  cardPrice: {
    color: 'var(--primary)',
    fontSize: 14,
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
  },
  cardPriceOld: {
    color: 'var(--text-muted)',
    fontSize: 11,
    textDecoration: 'line-through',
    fontVariantNumeric: 'tabular-nums',
  },
  cardActions: {
    display: 'flex',
    gap: 6,
    marginTop: 10,
  },
  editBtn: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--surface-hover)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    fontSize: 11,
    fontWeight: 600,
    transition: 'all 0.2s',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--surface-hover)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--danger)',
    transition: 'all 0.2s',
    flexShrink: 0,
  },
  emptyState: {
    padding: '48px 24px',
    textAlign: 'center',
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'var(--surface-hover)',
    border: '1px dashed var(--border-strong)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  emptyText: {
    color: 'var(--text-muted)',
    fontSize: 14,
    fontWeight: 500,
    margin: '0 0 16px 0',
  },
  emptyBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 20px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--primary)',
    color: '#fff',
    border: 'none',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(249,115,22,0.3)',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(8px)',
  },
  modal: {
    position: 'relative',
    width: '100%',
    maxWidth: 480,
    maxHeight: '90vh',
    background: 'var(--surface)',
    borderRadius: '20px 20px 0 0',
    border: '1px solid var(--border)',
    borderBottom: 'none',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'var(--shadow-lg)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid var(--border)',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--text)',
    margin: 0,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    background: 'var(--surface-hover)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  modalBody: {
    padding: '16px 20px',
    overflowY: 'auto',
    flex: 1,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  label: {
    display: 'block',
    color: 'var(--text-secondary)',
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 'var(--radius-sm)',
    border: '1.5px solid var(--border)',
    background: 'var(--surface-hover)',
    color: 'var(--text)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 'var(--radius-sm)',
    border: '1.5px solid var(--border)',
    background: 'var(--surface-hover)',
    color: 'var(--text)',
    fontSize: 14,
    outline: 'none',
    minHeight: 72,
    resize: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 'var(--radius-sm)',
    border: '1.5px solid var(--border)',
    background: 'var(--surface-hover)',
    color: 'var(--text)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  spiceBtn: (active) => ({
    flex: 1,
    height: 40,
    borderRadius: 10,
    border: active ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
    background: active ? 'var(--primary-light)' : 'var(--surface-hover)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 16,
    transition: 'all 0.2s',
  }),
  toggleCard: (active, color) => ({
    padding: 12,
    borderRadius: 12,
    border: active ? `1.5px solid ${color}` : '1.5px solid var(--border)',
    background: active ? `${color}10` : 'var(--surface-hover)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    transition: 'all 0.2s',
  }),
  toggleIcon: (active, color) => ({
    width: 28,
    height: 28,
    borderRadius: 8,
    background: active ? color : 'var(--surface-active)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),
  toggleLabel: (active) => ({
    color: active ? 'var(--text)' : 'var(--text-muted)',
    fontSize: 12,
    fontWeight: 600,
  }),
  modalFooter: {
    padding: '14px 20px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 'var(--radius-sm)',
    padding: '10px 0',
    fontSize: 13,
    fontWeight: 600,
    background: 'var(--surface-hover)',
    border: '1.5px solid var(--border)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  saveBtn: {
    flex: 1,
    borderRadius: 'var(--radius-sm)',
    padding: '10px 0',
    fontSize: 13,
    fontWeight: 600,
    background: 'var(--primary)',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    boxShadow: '0 2px 8px rgba(249,115,22,0.3)',
    transition: 'all 0.2s',
  },
  saveBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  deleteConfirmOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(8px)',
  },
  deleteConfirmCard: {
    position: 'relative',
    width: '100%',
    maxWidth: 320,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '24px 20px',
    textAlign: 'center',
    boxShadow: 'var(--shadow-lg)',
  },
  deleteConfirmIcon: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: '#FEF2F2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  deleteConfirmTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--text)',
    margin: '0 0 8px 0',
  },
  deleteConfirmText: {
    color: 'var(--text-muted)',
    fontSize: 13,
    margin: '0 0 20px 0',
    lineHeight: 1.5,
  },
  deleteConfirmBtn: {
    flex: 1,
    borderRadius: 'var(--radius-sm)',
    padding: '10px 0',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'all 0.2s',
  },
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid var(--border)',
    padding: '6px 0 env(safe-area-inset-bottom, 8px)',
  },
  bottomNavRow: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: (active) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    padding: '6px 12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: active ? 'var(--primary)' : 'var(--text-muted)',
    transition: 'color 0.2s',
  }),
  navLabel: (active) => ({
    fontSize: 10,
    fontWeight: active ? 700 : 500,
    color: 'inherit',
  }),
  imgPreview: {
    marginTop: 8,
    width: '100%',
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    border: '1px solid var(--border)',
  },
};

const focusHandlers = {
  onFocus: (e) => {
    e.target.style.borderColor = 'var(--primary)';
    e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)';
  },
  onBlur: (e) => {
    e.target.style.borderColor = 'var(--border)';
    e.target.style.boxShadow = 'none';
  },
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

  const canSave = form.name.trim() && form.price && form.categoryId;

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button
            style={styles.backBtn}
            onClick={() => navigate(-1)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface-hover)';
              e.currentTarget.style.borderColor = 'var(--border-strong)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--surface)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <ChevronLeft size={20} color="var(--text-secondary)" />
          </button>
          <div>
            <h1 style={styles.headerTitle}>Menyu boshqaruvi</h1>
            <p style={styles.headerSub}>{foods.length} ta mahsulot</p>
          </div>
        </div>
        <button
          style={styles.addBtn}
          onClick={openAddModal}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(249,115,22,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(249,115,22,0.3)';
          }}
        >
          <Plus size={16} />
          Qo'shish
        </button>
      </div>

      <div style={styles.categoryScroll}>
        <div style={styles.categoryRow}>
          <button
            onClick={() => setActiveCategory('all')}
            style={styles.catChip(activeCategory === 'all')}
          >
            <LayoutGrid size={14} />
            Barchasi ({foods.length})
          </button>
          {categories.map((cat) => {
            const count = foods.filter((f) => f.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(String(cat.id))}
                style={styles.catChip(activeCategory === String(cat.id))}
              >
                <span>{cat.icon}</span>
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {filteredFoods.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <Image size={28} color="var(--text-muted)" />
          </div>
          <p style={styles.emptyText}>Mahsulotlar topilmadi</p>
          <button style={styles.emptyBtn} onClick={openAddModal}>
            <Plus size={16} />
            Yangi qo'shish
          </button>
        </div>
      ) : (
        <div style={{ ...styles.grid, marginTop: 16 }}>
          {filteredFoods.map((food) => (
            <div
              key={food.id}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={styles.cardImgWrap}>
                <img src={food.image} alt={food.name} style={styles.cardImg} />
                <div style={styles.cardImgGradient} />

                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    zIndex: 2,
                    display: 'flex',
                    gap: 4,
                    flexWrap: 'wrap',
                  }}
                >
                  {food.isPopular && (
                    <span style={styles.badge('#FFF7ED', 'var(--primary)')}>
                      <Star size={10} fill="currentColor" />
                      Top
                    </span>
                  )}
                  {food.isNew && (
                    <span style={styles.badge('#F0FDF4', '#16A34A')}>
                      <Flame size={10} />
                      Yangi
                    </span>
                  )}
                  {food.discountPrice && (
                    <span style={styles.badge('#FEF3C7', '#D97706')}>
                      -{Math.round(((food.price - food.discountPrice) / food.price) * 100)}%
                    </span>
                  )}
                </div>

                {food.spiceLevel > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 2,
                      fontSize: 11,
                      background: 'rgba(255,255,255,0.9)',
                      borderRadius: 6,
                      padding: '2px 6px',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {Array.from({ length: food.spiceLevel }).map((_, i) => (
                      <Flame key={i} size={12} color="#EF4444" fill="#EF4444" style={{ marginRight: 1 }} />
                    ))}
                  </div>
                )}
              </div>

              <div style={styles.cardBody}>
                <div style={styles.cardCat}>
                  <span style={styles.cardCatIcon}>{getCategoryIcon(food.categoryId)}</span>
                  <span style={styles.cardCatName}>{getCategoryName(food.categoryId)}</span>
                </div>

                <h3 style={styles.cardTitle}>{food.name}</h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {food.discountPrice ? (
                    <>
                      <span style={styles.cardPrice}>
                        {food.discountPrice.toLocaleString()} so'm
                      </span>
                      <span style={styles.cardPriceOld}>
                        {food.price.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span style={styles.cardPrice}>
                      {food.price.toLocaleString()} so'm
                    </span>
                  )}
                </div>

                <div style={styles.cardActions}>
                  <button
                    style={styles.editBtn}
                    onClick={() => openEditModal(food)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--surface-active)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--surface-hover)';
                    }}
                  >
                    <Edit size={12} />
                    Tahrirlash
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => setDeleteConfirmId(food.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#FEF2F2';
                      e.currentTarget.style.borderColor = '#FECACA';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--surface-hover)';
                      e.currentTarget.style.borderColor = 'var(--border)';
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
          <div onClick={closeModal} style={styles.overlay} />
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingId ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}
              </h2>
              <button style={styles.modalCloseBtn} onClick={closeModal}>
                <X size={16} color="var(--text-muted)" />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <div>
                  <label style={styles.label}>Nomi *</label>
                  <input
                    style={styles.input}
                    placeholder="Mahsulot nomi"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    {...focusHandlers}
                  />
                </div>

                <div>
                  <label style={styles.label}>Tavsif</label>
                  <textarea
                    style={styles.textarea}
                    placeholder="Qisqacha tavsif"
                    value={form.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={2}
                    {...focusHandlers}
                  />
                </div>

                <div style={styles.grid2}>
                  <div>
                    <label style={styles.label}>Narxi (so'm) *</label>
                    <input
                      style={styles.input}
                      type="number"
                      placeholder="25000"
                      value={form.price}
                      onChange={(e) => updateField('price', e.target.value)}
                      {...focusHandlers}
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Chegirma narxi</label>
                    <input
                      style={styles.input}
                      type="number"
                      placeholder="20000"
                      value={form.discountPrice}
                      onChange={(e) => updateField('discountPrice', e.target.value)}
                      {...focusHandlers}
                    />
                  </div>
                </div>

                <div>
                  <label style={styles.label}>Kategoriya *</label>
                  <select
                    style={styles.select}
                    value={form.categoryId}
                    onChange={(e) => updateField('categoryId', e.target.value)}
                  >
                    <option value="">Kategoriyani tanlang</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={styles.label}>Rasm URL</label>
                  <input
                    style={styles.input}
                    placeholder="https://..."
                    value={form.image}
                    onChange={(e) => updateField('image', e.target.value)}
                    {...focusHandlers}
                  />
                  {form.image && (
                    <div style={styles.imgPreview}>
                      <img
                        src={form.image}
                        alt="Preview"
                        onError={(e) => { e.target.style.display = 'none'; }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label style={styles.label}>Achchiqlik darajasi</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[0, 1, 2, 3].map((level) => (
                      <button
                        key={level}
                        onClick={() => updateField('spiceLevel', level)}
                        style={styles.spiceBtn(form.spiceLevel === level)}
                      >
                        {level === 0 ? (
                          <X size={16} color="var(--text-muted)" />
                        ) : (
                          Array.from({ length: level }).map((_, i) => (
                            <Flame key={i} size={14} color="var(--danger)" fill="var(--danger)" />
                          ))
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={styles.grid2}>
                  <button
                    onClick={() => updateField('isPopular', !form.isPopular)}
                    style={styles.toggleCard(form.isPopular, 'var(--primary)')}
                  >
                    <div style={styles.toggleIcon(form.isPopular, 'var(--primary)')}>
                      {form.isPopular ? (
                        <Check size={14} color="#fff" />
                      ) : (
                        <Star size={14} color="var(--text-muted)" />
                      )}
                    </div>
                    <span style={styles.toggleLabel(form.isPopular)}>Top mahsulot</span>
                  </button>

                  <button
                    onClick={() => updateField('isNew', !form.isNew)}
                    style={styles.toggleCard(form.isNew, 'var(--success)')}
                  >
                    <div style={styles.toggleIcon(form.isNew, 'var(--success)')}>
                      {form.isNew ? (
                        <Check size={14} color="#fff" />
                      ) : (
                        <Flame size={14} color="var(--text-muted)" />
                      )}
                    </div>
                    <span style={styles.toggleLabel(form.isNew)}>Yangi mahsulot</span>
                  </button>
                </div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                style={styles.cancelBtn}
                onClick={closeModal}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-active)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
              >
                Bekor qilish
              </button>
              <button
                style={{ ...styles.saveBtn, ...(!canSave ? styles.saveBtnDisabled : {}) }}
                onClick={handleSave}
                disabled={!canSave}
                onMouseEnter={(e) => {
                  if (canSave) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(249,115,22,0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(249,115,22,0.3)';
                }}
              >
                <Check size={16} />
                {editingId ? 'Saqlash' : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}

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
            style={styles.deleteConfirmOverlay}
          />
          <div style={styles.deleteConfirmCard}>
            <div style={styles.deleteConfirmIcon}>
              <Trash2 size={24} color="var(--danger)" />
            </div>
            <h3 style={styles.deleteConfirmTitle}>Mahsulotni o'chirish?</h3>
            <p style={styles.deleteConfirmText}>
              Bu mahsulot butunlay o'chiriladi. Amalni qaytarib bo'lmaydi.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                style={{ ...styles.deleteConfirmBtn, background: 'var(--surface-hover)', border: '1.5px solid var(--border)', color: 'var(--text-secondary)' }}
                onClick={() => setDeleteConfirmId(null)}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-active)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
              >
                Bekor qilish
              </button>
              <button
                style={{ ...styles.deleteConfirmBtn, background: 'var(--danger)', border: 'none', color: '#fff', boxShadow: '0 2px 8px rgba(239,68,68,0.3)' }}
                onClick={() => handleDelete(deleteConfirmId)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,68,68,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(239,68,68,0.3)';
                }}
              >
                <Trash2 size={14} />
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.bottomNav}>
        <div style={styles.bottomNavRow}>
          <button style={styles.navItem(false)} onClick={() => navigate('/seller')}>
            <LayoutGrid size={20} />
            <span style={styles.navLabel(false)}>Bosh sahifa</span>
          </button>
          <button style={styles.navItem(true)}>
            <UtensilsCrossed size={20} />
            <span style={styles.navLabel(true)}>Menyu</span>
          </button>
          <button style={styles.navItem(false)} onClick={() => navigate('/seller/orders')}>
            <ShoppingBag size={20} />
            <span style={styles.navLabel(false)}>Buyurtmalar</span>
          </button>
          <button style={styles.navItem(false)} onClick={() => navigate('/seller/analytics')}>
            <BarChart3 size={20} />
            <span style={styles.navLabel(false)}>Statistika</span>
          </button>
          <button style={styles.navItem(false)} onClick={() => navigate('/seller/settings')}>
            <Settings size={20} />
            <span style={styles.navLabel(false)}>Sozlamalar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
