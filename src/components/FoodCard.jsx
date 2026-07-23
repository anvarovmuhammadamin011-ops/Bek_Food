import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import useStore from '../store/useStore';

export default function FoodCard({ food, compact = false }) {
  const navigate = useNavigate();
  const addToCart = useStore((s) => s.addToCart);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(food);
  };

  if (compact) {
    return (
      <div
        onClick={() => { useStore.getState().selectFood(food.id); navigate(`/food/${food.id}`); }}
        className="group flex-shrink-0 w-36 overflow-hidden rounded-2xl border border-border bg-bg-card cursor-pointer transition-all duration-300 hover:-translate-y-1"
      >
        <div className="relative h-28 overflow-hidden">
          <img src={food.image} alt={food.name} className="w-full h-full object-cover animate-fade-in" loading="lazy" />
          {food.discountPrice && (
            <div className="absolute top-3 left-3 rounded-full bg-accent-red px-2 py-1 text-[10px] font-bold text-white shadow-sm">
              -{Math.round((1 - food.discountPrice / food.price) * 100)}%
            </div>
          )}
        </div>
        <div className="p-3">
          <h4 className="text-xs font-semibold text-white truncate">{food.name}</h4>
          <div className="mt-2 flex items-center justify-between gap-2">
            <div>
              <span className="text-accent-orange font-bold text-xs">{(food.discountPrice || food.price).toLocaleString()}</span>
              {food.discountPrice && <span className="ml-1 text-text-muted text-[9px] line-through">{food.price.toLocaleString()}</span>}
            </div>
            <button className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-orange text-white transition-transform duration-200 group-hover:scale-105">
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => { useStore.getState().selectFood(food.id); navigate(`/food/${food.id}`); }}
      className="group flex items-center gap-3 rounded-2xl border border-border bg-bg-card p-3 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0" style={{ background: '#09090b' }}>
        <img src={food.image} alt={food.name} className="w-full h-full object-cover animate-fade-in" loading="lazy" />
        {food.discountPrice && (
          <div className="absolute top-2 left-2 rounded-full bg-accent-red px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
            -{Math.round((1 - food.discountPrice / food.price) * 100)}%
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white truncate">{food.name}</h4>
        <p className="text-text-secondary text-[11px] truncate mt-0.5">{food.description}</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-accent-orange font-bold text-sm">{(food.discountPrice || food.price).toLocaleString()} so'm</span>
            {food.discountPrice && <span className="text-text-muted text-[10px] line-through">{food.price.toLocaleString()}</span>}
          </div>
          <button onClick={handleAdd} className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent-orange text-white transition-transform duration-200 hover:scale-105 active:scale-95">
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
