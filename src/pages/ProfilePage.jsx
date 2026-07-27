import { useNavigate } from 'react-router-dom';
import { User, ChevronRight, MapPin, Bell, Heart, ClipboardList, LogOut, Star } from 'lucide-react';
import useStore from '../store/useStore';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 text-center">
        <div className="empty-state-icon">
          <User size={24} />
        </div>
        <h2 style={{ color: '#fff', fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Profilingizga kiring</h2>
        <p className="text-muted" style={{ fontSize: 12, marginBottom: 24 }}>Buyurtma berish uchun kirish kerak</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ borderRadius: 10, padding: '13px 32px' }}>Kirish</button>
      </div>
    );
  }

  const menu = [
    { icon: ClipboardList, label: 'Buyurtmalar tarixi', path: '/orders' },
    { icon: Heart, label: 'Sevimlilar', path: '/favorites' },
    { icon: MapPin, label: 'Manzillarim', path: '/addresses' },
    { icon: Bell, label: 'Bildirishnomalar', path: '/notifications' },
    { icon: Star, label: 'Aksiya va bonuslar', path: '/coupons' },
  ];

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="p-4 space-y-4 mt-4">
        {/* Profile header */}
        <div className="card p-5 text-center animate-fade-in">
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e51e1e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600, color: '#fff' }}>
            {user?.name?.charAt(0) || 'B'}
          </div>
          <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 500 }}>{user?.name || 'Foydalanuvchi'}</h2>
          <p style={{ color: '#6b6b6b', fontSize: 12, marginTop: 2 }}>{user?.phone || '+998901234567'}</p>
          {user?.bonus > 0 && (
            <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 16, background: 'rgba(229,30,30,.15)', color: '#e51e1e', fontSize: 12, fontWeight: 500 }}>
              <Star size={12} />
              {user.bonus.toLocaleString()} so'm bonus
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {menu.map((item, i) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center justify-between"
              style={{
                padding: '14px 16px', transition: 'all .15s', cursor: 'pointer', background: 'none', border: 'none',
                borderBottom: i < menu.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none'
              }}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} color="#6b6b6b" />
                <span style={{ color: '#fff', fontSize: 14 }}>{item.label}</span>
              </div>
              <ChevronRight size={16} color="#6b6b6b" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2" style={{ padding: 12, borderRadius: 10, border: '1px solid rgba(229,30,30,.3)', background: 'none', color: '#e51e1e', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
          <LogOut size={16} />
          Chiqish
        </button>
      </div>
    </div>
  );
}
