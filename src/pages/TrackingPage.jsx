import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, MapPin, Phone, Clock, CheckCircle2, ChefHat, Bike, Navigation, PackageCheck, Timer, User, Map } from 'lucide-react';
import useStore from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { formatTime } from '../utils/cn';

const STEPS = [
  { key: 'pending', label: 'Buyurtma qabul qilindi', icon: CheckCircle2, color: '#F59E0B' },
  { key: 'preparing', label: 'Tayyorlanmoqda', icon: ChefHat, color: '#3B82F6' },
  { key: 'ready', label: 'Tayyor', icon: PackageCheck, color: '#22C55E' },
  { key: 'onTheWay', label: "Kuryer oldi", icon: Bike, color: '#8B5CF6' },
  { key: 'courierArrived', label: "Yo'lda", icon: Navigation, color: '#F97316' },
  { key: 'delivered', label: 'Yetkazildi', icon: CheckCircle2, color: '#22C55E' },
];

const statusTimeEstimates = {
  pending: 0,
  preparing: 3,
  ready: 12,
  onTheWay: 18,
  courierArrived: 24,
  delivered: 30,
};

function getStepTime(currentOrder, stepKey) {
  if (!currentOrder?.createdAt) return '';
  const base = new Date(currentOrder.createdAt).getTime();
  const offset = (statusTimeEstimates[stepKey] || 0) * 60000;
  return formatTime(new Date(base + offset));
}

function getStatusLabel(key) {
  const labels = {
    pending: 'Kutilmoqda',
    preparing: 'Tayyorlanmoqda',
    ready: 'Tayyor',
    onTheWay: "Yo'lda",
    courierArrived: 'Kuryer yetib keldi',
    delivered: 'Yetkazildi',
  };
  return labels[key] || key;
}

export default function TrackingPage() {
  const navigate = useNavigate();
  const { currentOrder, updateOrderStatus } = useStore();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!currentOrder) return;
    const statuses = STEPS.map((s) => s.key);
    let idx = statuses.indexOf(currentOrder.status);
    if (idx < 0) idx = 0;
    const timer = setInterval(() => {
      if (idx < statuses.length - 1) {
        idx++;
        updateOrderStatus(currentOrder.id, statuses[idx]);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [currentOrder, updateOrderStatus]);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentOrder) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 text-center" style={{ background: 'var(--bg)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          style={{
            width: 80, height: 80, borderRadius: 'var(--radius-xl)',
            background: 'var(--surface-active)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <Map size={32} color="var(--text-muted)" strokeWidth={1.5} />
        </motion.div>
        <h2 className="display-3" style={{ marginBottom: 6 }}>Faol buyurtma yo'q</h2>
        <p className="body" style={{ marginBottom: 24, color: 'var(--text-muted)' }}>Buyurtma berishni boshlang</p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/')}
          style={{
            padding: '12px 32px', borderRadius: 'var(--radius-button)',
            background: 'var(--primary)', color: '#fff', border: 'none',
            fontSize: 15, fontWeight: 600, cursor: 'pointer',
            boxShadow: 'var(--shadow-primary)',
          }}
        >
          Menyu
        </motion.button>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.key === currentOrder.status);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const etaMins = 25 + currentIdx * 2;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-24" style={{ background: 'var(--bg)' }}>
      <div style={{ padding: '16px 16px 0' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              style={{
                width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                background: 'var(--surface)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={18} color="var(--text)" />
            </motion.button>
            <div>
              <h1 className="heading" style={{ fontSize: 16, lineHeight: 1.3 }}>
                Buyurtma #{String(currentOrder.id).slice(-4)}
              </h1>
              <motion.div
                className="flex items-center gap-1.5"
                style={{ marginTop: 2 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--success)', display: 'inline-block',
                  }}
                />
                <span style={{ color: 'var(--success)', fontSize: 12, fontWeight: 500 }}>Jonli kuzatish</span>
              </motion.div>
            </div>
          </div>
          <motion.div
            className="flex items-center gap-1.5"
            style={{ color: 'var(--text-muted)', fontSize: 13 }}
            animate={{ opacity: 1 }}
          >
            <Clock size={14} />
            <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500, color: 'var(--text)' }}>
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{
            height: 180, marginBottom: 16, borderRadius: 'var(--radius-card)',
            background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden', border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px',
            }}
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            style={{
              zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            }}
          >
            <div
              style={{
                width: 52, height: 52, borderRadius: 'var(--radius-full)',
                background: 'rgba(249,115,22,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid rgba(249,115,22,0.15)',
              }}
            >
              <MapPin size={26} color="var(--primary)" />
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>Xarita tez orada</span>
          </motion.div>
        </motion.div>

        {currentIdx < STEPS.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ marginBottom: 16 }}
          >
            <Card variant="default" padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4, fontWeight: 500 }}>Taxminiy yetib kelish</p>
                  <p style={{ color: 'var(--text)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>
                    {etaMins} daqiqa
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: 52, height: 52, borderRadius: 'var(--radius)',
                    background: 'var(--primary-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Timer size={26} color="var(--primary)" />
                </motion.div>
              </div>
              <div
                style={{
                  marginTop: 12, height: 4, borderRadius: 2,
                  background: 'var(--surface-active)', overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${(currentIdx / (STEPS.length - 1)) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{
                    height: '100%', borderRadius: 2,
                    background: 'linear-gradient(90deg, var(--primary), var(--success))',
                  }}
                />
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ marginBottom: 16 }}
        >
          <Card variant="default" padding="lg">
            <div className="flex items-center gap-2 mb-6">
              <MapPin size={16} color="var(--primary)" />
              <h3 className="subheading" style={{ marginBottom: 0 }}>Buyurtma holati</h3>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                {STEPS.map((s, i) => {
                  const completed = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  return (
                    <div key={s.key} className="flex flex-col items-center">
                      <motion.div
                        initial={false}
                        animate={{
                          width: isCurrent ? 36 : 28,
                          height: isCurrent ? 36 : 28,
                          background: completed ? s.color : 'var(--surface)',
                          border: `2.5px solid ${completed ? s.color : 'var(--border)'}`,
                          borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: isCurrent
                            ? `0 0 0 6px rgba(${s.key === 'pending' ? '245,158,11' : s.key === 'preparing' ? '59,130,246' : s.key === 'ready' ? '34,197,94' : s.key === 'onTheWay' ? '139,92,246' : s.key === 'courierArrived' ? '249,115,22' : '34,197,94'},0.15)`
                            : completed
                            ? '0 0 0 3px rgba(255,255,255,0.5)'
                            : 'none',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <s.icon size={isCurrent ? 16 : 13} color={completed ? '#fff' : 'var(--text-dim)'} strokeWidth={2.5} />
                      </motion.div>
                      {i < STEPS.length - 1 && (
                        <div
                          style={{
                            width: 2.5, height: 36,
                            background: i < currentIdx ? s.color : 'var(--border)',
                            borderRadius: 2, margin: '4px 0',
                            transition: 'background 0.4s var(--ease)',
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col justify-between" style={{ flex: 1, padding: '2px 0' }}>
                {STEPS.map((s, i) => {
                  const completed = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  return (
                    <div key={s.key} style={{ minHeight: 36, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div className="flex items-center justify-between">
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: isCurrent ? 600 : completed ? 500 : 400,
                            color: isCurrent ? s.color : completed ? 'var(--text)' : 'var(--text-dim)',
                            transition: 'all 0.3s var(--ease)',
                          }}
                        >
                          {s.label}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                          {getStepTime(currentOrder, s.key)}
                        </span>
                      </div>
                      {isCurrent && (
                        <motion.span
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}
                        >
                          {getStatusLabel(currentOrder.status)}
                        </motion.span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>

        {currentIdx >= 2 && currentIdx < STEPS.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ marginBottom: 16 }}
          >
            <Card variant="default" padding="md">
              <div className="flex items-center gap-2 mb-4">
                <User size={16} color="var(--primary)" />
                <h3 className="subheading" style={{ marginBottom: 0 }}>Kuryer</h3>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name="Akbar" size="lg" />
                  <div>
                    <div style={{ color: 'var(--text)', fontSize: 15, fontWeight: 600 }}>Akbar</div>
                    <div className="flex items-center gap-1.5" style={{ marginTop: 2 }}>
                      <Badge variant="success" size="xs" dot dotColor="var(--success)">Kuryer</Badge>
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>4.8</span>
                    </div>
                  </div>
                </div>
                <motion.a
                  whileTap={{ scale: 0.9 }}
                  href="tel:+998901112233"
                  style={{
                    width: 48, height: 48, borderRadius: 'var(--radius-full)',
                    background: 'var(--success-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', flexShrink: 0,
                    border: '1px solid rgba(34,197,94,0.15)',
                  }}
                >
                  <Phone size={22} color="var(--success)" />
                </motion.a>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{ marginBottom: 16 }}
        >
          <Card variant="default" padding="md">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={16} color="var(--primary)" />
              <h3 className="subheading" style={{ marginBottom: 0 }}>Buyurtma tarkibi</h3>
            </div>
            <div className="space-y-3">
              {currentOrder.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between"
                  style={{
                    padding: '8px 0',
                    borderBottom: i < currentOrder.items.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
                    <div
                      style={{
                        width: 44, height: 44, borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden', background: 'var(--surface-active)',
                        flexShrink: 0,
                      }}
                    >
                      <img src={item.food.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 500, display: 'block' }}>{item.food.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>x{item.quantity}</span>
                    </div>
                  </div>
                  <span className="price-sm">{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />
            <div className="flex justify-between items-baseline">
              <span style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>Jami</span>
              <span className="price-lg" style={{ fontSize: 20, color: 'var(--primary)' }}>
                {currentOrder.total.toLocaleString()} so'm
              </span>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
