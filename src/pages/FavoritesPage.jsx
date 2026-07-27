import { useState } from 'react';
import { Heart } from 'lucide-react';
import useStore from '../store/useStore';
import FoodCard from '../components/FoodCard';
import RestaurantCard from '../components/RestaurantCard';

export default function FavoritesPage() {
  const { favorites, foods, restaurants } = useStore();
  const [tab, setTab] = useState('restaurants');

  const favRestaurants = restaurants.filter((r) => favorites.some((f) => f.type === 'restaurant' && f.id === r.id));
  const favFoods = foods.filter((f) => favorites.some((fav) => fav.type === 'food' && fav.id === f.id));

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="p-4">
        <h1 className="heading text-center" style={{ marginBottom: 12 }}>Sevimlilar</h1>
        <div className="flex gap-2">
          {[
            { id: 'restaurants', label: 'Restoranlar' },
            { id: 'foods', label: 'Taomlar' },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1" style={{
                padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all .15s',
                background: tab === t.id ? '#e51e1e' : '#141414',
                color: tab === t.id ? '#fff' : '#6b6b6b',
                border: `1px solid ${tab === t.id ? '#e51e1e' : 'rgba(255,255,255,0.08)'}`
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {(tab === 'restaurants' ? favRestaurants : favFoods).length === 0 && (
          <div className="empty-state py-16">
            <div className="empty-state-icon">
              <Heart size={20} />
            </div>
            <h3 style={{ color: '#fff', fontWeight: 500, marginBottom: 4 }}>Sevimlilar yo'q</h3>
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>Yurakcha bosib sevimlilarga qo'shing</p>
          </div>
        )}
        {tab === 'restaurants' && favRestaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
        {tab === 'foods' && <div className="grid grid-cols-2" style={{ gap: 10 }}>{favFoods.map((f) => <FoodCard key={f.id} food={f} />)}</div>}
      </div>
    </div>
  );
}
