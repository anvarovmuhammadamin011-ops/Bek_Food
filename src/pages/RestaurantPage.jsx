import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin, Heart, ChevronLeft } from 'lucide-react';
import useStore from '../store/useStore';
import FoodCard from '../components/FoodCard';

export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { restaurants, foods, categories, toggleFavorite, isFavorite } = useStore();
  const restaurant = restaurants.find(r => r.id === Number(id));
  const [activeCategory, setActiveCategory] = useState(null);

  if (!restaurant) return <div className="h-full flex items-center justify-center text-text-secondary">Restaurant not found</div>;

  const restaurantFoods = foods.filter(f => f.restaurantId === restaurant.id);
  const filteredFoods = activeCategory ? restaurantFoods.filter(f => f.categoryId === activeCategory) : restaurantFoods;
  const foodCategories = [...new Set(restaurantFoods.map(f => f.categoryId))];
  const fav = isFavorite('restaurant', restaurant.id);

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-20">
      <div className="relative h-56">
        <img src={restaurant.coverImage} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl glass active:scale-95 transition-transform">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => toggleFavorite('restaurant', restaurant.id)} className="p-2.5 rounded-xl glass active:scale-95 transition-transform">
            <Heart size={20} className={fav ? 'fill-accent-red text-accent-red' : ''} />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-10">
        <div className="flex items-end gap-3 mb-4">
          <img src={restaurant.logo} alt="" className="w-16 h-16 rounded-2xl border-2 border-bg-primary object-cover" />
          <div>
            <h1 className="text-xl font-bold">{restaurant.name}</h1>
            <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary">
              <span className="flex items-center gap-1"><Star size={12} className="text-warning fill-warning" />{restaurant.rating}</span>
              <span className="flex items-center gap-1"><Clock size={12} />{restaurant.deliveryTime} min</span>
              <span className="flex items-center gap-1"><MapPin size={12} />{restaurant.distance}</span>
            </div>
          </div>
        </div>

        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-5 ${restaurant.isOpen ? 'bg-success/15 text-success' : 'bg-accent-red/15 text-accent-red'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${restaurant.isOpen ? 'bg-success' : 'bg-accent-red'}`} />
          {restaurant.isOpen ? 'Open Now' : 'Closed'}
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4 -mx-4 px-4">
          <button onClick={() => setActiveCategory(null)} className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${!activeCategory ? 'bg-accent-orange text-white' : 'bg-bg-card text-text-secondary border border-border'}`}>
            All
          </button>
          {foodCategories.map(catId => {
            const cat = categories.find(c => c.id === catId);
            return (
              <button key={catId} onClick={() => setActiveCategory(catId)} className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeCategory === catId ? 'bg-accent-orange text-white' : 'bg-bg-card text-text-secondary border border-border'}`}>
                {cat?.icon} {cat?.name}
              </button>
            );
          })}
        </div>

        <div className="space-y-3 pb-8">
          {filteredFoods.map(food => <FoodCard key={food.id} food={food} />)}
          {filteredFoods.length === 0 && (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-full bg-bg-card border border-border flex items-center justify-center mx-auto">
                <span className="text-text-secondary text-lg font-bold">0</span>
              </div>
              <p className="text-text-secondary text-sm mt-2">No items available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
