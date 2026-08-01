import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';
import EmptyState from '../components/EmptyState';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartItemQuantity, getCartTotal } = useStore();
  const totals = getCartTotal();
  const [removingId, setRemovingId] = useState(null);

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => { removeFromCart(id); setRemovingId(null); }, 300);
  };

  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8">
        <EmptyState icon="cart" title="Savatingiz bo'sh" description="Taomlarni ko'rish va buyurtma berishni boshlang" action="Menyu" onAction={() => navigate('/')} />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-36">
      <div className="p-4">
        <div className="flex items-center justify-between animate-fade-in" style={{ marginBottom: 16 }}>
          <h1 className="heading">Savat</h1>
          <span className="badge badge-neutral">{cart.length} ta mahsulot</span>
        </div>

        <div className="space-y-3 stagger">
          {cart.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                padding: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                opacity: removingId === item.id ? 0 : 1,
                transform: removingId === item.id ? 'translateX(-20px)' : 'translateX(0)',
                transition: 'all .3s var(--ease)',
              }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, background: 'var(--surface-active)' }}>
                <img src={item.food.image} alt={item.food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: 'var(--text)', fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.food.name}</div>
                <div className="price-sm" style={{ marginTop: 3 }}>{(item.price * item.quantity).toLocaleString()} so'm</div>
              </div>
              <div className="flex items-center" style={{ gap: 0, background: 'var(--surface-active)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <button onClick={() => updateCartItemQuantity(item.id, -1)} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <Minus size={14} />
                </button>
                <span style={{ color: 'var(--text)', fontSize: 14, fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => updateCartItemQuantity(item.id, 1)} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <Plus size={14} />
                </button>
              </div>
              <button onClick={() => handleRemove(item.id)} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', transition: 'color .2s' }}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Price summary */}
        <div className="card animate-fade-in-up" style={{ marginTop: 16, padding: 18 }}>
          <div className="flex justify-between" style={{ fontSize: 13, marginBottom: 10 }}>
            <span style={{ color: 'var(--text-muted)' }}>Yetkazib berish</span>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>bepul</span>
          </div>
          <div className="divider" />
          <div className="flex items-baseline justify-between" style={{ marginTop: 10 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Jami</span>
            <span className="price-hero" style={{ fontSize: 24 }}>
              {totals.total.toLocaleString()} so'm
            </span>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 z-40" style={{ bottom: 'calc(82px + env(safe-area-inset-bottom, 0px))', padding: '12px 16px' }}>
        <div style={{
          maxWidth: 480, margin: '0 auto',
          background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(20px) saturate(1.8)',
          borderRadius: 'var(--radius-lg)', padding: '10px',
          boxShadow: '0 -4px 20px rgba(0,0,0,.05)',
        }}>
          <button onClick={() => navigate('/checkout')} className="btn btn-primary w-full">
            <span>Buyurtma berish</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
