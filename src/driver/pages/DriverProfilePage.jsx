import { useNavigate } from 'react-router-dom';
import { User, Phone, Car, Star, Calendar, LogOut, Lock, Globe, ChevronRight, Shield } from 'lucide-react';
import useDriverStore from '../store/useDriverStore';

export default function DriverProfilePage() {
  const navigate = useNavigate();
  const { profile, logout, isOnline } = useDriverStore();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/driver/login');
    }
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '100px', scrollbarWidth: 'none' }}>
      <div style={{ padding: '16px' }}>

        {/* Profile Header */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
          padding: '24px', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)', textAlign: 'center', marginBottom: '20px',
        }}>
          <div style={{
            width: '88px', height: '88px', borderRadius: '50%',
            overflow: 'hidden', margin: '0 auto 14px',
            border: '3px solid var(--color-primary)',
            boxShadow: '0 4px 16px rgba(232, 89, 12, 0.2)',
          }}>
            <img src={profile.photo} alt={profile.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {profile.name}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {profile.phone}
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '10px',
            padding: '6px 14px', borderRadius: 'var(--radius-full)',
            background: isOnline ? 'var(--color-success-light)' : 'var(--color-danger-light)',
            color: isOnline ? 'var(--color-success)' : 'var(--color-danger)',
            fontSize: '12px', fontWeight: 700,
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
            {isOnline ? 'Online' : 'Offline'}
          </div>

          {/* Quick Stats */}
          <div style={{
            display: 'flex', justifyContent: 'space-around', marginTop: '16px',
            paddingTop: '16px', borderTop: '1px solid var(--border)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Star size={14} fill="#D4A017" color="#D4A017" /> {profile.rating}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Rating</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>{profile.totalDeliveries}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Deliveries</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{profile.vehicleType}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Vehicle</div>
            </div>
          </div>
        </div>

        {/* Info Rows */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
          overflow: 'hidden', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)', marginBottom: '20px',
        }}>
          {[
            { icon: <Phone size={18} color="var(--color-primary)" />, label: 'Phone', value: profile.phone },
            { icon: <Car size={18} color="var(--color-primary)" />, label: 'Vehicle', value: `${profile.vehicleType} — ${profile.vehiclePlate}` },
            { icon: <Globe size={18} color="var(--color-primary)" />, label: 'Language', value: profile.language },
            { icon: <Calendar size={18} color="var(--color-primary)" />, label: 'Member Since', value: new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) },
          ].map((item, i) => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
              borderTop: i > 0 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'var(--color-primary-light)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {item.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.label}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '1px' }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
          overflow: 'hidden', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)', marginBottom: '20px',
        }}>
          {[
            { icon: <Lock size={18} />, label: 'Change Password', color: 'var(--text-secondary)' },
            { icon: <Shield size={18} />, label: 'Privacy Settings', color: 'var(--text-secondary)' },
          ].map((item, i) => (
            <button key={item.label}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 16px', background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: 'var(--font-family)', textAlign: 'left',
                borderTop: i > 0 ? '1px solid var(--border)' : 'none',
              }}>
              <div style={{ color: item.color }}>{item.icon}</div>
              <span style={{ flex: 1, fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{item.label}</span>
              <ChevronRight size={16} color="var(--text-muted)" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', padding: '16px', borderRadius: 'var(--radius-lg)',
            background: 'var(--color-danger-light)', color: 'var(--color-danger)',
            border: '1.5px solid rgba(224, 49, 49, 0.15)',
            fontSize: '14px', fontWeight: 700, cursor: 'pointer',
            fontFamily: 'var(--font-family)', transition: 'all 0.2s ease',
          }}>
          <LogOut size={18} /> Log Out
        </button>
      </div>
    </div>
  );
}
