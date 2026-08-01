import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, Heart, Check } from 'lucide-react';
import useStore from '../store/useStore';

export default function FoodDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { foods, addToCart, toggleFavorite, isFavorite } = useStore();
  const food = foods.find((f) => f.id === Number(id));

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [added, setAdded] = useState(false);

  if (!food) return <div className="h-full flex-center text-muted">Topilmadi</div>;

  const basePrice = food.discountPrice || food.price;
  const totalPrice = basePrice * quantity;
  const fav = isFavorite('food', food.id);

  const handleAdd = () => {
    addToCart(food, quantity, [], notes);
    setAdded(true);
    setTimeout(() => { setAdded(false); navigate(-1); }, 800);
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="relative" style={{ height: 300 }}>
        <img src={food.image} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/food/placeholder.svg'; }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 50%)' }} />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} style={{
            background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(10px)',
            border: 'none', borderRadius: 'var(--radius-sm)', width: 40, height: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,.08)',
          }}>
            <ChevronLeft size={20} color="var(--text)" />
          </button>
          <button onClick={() => toggleFavorite('food', food.id)} style={{
            background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(10px)',
            border: 'none', borderRadius: 'var(--radius-sm)', width: 40, height: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,.08)',
          }}>
            <Heart size={18} color={fav ? 'var(--danger)' : 'var(--text-muted)'} fill={fav ? 'var(--danger)' : 'none'} />
          </button>
        </div>
      </div>

      <div className="px-4" style={{ marginTop: -40, position: 'relative', zIndex: 10, paddingBottom: 16 }}>
        <div className="card p-5 animate-slide-up">
          <div className="flex items-start justify-between">
            <div style={{ flex: 1 }}>
              <h1 className="display-2" style={{ fontSize: 24 }}>{food.name}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>{food.description}</p>
            </div>
            {food.discountPrice && (
              <span className="badge badge-danger">{Math.round((1 - food.discountPrice / food.price) * 100)}%</span>
            )}
          </div>

          <div className="flex items-center" style={{ gap: 8, marginTop: 12 }}>
            <span className="price-lg">{basePrice.toLocaleString()} so'm</span>
            {food.discountPrice && <span style={{ color: 'var(--text-dim)', fontSize: 14, textDecoration: 'line-through' }}>{food.price.toLocaleString()}</span>}
          </div>

          {food.calories > 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 8 }}>{food.calories} kcal</p>
          )}

          {food.ingredients?.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h3 className="subheading" style={{ marginBottom: 8 }}>Tarkibi</h3>
              <div className="flex flex-wrap" style={{ gap: 6 }}>
                {food.ingredients.map((ing, i) => (
                  <span key={i} className="badge badge-neutral">{ing}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <h3 className="subheading" style={{ marginBottom: 8 }}>Izoh</h3>
            <textarea
              value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Maxsus talablar..."
              className="input resize-none" style={{ minHeight: 64 }}
            />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 inset-x-0 z-40" style={{
        padding: '14px 16px',
        paddingBottom: 'calc(14px + env(safe-area-inset-bottom, 0px))',
        background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(20px) saturate(1.8)',
        borderTop: '1px solid var(--border)',
      }}>
        <div className="mx-auto w-full flex items-center" style={{ gap: 12, maxWidth: 480 }}>
          <div className="flex items-center" style={{
            gap: 0, background: 'var(--surface-active)', borderRadius: 'var(--radius)',
            padding: '4px 6px', border: '1px solid var(--border)',
          }}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <Minus size={16} />
            </button>
            <span style={{ color: 'var(--text)', fontSize: 15, fontWeight: 600, minWidth: 24, textAlign: 'center' }}>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <Plus size={16} />
            </button>
          </div>
          <button onClick={handleAdd} disabled={added} className="btn btn-primary flex-1" style={added ? { background: 'var(--success)' } : {}}>
            {added ? (
              <span className="flex items-center" style={{ gap: 6 }}><Check size={18} /> Qo'shildi!</span>
            ) : (
              <span>Savatga qo'shish — {totalPrice.toLocaleString()} so'm</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
