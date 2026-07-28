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
    setTimeout(() => setAddedAnim(false), 500);
  };

  const handleFav = (e) => {
    e.stopPropagation();
    toggleFavorite('food', food.id);
  };

  if (compact) {
    return (
      <div
        onClick={() => navigate(`/food/${food.id}`)}
        className="card card-hover"
        style={{ minWidth: 160, cursor: 'pointer' }}
      >
        <div style={{ height: 110, background: 'var(--surface-active)', position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
          {!imgLoaded && <div className="skeleton" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />}
          <img
            src={food.image} alt={food.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transition: 'opacity .4s' }}
            loading="lazy" onLoad={() => setImgLoaded(true)}
          />
          {food.discountPrice && (
            <span className="badge badge-danger" style={{ position: 'absolute', top: 10, left: 10, fontSize: 10, padding: '3px 8px' }}>
              -{Math.round((1 - food.discountPrice / food.price) * 100)}%
            </span>
          )}
          <button
            onClick={handleFav}
            style={{
              position: 'absolute', top: 10, right: 10,
              width: 30, height: 30, borderRadius: 'var(--radius-full)',
              background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(8px)',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all .2s var(--ease-spring)',
              boxShadow: '0 2px 8px rgba(0,0,0,.08)',
            }}
          >
            <Heart size={14} color={isFav ? 'var(--danger)' : 'var(--text-muted)'} fill={isFav ? 'var(--danger)' : 'none'} />
          </button>
        </div>
        <div style={{ padding: '12px' }}>
          <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 500, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{food.name}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{food.description}</div>
          <div className="flex items-center justify-between">
            <div>
              <span className="price-sm">{(food.discountPrice || food.price).toLocaleString()} so'm</span>
            </div>
            <button
              onClick={handleAdd}
              className={addedAnim ? 'animate-cart-bounce' : ''}
              style={{
                width: 32, height: 32,
                background: addedAnim ? 'var(--success)' : 'var(--primary)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer',
                transition: 'all .3s var(--ease-spring)',
                boxShadow: addedAnim ? '0 2px 10px rgba(34,197,94,.3)' : '0 2px 10px rgba(249,115,22,.2)',
              }}
            >
              <Plus size={16} color="#fff" strokeWidth={2.5} />
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
      <div style={{ height: 140, background: 'var(--surface-active)', position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
        {!imgLoaded && <div className="skeleton" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />}
        <img
          src={food.image} alt={food.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transition: 'opacity .4s' }}
          loading="lazy" onLoad={() => setImgLoaded(true)}
        />
        {food.discountPrice && (
          <span className="badge badge-danger" style={{ position: 'absolute', top: 10, left: 10, padding: '3px 10px' }}>
            -{Math.round((1 - food.discountPrice / food.price) * 100)}%
          </span>
        )}
        <button
          onClick={handleFav}
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 32, height: 32, borderRadius: 'var(--radius-full)',
            background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(8px)',
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all .2s var(--ease-spring)',
            boxShadow: '0 2px 8px rgba(0,0,0,.08)',
          }}
        >
          <Heart size={15} color={isFav ? 'var(--danger)' : 'var(--text-muted)'} fill={isFav ? 'var(--danger)' : 'none'} />
        </button>
      </div>
      <div style={{ padding: '12px 14px' }}>
        <div className="flex items-center justify-between">
          <div style={{ color: 'var(--text)', fontSize: 14, fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 8 }}>{food.name}</div>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{food.description}</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: 6 }}>
            <span className="price">{(food.discountPrice || food.price).toLocaleString()} so'm</span>
            {food.discountPrice && (
              <span style={{ fontSize: 12, color: 'var(--text-dim)', textDecoration: 'line-through' }}>{food.price.toLocaleString()}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className={addedAnim ? 'animate-cart-bounce' : ''}
            style={{
              width: 36, height: 36,
              background: addedAnim ? 'var(--success)' : 'var(--primary)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
              transition: 'all .3s var(--ease-spring)',
              boxShadow: addedAnim ? '0 4px 12px rgba(34,197,94,.3)' : '0 4px 12px rgba(249,115,22,.2)',
            }}
          >
            <Plus size={18} color="#fff" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
