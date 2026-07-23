import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, Tag, ChevronRight, ShoppingBag } from 'lucide-react';
import useStore from '../store/useStore';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartItemQuantity, getCartTotal, applyPromoCode, removeCoupon, appliedCoupon } = useStore();
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const totals = getCartTotal();

  const handleApplyPromo = () => {
    if (!promoCode) return;
    const ok = applyPromoCode(promoCode);
    setPromoError(ok ? '' : 'Invalid promo code');
    if (ok) setPromoCode('');
  };

  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 text-center bg-bg-primary">
        <div className="w-16 h-16 rounded-full bg-bg-card border border-border flex items-center justify-center mb-4">
          <ShoppingBag size={24} className="text-text-secondary" />
        </div>
        <h2 className="text-base font-bold mb-1.5 text-white">Your cart is empty</h2>
        <p className="text-text-secondary text-xs mb-6">Add some delicious food to get started</p>
        <button onClick={() => navigate('/')} className="btn-primary rounded-xl max-w-xs py-3.5">Browse Restaurants</button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-36">
      <div className="p-4 glass-strong sticky top-0 z-30">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold">My Cart ({cart.length})</h1>
          <button onClick={() => { cart.forEach(i => removeFromCart(i.id)); }} className="text-accent-red text-xs font-medium">Clear All</button>
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-3">
        {cart.map(item => (
          <div key={item.id} className="flex gap-3 bg-bg-card rounded-2xl p-3 border border-border animate-slide-up">
            <img src={item.food.image} alt={item.food.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <h4 className="font-semibold text-sm truncate">{item.food.name}</h4>
                <button onClick={() => removeFromCart(item.id)} className="p-1 text-accent-red active:scale-90 transition-transform">
                  <Trash2 size={14} />
                </button>
              </div>
              {item.extras.length > 0 && (
                <p className="text-[10px] text-accent-orange mt-0.5">{item.extras.map(e => e.name).join(', ')}</p>
              )}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 bg-bg-primary rounded-lg px-1">
                  <button onClick={() => updateCartItemQuantity(item.id, -1)} className="p-1.5 rounded-md active:scale-90 transition-transform"><Minus size={12} /></button>
                  <span className="text-sm font-bold min-w-[20px] text-center">{item.quantity}</span>
                  <button onClick={() => updateCartItemQuantity(item.id, 1)} className="p-1.5 rounded-md active:scale-90 transition-transform"><Plus size={12} /></button>
                </div>
                <span className="text-accent-orange font-bold text-sm">{(item.price * item.quantity).toLocaleString()} so'm</span>
              </div>
            </div>
          </div>
        ))}

        {/* Promo Code */}
        <div className="bg-bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={14} className="text-accent-orange" />
            <span className="text-sm font-semibold">Promo Code</span>
          </div>
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-success/10 border border-success/30">
              <div>
                <span className="text-success font-bold text-sm">{appliedCoupon.code}</span>
                <span className="text-text-secondary text-xs ml-2">
                  {appliedCoupon.discountType === 'percent' ? `${appliedCoupon.discount}% off` : `${appliedCoupon.discount.toLocaleString()} so'm off`}
                </span>
              </div>
              <button onClick={removeCoupon} className="text-accent-red text-xs font-medium">Remove</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input value={promoCode} onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }} placeholder="Enter code"
                className="flex-1 bg-bg-primary border border-border rounded-xl py-2.5 px-3 text-sm focus:border-accent-orange focus:outline-none transition-colors placeholder:text-text-muted" />
              <button onClick={handleApplyPromo} className="px-4 rounded-xl bg-accent-orange text-white text-sm font-semibold active:scale-95 transition-transform">Apply</button>
            </div>
          )}
          {promoError && <p className="text-accent-red text-xs mt-2">{promoError}</p>}
        </div>

        {/* Price Breakdown */}
        <div className="bg-bg-card rounded-2xl p-4 border border-border space-y-2.5">
          <div className="flex justify-between text-sm"><span className="text-text-secondary">Subtotal</span><span>{totals.subtotal.toLocaleString()} so'm</span></div>
          <div className="flex justify-between text-sm"><span className="text-text-secondary">Delivery Fee</span><span>{totals.deliveryFee === 0 ? <span className="text-success font-medium">Free</span> : `${totals.deliveryFee.toLocaleString()} so'm`}</span></div>
          <div className="flex justify-between text-sm"><span className="text-text-secondary">Service Fee</span><span>{totals.serviceFee.toLocaleString()} so'm</span></div>
          <div className="flex justify-between text-sm"><span className="text-text-secondary">Tax</span><span>-{totals.tax.toLocaleString()} so'm</span></div>
          {totals.discount > 0 && <div className="flex justify-between text-sm"><span className="text-success">Discount</span><span className="text-success">-{totals.discount.toLocaleString()} so'm</span></div>}
          <div className="border-t border-border pt-2.5 flex justify-between font-bold"><span>Total</span><span className="text-accent-orange">{totals.total.toLocaleString()} so'm</span></div>
        </div>
      </div>

      {/* Bottom */}
      <div className="fixed bottom-16 left-0 right-0 p-4 glass-strong border-t border-border z-40">
        <div className="max-w-lg mx-auto">
          <button onClick={() => navigate('/checkout')} className="w-full btn-primary flex items-center justify-center gap-2">
            Proceed to Checkout <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
