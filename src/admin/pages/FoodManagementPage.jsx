import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, TrendingUp, Search, Filter, Image, Tag } from 'lucide-react';
import useAdminStore from '../../store/useStore';
import Modal from '../components/Modal';

const mockFoods = [
  { id: 1, name: 'Mini Slider', price: 18000, discountPrice: 15000, category: 'Mini Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', isAvailable: true, isPopular: true, isRecommended: true, prepTime: 5, calories: 320 },
  { id: 2, name: 'Cheese Slider', price: 20000, discountPrice: null, category: 'Mini Burgers', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', isAvailable: true, isPopular: true, isRecommended: false, prepTime: 5, calories: 350 },
  { id: 3, name: 'Pizza Slice', price: 12000, discountPrice: 10000, category: 'Snack Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', isAvailable: true, isPopular: true, isRecommended: true, prepTime: 8, calories: 280 },
  { id: 4, name: 'Mini Margherita', price: 15000, discountPrice: null, category: 'Snack Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', isAvailable: true, isPopular: false, isRecommended: true, prepTime: 10, calories: 310 },
  { id: 5, name: '5pc Chicken Bites', price: 16000, discountPrice: 13000, category: 'Chicken Bites', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400', isAvailable: true, isPopular: true, isRecommended: true, prepTime: 6, calories: 290 },
  { id: 6, name: 'Wings 4pc', price: 22000, discountPrice: null, category: 'Chicken Bites', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400', isAvailable: true, isPopular: true, isRecommended: false, prepTime: 8, calories: 380 },
  { id: 7, name: 'Mini Lavash', price: 14000, discountPrice: 12000, category: 'Wraps & Lavash', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400', isAvailable: true, isPopular: true, isRecommended: true, prepTime: 5, calories: 260 },
  { id: 8, name: 'Mini Ice Cream', price: 8000, discountPrice: null, category: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400', isAvailable: true, isPopular: true, isRecommended: true, prepTime: 2, calories: 180 },
  { id: 9, name: 'Mini Hot Dog', price: 10000, discountPrice: 8000, category: 'Hot Dogs', image: 'https://images.unsplash.com/photo-1612392062120-e5a0e2e4f5b4?w=400', isAvailable: true, isPopular: false, isRecommended: true, prepTime: 4, calories: 220 },
  { id: 10, name: 'Small Lemonade', price: 6000, discountPrice: null, category: 'Drinks', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', isAvailable: true, isPopular: true, isRecommended: true, prepTime: 2, calories: 80 },
  { id: 11, name: 'Small Fries', price: 8000, discountPrice: 6000, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', isAvailable: true, isPopular: true, isRecommended: true, prepTime: 3, calories: 200 },
  { id: 12, name: 'Falafel Wrap', price: 12000, discountPrice: null, category: 'Wraps & Lavash', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400', isAvailable: true, isPopular: false, isRecommended: true, prepTime: 6, calories: 240 },
];

export default function FoodManagementPage() {
  const [foods, setFoods] = useState(mockFoods);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', discountPrice: '', category: 'Mini Burgers', image: '', prepTime: '', calories: '',
  });

  const categories = ['all', ...new Set(foods.map((f) => f.category))];

  const filteredFoods = foods.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || f.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleAvailability = (id) => {
    setFoods(foods.map((f) => f.id === id ? { ...f, isAvailable: !f.isAvailable } : f));
  };

  const handleTogglePopular = (id) => {
    setFoods(foods.map((f) => f.id === id ? { ...f, isPopular: !f.isPopular } : f));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this food item?')) {
      setFoods(foods.filter((f) => f.id !== id));
    }
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      price: food.price,
      discountPrice: food.discountPrice || '',
      category: food.category,
      image: food.image,
      prepTime: food.prepTime,
      calories: food.calories,
    });
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (editingFood) {
      setFoods(foods.map((f) => f.id === editingFood.id ? {
        ...f,
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        prepTime: Number(formData.prepTime),
        calories: Number(formData.calories),
      } : f));
    } else {
      setFoods([...foods, {
        id: Date.now(),
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        prepTime: Number(formData.prepTime),
        calories: Number(formData.calories),
        isAvailable: true,
        isPopular: false,
        isRecommended: false,
      }]);
    }
    setShowAddModal(false);
    setEditingFood(null);
    setFormData({ name: '', price: '', discountPrice: '', category: 'Mini Burgers', image: '', prepTime: '', calories: '' });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 200px' }}>
          <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                borderRadius: '10px',
                border: '1.5px solid var(--border)',
                background: 'var(--bg-card)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  border: '1.5px solid',
                  borderColor: filterCategory === cat ? 'var(--color-primary)' : 'var(--border)',
                  background: filterCategory === cat ? 'var(--color-primary)' : 'var(--bg-card)',
                  color: filterCategory === cat ? 'white' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => { setEditingFood(null); setFormData({ name: '', price: '', discountPrice: '', category: 'Mini Burgers', image: '', prepTime: '', calories: '' }); setShowAddModal(true); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Plus size={16} /> Add Food
        </button>
      </div>

      {/* Foods Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
      }}>
        {filteredFoods.map((food) => (
          <div key={food.id} style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 12px rgba(45, 42, 38, 0.04)',
            overflow: 'hidden',
            opacity: food.isAvailable ? 1 : 0.6,
          }}>
            {/* Image */}
            <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
              <img src={food.image} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {food.discountPrice && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  background: 'var(--color-danger)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 700,
                }}>
                  -{Math.round((1 - food.discountPrice / food.price) * 100)}%
                </div>
              )}
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                display: 'flex',
                gap: '6px',
              }}>
                <button
                  onClick={() => handleTogglePopular(food.id)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: food.isPopular ? 'var(--color-warning)' : 'rgba(255,255,255,0.9)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: food.isPopular ? 'white' : 'var(--text-muted)',
                  }}
                >
                  <Star size={14} fill={food.isPopular ? 'white' : 'none'} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{food.name}</h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{food.category}</p>
                </div>
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  background: food.isAvailable ? 'var(--color-success-light)' : 'var(--color-danger-light)',
                  color: food.isAvailable ? 'var(--color-success)' : 'var(--color-danger)',
                  fontSize: '10px',
                  fontWeight: 600,
                }}>
                  {food.isAvailable ? 'Active' : 'Hidden'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {(food.discountPrice || food.price).toLocaleString()} so'm
                </span>
                {food.discountPrice && (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    {food.price.toLocaleString()} so'm
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-secondary)', fontSize: '10px', color: 'var(--text-muted)' }}>
                  {food.prepTime} min
                </span>
                <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-secondary)', fontSize: '10px', color: 'var(--text-muted)' }}>
                  {food.calories} cal
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => handleToggleAvailability(food.id)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-secondary)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {food.isAvailable ? <EyeOff size={12} /> : <Eye size={12} />}
                  {food.isAvailable ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => handleEdit(food)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-secondary)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(food.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(224, 49, 49, 0.2)',
                    background: 'var(--color-danger-light)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-danger)',
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditingFood(null); }}
        title={editingFood ? 'Edit Food' : 'Add New Food'}
        maxWidth="480px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Food name"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', fontSize: '13px', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Price (so'm)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', fontSize: '13px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Discount Price</label>
              <input
                type="number"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                placeholder="Optional"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', fontSize: '13px', outline: 'none' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', fontSize: '13px', outline: 'none' }}
            >
              {['Mini Burgers', 'Snack Pizza', 'Chicken Bites', 'Hot Dogs', 'Wraps & Lavash', 'Sides', 'Drinks', 'Desserts'].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Prep Time (min)</label>
              <input
                type="number"
                value={formData.prepTime}
                onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                placeholder="5"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', fontSize: '13px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Calories</label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                placeholder="300"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', fontSize: '13px', outline: 'none' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Image URL</label>
            <input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', fontSize: '13px', outline: 'none' }}
            />
          </div>
          <button
            onClick={handleSave}
            disabled={!formData.name || !formData.price}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: formData.name && formData.price ? 'var(--color-primary)' : 'var(--bg-secondary)',
              color: formData.name && formData.price ? 'white' : 'var(--text-muted)',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: formData.name && formData.price ? 'pointer' : 'not-allowed',
              marginTop: '8px',
            }}
          >
            {editingFood ? 'Save Changes' : 'Add Food'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
