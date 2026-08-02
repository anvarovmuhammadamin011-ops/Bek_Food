import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronLeft, ArrowUpDown, TrendingUp, Plus, Check, Trash2 } from 'lucide-react';
import useStore from '../store/useStore';
import RestaurantCard from '../components/RestaurantCard';

const SORT_OPTIONS = [
  { key: 'recommend', label: 'Tavsiya etilgan' },
  { key: 'price_asc', label: 'Arzonroq' },
  { key: 'price_desc', label: 'Qimmatroq' },
  { key: 'popular', label: 'Ommabop' },
];

const TRENDING = ['Lavash', 'Pitsa Peperoni', 'Cheeseburger', 'Fri', 'Doner', "Hot-dog"];

function matchTag(food, tag) {
  const inc = (food.ingredients || []).map((i) => i.toLowerCase());
  const name = food.name.toLowerCase();
  switch (tag) {
    case 'halol':
      return !inc.includes('chuchvara') && !name.includes("cho'chqa");
    case 'spicy':
      return (food.spiceLevel || 0) >= 1;
    case 'meat':
      return inc.some((i) => i.includes("go'sht") || i.includes('kotlet') || i.includes('qazi') || i.includes('sosiska') || i.includes('doner'));
    case 'cheese':
      return inc.some((i) => i.includes('pishloq') || i.includes('cheese'));
    case 'chicken':
      return inc.some((i) => i.includes("tovuq") || i.includes('file')) || name.includes('tovuq');
    case 'drinks':
      return (food.categoryId || 0) === 7;
    default:
      return true;
  }
}

export default function SearchPage() {
  const navigate = useNavigate();
  const { search, searchResults, recentSearches, clearRecentSearches, removeRecentSearch, foods, restaurants, categories, addToCart } = useStore();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState(null);
  const [tag, setTag] = useState(null);
  const [sort, setSort] = useState('recommend');
  const [addedId, setAddedId] = useState(null);

  useEffect(() => { search(query); }, [query]);

  const results = useMemo(() => {
    if (!query.trim() && !cat && !tag) return [];
    let res = query.trim() ? searchResults : [...foods.map((f) => ({ ...f, type: 'food' }))];
    if (cat) res = res.filter((i) => i.type === 'food' && i.categoryId === cat);
    if (tag) res = res.filter((i) => i.type === 'food' && matchTag(i, tag));
    if (sort === 'price_asc') res = [...res].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sort === 'price_desc') res = [...res].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (sort === 'popular') res = [...res].sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    return res;
  }, [query, searchResults, cat, tag, sort]);

  const quickAdd = (food) => {
    addToCart(food);
    setAddedId(food.id);
    setTimeout(() => setAddedId(null), 600);
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center" style={{ gap: 10 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <ChevronLeft size={18} color="var(--text)" />
          </button>
          <div className="input-group" style={{ flex: 1 }}>
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

        <div className="flex items-center" style={{ gap: 8, marginTop: 12 }}>
          <button onClick={() => setCat(null)} className="whitespace-nowrap" style={{
            fontSize: 12, padding: '7px 14px', borderRadius: 'var(--radius-full)', fontWeight: 500,
            background: cat === null ? 'var(--primary)' : 'var(--surface)',
            border: `1.5px solid ${cat === null ? 'var(--primary)' : 'var(--border)'}`,
            color: cat === null ? '#fff' : 'var(--text-muted)', cursor: 'pointer', flexShrink: 0,
          }}>Barchasi</button>
          <div className="flex overflow-x-auto scrollbar-hide" style={{ gap: 8 }}>
            {categories.map((c) => (
              <button key={c.id} onClick={() => setCat(cat === c.id ? null : c.id)} className="whitespace-nowrap" style={{
                fontSize: 12, padding: '7px 14px', borderRadius: 'var(--radius-full)', fontWeight: 500,
                background: cat === c.id ? 'var(--primary)' : 'var(--surface)',
                border: `1.5px solid ${cat === c.id ? 'var(--primary)' : 'var(--border)'}`,
                color: cat === c.id ? '#fff' : 'var(--text-muted)', cursor: 'pointer', flexShrink: 0,
              }}>{c.icon} {c.name}</button>
            ))}
          </div>
        </div>

        <div className="flex items-center" style={{ gap: 8, marginTop: 8 }}>
          {[
            { key: 'spicy', label: 'Achchiq 🌶️' },
            { key: 'meat', label: "Go'shtli" },
            { key: 'cheese', label: 'Sirli' },
            { key: 'chicken', label: 'Tovuqli' },
            { key: 'drinks', label: 'Ichimlik' },
            { key: 'halol', label: 'Halol' },
          ].map((t) => (
            <button key={t.key} onClick={() => setTag(tag === t.key ? null : t.key)} className="badge" style={{
              cursor: 'pointer', padding: '6px 12px', fontSize: 12,
              background: tag === t.key ? 'var(--primary)' : 'var(--surface-active)',
              color: tag === t.key ? '#fff' : 'var(--text-muted)',
              border: `1px solid ${tag === t.key ? 'var(--primary)' : 'var(--border)'}`,
              transition: 'all .2s',
            }}>{t.label}</button>
          ))}
          <div className="flex-1" />
          <button onClick={() => setSort(sort === 'recommend' ? 'price_asc' : sort === 'price_asc' ? 'price_desc' : sort === 'price_desc' ? 'popular' : 'recommend')} className="flex items-center" style={{ gap: 4, color: 'var(--primary)', fontSize: 12, fontWeight: 600, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '6px 12px', cursor: 'pointer' }}>
            <ArrowUpDown size={13} /> {SORT_OPTIONS.find((s) => s.key === sort)?.label}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
        {!query && !cat && !tag && (
          <div className="space-y-5">
            {recentSearches.length > 0 && (
              <div className="animate-fade-in-up">
                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                  <h3 className="subheading">So'nggi qidiruvlar</h3>
                  <button onClick={clearRecentSearches} className="flex items-center" style={{ color: 'var(--text-muted)', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', gap: 4 }}>
                    <Trash2 size={13} /> Tozalash
                  </button>
                </div>
                <div className="flex flex-wrap" style={{ gap: 8 }}>
                  {recentSearches.map((s, i) => (
                    <button key={i} onClick={() => setQuery(s)} className="badge badge-neutral" style={{ cursor: 'pointer', padding: '6px 14px', fontSize: 12 }}>
                      {s} <span onClick={(e) => { e.stopPropagation(); removeRecentSearch(s); }} style={{ marginLeft: 6, color: 'var(--text-dim)', cursor: 'pointer' }}>×</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="animate-fade-in-up">
              <div className="flex items-center" style={{ gap: 6, marginBottom: 10 }}>
                <TrendingUp size={15} color="var(--primary)" />
                <h3 className="subheading">Kishilar tez-tez qidiradi</h3>
              </div>
              <div className="flex flex-wrap" style={{ gap: 8 }}>
                {TRENDING.map((s, i) => (
                  <button key={i} onClick={() => setQuery(s)} className="badge badge-primary" style={{ cursor: 'pointer', padding: '6px 14px', fontSize: 12 }}>#{s}</button>
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

        {results.length > 0 && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <p className="caption">{results.length} ta natija</p>
              {(cat || tag) && <span className="badge badge-neutral" style={{ fontSize: 11 }}>Filtrlangan</span>}
            </div>
            {results.map((item) =>
              item.type === 'restaurant' ? (
                <RestaurantCard key={item.id} restaurant={item} />
              ) : (
                <div key={item.id} className="card card-hover flex items-center" style={{ padding: 10, gap: 12, cursor: 'pointer' }} onClick={() => navigate(`/food/${item.id}`)}>
                  <img src={item.image} alt="" style={{ width: 64, height: 64, borderRadius: 'var(--radius)', objectFit: 'cover', background: 'var(--surface-active)', flexShrink: 0 }} onError={(e) => { e.currentTarget.src = '/food/placeholder.svg'; }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: 'var(--text)', fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{item.ingredients?.join(', ')}</div>
                    <div className="flex items-center" style={{ gap: 6, marginTop: 4 }}>
                      {(item.discountPrice || item.price) && <span className="price-sm">{(item.discountPrice || item.price).toLocaleString()} so'm</span>}
                      {item.isPopular && <span className="badge badge-danger" style={{ fontSize: 10, padding: '2px 6px' }}>Mashhur</span>}
                    </div>
                  </div>
                  {!query && !cat && !tag ? null : (
                    <button onClick={(e) => { e.stopPropagation(); quickAdd(item); }} className="flex items-center justify-center" style={{
                      width: 38, height: 38, borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', flexShrink: 0, transition: 'all .2s',
                      background: addedId === item.id ? 'var(--success)' : 'var(--primary)', boxShadow: '0 2px 10px rgba(249,115,22,.2)',
                    }}>
                      {addedId === item.id ? <Check size={17} color="#fff" /> : <Plus size={17} color="#fff" strokeWidth={2.5} />}
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="empty-state py-14" style={{ animation: 'fadeInUp .4s var(--ease) both' }}>
            <div style={{ fontSize: 56, marginBottom: 12, filter: 'grayscale(.2)' }}>🔍</div>
            <h3 className="heading" style={{ marginBottom: 4 }}>Natija topilmadi</h3>
            <p className="body" style={{ marginBottom: 16 }}>Boshqa taomlarni sinab ko'rasizmi?</p>
            <div className="flex flex-wrap justify-center" style={{ gap: 8 }}>
              {foods.filter((f) => f.isPopular).slice(0, 4).map((f) => (
                <button key={f.id} onClick={() => navigate(`/food/${f.id}`)} className="badge badge-primary" style={{ cursor: 'pointer', padding: '6px 14px', fontSize: 12 }}>
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}