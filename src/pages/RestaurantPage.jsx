import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin, Heart, ChevronLeft } from 'lucide-react';
import useStore from '../store/useStore';
import FoodCard from '../components/FoodCard';

export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { restaurants, foods, categories, toggleFavorite, isFavorite } = useStore();
  const restaurant = restaurants.find((r) => r.id === Number(id));
  const [activeCategory, setActiveCategory] = useState(null);

  if (!restaurant) return <div className="h-full flex-center text-muted">Topilmadi</div>;

  const restaurantFoods = foods.filter((f) => f.restaurantId === restaurant.id);
  const filtered = activeCategory ? restaurantFoods.filter((f) => f.categoryId === activeCategory) : restaurantFoods;
  const foodCats = [...new Set(restaurantFoods.map((f) => f.categoryId))];
  const fav = isFavorite('restaurant', restaurant.id);

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="relative" style={{ height: 256 }}>
        <img src={restaurant.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a0a0a 0%, transparent 50%)' }} />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(20,20,20,.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
            <ChevronLeft size={20} color="#fff" />
          </button>
          <button onClick={() => toggleFavorite('restaurant', restaurant.id)} style={{ background: 'rgba(20,20,20,.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
            <Heart size={18} color={fav ? '#e51e1e' : '#fff'} fill={fav ? '#e51e1e' : 'none'} />
          </button>
        </div>
      </div>

      <div className="px-4" style={{ marginTop: -64, position: 'relative', zIndex: 10, paddingBottom: 16 }}>
        <div className="card p-4 animate-slide-up">
          <div className="flex items-start gap-3 mb-3">
            <div style={{ width: 56, height: 56, borderRadius: 10, border: '2px solid rgba(255,255,255,0.08)', overflow: 'hidden', flexShrink: 0 }}>
              <img src={restaurant.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h1 className="display-3">{restaurant.name}</h1>
              <div className="flex items-center gap-3 mt-1" style={{ fontSize: 12, color: '#6b6b6b' }}>
                <span className="flex items-center gap-1"><Star size={12} color="#e51e1e" />{restaurant.rating}</span>
                <span className="flex items-center gap-1"><Clock size={12} />{restaurant.deliveryTime} min</span>
                <span className="flex items-center gap-1"><MapPin size={12} />{restaurant.distance}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`badge ${restaurant.isOpen ? 'badge-green' : 'badge-red'}`}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: restaurant.isOpen ? '#7fbf7f' : '#e51e1e' }} />
              {restaurant.isOpen ? 'Ishlamoqda' : 'Yopiq'}
            </span>
            <span style={{ color: '#6b6b6b', fontSize: 12 }}>{restaurant.workingHours}</span>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide" style={{ marginTop: 16, marginBottom: 12, paddingBottom: 2 }}>
          <button onClick={() => setActiveCategory(null)} className="whitespace-nowrap" style={{
            padding: '6px 12px', borderRadius: 16, fontSize: 11, fontWeight: 500,
            background: !activeCategory ? '#e51e1e' : '#141414',
            border: `1px solid ${!activeCategory ? '#e51e1e' : 'rgba(255,255,255,0.08)'}`,
            color: !activeCategory ? '#fff' : '#b8b8b8',
            cursor: 'pointer', transition: 'all .15s'
          }}>
            Hammasi
          </button>
          {foodCats.map((catId) => {
            const cat = categories.find((c) => c.id === catId);
            return (
              <button key={catId} onClick={() => setActiveCategory(catId)} className="whitespace-nowrap" style={{
                padding: '6px 12px', borderRadius: 16, fontSize: 11, fontWeight: 500,
                background: activeCategory === catId ? '#e51e1e' : '#141414',
                border: `1px solid ${activeCategory === catId ? '#e51e1e' : 'rgba(255,255,255,0.08)'}`,
                color: activeCategory === catId ? '#fff' : '#b8b8b8',
                cursor: 'pointer', transition: 'all .15s'
              }}>
                {cat?.name}
              </button>
            );
          })}
        </div>

        {/* Foods */}
        <div className="grid grid-cols-2" style={{ gap: 10, paddingBottom: 32 }}>
          {filtered.map((food) => <FoodCard key={food.id} food={food} />)}
          {filtered.length === 0 && (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <p className="text-muted">Bu kategoriyada mahsulot yo'q</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
