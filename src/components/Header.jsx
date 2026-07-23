import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, MapPin } from 'lucide-react';
import useStore from '../store/useStore';

export default function Header({ title, showBack = false, showNotifications = true, transparent = false }) {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const notifications = useStore((s) => s.notifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={`sticky top-0 z-40 px-4 pt-3 pb-3 ${transparent ? '' : 'glass-strong border-b border-border'}`}>
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl bg-bg-card border border-border ripple active:scale-95 transition-transform">
              <ChevronLeft size={20} />
            </button>
          )}
          {title ? (
            <h1 className="text-lg font-bold tracking-tight">{title}</h1>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-text-secondary text-xs">
                <MapPin size={12} className="text-accent-orange" />
                <span>Tashkent, Uzbekistan</span>
              </div>
              <span className="text-sm font-semibold">{user?.name || 'Welcome'}</span>
            </div>
          )}
        </div>
        {showNotifications && (
          <button onClick={() => navigate('/notifications')} className="relative p-2.5 rounded-xl bg-bg-card border border-border ripple active:scale-95 transition-transform">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent-red text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
