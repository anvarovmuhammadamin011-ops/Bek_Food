import { useNavigate } from 'react-router-dom';
import { ChevronRight, MapPin, CreditCard, Bell, Globe, Moon, HelpCircle, Shield, FileText, LogOut, Camera } from 'lucide-react';
import useStore from '../store/useStore';
import Logo from '../components/Logo';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useStore();

  const menuItems = [
    { icon: <MapPin size={18} />, label: 'My Addresses', path: '/addresses' },
    { icon: <CreditCard size={18} />, label: 'Saved Cards', path: '/coupons' },
    { icon: <Bell size={18} />, label: 'Notifications', path: '/notifications' },
    { icon: <Globe size={18} />, label: 'Language', value: 'Uzbek' },
    { icon: <Moon size={18} />, label: 'Dark Theme', value: 'On', toggle: true },
    { icon: <HelpCircle size={18} />, label: 'Help Center', muted: true },
    { icon: <Shield size={18} />, label: 'Privacy Policy', muted: true },
    { icon: <FileText size={18} />, label: 'Terms of Service', muted: true },
  ];

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-24">
      <div className="p-4 max-w-lg mx-auto space-y-4 mt-4">
        {/* Profile Header */}
        <div className="card p-5 text-center animate-fade-in">
          <div className="relative inline-block mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-danger flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {user?.name?.charAt(0) || 'B'}
            </div>
            <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white shadow-lg active:scale-90 transition-transform">
              <Camera size={12} />
            </button>
          </div>
          <h2 className="text-lg font-bold">{user?.name || 'Bekzod'}</h2>
          <p className="text-secondary text-sm">{user?.phone || '+998 90 123 45 67'}</p>
          <p className="text-muted text-xs mt-0.5">{user?.email || 'bekzod@example.com'}</p>

          {/* Brand Badge */}
          <div className="brand-badge">
            <Logo size="sm" />
            <span>BEK FOOD Member</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="profile-menu">
          {menuItems.map((item, i) => (
            <button key={i} onClick={() => item.path && navigate(item.path)} className="item">
              <span className={`icon ${item.muted ? 'muted' : ''}`}>{item.icon}</span>
              <span className="label">{item.label}</span>
              {item.value && <span className="value">{item.value}</span>}
              {item.toggle ? (
                <div className="toggle" />
              ) : (
                <ChevronRight size={16} className="text-muted" />
              )}
            </button>
          ))}
        </div>

        {/* Logout */}
        <button onClick={() => { logout(); navigate('/login'); }} className="logout-btn">
          <LogOut size={18} />
          Sign Out
        </button>

        <p className="text-center text-muted text-[10px] pb-4">BEK FOOD v1.0.0</p>
      </div>
    </div>
  );
}
