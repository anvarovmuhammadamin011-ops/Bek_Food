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
      style={{
        height: 'min(42vw, 180px)',
        maxHeight: 200,
        minHeight: 140,
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', transition: 'transform .5s var(--ease)', transform: `translateX(-${current * 100}%)`, height: '100%' }}>
        {banners.map((b, i) => (
          <div key={b.id || i} style={{ minWidth: '100%', height: '100%', position: 'relative' }}>
            <img src={b.image} alt="" onError={(e) => { e.currentTarget.src = '/food/placeholder.svg'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,.7) 0%, rgba(0,0,0,.25) 60%, transparent 100%)' }} />
            <div style={{ position: 'absolute', bottom: 20, left: 20, right: 70 }}>
              <p style={{ color: 'rgba(255,255,255,.8)', fontSize: 'clamp(11px, 2.5vw, 13px)', marginBottom: 4 }}>{b.subtitle}</p>
              <p style={{ color: '#fff', fontSize: 'clamp(16px, 3.5vw, 20px)', fontWeight: 700, lineHeight: 1.2 }}>{b.title}</p>
            </div>
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); prev(); }}
            style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              width: 36, height: 36, borderRadius: 'var(--radius-full)',
              background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(10px)',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all .2s', zIndex: 2,
              boxShadow: '0 2px 12px rgba(0,0,0,.15)',
            }}>
            <ChevronLeft size={18} color="var(--text)" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              width: 36, height: 36, borderRadius: 'var(--radius-full)',
              background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(10px)',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all .2s', zIndex: 2,
              boxShadow: '0 2px 12px rgba(0,0,0,.15)',
            }}>
            <ChevronRight size={18} color="var(--text)" />
          </button>
        </>
      )}

      {banners.length > 1 && (
        <div style={{ position: 'absolute', bottom: 14, right: 18, display: 'flex', gap: 6, zIndex: 2 }}>
          {banners.map((_, i) => (
            <div key={i} style={{
              width: current === i ? 20 : 7, height: 7, borderRadius: 'var(--radius-full)',
              background: current === i ? '#fff' : 'rgba(255,255,255,.5)',
              transition: 'all .3s ease',
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
