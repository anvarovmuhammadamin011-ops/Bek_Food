import { useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      className="cursor-pointer"
      style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden' }}
    >
      <div style={{ height: 120, position: 'relative' }}>
        <img src={restaurant.coverImage} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a0a0a 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
          <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-display)' }}>{restaurant.name}</h3>
          <p style={{ color: '#b8b8b8', fontSize: 11, marginTop: 2 }}>{restaurant.cuisine}</p>
        </div>
      </div>
      <div style={{ padding: 12, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontSize: 11, color: '#6b6b6b' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={12} color="#e51e1e" /> {restaurant.rating}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {restaurant.deliveryTime} min</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {restaurant.distance}</span>
      </div>
    </div>
  );
}
