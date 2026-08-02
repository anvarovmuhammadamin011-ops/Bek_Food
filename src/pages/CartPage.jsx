import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, Truck, Store, Clock, Tag, Check, X } from 'lucide-react';
import useStore from '../store/useStore';
import EmptyState from '../components/EmptyState';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartItemQuantity, getCartTotal, foods, addToCart, applyPromoCode, removeCoupon, appliedCoupon } = useStore();
  const totals = getCartTotal();
  const [removingId, setRemovingId] = useState(null);
  const [delivery, setDelivery] = useState('delivery');
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState(null);
  const [promoError, setPromoError] = useState(false);
  const [addedSugg, setAddedSugg] = useState(null);

  const suggestions = foods.filter((f) => (f.categoryId || 0) >= 7).slice(0, 4);

  const handleRemove = (id) => {
    setRemovingId(id);
    setTimeout(() => { removeFromCart(id); setRemovingId(null); }, 300);
  };

  const quickAdd = (food) => {
    addToCart(food);
    setAddedSugg(food.id);
    setTimeout(() => setAddedSugg(null), 600);
  };

  const handleApplyPromo = () => {
    const code = promoInput.trim();
    if (!code) return;
    if (applyPromoCode(code, totals.subtotal)) {
      setPromoMsg({ code: code.toUpperCase(), text: "Chegirma qo'llandi" });
      setPromoError(false);
      setPromoInput('');
    } else {
      setPromoError(true);
      setPromoMsg({ code: code.toUpperCase(), text: 'Kod noto\'g\'ri yoki amal qilmagan' });
    }
  };

  const handleRemovePromo = () => {
    removeCoupon();
    setPromoMsg(null);
    setPromoError(false);
  };

  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8">
        <EmptyState icon="cart" title="Savatingiz bo'sh" description="Taomlarni ko'rish va buyurtma berishni boshlang" action="Menyu" onAction={() => navigate('/')} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-36">
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
                <img src={item.food.image} alt={item.food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/food/placeholder.svg'; }} />
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

        {/* Delivery / Pickup toggle */}
        <div className="card animate-fade-in-up" style={{ marginTop: 16, padding: 14 }}>
          <div className="flex p-1" style={{ background: 'var(--surface-active)', borderRadius: 'var(--radius)', gap: 4 }}>
            {[{ key: 'delivery', label: 'Yetkazib berish', icon: Truck }, { key: 'pickup', label: "O'zim olib ketaman", icon: Store }].map((m) => (
              <button key={m.key} onClick={() => setDelivery(m.key)} className="flex-1 flex items-center justify-center" style={{
                gap: 6, padding: '10px 0', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all .25s', fontWeight: 600, fontSize: 13,
                background: delivery === m.key ? 'var(--primary)' : 'transparent',
                color: delivery === m.key ? '#fff' : 'var(--text-muted)',
                boxShadow: delivery === m.key ? 'var(--shadow-primary)' : 'none', border: 'none',
              }}>
                <m.icon size={15} /> {m.label}
              </button>
            ))}
          </div>
          {delivery === 'delivery' ? (
            <div className="flex items-center" style={{ gap: 8, marginTop: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={15} color="var(--primary)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>25-35 daqiqada yetkazamiz</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Chinobod, Oqtepa ko'chasi, 15</div>
              </div>
              <button onClick={() => navigate('/checkout')} style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>O'zgartirish</button>
            </div>
          ) : (
            <div className="flex items-center" style={{ gap: 8, marginTop: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: 'var(--success-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Store size={15} color="var(--success)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>Olib ketish: 10-15 daqiqa</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>BEK FOOD Chinobod</div>
              </div>
            </div>
          )}
        </div>

        {/* Cross-selling */}
        {suggestions.length > 0 && (
          <div className="card animate-fade-in-up" style={{ marginTop: 16, padding: 14 }}>
            <h3 className="subheading" style={{ marginBottom: 12 }}>Ichimlik yoki sous qo'shasizmi?</h3>
            <div className="flex overflow-x-auto scrollbar-hide" style={{ gap: 10, paddingBottom: 4 }}>
              {suggestions.map((f) => (
                <div key={f.id} style={{ minWidth: 110, borderRadius: 'var(--radius)', background: 'var(--surface-active)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                  <div style={{ position: 'relative' }}>
                    <img src={f.image} alt="" style={{ width: '100%', height: 72, objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/food/placeholder.svg'; }} />
                    <button onClick={() => quickAdd(f)} className="flex items-center justify-center" style={{
                      position: 'absolute', bottom: 6, right: 6, width: 26, height: 26, borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
                      background: addedSugg === f.id ? 'var(--success)' : 'var(--bg)', boxShadow: '0 2px 8px rgba(0,0,0,.12)', transition: 'all .2s',
                    }}>
                      {addedSugg === f.id ? <Check size={13} color="var(--success)" /> : <Plus size={13} color="var(--primary)" strokeWidth={2.5} />}
                    </button>
                  </div>
                  <div style={{ padding: '8px 10px' }}>
                    <div style={{ color: 'var(--text)', fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                    <div className="price-sm" style={{ fontSize: 12, marginTop: 2 }}>{f.price.toLocaleString()} so'm</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Promo */}
        <div className="card animate-fade-in-up" style={{ marginTop: 16, padding: 14 }}>
          <div className="flex items-center" style={{ gap: 8, marginBottom: 10 }}>
            <Tag size={15} color="var(--primary)" />
            <h3 className="subheading" style={{ fontSize: 14 }}>Promokodingiz bormi?</h3>
          </div>
          {appliedCoupon ? (
            <div className="flex items-center justify-between" style={{ padding: '12px 14px', borderRadius: 'var(--radius)', background: 'var(--success-light)', border: '1px solid rgba(34,197,94,.2)' }}>
              <div className="flex items-center" style={{ gap: 8 }}>
                <Tag size={15} color="var(--success)" />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--success)' }}>{appliedCoupon.code}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>-{totals.discount.toLocaleString()} so'm chegirma</div>
                </div>
              </div>
              <button onClick={handleRemovePromo} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <div className="flex" style={{ gap: 8 }}>
                <input
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                  placeholder="Kodni kiriting" className="input" style={{ flex: 1, textTransform: 'uppercase', letterSpacing: '.04em' }}
                />
                <button onClick={handleApplyPromo} className="btn btn-primary" style={{ whiteSpace: 'nowrap', minHeight: 44 }}>Qo'llash</button>
              </div>
              {promoMsg && <div style={{ fontSize: 12, marginTop: 8, color: promoError ? 'var(--danger)' : 'var(--success)', fontWeight: 500 }}>{promoMsg.text}</div>}
            </>
          )}
        </div>

        {/* Price summary */}
        <div className="card animate-fade-in-up" style={{ marginTop: 16, padding: 18 }}>
          <div className="flex justify-between" style={{ fontSize: 13, marginBottom: 10 }}>
            <span style={{ color: 'var(--text-muted)' }}>Mahsulotlar ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
            <span style={{ color: 'var(--text)' }}>{totals.subtotal.toLocaleString()} so'm</span>
          </div>
          <div className="flex justify-between" style={{ fontSize: 13, marginBottom: 10 }}>
            <span style={{ color: 'var(--text-muted)' }}>Xizmat haqi (2%)</span>
            <span style={{ color: 'var(--text)' }}>+{totals.serviceFee.toLocaleString()} so'm</span>
          </div>
          <div className="flex justify-between" style={{ fontSize: 13, marginBottom: 10 }}>
            <span style={{ color: 'var(--text-muted)' }}>Soliq (1%)</span>
            <span style={{ color: 'var(--text)' }}>-{totals.tax.toLocaleString()} so'm</span>
          </div>
          <div className="flex justify-between" style={{ fontSize: 13, marginBottom: 10 }}>
            <span style={{ color: 'var(--text-muted)' }}>Yetkazib berish</span>
            <span style={{ color: totals.deliveryFee > 0 ? 'var(--text)' : 'var(--success)', fontWeight: 600 }}>
              {totals.deliveryFee > 0 ? `+${totals.deliveryFee.toLocaleString()} so'm` : 'bepul'}
            </span>
          </div>
          {totals.discount > 0 && (
            <div className="flex justify-between" style={{ fontSize: 13, marginBottom: 10, color: 'var(--success)' }}>
              <span>Chegirma</span>
              <span>-{totals.discount.toLocaleString()} so'm</span>
            </div>
          )}
          <div className="divider" />
          <div className="flex items-baseline justify-between" style={{ marginTop: 10 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Jami</span>
            <span className="price-hero" style={{ fontSize: 24 }}>
              {totals.total.toLocaleString()} so'm
            </span>
          </div>
        </div>
      </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 z-40" style={{ bottom: 82, padding: '12px 16px', background: 'rgba(255,255,255,.97)', borderTop: '1px solid var(--border)' }}>
        <div style={{
          maxWidth: 480, margin: '0 auto',
          borderRadius: 'var(--radius-lg)', padding: '10px',
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
