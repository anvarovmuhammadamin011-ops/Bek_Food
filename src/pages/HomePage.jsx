import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Flame, Star, TrendingUp } from 'lucide-react';
import useStore from '../store/useStore';
import FoodCard from '../components/FoodCard';
import PromoBanner from '../components/PromoBanner';
import { SkeletonCard, SkeletonCategory, SkeletonBanner } from '../components/Skeleton';

export default function HomePage() {
  const navigate = useNavigate();
  const { banners, foods, categories, cart, restaurants } = useStore();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const branch = restaurants[0];

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const deals = foods.filter((f) => f.discountPrice);
  const popular = foods.filter((f) => f.isPopular);
  const filtered = selectedCategory ? foods.filter((f) => f.categoryId === selectedCategory) : null;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="px-4">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in" style={{ padding: '16px 0' }}>
          <div className="flex items-center" style={{ gap: 10 }}>
            <img src="/logo.png" alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 24, letterSpacing: '-.03em', lineHeight: 1.2 }}>Bek Food</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>Chinobod, O'zbekiston</div>
            </div>
          </div>
          <div className="flex items-center" style={{ gap: 8 }}>
            <button onClick={() => navigate('/profile')} className="card card-interactive" style={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} color="var(--text-muted)" />
            </button>
            <button onClick={() => navigate('/cart')} className="card card-interactive" style={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <ShoppingCart size={18} color="var(--text)" />
              {cart.length > 0 && (
                <div className="animate-pop-in" style={{ position: 'absolute', top: -5, right: -5, minWidth: 20, height: 20, background: 'var(--primary)', borderRadius: 'var(--radius-full)', fontSize: 11, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, padding: '0 5px', boxShadow: '0 2px 8px rgba(249,115,22,.3)' }}>
                  {cart.length}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Promo Banner */}
        {loading ? (
          <div style={{ marginBottom: 20 }}><SkeletonBanner /></div>
        ) : (
          <div className="animate-fade-in-up" style={{ marginBottom: 24 }}>
            <PromoBanner banners={banners} />
          </div>
        )}

        {/* Categories */}
        {loading ? (
          <div style={{ marginBottom: 16 }}><SkeletonCategory /></div>
        ) : (
          <div className="animate-fade-in-up" style={{ marginBottom: 24 }}>
            <div className="flex overflow-x-auto scrollbar-hide" style={{ gap: 8, paddingBottom: 4 }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className="whitespace-nowrap"
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
            <div className="grid grid-cols-2 stagger" style={{ gap: 12 }}>
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
              <div className="animate-fade-in-up" style={{ marginBottom: 28 }}>
                <div className="flex items-center" style={{ gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--danger-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={16} color="var(--danger)" />
                  </div>
                  <h2 className="heading">Chegirmalar</h2>
                </div>
                <div className="grid grid-cols-2 stagger" style={{ gap: 12 }}>
                  {deals.map((food) => <FoodCard key={food.id} food={food} />)}
                </div>
              </div>
            )}

            {/* Popular */}
            {!loading && (
              <div className="animate-fade-in-up" style={{ marginBottom: 28 }}>
                <div className="flex items-center" style={{ gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--warning-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Star size={16} color="var(--warning)" />
                  </div>
                  <h2 className="heading">Mashhur taomlar</h2>
                </div>
                <div className="grid grid-cols-2 stagger" style={{ gap: 12 }}>
                  {popular.map((food) => <FoodCard key={food.id} food={food} />)}
                </div>
              </div>
            )}

            {/* All menu */}
            {!loading && (
              <div className="animate-fade-in-up">
                <h2 className="heading" style={{ marginBottom: 14 }}>To'liq menyu</h2>
                <div className="grid grid-cols-2 stagger" style={{ gap: 12 }}>
                  {foods.map((food) => <FoodCard key={food.id} food={food} />)}
                </div>
              </div>
            )}

            {loading && (
              <div className="grid grid-cols-2" style={{ gap: 12 }}>
                {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
