import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import FoodCard from '../components/FoodCard';
import RestaurantCard from '../components/RestaurantCard';
import { Heart, ArrowRight } from 'lucide-react';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, foods, restaurants } = useStore();
  const [activeTab, setActiveTab] = useState('restaurants');

  const tabs = [
    { id: 'restaurants', label: 'Restaurants' },
    { id: 'foods', label: 'Foods' },
  ];

  const favRestaurants = (restaurants || []).filter(r => (favorites || []).some(f => f.type === 'restaurant' && f.id === r.id));
  const favFoods = (foods || []).filter(f => (favorites || []).some(fav => fav.type === 'food' && fav.id === f.id));
  const displayed = activeTab === 'restaurants' ? favRestaurants : favFoods;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-24">
      <div className="p-4 glass-strong sticky top-0 z-30">
        <h1 className="text-lg font-bold text-center">Favorites</h1>
        <div className="tab-group mt-3">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto vertical-list">
        {displayed.length === 0 && (
          <div className="empty-state">
            <div className="icon-wrapper">
              <div className="icon-circle red">
                <Heart size={40} className="text-danger" />
              </div>
            </div>
            <h3>No favorites yet</h3>
            <p>Tap the heart icon on any restaurant or dish to save it here for quick access.</p>
            <button onClick={() => navigate('/')} className="btn btn-primary rounded-xl max-w-xs">
              Explore Restaurants <ArrowRight size={16} />
            </button>
          </div>
        )}
        {activeTab === 'restaurants' && favRestaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
        {activeTab === 'foods' && favFoods.map(f => <FoodCard key={f.id} food={f} />)}
      </div>
    </div>
  );
}
