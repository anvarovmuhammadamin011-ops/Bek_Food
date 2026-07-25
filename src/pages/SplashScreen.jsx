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
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle green glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(107,143,113,0.12) 0%, transparent 70%)',
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
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          boxShadow: 'var(--shadow-primary)',
        }}>
          <span style={{
            fontWeight: 800,
            color: 'white',
            fontSize: '28px',
            letterSpacing: '-0.02em',
          }}>AC</span>
        </div>

        {/* Brand name */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}>
          Alif Cafe
        </h1>

        {/* Tagline */}
        <div style={{
          marginTop: '8px',
          transition: 'all 0.5s ease 0.2s',
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(8px)',
        }}>
          <p style={{
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--text-muted)',
            letterSpacing: '0.05em',
          }}>
            Premium Coffee & Fast Food
          </p>
        </div>

        {/* Progress bar */}
        <div style={{
          marginTop: '32px',
          width: '140px',
          height: '2px',
          background: 'var(--border)',
          borderRadius: '1px',
          overflow: 'hidden',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}>
          <div style={{
            height: '100%',
            background: 'var(--color-primary)',
            borderRadius: '1px',
            transition: 'width 1s ease-out',
            width: phase === 1 ? '50%' : phase >= 2 ? '100%' : '15%',
          }} />
        </div>
      </div>
    </div>
  );
}
