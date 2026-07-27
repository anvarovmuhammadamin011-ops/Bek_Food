import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Navigation, MapPin, Phone, Clock, CheckCircle2 } from 'lucide-react';
import useStore from '../store/useStore';

const steps = [
  { key: 'pending', label: 'Qabul qilindi', icon: CheckCircle2, desc: 'Buyurtmangiz qabul qilindi' },
  { key: 'preparing', label: 'Tayyorlanmoqda', icon: Clock, desc: 'Oshpazlar tayyorlamoqda' },
  { key: 'ready', label: 'Dastavkaga chiqdi', icon: MapPin, desc: "Buyurtma jo'natildi" },
  { key: 'onTheWay', label: "Yo'lda", icon: Navigation, desc: "Kuryer yo'lda" },
  { key: 'delivered', label: 'Yetkazildi', icon: CheckCircle2, desc: 'Muvaffaqiyatli yetkazildi' },
];

export default function TrackingPage() {
  const navigate = useNavigate();
  const { currentOrder, updateOrderStatus } = useStore();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!currentOrder) return;
    const statuses = steps.map((s) => s.key);
    let idx = statuses.indexOf(currentOrder.status);
    if (idx < 0) idx = 0;
    const timer = setInterval(() => {
      if (idx < statuses.length - 1) {
        idx++;
        updateOrderStatus(currentOrder.id, statuses[idx]);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [currentOrder]);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentOrder) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 text-center">
        <div className="empty-state-icon">
          <Navigation size={24} />
        </div>
        <h2 className="display-3" style={{ marginBottom: 4 }}>Faol buyurtma yo'q</h2>
        <p className="text-muted" style={{ fontSize: 12, marginBottom: 24 }}>Buyurtma berishni boshlang</p>
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ borderRadius: 'var(--radius)' }}>Menyu</button>
      </div>
    );
  }

  const currentIdx = steps.findIndex((s) => s.key === currentOrder.status);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-20">
      <div className="p-4" style={{ paddingTop: 16 }}>
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in" style={{ marginBottom: 20 }}>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="card-interactive" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ChevronLeft size={18} color="#fff" />
            </button>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 16, fontWeight: 600 }}>Buyurtma #{String(currentOrder.id).slice(-4)}</h1>
              <div className="flex items-center gap-1 tracking-live" style={{ marginTop: 2 }}>
                <span style={{ color: '#7fbf7f', fontSize: 11, fontWeight: 500 }}>Jonli kuzatish</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2" style={{ color: '#6b6b6b', fontSize: 12 }}>
            <Clock size={14} />
            <span>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="card animate-fade-in-up" style={{ height: 160, marginBottom: 20, background: 'linear-gradient(135deg, #141414 0%, #1c1c1c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 60% 40%, rgba(229,30,30,.08) 0%, transparent 60%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,.02) 20px, rgba(255,255,255,.02) 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,.02) 20px, rgba(255,255,255,.02) 21px)' }} />
          <div className="flex flex-col items-center" style={{ gap: 8, zIndex: 1 }}>
            <div className="animate-float" style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(229,30,30,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(229,30,30,.3)' }}>
              <MapPin size={20} color="#e51e1e" />
            </div>
            <span style={{ color: '#6b6b6b', fontSize: 12 }}>Xarita tez orada</span>
          </div>
        </div>

        {/* ETA */}
        {currentIdx < 4 && (
          <div className="card animate-fade-in-up" style={{ padding: 16, marginBottom: 20, animationDelay: '.05s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: '#6b6b6b', fontSize: 11, marginBottom: 2 }}>Taxminiy yetib kelish</p>
                <p style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 20, fontWeight: 600 }}>{15 + currentIdx * 5}-{25 + currentIdx * 5} daqiqa</p>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(229,30,30,.1)', border: '2px solid rgba(229,30,30,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={22} color="#e51e1e" />
              </div>
            </div>
          </div>
        )}

        {/* Status stepper */}
        <div className="card animate-fade-in-up" style={{ padding: 20, animationDelay: '.1s' }}>
          <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500, marginBottom: 16 }}>Buyurtma holati</h3>
          <div className="flex gap-4">
            <div className="flex flex-col items-center" style={{ gap: 0 }}>
              {steps.map((step, i) => {
                const completed = i <= currentIdx;
                const isCurrent = i === currentIdx;
                const StepIcon = step.icon;
                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div className={`status-dot ${completed ? 'status-dot-active' : 'status-dot-pending'}`} style={isCurrent ? {} : completed ? { background: 'var(--red)', color: '#fff', boxShadow: '0 0 12px var(--red-glow)' } : {}}>
                      {completed ? (
                        <StepIcon size={14} color="#fff" />
                      ) : (
                        <span style={{ fontSize: 10, color: '#6b6b6b' }}>{i + 1}</span>
                      )}
                    </div>
                    {i < steps.length - 1 && <div className={`status-line ${completed && i < currentIdx ? 'status-line-active' : ''}`} style={{ height: 32 }} />}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col justify-between" style={{ padding: '2px 0', flex: 1 }}>
              {steps.map((step, i) => {
                const completed = i <= currentIdx;
                const isCurrent = i === currentIdx;
                return (
                  <div key={step.key} style={{ minHeight: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ color: isCurrent ? '#fff' : completed ? '#b8b8b8' : '#6b6b6b', fontSize: 13, fontWeight: isCurrent ? 600 : 400, transition: 'all .3s' }}>
                      {step.label}
                    </div>
                    <div style={{ color: '#6b6b6b', fontSize: 11, marginTop: 1 }}>{step.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Courier info */}
        {currentIdx >= 2 && currentIdx < 4 && (
          <div className="card animate-fade-in-up" style={{ padding: 16, marginTop: 16, animationDelay: '.15s' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #e51e1e, #c41a1a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: '#fff', boxShadow: '0 4px 16px rgba(229,30,30,.3)' }}>
                  A
                </div>
                <div>
                  <div style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>Akbar</div>
                  <div style={{ color: '#6b6b6b', fontSize: 11 }}>Kuryer</div>
                </div>
              </div>
              <button className="card-interactive" style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Phone size={18} color="#7fbf7f" />
              </button>
            </div>
          </div>
        )}

        {/* Order items */}
        <div className="card animate-fade-in-up" style={{ padding: 16, marginTop: 16, animationDelay: '.2s' }}>
          <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Buyurtma tarkibi</h3>
          <div className="space-y-3">
            {currentOrder.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between" style={{ padding: '8px 0', borderBottom: i < currentOrder.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div className="flex items-center gap-3">
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--surface-hover)' }}>
                    <img src={item.food.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontSize: 12, fontWeight: 500 }}>{item.food.name}</div>
                    <div style={{ color: '#6b6b6b', fontSize: 11 }}>x{item.quantity}</div>
                  </div>
                </div>
                <span className="price-sm">{(item.price * item.quantity).toLocaleString()} so'm</span>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="flex justify-between items-baseline">
            <span style={{ color: '#b8b8b8', fontSize: 13 }}>Jami</span>
            <span style={{ fontFamily: 'var(--font-display)', color: '#e51e1e', fontSize: 18, fontWeight: 600 }}>{currentOrder.total.toLocaleString()} so'm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
