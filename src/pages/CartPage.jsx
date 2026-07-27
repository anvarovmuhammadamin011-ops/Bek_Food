import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import useStore from '../store/useStore';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartItemQuantity, getCartTotal, user } = useStore();
  const totals = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 text-center">
        <div className="empty-state-icon">
          <ShoppingBag size={24} />
        </div>
        <h2 style={{ color: '#fff', fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Savatingiz bo'sh</h2>
        <p className="text-muted" style={{ fontSize: 12, marginBottom: 24 }}>Taomlarni ko'rish va buyurtma berishni boshlang</p>
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ borderRadius: 10, padding: '13px 32px' }}>Menyu</button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-36">
      <div className="p-4">
        <h1 style={{ color: '#fff', fontSize: 15, fontWeight: 500, marginBottom: 14 }}>Savat</h1>

        {cart.map((item) => (
          <div key={item.id} className="flex items-center" style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: 38, height: 38, background: '#1e1e1e', borderRadius: 8, overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={item.food.image} alt={item.food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, marginLeft: 10 }}>
              <div style={{ color: '#fff', fontSize: 11, fontWeight: 500 }}>{item.food.name}</div>
              <div className="price-sm">{(item.price * item.quantity).toLocaleString()}</div>
            </div>
            <div className="flex items-center" style={{ gap: 8, background: '#141414', borderRadius: 6, padding: '3px 6px' }}>
              <button onClick={() => updateCartItemQuantity(item.id, -1)} style={{ color: '#b8b8b8', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 11 }}>−</button>
              <span style={{ color: '#fff', fontSize: 11 }}>{item.quantity}</span>
              <button onClick={() => updateCartItemQuantity(item.id, 1)} style={{ color: '#b8b8b8', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 11 }}>+</button>
            </div>
          </div>
        ))}

        {/* Price breakdown */}
        <div style={{ marginTop: 14 }}>
          <div className="flex justify-between" style={{ color: '#7a7a7a', fontSize: 11, marginBottom: 4 }}>
            <span>Yetkazib berish</span><span style={{ color: '#7fbf7f' }}>bepul</span>
          </div>
          <div className="flex items-baseline justify-between" style={{ marginBottom: 14 }}>
            <span style={{ color: '#b8b8b8', fontSize: 12 }}>Jami</span>
            <span style={{ fontFamily: 'var(--font-display)', color: '#e51e1e', fontSize: 20, fontWeight: 600 }}>{totals.total.toLocaleString()} so'm</span>
          </div>
        </div>
      </div>

      {/* Sticky bottom */}
      <div className="fixed bottom-0 inset-x-0 z-40" style={{ padding: '16px', background: 'rgba(10,10,10,.9)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => navigate('/checkout')} className="btn btn-primary w-full" style={{ borderRadius: 10 }}>
          Buyurtma berish
        </button>
      </div>
    </div>
  );
}
