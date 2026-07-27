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
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [isAuto, next, banners.length]);

  if (banners.length === 0) return null;

  return (
    <div
      className="promo-banner"
      onMouseEnter={() => setIsAuto(false)}
      onMouseLeave={() => setIsAuto(true)}
      style={{ height: 'min(30vw, 140px)' }}
    >
      {/* Slides */}
      <div style={{ display: 'flex', transition: 'transform .5s cubic-bezier(.4,0,.2,1)', transform: `translateX(-${current * 100}%)`, height: '100%' }}>
        {banners.map((b, i) => (
          <div key={b.id || i} style={{ minWidth: '100%', height: '100%', position: 'relative' }}>
            <img src={b.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,10,.8) 0%, rgba(10,10,10,.3) 50%, transparent 100%)' }} />
            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 60 }}>
              <p style={{ color: '#b8b8b8', fontSize: 11, marginBottom: 2 }}>{b.subtitle}</p>
              <p style={{ color: '#fff', fontSize: 15, fontWeight: 500, fontFamily: 'var(--font-display)' }}>{b.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {banners.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); prev(); }}
            style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', background: 'rgba(20,20,20,.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s', zIndex: 2 }}>
            <ChevronLeft size={14} color="#fff" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); next(); }}
            style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', background: 'rgba(20,20,20,.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s', zIndex: 2 }}>
            <ChevronRight size={14} color="#fff" />
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div style={{ position: 'absolute', bottom: 10, right: 16, display: 'flex', gap: 4, zIndex: 2 }}>
          {banners.map((_, i) => (
            <div key={i} style={{
              width: current === i ? 16 : 4, height: 4, borderRadius: 2,
              background: current === i ? '#e51e1e' : 'rgba(255,255,255,.3)',
              transition: 'all .3s ease'
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
