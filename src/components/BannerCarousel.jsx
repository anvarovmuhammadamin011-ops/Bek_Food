import { useState, useEffect } from 'react';

export default function BannerCarousel({ banners }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners.length) return null;

  return (
    <div className="relative mx-4 rounded-2xl overflow-hidden h-44">
      <div className="flex transition-transform duration-500 ease-out h-full" style={{ transform: `translateX(-${current * 100}%)` }}>
        {banners.map((banner) => (
          <div key={banner.id} className="flex-shrink-0 w-full h-full relative">
            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <div className="text-white text-xl font-bold mb-1 tracking-tight">{banner.title}</div>
              <div className="text-white/80 text-xs font-medium">{banner.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 right-4 flex gap-1">
        {banners.map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === current ? 'w-4 bg-accent-orange' : 'w-1 bg-white/30'}`} />
        ))}
      </div>
    </div>
  );
}
