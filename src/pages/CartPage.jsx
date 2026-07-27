import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';
import EmptyState from '../components/EmptyState';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartItemQuantity, getCartTotal, user } = useStore();
  const totals = getCartTotal();
  const [removingId, setRemovingId] = useState(null);

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
    }, 300);
  };

  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8">
        <EmptyState
          icon="cart"
          title="Savatingiz bo'sh"
          description="Taomlarni ko'rish va buyurtma berishni boshlang"
          action="Menyu"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-36">
      <div className="p-4">
        <div className="flex items-center justify-between animate-fade-in" style={{ marginBottom: 16 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>Savat</h1>
          <span style={{ color: '#6b6b6b', fontSize: 12 }}>{cart.length} ta mahsulot</span>
        </div>

        <div className="space-y-3 stagger">
          {cart.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                padding: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                opacity: removingId === item.id ? 0 : 1,
                transform: removingId === item.id ? 'translateX(-20px)' : 'translateX(0)',
                transition: 'all .3s cubic-bezier(.4,0,.2,1)'
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, background: 'var(--surface-hover)' }}>
                <img src={item.food.image} alt={item.food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.food.name}</div>
                <div className="price-sm" style={{ marginTop: 2 }}>{(item.price * item.quantity).toLocaleString()} so'm</div>
              </div>
              <div className="flex items-center" style={{ gap: 2, background: 'var(--surface-hover)', borderRadius: 'var(--radius-sm)', padding: '2px 4px' }}>
                <button onClick={() => updateCartItemQuantity(item.id, -1)} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#b8b8b8', transition: 'color .2s' }}>
                  <Minus size={12} />
                </button>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => updateCartItemQuantity(item.id, 1)} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#b8b8b8', transition: 'color .2s' }}>
                  <Plus size={12} />
                </button>
              </div>
              <button onClick={() => handleRemove(item.id)} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#6b6b6b', transition: 'color .2s' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Price summary */}
        <div className="card animate-fade-in-up" style={{ marginTop: 16, padding: 16 }}>
          <div className="flex justify-between" style={{ fontSize: 12, marginBottom: 8 }}>
            <span style={{ color: '#6b6b6b' }}>Yetkazib berish</span>
            <span style={{ color: '#7fbf7f', fontWeight: 500 }}>bepul</span>
          </div>
          <div className="divider" />
          <div className="flex items-baseline justify-between" style={{ marginTop: 8 }}>
            <span style={{ color: '#b8b8b8', fontSize: 14 }}>Jami</span>
            <span style={{ fontFamily: 'var(--font-display)', color: '#e51e1e', fontSize: 22, fontWeight: 600 }}>
              {totals.total.toLocaleString()} so'm
            </span>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40" style={{ padding: '12px 16px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}>
        <div className="glass-floating" style={{ padding: '12px 16px' }}>
          <button onClick={() => navigate('/checkout')} className="btn btn-primary w-full" style={{ borderRadius: 'var(--radius)', minHeight: 50, fontSize: 15, fontWeight: 600 }}>
            <span>Buyurtma berish</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
