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
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#fff', fontSize: 20, letterSpacing: '-.02em' }}>Bek Food</div>
            <div style={{ color: '#6b6b6b', fontSize: 11, marginTop: 1 }}>Chinobod, O'zbekiston</div>
          </div>
          <div className="flex items-center" style={{ gap: 12 }}>
            <button onClick={() => navigate('/profile')} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s' }}>
              <User size={18} color="#b8b8b8" />
            </button>
            <button onClick={() => navigate('/cart')} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', transition: 'all .2s' }}>
              <ShoppingCart size={18} color="#fff" />
              {cart.length > 0 && (
                <div className="animate-cart-bounce" style={{ position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, background: 'var(--red)', borderRadius: 9, fontSize: 10, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, padding: '0 4px', boxShadow: '0 2px 8px rgba(229,30,30,.4)' }}>
                  {cart.length}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Hero Banner */}
        {loading ? (
          <div style={{ marginBottom: 16 }}><SkeletonBanner /></div>
        ) : (
          <div className="animate-fade-in-up" style={{ marginBottom: 16 }}>
            <div className="promo-banner" style={{ height: 'min(38vw, 160px)' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(229,30,30,.15) 0%, rgba(10,10,10,.9) 50%, rgba(10,10,10,.7) 100%)', borderRadius: 'inherit' }} />
              <div style={{ position: 'absolute', inset: 0, padding: '20px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                    <Flame size={14} color="#e51e1e" />
                    <span style={{ color: '#e51e1e', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>Yangi</span>
                  </div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: '#fff', lineHeight: 1.2, marginBottom: 4 }}>
                    {banners[0]?.title || "Yangi menyu qo'shildi"}
                  </h2>
                  <p style={{ color: '#b8b8b8', fontSize: 12 }}>
                    {banners[0]?.subtitle || 'Lyulya kabob endi menyuda'}
                  </p>
                </div>
                <button onClick={() => navigate('/search')} className="btn btn-primary" style={{ alignSelf: 'flex-start', borderRadius: 'var(--radius)', padding: '8px 20px', minHeight: 36, fontSize: 13 }}>
                  Ko'rish
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Categories */}
        {loading ? (
          <div style={{ marginBottom: 16 }}><SkeletonCategory /></div>
        ) : (
          <div className="animate-fade-in-up" style={{ marginBottom: 20, animationDelay: '.1s' }}>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide" style={{ paddingBottom: 4 }}>
              {categories.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className="whitespace-nowrap"
                  style={{
                    fontSize: 12, padding: '8px 16px', borderRadius: 20, fontWeight: 500,
                    background: selectedCategory === cat.id ? 'var(--red)' : 'var(--surface)',
                    border: `1.5px solid ${selectedCategory === cat.id ? 'var(--red)' : 'var(--border)'}`,
                    color: selectedCategory === cat.id ? '#fff' : '#b8b8b8',
                    cursor: 'pointer', transition: 'all .25s cubic-bezier(.4,0,.2,1)',
                    boxShadow: selectedCategory === cat.id ? 'var(--shadow-red)' : 'none'
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
            <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
              <h2 className="heading">{categories.find((c) => c.id === selectedCategory)?.name}</h2>
              <button onClick={() => setSelectedCategory(null)} style={{ color: '#e51e1e', fontSize: 13, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>Barchasi</button>
            </div>
            <div className="grid grid-cols-2 stagger" style={{ gap: 10 }}>
              {filtered.map((food) => <FoodCard key={food.id} food={food} />)}
            </div>
            {filtered.length === 0 && (
              <div className="empty-state">
                <p style={{ color: '#6b6b6b' }}>Bu kategoriyada mahsulot yo'q</p>
              </div>
            )}
          </div>
        )}

        {!filtered && (
          <>
            {/* Deals */}
            {deals.length > 0 && !loading && (
              <div className="animate-fade-in-up" style={{ marginBottom: 24, animationDelay: '.15s' }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
                  <TrendingUp size={16} color="#e51e1e" />
                  <h2 className="heading">Chegirmalar</h2>
                </div>
                <div className="grid grid-cols-2 stagger" style={{ gap: 10 }}>
                  {deals.map((food) => <FoodCard key={food.id} food={food} />)}
                </div>
              </div>
            )}

            {/* Popular */}
            {!loading && (
              <div className="animate-fade-in-up" style={{ marginBottom: 24, animationDelay: '.2s' }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
                  <Star size={16} color="#e51e1e" />
                  <h2 className="heading">Mashhur taomlar</h2>
                </div>
                <div className="grid grid-cols-2 stagger" style={{ gap: 10 }}>
                  {popular.map((food) => <FoodCard key={food.id} food={food} />)}
                </div>
              </div>
            )}

            {/* All menu */}
            {!loading && (
              <div className="animate-fade-in-up" style={{ animationDelay: '.25s' }}>
                <h2 className="heading" style={{ marginBottom: 12 }}>To'liq menyu</h2>
                <div className="grid grid-cols-2 stagger" style={{ gap: 10 }}>
                  {foods.map((food) => <FoodCard key={food.id} food={food} />)}
                </div>
              </div>
            )}

            {/* Loading skeletons */}
            {loading && (
              <div className="grid grid-cols-2" style={{ gap: 10 }}>
                {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
