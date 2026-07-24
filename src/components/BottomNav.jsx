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
    <div className="bottom-nav">
      <div className="inner">
        <div className="tabs">
          {tabs.map((tab) => {
            const active = location.pathname === tab.path;
            const Icon = tab.icon;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`tab ${active ? 'active' : ''}`}
              >
                <div className="icon-wrap">
                  <Icon size={active ? 18 : 20} strokeWidth={active ? 2.2 : 1.8} />
                </div>
                {tab.label === 'Cart' && cart.length > 0 && (
                  <span className="cart-badge">{cart.length}</span>
                )}
                <span className="label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
