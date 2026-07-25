import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Phone, DollarSign, AlertTriangle, Info, Star } from 'lucide-react';
import useDriverStore from '../store/useDriverStore';

const typeIcons = {
  delivery: { icon: Package, color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
  call: { icon: Phone, color: '#1565C0', bg: 'rgba(21, 101, 192, 0.10)' },
  earnings: { icon: DollarSign, color: 'var(--color-success)', bg: 'var(--color-success-light)' },
  alert: { icon: AlertTriangle, color: 'var(--color-warning)', bg: 'var(--color-warning-light)' },
  system: { icon: Info, color: 'var(--text-secondary)', bg: 'var(--bg-secondary)' },
  rating: { icon: Star, color: '#D4A017', bg: 'rgba(212, 160, 23, 0.10)' },
};

export default function DriverNotificationsPage() {
  const navigate = useNavigate();
  const { notifications, markNotificationRead } = useDriverStore();

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '100px', scrollbarWidth: 'none' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30, padding: '12px 16px',
        background: 'rgba(255, 248, 241, 0.88)', backdropFilter: 'blur(30px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate(-1)}
            style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-primary)', boxShadow: 'var(--shadow-sm)',
            }}>
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>Notifications</h1>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notifications.map((notif, i) => {
            const typeConfig = typeIcons[notif.type] || typeIcons.system;
            const Icon = typeConfig.icon;
            return (
              <div key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                style={{
                  display: 'flex', gap: '12px', padding: '14px',
                  background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  borderLeft: notif.isRead ? '3px solid transparent' : `3px solid ${typeConfig.color}`,
                  boxShadow: 'var(--shadow-card)', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  animation: 'slideUp 0.3s ease-out',
                  animationDelay: `${i * 0.04}s`,
                  animationFillMode: 'both',
                  opacity: notif.isRead ? 0.7 : 1,
                }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: typeConfig.bg, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={18} color={typeConfig.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{
                      fontSize: '13px', fontWeight: notif.isRead ? 500 : 700,
                      color: 'var(--text-primary)',
                    }}>
                      {notif.title}
                    </span>
                    {!notif.isRead && (
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: typeConfig.color, flexShrink: 0, marginTop: '4px',
                      }} />
                    )}
                  </div>
                  <p style={{
                    fontSize: '12px', color: 'var(--text-secondary)',
                    marginTop: '3px', lineHeight: 1.4,
                  }}>
                    {notif.body}
                  </p>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    {notif.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
