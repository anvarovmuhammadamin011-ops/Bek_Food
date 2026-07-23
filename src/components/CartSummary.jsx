import useStore from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';

export default function CartSummary() {
  const navigate = useNavigate();
  const cart = useStore((s) => s.cart);
  const getCartTotal = useStore((s) => s.getCartTotal);
  if (cart.length === 0) return null;

  const { total } = getCartTotal();
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 max-w-lg mx-auto">
      <button
        onClick={() => navigate('/cart')}
        className="w-full flex items-center justify-between p-4 rounded-2xl btn-primary animate-slide-up"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 bg-white text-accent-orange text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {itemCount}
            </span>
          </div>
          <span className="font-semibold text-sm">View Cart</span>
        </div>
        <span className="font-bold">{total.toLocaleString()} so'm</span>
      </button>
    </div>
  );
}
