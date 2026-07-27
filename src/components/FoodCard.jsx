import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Heart } from 'lucide-react';
import useStore from '../store/useStore';

export default function FoodCard({ food, compact = false }) {
  const navigate = useNavigate();
  const addToCart = useStore((s) => s.addToCart);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const isFav = useStore((s) => s.isFavorite('food', food.id));
  const [imgLoaded, setImgLoaded] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(food);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 400);
  };

  const handleFav = (e) => {
    e.stopPropagation();
    toggleFavorite('food', food.id);
  };

  if (compact) {
    return (
      <div
        onClick={() => navigate(`/food/${food.id}`)}
        className="card card-hover overflow-hidden"
        style={{ minWidth: 150, cursor: 'pointer' }}
      >
        <div style={{ height: 100, background: 'var(--surface-hover)', position: 'relative', overflow: 'hidden' }}>
          {!imgLoaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
          <img
            src={food.image} alt={food.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transition: 'opacity .3s' }}
            loading="lazy" onLoad={() => setImgLoaded(true)}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,.6) 0%, transparent 50%)' }} />
          {food.discountPrice && (
            <span className="badge badge-red" style={{ position: 'absolute', top: 8, left: 8, fontSize: 10, padding: '2px 8px', fontWeight: 600, boxShadow: '0 2px 8px rgba(229,30,30,.3)' }}>
              -{Math.round((1 - food.discountPrice / food.price) * 100)}%
            </span>
          )}
          <button onClick={handleFav} style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(10,10,10,.5)', backdropFilter: 'blur(8px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s' }}>
            <Heart size={12} color={isFav ? '#e51e1e' : '#fff'} fill={isFav ? '#e51e1e' : 'none'} />
          </button>
        </div>
        <div style={{ padding: '10px 12px' }}>
          <div style={{ color: '#fff', fontSize: 12, fontWeight: 500, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{food.name}</div>
          <div style={{ color: '#6b6b6b', fontSize: 10, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{food.description}</div>
          <div className="flex items-center justify-between">
            <span className="price-sm">{(food.discountPrice || food.price).toLocaleString()}</span>
            <button onClick={handleAdd} className={addedAnim ? 'animate-cart-bounce' : ''} style={{ width: 28, height: 28, background: addedAnim ? '#7fbf7f' : 'var(--red)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'all .25s cubic-bezier(.4,0,.2,1)', boxShadow: '0 2px 8px rgba(229,30,30,.3)' }}>
              <Plus size={14} color="#fff" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/food/${food.id}`)}
      className="card card-hover"
      style={{ cursor: 'pointer' }}
    >
      <div style={{ height: 100, background: 'var(--surface-hover)', position: 'relative', overflow: 'hidden' }}>
        {!imgLoaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
        <img
          src={food.image} alt={food.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transition: 'opacity .3s' }}
          loading="lazy" onLoad={() => setImgLoaded(true)}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,.6) 0%, transparent 50%)' }} />
        {food.discountPrice && (
          <span className="badge badge-red" style={{ position: 'absolute', top: 8, left: 8, fontSize: 10, padding: '2px 8px', fontWeight: 600, boxShadow: '0 2px 8px rgba(229,30,30,.3)' }}>
            -{Math.round((1 - food.discountPrice / food.price) * 100)}%
          </span>
        )}
        <button onClick={handleFav} style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(10,10,10,.5)', backdropFilter: 'blur(8px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s' }}>
          <Heart size={12} color={isFav ? '#e51e1e' : '#fff'} fill={isFav ? '#e51e1e' : 'none'} />
        </button>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <div className="flex items-start justify-between">
          <div style={{ color: '#fff', fontSize: 12, fontWeight: 500, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{food.name}</div>
        </div>
        <div style={{ color: '#6b6b6b', fontSize: 10, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{food.description}</div>
        <div className="flex items-center justify-between">
          <span className="price-sm">{(food.discountPrice || food.price).toLocaleString()}</span>
          <button onClick={handleAdd} className={addedAnim ? 'animate-cart-bounce' : ''} style={{ width: 28, height: 28, background: addedAnim ? '#7fbf7f' : 'var(--red)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', transition: 'all .25s cubic-bezier(.4,0,.2,1)', boxShadow: '0 2px 8px rgba(229,30,30,.3)' }}>
            <Plus size={14} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}
