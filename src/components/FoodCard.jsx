import { useNavigate } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';
import useStore from '../store/useStore';

export default function FoodCard({ food, compact = false }) {
  const navigate = useNavigate();
  const cart = useStore((s) => s.cart);
  const addToCart = useStore((s) => s.addToCart);
  const updateCartItemQuantity = useStore((s) => s.updateCartItemQuantity);

  const cartItem = cart.find(c => c.id === food.id);
  const quantity = cartItem?.quantity || 0;

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
      </div>
      <div className="info">
        <h4 className="name">{food.name}</h4>
        <p className="description">{food.description}</p>
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
