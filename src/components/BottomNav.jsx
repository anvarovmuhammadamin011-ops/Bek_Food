import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, ShoppingCart, ClipboardList, User } from 'lucide-react';
import useStore from '../store/useStore';

const tabs = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/search', icon: Search, label: 'Search' },
  { path: '/cart', icon: ShoppingCart, label: 'Cart' },
  { path: '/orders', icon: ClipboardList, label: 'Orders' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = useStore((s) => s.cart);
  const hide = ['/splash', '/login', '/register', '/otp', '/forgot'].some(p => location.pathname.startsWith(p));
  if (hide) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 px-4">
      <div className="max-w-lg mx-auto rounded-[32px] glass-strong border border-border shadow-card">
        <div className="flex items-center justify-around h-[72px] px-2">
          {tabs.map((tab) => {
            const active = location.pathname === tab.path;
            const Icon = tab.icon;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="relative flex flex-col items-center gap-0.5 py-1 px-3 ripple rounded-xl transition-all duration-200"
              >
                <div className="relative p-1.5 transition-all duration-200">
                  <Icon size={20} className={`transition-all duration-200 ${active ? 'text-accent-orange' : 'text-text-secondary'}`} strokeWidth={active ? 2.2 : 1.8} />
                  {tab.label === 'Cart' && cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent-red text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{ minWidth: 18 }}>
                      {cart.length}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-medium transition-all duration-200 ${active ? 'text-accent-orange' : 'text-text-secondary'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
