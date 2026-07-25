import { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, Percent, DollarSign, Clock, ToggleLeft, ToggleRight, Gift, Zap, Sun, Calendar } from 'lucide-react';
import useAdminStore from '../store/useAdminStore';
import Modal from '../components/Modal';

export default function PromotionsPage() {
  const { coupons, addCoupon, toggleCouponActive, deleteCoupon } = useAdminStore();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    code: '', discount: '', discountType: 'percent', minOrder: '', maxUses: '', expiresAt: '',
  });

  const handleSave = () => {
    if (editing) {
      // Update logic would go here
    } else {
      addCoupon({
        ...formData,
        discount: Number(formData.discount),
        minOrder: Number(formData.minOrder),
        maxUses: Number(formData.maxUses),
        isActive: true,
      });
    }
    setShowModal(false);
    setEditing(null);
    setFormData({ code: '', discount: '', discountType: 'percent', minOrder: '', maxUses: '', expiresAt: '' });
  };

  const handleEdit = (coupon) => {
    setEditing(coupon);
    setFormData({
      code: coupon.code,
      discount: coupon.discount,
      discountType: coupon.discountType,
      minOrder: coupon.minOrder,
      maxUses: coupon.maxUses,
      expiresAt: coupon.expiresAt,
    });
    setShowModal(true);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>Promotions & Coupons</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{coupons.length} active promotions</p>
        </div>
        <button
          onClick={() => { setEditing(null); setFormData({ code: '', discount: '', discountType: 'percent', minOrder: '', maxUses: '', expiresAt: '' }); setShowModal(true); }}
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
          <Plus size={16} /> Create Promotion
        </button>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tag size={18} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary)' }}>{coupons.filter((c) => c.isActive).length}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active</div>
          </div>
        </div>
        <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--color-success-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Percent size={18} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-success)' }}>{coupons.reduce((s, c) => s + c.usedCount, 0)}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Uses</div>
          </div>
        </div>
      </div>

      {/* Coupons List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {coupons.map((coupon) => (
          <div key={coupon.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '18px',
            borderRadius: '14px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 8px rgba(45, 42, 38, 0.03)',
            opacity: coupon.isActive ? 1 : 0.6,
          }}>
            {/* Code Badge */}
            <div style={{
              padding: '10px 16px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-terracotta))',
              color: 'white',
              fontSize: '14px',
              fontWeight: 800,
              letterSpacing: '0.05em',
              fontFamily: 'monospace',
            }}>
              {coupon.code}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: coupon.discountType === 'percent' ? 'var(--color-primary-light)' : 'var(--color-success-light)',
                  color: coupon.discountType === 'percent' ? 'var(--color-primary)' : 'var(--color-success)',
                  fontSize: '11px',
                  fontWeight: 600,
                }}>
                  {coupon.discountType === 'percent' ? `${coupon.discount}% OFF` : `${coupon.discount.toLocaleString()} so'm OFF`}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Min order: {coupon.minOrder.toLocaleString()} so'm
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Gift size={12} /> {coupon.usedCount}/{coupon.maxUses} used
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> Expires: {coupon.expiresAt}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => toggleCouponActive(coupon.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: coupon.isActive ? 'var(--color-success-light)' : 'var(--bg-secondary)',
                  color: coupon.isActive ? 'var(--color-success)' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {coupon.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                {coupon.isActive ? 'Active' : 'Inactive'}
              </button>
              <button
                onClick={() => handleEdit(coupon)}
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
                onClick={() => deleteCoupon(coupon.id)}
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
        title={editing ? 'Edit Promotion' : 'Create Promotion'}
        maxWidth="480px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Promo Code</label>
            <input
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. SUMMER30"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em', outline: 'none', fontFamily: 'monospace' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Discount Type</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setFormData({ ...formData, discountType: 'percent' })}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: `1.5px solid ${formData.discountType === 'percent' ? 'var(--color-primary)' : 'var(--border)'}`,
                  background: formData.discountType === 'percent' ? 'var(--color-primary-light)' : 'var(--bg-card)',
                  color: formData.discountType === 'percent' ? 'var(--color-primary)' : 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Percent size={14} /> Percentage
              </button>
              <button
                onClick={() => setFormData({ ...formData, discountType: 'fixed' })}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: `1.5px solid ${formData.discountType === 'fixed' ? 'var(--color-primary)' : 'var(--border)'}`,
                  background: formData.discountType === 'fixed' ? 'var(--color-primary-light)' : 'var(--bg-card)',
                  color: formData.discountType === 'fixed' ? 'var(--color-primary)' : 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <DollarSign size={14} /> Fixed Amount
              </button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Discount {formData.discountType === 'percent' ? '(%)' : '(so\'m)'}
              </label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                placeholder="0"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', fontSize: '13px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Min Order (so'm)</label>
              <input
                type="number"
                value={formData.minOrder}
                onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                placeholder="0"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', fontSize: '13px', outline: 'none' }}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Max Uses</label>
              <input
                type="number"
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                placeholder="100"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', fontSize: '13px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Expires At</label>
              <input
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--bg-secondary)', fontSize: '13px', outline: 'none' }}
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={!formData.code || !formData.discount}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: formData.code && formData.discount ? 'var(--color-primary)' : 'var(--bg-secondary)',
              color: formData.code && formData.discount ? 'white' : 'var(--text-muted)',
              border: 'none',
              fontSize: '14px',
              fontWeight: 700,
              cursor: formData.code && formData.discount ? 'pointer' : 'not-allowed',
              marginTop: '8px',
            }}
          >
            {editing ? 'Save Changes' : 'Create Promotion'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
