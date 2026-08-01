import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Navigation, MapPin, Phone, Clock, CheckCircle2, RotateCcw, Flame } from 'lucide-react';
import GoogleMap from '../components/GoogleMap';
import FoodCard from '../components/FoodCard';
import { OrdersIllustration } from '../components/Illustrations';
import useStore from '../store/useStore';

const steps = [
  { key: 'pending', label: 'Qabul qilindi', icon: CheckCircle2, desc: 'Buyurtmangiz qabul qilindi' },
  { key: 'preparing', label: 'Tayyorlanmoqda', icon: Clock, desc: 'Oshpazlar tayyorlamoqda' },
  { key: 'ready', label: "Dastavkaga chiqdi", icon: MapPin, desc: "Buyurtma jo'natildi" },
  { key: 'onTheWay', label: "Yo'lda", icon: Navigation, desc: "Kuryer yo'lda" },
  { key: 'delivered', label: 'Yetkazildi', icon: CheckCircle2, desc: 'Muvaffaqiyatli yetkazildi' },
];

export default function TrackingPage() {
  const navigate = useNavigate();
  const { currentOrder, updateOrderStatus, orders, foods, addToCart } = useStore();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!currentOrder) return;
    const statuses = steps.map((s) => s.key);
    let idx = statuses.indexOf(currentOrder.status);
    if (idx < 0) idx = 0;
    const timer = setInterval(() => {
      if (idx < statuses.length - 1) { idx++; updateOrderStatus(currentOrder.id, statuses[idx]); }
    }, 6000);
    return () => clearInterval(timer);
  }, [currentOrder]);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentOrder) {
    const pastOrders = orders.filter((o) => o.status === 'delivered');
    const latest = pastOrders[0];
    const popular = foods.filter((f) => f.isPopular).slice(0, 6);

    const handleReorder = () => {
      if (!latest) return;
      latest.items.forEach((item) => addToCart(item.food, item.quantity));
      navigate('/cart');
    };

    return (
      <div className="h-full overflow-y-auto scrollbar-hide pb-28">
        <div className="flex flex-col items-center text-center" style={{ padding: '40px 24px 8px' }}>
          <div className="animate-float"><OrdersIllustration size={170} /></div>
          <h2 className="display-3" style={{ marginBottom: 6 }}>Faol buyurtma yo'q</h2>
          <p className="body" style={{ maxWidth: 270, marginBottom: 20 }}>Hozircha hech narsa buyurtma qilmadingiz. Mazali yeguliklar menyuda!</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Menyuga o'tish
          </button>
        </div>

        {latest && (
          <div className="px-4" style={{ marginTop: 24 }}>
            <div className="card p-4 animate-fade-in-up">
              <div className="flex items-center" style={{ gap: 8, marginBottom: 8 }}>
                <RotateCcw size={16} color="var(--primary)" />
                <h3 className="subheading">So'nggi buyurtmangiz</h3>
              </div>
              <p className="caption" style={{ marginBottom: 12 }}>
                #{String(latest.id).slice(-4)} — {latest.items.map((i) => `${i.food.name} x${i.quantity}`).join(', ')}
              </p>
              <button onClick={handleReorder} className="btn btn-primary w-full">
                Qayta buyurtma berish — {latest.total.toLocaleString()} so'm
              </button>
            </div>
          </div>
        )}

        {popular.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div className="px-4 flex items-center justify-between" style={{ marginBottom: 12 }}>
              <div className="flex items-center" style={{ gap: 8 }}>
                <Flame size={18} color="var(--primary)" />
                <h3 className="subheading">Ommabop mahsulotlar</h3>
              </div>
              <button onClick={() => navigate('/')} className="caption" style={{ color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                Hammasi
              </button>
            </div>
            <div className="flex" style={{ gap: 12, overflowX: 'auto', scrollbarWidth: 'none', padding: '0 16px 4px' }}>
              {popular.map((f) => (
                <div key={f.id} style={{ minWidth: 150 }}>
                  <FoodCard food={f} compact />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentIdx = steps.findIndex((s) => s.key === currentOrder.status);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-20">
      <div className="p-4" style={{ paddingTop: 16 }}>
        <div className="flex items-center justify-between animate-fade-in" style={{ marginBottom: 20 }}>
          <div className="flex items-center" style={{ gap: 12 }}>
            <button onClick={() => navigate(-1)} className="card card-interactive" style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={18} color="var(--text)" />
            </button>
            <div>
              <h1 className="heading" style={{ fontSize: 16 }}>Buyurtma #{String(currentOrder.id).slice(-4)}</h1>
              <div className="flex items-center tracking-live" style={{ marginTop: 2 }}>
                <span style={{ color: 'var(--success)', fontSize: 12, fontWeight: 500 }}>Jonli kuzatish</span>
              </div>
            </div>
          </div>
          <div className="flex items-center" style={{ gap: 6, color: 'var(--text-muted)', fontSize: 13 }}>
            <Clock size={14} />
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Real Google Map */}
        <div className="card animate-fade-in-up" style={{ padding: 8, marginBottom: 20 }}>
          <GoogleMap center={{ lat: 41.3111, lng: 69.2797 }} height={170} />
        </div>

        {currentIdx < 4 && (
          <div className="card animate-fade-in-up" style={{ padding: 18, marginBottom: 16, animationDelay: '.05s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4 }}>Taxminiy yetib kelish</p>
                <p style={{ color: 'var(--text)', fontSize: 22, fontWeight: 700 }}>{15 + currentIdx * 5}-{25 + currentIdx * 5} daqiqa</p>
              </div>
              <div style={{ width: 50, height: 50, borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={24} color="var(--primary)" />
              </div>
            </div>
          </div>
        )}

        <div className="card animate-fade-in-up" style={{ padding: 20, animationDelay: '.1s' }}>
          <h3 className="subheading" style={{ marginBottom: 18 }}>Buyurtma holati</h3>
          <div className="flex" style={{ gap: 16 }}>
            <div className="flex flex-col items-center" style={{ gap: 0 }}>
              {steps.map((step, i) => {
                const completed = i <= currentIdx;
                const isCurrent = i === currentIdx;
                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div className={`status-dot ${completed ? 'status-dot-active' : 'status-dot-pending'}`}
                      style={completed ? {
                        background: isCurrent ? 'var(--primary)' : 'var(--success)',
                        boxShadow: isCurrent ? '0 0 8px rgba(249,115,22,.4)' : '0 0 8px rgba(34,197,94,.3)',
                      } : {}}>
                    </div>
                    {i < steps.length - 1 && <div style={{ height: 32, width: 2, background: i < currentIdx ? 'var(--primary)' : 'var(--border)', borderRadius: 1, transition: 'background .3s' }} />}
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
                    <div style={{ color: isCurrent ? 'var(--text)' : completed ? 'var(--text-secondary)' : 'var(--text-dim)', fontSize: 13, fontWeight: isCurrent ? 600 : 400, transition: 'all .3s' }}>
                      {step.label}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 1 }}>{step.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {currentIdx >= 2 && currentIdx < 4 && (
          <div className="card animate-fade-in-up" style={{ padding: 16, marginTop: 16, animationDelay: '.15s' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center" style={{ gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-full)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 600, color: 'var(--primary)' }}>A</div>
                <div>
                  <div style={{ color: 'var(--text)', fontSize: 14, fontWeight: 500 }}>Akbar</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Kuryer</div>
                </div>
              </div>
              <button className="card card-interactive" style={{ width: 48, height: 48, borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={20} color="var(--success)" />
              </button>
            </div>
          </div>
        )}

        <div className="card animate-fade-in-up" style={{ padding: 16, marginTop: 16, animationDelay: '.2s' }}>
          <h3 className="subheading" style={{ marginBottom: 14 }}>Buyurtma tarkibi</h3>
          <div className="space-y-3">
            {currentOrder.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between" style={{ padding: '8px 0', borderBottom: i < currentOrder.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div className="flex items-center" style={{ gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--surface-active)' }}>
                    <img src={item.food.image} alt="" onError={(e) => { e.currentTarget.src = '/food/placeholder.svg'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 500 }}>{item.food.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>x{item.quantity}</div>
                  </div>
                </div>
                <span className="price-sm">{(item.price * item.quantity).toLocaleString()} so'm</span>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div className="flex justify-between items-baseline">
            <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Jami</span>
            <span className="price-hero" style={{ fontSize: 20 }}>{currentOrder.total.toLocaleString()} so'm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
