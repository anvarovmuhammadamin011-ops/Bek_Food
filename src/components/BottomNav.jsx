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
        <div className="glass-floating mx-2 sm:mx-4 mb-2 sm:mb-4" style={{ borderRadius: 'var(--radius-lg)', padding: '6px 8px' }}>
          <div className="flex items-center justify-around" style={{ height: 50 }}>
            {tabs.map((tab) => {
              const active = location.pathname === tab.path;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className="relative flex flex-col items-center justify-center flex-1 h-full"
                  style={{ gap: 2, background: 'none', border: 'none', cursor: 'pointer', transition: 'all .25s cubic-bezier(.4,0,.2,1)' }}
                >
                  {active && (
                    <div style={{ position: 'absolute', top: -2, left: '50%', transform: 'translateX(-50%)', width: 20, height: 3, borderRadius: 2, background: 'var(--red)', boxShadow: '0 0 8px var(--red-glow)' }} />
                  )}
                  <div className="relative">
                    <Icon size={20} style={{ color: active ? '#e51e1e' : '#6b6b6b', transition: 'all .25s', transform: active ? 'scale(1.1)' : 'scale(1)' }} strokeWidth={active ? 2.5 : 1.8} />
                    {tab.label === 'Savat' && cart.length > 0 && (
                      <div className="animate-pop-in" style={{ position: 'absolute', top: -4, right: -6, minWidth: 16, height: 16, background: 'var(--red)', borderRadius: 8, fontSize: 9, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, padding: '0 3px', boxShadow: '0 2px 6px rgba(229,30,30,.4)' }}>
                        {cart.length}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 10, color: active ? '#e51e1e' : '#6b6b6b', fontWeight: active ? 600 : 400, transition: 'all .25s' }}>
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
