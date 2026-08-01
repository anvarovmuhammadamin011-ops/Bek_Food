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
      <div className="mx-auto w-full" style={{ maxWidth: 480 }}>
        <div
          style={{
            margin: '0 12px 12px',
            background: 'rgba(255,255,255,.85)',
            backdropFilter: 'blur(20px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 -4px 10px rgba(0,0,0,.05), 0 8px 32px rgba(0,0,0,.06)',
            padding: '6px 8px',
          }}
        >
          <div className="flex items-center justify-around" style={{ height: 50 }}>
            {tabs.map((tab) => {
              const active = location.pathname === tab.path;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className="relative flex flex-col items-center justify-center flex-1 h-full"
                  style={{
                    gap: 3,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all .25s cubic-bezier(.4,0,.2,1)',
                  }}
                >
                  <div
                    style={{
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: active ? 'var(--primary-light)' : 'transparent',
                      transition: 'all .3s var(--ease-spring)',
                      transform: active ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    <Icon
                      size={20}
                      style={{ color: active ? 'var(--primary)' : 'var(--text-dim)', transition: 'all .25s' }}
                      strokeWidth={active ? 2.4 : 1.8}
                    />
                    {tab.label === 'Savat' && cart.length > 0 && (
                      <div
                        className="animate-pop-in"
                        style={{
                          position: 'absolute',
                          top: -2,
                          right: 6,
                          minWidth: 18,
                          height: 18,
                          background: 'var(--primary)',
                          borderRadius: 'var(--radius-full)',
                          fontSize: 10,
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          padding: '0 4px',
                          boxShadow: '0 2px 8px rgba(249,115,22,.3)',
                        }}
                      >
                        {cart.length}
                      </div>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: active ? 600 : 400,
                      color: active ? 'var(--primary)' : 'var(--text-dim)',
                      transition: 'all .25s',
                    }}
                  >
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
