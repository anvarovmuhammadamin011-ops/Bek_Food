import { useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin, Heart } from 'lucide-react';
import useStore from '../store/useStore';

export default function RestaurantCard({ restaurant, compact = false }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useStore();
  const fav = isFavorite('restaurant', restaurant.id);

  return (
    <div
      onClick={() => { useStore.getState().selectRestaurant(restaurant.id); navigate(`/restaurant/${restaurant.id}`); }}
      className="restaurant-card"
    >
      <div className="image-wrapper">
        <img src={restaurant.coverImage} alt={restaurant.name} loading="lazy" />
        {!restaurant.isOpen && (
          <div className="closed-overlay">
            <span>Closed</span>
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite('restaurant', restaurant.id); }}
          className={`fav-btn ${fav ? 'active' : ''}`}
        >
          <Heart size={11} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="info">
        <div className="header">
          <h4 className="name">{restaurant.name}</h4>
          <span className={`status-badge ${restaurant.isOpen ? 'open' : 'closed'}`}>
            {restaurant.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
        <p className="cuisine">{restaurant.cuisine || 'Top rated local spot'}</p>
        <div className="meta">
          <span className="rating">
            <Star size={10} fill="currentColor" /> {restaurant.rating}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <Clock size={10} /> {restaurant.deliveryTime}m
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <MapPin size={10} /> {restaurant.distance}
          </span>
        </div>
        <div className="footer">
          <span>{restaurant.minOrder ? `Min ${restaurant.minOrder.toLocaleString()}` : 'Free delivery'}</span>
        </div>
      </div>
    </div>
  );
}
