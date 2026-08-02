import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, Heart, Check, ShoppingBag } from 'lucide-react';
import useStore from '../store/useStore';

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
      {/* Big image hero */}
      <div className="relative" style={{ height: '52vh', minHeight: 320, background: 'var(--surface-active)' }}>
        <img src={food.image} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/food/placeholder.svg'; }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.65) 0%, rgba(0,0,0,.15) 35%, transparent 60%)' }} />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} style={{
            background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(10px)',
            border: 'none', borderRadius: 'var(--radius-full)', width: 42, height: 42,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,.12)',
          }}>
            <ChevronLeft size={20} color="var(--text)" />
          </button>
          <button onClick={() => toggleFavorite('food', food.id)} style={{
            background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(10px)',
            border: 'none', borderRadius: 'var(--radius-full)', width: 42, height: 42,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,.12)',
          }}>
            <Heart size={18} color={fav ? 'var(--danger)' : 'var(--text-muted)'} fill={fav ? 'var(--danger)' : 'none'} />
          </button>
        </div>
        {discount > 0 && (
          <span className="badge badge-danger" style={{ position: 'absolute', bottom: 14, left: 16, padding: '6px 14px', fontSize: 14 }}>YANGI NARX -{discount}%</span>
        )}
      </div>

      {/* Content overlapping the image */}
      <div className="px-4" style={{ marginTop: -42, position: 'relative', zIndex: 10, paddingBottom: 16 }}>
        <div className="card p-5 animate-slide-up">
          <div className="flex items-start justify-between">
            <div style={{ flex: 1 }}>
              <h1 className="display-2" style={{ fontSize: 26 }}>{food.name}</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6, lineHeight: 1.6 }}>{food.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap" style={{ gap: 6, marginTop: 12 }}>
            {food.calories > 0 && <span className="badge badge-neutral"><b>{food.calories}</b> kcal</span>}
            {food.isNew && <span className="badge badge-neutral">YANGI</span>}
            {food.isPopular && <span className="badge badge-neutral">MASHHUR</span>}
          </div>

          {/* Big price */}
          <div className="flex items-center" style={{ gap: 10, marginTop: 16 }}>
            <span className="price-hero">{totalPrice.toLocaleString()} so'm</span>
            {food.discountPrice && (
              <span style={{ color: 'var(--text-dim)', fontSize: 15, textDecoration: 'line-through' }}>{food.price.toLocaleString()}</span>
            )}
          </div>

          {/* Quantity stepper */}
          <div className="flex items-center justify-between" style={{ marginTop: 18, background: 'var(--surface-active)', borderRadius: 'var(--radius)', padding: '8px 10px', border: '1px solid var(--border)' }}>
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
            <h3 className="subheading" style={{ marginBottom: 8 }}>Izox</h3>
            <textarea
              value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Maxsus talablar..."
              className="input resize-none" style={{ minHeight: 64 }}
            />
          </div>
        </div>
      </div>

      {/* Bottom order bar */}
      <div className="fixed bottom-0 inset-x-0 z-40" style={{
        padding: '14px 16px',
        paddingBottom: 'calc(14px + env(safe-area-inset-bottom, 0px))',
        background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(20px) saturate(1.8)',
        borderTop: '1px solid var(--border)',
      }}>
        <div className="mx-auto w-full flex items-center" style={{ gap: 12, maxWidth: 480 }}>
          <div style={{ minWidth: 100 }}>
            <div style={{ color: 'var(--text-dim)', fontSize: 11 }}>Jami</div>
            <div className="price-lg" style={{ fontSize: 18 }}>{totalPrice.toLocaleString()} so'm</div>
          </div>
          <button onClick={handleAdd} disabled={added} className="btn btn-primary flex-1" style={added ? { background: 'var(--success)' } : {}}>
            {added ? (
              <span className="flex items-center justify-center" style={{ gap: 6 }}><Check size={18} /> Qo'shildi!</span>
            ) : (
              <span className="flex items-center justify-center" style={{ gap: 6 }}><ShoppingBag size={18} /> Buyurtma berish</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}