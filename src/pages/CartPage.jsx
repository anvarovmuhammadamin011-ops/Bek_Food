import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, Tag, ChevronRight, ShoppingBag, ArrowRight, Check, Truck, Info, X, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';
import FoodCard from '../components/FoodCard';

/* ═══════════════════════════════════════
   Empty Cart State
   ═══════════════════════════════════════ */
function EmptyCart({ navigate, foods }) {
  const recommendedFoods = foods.filter(f => f.isPopular).slice(0, 6);

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Empty state */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '64px 32px', textAlign: 'center',
        animation: 'fadeIn 0.4s ease-out',
      }}>
        <div style={{
          width: '100px', height: '100px', borderRadius: '50%',
          background: 'var(--color-primary-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '24px', position: 'relative',
        }}>
          <ShoppingBag size={44} color="var(--color-primary)" />
          <div style={{
            position: 'absolute', bottom: '-4px', right: '-4px',
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'var(--bg-card)', border: '2px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <span style={{ fontSize: '14px' }}>🍔</span>
          </div>
        </div>
        <h3 style={{
          fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)',
          letterSpacing: '-0.02em', marginBottom: '8px',
        }}>
          Your cart is empty
        </h3>
        <p style={{
          color: 'var(--text-secondary)', fontSize: '14px',
          maxWidth: '280px', lineHeight: 1.6, marginBottom: '28px',
        }}>
          Looks like you haven't added anything yet. Explore our menu and find something delicious!
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '14px 32px', borderRadius: '16px',
            background: 'var(--color-primary)', color: 'white',
            border: 'none', fontSize: '15px', fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 6px 24px rgba(232, 89, 12, 0.30)',
            transition: 'all 0.25s ease', fontFamily: 'var(--font-family)',
          }}
        >
          Start Ordering <ArrowRight size={18} />
        </button>
      </div>

      {/* Recommended foods */}
      {recommendedFoods.length > 0 && (
        <div style={{ padding: '0 16px', marginTop: '16px' }}>
          <h3 style={{
            fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)',
            letterSpacing: '-0.02em', marginBottom: '12px',
          }}>
            You might like
          </h3>
          <div style={{
            display: 'flex', gap: '10px', overflowX: 'auto',
            paddingBottom: '4px', margin: '0 -16px',
            paddingLeft: '16px', paddingRight: '16px',
            WebkitOverflowScrolling: 'touch',
          }}>
            {recommendedFoods.map(food => (
              <div key={food.id} style={{ scrollSnapAlign: 'start' }}>
                <FoodCard food={food} compact />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Promo hint */}
      <div style={{ padding: '0 16px', marginTop: '32px' }}>
        <div style={{
          background: 'var(--bg-card)', borderRadius: '16px',
          padding: '20px', border: '1px solid var(--border)',
          boxShadow: '0 2px 12px rgba(45,42,38,0.05)',
          textAlign: 'center',
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px' }}>
            Have a promo code?
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
              margin: '0 auto', background: 'none', border: 'none',
              color: 'var(--color-primary)', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'var(--font-family)',
            }}
          >
            Browse restaurants to use it <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   Cart Item
   ═══════════════════════════════════════ */
function CartItem({ item, onRemove, onUpdateQty }) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(item.foodId), 300);
  };

  return (
    <div style={{
      display: 'flex', gap: '14px',
      background: 'var(--bg-card)', borderRadius: '16px',
      padding: '14px', border: '1px solid var(--border)',
      boxShadow: '0 2px 12px rgba(45,42,38,0.04)',
      transition: 'all 0.3s ease',
      opacity: removing ? 0 : 1,
      transform: removing ? 'translateX(-20px) scale(0.95)' : 'none',
      animation: 'slideUp 0.3s ease-out',
    }}>
      {/* Food image */}
      <div style={{
        width: '72px', height: '72px', borderRadius: '14px',
        overflow: 'hidden', flexShrink: 0, background: 'var(--bg-secondary)',
      }}>
        <img
          src={item.food.image}
          alt={item.food.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {/* Top: name + delete */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ minWidth: 0 }}>
            <h4 style={{
              fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {item.food.name}
            </h4>
            {item.extras.length > 0 && (
              <p style={{
                fontSize: '11px', color: 'var(--color-primary)',
                marginTop: '2px', fontWeight: 500,
              }}>
                {item.extras.map(e => e.name).join(', ')}
              </p>
            )}
            {item.notes && (
              <p style={{
                fontSize: '10px', color: 'var(--text-muted)',
                marginTop: '2px', fontStyle: 'italic',
              }}>
                "{item.notes}"
              </p>
            )}
          </div>
          <button
            onClick={handleRemove}
            style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: 'var(--color-danger-light)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--color-danger)',
              transition: 'all 0.2s ease', flexShrink: 0,
            }}
            aria-label={`Remove ${item.food.name} from cart`}
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Bottom: quantity + price */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
          {/* Quantity selector */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '2px',
            background: 'var(--bg-secondary)', borderRadius: '12px',
            padding: '3px', border: '1px solid var(--border)',
          }}>
            <button
              onClick={() => onUpdateQty(item.foodId, -1)}
              style={{
                width: '30px', height: '30px', borderRadius: '9px',
                background: 'var(--bg-card)', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text-primary)',
                boxShadow: '0 1px 2px rgba(45,42,38,0.06)',
                transition: 'all 0.15s ease',
              }}
              aria-label="Decrease quantity"
            >
              <Minus size={12} strokeWidth={2.5} />
            </button>
            <span style={{
              fontSize: '14px', fontWeight: 800, minWidth: '28px',
              textAlign: 'center', color: 'var(--text-primary)',
            }}>
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQty(item.foodId, 1)}
              style={{
                width: '30px', height: '30px', borderRadius: '9px',
                background: 'var(--color-primary)', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'white',
                boxShadow: '0 2px 8px rgba(232, 89, 12, 0.25)',
                transition: 'all 0.15s ease',
              }}
              aria-label="Increase quantity"
            >
              <Plus size={12} strokeWidth={2.5} />
            </button>
          </div>

          {/* Price */}
          <span style={{
            fontSize: '15px', fontWeight: 800, color: 'var(--color-primary)',
          }}>
            {(item.price * item.quantity).toLocaleString()} so'm
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN CART PAGE
   ═══════════════════════════════════════ */
export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartItemQuantity, getCartTotal, applyPromoCode, removeCoupon, appliedCoupon, foods } = useStore();
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(false);
  const totals = getCartTotal();

  const handleApplyPromo = () => {
    if (!promoCode) return;
    const ok = applyPromoCode(promoCode);
    if (ok) {
      setPromoError('');
      setPromoSuccess(true);
      setPromoCode('');
      setTimeout(() => setPromoSuccess(false), 2000);
    } else {
      setPromoError('Invalid promo code');
      setPromoSuccess(false);
    }
  };

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const freeDeliveryThreshold = 50000;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - totals.subtotal);
  const freeDeliveryProgress = Math.min(100, (totals.subtotal / freeDeliveryThreshold) * 100);

  /* ── Empty cart ── */
  if (cart.length === 0) {
    return (
      <div className="h-full overflow-y-auto scrollbar-hide">
        <EmptyCart navigate={navigate} foods={foods} />
      </div>
    );
  }

  /* ── Filled cart ── */
  return (
    <div className="h-full overflow-y-auto scrollbar-hide" style={{ paddingBottom: '120px' }}>
      {/* ── Sticky Header ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30, padding: '12px 16px',
        background: 'rgba(255, 248, 241, 0.88)', backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              My Cart
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '1px' }}>
              {totalItems} item{totalItems !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => { if (window.confirm('Clear all items from cart?')) cart.forEach(i => removeFromCart(i.foodId)); }}
            style={{
              padding: '6px 14px', borderRadius: '9999px',
              background: 'var(--color-danger-light)', border: 'none',
              color: 'var(--color-danger)', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s ease',
              fontFamily: 'var(--font-family)',
            }}
          >
            Clear All
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* ── Free Delivery Banner ── */}
        {amountToFreeDelivery > 0 ? (
          <div style={{
            background: 'var(--bg-card)', borderRadius: '16px',
            padding: '14px 16px', border: '1px solid var(--border)',
            boxShadow: '0 2px 12px rgba(45,42,38,0.04)',
            animation: 'slideUp 0.3s ease-out',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Truck size={14} color="var(--color-primary)" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Add {amountToFreeDelivery.toLocaleString()} so'm more for <span style={{ color: 'var(--color-success)' }}>free delivery</span>
              </span>
            </div>
            <div style={{
              height: '6px', borderRadius: '3px',
              background: 'var(--bg-secondary)', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: '3px',
                background: 'linear-gradient(90deg, var(--color-primary), var(--color-success))',
                transition: 'width 0.5s ease',
                width: `${freeDeliveryProgress}%`,
              }} />
            </div>
          </div>
        ) : (
          <div style={{
            background: 'var(--color-success-light)', borderRadius: '16px',
            padding: '12px 16px', border: '1px solid rgba(43, 138, 62, 0.15)',
            display: 'flex', alignItems: 'center', gap: '8px',
            animation: 'slideUp 0.3s ease-out',
          }}>
            <Check size={14} color="var(--color-success)" strokeWidth={2.5} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-success)' }}>
              You've unlocked free delivery!
            </span>
          </div>
        )}

        {/* ── Cart Items ── */}
        {cart.map(item => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={removeFromCart}
            onUpdateQty={updateCartItemQuantity}
          />
        ))}

        {/* ── Promo Code ── */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: '16px',
          padding: '16px', border: '1px solid var(--border)',
          boxShadow: '0 2px 12px rgba(45,42,38,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'var(--color-primary-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Tag size={13} color="var(--color-primary)" />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Promo Code</span>
          </div>

          {appliedCoupon ? (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 14px', borderRadius: '12px',
              background: 'var(--color-success-light)',
              border: '1px solid rgba(43, 138, 62, 0.2)',
              animation: 'scaleIn 0.3s ease-out',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={14} color="var(--color-success)" strokeWidth={2.5} />
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-success)' }}>{appliedCoupon.code}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '6px' }}>
                    {appliedCoupon.discountType === 'percent' ? `${appliedCoupon.discount}% off` : `${appliedCoupon.discount.toLocaleString()} so'm off`}
                  </span>
                </div>
              </div>
              <button
                onClick={removeCoupon}
                style={{
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: 'rgba(224, 49, 49, 0.1)', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--color-danger)',
                  transition: 'all 0.2s ease',
                }}
                aria-label="Remove promo code"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                value={promoCode}
                onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); }}
                placeholder="Enter code"
                style={{
                  flex: 1, background: 'var(--bg-secondary)', border: '1.5px solid var(--border)',
                  borderRadius: '12px', padding: '12px 14px', fontSize: '14px',
                  color: 'var(--text-primary)', fontFamily: 'var(--font-family)',
                  letterSpacing: '0.05em', fontWeight: 600,
                  transition: 'all 0.2s ease',
                }}
              />
              <button
                onClick={handleApplyPromo}
                disabled={!promoCode}
                style={{
                  padding: '0 20px', borderRadius: '12px',
                  background: promoCode ? 'var(--color-primary)' : 'var(--bg-secondary)',
                  color: promoCode ? 'white' : 'var(--text-muted)',
                  border: 'none', fontSize: '13px', fontWeight: 700,
                  cursor: promoCode ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease', fontFamily: 'var(--font-family)',
                }}
              >
                Apply
              </button>
            </div>
          )}

          {promoError && (
            <p style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: '8px', fontWeight: 500 }}>
              {promoError}
            </p>
          )}
          {promoSuccess && (
            <p style={{ fontSize: '12px', color: 'var(--color-success)', marginTop: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={12} /> Promo code applied!
            </p>
          )}
        </div>

        {/* ── Price Breakdown ── */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: '16px',
          padding: '16px', border: '1px solid var(--border)',
          boxShadow: '0 2px 12px rgba(45,42,38,0.04)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Subtotal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{totals.subtotal.toLocaleString()} so'm</span>
            </div>

            {/* Delivery */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Delivery</span>
                <div style={{ position: 'relative' }}>
                  <Info size={12} color="var(--text-muted)" style={{ cursor: 'help' }} />
                </div>
              </div>
              <span style={{
                fontWeight: 600,
                color: totals.deliveryFee === 0 ? 'var(--color-success)' : 'var(--text-primary)',
              }}>
                {totals.deliveryFee === 0 ? 'Free' : `${totals.deliveryFee.toLocaleString()} so'm`}
              </span>
            </div>

            {/* Service Fee */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Service Fee</span>
              </div>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{totals.serviceFee.toLocaleString()} so'm</span>
            </div>

            {/* Tax */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tax</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{totals.tax.toLocaleString()} so'm</span>
            </div>

            {/* Discount */}
            {totals.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Discount</span>
                <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>-{totals.discount.toLocaleString()} so'm</span>
              </div>
            )}

            {/* Divider + Total */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>Total</span>
                <span style={{ fontSize: '20px', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>
                  {totals.total.toLocaleString()} so'm
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Checkout Bar ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 12px',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 76px)',
      }}>
        <div style={{
          maxWidth: '480px', margin: '0 auto',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid var(--border)',
          boxShadow: '0 -4px 32px rgba(45, 42, 38, 0.10), 0 0 1px rgba(45, 42, 38, 0.08)',
          padding: '12px',
        }}>
          {/* Summary row */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '10px', padding: '0 4px',
          }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {totalItems} item{totalItems !== 1 ? 's' : ''}
            </span>
            <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>
              {totals.total.toLocaleString()} so'm
            </span>
          </div>

          {/* Checkout button */}
          <button
            onClick={() => navigate('/checkout')}
            style={{
              width: '100%', padding: '16px', borderRadius: '16px',
              background: 'var(--color-primary)', color: 'white',
              border: 'none', fontSize: '15px', fontWeight: 800,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
              boxShadow: '0 6px 24px rgba(232, 89, 12, 0.30)',
              transition: 'all 0.25s ease', fontFamily: 'var(--font-family)',
              letterSpacing: '-0.01em',
            }}
          >
            Proceed to Checkout <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
