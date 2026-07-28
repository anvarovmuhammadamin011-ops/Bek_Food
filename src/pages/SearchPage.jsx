import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import useStore from '../store/useStore';
import FoodCard from '../components/FoodCard';
import RestaurantCard from '../components/RestaurantCard';

export default function SearchPage() {
  const navigate = useNavigate();
  const { search, searchResults, recentSearches, foods, restaurants } = useStore();
  const [query, setQuery] = useState('');

  useEffect(() => { search(query); }, [query]);

  const results = query ? searchResults : [];

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="input-group">
          <Search size={16} style={{ color: 'var(--text-dim)' }} className="input-group-icon" />
          <input
            autoFocus type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Taom yoki restoran..." className="input"
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
        {!query && (
          <div className="space-y-5">
            {recentSearches.length > 0 && (
              <div>
                <h3 className="subheading" style={{ marginBottom: 10 }}>So'nggi qidiruvlar</h3>
                <div className="flex flex-wrap" style={{ gap: 8 }}>
                  {recentSearches.map((s, i) => (
                    <button key={i} onClick={() => setQuery(s)} className="badge badge-neutral" style={{ cursor: 'pointer', padding: '6px 14px', fontSize: 12 }}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="subheading" style={{ marginBottom: 10 }}>Mashhur</h3>
              <div className="flex flex-wrap" style={{ gap: 8 }}>
                {['Shashlik', 'Lavash', 'Gamburger', 'Kartoshka Fri'].map((s, i) => (
                  <button key={i} onClick={() => setQuery(s)} className="badge badge-primary" style={{ cursor: 'pointer', padding: '6px 14px', fontSize: 12 }}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="subheading" style={{ marginBottom: 10 }}>Restoranlar</h3>
              <div className="space-y-3">
                {restaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
              </div>
            </div>
          </div>
        )}

        {query && results.length > 0 && (
          <div className="space-y-3 animate-fade-in">
            <p className="caption">{results.length} ta natija</p>
            {results.map((item) =>
              item.type === 'restaurant' ? <RestaurantCard key={item.id} restaurant={item} /> : <FoodCard key={item.id} food={item} />
            )}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="empty-state pt-20">
            <div className="empty-state-icon"><Search size={24} /></div>
            <h3 className="heading">Natija topilmadi</h3>
            <p className="body mt-1">Boshqa so'z bilan urinib ko'ring</p>
          </div>
        )}
      </div>
    </div>
  );
}
