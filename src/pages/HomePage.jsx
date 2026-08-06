import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bell, ChevronDown, Search, X, TrendingUp, Star } from 'lucide-react';
import useStore from '../store/useStore';
import FoodCard from '../components/FoodCard';
import RestaurantCard from '../components/RestaurantCard';
import PromoBanner from '../components/PromoBanner';
import { SkeletonCard, SkeletonCategory, SkeletonBanner } from '../components/Skeleton';

export default function HomePage() {
  const navigate = useNavigate();
  const { banners, foods, categories, restaurants } = useStore();
  const user = useStore((s) => s.user);
  const notifications = useStore((s) => s.notifications);
  const addresses = useStore((s) => s.addresses);
  const search = useStore((s) => s.search);
  const searchResults = useStore((s) => s.searchResults);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locOpen, setLocOpen] = useState(false);
  const [addressId, setAddressId] = useState(addresses.find((a) => a.isDefault)?.id || addresses[0]?.id);
  const [query, setQuery] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const searchRef = useRef(null);

  const branch = restaurants[0];
  const currentAddress = addresses.find((a) => a.id === addressId) || addresses[0];
  const unread = notifications.filter((n) => !n.isRead).length;
  const firstName = user?.name?.split(' ')[0] || 'Bekzod';

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocus(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => { if (query) search(query); }, [query]);

  const deals = foods.filter((f) => f.discountPrice);
  const popular = foods.filter((f) => f.isPopular);
  const filtered = selectedCategory ? foods.filter((f) => f.categoryId === selectedCategory) : null;
  const showSearch = query.trim().length > 0;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-36 home-page-shell">
      <div className="px-4">
        {/* ===== Header: salomlashish + joylashuv + qidiruv ===== */}
        <div className="animate-fade-in" style={{ paddingTop: 20 }}>
          {/* Top row: logo + bell + profile */}
          <div className="home-top-row flex items-center justify-between">
            <div className="home-brand flex items-center" style={{ gap: 10 }}>
              <img src="/logo.png" alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,.1)' }} />
              <div className="home-title" style={{ fontWeight: 700, color: 'var(--text)', fontSize: 22, letterSpacing: '-.03em', lineHeight: 1.2 }}>Bek Food</div>
            </div>
            <div className="flex items-center" style={{ gap: 10 }}>
              <button onClick={() => navigate('/notifications')} className="home-icon-btn card card-interactive" style={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Bell size={18} color="var(--text-muted)" />
                {unread > 0 && (
                  <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 'var(--radius-full)', background: 'var(--danger)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', boxShadow: '0 2px 6px rgba(239,68,68,.4)' }}>
                    {unread}
                  </span>
                )}
              </button>
              <button onClick={() => navigate('/profile')} className="home-profile-pill card card-interactive" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <span style={{ width: 42, height: 42, borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
                  {firstName[0]?.toUpperCase()}
                </span>
              </button>
            </div>
          </div>

          {/* Greeting */}
          <div style={{ marginTop: 18 }}>
            <div className="home-greeting-title" style={{ color: 'var(--text)', fontSize: 24, fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.25 }}>
              Salom, {firstName}! 👋
            </div>
            <div className="home-greeting-subtitle" style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>Bugun nimadan tozalab buyurtma beramiz?</div>
          </div>

          {/* Location dropdown */}
          <div style={{ position: 'relative', marginTop: 14 }}>
            <button
              onClick={() => setLocOpen(!locOpen)}
              className="home-location-btn card card-interactive"
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', width: '100%', cursor: 'pointer', borderRadius: 'var(--radius)' }}
            >
              <span style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={14} />
              </span>
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <div className="home-location-label" style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentAddress ? currentAddress.label : "Manzil tanlang"}
                </div>
                <div className="home-location-sub" style={{ color: 'var(--text-muted)', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>
                  {currentAddress ? currentAddress.fullAddress : "Chinobod, O'zbekiston"}
                </div>
              </div>
              <ChevronDown size={16} style={{ transform: locOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s var(--ease)', color: 'var(--text-muted)', flexShrink: 0 }} />
            </button>

            {locOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 19 }} onClick={() => setLocOpen(false)} />
                <div className="card animate-slide-up" style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 20, padding: 8, boxShadow: 'var(--shadow-lg)', border: 'none' }}>
                  {addresses.length === 0 && (
                    <button onClick={() => navigate('/addresses')} style={{ width: '100%', padding: '12px 14px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
                      <span style={{ color: 'var(--primary)', fontSize: 13, fontWeight: 600 }}>+ Yangi manzil qo'shish</span>
                    </button>
                  )}
                  {addresses.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => { setAddressId(a.id); setLocOpen(false); }}
                      className="card-interactive"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', cursor: 'pointer',
                        background: a.id === addressId ? 'var(--primary-light)' : 'none', border: 'none', borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      <MapPin size={15} color={a.id === addressId ? 'var(--primary)' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
                      <div style={{ minWidth: 0, textAlign: 'left' }}>
                        <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600 }}>{a.label}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.fullAddress}</div>
                      </div>
                    </button>
                  ))}
                  <button onClick={() => { setLocOpen(false); navigate('/addresses'); }} style={{ width: '100%', padding: '10px 14px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ color: 'var(--primary)', fontSize: 13, fontWeight: 600 }}>+ Barcha manzillar</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Search integrated in header */}
          <div ref={searchRef} className="home-search-wrap" style={{ position: 'relative', marginTop: 12 }}>
            <div className="input-group">
              <Search size={16} style={{ color: 'var(--text-dim)' }} className="input-group-icon" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocus(true)}
                placeholder="Taom yoki restoran qidirish..."
                className="input"
                style={{ background: 'var(--surface)' }}
              />
              {query && (
                <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              )}
            </div>

            {(showSearch && searchFocus) && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 25 }}>
                <div className="card animate-slide-up" style={{ padding: 8, boxShadow: 'var(--shadow-lg)', border: 'none' }}>
                  {searchResults.length > 0 && (
                    <>
                      <p className="caption" style={{ padding: '6px 10px 2px' }}>{searchResults.length} ta natija</p>
                      {searchResults.slice(0, 6).map((item) =>
                        item.type === 'restaurant' ? (
                          <RestaurantCard key={item.id} restaurant={item} />
                        ) : (
                          <FoodCard key={item.id} food={item} />
                        )
                      )}
                    </>
                  )}
                  {searchResults.length === 0 && (
                    <div style={{ padding: '14px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>Natija topilmadi</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Promo Banner */}
        {loading ? (
          <div style={{ margin: '20px 0' }}><SkeletonBanner /></div>
        ) : (
          <div className="animate-fade-in-up" style={{ marginTop: 22 }}>
            <PromoBanner banners={banners} />
          </div>
        )}

        {/* Categories */}
        {loading ? (
          <div style={{ marginBottom: 16, marginTop: 16 }}><SkeletonCategory /></div>
        ) : (
          <div className="animate-fade-in-up" style={{ marginTop: 18 }}>
            <div className="home-category-row flex overflow-x-auto scrollbar-hide relative" style={{ gap: 8, paddingBottom: 4 }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className="home-category-chip whitespace-nowrap"
                  style={{
                    fontSize: 13, padding: '8px 18px', borderRadius: 'var(--radius-full)', fontWeight: 500,
                    background: selectedCategory === cat.id ? 'var(--primary)' : 'var(--surface)',
                    border: `1.5px solid ${selectedCategory === cat.id ? 'var(--primary)' : 'var(--border)'}`,
                    color: selectedCategory === cat.id ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer', transition: 'all .3s var(--ease-spring)',
                    boxShadow: selectedCategory === cat.id ? 'var(--shadow-primary)' : 'none',
                    flexShrink: 0,
                  }}
                >
                  {cat.name}
                </button>
              ))}
              <div
                className="pointer-events-none"
                style={{
                  position: 'absolute', right: 0, top: 0, bottom: 0, width: 40,
                  background: 'linear-gradient(90deg, transparent, var(--bg))',
                }}
              />
            </div>
          </div>
        )}

        {/* Filtered category items */}
        {filtered && (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
              <h2 className="heading">{categories.find((c) => c.id === selectedCategory)?.name}</h2>
              <button onClick={() => setSelectedCategory(null)} style={{ color: 'var(--primary)', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Barchasi</button>
            </div>
            <div className="grid food-grid stagger" style={{ gap: 12 }}>
              {filtered.map((food) => <FoodCard key={food.id} food={food} />)}
            </div>
            {filtered.length === 0 && (
              <div className="empty-state">
                <p className="text-muted">Bu kategoriyada mahsulot yo'q</p>
              </div>
            )}
          </div>
        )}

        {!filtered && (
          <>
            {/* Deals */}
            {deals.length > 0 && !loading && (
              <div className="animate-fade-in-up" style={{ marginTop: 26 }}>
                <div className="flex items-center" style={{ gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--danger-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={16} color="var(--danger)" />
                  </div>
                  <h2 className="heading">Chegirmalar</h2>
                </div>
                <div className="grid food-grid stagger" style={{ gap: 12 }}>
                  {deals.map((food) => <FoodCard key={food.id} food={food} />)}
                </div>
              </div>
            )}

            {/* Popular */}
            {!loading && (
              <div className="animate-fade-in-up" style={{ marginTop: 26 }}>
                <div className="flex items-center" style={{ gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Star size={16} color="var(--warning)" />
                  </div>
                  <h2 className="heading">Mashhur taomlar</h2>
                </div>
                <div className="grid food-grid stagger" style={{ gap: 12 }}>
                  {popular.map((food) => <FoodCard key={food.id} food={food} />)}
                </div>
              </div>
            )}

            {/* All menu */}
            {!loading && (
              <div className="animate-fade-in-up" style={{ marginTop: 26 }}>
                <h2 className="heading" style={{ marginBottom: 14 }}>To'liq menyu</h2>
                <div className="grid food-grid stagger" style={{ gap: 12 }}>
                  {foods.map((food) => <FoodCard key={food.id} food={food} />)}
                </div>
              </div>
            )}

            {loading && (
              <div className="grid food-grid" style={{ gap: 12 }}>
                {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}