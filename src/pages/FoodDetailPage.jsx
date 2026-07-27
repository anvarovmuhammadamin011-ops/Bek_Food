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
      <div className="relative" style={{ height: 288 }}>
        <img src={food.image} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a0a0a 0%, transparent 50%)' }} />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(20,20,20,.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
            <ChevronLeft size={20} color="#fff" />
          </button>
          <button onClick={() => toggleFavorite('food', food.id)} style={{ background: 'rgba(20,20,20,.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
            <Heart size={18} color={fav ? '#e51e1e' : '#fff'} fill={fav ? '#e51e1e' : 'none'} />
          </button>
        </div>
      </div>

      <div className="px-4" style={{ marginTop: -64, position: 'relative', zIndex: 10, paddingBottom: 16 }}>
        <div className="card p-5 animate-slide-up">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="display-2">{food.name}</h1>
              <p style={{ color: '#b8b8b8', fontSize: 12, marginTop: 4 }}>{food.description}</p>
            </div>
            {food.discountPrice && (
              <span className="badge badge-red">{Math.round((1 - food.discountPrice / food.price) * 100)}%</span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-3">
            <span className="price-lg">{basePrice.toLocaleString()} so'm</span>
            {food.discountPrice && <span style={{ color: '#6b6b6b', fontSize: 14, textDecoration: 'line-through' }}>{food.price.toLocaleString()}</span>}
          </div>

          {food.calories > 0 && (
            <p style={{ color: '#6b6b6b', fontSize: 12, marginTop: 8 }}>{food.calories} kcal</p>
          )}

          {food.ingredients?.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Tarkibi</h3>
              <div className="flex flex-wrap gap-2">
                {food.ingredients.map((ing, i) => (
                  <span key={i} style={{ padding: '4px 10px', background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 11, color: '#b8b8b8' }}>{ing}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Izoh</h3>
            <textarea
              value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Maxsus talablar..."
              className="input" style={{ minHeight: 64 }}
            />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 inset-x-0 z-40" style={{ padding: '16px', background: 'rgba(10,10,10,.9)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="mx-auto w-full max-w-6xl px-2 flex items-center gap-4">
          <div className="flex items-center gap-2" style={{ background: '#141414', borderRadius: 6, padding: '3px 6px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ color: '#b8b8b8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <Minus size={14} />
            </button>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 500, minWidth: 20, textAlign: 'center' }}>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} style={{ color: '#b8b8b8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <Plus size={14} />
            </button>
          </div>
          <button onClick={handleAdd} disabled={added} className={`btn btn-primary flex-1 ${added ? '' : ''}`} style={added ? { background: '#7fbf7f', borderRadius: 10 } : { borderRadius: 10 }}>
            {added ? (
              <span className="flex items-center gap-2"><Check size={18} /> Qo'shildi!</span>
            ) : (
              <span>Savatga qo'shish — {totalPrice.toLocaleString()} so'm</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
