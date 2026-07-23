import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, Heart, Flame, Check } from 'lucide-react';
import useStore from '../store/useStore';

export default function FoodDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { foods, addToCart, toggleFavorite, isFavorite } = useStore();
  const food = foods.find(f => f.id === Number(id));

  const [quantity, setQuantity] = useState(1);
  const [extraCheese, setExtraCheese] = useState(false);
  const [extraSauce, setExtraSauce] = useState(false);
  const [notes, setNotes] = useState('');
  const [added, setAdded] = useState(false);

  if (!food) return <div className="h-full flex items-center justify-center text-text-secondary">Food not found</div>;

  const extras = [];
  if (extraCheese) extras.push({ name: 'Extra Cheese', price: 8000 });
  if (extraSauce) extras.push({ name: 'Extra Sauce', price: 5000 });
  const basePrice = food.discountPrice || food.price;
  const extrasTotal = extras.reduce((s, e) => s + e.price, 0);
  const totalPrice = (basePrice + extrasTotal) * quantity;
  const fav = isFavorite('food', food.id);

  const handleAdd = () => {
    addToCart(food, quantity, extras, notes);
    setAdded(true);
    setTimeout(() => { setAdded(false); navigate(-1); }, 800);
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="relative h-72">
        <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-black/30" />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl glass active:scale-95 transition-transform">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => toggleFavorite('food', food.id)} className="p-2.5 rounded-xl glass active:scale-95 transition-transform">
            <Heart size={20} className={fav ? 'fill-accent-red text-accent-red' : ''} />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-bg-card rounded-2xl p-5 border border-border animate-slide-up">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold">{food.name}</h1>
              <p className="text-text-secondary text-sm mt-1">{food.description}</p>
            </div>
            {food.discountPrice && (
              <div className="px-2.5 py-1 rounded-xl bg-accent-red/15 text-accent-red text-xs font-bold">
                -{Math.round((1 - food.discountPrice / food.price) * 100)}%
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 mt-3">
            <span className="text-accent-orange font-bold text-xl">{basePrice.toLocaleString()} so'm</span>
            {food.discountPrice && <span className="text-text-muted text-sm line-through">{food.price.toLocaleString()}</span>}
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-text-secondary">
            <span className="flex items-center gap-1">{food.calories} kcal</span>
            {food.spiceLevel > 0 && (
              <span className="flex items-center gap-0.5">
                {Array.from({ length: food.spiceLevel }).map((_, i) => <Flame key={i} size={12} className="text-accent-red" />)}
              </span>
            )}
          </div>

          <div className="mt-5">
            <h3 className="text-sm font-semibold mb-2">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {food.ingredients.map((ing, i) => (
                <span key={i} className="px-3 py-1.5 bg-bg-primary rounded-xl text-[11px] text-text-secondary border border-border">{ing}</span>
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <h3 className="text-sm font-semibold">Extras</h3>
            <button onClick={() => setExtraCheese(!extraCheese)} className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${extraCheese ? 'border-accent-orange/40 bg-accent-orange/10' : 'border-border bg-bg-primary'}`}>
              <span className="text-sm">Extra Cheese</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary">+8,000 so'm</span>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${extraCheese ? 'bg-accent-orange' : 'border border-border'}`}>
                  {extraCheese && <Check size={12} className="text-white" />}
                </div>
              </div>
            </button>
            <button onClick={() => setExtraSauce(!extraSauce)} className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${extraSauce ? 'border-accent-orange/40 bg-accent-orange/10' : 'border-border bg-bg-primary'}`}>
              <span className="text-sm">Extra Sauce</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary">+5,000 so'm</span>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${extraSauce ? 'bg-accent-orange' : 'border border-border'}`}>
                  {extraSauce && <Check size={12} className="text-white" />}
                </div>
              </div>
            </button>
          </div>

          <div className="mt-5">
            <h3 className="text-sm font-semibold mb-2">Notes</h3>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special requests..."
              className="w-full bg-bg-primary border border-border rounded-xl p-3 text-sm focus:border-accent-orange focus:outline-none transition-colors placeholder:text-text-muted resize-none h-20" />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass-strong border-t border-border z-40">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <div className="flex items-center gap-3 bg-bg-card rounded-xl px-2 border border-border">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 rounded-lg active:scale-90 transition-transform">
              <Minus size={16} />
            </button>
            <span className="font-bold text-lg min-w-[24px] text-center">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="p-2 rounded-lg active:scale-90 transition-transform">
              <Plus size={16} />
            </button>
          </div>
          <button onClick={handleAdd} disabled={added} className={`flex-1 btn-primary ${added ? 'bg-success' : ''} disabled:opacity-100`}>
            {added ? (
              <span className="flex items-center justify-center gap-2"><Check size={18} /> Added!</span>
            ) : (
              <span>Add to Cart — {totalPrice.toLocaleString()} so'm</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
