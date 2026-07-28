import { useNavigate } from 'react-router-dom';
import { User, ChevronRight, MapPin, Bell, Heart, ClipboardList, LogOut, Star } from 'lucide-react';
import useStore from '../store/useStore';
import LoyaltyCard from '../components/LoyaltyCard';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useStore();

  const handleLogout = () => { logout(); navigate('/login'); };

  if (!isAuthenticated) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 text-center">
        <div className="empty-state-icon"><User size={28} /></div>
        <h2 className="heading" style={{ marginBottom: 6 }}>Profilingizga kiring</h2>
        <p className="body" style={{ marginBottom: 24 }}>Buyurtma berish uchun kirish kerak</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary">Kirish</button>
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
        <div className="card p-5 text-center animate-fade-in">
          <div style={{ width: 68, height: 68, borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', border: '2px solid rgba(249,115,22,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 26, fontWeight: 700, color: 'var(--primary)' }}>
            {user?.name?.charAt(0) || 'B'}
          </div>
          <h2 style={{ color: 'var(--text)', fontSize: 17, fontWeight: 600 }}>{user?.name || 'Foydalanuvchi'}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>{user?.phone || '+998901234567'}</p>
          {user?.bonus > 0 && (
            <div className="badge badge-primary" style={{ marginTop: 12, padding: '5px 14px', fontSize: 12 }}>
              <Star size={12} />
              {user.bonus.toLocaleString()} so'm bonus
            </div>
          )}
        </div>

        <LoyaltyCard points={user?.bonus || 0} tier={user?.bonus > 500 ? 'gold' : user?.bonus > 100 ? 'silver' : 'standard'} />

        <div className="card animate-fade-in-up" style={{ overflow: 'hidden', animationDelay: '.1s' }}>
          {menu.map((item, i) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center justify-between"
              style={{
                padding: '14px 16px', transition: 'all .2s', cursor: 'pointer', background: 'none', border: 'none',
                borderBottom: i < menu.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div className="flex items-center" style={{ gap: 12 }}>
                <item.icon size={18} color="var(--text-muted)" />
                <span style={{ color: 'var(--text)', fontSize: 14 }}>{item.label}</span>
              </div>
              <ChevronRight size={16} color="var(--text-dim)" />
            </button>
          ))}
        </div>

        <button onClick={handleLogout} className="w-full flex items-center justify-center" style={{ gap: 8, padding: 14, borderRadius: 'var(--radius)', border: '1px solid rgba(239,68,68,.2)', background: 'none', color: 'var(--danger)', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all .2s' }}>
          <LogOut size={16} />
          Chiqish
        </button>
      </div>
    </div>
  );
}
