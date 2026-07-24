import { useState, useEffect } from 'react';

export default function BannerCarousel({ banners }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return null;

  return (
    <div style={{
      position: 'relative',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      height: '164px',
      boxShadow: 'var(--shadow-card)',
    }}>
      <div
        className="flex transition-transform ease-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transitionDuration: '500ms',
          height: '100%',
        }}
      >
        {banners.map((banner) => (
          <div key={banner.id} style={{ flexShrink: 0, width: '100%', height: '100%', position: 'relative' }}>
            <img
              src={banner.image}
              alt={banner.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 6s ease',
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(26, 20, 16, 0.75) 0%, rgba(232, 89, 12, 0.25) 60%, transparent 100%)',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '18px',
              left: '18px',
            }}>
              <div style={{
                color: 'white',
                fontSize: '22px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}>
                {banner.title}
              </div>
              <div style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '12px',
                fontWeight: 500,
                marginTop: '4px',
              }}>
                {banner.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '16px',
        display: 'flex',
        gap: '5px',
      }}>
        {banners.map((_, i) => (
          <div
            key={i}
            style={{
              height: '3px',
              borderRadius: '2px',
              transition: 'all 0.3s ease',
              width: i === current ? '18px' : '6px',
              background: i === current ? 'white' : 'rgba(255, 255, 255, 0.35)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
