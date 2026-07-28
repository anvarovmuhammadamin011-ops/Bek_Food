import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Navigation2, Bike, Check, Clock, Settings } from 'lucide-react';
import useStore from '../../store/useStore';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';

export default function CourierDashboard() {
  const navigate = useNavigate();
  const { user, orders, courierAcceptOrder, courierDelivered, logout } = useStore();
  const [isOnline, setIsOnline] = useState(true);

  const activeOrder = orders.find(o => o.status === 'onTheWay' && o.courierId === user?.id);
  const nextOrder = orders.find(o => o.status === 'ready' && !o.courierId);

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleAccept = () => {
    if (nextOrder && courierAcceptOrder) courierAcceptOrder(nextOrder.id);
  };

  const handleDeliver = () => {
    if (activeOrder && courierDelivered) courierDelivered(activeOrder.id);
  };

  return (
    <div className="h-full relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      <div className="absolute inset-0" style={{ background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          <MapPin size={64} style={{ color: 'var(--primary)', opacity: 0.3 }} />
        </motion.div>
      </div>

      <div className="absolute top-0 left-0 right-0 z-20" style={{ padding: '16px 16px 60px', background: 'linear-gradient(to bottom, rgba(250,250,250,0.95) 0%, transparent 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ color: 'var(--text)', fontSize: 22, fontWeight: 700, margin: 0 }}>
              Kuryer paneli
            </motion.h1>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }} style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>
              {user?.name || 'Kuryer'}
            </motion.p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOnline(!isOnline)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
                cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
              }}
            >
              <motion.div animate={{ background: isOnline ? 'var(--success)' : 'var(--text-muted)' }} style={{ width: 8, height: 8, borderRadius: '50%' }} />
              <span style={{ color: 'var(--text)', fontSize: 12, fontWeight: 600 }}>{isOnline ? 'Online' : 'Offline'}</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
            >
              <span style={{ color: 'var(--text-muted)', fontSize: 16, fontWeight: 700 }}>x</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20" style={{ padding: '0 16px 100px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AnimatePresence mode="wait">
          {activeOrder ? (
            <motion.div key="active" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
              <Card variant="glass" padding="md" className="w-full">
                <CardContent className="space-y-3 pt-0">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Badge variant="success" size="sm" dot>Yetkazilmoqda</Badge>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>12 min</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar name={activeOrder.customerName} size="md" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: 'var(--text)', fontSize: 16, fontWeight: 700, margin: 0 }}>
                        {activeOrder.customerName || 'Mijoz'}
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {activeOrder.address}
                      </p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => { if (activeOrder.phone) window.open(`tel:${activeOrder.phone}`, '_self'); }}
                      style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: 'rgba(34,197,94,0.12)', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
                      }}
                    >
                      <Phone size={18} style={{ color: 'var(--success)' }} />
                    </motion.button>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { if (activeOrder.address) { const q = encodeURIComponent(activeOrder.address); window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank'); } }}
                      style={{
                        flex: 1, padding: '12px 16px', borderRadius: 12,
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        color: 'var(--text)', fontWeight: 600, fontSize: 13,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }}
                    >
                      <Navigation2 size={16} style={{ color: 'var(--primary)' }} />
                      Navigatsiya
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDeliver}
                      style={{
                        flex: 1, padding: '12px 16px', borderRadius: 12,
                        background: 'var(--primary)', border: 'none',
                        color: '#fff', fontWeight: 700, fontSize: 13,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        boxShadow: '0 4px 14px rgba(249,115,22,0.3)',
                      }}
                    >
                      <Check size={16} />
                      Yetkazildi
                    </motion.button>
                  </div>

                  {activeOrder.phone && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { if (activeOrder.phone) { const cleaned = activeOrder.phone.replace(/\D/g, ''); window.open(`https://t.me/+${cleaned}`, '_blank'); } }}
                        style={{
                          flex: 1, padding: '10px', borderRadius: 10,
                          background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
                          color: '#3b82f6', fontWeight: 600, fontSize: 12,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        }}
                      >
                        <Phone size={14} />
                        Telegram
                      </motion.button>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '10px', borderRadius: 10, background: 'var(--bg)' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{(activeOrder.total || activeOrder.totalPrice || 0).toLocaleString()} so'm</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : nextOrder ? (
            <motion.div key="accept" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
              <Card variant="glass" padding="md" className="w-full">
                <CardContent className="pt-0">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Badge variant="primary" size="sm" dot>Yangi</Badge>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      #{nextOrder.id}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <Avatar name={nextOrder.customerName} size="md" />
                    <div>
                      <p style={{ color: 'var(--text)', fontSize: 15, fontWeight: 700, margin: 0 }}>{nextOrder.customerName || 'Mijoz'}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: 12, margin: '2px 0 0' }}>{nextOrder.address}</p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAccept}
                    style={{
                      width: '100%', padding: '14px', borderRadius: 12,
                      background: 'var(--success)', border: 'none',
                      color: '#fff', fontWeight: 700, fontSize: 15,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: '0 4px 14px rgba(34,197,94,0.3)',
                    }}
                  >
                    <Check size={18} />
                    Qabul qilish
                  </motion.button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
              <Card variant="glass" padding="md" className="w-full">
                <CardContent className="pt-0">
                  <div style={{ textAlign: 'center', padding: '12px 0' }}>
                    <Bike size={32} style={{ color: 'var(--text-muted)', marginBottom: 8, opacity: 0.5 }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: 14, fontWeight: 500, margin: 0 }}>
                      {isOnline ? "Yangi buyurtmalar kutilmoqda" : "Online holatga o'ting"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {nextOrder && activeOrder && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card variant="glass" padding="sm" className="w-full">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bike size={16} style={{ color: 'var(--primary)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'var(--text)', fontSize: 13, fontWeight: 600, margin: 0 }}>Keyingi: {nextOrder.customerName}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 11, margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {nextOrder.address}
                  </p>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>
                  {(nextOrder.total || nextOrder.totalPrice || 0).toLocaleString()} so'm
                </span>
              </div>
            </Card>
          </motion.div>
        )}
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
                  <motion.div layoutId="navIndicator" style={{
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
}
