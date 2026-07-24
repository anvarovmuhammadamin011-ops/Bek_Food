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

  if (!restaurant) return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Restaurant not found</span>
    </div>
  );

  const restaurantFoods = foods.filter(f => f.restaurantId === restaurant.id);
  const filteredFoods = activeCategory ? restaurantFoods.filter(f => f.categoryId === activeCategory) : restaurantFoods;
  const foodCategories = [...new Set(restaurantFoods.map(f => f.categoryId))];
  const fav = isFavorite('restaurant', restaurant.id);

  return (
    <div className="h-full overflow-y-auto scrollbar-hide" style={{ paddingBottom: '100px' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: '224px' }}>
        <img src={restaurant.coverImage} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, var(--bg-primary) 0%, rgba(255,248,241,0.4) 50%, transparent 100%)',
        }} />
        <div style={{ position: 'absolute', top: '12px', left: '14px', right: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate(-1)} style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', color: 'var(--text-primary)',
          }}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => toggleFavorite('restaurant', restaurant.id)} style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: fav ? 'rgba(224, 49, 49, 0.9)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            color: fav ? 'white' : 'var(--text-primary)',
            transition: 'all 0.25s ease',
          }}>
            <Heart size={18} fill={fav ? 'white' : 'none'} />
          </button>
        </div>
      </div>

      <div style={{ padding: '0 16px', marginTop: '-32px', position: 'relative', zIndex: 10 }}>
        {/* Restaurant info card */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
          padding: '20px', boxShadow: 'var(--shadow-card)', border: '1px solid var(--border)',
          animation: 'slideUp 0.4s ease-out',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '12px' }}>
            <img src={restaurant.logo} alt="" style={{
              width: '56px', height: '56px', borderRadius: '16px',
              border: '3px solid var(--bg-card)', objectFit: 'cover',
              boxShadow: 'var(--shadow-card)',
            }} />
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {restaurant.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Star size={12} color="var(--color-warning)" fill="var(--color-warning)" /> {restaurant.rating}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Clock size={12} /> {restaurant.deliveryTime} min
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <MapPin size={12} /> {restaurant.distance}
                </span>
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 12px', borderRadius: '9999px',
            background: restaurant.isOpen ? 'var(--color-success-light)' : 'var(--color-danger-light)',
            fontSize: '11px', fontWeight: 700,
            color: restaurant.isOpen ? 'var(--color-success)' : 'var(--color-danger)',
          }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: restaurant.isOpen ? 'var(--color-success)' : 'var(--color-danger)',
            }} />
            {restaurant.isOpen ? 'Open Now' : 'Closed'}
          </div>
        </div>

        {/* Category filter */}
        <div style={{
          display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px',
          marginTop: '12px', margin: '12px -16px 0', paddingLeft: '16px', paddingRight: '16px',
        }}>
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              flexShrink: 0, padding: '8px 16px', borderRadius: 'var(--radius-md)',
              fontSize: '12px', fontWeight: 600, transition: 'all 0.2s ease',
              background: !activeCategory ? 'var(--color-primary)' : 'var(--bg-card)',
              color: !activeCategory ? 'white' : 'var(--text-secondary)',
              border: !activeCategory ? 'none' : '1px solid var(--border)',
              cursor: 'pointer', fontFamily: 'var(--font-family)',
              boxShadow: !activeCategory ? 'var(--shadow-primary)' : 'none',
            }}
          >
            All
          </button>
          {foodCategories.map(catId => {
            const cat = categories.find(c => c.id === catId);
            const isActive = activeCategory === catId;
            return (
              <button key={catId} onClick={() => setActiveCategory(catId)}
                style={{
                  flexShrink: 0, padding: '8px 16px', borderRadius: 'var(--radius-md)',
                  fontSize: '12px', fontWeight: 600, transition: 'all 0.2s ease',
                  background: isActive ? 'var(--color-primary)' : 'var(--bg-card)',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  border: isActive ? 'none' : '1px solid var(--border)',
                  cursor: 'pointer', fontFamily: 'var(--font-family)',
                  boxShadow: isActive ? 'var(--shadow-primary)' : 'none',
                }}
              >
                {cat?.icon} {cat?.name}
              </button>
            );
          })}
        </div>

        {/* Food list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '24px' }}>
          {filteredFoods.map(food => <FoodCard key={food.id} food={food} />)}
          {filteredFoods.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 8px',
              }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '16px', fontWeight: 700 }}>0</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No items available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
