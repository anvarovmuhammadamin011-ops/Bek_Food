import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import useStore from '../store/useStore';
import Header from '../components/Header';
import BannerCarousel from '../components/BannerCarousel';
import FoodCard from '../components/FoodCard';
import RestaurantCard from '../components/RestaurantCard';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user, banners, foods, restaurants, categories, cart } = useStore();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const popularFoods = foods.filter(f => f.isPopular);
  const recommendedFoods = foods.filter(f => f.isRecommended);
  const dealsFoods = foods.filter(f => f.discountPrice);
  const nearbyRestaurants = restaurants.filter(r => r.isOpen);
  const filteredFoods = selectedCategory ? foods.filter(f => f.categoryId === selectedCategory) : null;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-24">
      <Header />

      <div className="px-4 space-y-6 mt-2">
        {/* Hero Card */}
        <div className="rounded-2xl border border-border bg-bg-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-text-secondary text-[10px] uppercase tracking-[0.25em] font-medium">Plan your next meal</p>
              <h2 className="mt-2 text-xl font-bold text-white tracking-tight">Fresh flavors in every order.</h2>
              <p className="mt-1.5 text-xs text-text-muted max-w-lg leading-relaxed">Explore top dishes, daily deals, and local restaurants selected just for you.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 grid-cols-2">
            <button onClick={() => navigate('/cart')} className="rounded-xl bg-white/5 border border-border px-4 py-2.5 text-left text-xs font-semibold text-white transition hover:bg-white/10">
              View cart
              <span className="block text-text-secondary text-[10px] font-normal mt-0.5">{cart?.length ?? 0} item{(cart?.length ?? 0) !== 1 ? 's' : ''} waiting</span>
            </button>
            <button onClick={() => navigate('/search')} className="rounded-xl bg-white text-black px-4 py-2.5 text-left text-xs font-bold transition hover:bg-white/90">
              Browse spots
              <span className="block text-[10px] text-black/60 font-normal mt-0.5">Search {restaurants.length} spots</span>
            </button>
          </div>
        </div>

        {/* Search Button */}
        <button onClick={() => navigate('/search')} className="w-full flex items-center gap-3 bg-bg-card border border-border rounded-xl py-3 px-4 transition-all duration-200 hover:border-accent-orange/30 active:scale-[0.98]">
          <Search size={18} className="text-text-muted" />
          <div className="flex flex-col items-start">
            <span className="text-xs font-semibold text-white">Search food, restaurants...</span>
            <span className="text-text-secondary text-[10px]">Try "Pizza", "Burger", or "Desserts"</span>
          </div>
        </button>

        <BannerCarousel banners={banners} />

        {/* Categories */}
        <div>
          <h2 className="text-sm font-bold mb-3 uppercase tracking-wider text-text-secondary">Categories</h2>
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border transition-all duration-200 ${selectedCategory === cat.id ? 'bg-accent-orange/10 border-accent-orange/40 text-accent-orange' : 'bg-bg-card border-border text-text-secondary'}`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="text-xs font-semibold whitespace-nowrap">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filtered by category */}
        {filteredFoods && (
          <div>
            <h2 className="text-sm font-bold mb-3 uppercase tracking-wider text-text-secondary">{categories.find(c => c.id === selectedCategory)?.name}</h2>
            <div className="space-y-2.5">
              {filteredFoods.map(food => <FoodCard key={food.id} food={food} />)}
              {filteredFoods.length === 0 && <p className="text-text-secondary text-sm text-center py-6">No items in this category</p>}
            </div>
          </div>
        )}

        {/* Today's Deals */}
        {!selectedCategory && (
          <>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary">Today's Deals</h2>
                <span className="text-accent-orange text-xs font-semibold">See All</span>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
                {dealsFoods.map(food => <FoodCard key={food.id} food={food} compact />)}
              </div>
            </div>

            {/* Popular Foods */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary">Popular Foods</h2>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
                {popularFoods.map(food => <FoodCard key={food.id} food={food} compact />)}
              </div>
            </div>

            {/* Recommended */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary">Recommended for You</h2>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
                {recommendedFoods.map(food => <FoodCard key={food.id} food={food} compact />)}
              </div>
            </div>

            {/* Nearby Restaurants */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary">Nearby Restaurants</h2>
              </div>
              <div className="space-y-3">
                {nearbyRestaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
