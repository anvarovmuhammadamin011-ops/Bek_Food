import { useEffect, useRef, useState } from 'react';
import { LocateFixed } from 'lucide-react';

const DEFAULT_CENTER = { lat: 41.3111, lng: 69.2797 };

function buildEmbedUrl(lat, lng, zoom = 15) {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=uz&output=embed`;
}

function getMyLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Geolocation qo`llab-quvvatlanmaydi'));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => reject(new Error('Joylashuv ruxsat berilmagan')),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

export default function GoogleMap({ center = DEFAULT_CENTER, zoom = 15, height = 220, onLocationSelect, showMyLocation = true }) {
  const [src, setSrc] = useState(() => buildEmbedUrl(center.lat, center.lng, zoom));
  const [locating, setLocating] = useState(false);
  const [myPos, setMyPos] = useState(null);
  const [failed, setFailed] = useState(false);
  const autoLocated = useRef(false);

  useEffect(() => {
    if (center) setSrc(buildEmbedUrl(center.lat, center.lng, zoom));
  }, [center, zoom]);

  useEffect(() => {
    if (autoLocated.current) return;
    autoLocated.current = true;
    getMyLocation()
      .then((pos) => {
        setMyPos(pos);
        setSrc(buildEmbedUrl(pos.lat, pos.lng, 16));
        if (onLocationSelect) onLocationSelect({ lat: pos.lat, lng: pos.lng, address: 'Mening joylashuvim' });
      })
      .catch(() => setMyPos(null));
  }, []);

  const locateMe = () => {
    setLocating(true);
    getMyLocation()
      .then((pos) => {
        setMyPos(pos);
        setSrc(buildEmbedUrl(pos.lat, pos.lng, 16));
        if (onLocationSelect) onLocationSelect({ lat: pos.lat, lng: pos.lng, address: 'Mening joylashuvim' });
      })
      .catch(() => setMyPos(null))
      .finally(() => setLocating(false));
  };

  return (
    <div style={{ position: 'relative' }}>
      {failed ? (
        <div style={{ width: '100%', height, borderRadius: 'var(--radius)', background: 'var(--surface-active)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13 }}>
          <span>Xarita yuklanmadi</span>
          <button onClick={() => setFailed(false)} style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Qayta urinish</button>
        </div>
      ) : (
        <iframe
          title="Google Maps"
          src={src}
          style={{ width: '100%', height, borderRadius: 'var(--radius)', border: 0, display: 'block' }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          onError={() => setFailed(true)}
        />
      )}
      {showMyLocation && (
        <button
          onClick={locateMe}
          disabled={locating}
          title="Mening joylashuvim"
          style={{
            position: 'absolute', right: 12, top: 12, zIndex: 1,
            width: 36, height: 36, borderRadius: 'var(--radius-full)',
            background: '#fff', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          {locating ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <LocateFixed size={18} color={myPos ? 'var(--primary)' : 'var(--text-muted)'} />}
        </button>
      )}
    </div>
  );
}
