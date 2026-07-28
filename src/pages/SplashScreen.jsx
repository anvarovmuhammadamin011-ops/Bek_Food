import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => navigate('/login'), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [navigate]);

  return (
    <div className="h-full flex flex-col items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className={`flex flex-col items-center transition-all duration-500 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`} style={{ transform: phase >= 1 ? 'scale(1)' : 'scale(.95)' }}>
        <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-xl)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, background: 'var(--primary-light)' }}>
          <img
            src="/logo.png"
            alt="BEK FOOD"
            style={{ width: 48, height: 48, objectFit: 'contain' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden" style={{ display: 'none', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>BF</span>
          </div>
        </div>
      </div>
      <div className={`absolute bottom-24 w-32 transition-all duration-400 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: phase === 1 ? '50%' : phase >= 2 ? '100%' : '0%' }} />
        </div>
      </div>
    </div>
  );
}
