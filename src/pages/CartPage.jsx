import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, Tag, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';
import FoodCard from '../components/FoodCard';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartItemQuantity, getCartTotal, applyPromoCode, removeCoupon, appliedCoupon, foods } = useStore();
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
    const recommendedFoods = foods.filter(f => f.isPopular).slice(0, 4);

    return (
      <div className="h-full overflow-y-auto scrollbar-hide pb-24">
        <div className="empty-state">
          <div className="icon-wrapper">
            <div className="icon-circle orange">
              <ShoppingBag size={40} className="text-primary" />
            </div>
          </div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet. Explore our menu and find something delicious!</p>
          <button onClick={() => navigate('/')} className="btn btn-primary rounded-xl max-w-xs">
            Start Ordering <ArrowRight size={16} />
          </button>
        </div>

        {recommendedFoods.length > 0 && (
          <div className="px-4 mt-12">
            <div className="section-header">
              <h3>You might like</h3>
            </div>
            <div className="scroll-row scroll-fade">
              {recommendedFoods.map(food => <FoodCard key={food.id} food={food} compact />)}
            </div>
          </div>
        )}

        <div className="px-4 mt-8 mb-8">
          <div className="card p-5 text-center">
            <p className="text-secondary text-xs mb-3">Have a promo code?</p>
            <button onClick={() => navigate('/')} className="text-primary text-sm font-semibold flex items-center justify-center gap-1 mx-auto">
              Browse restaurants to use it <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-36">
      <div className="p-4 glass-strong sticky top-0 z-30">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold">My Cart ({cart.length})</h1>
          <button onClick={() => { cart.forEach(i => removeFromCart(i.id)); }} className="text-danger text-xs font-medium">Clear All</button>
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto vertical-list">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.food.image} alt={item.food.name} className="image" />
            <div className="info">
              <div className="header">
                <h4 className="name">{item.food.name}</h4>
                <button onClick={() => removeFromCart(item.id)} className="p-1 text-danger active:scale-90 transition-transform">
                  <Trash2 size={14} />
                </button>
              </div>
              {item.extras.length > 0 && (
                <p className="extras">{item.extras.map(e => e.name).join(', ')}</p>
              )}
              <div className="footer">
                <div className="quantity-selector">
                  <button onClick={() => updateCartItemQuantity(item.id, -1)} className="btn-qty">
                    <Minus size={12} />
                  </button>
                  <span className="count">{item.quantity}</span>
                  <button onClick={() => updateCartItemQuantity(item.id, 1)} className="btn-qty">
                    <Plus size={12} />
                  </button>
                </div>
                <span className="price">{(item.price * item.quantity).toLocaleString()} so'm</span>
              </div>
            </div>
          </div>
        ))}

        {/* Promo Code */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={14} className="text-primary" />
            <span className="text-sm font-semibold">Promo Code</span>
          </div>
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-success-alpha border border-success">
              <div>
                <span className="text-success font-bold text-sm">{appliedCoupon.code}</span>
                <span className="text-secondary text-xs ml-2">
                  {appliedCoupon.discountType === 'percent' ? `${appliedCoupon.discount}% off` : `${appliedCoupon.discount.toLocaleString()} so'm off`}
                </span>
              </div>
              <button onClick={removeCoupon} className="text-danger text-xs font-medium">Remove</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input value={promoCode} onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }} placeholder="Enter code"
                className="flex-1 input" />
              <button onClick={handleApplyPromo} className="px-4 rounded-xl bg-primary text-white text-sm font-semibold active:scale-95 transition-transform">Apply</button>
            </div>
          )}
          {promoError && <p className="text-danger text-xs mt-2">{promoError}</p>}
        </div>

        {/* Price Breakdown */}
        <div className="card p-4">
          <div className="flex flex-col gap-2.5">
            <div className="price-row"><span className="label">Subtotal</span><span>{totals.subtotal.toLocaleString()} so'm</span></div>
            <div className="price-row"><span className="label">Delivery Fee</span><span>{totals.deliveryFee === 0 ? <span className="text-success font-medium">Free</span> : `${totals.deliveryFee.toLocaleString()} so'm`}</span></div>
            <div className="price-row"><span className="label">Service Fee</span><span>{totals.serviceFee.toLocaleString()} so'm</span></div>
            <div className="price-row"><span className="label">Tax</span><span>-{totals.tax.toLocaleString()} so'm</span></div>
            {totals.discount > 0 && <div className="price-row"><span className="text-success">Discount</span><span className="text-success">-{totals.discount.toLocaleString()} so'm</span></div>}
            <div className="price-row total"><span>Total</span><span className="value">{totals.total.toLocaleString()} so'm</span></div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="fixed bottom-16 left-0 right-0 p-4 glass-strong border-top z-40">
        <div className="max-w-lg mx-auto">
          <button onClick={() => navigate('/checkout')} className="btn btn-primary flex items-center justify-center gap-2">
            Proceed to Checkout <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
