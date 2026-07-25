import { useState } from 'react';
import { Plus, Edit2, Trash2, AlertTriangle, Package, TrendingDown, TrendingUp, Calendar, Truck } from 'lucide-react';
import useAdminStore from '../store/useAdminStore';
import Modal from '../components/Modal';

export default function InventoryPage() {
  const { inventory, updateInventoryStock, addInventoryItem, removeInventoryItem } = useAdminStore();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: '', stock: '', unit: 'pcs', lowStock: '', supplier: '', expiryDate: '', cost: '',
  });

  const lowStockItems = inventory.filter((i) => i.stock <= i.lowStock);
  const totalValue = inventory.reduce((s, i) => s + i.stock * i.cost, 0);

  const handleSave = () => {
    if (editing) {
      updateInventoryStock(editing.id, Number(formData.stock));
    } else {
      addInventoryItem({
        ...formData,
        stock: Number(formData.stock),
        lowStock: Number(formData.lowStock),
        cost: Number(formData.cost),
        lastPurchase: new Date().toISOString().split('T')[0],
      });
    }
    setShowModal(false);
    setEditing(null);
    setFormData({ name: '', stock: '', unit: 'pcs', lowStock: '', supplier: '', expiryDate: '', cost: '' });
  };

  const handleEdit = (item) => {
    setEditing(item);
    setFormData({
      name: item.name,
      stock: item.stock,
      unit: item.unit,
      lowStock: item.lowStock,
      supplier: item.supplier,
      expiryDate: item.expiryDate,
      cost: item.cost,
    });
    setShowModal(true);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>Inventory Management</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{inventory.length} items tracked</p>
        </div>
        <button
          onClick={() => { setEditing(null); setFormData({ name: '', stock: '', unit: 'pcs', lowStock: '', supplier: '', expiryDate: '', cost: '' }); setShowModal(true); }}
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
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={18} color="var(--color-primary)" />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{inventory.length}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Items</div>
            </div>
          </div>
        </div>
        <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-danger-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={18} color="var(--color-danger)" />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-danger)' }}>{lowStockItems.length}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Low Stock</div>
            </div>
          </div>
        </div>
        <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} color="var(--color-success)" />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-success)' }}>{(totalValue / 1000).toFixed(0)}K</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div style={{
          padding: '16px',
          borderRadius: '14px',
          background: 'var(--color-danger-light)',
          border: '1px solid rgba(224, 49, 49, 0.2)',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <AlertTriangle size={18} color="var(--color-danger)" />
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-danger)' }}>Low Stock Alert</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {lowStockItems.map((item) => (
              <span key={item.id} style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(224, 49, 49, 0.1)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-danger)',
              }}>
                {item.name}: {item.stock} {item.unit}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 80px',
          gap: '12px',
          padding: '14px 20px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          <div>Item</div>
          <div>Stock</div>
          <div>Low Alert</div>
          <div>Supplier</div>
          <div>Expiry</div>
          <div>Cost</div>
          <div>Actions</div>
        </div>

        {inventory.map((item) => {
          const isLow = item.stock <= item.lowStock;
          const isExpiring = new Date(item.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          return (
            <div key={item.id} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 80px',
              gap: '12px',
              padding: '14px 20px',
              borderBottom: '1px solid var(--border)',
              alignItems: 'center',
              background: isLow ? 'rgba(224, 49, 49, 0.03)' : 'transparent',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: isLow ? 'var(--color-danger-light)' : 'var(--color-success-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Package size={16} color={isLow ? 'var(--color-danger)' : 'var(--color-success)'} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: isLow ? 'var(--color-danger)' : 'var(--text-primary)' }}>
                {item.stock} {item.unit}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.lowStock} {item.unit}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.supplier}</div>
              <div style={{
                fontSize: '12px',
                color: isExpiring ? 'var(--color-danger)' : 'var(--text-muted)',
                fontWeight: isExpiring ? 600 : 400,
              }}>
                {item.expiryDate}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.cost.toLocaleString()} so'm</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => handleEdit(item)}
                  style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => removeInventoryItem(item.id)}
                  style={{ padding: '6px', borderRadius: '6px', border: '1px solid rgba(224, 49, 49, 0.2)', background: 'var(--color-danger-light)', cursor: 'pointer', color: 'var(--color-danger)' }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditing(null); }}
        title={editing ? 'Edit Item' : 'Add Item'}
        maxWidth="480px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Item Name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Beef Patties"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', fontSize: '13px', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', fontSize: '13px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', fontSize: '13px', outline: 'none' }}
              >
                {['pcs', 'kg', 'liters', 'bottles', 'heads', 'packs'].map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Low Stock Alert</label>
              <input
                type="number"
                value={formData.lowStock}
                onChange={(e) => setFormData({ ...formData, lowStock: e.target.value })}
                placeholder="0"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', fontSize: '13px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Cost (so'm)</label>
              <input
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="0"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', fontSize: '13px', outline: 'none' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Supplier</label>
            <input
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              placeholder="Supplier name"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', fontSize: '13px', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Expiry Date</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', fontSize: '13px', outline: 'none' }}
            />
          </div>
          <button
            onClick={handleSave}
            disabled={!formData.name || !formData.stock}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: formData.name && formData.stock ? 'var(--color-primary)' : 'var(--bg-secondary)',
              color: formData.name && formData.stock ? 'white' : 'var(--text-muted)',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: formData.name && formData.stock ? 'pointer' : 'not-allowed',
              marginTop: '8px',
            }}
          >
            {editing ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
