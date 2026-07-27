import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Navigation } from 'lucide-react';
import useStore from '../store/useStore';

const steps = [
  { key: 'pending', label: 'Qabul qilindi', time: '14:02' },
  { key: 'preparing', label: 'Tayyorlanmoqda', time: 'hozir' },
  { key: 'ready', label: 'Dastavkaga chiqdi', time: '' },
  { key: 'onTheWay', label: "Yo'lda", time: '' },
  { key: 'delivered', label: 'Yetkazildi', time: '' },
];

export default function TrackingPage() {
  const navigate = useNavigate();
  const { currentOrder, updateOrderStatus } = useStore();

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

  if (!currentOrder) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 text-center">
        <div className="empty-state-icon">
          <Navigation size={24} />
        </div>
        <h2 style={{ color: '#fff', fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Faol buyurtma yo'q</h2>
        <p className="text-muted" style={{ fontSize: 12, marginBottom: 24 }}>Buyurtma berishni boshlang</p>
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ borderRadius: 10 }}>Menyu</button>
      </div>
    );
  }

  const currentIdx = steps.findIndex((s) => s.key === currentOrder.status);

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-20">
      <div className="p-4" style={{ paddingTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={() => navigate(-1)} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronLeft size={18} color="#fff" />
          </button>
          <h1 style={{ color: '#fff', fontSize: 15, fontWeight: 500 }}>Buyurtma #{String(currentOrder.id).slice(-4)}</h1>
        </div>

        {/* Status stepper */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            {steps.map((step, i) => {
              const completed = i <= currentIdx;
              const isCurrent = i === currentIdx;
              return (
                <div key={step.key} className="flex flex-col items-center">
                  <div className="status-dot" style={completed ? { background: '#e51e1e', color: '#fff' } : { background: '#1e1e1e', border: '1px solid #333' }}>
                    {completed ? <span style={{ fontSize: 12 }}>✓</span> : <span style={{ fontSize: 10, color: '#6b6b6b' }}>{i + 1}</span>}
                  </div>
                  {i < steps.length - 1 && <div className="status-line" style={completed ? { background: '#e51e1e' } : {}} />}
                </div>
              );
            })}
          </div>
          <div className="flex flex-col" style={{ justifyContent: 'space-between', padding: '2px 0' }}>
            {steps.map((step, i) => {
              const completed = i <= currentIdx;
              const isCurrent = i === currentIdx;
              return (
                <div key={step.key}>
                  <div style={{ color: completed ? '#fff' : '#6b6b6b', fontSize: 12, fontWeight: 500 }}>{step.label}</div>
                  {step.time && <div style={{ color: '#6b6b6b', fontSize: 10 }}>{step.time}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
