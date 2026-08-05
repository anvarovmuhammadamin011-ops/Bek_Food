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
    <div className="h-full overflow-y-auto scrollbar-hide pb-36">
      <div className="relative" style={{ height: 'clamp(180px, 40vw, 260px)' }}>
        <img src={restaurant.coverImage} alt="" onError={(e) => { e.currentTarget.src = '/food/restaurant-cover.svg'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 50%)' }} />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: 'var(--radius-sm)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
            <ChevronLeft size={20} color="var(--text)" />
          </button>
          <button onClick={() => toggleFavorite('restaurant', restaurant.id)} style={{ background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: 'var(--radius-sm)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
            <Heart size={18} color={fav ? 'var(--danger)' : 'var(--text-muted)'} fill={fav ? 'var(--danger)' : 'none'} />
          </button>
        </div>
      </div>

      <div className="px-4" style={{ marginTop: -40, position: 'relative', zIndex: 10, paddingBottom: 16 }}>
        <div className="card p-4 animate-slide-up">
          <div className="flex items-start" style={{ gap: 14, marginBottom: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: 'var(--radius)', border: '2px solid var(--border)', overflow: 'hidden', flexShrink: 0 }}>
              <img src={restaurant.logo} alt="" onError={(e) => { e.currentTarget.src = '/logo.png'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <h1 className="display-3" style={{ fontSize: 20 }}>{restaurant.name}</h1>
              <div className="flex items-center" style={{ gap: 12, marginTop: 4, fontSize: 12, color: 'var(--text-muted)' }}>
                <span className="flex items-center" style={{ gap: 4 }}><Star size={13} color="var(--primary)" fill="var(--primary)" />{restaurant.rating}</span>
                <span className="flex items-center" style={{ gap: 4 }}><Clock size={13} />{restaurant.deliveryTime} min</span>
                <span className="flex items-center" style={{ gap: 4 }}><MapPin size={13} />{restaurant.distance}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center" style={{ gap: 8 }}>
            <span className={`badge ${restaurant.isOpen ? 'badge-success' : 'badge-danger'}`}>
              <span className="status-dot" style={{ width: 6, height: 6, background: restaurant.isOpen ? 'var(--success)' : 'var(--danger)', borderRadius: '50%', display: 'inline-block' }} />
              {restaurant.isOpen ? 'Ishlamoqda' : 'Yopiq'}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{restaurant.workingHours}</span>
          </div>
        </div>

        <div className="flex overflow-x-auto scrollbar-hide relative" style={{ gap: 8, marginTop: 16, marginBottom: 14, paddingBottom: 2 }}>
          <button onClick={() => setActiveCategory(null)} className="whitespace-nowrap" style={{
            padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 500,
            background: !activeCategory ? 'var(--primary)' : 'var(--surface)',
            border: `1.5px solid ${!activeCategory ? 'var(--primary)' : 'var(--border)'}`,
            color: !activeCategory ? '#fff' : 'var(--text-muted)',
            cursor: 'pointer', transition: 'all .2s', flexShrink: 0,
          }}>
            Hammasi
          </button>
          {foodCats.map((catId) => {
            const cat = categories.find((c) => c.id === catId);
            return (
              <button key={catId} onClick={() => setActiveCategory(catId)} className="whitespace-nowrap" style={{
                padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 500,
                background: activeCategory === catId ? 'var(--primary)' : 'var(--surface)',
                border: `1.5px solid ${activeCategory === catId ? 'var(--primary)' : 'var(--border)'}`,
                color: activeCategory === catId ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all .2s', flexShrink: 0,
              }}>
                {cat?.name}
              </button>
            );
          })}
          <div
            className="pointer-events-none"
            style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: 40,
              background: 'linear-gradient(90deg, transparent, var(--bg))',
            }}
          />
        </div>

        <div className="grid food-grid" style={{ gap: 12, paddingBottom: 32 }}>
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
