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
      <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
        {/* Profile Header */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: '20px',
          padding: '24px', border: '1px solid var(--border)',
          boxShadow: '0 2px 12px rgba(45,42,38,0.05)',
          textAlign: 'center', animation: 'fadeIn 0.3s ease-out',
        }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '12px' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-danger))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', fontWeight: 900, color: 'white',
              boxShadow: '0 4px 20px rgba(232, 89, 12, 0.3)',
            }}>
              {user?.name?.charAt(0) || 'B'}
            </div>
            <button style={{
              position: 'absolute', bottom: '0', right: '0',
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'var(--color-primary)', color: 'white',
              border: '3px solid var(--bg-card)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(232, 89, 12, 0.3)',
              transition: 'all 0.2s ease',
            }}>
              <Camera size={12} />
            </button>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {user?.name || 'Bekzod'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
            {user?.phone || '+998 90 123 45 67'}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
            {user?.email || 'bekzod@example.com'}
          </p>

          {/* Brand Badge */}
          <div style={{
            marginTop: '16px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px',
            padding: '8px 16px', background: 'var(--bg-secondary)',
            borderRadius: '12px',
          }}>
            <Logo size="sm" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>BEK FOOD Member</span>
          </div>
        </div>

        {/* Menu Items */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: '20px',
          border: '1px solid var(--border)', overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(45,42,38,0.05)',
        }}>
          {menuItems.map((item, i) => (
            <button
              key={i}
              onClick={() => item.path && navigate(item.path)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: '14px', padding: '16px 20px',
                background: 'none', border: 'none',
                cursor: item.path ? 'pointer' : 'default',
                transition: 'background 0.15s ease',
                textAlign: 'left', color: 'var(--text-primary)',
                fontFamily: 'var(--font-family)',
                borderTop: i > 0 ? '1px solid var(--border)' : 'none',
              }}
            >
              <span style={{ color: item.muted ? 'var(--text-secondary)' : 'var(--color-primary)' }}>
                {item.icon}
              </span>
              <span style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>{item.label}</span>
              {item.value && <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginRight: '4px' }}>{item.value}</span>}
              {item.toggle ? (
                <div style={{
                  width: '40px', height: '24px', borderRadius: '9999px',
                  background: 'var(--color-primary)', position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute', right: '2px', top: '2px',
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  }} />
                </div>
              ) : (
                <ChevronRight size={16} color="var(--text-muted)" />
              )}
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={() => { logout(); navigate('/login'); }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px',
            background: 'var(--color-danger-light)',
            color: 'var(--color-danger)', fontWeight: 700,
            padding: '16px', borderRadius: '20px',
            border: '1.5px solid rgba(224, 49, 49, 0.15)',
            cursor: 'pointer', transition: 'all 0.2s ease',
            fontSize: '14px', fontFamily: 'var(--font-family)',
          }}
        >
          <LogOut size={18} />
          Sign Out
        </button>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '10px', paddingBottom: '16px' }}>
          BEK FOOD v1.0.0
        </p>
      </div>
    </div>
  );
}
