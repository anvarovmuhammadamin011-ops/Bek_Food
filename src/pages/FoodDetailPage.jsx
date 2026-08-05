import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, Heart, Check, ShoppingBag } from 'lucide-react';
import useStore from '../store/useStore';

const ING_ICONS = {
  'Sosiska': '🌭', '2x Sosiska': '🌭', 'Bulochka': '🍞', "Go'sht": '🥩',
  'Qazi': '🍖', 'Ketchup': '🍅', 'Gorchitsa': '🟡', 'Pishloq': '🧀',
  'Salat': '🥬', 'Suslangan bodring': '🥒', 'Sous': '🥫', 'Maxsus retsept': '✨',
  'Mutex': '🍗', "Mol go'shti": '🥩', 'File': '🍗', 'Tovoq': '🍗',
};

function ingIcon(name) {
  return ING_ICONS[name] || '🍽';
}

export default function FoodDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { foods, addToCart, toggleFavorite, isFavorite } = useStore();
  const food = foods.find((f) => f.id === Number(id));

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [added, setAdded] = useState(false);

  if (!food) return <div className="h-full flex-center text-muted">Bunday mahsulot yo'q</div>;

  const basePrice = food.discountPrice || food.price;
  const totalPrice = basePrice * quantity;
  const fav = isFavorite('food', food.id);
  const discount = food.discountPrice ? Math.round((1 - food.discountPrice / food.price) * 100) : 0;

  const handleAdd = () => {
    addToCart(food, quantity, [], notes);
    setAdded(true);
    setTimeout(() => { setAdded(false); navigate(-1); }, 800);
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-32">
      {/* 1. Realistic product photo */}
      <div className="relative" style={{ height: 'clamp(250px, 44vh, 400px)', background: 'var(--surface-active)' }}>
        <img src={food.image} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/food/hotdog.svg'; }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.45) 0%, transparent 42%)' }} />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} style={{
            background: 'rgba(255,255,255,.94)', backdropFilter: 'blur(10px)',
            border: 'none', borderRadius: 'var(--radius-full)', width: 42, height: 42,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,.14)',
          }}>
            <ChevronLeft size={20} color="var(--text)" />
          </button>
          <button onClick={() => toggleFavorite('food', food.id)} style={{
            background: 'rgba(255,255,255,.94)', backdropFilter: 'blur(10px)',
            border: 'none', borderRadius: 'var(--radius-full)', width: 42, height: 42,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,.14)',
          }}>
            <Heart size={18} color={fav ? 'var(--danger)' : 'var(--text-muted)'} fill={fav ? 'var(--danger)' : 'none'} />
          </button>
        </div>
        {discount > 0 && (
          <span className="badge badge-danger" style={{ position: 'absolute', bottom: 12, left: 16, padding: '6px 14px', fontSize: 14 }}>YANGI NARX -{discount}%</span>
        )}
      </div>

      {/* 2. Product card */}
      <div className="px-4" style={{ marginTop: -34, position: 'relative', zIndex: 10, paddingBottom: 16 }}>
        <div className="card p-5 animate-slide-up" style={{ boxShadow: 'var(--shadow-lg)', border: 'none' }}>
          {/* Title */}
          <h1 className="display-2" style={{ fontSize: 26, fontWeight: 800 }}>{food.name}</h1>

          {/* Price right below title */}
          <div className="flex items-baseline" style={{ gap: 10, marginTop: 10 }}>
            <span className="price-hero" style={{ fontSize: 34 }}>{basePrice.toLocaleString()} so'm</span>
            {food.discountPrice && (
              <span style={{ color: 'var(--text-dim)', fontSize: 15, textDecoration: 'line-through' }}>{food.price.toLocaleString()}</span>
            )}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>{food.description}</p>

          {/* 3. Ingredients as emoji badges */}
          {food.ingredients?.length > 0 && (
            <div className="flex flex-wrap" style={{ gap: 8, marginTop: 16 }}>
              {food.ingredients.map((ing, i) => (
                <span key={i} className="badge badge-neutral" style={{ padding: '8px 14px', fontSize: 13, borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
                  {ingIcon(ing)} {ing}
                </span>
              ))}
            </div>
          )}

          {/* Quantity stepper */}
          <div className="flex items-center justify-between" style={{ marginTop: 18, background: 'var(--surface-active)', borderRadius: 'var(--radius)', padding: '8px 12px', border: '1px solid var(--border)' }}>
            <span className="subheading" style={{ fontSize: 14 }}>Miqdor</span>
            <div className="flex items-center" style={{ gap: 0 }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <Minus size={17} />
              </button>
              <span style={{ color: 'var(--text)', fontSize: 17, fontWeight: 700, minWidth: 44, textAlign: 'center' }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: '#fff', boxShadow: '0 2px 10px rgba(249,115,22,.25)' }}>
                <Plus size={17} strokeWidth={2.6} />
              </button>
            </div>
          </div>

          {/* 4. Notes */}
          <div style={{ marginTop: 18 }}>
            <h3 className="subheading" style={{ marginBottom: 8 }}>Izox</h3>
            <textarea
              value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Maxsus talablar..."
              className="input resize-none" style={{ minHeight: 70, borderRadius: 'var(--radius)' }}
            />
          </div>
        </div>
      </div>

      {/* 5. Bottom order bar */}
      <div className="fixed bottom-0 inset-x-0 z-40" style={{
        padding: '12px 16px',
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
        background: 'rgba(255,255,255,.94)', backdropFilter: 'blur(20px) saturate(1.8)',
        borderTop: '1px solid var(--border)',
        boxShadow: '0 -6px 24px rgba(0,0,0,.06)',
      }}>
        <div className="mx-auto w-full flex items-center" style={{ gap: 12, maxWidth: 480 }}>
          {/* Left: quantity selector */}
          <div className="flex items-center" style={{ gap: 0, background: 'var(--surface-active)', borderRadius: 'var(--radius-full)', padding: '4px 6px', border: '1.5px solid var(--border)' }}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', borderRadius: 'var(--radius-full)', cursor: 'pointer', color: 'var(--text)' }}>
              <Minus size={18} />
            </button>
            <span style={{ color: 'var(--text)', fontSize: 18, fontWeight: 700, minWidth: 26, textAlign: 'center' }}>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} style={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', borderRadius: 'var(--radius-full)', cursor: 'pointer', color: 'var(--text)' }}>
              <Plus size={18} />
            </button>
          </div>

          {/* Right: bright orange CTA with dynamic total */}
          <button onClick={handleAdd} disabled={added} className="btn btn-primary flex-1" style={added ? { background: 'var(--success)', minHeight: 54 } : { minHeight: 54, fontSize: 15 }}>
            {added ? (
              <span className="flex items-center" style={{ gap: 6, whiteSpace: 'nowrap' }}><Check size={18} /> Qo'shildi!</span>
            ) : (
              <span className="flex items-center justify-center" style={{ gap: 8, minWidth: 0 }}>
                <ShoppingBag size={19} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Savatga qo'shish — {totalPrice.toLocaleString()} so'm</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}