import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, ShoppingCart, ClipboardList, User } from 'lucide-react';
import useStore from '../store/useStore';

const tabs = [
  { path: '/', icon: Home, label: 'Bosh sahifa' },
  { path: '/search', icon: Search, label: 'Qidirish' },
  { path: '/cart', icon: ShoppingCart, label: 'Savat' },
  { path: '/orders', icon: ClipboardList, label: 'Buyurtmalar' },
  { path: '/profile', icon: User, label: 'Profil' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = useStore((s) => s.cart);
  const hide = ['/splash', '/login', '/verify', '/checkout'].some((p) => location.pathname.startsWith(p));
  const isFoodDetail = location.pathname.startsWith('/food/');
  if (hide || isFoodDetail) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="mx-auto w-full max-w-6xl px-2">
        <div className="glass-floating mx-2 sm:mx-4 mb-2 sm:mb-4" style={{ borderRadius: 10 }}>
          <div className="nav-item flex items-center justify-around" style={{ height: 56, padding: '0 4px' }}>
            {tabs.map((tab) => {
              const active = location.pathname === tab.path;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className="relative flex flex-col items-center justify-center flex-1 h-full"
                  style={{ gap: 2, background: 'none', border: 'none', cursor: 'pointer', transition: 'all .2s' }}
                >
                  <div className="relative">
                    <Icon size={20} style={{ color: active ? '#e51e1e' : '#6b6b6b', transition: 'all .2s' }} strokeWidth={active ? 2.5 : 1.8} />
                    {tab.label === 'Savat' && cart.length > 0 && (
                      <div style={{ position: 'absolute', top: -4, right: -6, width: 14, height: 14, background: '#e51e1e', borderRadius: '50%', fontSize: 9, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                        {cart.length}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 10, color: active ? '#e51e1e' : '#6b6b6b', fontWeight: 500 }}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
