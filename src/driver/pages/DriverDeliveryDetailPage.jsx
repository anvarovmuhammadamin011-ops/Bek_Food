import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Navigation, Phone, MessageCircle, MapPin, Package, Clock,
  DollarSign, CheckCircle2, X, Send, ArrowLeft, User,
} from 'lucide-react';
import useDriverStore from '../store/useDriverStore';
import StatusBadge from '../components/StatusBadge';

const statusSteps = [
  { key: 'assigned', label: 'Assigned' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'driving_to_restaurant', label: 'To Restaurant' },
  { key: 'picked_up', label: 'Picked Up' },
  { key: 'driving_to_customer', label: 'To Customer' },
  { key: 'arrived', label: 'Arrived' },
  { key: 'delivered', label: 'Delivered' },
];

const statusActions = {
  accepted: { label: 'Start Navigation to Restaurant', icon: Navigation, next: 'driving_to_restaurant' },
  driving_to_restaurant: { label: "I've Arrived at Restaurant", icon: CheckCircle2, next: 'picked_up' },
  picked_up: { label: 'Start Navigation to Customer', icon: Navigation, next: 'driving_to_customer' },
  driving_to_customer: { label: "I've Arrived", icon: MapPin, next: 'arrived' },
};

const completionOptions = [
  { id: 'delivered', label: 'Delivered Successfully', color: 'var(--color-success)', icon: CheckCircle2 },
  { id: 'customer_not_available', label: 'Customer Not Available', color: 'var(--color-warning)', icon: Phone },
  { id: 'delivery_failed', label: 'Delivery Failed', color: 'var(--color-danger)', icon: X },
];

export default function DriverDeliveryDetailPage() {
  const navigate = useNavigate();
  const { activeDelivery, updateDeliveryStatus, completeDelivery, quickMessages, showToast } = useDriverStore();
  const [showMessages, setShowMessages] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [sentMsg, setSentMsg] = useState('');

  if (!activeDelivery) {
    return (
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center',
      }}>
        <Package size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          No Active Delivery
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Accept an order to start delivering
        </p>
        <button onClick={() => navigate('/driver/orders')}
          style={{
            padding: '12px 24px', borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary)', color: 'white', border: 'none',
            fontSize: '14px', fontWeight: 700, cursor: 'pointer',
            fontFamily: 'var(--font-family)',
          }}>
          View Orders
        </button>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(s => s.key === activeDelivery.status);
  const action = statusActions[activeDelivery.status];

  const handleAdvance = () => {
    if (activeDelivery.status === 'arrived') {
      setShowComplete(true);
    } else if (action) {
      updateDeliveryStatus(action.next);
      showToast(`Status updated to: ${action.next.replace(/_/g, ' ')}`, 'success');
    }
  };

  const handleComplete = (outcome) => {
    completeDelivery(outcome);
    setShowComplete(false);
    showToast(outcome === 'delivered' ? 'Delivery completed successfully!' : 'Delivery marked as ' + outcome, outcome === 'delivered' ? 'success' : 'info');
    setTimeout(() => navigate('/driver/dashboard'), 1000);
  };

  const handleSendMessage = (msg) => {
    setSentMsg(msg);
    setShowMessages(false);
    showToast(`Message sent: "${msg}"`, 'success');
    setTimeout(() => setSentMsg(''), 3000);
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: '100px', scrollbarWidth: 'none' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 30, padding: '12px 16px',
        background: 'rgba(255, 248, 241, 0.88)', backdropFilter: 'blur(30px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate(-1)}
            style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-primary)', boxShadow: 'var(--shadow-sm)',
            }}>
            <ArrowLeft size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>{activeDelivery.orderNumber}</h1>
            <StatusBadge status={activeDelivery.status} size="md" />
          </div>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Map Preview */}
        <div className="map-preview" style={{ marginBottom: '16px' }}>
          <div className="road-h" />
          <div className="road-v" />
          <div className="road-v2" />
          <div className="route-line" />
          <div className="map-pin restaurant"><span>🏪</span></div>
          <div className="map-pin customer"><span>📍</span></div>
          <div className="map-pin driver"><span>🛵</span></div>
          {/* Labels */}
          <div style={{
            position: 'absolute', top: '8px', left: '8px',
            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
            borderRadius: '8px', padding: '6px 10px', fontSize: '10px',
            fontWeight: 600, color: 'var(--text-primary)', boxShadow: 'var(--shadow-sm)',
          }}>
            🗺 Delivery Route
          </div>
          <div style={{
            position: 'absolute', bottom: '8px', left: '8px',
            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
            borderRadius: '8px', padding: '6px 10px', fontSize: '10px',
            fontWeight: 600, color: 'var(--text-primary)', boxShadow: 'var(--shadow-sm)',
          }}>
            📍 {activeDelivery.distance} km • {activeDelivery.estimatedTime}
          </div>
          <button style={{
            position: 'absolute', bottom: '8px', right: '8px',
            background: 'var(--color-primary)', color: 'white', border: 'none',
            borderRadius: '10px', padding: '8px 14px', fontSize: '11px',
            fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center',
            gap: '4px', boxShadow: '0 4px 16px rgba(232, 89, 12, 0.3)',
            fontFamily: 'var(--font-family)',
          }}>
            <Navigation size={12} /> Open Maps
          </button>
        </div>

        {/* Status Progress */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
          padding: '16px', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)', marginBottom: '14px',
        }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Delivery Progress</h3>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
            {statusSteps.map((step, i) => (
              <div key={step.key} style={{
                flex: 1, height: '4px', borderRadius: '2px',
                background: i <= currentStepIndex ? 'var(--color-primary)' : 'var(--border)',
                transition: 'background 0.3s ease',
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)' }}>
            <span style={{ color: currentStepIndex >= 0 ? 'var(--color-primary)' : 'inherit', fontWeight: currentStepIndex >= 0 ? 700 : 400 }}>Assigned</span>
            <span style={{ color: currentStepIndex >= 5 ? 'var(--color-primary)' : 'inherit', fontWeight: currentStepIndex >= 5 ? 700 : 400 }}>Arrived</span>
            <span style={{ color: currentStepIndex >= 6 ? 'var(--color-success)' : 'inherit', fontWeight: currentStepIndex >= 6 ? 700 : 400 }}>Done</span>
          </div>
        </div>

        {/* Customer Info */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
          padding: '16px', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)', marginBottom: '14px',
        }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Customer</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'var(--color-primary-light)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <User size={20} color="var(--color-primary)" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{activeDelivery.customer.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '1px' }}>{activeDelivery.customer.phone}</div>
            </div>
          </div>
          <div style={{
            padding: '10px', borderRadius: '10px', background: 'var(--bg-secondary)',
            fontSize: '12px', color: 'var(--text-secondary)', display: 'flex',
            alignItems: 'flex-start', gap: '6px',
          }}>
            <MapPin size={12} color="var(--color-primary)" style={{ marginTop: '1px', flexShrink: 0 }} />
            {activeDelivery.customer.address}
          </div>

          {/* Contact Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
            <button style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '10px', borderRadius: '12px', border: '1.5px solid var(--border)',
              background: 'var(--bg-secondary)', fontSize: '12px', fontWeight: 600,
              color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-family)',
              transition: 'all 0.2s ease',
            }}>
              <Phone size={14} /> Call
            </button>
            <button onClick={() => setShowMessages(!showMessages)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                padding: '10px', borderRadius: '12px', border: '1.5px solid var(--border)',
                background: 'var(--bg-secondary)', fontSize: '12px', fontWeight: 600,
                color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'var(--font-family)',
                transition: 'all 0.2s ease',
              }}>
              <MessageCircle size={14} /> Message
            </button>
          </div>

          {/* Quick Messages */}
          {showMessages && (
            <div style={{ marginTop: '12px', animation: 'slideUp 0.2s ease-out' }}>
              <div className="quick-messages">
                {quickMessages.map((msg) => (
                  <button key={msg} className="chip" onClick={() => handleSendMessage(msg)}>
                    {msg}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sent message toast */}
          {sentMsg && (
            <div style={{
              marginTop: '10px', padding: '10px 14px', borderRadius: '10px',
              background: 'var(--color-success-light)', fontSize: '12px',
              fontWeight: 600, color: 'var(--color-success)',
              display: 'flex', alignItems: 'center', gap: '6px',
              animation: 'slideUp 0.2s ease-out',
            }}>
              <Send size={12} /> Sent: "{sentMsg}"
            </div>
          )}
        </div>

        {/* Restaurant Info */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
          padding: '16px', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)', marginBottom: '14px',
        }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Restaurant</h3>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}>{activeDelivery.restaurant.name}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{activeDelivery.restaurant.address}</div>
          {activeDelivery.restaurant.phone && (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Phone size={11} /> {activeDelivery.restaurant.phone}
            </div>
          )}
        </div>

        {/* Order Details */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
          padding: '16px', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)', marginBottom: '14px',
        }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>Order Items</h3>
          {activeDelivery.items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', fontSize: '13px',
              padding: '8px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                {item.name} <span style={{ color: 'var(--text-muted)' }}>x{item.quantity}</span>
              </span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {(item.price * item.quantity).toLocaleString()} so'm
              </span>
            </div>
          ))}
          <div style={{
            borderTop: '1px solid var(--border)', marginTop: '8px', paddingTop: '8px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Payment: {activeDelivery.paymentMethod}</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-primary)' }}>
              {activeDelivery.total.toLocaleString()} so'm
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Your fee</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-success)' }}>
              +{activeDelivery.deliveryFee.toLocaleString()} so'm
            </span>
          </div>
        </div>

        {/* Customer Notes */}
        {activeDelivery.notes && (
          <div style={{
            background: 'var(--color-warning-light)', borderRadius: 'var(--radius-lg)',
            padding: '14px', border: '1px solid rgba(230, 119, 0, 0.15)',
            marginBottom: '14px',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-warning)', marginBottom: '4px' }}>Customer Note</div>
            <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontStyle: 'italic' }}>"{activeDelivery.notes}"</div>
          </div>
        )}
      </div>

      {/* Sticky Action Button */}
      {activeDelivery.status !== 'delivered' && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          padding: '0 12px', paddingBottom: 'env(safe-area-inset-bottom, 12px)',
        }}>
          <div style={{
            maxWidth: '480px', margin: '0 auto', borderRadius: 'var(--radius-xl)',
            background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(24px)',
            border: '1px solid var(--border)', boxShadow: '0 -4px 32px rgba(45, 42, 38, 0.12)',
            padding: '12px',
          }}>
            <button onClick={handleAdvance}
              style={{
                width: '100%', padding: '16px', borderRadius: 'var(--radius-lg)',
                background: activeDelivery.status === 'arrived' ? 'var(--color-success)' : 'var(--color-primary)',
                color: 'white', border: 'none', fontSize: '15px', fontWeight: 800,
                cursor: 'pointer', fontFamily: 'var(--font-family)',
                boxShadow: 'var(--shadow-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.25s ease',
              }}>
              {action ? (
                <>
                  <action.icon size={18} />
                  {action.label}
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Confirm Delivery
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Completion Dialog */}
      {showComplete && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            width: '100%', maxWidth: '360px', background: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)', padding: '24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            <h3 style={{
              fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)',
              textAlign: 'center', marginBottom: '16px',
            }}>
              Complete Delivery
            </h3>
            <p style={{
              fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center',
              marginBottom: '20px',
            }}>
              How was this delivery?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {completionOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button key={opt.id} onClick={() => handleComplete(opt.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '14px',
                      borderRadius: '12px', border: `1.5px solid ${opt.color}20`,
                      background: `${opt.color}08`, cursor: 'pointer',
                      transition: 'all 0.2s ease', fontFamily: 'var(--font-family)',
                      textAlign: 'left',
                    }}>
                    <Icon size={20} color={opt.color} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{opt.label}</span>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setShowComplete(false)}
              style={{
                width: '100%', marginTop: '12px', padding: '12px',
                borderRadius: '12px', border: '1px solid var(--border)',
                background: 'var(--bg-secondary)', fontSize: '13px',
                fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer',
                fontFamily: 'var(--font-family)',
              }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
