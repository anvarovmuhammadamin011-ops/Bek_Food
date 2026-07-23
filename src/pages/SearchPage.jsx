import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import useStore from '../store/useStore';
import FoodCard from '../components/FoodCard';
import RestaurantCard from '../components/RestaurantCard';

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

  useEffect(() => { search(query); }, [query]);

  const applyFilters = () => {
    let results = query ? [...searchResults] : [...foods.map(f => ({...f, type: 'food'})), ...restaurants.map(r => ({...r, type: 'restaurant'}))];
    if (selectedCategory) results = results.filter(r => r.categoryId === selectedCategory);
    if (minPrice) results = results.filter(r => r.price >= Number(minPrice));
    if (maxPrice) results = results.filter(r => r.price <= Number(maxPrice));
    if (minRating > 0) results = results.filter(r => r.rating >= minRating);
    if (sortBy === 'price-low') results.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === 'price-high') results.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortBy === 'rating') results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return results;
  };

  const results = applyFilters();

  return (
    <div className="h-full flex flex-col bg-bg-primary">
      <div className="p-4 glass-strong">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 text-text-muted" style={{ transform: 'translateY(-50%)' }} />
            <input
              autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search food, restaurants..."
              className="w-full bg-bg-card border border-border rounded-2xl py-3 pl-11 pr-10 text-sm focus:border-accent-orange focus:outline-none transition-colors placeholder:text-text-muted"
            />
            {query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 text-text-muted" style={{ transform: 'translateY(-50%)' }}><X size={16} /></button>}
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`p-3 rounded-xl transition-all ${showFilters ? 'bg-accent-orange text-white' : 'bg-bg-card text-text-secondary'}`}>
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {showFilters && (
          <div className="max-w-lg mx-auto mt-3 p-3 bg-bg-card rounded-2xl border border-border animate-slide-down space-y-3">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${selectedCategory === cat.id ? 'bg-accent-orange text-white' : 'bg-bg-primary text-text-secondary border border-border'}`}>
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <input type="number" placeholder="Min price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="flex-1 bg-bg-primary border border-border rounded-xl py-2 px-3 text-xs focus:outline-none" />
              <span className="text-text-muted text-xs">-</span>
              <input type="number" placeholder="Max price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="flex-1 bg-bg-primary border border-border rounded-xl py-2 px-3 text-xs focus:outline-none" />
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-xs text-text-secondary">Min rating:</span>
              {[1,2,3,4,5].map(r => (
                <button key={r} onClick={() => setMinRating(minRating === r ? 0 : r)} className={`text-lg ${minRating >= r ? 'text-warning' : 'text-text-muted'}`}>★</button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="text-text-muted" />
              <span className="text-xs text-text-secondary">Sort:</span>
              {['relevance', 'price-low', 'price-high', 'rating'].map(s => (
                <button key={s} onClick={() => setSortBy(s)} className={`px-2 py-1 rounded-lg text-[10px] font-medium ${sortBy === s ? 'bg-accent-orange text-white' : 'bg-bg-primary text-text-secondary'}`}>
                  {s.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 max-w-lg mx-auto w-full">
        {!query && searchResults.length === 0 && (
          <div className="space-y-6">
            {recentSearches.length > 0 && (
              <div>
                <h3 className="text-sm font-bold mb-3">Recent Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s, i) => (
                    <button key={i} onClick={() => setQuery(s)} className="px-3 py-2 bg-bg-card rounded-xl text-xs text-text-secondary border border-border">{s}</button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold mb-3">Popular</h3>
              <div className="flex flex-wrap gap-2">
                {['Burger', 'Pizza', 'Chicken', 'Lavash', 'Desserts'].map((s, i) => (
                  <button key={i} onClick={() => setQuery(s)} className="px-3 py-2 bg-bg-card rounded-xl text-xs text-text-secondary border border-border">{s}</button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-3">All Restaurants</h3>
              <div className="space-y-3">
                {restaurants.filter(r => r.isOpen).map(r => <RestaurantCard key={r.id} restaurant={r} />)}
              </div>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-text-secondary text-xs">{results.length} results found</p>
            {results.map(item => (
              item.type === 'restaurant' ? <RestaurantCard key={item.id} restaurant={item} /> : <FoodCard key={item.id} food={item} />
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-bg-card border border-border flex items-center justify-center mb-4">
              <Search size={24} className="text-text-secondary" />
            </div>
            <h3 className="font-bold">No results</h3>
            <p className="text-text-secondary text-sm mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
