import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, MapPin } from 'lucide-react';
import useStore from '../store/useStore';
import Logo from './Logo';

export default function Header({ title, showBack = false, showNotifications = true, transparent = false }) {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const notifications = useStore((s) => s.notifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={`header ${transparent ? '' : 'glass-header'}`}>
      <div className="inner">
        <div className="brand">
          {showBack && (
            <button onClick={() => navigate(-1)} className="btn-icon ripple">
              <ChevronLeft size={20} />
            </button>
          )}
          {title ? (
            <>
              <Logo size="sm" />
              <h1 className="text-lg font-bold tracking-tight">{title}</h1>
            </>
          ) : (
            <>
              <Logo size="sm" />
              <div className="flex flex-col">
                <div className="location">
                  <MapPin size={10} className="text-primary" />
                  <span>Tashkent, Uzbekistan</span>
                </div>
                <span className="greeting">{user?.name || 'Welcome'}</span>
              </div>
            </>
          )}
        </div>
        {showNotifications && (
          <button onClick={() => navigate('/notifications')} className="btn-icon ripple">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="cart-badge">{unreadCount}</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
