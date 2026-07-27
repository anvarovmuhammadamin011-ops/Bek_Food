import { useNavigate } from 'react-router-dom';
import { Plus, Heart } from 'lucide-react';
import useStore from '../store/useStore';

export default function FoodCard({ food, compact = false }) {
  const navigate = useNavigate();
  const addToCart = useStore((s) => s.addToCart);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const isFav = useStore((s) => s.isFavorite('food', food.id));

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(food);
  };

  const handleFav = (e) => {
    e.stopPropagation();
    toggleFavorite('food', food.id);
  };

  if (compact) {
    return (
      <div
        onClick={() => navigate(`/food/${food.id}`)}
        className="overflow-hidden cursor-pointer"
        style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}
      >
        <div style={{ height: 70, background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <img src={food.image} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          {food.discountPrice && (
            <span className="badge badge-red" style={{ position: 'absolute', top: 6, left: 6, fontSize: 10, padding: '2px 6px' }}>
              -{Math.round((1 - food.discountPrice / food.price) * 100)}%
            </span>
          )}
        </div>
        <div style={{ padding: '8px 10px' }}>
          <div style={{ color: '#fff', fontSize: 11, fontWeight: 500, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{food.name}</div>
          <div style={{ color: '#7a7a7a', fontSize: 9, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{food.description}</div>
          <div className="flex items-center justify-between">
            <span className="price-sm">{(food.discountPrice || food.price).toLocaleString()}</span>
            <button onClick={handleAdd} style={{ width: 20, height: 20, background: '#e51e1e', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
              <Plus size={13} color="#fff" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/food/${food.id}`)}
      className="cursor-pointer"
      style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden' }}
    >
      <div style={{ height: 70, background: '#1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <img src={food.image} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        {food.discountPrice && (
          <span className="badge badge-red" style={{ position: 'absolute', top: 6, left: 6, fontSize: 10, padding: '2px 6px' }}>
            -{Math.round((1 - food.discountPrice / food.price) * 100)}%
          </span>
        )}
      </div>
      <div style={{ padding: '8px 10px' }}>
        <div className="flex items-start justify-between">
          <div style={{ color: '#fff', fontSize: 11, fontWeight: 500, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{food.name}</div>
          <button onClick={handleFav} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 4 }}>
            <Heart size={12} color={isFav ? '#e51e1e' : '#6b6b6b'} fill={isFav ? '#e51e1e' : 'none'} />
          </button>
        </div>
        <div style={{ color: '#7a7a7a', fontSize: 9, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{food.description}</div>
        <div className="flex items-center justify-between">
          <span className="price-sm">{(food.discountPrice || food.price).toLocaleString()}</span>
          <button onClick={handleAdd} style={{ width: 20, height: 20, background: '#e51e1e', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
            <Plus size={13} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}
