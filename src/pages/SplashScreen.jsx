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
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--text-primary)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative circles */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        right: '-60px',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(232, 89, 12, 0.15)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        left: '-40px',
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        background: 'rgba(232, 89, 12, 0.08)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'all 0.7s ease',
        opacity: phase >= 0 ? 1 : 0,
        transform: phase >= 0 ? 'scale(1)' : 'scale(0.95)',
      }}>
        {/* Logo */}
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-terracotta))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(232, 89, 12, 0.4)',
          marginBottom: '16px',
        }}>
          <span style={{ fontWeight: 900, color: 'white', fontSize: '24px', letterSpacing: '-0.03em' }}>BF</span>
        </div>

        <h1 style={{
          fontSize: '28px',
          fontWeight: 900,
          color: 'white',
          letterSpacing: '0.12em',
        }}>
          BEK FOOD
        </h1>

        <div style={{
          marginTop: '8px',
          transition: 'all 0.5s ease 0.2s',
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(8px)',
        }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
          }}>
            Tez va Mazali
          </p>
        </div>

        {/* Progress bar */}
        <div style={{
          marginTop: '32px',
          width: '140px',
          height: '3px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '2px',
          overflow: 'hidden',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}>
          <div style={{
            height: '100%',
            background: 'var(--color-primary)',
            borderRadius: '2px',
            transition: 'width 1s ease-out',
            width: phase === 1 ? '50%' : phase >= 2 ? '100%' : '15%',
          }} />
        </div>
      </div>
    </div>
  );
}
