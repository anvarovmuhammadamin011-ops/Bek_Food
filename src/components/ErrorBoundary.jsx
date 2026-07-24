import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '32px', textAlign: 'center', background: 'var(--bg-primary)',
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'var(--color-danger-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '24px',
          }}>
            <AlertTriangle size={36} color="var(--color-danger)" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '32px', maxWidth: '280px', lineHeight: 1.6 }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary)', color: 'white',
              border: 'none', fontSize: '14px', fontWeight: 700,
              cursor: 'pointer', boxShadow: 'var(--shadow-primary)',
              transition: 'all 0.2s ease', fontFamily: 'var(--font-family)',
            }}
          >
            <RefreshCw size={16} /> Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
