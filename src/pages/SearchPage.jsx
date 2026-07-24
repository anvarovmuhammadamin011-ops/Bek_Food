import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, SlidersHorizontal, Zap, RotateCcw } from 'lucide-react';
import useStore from '../store/useStore';
import FoodCard from '../components/FoodCard';
import RestaurantCard from '../components/RestaurantCard';

const deliveryTimeFilters = [
  { id: 'quick', label: 'Under 5 min', icon: '⚡', maxMinutes: 5 },
  { id: 'fast', label: 'Under 10 min', icon: '🚀', maxMinutes: 10 },
  { id: 'normal', label: 'Under 15 min', icon: '⏱️', maxMinutes: 15 },
];

const distanceFilters = [
  { id: 'close', label: 'Nearby', icon: '📍', maxKm: 0.5 },
  { id: 'mid', label: '1 km', icon: '🚶', maxKm: 1.0 },
  { id: 'far', label: '2 km', icon: '🚴', maxKm: 2.0 },
];

export default function SearchPage() {
  const navigate = useNavigate();
  const { search, searchQuery, searchResults, recentSearches, categories, foods, restaurants } = useStore();
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [quickDelivery, setQuickDelivery] = useState(false);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(null);
  const [selectedDistance, setSelectedDistance] = useState(null);
  const [onlyOpen, setOnlyOpen] = useState(false);

  useEffect(() => { search(query); }, [query]);

  const hasActiveFilters = selectedCategory || minPrice || maxPrice || minRating > 0 || quickDelivery || selectedDeliveryTime || selectedDistance || onlyOpen;

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setQuickDelivery(false);
    setSelectedDeliveryTime(null);
    setSelectedDistance(null);
    setOnlyOpen(false);
    setSortBy('relevance');
  };

  const results = useMemo(() => {
    let filtered = query ? [...searchResults] : [...foods.map(f => ({...f, type: 'food'})), ...restaurants.map(r => ({...r, type: 'restaurant'}))];

    if (selectedCategory) filtered = filtered.filter(r => r.categoryId === selectedCategory);
    if (minPrice) filtered = filtered.filter(r => r.price >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter(r => r.price <= Number(maxPrice));
    if (minRating > 0) filtered = filtered.filter(r => r.rating >= minRating);

    if (quickDelivery) {
      filtered = filtered.filter(r => {
        if (r.type === 'restaurant') {
          const maxTime = parseInt(r.deliveryTime?.split('-')[1] || '99');
          return maxTime <= 10;
        }
        return true;
      });
    }

    if (selectedDeliveryTime) {
      const filter = deliveryTimeFilters.find(f => f.id === selectedDeliveryTime);
      if (filter) {
        filtered = filtered.filter(r => {
          if (r.type === 'restaurant') {
            const maxTime = parseInt(r.deliveryTime?.split('-')[1] || '99');
            return maxTime <= filter.maxMinutes;
          }
          return true;
        });
      }
    }

    if (selectedDistance) {
      const filter = distanceFilters.find(f => f.id === selectedDistance);
      if (filter) {
        filtered = filtered.filter(r => {
          if (r.type === 'restaurant') {
            const dist = parseFloat(r.distance) || 99;
            return dist <= filter.maxKm;
          }
          return true;
        });
      }
    }

    if (onlyOpen) {
      filtered = filtered.filter(r => {
        if (r.type === 'restaurant') return r.isOpen;
        return true;
      });
    }

    if (sortBy === 'price-low') filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === 'price-high') filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortBy === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === 'delivery') {
      filtered.sort((a, b) => {
        const aTime = parseInt(a.deliveryTime?.split('-')[1] || '99');
        const bTime = parseInt(b.deliveryTime?.split('-')[1] || '99');
        return aTime - bTime;
      });
    }

    return filtered;
  }, [query, searchResults, foods, restaurants, selectedCategory, minPrice, maxPrice, minRating, quickDelivery, selectedDeliveryTime, selectedDistance, onlyOpen, sortBy]);

  return (
    <div className="h-full flex flex-col bg-primary">
      <div className="p-4 glass-strong">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="search-input-wrapper">
            <Search size={18} className="icon" />
            <input
              autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search mini bites..."
              className="search-input"
            />
            {query && <button onClick={() => setQuery('')} className="clear-btn"><X size={16} /></button>}
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`relative p-3 rounded-xl transition-all ${showFilters ? 'bg-primary text-white' : 'bg-card text-secondary'}`}>
            <SlidersHorizontal size={18} />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-danger" />
            )}
          </button>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex gap-2 mt-3 max-w-lg mx-auto overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setQuickDelivery(!quickDelivery)}
            className={`filter-chip ${quickDelivery ? 'active' : ''}`}
          >
            <Zap size={12} /> Quick Delivery
          </button>
          <button
            onClick={() => setOnlyOpen(!onlyOpen)}
            className={`filter-chip ${onlyOpen ? 'success' : ''}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-success" /> Open Now
          </button>
          {hasActiveFilters && (
            <button onClick={clearAllFilters} className="filter-chip danger">
              <RotateCcw size={10} /> Clear
            </button>
          )}
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="max-w-lg mx-auto filter-panel">
            {/* Categories */}
            <div className="filter-section">
              <h4 className="filter-section-title">Category</h4>
              <div className="filter-grid">
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                    className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}>
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Time */}
            <div className="filter-section">
              <h4 className="filter-section-title">Delivery Time</h4>
              <div className="filter-grid">
                {deliveryTimeFilters.map(f => (
                  <button key={f.id} onClick={() => setSelectedDeliveryTime(selectedDeliveryTime === f.id ? null : f.id)}
                    className={`filter-btn ${selectedDeliveryTime === f.id ? 'active' : ''}`}>
                    <span className="emoji">{f.icon}</span>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div className="filter-section">
              <h4 className="filter-section-title">Distance</h4>
              <div className="filter-grid">
                {distanceFilters.map(f => (
                  <button key={f.id} onClick={() => setSelectedDistance(selectedDistance === f.id ? null : f.id)}
                    className={`filter-btn ${selectedDistance === f.id ? 'active' : ''}`}>
                    <span className="emoji">{f.icon}</span>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="filter-section">
              <h4 className="filter-section-title">Price Range</h4>
              <div className="flex gap-2 items-center">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="input flex-1" />
                <span className="text-muted text-xs">—</span>
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="input flex-1" />
              </div>
            </div>

            {/* Rating */}
            <div className="filter-section">
              <h4 className="filter-section-title">Minimum Rating</h4>
              <div className="flex gap-1.5">
                {[1,2,3,4,5].map(r => (
                  <button key={r} onClick={() => setMinRating(minRating === r ? 0 : r)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${minRating >= r ? 'bg-warning-alpha text-warning border border-warning' : 'bg-primary text-muted border'}`}>
                    {r}★
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="filter-section">
              <h4 className="filter-section-title">Sort By</h4>
              <div className="filter-grid">
                {[
                  { id: 'relevance', label: 'Relevance' },
                  { id: 'price-low', label: 'Price: Low' },
                  { id: 'price-high', label: 'Price: High' },
                  { id: 'rating', label: 'Top Rated' },
                  { id: 'delivery', label: 'Fastest' },
                ].map(s => (
                  <button key={s.id} onClick={() => setSortBy(s.id)}
                    className={`filter-btn ${sortBy === s.id ? 'active' : ''}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 max-w-lg mx-auto w-full">
        {!query && !hasActiveFilters && searchResults.length === 0 && (
          <div className="space-y-6">
            {recentSearches.length > 0 && (
              <div>
                <h3 className="text-sm font-bold mb-3">Recent Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s, i) => (
                    <button key={i} onClick={() => setQuery(s)} className="px-3 py-2 bg-card rounded-xl text-xs text-secondary border active:scale-95 transition-transform">{s}</button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold mb-3">Quick Bites</h3>
              <div className="flex flex-wrap gap-2">
                {['Mini Burger', 'Pizza Slice', 'Chicken Bites', 'Hot Dog', 'Wrap', 'Fries'].map((s, i) => (
                  <button key={i} onClick={() => setQuery(s)} className="px-3 py-2 bg-card rounded-xl text-xs text-secondary border active:scale-95 transition-transform">{s}</button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-3">Open Now</h3>
              <div className="vertical-list">
                {restaurants.filter(r => r.isOpen).map(r => <RestaurantCard key={r.id} restaurant={r} />)}
              </div>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="vertical-list animate-fade-in">
            <p className="text-secondary text-xs">{results.length} results found</p>
            {results.map(item => (
              item.type === 'restaurant' ? <RestaurantCard key={item.id} restaurant={item} /> : <FoodCard key={item.id} food={item} />
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="empty-state">
            <div className="icon-circle" style={{ width: 64, height: 64 }}>
              <Search size={24} className="text-secondary" />
            </div>
            <h3>No results</h3>
            <p>Try a different search term</p>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="text-primary text-xs font-semibold active:scale-95 transition-transform">
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
