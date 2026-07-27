import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import useStore from '../store/useStore';
import FoodCard from '../components/FoodCard';
import RestaurantCard from '../components/RestaurantCard';

export default function SearchPage() {
  const navigate = useNavigate();
  const { search, searchQuery, searchResults, recentSearches, foods, restaurants } = useStore();
  const [query, setQuery] = useState('');

  useEffect(() => { search(query); }, [query]);

  const results = query ? searchResults : [];

  return (
    <div className="h-full flex flex-col" style={{ background: '#0a0a0a' }}>
      <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="relative">
          <Search size={16} className="absolute" style={{ left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b6b6b' }} />
          <input
            autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Taom yoki restoran..."
            className="input" style={{ paddingLeft: 38 }}
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute" style={{ right: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b6b6b', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 w-full">
        {!query && (
          <div className="space-y-5">
            {recentSearches.length > 0 && (
              <div>
                <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>So'nggi qidiruvlar</h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s, i) => (
                    <button key={i} onClick={() => setQuery(s)} style={{ padding: '6px 12px', background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, fontSize: 11, color: '#b8b8b8', cursor: 'pointer' }}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Mashhur</h3>
              <div className="flex flex-wrap gap-2">
                {['Shashlik', 'Lavash', 'Gamburger', 'Kartoshka Fri'].map((s, i) => (
                  <button key={i} onClick={() => setQuery(s)} style={{ padding: '6px 12px', background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, fontSize: 11, color: '#b8b8b8', cursor: 'pointer' }}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Restoranlar</h3>
              <div className="grid gap-3">
                {restaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
              </div>
            </div>
          </div>
        )}

        {query && results.length > 0 && (
          <div className="grid gap-3 animate-fade-in">
            <p style={{ color: '#6b6b6b', fontSize: 12 }}>{results.length} ta natija</p>
            {results.map((item) =>
              item.type === 'restaurant' ? <RestaurantCard key={item.id} restaurant={item} /> : <FoodCard key={item.id} food={item} />
            )}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="empty-state pt-20">
            <div className="empty-state-icon">
              <Search size={20} />
            </div>
            <h3 style={{ color: '#fff', fontWeight: 500 }}>Natija topilmadi</h3>
            <p className="text-muted text-sm mt-1">Boshqa so'z bilan urinib ko'ring</p>
          </div>
        )}
      </div>
    </div>
  );
}
