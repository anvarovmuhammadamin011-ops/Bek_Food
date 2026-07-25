import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Clock, CreditCard, Wallet, Smartphone, Check, ChevronLeft,
  Banknote, Navigation, Plus, X, Package, Truck, Store, ChevronDown,
  CheckCircle2, Copy, Home as HomeIcon, Building2, Map,
} from 'lucide-react';
import useStore from '../store/useStore';

/* ═══════════════════════════════════════════
   PAYMENT METHOD DEFINITIONS
   ═══════════════════════════════════════════ */
const paymentMethods = [
  { id: 'cash', name: 'Cash', icon: Banknote, color: '#2B8A3E', description: 'Pay on delivery' },
  { id: 'uzcard', name: 'UzCard', icon: CreditCard, color: '#1565C0', description: 'Uzbekistan card' },
  { id: 'humo', name: 'Humo', icon: CreditCard, color: '#6A1B9A', description: 'Humo card' },
  { id: 'online', name: 'Online Pay', icon: Smartphone, color: '#E8590C', description: 'Click, Payme, etc.' },
];

/* ═══════════════════════════════════════════
   DELIVERY TYPE CARD
   ═══════════════════════════════════════════ */
function DeliveryTypeSelector({ deliveryType, onChange }) {
  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px',
          background: 'var(--color-primary-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Package size={14} color="var(--color-primary)" />
        </div>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Delivery Type</h3>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {[
          { id: 'delivery', icon: Truck, label: 'Delivery', desc: 'To your address' },
          { id: 'pickup', icon: Store, label: 'Pickup', desc: 'From restaurant' },
        ].map(type => {
          const active = deliveryType === type.id;
          const Icon = type.icon;
          return (
            <button key={type.id} onClick={() => onChange(type.id)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                padding: '16px 12px', borderRadius: '14px', border: '1.5px solid',
                borderColor: active ? 'var(--color-primary-border)' : 'var(--border)',
                background: active ? 'var(--color-primary-light)' : 'var(--bg-secondary)',
                cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: 'var(--font-family)',
                transform: active ? 'scale(1.02)' : 'none',
              }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '14px',
                background: active ? 'var(--color-primary)' : 'var(--bg-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: active ? 'var(--shadow-primary)' : 'var(--shadow-sm)',
                transition: 'all 0.25s ease',
              }}>
                <Icon size={20} color={active ? 'white' : 'var(--text-secondary)'} />
              </div>
              <span style={{
                fontSize: '13px', fontWeight: 700,
                color: active ? 'var(--color-primary)' : 'var(--text-primary)',
              }}>{type.label}</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{type.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DELIVERY ADDRESS SECTION
   ═══════════════════════════════════════════ */
function DeliveryAddressSection({ addresses, selectedAddressId, onSelect, onAddNew, deliveryLocation }) {
  const [showMap, setShowMap] = useState(false);

  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px',
          background: 'var(--color-primary-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MapPin size={14} color="var(--color-primary)" />
        </div>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>Delivery Address</h3>
        <button
          onClick={() => setShowMap(!showMap)}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '6px 12px', borderRadius: 'var(--radius-full)',
            background: 'var(--color-primary-light)', border: 'none',
            color: 'var(--color-primary)', fontSize: '11px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font-family)', transition: 'all 0.2s ease',
          }}
        >
          <Map size={12} /> Map
        </button>
      </div>

      {/* Saved addresses */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: addresses.length > 0 ? '12px' : 0 }}>
        {addresses.map(addr => {
          const active = selectedAddressId === addr.id;
          return (
            <button key={addr.id} onClick={() => onSelect(addr.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px', borderRadius: '12px', border: '1.5px solid',
                borderColor: active ? 'var(--color-primary-border)' : 'var(--border)',
                background: active ? 'var(--color-primary-light)' : 'var(--bg-secondary)',
                textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease',
                fontFamily: 'var(--font-family)',
              }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: active ? 'var(--color-primary)' : 'var(--bg-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)', flexShrink: 0,
              }}>
                {addr.label === 'Home' ? (
                  <HomeIcon size={16} color={active ? 'white' : 'var(--text-secondary)'} />
                ) : (
                  <Building2 size={16} color={active ? 'white' : 'var(--text-secondary)'} />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: active ? 'var(--color-primary)' : 'var(--text-primary)' }}>
                    {addr.label}
                  </span>
                  {addr.isDefault && (
                    <span style={{
                      fontSize: '9px', fontWeight: 600, color: 'var(--color-success)',
                      background: 'var(--color-success-light)',
                      padding: '2px 6px', borderRadius: 'var(--radius-full)',
                    }}>
                      Default
                    </span>
                  )}
                </div>
                <p style={{
                  fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {addr.fullAddress}
                </p>
              </div>
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%',
                border: `2px solid ${active ? 'var(--color-primary)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {active && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }} />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Mini Map Preview */}
      {showMap && (
        <div style={{
          borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)',
          height: '160px', background: 'var(--bg-secondary)', position: 'relative',
          animation: 'slideUp 0.3s ease-out', marginBottom: '12px',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              linear-gradient(45deg, #e8e0d8 25%, transparent 25%),
              linear-gradient(-45deg, #e8e0d8 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #e8e0d8 75%),
              linear-gradient(-45deg, transparent 75%, #e8e0d8 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            opacity: 0.5,
          }} />
          {/* Simulated map with pin */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #d4e6c3 0%, #c8dfb5 30%, #e8e0d8 60%, #d5cfc7 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Road lines */}
            <div style={{
              position: 'absolute', top: '50%', left: 0, right: 0,
              height: '2px', background: 'rgba(255,255,255,0.6)',
            }} />
            <div style={{
              position: 'absolute', left: '40%', top: 0, bottom: 0,
              width: '2px', background: 'rgba(255,255,255,0.6)',
            }} />
            {/* Pin */}
            <div style={{
              width: '36px', height: '36px', borderRadius: '50% 50% 50% 0',
              background: 'var(--color-primary)',
              transform: 'rotate(-45deg)',
              boxShadow: '0 4px 12px rgba(232, 89, 12, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'float 3s ease-in-out infinite',
            }}>
              <MapPin size={16} color="white" style={{ transform: 'rotate(45deg)' }} />
            </div>
          </div>
          <div style={{
            position: 'absolute', bottom: '8px', left: '8px',
            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
            borderRadius: '8px', padding: '6px 10px',
            fontSize: '10px', fontWeight: 600, color: 'var(--text-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            📍 Delivery location preview
          </div>
        </div>
      )}

      {/* Address details fields */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        <input placeholder="Apartment" style={{
          background: 'var(--bg-secondary)', border: '1.5px solid var(--border)',
          borderRadius: '10px', padding: '10px 12px', fontSize: '12px',
          color: 'var(--text-primary)', fontFamily: 'var(--font-family)',
          transition: 'all 0.2s ease', outline: 'none',
        }} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }} />
        <input placeholder="Floor" style={{
          background: 'var(--bg-secondary)', border: '1.5px solid var(--border)',
          borderRadius: '10px', padding: '10px 12px', fontSize: '12px',
          color: 'var(--text-primary)', fontFamily: 'var(--font-family)',
          transition: 'all 0.2s ease', outline: 'none',
        }} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }} />
        <input placeholder="Entrance" style={{
          background: 'var(--bg-secondary)', border: '1.5px solid var(--border)',
          borderRadius: '10px', padding: '10px 12px', fontSize: '12px',
          color: 'var(--text-primary)', fontFamily: 'var(--font-family)',
          transition: 'all 0.2s ease', outline: 'none',
        }} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }} />
        <input placeholder="Door number" style={{
          background: 'var(--bg-secondary)', border: '1.5px solid var(--border)',
          borderRadius: '10px', padding: '10px 12px', fontSize: '12px',
          color: 'var(--text-primary)', fontFamily: 'var(--font-family)',
          transition: 'all 0.2s ease', outline: 'none',
        }} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }} onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }} />
      </div>

      {/* Add new address button */}
      <button
        onClick={onAddNew}
        style={{
          width: '100%', padding: '10px',
          borderRadius: '12px', border: '1.5px dashed var(--border)',
          background: 'transparent', color: 'var(--text-secondary)',
          fontSize: '12px', fontWeight: 600, cursor: 'pointer',
          fontFamily: 'var(--font-family)', transition: 'all 0.2s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        }}
      >
        <Plus size={14} /> Add New Address
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PAYMENT METHOD SELECTOR
   ═══════════════════════════════════════════ */
function PaymentMethodSelector({ selected, onSelect }) {
  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px',
          background: 'var(--color-primary-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Wallet size={14} color="var(--color-primary)" />
        </div>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Payment Method</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {paymentMethods.map(method => {
          const active = selected === method.id;
          const Icon = method.icon;
          return (
            <button key={method.id} onClick={() => onSelect(method.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px', borderRadius: '14px', border: '1.5px solid',
                borderColor: active ? 'var(--color-primary-border)' : 'var(--border)',
                background: active ? 'var(--color-primary-light)' : 'var(--bg-secondary)',
                cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: 'var(--font-family)',
                transform: active ? 'scale(1.01)' : 'none',
              }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: active ? method.color : 'var(--bg-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: active ? `0 4px 16px ${method.color}30` : 'var(--shadow-sm)',
                transition: 'all 0.25s ease', flexShrink: 0,
              }}>
                <Icon size={20} color={active ? 'white' : 'var(--text-secondary)'} />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <span style={{
                  fontSize: '13px', fontWeight: 700,
                  color: active ? 'var(--color-primary)' : 'var(--text-primary)',
                }}>{method.name}</span>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>{method.description}</p>
              </div>
              <div style={{
                width: '20px', height: '20px', borderRadius: '50%',
                border: `2px solid ${active ? 'var(--color-primary)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}>
                {active && (
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: 'var(--color-primary)',
                    animation: 'scaleIn 0.2s ease-out',
                  }} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ORDER CONFIRMATION SCREEN
   ═══════════════════════════════════════════ */
function OrderConfirmation({ order, onTrack, onMenu }) {
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '32px',
      textAlign: 'center', background: 'var(--bg-primary)',
      animation: 'fadeIn 0.4s ease-out',
    }}>
      {/* Success Icon */}
      <div style={{
        width: '100px', height: '100px', borderRadius: '50%',
        background: 'var(--color-success-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '24px', position: 'relative',
        animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <CheckCircle2 size={52} color="var(--color-success)" strokeWidth={2} />
      </div>

      {/* Title */}
      <h2 style={{
        fontSize: '24px', fontWeight: 900, color: 'var(--text-primary)',
        letterSpacing: '-0.02em', marginBottom: '8px',
      }}>
        Order Confirmed!
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px', maxWidth: '280px', lineHeight: 1.5 }}>
        Your order is being prepared and will be delivered soon
      </p>

      {/* Order Details Card */}
      <div style={{
        width: '100%', maxWidth: '360px',
        background: 'var(--bg-card)', borderRadius: '20px',
        padding: '20px', border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)', marginBottom: '24px',
        animation: 'slideUp 0.4s ease-out',
        animationDelay: '0.15s',
        animationFillMode: 'both',
      }}>
        {/* Order Number */}
        <div style={{
          textAlign: 'center', paddingBottom: '16px',
          borderBottom: '1px solid var(--border)', marginBottom: '16px',
        }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>Order Number</p>
          <p style={{ fontSize: '20px', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '0.05em' }}>
            #{String(order.id).slice(-6)}
          </p>
        </div>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Delivery Time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'var(--color-primary-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Clock size={16} color="var(--color-primary)" />
            </div>
            <div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Estimated Delivery</p>
              <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{order.estimatedDelivery || '25-35 min'}</p>
            </div>
          </div>

          {/* Delivery Address */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'var(--color-success-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MapPin size={16} color="var(--color-success)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Delivery Address</p>
              <p style={{
                fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {order.deliveryAddress || 'Tashkent, Uzbekistan'}
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'var(--color-warning-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Wallet size={16} color="var(--color-warning)" />
            </div>
            <div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Payment Method</p>
              <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                {order.paymentMethod || 'Cash'}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{
            background: 'var(--bg-secondary)', borderRadius: '12px',
            padding: '12px', marginTop: '4px',
          }}>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>ORDER SUMMARY</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(order.items || []).slice(0, 3).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {item.food?.name || 'Item'} x{item.quantity}
                  </span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {(item.price * item.quantity).toLocaleString()} so'm
                  </span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '6px', marginTop: '2px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 800 }}>
                  <span style={{ color: 'var(--text-primary)' }}>Total</span>
                  <span style={{ color: 'var(--color-primary)' }}>{(order.total || 0).toLocaleString()} so'm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={onTrack}
          style={{
            width: '100%', padding: '16px', borderRadius: '16px',
            background: 'var(--color-primary)', color: 'white',
            border: 'none', fontSize: '15px', fontWeight: 800,
            cursor: 'pointer', boxShadow: '0 6px 24px rgba(232, 89, 12, 0.30)',
            transition: 'all 0.25s ease', fontFamily: 'var(--font-family)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
          <Navigation size={18} /> Track Order
        </button>
        <button onClick={onMenu}
          style={{
            width: '100%', padding: '14px', borderRadius: '16px',
            background: 'var(--bg-card)', color: 'var(--text-primary)',
            border: '1.5px solid var(--border)', fontSize: '14px', fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.25s ease', fontFamily: 'var(--font-family)',
          }}>
          Return to Menu
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN CHECKOUT PAGE
   ═══════════════════════════════════════════ */
export default function CheckoutPage() {
  const navigate = useNavigate();
  const {
    cart, getCartTotal, selectedPaymentMethod, setPaymentMethod,
    placeOrder, addresses, deliveryType, setDeliveryType,
    selectedAddressId, setSelectedAddress,
  } = useStore();

  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const totals = getCartTotal();
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  const handlePlaceOrder = () => {
    if (deliveryType === 'delivery' && !selectedAddressId) return;
    setLoading(true);
    setTimeout(() => {
      const addr = addresses.find(a => a.id === selectedAddressId);
      const order = placeOrder(
        selectedPaymentMethod,
        deliveryType === 'delivery' ? (addr?.fullAddress || 'Tashkent') : 'Pickup from restaurant',
        notes
      );
      setLoading(false);
      setPlacedOrder({ ...order, deliveryType, estimatedDelivery: '25-35 min' });
      setSuccess(true);
    }, 1800);
  };

  if (cart.length === 0 && !success) {
    navigate('/cart');
    return null;
  }

  if (success && placedOrder) {
    return (
      <OrderConfirmation
        order={placedOrder}
        onTrack={() => navigate('/tracking')}
        onMenu={() => navigate('/')}
      />
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'none', paddingBottom: '120px' }}>
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
          <h1 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>Checkout</h1>
        </div>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Delivery Type */}
        <DeliveryTypeSelector deliveryType={deliveryType} onChange={setDeliveryType} />

        {/* Delivery Address (only for delivery) */}
        {deliveryType === 'delivery' && (
          <DeliveryAddressSection
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelect={setSelectedAddress}
            onAddNew={() => navigate('/addresses')}
          />
        )}

        {/* Pickup info */}
        {deliveryType === 'pickup' && (
          <div style={{
            background: 'var(--bg-card)', borderRadius: '16px', padding: '16px',
            border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)',
            animation: 'slideUp 0.3s ease-out',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px',
                background: 'var(--color-primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Store size={14} color="var(--color-primary)" />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Pickup Location</h3>
            </div>
            <div style={{
              padding: '14px', borderRadius: '12px',
              background: 'var(--color-primary-light)',
              border: '1px solid var(--color-primary-border)',
            }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>BEK FOOD — Main Branch</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Tashkent, Amir Temur street 78
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Ready in approximately 15-20 minutes
              </p>
            </div>
          </div>
        )}

        {/* Delivery Time */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: '16px', padding: '16px',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'var(--color-primary-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Clock size={14} color="var(--color-primary)" />
            </div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {deliveryType === 'delivery' ? 'Delivery Time' : 'Pickup Time'}
            </h3>
          </div>
          <div style={{
            padding: '14px', borderRadius: '12px',
            border: '1.5px solid var(--color-primary-border)',
            background: 'var(--color-primary-light)', textAlign: 'center',
          }}>
            <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--color-primary)' }}>
              {deliveryType === 'delivery' ? '25-35 min' : '15-20 min'}
            </span>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Estimated {deliveryType === 'delivery' ? 'arrival' : 'readiness'}</p>
          </div>
        </div>

        {/* Payment Method */}
        <PaymentMethodSelector selected={selectedPaymentMethod} onSelect={setPaymentMethod} />

        {/* Order Notes */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: '16px', padding: '16px',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>Special Notes</h3>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special instructions for your order..."
            style={{
              width: '100%', background: 'var(--bg-secondary)', border: '1.5px solid var(--border)',
              borderRadius: '12px', padding: '12px', fontSize: '13px', color: 'var(--text-primary)',
              resize: 'none', height: '80px', transition: 'all 0.2s ease', fontFamily: 'var(--font-family)',
              outline: 'none',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
          />
        </div>

        {/* Order Summary */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: '16px', padding: '16px',
          border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)',
          display: 'flex', flexDirection: 'column', gap: '10px',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>Order Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Items ({totalItems})</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{totals.subtotal.toLocaleString()} so'm</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              {deliveryType === 'delivery' ? 'Delivery Fee' : 'Pickup'}
            </span>
            <span style={{
              fontWeight: 600,
              color: (deliveryType === 'pickup' || totals.deliveryFee === 0) ? 'var(--color-success)' : 'var(--text-primary)',
            }}>
              {deliveryType === 'pickup' ? 'Free' : (totals.deliveryFee === 0 ? 'Free' : `${totals.deliveryFee.toLocaleString()} so'm`)}
            </span>
          </div>
          {totals.discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Promo Discount</span>
              <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>-{totals.discount.toLocaleString()} so'm</span>
            </div>
          )}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '2px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>Total</span>
              <span style={{ fontSize: '22px', fontWeight: 900, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>
                {(deliveryType === 'pickup'
                  ? totals.subtotal + totals.serviceFee - totals.tax - totals.discount
                  : totals.total
                ).toLocaleString()} so'm
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Place Order Button */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 12px', paddingBottom: 'env(safe-area-inset-bottom, 12px)',
      }}>
        <div style={{
          maxWidth: '480px', margin: '0 auto', borderRadius: 'var(--radius-xl)',
          background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(24px)',
          border: '1px solid var(--border)',
          boxShadow: '0 -4px 32px rgba(45, 42, 38, 0.12)',
          padding: '12px',
        }}>
          <button onClick={handlePlaceOrder}
            disabled={loading || (deliveryType === 'delivery' && !selectedAddressId)}
            style={{
              width: '100%', padding: '16px', borderRadius: 'var(--radius-lg)',
              background: loading ? 'var(--color-success)' : 'var(--color-primary)',
              color: 'white', border: 'none', fontSize: '15px', fontWeight: 800,
              cursor: loading ? 'default' : 'pointer', fontFamily: 'var(--font-family)',
              boxShadow: loading ? '0 6px 24px rgba(43, 138, 62, 0.35)' : 'var(--shadow-primary)',
              transition: 'all 0.3s ease', letterSpacing: '-0.01em',
              opacity: (deliveryType === 'delivery' && !selectedAddressId) ? 0.5 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
            {loading ? (
              <>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff',
                  animation: 'spin 0.8s linear infinite',
                }} />
                Processing Order...
              </>
            ) : (
              <>
                Place Order — {(deliveryType === 'pickup'
                  ? totals.subtotal + totals.serviceFee - totals.tax - totals.discount
                  : totals.total
                ).toLocaleString()} so'm
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
