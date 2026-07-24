import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap } from 'lucide-react';
import useStore from '../store/useStore';
import Header from '../components/Header';
import BannerCarousel from '../components/BannerCarousel';
import FoodCard from '../components/FoodCard';
import RestaurantCard from '../components/RestaurantCard';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, banners, foods, restaurants, categories, cart } = useStore();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const popularFoods = foods.filter(f => f.isPopular);
  const recommendedFoods = foods.filter(f => f.isRecommended);
  const dealsFoods = foods.filter(f => f.discountPrice);
  const quickDeliveryFoods = foods.filter(f => f.prepTime && f.prepTime <= 5);
  const nearbyRestaurants = restaurants.filter(r => r.isOpen);
  const filteredFoods = selectedCategory ? foods.filter(f => f.categoryId === selectedCategory) : null;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-24">
      <Header />

      <div className="px-4 space-y-6 mt-2">
        {/* Hero Card */}
        <div className="hero-card">
          <p className="tagline">Quick bites, quick delivery</p>
          <h2 className="title">Mini snacks, big taste.</h2>
          <p className="subtitle">Order mini fast food delivered in under 10 minutes.</p>
          <div className="actions">
            <button onClick={() => navigate('/cart')} className="action-btn secondary">
              View cart
              <span className="hint">{cart?.length ?? 0} item{(cart?.length ?? 0) !== 1 ? 's' : ''} waiting</span>
            </button>
            <button onClick={() => navigate('/search')} className="action-btn primary">
              Quick Order
              <span className="hint">Browse {restaurants.length} spots</span>
            </button>
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
