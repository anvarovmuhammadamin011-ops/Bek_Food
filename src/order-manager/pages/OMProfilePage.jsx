import { Mail, Phone, Shield } from 'lucide-react';
import useOrderManagerStore from '../store/useOrderManagerStore';

export default function OMProfilePage() {
  const { operator } = useOrderManagerStore();

  return (
    <div style={{ maxWidth: '480px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>Profile</h2>

      <div style={{
        background: 'var(--bg-card)', borderRadius: '20px', padding: '28px',
        border: '1px solid var(--border)', textAlign: 'center',
      }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 16px',
          overflow: 'hidden', border: '3px solid var(--border)',
        }}>
          <img src={operator.photo} alt={operator.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{operator.name}</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{operator.role}</p>

        <div style={{
          marginTop: '16px', padding: '12px', borderRadius: '12px',
          background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <Mail size={16} color="var(--text-muted)" /> {operator.email}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <Phone size={16} color="var(--text-muted)" /> {operator.phone}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <Shield size={16} color="var(--text-muted)" /> Order Manager
          </div>
        </div>
      </div>
    </div>
  );
}
