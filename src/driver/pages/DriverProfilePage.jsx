import { Mail, Phone, Star, Truck, Calendar } from 'lucide-react';
import useDriverStore from '../store/useDriverStore';

export default function DriverProfilePage() {
  const { profile, stats } = useDriverStore();

  return (
    <div style={{ maxWidth: '480px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '20px' }}>Profil</h2>

      <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '28px', border: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 16px', overflow: 'hidden', border: '3px solid var(--border)' }}>
          <img src={profile.photo} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{profile.name}</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>⭐ {profile.rating} · {profile.vehicleType}</p>

        <div style={{ marginTop: '16px', padding: '12px', borderRadius: '12px', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <Mail size={16} color="var(--text-muted)" /> {profile.email}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <Phone size={16} color="var(--text-muted)" /> {profile.phone}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <Truck size={16} color="var(--text-muted)" /> {profile.vehicleType} · {profile.vehiclePlate}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <Calendar size={16} color="var(--text-muted)" /> {profile.joinDate}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '16px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{profile.totalDeliveries}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Jami yetkazishlar</div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-success)' }}>%{stats.completionRate}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bajarilish darajasi</div>
        </div>
      </div>
    </div>
  );
}
