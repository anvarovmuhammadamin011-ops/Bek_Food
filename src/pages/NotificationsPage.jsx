import useStore from '../store/useStore';
import { Package, Tag, Gift, Info, Bell } from 'lucide-react';

const typeConfig = {
  order: { icon: Package, bg: 'var(--color-primary-light)', color: 'var(--color-primary)' },
  offer: { icon: Tag, bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  coupon: { icon: Gift, bg: 'var(--color-success-light)', color: 'var(--color-success)' },
  system: { icon: Info, bg: 'var(--color-primary-light)', color: 'var(--color-primary)' },
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead } = useStore();

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-24">
      <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          Notifications
        </h1>

        {notifications.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 32px', textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
            }}>
              <Bell size={24} color="var(--text-secondary)" />
            </div>
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>No notifications</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>You're all caught up!</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notifications.map(notif => {
            const config = typeConfig[notif.type] || typeConfig.system;
            const Icon = config.icon;
            return (
              <button key={notif.id} onClick={() => markNotificationRead(notif.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'flex-start', gap: '12px',
                  padding: '16px', borderRadius: '16px', border: '1px solid',
                  borderColor: notif.isRead ? 'var(--border)' : 'var(--color-primary-border)',
                  background: 'var(--bg-card)', textAlign: 'left',
                  transition: 'all 0.2s ease', cursor: 'pointer', fontFamily: 'var(--font-family)',
                  animation: 'slideUp 0.3s ease-out',
                }}>
                <div style={{
                  padding: '10px', borderRadius: '12px',
                  background: config.bg, color: config.color, flexShrink: 0,
                }}>
                  <Icon size={16} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{notif.title}</h4>
                    {!notif.isRead && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0 }} />}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {notif.body}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '10px', marginTop: '6px' }}>
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
