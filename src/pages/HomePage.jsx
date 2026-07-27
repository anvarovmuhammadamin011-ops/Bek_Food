import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Flame, Star, TrendingUp } from 'lucide-react';
import useStore from '../store/useStore';
import FoodCard from '../components/FoodCard';
import { SkeletonCard, SkeletonCategory, SkeletonBanner } from '../components/Skeleton';

function HeroParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 3,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 4,
      opacity: 0.2 + Math.random() * 0.3,
    })), []);

  return (
    <div className="hero-particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="hero-particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

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
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#fff', fontSize: 22, letterSpacing: '-.02em', lineHeight: 1.2 }}>Bek Food</div>
            <div style={{ color: '#6b6b6b', fontSize: 11, marginTop: 2 }}>Chinobod, O'zbekiston</div>
          </div>
          <div className="flex items-center" style={{ gap: 10 }}>
            <button onClick={() => navigate('/profile')} className="card-interactive" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <User size={18} color="#b8b8b8" />
            </button>
            <button onClick={() => navigate('/cart')} className="card-interactive" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <ShoppingCart size={18} color="#fff" />
              {cart.length > 0 && (
                <div className="animate-pop-in" style={{ position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, background: 'var(--red)', borderRadius: 9, fontSize: 10, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, padding: '0 4px', boxShadow: '0 2px 8px rgba(229,30,30,.4)' }}>
                  {cart.length}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Premium Hero */}
        {loading ? (
          <div style={{ marginBottom: 20 }}><div className="skeleton skeleton-hero" /></div>
        ) : (
          <div className="hero animate-fade-in-up" style={{ height: 'min(45vw, 200px)', marginBottom: 20 }}>
            <img
              src={branch?.coverImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop'}
              alt="Bek Food"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <HeroParticles />
            <div className="hero-content">
              <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                <Flame size={14} color="#e51e1e" />
                <span style={{ color: '#e51e1e', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em' }}>Yangi</span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: '#fff', lineHeight: 1.15, marginBottom: 6, letterSpacing: '-.02em' }}>
                {banners[0]?.title || "Yangi menyu qo'shildi"}
              </h1>
              <p style={{ color: '#b8b8b8', fontSize: 13, marginBottom: 12, lineHeight: 1.5 }}>
                {banners[0]?.subtitle || 'Lyulya kabob endi menyuda'}
              </p>
              <button onClick={() => navigate('/search')} className="btn btn-primary btn-sm btn-glow" style={{ alignSelf: 'flex-start', borderRadius: 'var(--radius)' }}>
                Ko'rish
              </button>
            </div>
          </div>
        )}

        {/* Categories */}
        {loading ? (
          <div style={{ marginBottom: 16 }}><SkeletonCategory /></div>
        ) : (
          <div className="animate-fade-in-up" style={{ marginBottom: 20, animationDelay: '.1s' }}>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide" style={{ paddingBottom: 4 }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                  className="whitespace-nowrap"
                  style={{
                    fontSize: 12, padding: '8px 16px', borderRadius: 20, fontWeight: 500,
                    background: selectedCategory === cat.id ? 'var(--red)' : 'var(--surface)',
                    border: `1.5px solid ${selectedCategory === cat.id ? 'var(--red)' : 'var(--border)'}`,
                    color: selectedCategory === cat.id ? '#fff' : '#b8b8b8',
                    cursor: 'pointer', transition: 'all .3s var(--ease-spring)',
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
