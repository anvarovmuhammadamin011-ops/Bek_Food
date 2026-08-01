import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PromoBanner({ banners = [] }) {
  const [current, setCurrent] = useState(0);
  const [isAuto, setIsAuto] = useState(true);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (!isAuto || banners.length <= 1) return;
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [isAuto, next, banners.length]);

  if (banners.length === 0) return null;

  return (
    <div
      className="promo-banner"
      onMouseEnter={() => setIsAuto(false)}
      onMouseLeave={() => setIsAuto(true)}
      style={{ height: 'min(35vw, 160px)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}
    >
      <div style={{ display: 'flex', transition: 'transform .5s var(--ease)', transform: `translateX(-${current * 100}%)`, height: '100%' }}>
        {banners.map((b, i) => (
          <div key={b.id || i} style={{ minWidth: '100%', height: '100%', position: 'relative' }}>
            <img src={b.image} alt="" onError={(e) => { e.currentTarget.src = '/food/placeholder.svg'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,.65) 0%, rgba(0,0,0,.2) 60%, transparent 100%)' }} />
            <div style={{ position: 'absolute', bottom: 18, left: 18, right: 60 }}>
              <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 12, marginBottom: 3 }}>{b.subtitle}</p>
              <p style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>{b.title}</p>
            </div>
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); prev(); }}
            style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              width: 30, height: 30, borderRadius: 'var(--radius-full)',
              background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(8px)',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all .2s', zIndex: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,.1)',
            }}>
            <ChevronLeft size={16} color="var(--text)" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              width: 30, height: 30, borderRadius: 'var(--radius-full)',
              background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(8px)',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all .2s', zIndex: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,.1)',
            }}>
            <ChevronRight size={16} color="var(--text)" />
          </button>
        </>
      )}

      {banners.length > 1 && (
        <div style={{ position: 'absolute', bottom: 12, right: 16, display: 'flex', gap: 5, zIndex: 2 }}>
          {banners.map((_, i) => (
            <div key={i} style={{
              width: current === i ? 18 : 6, height: 6, borderRadius: 'var(--radius-full)',
              background: current === i ? '#fff' : 'rgba(255,255,255,.4)',
              transition: 'all .3s ease',
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
