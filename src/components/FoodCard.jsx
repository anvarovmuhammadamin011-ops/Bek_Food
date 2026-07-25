import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Heart, Clock } from 'lucide-react';
import useStore from '../store/useStore';

export default function FoodCard({ food, compact = false, grid = false }) {
  const navigate = useNavigate();
  const cart = useStore((s) => s.cart);
  const addToCart = useStore((s) => s.addToCart);
  const updateCartItemQuantity = useStore((s) => s.updateCartItemQuantity);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const isFavorite = useStore((s) => s.isFavorite);

  const cartItem = cart.find(c => c.foodId === food.id);
  const quantity = cartItem?.quantity || 0;
  const fav = isFavorite('food', food.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(food);
  };

  const handleQuantityChange = (e, delta) => {
    e.stopPropagation();
    if (quantity + delta <= 0) {
      updateCartItemQuantity(food.id, -quantity);
    } else {
      updateCartItemQuantity(food.id, delta);
    }
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite('food', food.id);
  };

  const navigateToDetail = () => {
    useStore.getState().selectFood(food.id);
    navigate(`/food/${food.id}`);
  };

  // ── GRID CARD (menu page) ──
  if (grid) {
    return (
      <div
        onClick={navigateToDetail}
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px) scale(0.98)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
        }}
      >
        {/* Image */}
        <div style={{
          position: 'relative',
          height: '140px',
          overflow: 'hidden',
          background: 'var(--bg-secondary)',
        }}>
          <img
            src={food.image}
            alt={food.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={(e) => { e.target.style.transform = 'scale(1.08)'; }}
            onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
          />
          {/* Discount badge */}
          {food.discountPrice && (
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-danger)',
              padding: '3px 8px',
              fontSize: '10px',
              fontWeight: 700,
              color: 'white',
              boxShadow: '0 2px 8px rgba(224, 49, 49, 0.3)',
            }}>
              -{Math.round((1 - food.discountPrice / food.price) * 100)}%
            </div>
          )}
          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: fav ? 'rgba(224, 49, 49, 0.9)' : 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(8px)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
          >
            <Heart
              size={14}
              fill={fav ? 'white' : 'none'}
              color={fav ? 'white' : 'var(--text-muted)'}
            />
          </button>
          {/* Prep time */}
          {food.prepTime && (
            <div style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
            }}>
              <Clock size={9} color="white" />
              <span style={{ fontSize: '9px', fontWeight: 600, color: 'white' }}>{food.prepTime}m</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '12px' }}>
          <h4 style={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            lineHeight: 1.3,
          }}>
            {food.name}
          </h4>
          <p style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginTop: '2px',
          }}>
            {food.description}
          </p>

          {/* Price + Add to Cart */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{
                color: 'var(--color-primary)',
                fontWeight: 800,
                fontSize: '14px',
                letterSpacing: '-0.01em',
              }}>
                {(food.discountPrice || food.price).toLocaleString()}
              </span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>so'm</span>
              {food.discountPrice && (
                <span style={{
                  color: 'var(--text-muted)',
                  fontSize: '10px',
                  textDecoration: 'line-through',
                  marginLeft: '2px',
                }}>
                  {food.price.toLocaleString()}
                </span>
              )}
            </div>

            {quantity > 0 ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: '3px',
                border: '1px solid var(--border)',
              }}>
                <button
                  onClick={(e) => handleQuantityChange(e, -1)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'var(--bg-card)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Minus size={11} strokeWidth={2.5} />
                </button>
                <span style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  minWidth: '22px',
                  textAlign: 'center',
                  color: 'var(--text-primary)',
                }}>
                  {quantity}
                </span>
                <button
                  onClick={(e) => handleQuantityChange(e, 1)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'var(--color-primary)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(232, 89, 12, 0.25)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Plus size={11} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 3px 12px rgba(232, 89, 12, 0.3)',
                  flexShrink: 0,
                }}
              >
                <Plus size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── COMPACT CARD (horizontal scroll) ──
  if (compact) {
    return (
      <div
        onClick={navigateToDetail}
        className="food-card-compact"
      >
        <div className="image-wrapper">
          <img src={food.image} alt={food.name} loading="lazy" />
          {food.discountPrice && (
            <div className="discount-badge">
              -{Math.round((1 - food.discountPrice / food.price) * 100)}%
            </div>
          )}
          <button
            onClick={handleFavorite}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: fav ? 'rgba(224, 49, 49, 0.9)' : 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(8px)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
          >
            <Heart
              size={12}
              fill={fav ? 'white' : 'none'}
              color={fav ? 'white' : 'var(--text-muted)'}
            />
          </button>
          {food.prepTime && (
            <div style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              padding: '3px 7px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
            }}>
              <Clock size={8} color="white" />
              <span style={{ fontSize: '9px', fontWeight: 600, color: 'white' }}>{food.prepTime}m</span>
            </div>
          )}
        </div>
        <div className="content">
          <h4 className="name">{food.name}</h4>
          <div className="price-row">
            <div>
              <span className="price">{(food.discountPrice || food.price).toLocaleString()}</span>
              {food.discountPrice && <span className="original-price">{food.price.toLocaleString()}</span>}
            </div>
            {quantity > 0 ? (
              <div className="quantity-selector">
                <button onClick={(e) => handleQuantityChange(e, -1)} className="btn-qty">
                  <Minus size={10} />
                </button>
                <span className="count">{quantity}</span>
                <button onClick={(e) => handleQuantityChange(e, 1)} className="btn-qty primary">
                  <Plus size={10} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '10px',
                  background: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(232, 89, 12, 0.3)',
                  flexShrink: 0,
                }}
              >
                <Plus size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── FULL CARD (list view) ──
  return (
    <div
      onClick={navigateToDetail}
      className="food-card"
    >
      <div className="image-wrapper">
        <img src={food.image} alt={food.name} loading="lazy" />
        {food.discountPrice && (
          <div className="discount-badge">
            -{Math.round((1 - food.discountPrice / food.price) * 100)}%
          </div>
        )}
        <button
          onClick={handleFavorite}
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: fav ? 'rgba(224, 49, 49, 0.9)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          <Heart
            size={13}
            fill={fav ? 'white' : 'none'}
            color={fav ? 'white' : 'var(--text-muted)'}
          />
        </button>
        {food.prepTime && (
          <div style={{
            position: 'absolute',
            bottom: '6px',
            left: '6px',
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <Clock size={9} color="white" />
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'white' }}>{food.prepTime} min</span>
          </div>
        )}
      </div>
      <div className="info">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <h4 className="name">{food.name}</h4>
          {food.spiceLevel > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
              {Array.from({ length: Math.min(food.spiceLevel, 3) }).map((_, i) => (
                <span key={i} style={{ fontSize: '10px' }}>🌶️</span>
              ))}
            </div>
          )}
        </div>
        <p className="description">{food.description}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
          {food.calories && <span>{food.calories} kcal</span>}
        </div>

        <div className="price-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="price">{(food.discountPrice || food.price).toLocaleString()} so'm</span>
            {food.discountPrice && <span className="original-price">{food.price.toLocaleString()}</span>}
          </div>
          {quantity > 0 ? (
            <div className="quantity-selector">
              <button onClick={(e) => handleQuantityChange(e, -1)} className="btn-qty">
                <Minus size={12} />
              </button>
              <span className="count">{quantity}</span>
              <button onClick={(e) => handleQuantityChange(e, 1)} className="btn-qty primary">
                <Plus size={12} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '12px',
                background: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 3px 12px rgba(232, 89, 12, 0.3)',
                flexShrink: 0,
              }}
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
