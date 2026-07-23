import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageCircle, ChevronLeft, Navigation, ChefHat, Flame, Package, Car, CheckCircle } from 'lucide-react';
import useStore from '../store/useStore';

const statusSteps = [
  { key: 'preparing', label: 'Preparing', icon: ChefHat, time: '5 min' },
  { key: 'cooking', label: 'Cooking', icon: Flame, time: '10 min' },
  { key: 'pickedUp', label: 'Picked Up', icon: Package, time: '15 min' },
  { key: 'onTheWay', label: 'On the Way', icon: Car, time: '20 min' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle, time: '25 min' },
];

export default function LiveTrackingPage() {
  const navigate = useNavigate();
  const { currentOrder, updateOrderStatus } = useStore();
  const [eta, setEta] = useState(25);

  useEffect(() => {
    if (!currentOrder) return;
    const statuses = ['preparing', 'cooking', 'pickedUp', 'onTheWay', 'delivered'];
    let idx = statuses.indexOf(currentOrder.status);
    if (idx < 0) idx = 0;
    const timer = setInterval(() => {
      if (idx < statuses.length - 1) {
        idx++;
        updateOrderStatus(currentOrder.id, statuses[idx]);
        setEta(Math.max(0, 25 - idx * 5));
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [currentOrder]);

  if (!currentOrder) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 text-center">
        <div className="w-20 h-20 rounded-full bg-bg-card border border-border flex items-center justify-center mb-4">
          <Navigation size={32} className="text-text-secondary" />
        </div>
        <h2 className="text-xl font-bold mb-2">No Active Order</h2>
        <p className="text-text-secondary text-sm mb-6">Place an order to track it here</p>
        <button onClick={() => navigate('/')} className="btn-primary">Order Now</button>
      </div>
    );
  }

  const currentStep = statusSteps.findIndex(s => s.key === currentOrder.status);
  const driver = currentOrder.driver;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-20">
      <div className="p-4 glass-strong sticky top-0 z-30">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl bg-bg-card active:scale-95 transition-transform">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">Order #{String(currentOrder.id).slice(-4)}</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Map placeholder */}
        <div className="relative h-56 bg-bg-card rounded-2xl border border-border overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/5 to-accent-red/5 flex items-center justify-center">
            <div className="text-center">
              <Navigation size={40} className="text-accent-orange mx-auto mb-2 animate-bounce" />
              <p className="text-text-secondary text-xs">Live tracking map</p>
            </div>
          </div>
          <div className="absolute top-3 left-3 px-3 py-2 glass rounded-xl">
            <p className="text-xs font-semibold">ETA: <span className="text-accent-orange">{eta} min</span></p>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-bg-card rounded-2xl p-5 border border-border">
          <h3 className="text-sm font-semibold mb-4">Order Status</h3>
          <div className="space-y-0">
            {statusSteps.map((step, i) => {
              const isCompleted = i <= currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={step.key} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${isCompleted ? (isCurrent ? 'bg-accent-orange animate-pulse-glow' : 'bg-accent-orange/20') : 'bg-bg-primary border border-border'}`}>
                      <step.icon size={14} className={isCompleted ? 'text-white' : 'text-text-muted'} />
                    </div>
                    {i < statusSteps.length - 1 && <div className={`w-0.5 h-8 my-1 transition-all ${isCompleted ? 'bg-accent-orange' : 'bg-border'}`} />}
                  </div>
                  <div className="pt-1.5">
                    <p className={`text-sm font-semibold ${isCompleted ? 'text-white' : 'text-text-muted'}`}>{step.label}</p>
                    <p className="text-[10px] text-text-muted">{step.time}</p>
                  </div>
                  {isCurrent && <span className="ml-auto text-xs font-medium text-accent-orange animate-pulse">Current</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Driver Info */}
        {driver && currentOrder.status !== 'delivered' && (
          <div className="bg-bg-card rounded-2xl p-4 border border-border animate-slide-up">
            <h3 className="text-sm font-semibold mb-3">Your Driver</h3>
            <div className="flex items-center gap-3">
              <img src={driver.photo} alt={driver.name} className="w-12 h-12 rounded-full border-2 border-accent-orange/30 object-cover" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{driver.name}</h4>
                <p className="text-text-secondary text-xs">{driver.vehicleType} • <span className="text-warning">{driver.rating}</span></p>
              </div>
              <div className="flex gap-2">
                <button className="p-3 rounded-xl bg-success/15 text-success active:scale-90 transition-transform">
                  <Phone size={16} />
                </button>
                <button className="p-3 rounded-xl bg-accent-orange/15 text-accent-orange active:scale-90 transition-transform">
                  <MessageCircle size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-bg-card rounded-2xl p-4 border border-border">
          <h3 className="text-sm font-semibold mb-3">Order Summary</h3>
          <div className="space-y-2">
            {currentOrder.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-text-secondary">{item.quantity}x {item.food.name}</span>
                <span>{(item.price * item.quantity).toLocaleString()} so'm</span>
              </div>
            ))}
            <div className="border-t border-border pt-2 flex justify-between font-bold text-sm">
              <span>Total</span>
              <span className="text-accent-orange">{currentOrder.total.toLocaleString()} so_m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
