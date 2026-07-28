import React, { useState } from 'react';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Lock,
  Globe,
  Bell,
  Moon,
  Clock,
  LogOut,
  Star,
  Shield,
  LayoutDashboard,
  ShoppingCart,
  Settings,
} from 'lucide-react';

const CourierSettings = () => {
  const navigate = useNavigate();
  const { user, logout } = useStore();
  const [isOnline, setIsOnline] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: User, label: "Profil ma'lumotlari", path: '/courier/profile/edit' },
    { icon: Phone, label: 'Telefon', value: user?.phone || '+998 90 123 45 67' },
    { icon: Lock, label: 'Parol', path: '/courier/password' },
    { icon: Globe, label: 'Til', value: "O'zbek" },
    {
      icon: Bell,
      label: 'Bildirishnomalar',
      toggle: true,
      checked: notifications,
      onChange: () => setNotifications(!notifications),
    },
    {
      icon: Moon,
      label: 'Dark Mode',
      toggle: true,
      checked: darkMode,
      onChange: () => setDarkMode(!darkMode),
      disabled: true,
    },
    {
      icon: Clock,
      label: 'Ish rejimi',
      badge: 'Faol',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 100 }}>
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingTop: 10 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <ChevronLeft size={20} style={{ color: 'var(--text)' }} />
          </button>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', margin: 0 }}>Sozlamalar</h1>
          <div style={{ width: 40 }} />
        </div>

        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          padding: 20,
          marginBottom: 20,
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'C'}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', margin: '0 0 4px 0' }}>
                  {user?.name || 'Kuryer'}
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 6px 0' }}>
                  {user?.phone || '+998 90 123 45 67'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      style={{
                        fill: star <= (user?.rating || 5) ? '#fbbf24' : 'transparent',
                        color: star <= (user?.rating || 5) ? '#fbbf24' : 'var(--border-strong)',
                      }}
                    />
                  ))}
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 6 }}>
                    {user?.rating || 5.0}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/courier/profile/edit')}
              style={{
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                background: 'var(--primary)',
                borderRadius: 10,
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(249,115,22,0.2)',
              }}
            >
              Tahrirlash
            </button>
          </div>
        </div>

        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          marginBottom: 20,
          border: '1px solid var(--border)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {menuItems.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                cursor: item.toggle ? 'default' : 'pointer',
                borderBottom: index !== menuItems.length - 1 ? '1px solid var(--border)' : 'none',
                background: 'transparent',
              }}
              onClick={item.toggle ? undefined : () => navigate(item.path)}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}>
                  <item.icon size={20} style={{ color: 'var(--primary)' }} />
                </div>
                <span style={{ fontSize: 15, color: 'var(--text)', fontWeight: 500 }}>{item.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {item.value && (
                  <span style={{ fontSize: 13, color: 'var(--text-muted)', marginRight: 8 }}>{item.value}</span>
                )}
                {item.badge && (
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 20,
                    background: 'rgba(34,197,94,0.08)',
                    color: 'var(--success)',
                    fontSize: 12,
                    fontWeight: 600,
                    marginRight: 8,
                  }}>
                    {item.badge}
                  </span>
                )}
                {item.toggle ? (
                  <div
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 12,
                      padding: 2,
                      cursor: item.disabled ? 'not-allowed' : 'pointer',
                      backgroundColor: item.checked ? 'var(--primary)' : 'var(--border-strong)',
                      opacity: item.disabled ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'background-color 0.3s',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!item.disabled && item.onChange) item.onChange();
                    }}
                  >
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                      transform: item.checked ? 'translateX(18px)' : 'translateX(2px)',
                      transition: 'transform 0.3s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                    }} />
                  </div>
                ) : (
                  <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          padding: 20,
          marginBottom: 20,
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14,
              }}>
                <Shield size={24} style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '0 0 4px 0' }}>Ish holati</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                  {isOnline ? 'Siz hozir online\'asiz' : 'Siz hozir offline\'asiz'}
                </p>
              </div>
            </div>
            <div
              style={{
                width: 52,
                height: 28,
                borderRadius: 14,
                padding: 2,
                cursor: 'pointer',
                backgroundColor: isOnline ? 'var(--success)' : 'var(--border-strong)',
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 0.3s',
              }}
              onClick={() => setIsOnline(!isOnline)}
            >
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: '#fff',
                transform: isOnline ? 'translateX(22px)' : 'translateX(2px)',
                transition: 'transform 0.3s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              }} />
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 14, marginBottom: 0, fontStyle: 'italic' }}>
            Online bo'lganingizda buyurtmalar sizga taqdim etiladi
          </p>
        </div>

        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          padding: 20,
          marginBottom: 20,
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '0 0 4px 0' }}>Tez yordam</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Muammo bo'lganda bog'laning</p>
            </div>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              background: 'var(--primary)',
              borderRadius: 10,
              border: 'none',
              color: '#fff',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(249,115,22,0.2)',
            }}>
              <Phone size={16} />
              <span>Qo'ng'iroq</span>
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '16px 20px',
            background: 'var(--surface)',
            borderRadius: 'var(--radius)',
            border: '1px solid rgba(239,68,68,0.2)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <LogOut size={20} style={{ color: 'var(--danger)' }} />
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--danger)' }}>Chiqish</span>
        </button>
      </div>

      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '8px 0',
          maxWidth: 480,
          margin: '0 auto',
        }}>
          {[
            { icon: LayoutDashboard, label: 'Bosh sahifa', path: '/courier' },
            { icon: ShoppingCart, label: 'Buyurtmalar', path: '/courier/orders' },
            { icon: Settings, label: 'Sozlamalar', path: '/courier/settings' },
          ].map((item) => {
            const isActive = window.location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  padding: '6px 16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: -8,
                    width: 24,
                    height: 3,
                    borderRadius: 2,
                    background: 'var(--primary)',
                  }} />
                )}
                <item.icon
                  size={20}
                  style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}
                />
                <span style={{
                  fontSize: 10,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourierSettings;
