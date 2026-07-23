import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);
  const isAuthenticated = useStore((s) => s.isAuthenticated);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => navigate(isAuthenticated ? '/' : '/login'), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [navigate, isAuthenticated]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-bg-primary relative overflow-hidden">
      <div className={`relative flex flex-col items-center transition-all duration-700 ${phase >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <h1 className="text-3xl font-black text-white tracking-[0.15em]">BEK FOOD</h1>
        <div className={`mt-2.5 transition-all duration-500 delay-200 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <p className="text-text-secondary text-[11px] font-bold uppercase tracking-[0.3em]">Tez va Mazali</p>
        </div>

        <div className={`mt-10 w-36 h-[2px] bg-white/10 rounded-full overflow-hidden transition-all duration-500 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
          <div 
            className="h-full bg-accent-orange transition-all duration-1000 ease-out"
            style={{ width: phase === 1 ? '50%' : phase >= 2 ? '100%' : '15%' }}
          />
        </div>
      </div>
    </div>
  );
}
