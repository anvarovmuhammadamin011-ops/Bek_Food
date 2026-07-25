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
      background: 'var(--ajif-black)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle red glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(229,30,30,0.12) 0%, transparent 70%)',
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
        {/* Logo image */}
        <img
          src="/favicon.jpg"
          alt="AJIF"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '12px',
            objectFit: 'cover',
            marginBottom: '20px',
            boxShadow: '0 8px 32px rgba(229, 30, 30, 0.3)',
          }}
        />

        {/* Brand name */}
        <h1 style={{
          fontFamily: 'var(--font-family-display)',
          fontStyle: 'italic',
          fontSize: '36px',
          fontWeight: 700,
          color: 'var(--ajif-white)',
          letterSpacing: '0.02em',
        }}>
          AJif
        </h1>

        {/* Tagline */}
        <div style={{
          marginTop: '8px',
          transition: 'all 0.5s ease 0.2s',
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(8px)',
        }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--ajif-white-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
          }}>
            Shashlik & Fastfood
          </p>
        </div>

        {/* Progress bar */}
        <div style={{
          marginTop: '32px',
          width: '140px',
          height: '2px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '1px',
          overflow: 'hidden',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}>
          <div style={{
            height: '100%',
            background: 'var(--ajif-red)',
            borderRadius: '1px',
            transition: 'width 1s ease-out',
            width: phase === 1 ? '50%' : phase >= 2 ? '100%' : '15%',
          }} />
        </div>
      </div>
    </div>
  );
}
