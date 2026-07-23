import { useNavigate } from 'react-router-dom';
import { ChevronRight, MapPin, CreditCard, Bell, Globe, Moon, HelpCircle, Shield, FileText, LogOut, Camera } from 'lucide-react';
import useStore from '../store/useStore';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useStore();

  const menuItems = [
    { icon: <MapPin size={18} />, label: 'My Addresses', path: '/addresses', color: 'text-accent-orange' },
    { icon: <CreditCard size={18} />, label: 'Saved Cards', path: '/coupons', color: 'text-accent-orange' },
    { icon: <Bell size={18} />, label: 'Notifications', path: '/notifications', color: 'text-accent-orange' },
    { icon: <Globe size={18} />, label: 'Language', value: 'Uzbek', color: 'text-accent-orange' },
    { icon: <Moon size={18} />, label: 'Dark Theme', value: 'On', color: 'text-accent-orange', toggle: true },
    { icon: <HelpCircle size={18} />, label: 'Help Center', color: 'text-text-secondary' },
    { icon: <Shield size={18} />, label: 'Privacy Policy', color: 'text-text-secondary' },
    { icon: <FileText size={18} />, label: 'Terms of Service', color: 'text-text-secondary' },
  ];

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-24">
      <div className="p-4 max-w-lg mx-auto space-y-4 mt-4">
        {/* Profile Header */}
        <div className="bg-bg-card rounded-2xl p-5 border border-border text-center animate-fade-in">
          <div className="relative inline-block mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-orange to-accent-red flex items-center justify-center text-3xl font-bold text-white">
              {user?.name?.charAt(0) || 'B'}
            </div>
            <button className="absolute bottom-0 right-0 p-2 rounded-full bg-accent-orange text-white shadow-lg">
              <Camera size={12} />
            </button>
          </div>
          <h2 className="text-lg font-bold">{user?.name || 'Bekzod'}</h2>
          <p className="text-text-secondary text-sm">{user?.phone || '+998 90 123 45 67'}</p>
          <p className="text-text-muted text-xs mt-0.5">{user?.email || 'bekzod@example.com'}</p>
        </div>

        {/* Menu Items */}
        <div className="bg-bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
          {menuItems.map((item, i) => (
            <button key={i} onClick={() => item.path && navigate(item.path)}
              className="w-full flex items-center gap-3 p-4 active:bg-bg-card-hover transition-colors text-left">
              <span className={item.color}>{item.icon}</span>
              <span className="flex-1 text-sm font-medium">{item.label}</span>
              {item.value && <span className="text-text-muted text-xs mr-2">{item.value}</span>}
              {item.toggle ? (
                <div className="w-10 h-6 rounded-full bg-accent-orange relative">
                  <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm" />
                </div>
              ) : (
                <ChevronRight size={16} className="text-text-muted" />
              )}
            </button>
          ))}
        </div>

        {/* Logout */}
        <button onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center justify-center gap-2 bg-accent-red/10 text-accent-red font-semibold py-4 rounded-2xl border border-accent-red/20 active:scale-[0.98] transition-all">
          <LogOut size={18} />
          Sign Out
        </button>

        <p className="text-center text-text-muted text-[10px] pb-4">BEK FOOD v1.0.0</p>
      </div>
    </div>
  );
}
