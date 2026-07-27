import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, MapPin, Clock } from 'lucide-react';
import useStore from '../store/useStore';
import FoodCard from '../components/FoodCard';

export default function HomePage() {
  const navigate = useNavigate();
  const { banners, foods, categories, cart, restaurants } = useStore();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const branch = restaurants[0];

  const deals = foods.filter((f) => f.discountPrice);
  const popular = foods.filter((f) => f.isPopular);
  const filtered = selectedCategory ? foods.filter((f) => f.categoryId === selectedCategory) : null;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="px-4">
        {/* Header */}
        <div className="flex items-center justify-between" style={{ padding: '16px 0' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#fff', fontSize: 18 }}>Bek Food</div>
          <div className="flex items-center" style={{ gap: 12 }}>
            <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <User size={20} color="#b8b8b8" />
            </button>
            <div className="relative">
              <button onClick={() => navigate('/cart')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <ShoppingCart size={20} color="#fff" />
              </button>
              {cart.length > 0 && (
                <div style={{ position: 'absolute', top: -4, right: -6, width: 14, height: 14, background: '#e51e1e', borderRadius: '50%', fontSize: 9, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                  {cart.length}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Banner */}
        {banners.length > 0 && (
          <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
            <div style={{ color: '#fff', fontSize: 12, fontWeight: 500, marginBottom: 2 }}>
              🔥 {banners[0].title}
            </div>
            <div style={{ color: '#b8b8b8', fontSize: 10 }}>{banners[0].subtitle}</div>
          </div>
        )}

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide" style={{ marginBottom: 16, paddingBottom: 2 }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className="whitespace-nowrap"
              style={{
                fontSize: 11, padding: '6px 12px', borderRadius: 16,
                background: selectedCategory === cat.id ? '#e51e1e' : '#141414',
                border: `1px solid ${selectedCategory === cat.id ? '#e51e1e' : 'rgba(255,255,255,0.08)'}`,
                color: selectedCategory === cat.id ? '#fff' : '#b8b8b8',
                cursor: 'pointer', transition: 'all .15s', fontWeight: 500
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filtered category items */}
        {filtered && (
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
              <h2 className="heading">{categories.find((c) => c.id === selectedCategory)?.name}</h2>
              <button onClick={() => setSelectedCategory(null)} style={{ color: '#e51e1e', fontSize: 12, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>Barchasi</button>
            </div>
            <div className="grid grid-cols-2" style={{ gap: 10 }}>
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
            {deals.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
                  <h2 className="heading">Chegirmalar</h2>
                </div>
                <div className="grid grid-cols-2" style={{ gap: 10 }}>
                  {deals.map((food) => <FoodCard key={food.id} food={food} />)}
                </div>
              </div>
            )}

            {/* Popular */}
            <div style={{ marginBottom: 20 }}>
              <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
                <h2 className="heading">Mashhur taomlar</h2>
              </div>
              <div className="grid grid-cols-2" style={{ gap: 10 }}>
                {popular.map((food) => <FoodCard key={food.id} food={food} />)}
              </div>
            </div>

            {/* All menu */}
            <div>
              <h2 className="heading" style={{ marginBottom: 12 }}>To'liq menyu</h2>
              <div className="grid grid-cols-2" style={{ gap: 10 }}>
                {foods.map((food) => <FoodCard key={food.id} food={food} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
