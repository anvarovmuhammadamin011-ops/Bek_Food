import useStore from '../store/useStore';
import { Package, Tag, Gift, Info, Bell } from 'lucide-react';

const typeConfig = {
  order: { icon: <Package size={16} />, color: 'bg-accent-orange/15 text-accent-orange' },
  offer: { icon: <Tag size={16} />, color: 'bg-accent-red/15 text-accent-red' },
  coupon: { icon: <Gift size={16} />, color: 'bg-success/15 text-success' },
  system: { icon: <Info size={16} />, color: 'bg-blue-500/15 text-blue-400' },
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead } = useStore();

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-24">
      <div className="p-4 max-w-lg mx-auto">
        <h1 className="text-lg font-bold mb-4">Notifications</h1>

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-bg-card border border-border flex items-center justify-center mb-4">
              <Bell size={24} className="text-text-secondary" />
            </div>
            <h3 className="font-bold mb-1">No notifications</h3>
            <p className="text-text-secondary text-sm">You're all caught up!</p>
          </div>
        )}

        <div className="space-y-2">
          {notifications.map(notif => {
            const config = typeConfig[notif.type] || typeConfig.system;
            return (
              <button key={notif.id} onClick={() => markNotificationRead(notif.id)}
                className={`w-full flex items-start gap-3 p-4 rounded-2xl border text-left transition-all active:scale-[0.98] animate-slide-up ${notif.isRead ? 'bg-bg-card border-border' : 'bg-bg-card border-accent-orange/20'}`}>
                <div className={`p-2.5 rounded-xl ${config.color}`}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold">{notif.title}</h4>
                    {!notif.isRead && <div className="w-2 h-2 rounded-full bg-accent-orange" />}
                  </div>
                  <p className="text-text-secondary text-xs mt-1 line-clamp-2">{notif.body}</p>
                  <p className="text-text-muted text-[10px] mt-1.5">{new Date(notif.createdAt).toLocaleString()}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
