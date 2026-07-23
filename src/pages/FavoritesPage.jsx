import { useState } from 'react';
import useStore from '../store/useStore';
import FoodCard from '../components/FoodCard';
import RestaurantCard from '../components/RestaurantCard';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites, foods, restaurants } = useStore();
  const [activeTab, setActiveTab] = useState('restaurants');

  const tabs = [
    { id: 'restaurants', label: 'Restaurants' },
    { id: 'foods', label: 'Foods' },
  ];

  const favRestaurants = restaurants.filter(r => favorites.some(f => f.type === 'restaurant' && f.id === r.id));
  const favFoods = foods.filter(f => favorites.some(f => f.type === 'food' && f.id === f.id));
  const displayed = activeTab === 'restaurants' ? favRestaurants : favFoods;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-24">
      <div className="p-4 glass-strong sticky top-0 z-30">
        <h1 className="text-lg font-bold text-center">Favorites</h1>
        <div className="flex gap-2 mt-3">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === tab.id ? 'bg-accent-orange text-white' : 'bg-bg-card text-text-secondary border border-border'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-3">
        {displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-bg-card border border-border flex items-center justify-center mb-4">
              <Heart size={24} className="text-text-secondary" />
            </div>
            <h3 className="font-bold mb-1">No favorites yet</h3>
            <p className="text-text-secondary text-sm">Tap the heart icon to save your favorites</p>
          </div>
        )}
        {activeTab === 'restaurants' && favRestaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
        {activeTab === 'foods' && favFoods.map(f => <FoodCard key={f.id} food={f} />)}
      </div>
    </div>
  );
}
