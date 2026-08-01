import { useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      className="card card-hover"
      style={{ cursor: 'pointer' }}
    >
      <div style={{ height: 130, position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = '/food/restaurant-cover.svg'; }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
          <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>{restaurant.name}</h3>
          <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 12, marginTop: 2 }}>{restaurant.cuisine}</p>
        </div>
      </div>
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Star size={13} color="var(--primary)" fill="var(--primary)" /> {restaurant.rating}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={13} /> {restaurant.deliveryTime} min
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <MapPin size={13} /> {restaurant.distance}
        </span>
      </div>
    </div>
  );
}
