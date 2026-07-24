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
          <button onClick={handleFavorite} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 active:scale-90 transition-transform">
            <Heart size={12} className={fav ? 'text-danger' : 'text-white'} fill={fav ? 'currentColor' : 'none'} />
          </button>
          {food.prepTime && (
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm flex items-center gap-1">
              <Clock size={8} className="text-white" />
              <span className="text-[9px] font-semibold text-white">{food.prepTime}m</span>
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
              <button onClick={handleAdd} className="btn-icon btn-icon-primary" style={{ width: 28, height: 28 }}>
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
        <button onClick={handleFavorite} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 active:scale-90 transition-transform">
          <Heart size={14} className={fav ? 'text-danger' : 'text-white'} fill={fav ? 'currentColor' : 'none'} />
        </button>
        {food.prepTime && (
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm flex items-center gap-1">
            <Clock size={10} className="text-white" />
            <span className="text-[10px] font-semibold text-white">{food.prepTime} min</span>
          </div>
        )}
      </div>
      <div className="info">
        <div className="flex items-start justify-between gap-2">
          <h4 className="name">{food.name}</h4>
          {food.spiceLevel > 0 && (
            <div className="flex items-center gap-0.5">
              {Array.from({ length: Math.min(food.spiceLevel, 3) }).map((_, i) => (
                <span key={i} className="text-[10px]">🌶️</span>
              ))}
            </div>
          )}
        </div>
        <p className="description">{food.description}</p>

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted">
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
            <button onClick={handleAdd} className="btn-icon btn-icon-primary">
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
