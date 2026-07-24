import { useNavigate } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      textAlign: 'center',
      background: 'var(--bg-primary)',
    }}>
      <div style={{
        fontSize: '80px',
        fontWeight: 900,
        color: 'var(--color-primary)',
        lineHeight: 1,
        marginBottom: '16px',
        opacity: 0.15,
      }}>
        404
      </div>
      <h2 style={{
        fontSize: '20px',
        fontWeight: 800,
        color: 'var(--text-primary)',
        letterSpacing: '-0.02em',
        marginBottom: '8px',
      }}>
        Page not found
      </h2>
      <p style={{
        color: 'var(--text-secondary)',
        fontSize: '14px',
        marginBottom: '32px',
        maxWidth: '280px',
        lineHeight: 1.6,
      }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary)', color: 'white',
            border: 'none', fontSize: '14px', fontWeight: 700,
            cursor: 'pointer', boxShadow: 'var(--shadow-primary)',
            transition: 'all 0.2s ease', fontFamily: 'var(--font-family)',
          }}
        >
          <Home size={16} /> Home
        </button>
        <button
          onClick={() => navigate('/search')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 24px', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-card)', color: 'var(--color-primary)',
            border: '1.5px solid var(--color-primary-border)', fontSize: '14px',
            fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease',
            fontFamily: 'var(--font-family)',
          }}
        >
          <Search size={16} /> Search
        </button>
      </div>
    </div>
  );
}
