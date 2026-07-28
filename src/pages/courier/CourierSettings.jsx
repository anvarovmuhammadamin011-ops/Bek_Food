import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Bike, Check, Clock, Settings } from 'lucide-react';
import useStore from '../../store/useStore';
import { Card, CardContent } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';

const CourierSettings = () => {
  const navigate = useNavigate();
  const { user, logout } = useStore();
  const [isOnline, setIsOnline] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = () => { logout(); navigate('/login'); };

  const menuItems = [
    { icon: Settings, label: "Profil ma'lumotlari", path: '/courier/profile/edit' },
    { icon: Phone, label: 'Telefon', value: user?.phone || '+998 90 123 45 67' },
    { icon: Settings, label: 'Parol', path: '/courier/password' },
    { icon: Settings, label: 'Til', value: "O'zbek" },
    { icon: Clock, label: 'Bildirishnomalar', toggle: true, checked: notifications, onChange: () => setNotifications(!notifications) },
    { icon: Clock, label: 'Dark Mode', toggle: true, checked: darkMode, onChange: () => setDarkMode(!darkMode), disabled: true },
    { icon: Clock, label: 'Ish rejimi', badge: 'Faol' },
  ];

  const renderToggle = (item) => (
    <div style={{
      width: 44, height: 24, borderRadius: 12, padding: 2,
      cursor: item.disabled ? 'not-allowed' : 'pointer',
      backgroundColor: item.checked ? 'var(--primary)' : 'var(--border-strong)',
      opacity: item.disabled ? 0.6 : 1,
      display: 'flex', alignItems: 'center', transition: 'background-color 0.3s',
    }}
      onClick={(e) => { e.stopPropagation(); if (!item.disabled && item.onChange) item.onChange(); }}
    >
      <motion.div animate={{ x: item.checked ? 18 : 2 }} transition={{ type: 'spring', stiffness: 300 }} style={{
        width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
      }} />
    </div>
  );

  const renderArrow = () => (
    <span style={{ color: 'var(--text-muted)', fontSize: 16, fontWeight: 300 }}>{">"}</span>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 100 }}>
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingTop: 10 }}>
          <motion.button whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
          >
            <span style={{ color: 'var(--text)', fontSize: 18, fontWeight: 700, lineHeight: 1 }}>{"<"}</span>
          </motion.button>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', margin: 0 }}>Sozlamalar</h1>
          <div style={{ width: 40 }} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="default" padding="md" className="mb-5">
            <CardContent className="pt-0">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Avatar name={user?.name || 'Kuryer'} size="xl" />
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', margin: '0 0 4px' }}>
                      {user?.name || 'Kuryer'}
                    </h2>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 6px' }}>
                      {user?.phone || '+998 90 123 45 67'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Check key={star} size={12} style={{
                          fill: star <= (user?.rating || 5) ? '#fbbf24' : 'transparent',
                          color: star <= (user?.rating || 5) ? '#fbbf24' : 'var(--border-strong)',
                        }} />
                      ))}
                      <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 6 }}>
                        {user?.rating || 5.0}
                      </span>
                    </div>
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/courier/profile/edit')}
                  style={{
                    padding: '8px 16px', fontSize: 13, fontWeight: 600,
                    background: 'var(--primary)', borderRadius: 10, border: 'none', color: '#fff',
                    cursor: 'pointer', boxShadow: '0 2px 8px rgba(249,115,22,0.2)',
                  }}
                >
                  Tahrirlash
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card variant="default" padding="none" className="mb-5 overflow-hidden">
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                whileTap={item.toggle ? {} : { scale: 0.99 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px',
                  cursor: item.toggle ? 'default' : 'pointer',
                  borderBottom: index !== menuItems.length - 1 ? '1px solid var(--border)' : 'none',
                }}
                onClick={item.toggle ? undefined : () => { if (item.path) navigate(item.path); }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, background: 'var(--primary-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <item.icon size={18} style={{ color: 'var(--primary)' }} />
                  </div>
                  <span style={{ fontSize: 15, color: 'var(--text)', fontWeight: 500 }}>{item.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {item.value && <span style={{ fontSize: 13, color: 'var(--text-muted)', marginRight: 8 }}>{item.value}</span>}
                  {item.badge && (
                    <span style={{
                      padding: '4px 10px', borderRadius: 20, background: 'rgba(34,197,94,0.08)',
                      color: 'var(--success)', fontSize: 12, fontWeight: 600, marginRight: 8,
                    }}>
                      {item.badge}
                    </span>
                  )}
                  {item.toggle ? renderToggle(item) : renderArrow()}
                </div>
              </motion.div>
            ))}
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card variant="default" padding="md" className="mb-5">
            <CardContent className="pt-0">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, background: 'var(--primary-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Bike size={24} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '0 0 4px' }}>Ish holati</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                      {isOnline ? "Siz hozir online'siz" : "Siz hozir offline'siz"}
                    </p>
                  </div>
                </div>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOnline(!isOnline)}
                  style={{
                    width: 52, height: 28, borderRadius: 14, padding: 2, cursor: 'pointer',
                    backgroundColor: isOnline ? 'var(--success)' : 'var(--border-strong)',
                    display: 'flex', alignItems: 'center', transition: 'background-color 0.3s',
                  }}
                >
                  <motion.div animate={{ x: isOnline ? 22 : 2 }} transition={{ type: 'spring', stiffness: 300 }} style={{
                    width: 24, height: 24, borderRadius: '50%', backgroundColor: '#fff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  }} />
                </motion.div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 14, marginBottom: 0, fontStyle: 'italic' }}>
                Online bo'lganingizda buyurtmalar sizga taqdim etiladi
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card variant="default" padding="md" className="mb-5">
            <CardContent className="pt-0">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: '0 0 4px' }}>Tez yordam</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Muammo bo'lganda bog'laning</p>
                </div>
                <motion.button whileTap={{ scale: 0.95 }} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
                  background: 'var(--primary)', borderRadius: 10, border: 'none',
                  color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(249,115,22,0.2)',
                }}>
                  <Phone size={16} />
                  <span>Qo'ng'iroq</span>
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '16px 20px', background: 'var(--surface)', borderRadius: 'var(--radius)',
            border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
          }}
        >
          <span style={{ color: 'var(--danger)', fontSize: 18, fontWeight: 700, lineHeight: 1 }}>x</span>
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--danger)' }}>Chiqish</span>
        </motion.button>
      </div>

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '8px 0', maxWidth: 480, margin: '0 auto' }}>
          {[
            { icon: MapPin, label: 'Bosh sahifa', path: '/courier' },
            { icon: Bike, label: 'Buyurtmalar', path: '/courier/orders' },
            { icon: Settings, label: 'Sozlamalar', path: '/courier/settings' },
          ].map((item) => {
            const isActive = window.location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '6px 16px', background: 'none', border: 'none', cursor: 'pointer', position: 'relative',
                }}
              >
                {isActive && (
                  <motion.div layoutId="navIndicator3" style={{
                    position: 'absolute', top: -8, width: 24, height: 3, borderRadius: 2, background: 'var(--primary)',
                  }} />
                )}
                <item.icon size={20} style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }} />
                <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourierSettings;
