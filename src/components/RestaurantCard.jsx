import { useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin, Heart } from 'lucide-react';
import useStore from '../store/useStore';

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useStore();
  const fav = isFavorite('restaurant', restaurant.id);

  return (
    <div
      onClick={() => { useStore.getState().selectRestaurant(restaurant.id); navigate(`/restaurant/${restaurant.id}`); }}
      className="group overflow-hidden rounded-2xl border border-border bg-bg-card cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="relative h-40 overflow-hidden">
        <img src={restaurant.coverImage} alt={restaurant.name} className="w-full h-full object-cover animate-fade-in" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{restaurant.name}</h3>
              <p className="text-[11px] text-text-secondary mt-0.5">{restaurant.cuisine || 'Top rated local spot'}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite('restaurant', restaurant.id); }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white transition-all duration-200 hover:bg-white/10"
            >
              <Heart size={14} className={fav ? 'fill-accent-red text-accent-red' : 'text-white'} />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1 text-warning font-semibold">
            <Star size={12} className="fill-warning" /> {restaurant.rating}
          </span>
          <span className="inline-flex items-center gap-1"><Clock size={12} /> {restaurant.deliveryTime} min</span>
          <span className="inline-flex items-center gap-1"><MapPin size={12} /> {restaurant.distance}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-text-muted border-t border-border/40 pt-2.5">
          <span>{restaurant.minOrder ? `Min order ${restaurant.minOrder.toLocaleString()} so'm` : 'Free delivery'}</span>
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${restaurant.isOpen ? 'text-success' : 'text-accent-red'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${restaurant.isOpen ? 'bg-success' : 'bg-accent-red'}`} />
            {restaurant.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>
    </div>
  );
}
