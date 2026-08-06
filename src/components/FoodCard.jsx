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
            onError={(e) => { e.currentTarget.src = '/food/placeholder.svg'; setImgLoaded(true); }}
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
      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%', padding: 8, minWidth: 0 }}
    >
      <div style={{ aspectRatio: '4/3', width: '100%', background: 'var(--surface-active)', position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-sm)' }}>
        {!imgLoaded && <div className="skeleton" style={{ position: 'absolute', inset: 0, borderRadius: 0 }} />}
        <img
          src={food.image} alt={food.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transition: 'opacity .4s' }}
          loading="lazy" onLoad={() => setImgLoaded(true)}
          onError={(e) => { e.currentTarget.src = '/food/placeholder.svg'; setImgLoaded(true); }}
        />
        {food.discountPrice && (
          <span className="badge badge-danger" style={{ position: 'absolute', top: 8, left: 8, padding: '2px 7px', fontSize: 10, lineHeight: 1.6 }}>
            -{Math.round((1 - food.discountPrice / food.price) * 100)}%
          </span>
        )}
        <button
          onClick={handleFav}
          style={{
            position: 'absolute', top: 8, right: 8,
            width: 28, height: 28, borderRadius: 'var(--radius-full)',
            background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(8px)',
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all .2s var(--ease-spring)',
            boxShadow: '0 2px 8px rgba(0,0,0,.1)',
          }}
        >
          <Heart size={13} color={isFav ? 'var(--danger)' : 'var(--text-muted)'} fill={isFav ? 'var(--danger)' : 'none'} />
        </button>
      </div>
      <div style={{ padding: '10px 6px 4px', display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <div style={{ color: 'var(--text)', fontSize: 'clamp(12px, 3.2vw, 14px)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{food.name}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: 'clamp(10px, 2.6vw, 12px)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2, lineHeight: 1.4 }}>{food.description}</div>
        <div className="flex items-center" style={{ gap: 6, marginTop: 'auto', paddingTop: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 'clamp(12px, 3vw, 14px)', fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontVariantNumeric: 'tabular-nums', lineHeight: 1.25 }}>
              {(food.discountPrice || food.price).toLocaleString()} so'm
            </div>
            {food.discountPrice && (
              <div style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', color: 'var(--text-dim)', textDecoration: 'line-through', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.15, marginTop: 1 }}>
                {food.price.toLocaleString()} so'm
              </div>
            )}
          </div>
          <button
            onClick={handleAdd}
            className={addedAnim ? 'animate-cart-bounce' : ''}
            style={{
              width: 'clamp(30px, 7vw, 34px)', height: 'clamp(30px, 7vw, 34px)', minWidth: 'clamp(30px, 7vw, 34px)', flexShrink: 0,
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
