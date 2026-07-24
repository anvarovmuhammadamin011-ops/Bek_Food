import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, Clock, Star, ShieldCheck, Truck } from 'lucide-react';
import useStore from '../store/useStore';
import Header from '../components/Header';
import BannerCarousel from '../components/BannerCarousel';
import FoodCard from '../components/FoodCard';
import RestaurantCard from '../components/RestaurantCard';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, banners, foods, restaurants, categories, cart } = useStore();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const popularFoods = useMemo(() => foods.filter(f => f.isPopular), [foods]);
  const recommendedFoods = useMemo(() => foods.filter(f => f.isRecommended), [foods]);
  const dealsFoods = useMemo(() => foods.filter(f => f.discountPrice), [foods]);
  const quickDeliveryFoods = useMemo(() => foods.filter(f => f.prepTime && f.prepTime <= 5), [foods]);
  const nearbyRestaurants = useMemo(() => restaurants.filter(r => r.isOpen), [restaurants]);
  const filteredFoods = useMemo(() => selectedCategory ? foods.filter(f => f.categoryId === selectedCategory) : null, [selectedCategory, foods]);

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-24">
      <Header />

      <div className="px-4 space-y-6 mt-2">
        {/* Hero Section */}
        <div className="hero-card" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
          <div className="flex items-center gap-1.5 mb-3">
            <ShieldCheck size={14} className="text-success" />
            <span className="text-success text-[10px] font-semibold uppercase tracking-wider">Trusted by 5,000+ customers</span>
          </div>
          <h2 className="title" style={{ fontSize: '28px', lineHeight: '1.1' }}>
            Mini snacks,<br />
            <span className="text-primary">big taste.</span>
          </h2>
          <p className="subtitle">Fresh mini fast food delivered to your door in under 10 minutes. No minimum order.</p>

          {/* Stats Row */}
          <div className="flex items-center gap-4 mt-4 py-3 px-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-primary" />
              <span className="text-xs font-bold">10 min</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Star size={14} className="text-warning" fill="currentColor" />
              <span className="text-xs font-bold">4.8</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Truck size={14} className="text-success" />
              <span className="text-xs font-bold">Free delivery</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="actions">
            <button onClick={() => navigate('/search')} className="action-btn primary" style={{ background: 'var(--color-primary)', color: 'white' }}>
              Order Now
              <span className="hint" style={{ color: 'rgba(255,255,255,0.7)' }}>Browse {restaurants.length} spots</span>
            </button>
            <button onClick={() => navigate('/cart')} className="action-btn secondary">
              View Cart
              <span className="hint">{cart?.length ?? 0} item{(cart?.length ?? 0) !== 1 ? 's' : ''}</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-1 text-[10px] text-muted">
              <Zap size={10} className="text-primary" /> Quick Delivery
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted">
              <ShieldCheck size={10} className="text-success" /> Secure Payment
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted">
              <Star size={10} className="text-warning" /> Top Rated
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button onClick={() => navigate('/search')} className="w-full flex items-center gap-3 bg-card border rounded-xl py-3 px-4 transition-all duration-200 hover:border-primary active:scale-[0.98]">
          <Search size={18} className="text-muted" />
          <div className="flex flex-col items-start">
            <span className="text-xs font-semibold text-white">Search mini bites...</span>
            <span className="text-secondary text-[10px]">Try "Burger", "Pizza", or "Wrap"</span>
          </div>
        </button>

        <BannerCarousel banners={banners} />

        {/* Categories */}
        <div>
          <div className="section-header">
            <h2>Categories</h2>
          </div>
          <div className="scroll-row">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              >
                <span className="icon">{cat.icon}</span>
                <span className="label">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filtered by category */}
        {filteredFoods && (
          <div>
            <div className="section-header">
              <h2>{categories.find(c => c.id === selectedCategory)?.name}</h2>
            </div>
            <div className="vertical-list">
              {filteredFoods.map(food => <FoodCard key={food.id} food={food} />)}
              {filteredFoods.length === 0 && <p className="text-secondary text-sm text-center py-6">No items in this category</p>}
            </div>
          </div>
        )}

        {/* Today's Deals */}
        {!selectedCategory && (
          <>
            <div>
              <div className="section-header">
                <h2>Today's Deals</h2>
                <span className="see-all">See All</span>
              </div>
              <div className="scroll-row scroll-fade">
                {dealsFoods.map(food => <FoodCard key={food.id} food={food} compact />)}
              </div>
            </div>

            {/* Quick Delivery */}
            {quickDeliveryFoods.length > 0 && (
              <div>
                <div className="section-header">
                  <div className="icon-title">
                    <Zap size={14} className="text-primary" />
                    <h2>Under 5 min</h2>
                  </div>
                  <span className="see-all">See All</span>
                </div>
                <div className="scroll-row scroll-fade">
                  {quickDeliveryFoods.map(food => <FoodCard key={food.id} food={food} compact />)}
                </div>
              </div>
            )}

            {/* Popular Foods */}
            <div>
              <div className="section-header">
                <h2>Popular Bites</h2>
                <span className="see-all">See All</span>
              </div>
              <div className="scroll-row scroll-fade">
                {popularFoods.map(food => <FoodCard key={food.id} food={food} compact />)}
              </div>
            </div>

            {/* Recommended */}
            <div>
              <div className="section-header">
                <h2>Recommended for You</h2>
                <span className="see-all">See All</span>
              </div>
              <div className="scroll-row scroll-fade">
                {recommendedFoods.map(food => <FoodCard key={food.id} food={food} compact />)}
              </div>
            </div>

            {/* Nearby Restaurants */}
            <div>
              <div className="section-header">
                <h2>Nearby Spots</h2>
                <span className="see-all">See All</span>
              </div>
              <div className="vertical-list">
                {nearbyRestaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
