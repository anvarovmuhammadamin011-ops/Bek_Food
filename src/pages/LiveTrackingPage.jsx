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
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center', background: 'var(--bg-primary)' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
        }}>
          <Navigation size={32} color="var(--text-secondary)" />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>No Active Order</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>Place an order to track it here</p>
        <button onClick={() => navigate('/')} style={{
          padding: '12px 32px', borderRadius: 'var(--radius-md)',
          background: 'var(--color-primary)', color: 'white', border: 'none',
          fontSize: '14px', fontWeight: 700, cursor: 'pointer',
          boxShadow: 'var(--shadow-primary)', fontFamily: 'var(--font-family)',
        }}>Order Now</button>
      </div>
    );
  }

  const currentStep = statusSteps.findIndex(s => s.key === currentOrder.status);
  const driver = currentOrder.driver;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide" style={{ paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30, padding: '12px 16px',
        background: 'rgba(255, 248, 241, 0.88)', backdropFilter: 'blur(30px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate(-1)} style={{
            width: '38px', height: '38px', borderRadius: '12px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-primary)', boxShadow: 'var(--shadow-sm)',
          }}>
            <ChevronLeft size={20} />
          </button>
          <h1 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Order #{String(currentOrder.id).slice(-4)}
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Map placeholder */}
        <div style={{
          position: 'relative', height: '224px', background: 'var(--bg-card)',
          borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-danger-light) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ textAlign: 'center' }}>
              <Navigation size={40} color="var(--color-primary)" style={{ margin: '0 auto 8px', animation: 'float 2s ease-in-out infinite' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Live tracking map</p>
            </div>
          </div>
          <div style={{
            position: 'absolute', top: '12px', left: '12px', padding: '8px 12px',
            borderRadius: '12px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
              ETA: <span style={{ color: 'var(--color-primary)' }}>{eta} min</span>
            </p>
          </div>
        </div>

        {/* Status Timeline */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: '16px', padding: '20px',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Order Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {statusSteps.map((step, i) => {
              const isCompleted = i <= currentStep;
              const isCurrent = i === currentStep;
              const Icon = step.icon;
              return (
                <div key={step.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      background: isCompleted ? (isCurrent ? 'var(--color-primary)' : 'var(--color-primary-light)') : 'var(--bg-secondary)',
                      border: isCompleted ? 'none' : '1px solid var(--border)',
                      boxShadow: isCurrent ? '0 0 0 4px var(--color-primary-glow)' : 'none',
                    }}>
                      <Icon size={14} color={isCompleted ? 'white' : 'var(--text-muted)'} />
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div style={{
                        width: '2px', height: '32px', margin: '4px 0',
                        background: isCompleted ? 'var(--color-primary)' : 'var(--border)',
                        transition: 'all 0.3s ease',
                      }} />
                    )}
                  </div>
                  <div style={{ paddingTop: '6px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: isCompleted ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {step.label}
                    </p>
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{step.time}</p>
                  </div>
                  {isCurrent && (
                    <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 600, color: 'var(--color-primary)', animation: 'pulse 2s ease-in-out infinite' }}>
                      Current
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Driver Info */}
        {driver && currentOrder.status !== 'delivered' && (
          <div style={{
            background: 'var(--bg-card)', borderRadius: '16px', padding: '16px',
            border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)',
            animation: 'slideUp 0.4s ease-out',
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Your Driver</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src={driver.photo} alt={driver.name} style={{
                width: '48px', height: '48px', borderRadius: '50%',
                border: '2px solid var(--color-primary-border)', objectFit: 'cover',
              }} />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>{driver.name}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                  {driver.vehicleType} • <span style={{ color: 'var(--color-warning)' }}>{driver.rating}</span>
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: 'var(--color-success-light)', color: 'var(--color-success)',
                  border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}>
                  <Phone size={16} />
                </button>
                <button style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: 'var(--color-primary-light)', color: 'var(--color-primary)',
                  border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}>
                  <MessageCircle size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: '16px', padding: '16px',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentOrder.items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{item.quantity}x {item.food.name}</span>
                <span style={{ color: 'var(--text-primary)' }}>{(item.price * item.quantity).toLocaleString()} so'm</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '14px' }}>
              <span style={{ color: 'var(--text-primary)' }}>Total</span>
              <span style={{ color: 'var(--color-primary)' }}>{currentOrder.total.toLocaleString()} so'm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
