import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Bell, ChevronRight } from 'lucide-react';
import useStore from '../store/useStore';
import Logo from '../components/Logo';
import FoodCard from '../components/FoodCard';

/* ═══════════════════════════════════════════
   CATEGORY FILTER BAR — Sticky, horizontal, premium
   ═══════════════════════════════════════════ */
function CategoryFilter({ categories, selected, onSelect }) {
  const scrollRef = useRef(null);

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 30,
      background: 'rgba(255, 248, 241, 0.92)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border)',
      padding: '10px 0',
    }}>
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingBottom: '2px',
        }}
      >
        {/* "All" pill */}
        <button
          onClick={() => onSelect(null)}
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            border: selected === null ? '1.5px solid var(--color-primary)' : '1.5px solid var(--border)',
            background: selected === null ? 'var(--color-primary)' : 'var(--bg-card)',
            color: selected === null ? 'white' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: selected === null ? 'var(--shadow-primary)' : 'var(--shadow-sm)',
            transform: selected === null ? 'translateY(-1px)' : 'none',
            fontSize: '12px',
            fontWeight: 600,
            fontFamily: 'var(--font-family)',
          }}
        >
          <span style={{ fontSize: '14px' }}>✨</span>
          All
        </button>

        {categories.map(cat => {
          const active = selected === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(active ? null : cat.id)}
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                border: active ? '1.5px solid var(--color-primary)' : '1.5px solid var(--border)',
                background: active ? 'var(--color-primary)' : 'var(--bg-card)',
                color: active ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: active ? 'var(--shadow-primary)' : 'var(--shadow-sm)',
                transform: active ? 'translateY(-1px)' : 'none',
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: 'var(--font-family)',
              }}
            >
              <span style={{ fontSize: '14px' }}>{cat.icon}</span>
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MENU HEADER — Compact, branded
   ═══════════════════════════════════════════ */
function MenuHeader() {
  const navigate = useNavigate();
  const notifications = useStore((s) => s.notifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      padding: '12px 16px',
      paddingTop: 'env(safe-area-inset-top, 12px)',
      background: 'rgba(255, 248, 241, 0.88)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Logo size="sm" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--text-secondary)',
              fontSize: '10px',
            }}>
              <MapPin size={10} color="var(--color-primary)" />
              <span>Tashkent, Uzbekistan</span>
            </div>
            <span style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}>
              Menu
            </span>
          </div>
        </div>
        <button
          onClick={() => navigate('/notifications')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: 'var(--text-secondary)',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
          }}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              background: 'var(--color-danger)',
              color: 'white',
              fontSize: '9px',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              minWidth: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(224, 49, 49, 0.3)',
              padding: '0 4px',
            }}>
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN MENU PAGE
   ═══════════════════════════════════════════ */
export default function HomePage() {
  const navigate = useNavigate();
  const { foods, categories, cart } = useStore();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredFoods = useMemo(() => {
    if (!selectedCategory) return foods;
    return foods.filter(f => f.categoryId === selectedCategory);
  }, [selectedCategory, foods]);

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)',
    }}>
      {/* Header */}
      <MenuHeader />

      {/* Category Filter Bar */}
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Food Grid */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingBottom: '100px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        <div style={{ padding: '12px 12px 0' }}>
          {/* Section title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            padding: '0 4px',
          }}>
            <div>
              <h2 style={{
                fontSize: '17px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}>
                {selectedCategory
                  ? categories.find(c => c.id === selectedCategory)?.name || 'Items'
                  : 'All Items'}
              </h2>
              <p style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                marginTop: '2px',
              }}>
                {filteredFoods.length} item{filteredFoods.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
          }}>
            {filteredFoods.map((food, i) => (
              <div
                key={food.id}
                style={{
                  animation: 'slideUp 0.35s ease-out',
                  animationDelay: `${Math.min(i * 0.04, 0.4)}s`,
                  animationFillMode: 'both',
                }}
              >
                <FoodCard food={food} grid />
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredFoods.length === 0 && (
            <div style={{
              padding: '64px 32px',
              textAlign: 'center',
              animation: 'fadeIn 0.3s ease-out',
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'var(--color-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <span style={{ fontSize: '36px' }}>🍽</span>
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '8px',
              }}>
                No items found
              </h3>
              <p style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                maxWidth: '240px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}>
                No items in this category yet. Try selecting a different category.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Cart FAB */}
      {totalItems > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 45,
          animation: 'slideUp 0.3s ease-out',
        }}>
          <button
            onClick={() => navigate('/cart')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 20px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(232, 89, 12, 0.35)',
              transition: 'all 0.25s ease',
              fontFamily: 'var(--font-family)',
              animation: 'pulseGlow 2s ease-in-out infinite',
            }}
          >
            <span style={{ fontSize: '18px' }}>🛒</span>
            <span style={{ fontSize: '13px', fontWeight: 700 }}>
              View Cart ({totalItems})
            </span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
