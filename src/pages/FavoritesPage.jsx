import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import FoodCard from '../components/FoodCard';
import RestaurantCard from '../components/RestaurantCard';
import EmptyState from '../components/EmptyState';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, foods, restaurants } = useStore();
  const [tab, setTab] = useState('restaurants');

  const favRestaurants = restaurants.filter((r) => favorites.some((f) => f.type === 'restaurant' && f.id === r.id));
  const favFoods = foods.filter((f) => favorites.some((fav) => fav.type === 'food' && fav.id === f.id));

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="p-4">
        <h1 className="heading text-center" style={{ marginBottom: 14 }}>Sevimlilar</h1>
        <div className="flex" style={{ gap: 8 }}>
          {[{ id: 'restaurants', label: 'Restoranlar' }, { id: 'foods', label: 'Taomlar' }].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className="flex-1" style={{
              padding: '10px 0', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all .2s',
              background: tab === t.id ? 'var(--primary)' : 'var(--surface)',
              color: tab === t.id ? '#fff' : 'var(--text-muted)',
              border: `1.5px solid ${tab === t.id ? 'var(--primary)' : 'var(--border)'}`,
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {(tab === 'restaurants' ? favRestaurants : favFoods).length === 0 && (
          <EmptyState icon="heart" title="Sevimlilar yo'q" description="Yurakcha bosib sevimlilarga qo'shing" actionLabel="Menyuga o'tish" onAction={() => navigate('/')} />
        )}
        {tab === 'restaurants' && <div className="space-y-3">{favRestaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}</div>}
        {tab === 'foods' && <div className="grid grid-cols-2" style={{ gap: 12 }}>{favFoods.map((f) => <FoodCard key={f.id} food={f} />)}</div>}
      </div>
    </div>
  );
}
