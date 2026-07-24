import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, Clock, Star, ShieldCheck, Truck, Phone, MapPin, Clock3, Send, Camera, ChevronRight, Flame, TrendingUp } from 'lucide-react';
import useStore from '../store/useStore';
import Header from '../components/Header';
import BannerCarousel from '../components/BannerCarousel';
import FoodCard from '../components/FoodCard';
import RestaurantCard from '../components/RestaurantCard';

/* ── Section wrapper with staggered animation ── */
function Section({ children, delay = 0, style = {} }) {
  return (
    <div style={{
      marginTop: '18px',
      animation: 'slideUp 0.4s ease-out',
      animationDelay: `${delay}s`,
      animationFillMode: 'both',
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── Section header with icon ── */
function SectionHeader({ icon, iconBg, title, seeAll, onSeeAll }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {icon && (
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '10px',
            background: iconBg || 'var(--color-primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
        <h2 style={{
          fontSize: '17px',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}>
          {title}
        </h2>
      </div>
      {seeAll && (
        <button
          onClick={onSeeAll}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            background: 'none',
            border: 'none',
            color: 'var(--color-primary)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 'var(--radius-full)',
            transition: 'all 0.2s ease',
          }}
        >
          See All
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

/* ── Category pill ── */
function CategoryPill({ cat, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        padding: '12px 16px',
        borderRadius: 'var(--radius-lg)',
        border: active ? '1.5px solid var(--color-primary)' : '1.5px solid var(--border)',
        background: active ? 'var(--color-primary)' : 'var(--bg-card)',
        color: active ? 'white' : 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: active ? 'var(--shadow-primary)' : 'var(--shadow-sm)',
        transform: active ? 'translateY(-2px)' : 'none',
        minWidth: '76px',
      }}
    >
      <span style={{ fontSize: '26px' }}>{cat.icon}</span>
      <span style={{ fontSize: '10px', fontWeight: 600, whiteSpace: 'nowrap' }}>{cat.name}</span>
    </button>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user, banners, foods, restaurants, categories, cart } = useStore();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const popularFoods = useMemo(() => foods.filter(f => f.isPopular), [foods]);
  const recommendedFoods = useMemo(() => foods.filter(f => f.isRecommended), [foods]);
  const dealsFoods = useMemo(() => foods.filter(f => f.discountPrice), [foods]);
  const quickDeliveryFoods = useMemo(() => foods.filter(f => f.prepTime && f.prepTime <= 5), [foods]);
  const nearbyRestaurants = useMemo(() => restaurants.filter(r => r.isOpen), [restaurants]);
  const filteredFoods = useMemo(() => selectedCategory ? foods.filter(f => f.categoryId === selectedCategory) : null, [selectedCategory, foods]);

  const maxDiscount = dealsFoods.length > 0
    ? Math.round((1 - Math.min(...dealsFoods.map(f => f.discountPrice / f.price))) * 100)
    : 0;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide" style={{ paddingBottom: '100px' }}>
      <Header />

      <div style={{ padding: '0 16px', paddingTop: '8px' }}>

        {/* ═══════════════════════════════════════════
            HERO — Warm, Emotional, Food-Forward
            ═══════════════════════════════════════════ */}
        <div style={{
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          position: 'relative',
          background: 'linear-gradient(145deg, #FF6B35 0%, #E8590C 40%, #C75B39 100%)',
          padding: '24px',
          color: 'white',
          animation: 'fadeIn 0.4s ease-out',
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-40px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.07)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-30px',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.04)',
            pointerEvents: 'none',
          }} />

          {/* Tagline */}
          <div style={{
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontWeight: 600,
            opacity: 0.85,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <ShieldCheck size={12} />
            Trusted by 5,000+ food lovers
          </div>

          {/* Title */}
          <h1 style={{
            marginTop: '10px',
            fontSize: '30px',
            fontWeight: 900,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
          }}>
            Mini bites,<br />
            <span style={{ opacity: 0.9 }}>big flavour.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            marginTop: '8px',
            fontSize: '13px',
            opacity: 0.8,
            lineHeight: 1.5,
            maxWidth: '280px',
          }}>
            Fresh mini fast food delivered to your door in under 10 minutes. No minimum order.
          </p>

          {/* Stats bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginTop: '16px',
            padding: '10px 14px',
            background: 'rgba(255, 255, 255, 0.12)',
            borderRadius: 'var(--radius-md)',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700 }}>
              <Clock size={12} />
              <span>10 min</span>
            </div>
            <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.25)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700 }}>
              <Star size={12} fill="currentColor" />
              <span>4.8</span>
            </div>
            <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.25)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700 }}>
              <Truck size={12} />
              <span>Free</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{
            marginTop: '18px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
          }}>
            <button
              onClick={() => navigate('/search')}
              style={{
                padding: '13px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                border: 'none',
                textAlign: 'left',
                background: 'white',
                color: 'var(--color-primary)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              }}
            >
              Order Now
              <span style={{ display: 'block', fontSize: '10px', fontWeight: 400, marginTop: '2px', opacity: 0.7 }}>
                Browse {restaurants.length} spots
              </span>
            </button>
            <button
              onClick={() => navigate('/cart')}
              style={{
                padding: '13px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                border: '1px solid rgba(255,255,255,0.2)',
                textAlign: 'left',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                backdropFilter: 'blur(8px)',
              }}
            >
              View Cart
              <span style={{ display: 'block', fontSize: '10px', fontWeight: 400, marginTop: '2px', opacity: 0.7 }}>
                {cart?.length ?? 0} item{(cart?.length ?? 0) !== 1 ? 's' : ''}
              </span>
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            SEARCH BAR — Premium with icon
            ═══════════════════════════════════════════ */}
        <Section delay={0.05}>
          <button
            onClick={() => navigate('/search')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              background: 'var(--bg-card)',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'var(--color-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Search size={17} color="var(--color-primary)" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Search mini bites...
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
                Try "Burger", "Pizza", or "Wrap"
              </div>
            </div>
          </button>
        </Section>

        {/* ═══════════════════════════════════════════
            BANNER CAROUSEL
            ═══════════════════════════════════════════ */}
        <Section delay={0.10}>
          <BannerCarousel banners={banners} />
        </Section>

        {/* ═══════════════════════════════════════════
            CATEGORIES — Warm pills with animation
            ═══════════════════════════════════════════ */}
        <Section delay={0.15}>
          <SectionHeader title="Categories" />
          <div style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '4px',
            margin: '0 -16px',
            paddingLeft: '16px',
            paddingRight: '16px',
            scrollSnapType: 'x mandatory',
          }}>
            {categories.map(cat => (
              <CategoryPill
                key={cat.id}
                cat={cat}
                active={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              />
            ))}
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            FILTERED BY CATEGORY
            ═══════════════════════════════════════════ */}
        {filteredFoods && (
          <Section delay={0.05}>
            <SectionHeader
              title={categories.find(c => c.id === selectedCategory)?.name || 'Items'}
              icon={<span style={{ fontSize: '14px' }}>{categories.find(c => c.id === selectedCategory)?.icon}</span>}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredFoods.map(food => <FoodCard key={food.id} food={food} />)}
              {filteredFoods.length === 0 && (
                <div style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '13px',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border)',
                }}>
                  No items in this category
                </div>
              )}
            </div>
          </Section>
        )}

        {/* ═══════════════════════════════════════════
            MAIN CONTENT (no category filter)
            ═══════════════════════════════════════════ */}
        {!selectedCategory && (
          <>

            {/* ─── TODAY'S DEALS — Premium promo ─── */}
            {dealsFoods.length > 0 && (
              <Section delay={0.05}>
                {/* Promo banner */}
                <div style={{
                  borderRadius: 'var(--radius-xl)',
                  padding: '22px',
                  background: 'linear-gradient(135deg, #FF8A50 0%, #E8590C 100%)',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 6px 24px rgba(232, 89, 12, 0.25)',
                }}>
                  {/* Decorative circle */}
                  <div style={{
                    position: 'absolute',
                    top: '-40px',
                    right: '-20px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    pointerEvents: 'none',
                  }} />

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '6px',
                  }}>
                    <Flame size={14} />
                    <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.85 }}>
                      Hot Deals
                    </span>
                  </div>

                  <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em' }}>
                    Save up to {maxDiscount}% Today
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '3px' }}>
                    On selected items — limited time only
                  </div>

                  <button
                    onClick={() => navigate('/search')}
                    style={{
                      marginTop: '14px',
                      padding: '10px 20px',
                      borderRadius: 'var(--radius-full)',
                      background: 'white',
                      color: 'var(--color-primary)',
                      fontWeight: 700,
                      fontSize: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  >
                    Grab a deal
                  </button>
                </div>

                {/* Deals horizontal scroll */}
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  overflowX: 'auto',
                  marginTop: '14px',
                  paddingBottom: '4px',
                  margin: '14px -16px 0',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  scrollSnapType: 'x mandatory',
                }}>
                  {dealsFoods.map(food => (
                    <div key={food.id} style={{ scrollSnapAlign: 'start' }}>
                      <FoodCard food={food} compact />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ─── QUICK DELIVERY ─── */}
            {quickDeliveryFoods.length > 0 && (
              <Section delay={0.10}>
                <SectionHeader
                  title="Under 5 min"
                  icon={<Zap size={13} color="var(--color-primary)" />}
                  iconBg="var(--color-primary-light)"
                  seeAll
                  onSeeAll={() => navigate('/search')}
                />
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  overflowX: 'auto',
                  paddingBottom: '4px',
                  margin: '0 -16px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  scrollSnapType: 'x mandatory',
                }}>
                  {quickDeliveryFoods.map(food => (
                    <div key={food.id} style={{ scrollSnapAlign: 'start' }}>
                      <FoodCard food={food} compact />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ─── POPULAR BITES ─── */}
            <Section delay={0.15}>
              <SectionHeader
                title="Popular Bites"
                icon={<TrendingUp size={13} color="var(--color-warning)" />}
                iconBg="var(--color-warning-light)"
                seeAll
                onSeeAll={() => navigate('/search')}
              />
              <div style={{
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                paddingBottom: '4px',
                margin: '0 -16px',
                paddingLeft: '16px',
                paddingRight: '16px',
                scrollSnapType: 'x mandatory',
              }}>
                {popularFoods.map(food => (
                  <div key={food.id} style={{ scrollSnapAlign: 'start' }}>
                    <FoodCard food={food} compact />
                  </div>
                ))}
              </div>
            </Section>

            {/* ─── RECOMMENDED ─── */}
            <Section delay={0.20}>
              <SectionHeader
                title="Recommended for You"
                icon={<Star size={13} color="var(--color-success)" />}
                iconBg="var(--color-success-light)"
                seeAll
                onSeeAll={() => navigate('/search')}
              />
              <div style={{
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                paddingBottom: '4px',
                margin: '0 -16px',
                paddingLeft: '16px',
                paddingRight: '16px',
                scrollSnapType: 'x mandatory',
              }}>
                {recommendedFoods.map(food => (
                  <div key={food.id} style={{ scrollSnapAlign: 'start' }}>
                    <FoodCard food={food} compact />
                  </div>
                ))}
              </div>
            </Section>

            {/* ─── NEARBY RESTAURANTS ─── */}
            <Section delay={0.25}>
              <SectionHeader
                title="Nearby Spots"
                icon={<MapPin size={13} color="var(--color-danger)" />}
                iconBg="var(--color-danger-light)"
                seeAll
                onSeeAll={() => navigate('/search')}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {nearbyRestaurants.map(r => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            </Section>

            {/* ═══════════════════════════════════════════
                FOOTER — Premium dark warm footer
                ═══════════════════════════════════════════ */}
            <Section delay={0.30}>
              <footer style={{
                background: 'var(--text-primary)',
                color: 'rgba(255, 255, 255, 0.7)',
                padding: '28px 20px',
                borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
              }}>
                {/* Brand */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '20px',
                }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-terracotta))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 10px rgba(232, 89, 12, 0.3)',
                  }}>
                    <span style={{ fontWeight: 900, color: 'white', fontSize: '11px', letterSpacing: '-0.02em' }}>BF</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
                      BEK FOOD
                    </div>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginTop: '1px' }}>
                      Mini Fast Food
                    </div>
                  </div>
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <div style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: 'white',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '10px',
                    }}>
                      Quick Links
                    </div>
                    {[
                      { label: 'Home', path: '/' },
                      { label: 'Menu', path: '/search' },
                      { label: 'My Orders', path: '/orders' },
                      { label: 'Favorites', path: '/favorites' },
                    ].map(link => (
                      <button
                        key={link.path}
                        onClick={() => navigate(link.path)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '11px',
                          color: 'rgba(255,255,255,0.5)',
                          textDecoration: 'none',
                          padding: '4px 0',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'color 0.2s ease',
                          fontFamily: 'var(--font-family)',
                        }}
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: 'white',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '10px',
                    }}>
                      Contact
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                        <Phone size={11} /> +998 90 123 45 67
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                        <MapPin size={11} /> Tashkent, Uzbekistan
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                        <Clock3 size={11} /> 09:00 — 23:00
                      </span>
                    </div>
                  </div>
                </div>

                {/* Social */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <a
                    href="https://t.me/bekfood"
                    target="_blank"
                    rel="noopener"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255,255,255,0.6)',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      textDecoration: 'none',
                    }}
                  >
                    <Send size={14} />
                  </a>
                  <a
                    href="https://instagram.com/bekfood"
                    target="_blank"
                    rel="noopener"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(255,255,255,0.6)',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      textDecoration: 'none',
                    }}
                  >
                    <Camera size={14} />
                  </a>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '18px 0' }} />

                {/* Copyright */}
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                  &copy; 2026 BEK FOOD. All rights reserved.
                </div>
              </footer>
            </Section>
          </>
        )}
      </div>
    </div>
  );
}
