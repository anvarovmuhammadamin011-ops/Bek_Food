import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Heart, Clock, Star } from 'lucide-react';
import useStore from '../store/useStore';

export default function FoodCard({ food, compact = false }) {
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

  if (compact) {
    return (
      <div
        onClick={() => { useStore.getState().selectFood(food.id); navigate(`/food/${food.id}`); }}
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

  return (
    <div
      onClick={() => { useStore.getState().selectFood(food.id); navigate(`/food/${food.id}`); }}
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
        <div className="flex items-start justify-between gap-2">
          <h4 className="name">{food.name}</h4>
          {food.spiceLevel > 0 && (
            <div className="flex items-center gap-0.5">
              {Array.from({ length: Math.min(food.spiceLevel, 3) }).map((_, i) => (
                <span key={i} style={{ fontSize: '10px' }}>🌶️</span>
              ))}
            </div>
          )}
        </div>
        <p className="description">{food.description}</p>

        <div className="flex items-center gap-3 mt-1.5" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
          {food.calories && <span>{food.calories} kcal</span>}
          {food.ingredients && <span>{food.ingredients.length} ingredients</span>}
        </div>

        <div className="price-row">
          <div className="flex items-center gap-2">
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
