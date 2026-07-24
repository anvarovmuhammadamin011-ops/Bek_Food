import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, Heart, Flame, Check, Star, Clock, ShoppingCart, Zap, ShieldCheck, Share2, Store, ChevronRight } from 'lucide-react';
import useStore from '../store/useStore';

/* ═══════════════════════════════════════
   Toast Notification
   ═══════════════════════════════════════ */
function Toast({ show, message }) {
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 'max(env(safe-area-inset-top, 16px), 16px)',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 200,
      padding: '12px 24px',
      borderRadius: '9999px',
      background: 'var(--color-success)',
      color: 'white',
      fontSize: '13px',
      fontWeight: 700,
      boxShadow: '0 8px 32px rgba(43, 138, 62, 0.35)',
      display: 'flex',
      alignItems: 'center',
      gap: '7px',
      animation: 'slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      whiteSpace: 'nowrap',
    }}>
      <Check size={16} strokeWidth={2.5} /> {message}
    </div>
  );
}

/* ═══════════════════════════════════════
   Info Chip
   ═══════════════════════════════════════ */
function InfoChip({ icon, color, label }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '7px 14px',
      borderRadius: '9999px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      fontSize: '12px',
      fontWeight: 600,
      color: 'var(--text-secondary)',
      whiteSpace: 'nowrap',
      lineHeight: 1,
    }}>
      <span style={{ color, display: 'flex', alignItems: 'center' }}>{icon}</span>
      {label}
    </div>
  );
}

/* ═══════════════════════════════════════
   Section Card Wrapper
   ═══════════════════════════════════════ */
function SectionCard({ children, delay = 0, style = {} }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '20px',
      padding: '20px',
      marginTop: '12px',
      boxShadow: '0 2px 16px rgba(45, 42, 38, 0.05), 0 0 1px rgba(45, 42, 38, 0.08)',
      border: '1px solid var(--border)',
      animation: 'slideUp 0.4s ease-out',
      animationDelay: `${delay}s`,
      animationFillMode: 'both',
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════
   Section Title
   ═══════════════════════════════════════ */
function SectionTitle({ children, style = {} }) {
  return (
    <h3 style={{
      fontSize: '15px',
      fontWeight: 800,
      color: 'var(--text-primary)',
      letterSpacing: '-0.02em',
      marginBottom: '14px',
      ...style,
    }}>
      {children}
    </h3>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function FoodDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { foods, restaurants, addToCart, toggleFavorite, isFavorite } = useStore();
  const food = foods.find(f => f.id === Number(id));
  const restaurant = food ? restaurants.find(r => r.id === food.restaurantId) : null;

  const [quantity, setQuantity] = useState(1);
  const [extraCheese, setExtraCheese] = useState(false);
  const [extraSauce, setExtraSauce] = useState(false);
  const [notes, setNotes] = useState('');
  const [added, setAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [imgLoaded, setImgLoaded] = useState(false);
  const [qtyBounce, setQtyBounce] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
    setExtraCheese(false);
    setExtraSauce(false);
    setNotes('');
    setAdded(false);
    setImgLoaded(false);
  }, [id]);

  if (!food) return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Food not found</span>
    </div>
  );

  /* ── Computed values ── */
  const extras = [];
  if (extraCheese) extras.push({ name: 'Extra Cheese', price: 8000 });
  if (extraSauce) extras.push({ name: 'Extra Sauce', price: 5000 });
  const basePrice = food.discountPrice || food.price;
  const extrasTotal = extras.reduce((s, e) => s + e.price, 0);
  const totalPrice = (basePrice + extrasTotal) * quantity;
  const fav = isFavorite('food', food.id);
  const discountPercent = food.discountPrice ? Math.round((1 - food.discountPrice / food.price) * 100) : 0;
  const mockRating = (4.5 + (food.id % 5) * 0.1).toFixed(1);
  const mockReviews = 80 + food.id * 31;

  const relatedFoods = foods
    .filter(f => f.categoryId === food.categoryId && f.id !== food.id)
    .slice(0, 10);

  /* ── Handlers ── */
  const handleQuantity = (delta) => {
    setQuantity(q => Math.max(1, q + delta));
    setQtyBounce(true);
    setTimeout(() => setQtyBounce(false), 200);
  };

  const handleAdd = () => {
    addToCart(food, quantity, extras, notes);
    setAdded(true);
    setToastMsg(`${food.name} added to cart!`);
    setShowToast(true);
    setTimeout(() => { setAdded(false); setShowToast(false); }, 1500);
  };

  /* ── Styles ── */
  const navBtn = {
    width: '42px', height: '42px', borderRadius: '14px',
    background: 'rgba(255, 255, 255, 0.88)',
    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
    border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    transition: 'all 0.2s ease', color: 'var(--text-primary)',
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide" style={{ paddingBottom: '130px', background: 'var(--bg-primary)' }}>
      <Toast show={showToast} message={toastMsg} />

      {/* ═══════════════════════════════════════
          HERO IMAGE
          ═══════════════════════════════════════ */}
      <div style={{
        position: 'relative', width: '100%',
        height: 'clamp(280px, 45vh, 400px)',
        overflow: 'hidden', background: 'var(--bg-secondary)',
      }}>
        {/* Warm gradient placeholder */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(155deg, #FFF0E0 0%, #FFE4CC 35%, #FFD4B0 70%, #FFC896 100%)',
        }} />

        {/* Food image */}
        <img
          src={food.image}
          alt={food.name}
          onLoad={() => setImgLoaded(true)}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            objectPosition: 'center 40%',
            transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease',
            transform: imgLoaded ? 'scale(1)' : 'scale(1.06)',
            opacity: imgLoaded ? 1 : 0,
          }}
        />

        {/* Bottom gradient fade into content */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px',
          background: 'linear-gradient(to top, var(--bg-primary) 0%, rgba(255,248,241,0.5) 60%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* ── Top Navigation ── */}
        <div style={{
          position: 'absolute',
          top: 'max(env(safe-area-inset-top, 0px), 12px)',
          left: '14px', right: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          zIndex: 10,
        }}>
          <button onClick={() => navigate(-1)} style={navBtn} aria-label="Go back">
            <ChevronLeft size={21} strokeWidth={2.5} />
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => toggleFavorite('food', food.id)}
              style={{
                ...navBtn,
                background: fav ? 'rgba(224, 49, 49, 0.92)' : 'rgba(255, 255, 255, 0.88)',
                boxShadow: fav ? '0 3px 14px rgba(224, 49, 49, 0.35)' : navBtn.boxShadow,
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                color: fav ? 'white' : 'var(--text-primary)',
                transform: fav ? 'scale(1.05)' : 'scale(1)',
              }}
              aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={18} fill={fav ? 'white' : 'none'} />
            </button>
            <button style={navBtn} aria-label="Share">
              <Share2 size={17} />
            </button>
          </div>
        </div>

        {/* ── Discount Badge ── */}
        {discountPercent > 0 && (
          <div style={{
            position: 'absolute',
            top: 'max(env(safe-area-inset-top, 0px), 12px)',
            left: '50%', transform: 'translateX(-50%)',
            zIndex: 10,
          }}>
            <div style={{
              padding: '6px 18px', borderRadius: '9999px',
              background: 'var(--color-danger)', color: 'white',
              fontSize: '12px', fontWeight: 800,
              boxShadow: '0 4px 16px rgba(224, 49, 49, 0.4)',
              letterSpacing: '0.02em',
            }}>
              -{discountPercent}% OFF
            </div>
          </div>
        )}

        {/* ── Best Seller Badge ── */}
        {food.isPopular && (
          <div style={{
            position: 'absolute', bottom: '16px', left: '14px',
            padding: '6px 14px', borderRadius: '9999px',
            background: 'var(--color-primary)', color: 'white',
            fontSize: '11px', fontWeight: 700,
            boxShadow: '0 4px 16px rgba(232, 89, 12, 0.35)',
            display: 'flex', alignItems: 'center', gap: '5px',
          }}>
            🔥 Best Seller
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════
          CONTENT
          ═══════════════════════════════════════ */}
      <div style={{ padding: '0 16px', marginTop: '-24px', position: 'relative', zIndex: 10 }}>

        {/* ── 1. Main Info Card ── */}
        <SectionCard delay={0}>
          {/* Restaurant link */}
          {restaurant && (
            <button
              onClick={() => { useStore.getState().selectRestaurant(restaurant.id); navigate(`/restaurant/${restaurant.id}`); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '9999px',
                background: 'var(--color-primary-light)', border: '1px solid var(--color-primary-border)',
                marginBottom: '12px', cursor: 'pointer', transition: 'all 0.2s ease',
                fontFamily: 'var(--font-family)',
              }}
            >
              <Store size={12} color="var(--color-primary)" />
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)' }}>{restaurant.name}</span>
              <ChevronRight size={12} color="var(--color-primary)" />
            </button>
          )}

          {/* Title + Description */}
          <h1 style={{
            fontSize: '24px', fontWeight: 900, color: 'var(--text-primary)',
            letterSpacing: '-0.035em', lineHeight: 1.1,
          }}>
            {food.name}
          </h1>
          <p style={{
            fontSize: '14px', color: 'var(--text-secondary)',
            marginTop: '6px', lineHeight: 1.55,
          }}>
            {food.description}
          </p>

          {/* Rating + Meta Row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginTop: '14px', flexWrap: 'wrap',
          }}>
            {/* Rating */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '5px 12px', borderRadius: '9999px',
              background: 'var(--color-warning-light)',
              border: '1px solid rgba(230, 119, 0, 0.12)',
            }}>
              <Star size={13} fill="var(--color-warning)" color="var(--color-warning)" />
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-warning)' }}>{mockRating}</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500 }}>({mockReviews})</span>
            </div>

            {/* Prep time */}
            {food.prepTime && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '5px 12px', borderRadius: '9999px',
                background: 'var(--color-primary-light)',
                border: '1px solid var(--color-primary-border)',
              }}>
                <Clock size={12} color="var(--color-primary)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>{food.prepTime} min</span>
              </div>
            )}

            {/* Spice level */}
            {food.spiceLevel > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '3px',
                padding: '5px 12px', borderRadius: '9999px',
                background: 'var(--color-danger-light)',
                border: '1px solid rgba(224, 49, 49, 0.10)',
              }}>
                {Array.from({ length: food.spiceLevel }).map((_, i) => (
                  <Flame key={i} size={12} color="var(--color-danger)" fill="var(--color-danger)" />
                ))}
              </div>
            )}
          </div>

          {/* ── Price Section ── */}
          <div style={{ marginTop: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '32px', fontWeight: 900, color: 'var(--color-primary)',
                letterSpacing: '-0.03em', lineHeight: 1,
                display: 'inline-block',
                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: qtyBounce ? 'scale(1.06)' : 'scale(1)',
              }}>
                {basePrice.toLocaleString()}
              </span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>so'm</span>
              {food.discountPrice && (
                <span style={{
                  fontSize: '14px', color: 'var(--text-muted)',
                  textDecoration: 'line-through', fontWeight: 500,
                }}>
                  {food.price.toLocaleString()} so'm
                </span>
              )}
            </div>
            {/* Savings badge — inline with price */}
            {discountPercent > 0 && (
              <div style={{
                marginTop: '6px',
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                fontSize: '11px', fontWeight: 700,
                color: 'var(--color-danger)', background: 'var(--color-danger-light)',
                padding: '4px 10px', borderRadius: '9999px',
              }}>
                💰 Save {((food.price - basePrice) * quantity).toLocaleString()} so'm
              </div>
            )}
          </div>

          {/* ── Quick Info Chips ── */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
            {food.calories && <InfoChip icon={<Zap size={11} />} color="var(--color-primary)" label={`${food.calories} kcal`} />}
            {food.prepTime && <InfoChip icon={<Clock size={11} />} color="var(--color-success)" label={`${food.prepTime} min`} />}
            <InfoChip icon={<ShieldCheck size={11} />} color="var(--color-success)" label="Fresh" />
            {food.ingredients && (
              <InfoChip icon={<span style={{ fontSize: '10px' }}>🧂</span>} color="var(--text-secondary)" label={`${food.ingredients.length} ingredients`} />
            )}
          </div>
        </SectionCard>

        {/* ── 2. Ingredients ── */}
        <SectionCard delay={0.05}>
          <SectionTitle>Ingredients</SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {food.ingredients.map((ing, i) => (
              <span key={i} style={{
                padding: '8px 16px', borderRadius: '9999px',
                background: 'var(--color-primary-light)',
                border: '1px solid var(--color-primary-border)',
                fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)',
              }}>
                {ing}
              </span>
            ))}
          </div>
        </SectionCard>

        {/* ── 3. Extras ── */}
        <SectionCard delay={0.10}>
          <SectionTitle>Add Extras</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { active: extraCheese, toggle: () => setExtraCheese(!extraCheese), name: 'Extra Cheese', price: '8,000', emoji: '🧀', desc: 'Melted cheddar blend' },
              { active: extraSauce, toggle: () => setExtraSauce(!extraSauce), name: 'Extra Sauce', price: '5,000', emoji: '🫗', desc: 'House-made special sauce' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.toggle}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', padding: '14px 16px',
                  borderRadius: '16px',
                  border: item.active ? '1.5px solid var(--color-primary)' : '1.5px solid var(--border)',
                  background: item.active ? 'var(--color-primary-light)' : 'var(--bg-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: item.active ? '0 2px 12px rgba(232, 89, 12, 0.10)' : 'none',
                  fontFamily: 'var(--font-family)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '22px' }}>{item.emoji}</span>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                      {item.name}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '1px' }}>
                      {item.desc}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    +{item.price}
                  </span>
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: item.active ? 'scale(1)' : 'scale(0.85)',
                    background: item.active ? 'var(--color-primary)' : 'transparent',
                    border: item.active ? 'none' : '1.5px solid var(--border-strong)',
                    boxShadow: item.active ? '0 3px 10px rgba(232, 89, 12, 0.3)' : 'none',
                  }}>
                    {item.active && <Check size={14} color="white" strokeWidth={3} />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </SectionCard>

        {/* ── 4. Special Requests ── */}
        <SectionCard delay={0.15}>
          <SectionTitle>Special Requests</SectionTitle>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="No onions, extra crispy, sauce on the side..."
            rows={3}
            style={{
              width: '100%', background: 'var(--bg-secondary)',
              border: '1.5px solid var(--border)', borderRadius: '14px',
              padding: '14px 16px', fontSize: '14px', color: 'var(--text-primary)',
              resize: 'none', transition: 'all 0.25s ease',
              fontFamily: 'var(--font-family)', lineHeight: 1.5,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-primary)';
              e.target.style.boxShadow = '0 0 0 3px var(--color-primary-glow)';
              e.target.style.background = 'var(--bg-card)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
              e.target.style.background = 'var(--bg-secondary)';
            }}
          />
        </SectionCard>

        {/* ── 5. Related Foods ── */}
        {relatedFoods.length > 0 && (
          <SectionCard delay={0.20} style={{ padding: '20px 0 20px 20px' }}>
            <div style={{ paddingRight: '20px', marginBottom: '14px' }}>
              <SectionTitle style={{ marginBottom: 0 }}>You Might Also Like</SectionTitle>
            </div>
            <div style={{
              display: 'flex', gap: '10px', overflowX: 'auto',
              paddingBottom: '4px', paddingRight: '20px',
              scrollSnapType: 'x proximity',
              WebkitOverflowScrolling: 'touch',
            }}>
              {relatedFoods.map(rf => (
                <div
                  key={rf.id}
                  onClick={() => { useStore.getState().selectFood(rf.id); navigate(`/food/${rf.id}`); }}
                  style={{
                    flexShrink: 0, width: '140px', borderRadius: '16px',
                    border: '1px solid var(--border)', background: 'var(--bg-card)',
                    overflow: 'hidden', cursor: 'pointer',
                    transition: 'all 0.25s ease', boxShadow: '0 2px 12px rgba(45,42,38,0.05)',
                    scrollSnapAlign: 'start',
                  }}
                >
                  <div style={{ height: '100px', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                    <img
                      src={rf.image} alt={rf.name} loading="lazy"
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                      }}
                    />
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{
                      fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {rf.name}
                    </div>
                    <div style={{
                      marginTop: '4px', fontSize: '13px', fontWeight: 800,
                      color: 'var(--color-primary)',
                    }}>
                      {(rf.discountPrice || rf.price).toLocaleString()} so'm
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Bottom spacer */}
        <div style={{ height: '24px' }} />
      </div>

      {/* ═══════════════════════════════════════
          STICKY BOTTOM CART BAR
          ═══════════════════════════════════════ */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 12px',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
      }}>
        <div style={{
          maxWidth: '480px', margin: '0 auto',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid var(--border)',
          boxShadow: '0 -4px 32px rgba(45, 42, 38, 0.10), 0 0 1px rgba(45, 42, 38, 0.08)',
          padding: '12px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          {/* Quantity Selector */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '2px',
            background: 'var(--bg-secondary)', borderRadius: '14px',
            padding: '4px', border: '1px solid var(--border)', flexShrink: 0,
          }}>
            <button
              onClick={() => handleQuantity(-1)}
              disabled={quantity <= 1}
              style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'var(--bg-card)', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
                color: quantity <= 1 ? 'var(--text-muted)' : 'var(--text-primary)',
                boxShadow: '0 1px 3px rgba(45,42,38,0.06)',
                opacity: quantity <= 1 ? 0.4 : 1,
              }}
              aria-label="Decrease quantity"
            >
              <Minus size={16} strokeWidth={2.5} />
            </button>

            <span style={{
              fontSize: '17px', fontWeight: 900, minWidth: '36px',
              textAlign: 'center', color: 'var(--text-primary)',
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: qtyBounce ? 'scale(1.2)' : 'scale(1)',
              display: 'inline-block',
            }}>
              {quantity}
            </span>

            <button
              onClick={() => handleQuantity(1)}
              style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'var(--color-primary)', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.15s ease',
                color: 'white', boxShadow: '0 4px 16px rgba(232, 89, 12, 0.25)',
              }}
              aria-label="Increase quantity"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            disabled={added}
            style={{
              flex: 1, height: '56px', borderRadius: '16px', border: 'none',
              background: added ? 'var(--color-success)' : 'var(--color-primary)',
              color: 'white', fontSize: '15px', fontWeight: 800,
              cursor: added ? 'default' : 'pointer',
              transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: added
                ? '0 6px 24px rgba(43, 138, 62, 0.35)'
                : '0 6px 24px rgba(232, 89, 12, 0.30)',
              letterSpacing: '-0.01em',
              transform: added ? 'scale(0.97)' : 'scale(1)',
              fontFamily: 'var(--font-family)',
            }}
            aria-label={`Add ${food.name} to cart for ${totalPrice.toLocaleString()} so'm`}
          >
            {added ? (
              <>
                <Check size={20} strokeWidth={3} />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart size={17} />
                <span>Add — {totalPrice.toLocaleString()} so'm</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
