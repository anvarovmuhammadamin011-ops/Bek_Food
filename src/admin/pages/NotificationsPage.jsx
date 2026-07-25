import { Bell, CheckCircle, AlertTriangle, Truck, DollarSign, Settings, Trash2, Check } from 'lucide-react';
import useAdminStore from '../store/useAdminStore';

const typeConfig = {
  order: { icon: Bell, color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
  alert: { icon: AlertTriangle, color: 'var(--color-danger)', bg: 'var(--color-danger-light)' },
  delivery: { icon: Truck, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  payment: { icon: DollarSign, color: 'var(--color-success)', bg: 'var(--color-success-light)' },
  system: { icon: Settings, color: 'var(--text-muted)', bg: 'var(--bg-secondary)' },
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAdminStore();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div style={{ padding: '24px', maxWidth: '800px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>Notifications</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--color-primary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Check size={14} /> Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {notifications.map((notif) => {
          const config = typeConfig[notif.type] || typeConfig.system;
          const Icon = config.icon;
          return (
            <div
              key={notif.id}
              onClick={() => markNotificationRead(notif.id)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '16px',
                borderRadius: '14px',
                background: notif.isRead ? 'var(--bg-card)' : 'var(--color-primary-light)',
                border: `1px solid ${notif.isRead ? 'var(--border)' : 'var(--color-primary-border)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: config.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={18} color={config.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{notif.title}</h4>
                  {!notif.isRead && (
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-primary)' }} />
                  )}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{notif.body}</p>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
