import { useState } from 'react';
import { Plus, Edit2, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import Modal from '../components/Modal';

const initialCategories = [
  { id: 1, name: 'Mini Burgers', icon: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200', isActive: true, order: 1, itemCount: 2 },
  { id: 2, name: 'Snack Pizza', icon: '🍕', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200', isActive: true, order: 2, itemCount: 2 },
  { id: 3, name: 'Chicken Bites', icon: '🍗', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=200', isActive: true, order: 3, itemCount: 2 },
  { id: 4, name: 'Hot Dogs', icon: '🌭', image: 'https://images.unsplash.com/photo-1612392062120-e5a0e2e4f5b4?w=200', isActive: true, order: 4, itemCount: 1 },
  { id: 5, name: 'Wraps & Lavash', icon: '🫓', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=200', isActive: true, order: 5, itemCount: 2 },
  { id: 6, name: 'Sides', icon: '🍟', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200', isActive: true, order: 6, itemCount: 1 },
  { id: 7, name: 'Drinks', icon: '🥤', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200', isActive: true, order: 7, itemCount: 1 },
  { id: 8, name: 'Desserts', icon: '🍦', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200', isActive: true, order: 8, itemCount: 1 },
];

const emojiOptions = ['🍔', '🍕', '🍗', '🌭', '🫓', '🍟', '🥤', '🍦', '🌮', '🌯', '🥗', '🥪', '🍱', '🥟', '🍜', '🍝'];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', icon: '🍔', image: '' });

  const handleSave = () => {
    if (editing) {
      setCategories(categories.map((c) => c.id === editing.id ? { ...c, ...formData } : c));
    } else {
      setCategories([...categories, {
        id: Date.now(),
        ...formData,
        isActive: true,
        order: categories.length + 1,
        itemCount: 0,
      }]);
    }
    setShowModal(false);
    setEditing(null);
    setFormData({ name: '', icon: '🍔', image: '' });
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setFormData({ name: cat.name, icon: cat.icon, image: cat.image });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this category?')) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  const handleToggleActive = (id) => {
    setCategories(categories.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>Categories</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{categories.length} categories</p>
        </div>
        <button
          onClick={() => { setEditing(null); setFormData({ name: '', icon: '🍔', image: '' }); setShowModal(true); }}
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
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Categories List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {categories.map((cat) => (
          <div key={cat.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '16px',
            borderRadius: '14px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 8px rgba(45, 42, 38, 0.03)',
            opacity: cat.isActive ? 1 : 0.6,
          }}>
            <GripVertical size={16} color="var(--text-muted)" style={{ cursor: 'grab' }} />
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{cat.name}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {cat.itemCount} items
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => handleToggleActive(cat.id)}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-secondary)',
                  cursor: 'pointer',
                  color: cat.isActive ? 'var(--color-success)' : 'var(--text-muted)',
                }}
              >
                {cat.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button
                onClick={() => handleEdit(cat)}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-secondary)',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid rgba(224, 49, 49, 0.2)',
                  background: 'var(--color-danger-light)',
                  cursor: 'pointer',
                  color: 'var(--color-danger)',
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditing(null); }}
        title={editing ? 'Edit Category' : 'Add Category'}
        maxWidth="420px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Category name"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', fontSize: '13px', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Icon</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setFormData({ ...formData, icon: emoji })}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    border: formData.icon === emoji ? '2px solid var(--color-primary)' : '1.5px solid var(--border)',
                    background: formData.icon === emoji ? 'var(--color-primary-light)' : 'var(--bg-card)',
                    fontSize: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {emoji}
                </button>
              ))}
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
            disabled={!formData.name}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: formData.name ? 'var(--color-primary)' : 'var(--bg-secondary)',
              color: formData.name ? 'white' : 'var(--text-muted)',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: formData.name ? 'pointer' : 'not-allowed',
            }}
          >
            {editing ? 'Save Changes' : 'Add Category'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
