import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, CreditCard, Wallet, Smartphone, Check, ChevronLeft, Banknote } from 'lucide-react';
import useStore from '../store/useStore';

const paymentMethods = [
  { id: 'cash', name: 'Cash', icon: Banknote },
  { id: 'uzcard', name: 'UzCard', icon: CreditCard },
  { id: 'humo', name: 'Humo', icon: CreditCard },
  { id: 'visa', name: 'Visa', icon: CreditCard },
  { id: 'mastercard', name: 'MC', icon: CreditCard },
  { id: 'applepay', name: 'Apple', icon: Smartphone },
  { id: 'googlepay', name: 'Google', icon: Smartphone },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getCartTotal, selectedPaymentMethod, setPaymentMethod, placeOrder, addresses } = useStore();
  const [notes, setNotes] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(addresses.find(a => a.isDefault)?.id || addresses[0]?.id);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const totals = getCartTotal();
  const defaultAddress = addresses.find(a => a.id === selectedAddress);

  const handlePlaceOrder = () => {
    setLoading(true);
    setTimeout(() => {
      placeOrder(selectedPaymentMethod, defaultAddress?.fullAddress || 'Tashkent', notes);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/tracking'), 1500);
    }, 1500);
  };

  if (success) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', textAlign: 'center', background: 'var(--bg-primary)', animation: 'scaleIn 0.3s ease-out' }}>
        <div style={{
          width: '96px', height: '96px', borderRadius: '50%',
          background: 'var(--color-success-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '24px', animation: 'pulseGlow 2s ease-in-out infinite',
        }}>
          <Check size={48} color="var(--color-success)" strokeWidth={2.5} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Order Placed!
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Your order has been confirmed and is being prepared
        </p>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hide" style={{ paddingBottom: '120px' }}>
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

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Delivery Address */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <MapPin size={16} color="var(--color-primary)" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Delivery Address</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {addresses.map(addr => (
              <button key={addr.id} onClick={() => setSelectedAddress(addr.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px', borderRadius: '12px', border: '1.5px solid',
                  borderColor: selectedAddress === addr.id ? 'var(--color-primary-border)' : 'var(--border)',
                  background: selectedAddress === addr.id ? 'var(--color-primary-light)' : 'var(--bg-secondary)',
                  textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-family)',
                }}>
                <div style={{
                  width: '16px', height: '16px', borderRadius: '50%',
                  border: `2px solid ${selectedAddress === addr.id ? 'var(--color-primary)' : 'var(--text-muted)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {selectedAddress === addr.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>{addr.label}</span>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{addr.fullAddress}</p>
                </div>
              </button>
            ))}
          </div>
          <button style={{
            width: '100%', marginTop: '12px', padding: '10px',
            borderRadius: '12px', border: '1.5px dashed var(--border)',
            background: 'transparent', color: 'var(--text-secondary)',
            fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'var(--font-family)', transition: 'all 0.2s ease',
          }}>
            + Add New Address
          </button>
        </div>

        {/* Delivery Time */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Clock size={16} color="var(--color-primary)" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Delivery Time</h3>
          </div>
          <div style={{
            padding: '12px', borderRadius: '12px',
            border: '1.5px solid var(--color-primary-border)',
            background: 'var(--color-primary-light)', textAlign: 'center',
          }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-primary)' }}>25-35 min</span>
            <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>Estimated</p>
          </div>
        </div>

        {/* Payment Method */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Wallet size={16} color="var(--color-primary)" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Payment Method</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {paymentMethods.map(method => {
              const isActive = selectedPaymentMethod === method.id;
              const Icon = method.icon;
              return (
                <button key={method.id} onClick={() => setPaymentMethod(method.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                    padding: '12px 8px', borderRadius: '12px', border: '1.5px solid',
                    borderColor: isActive ? 'var(--color-primary-border)' : 'var(--border)',
                    background: isActive ? 'var(--color-primary-light)' : 'var(--bg-secondary)',
                    cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'var(--font-family)',
                  }}>
                  <Icon size={18} color={isActive ? 'var(--color-primary)' : 'var(--text-secondary)'} />
                  <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-secondary)' }}>{method.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Order Notes */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Order Notes</h3>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions..."
            style={{
              width: '100%', background: 'var(--bg-secondary)', border: '1.5px solid var(--border)',
              borderRadius: '12px', padding: '12px', fontSize: '14px', color: 'var(--text-primary)',
              resize: 'none', height: '80px', transition: 'all 0.2s ease', fontFamily: 'var(--font-family)',
            }} />
        </div>

        {/* Order Summary */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Items ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
            <span style={{ color: 'var(--text-primary)' }}>{totals.subtotal.toLocaleString()} so'm</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Delivery</span>
            <span style={{ color: 'var(--text-primary)' }}>{totals.deliveryFee === 0 ? 'Free' : `${totals.deliveryFee.toLocaleString()}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Service Fee</span>
            <span style={{ color: 'var(--text-primary)' }}>{totals.serviceFee.toLocaleString()} so'm</span>
          </div>
          {totals.discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-success)' }}>
              <span>Discount</span>
              <span>-{totals.discount.toLocaleString()} so'm</span>
            </div>
          )}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '15px' }}>
            <span style={{ color: 'var(--text-primary)' }}>Total</span>
            <span style={{ color: 'var(--color-primary)' }}>{totals.total.toLocaleString()} so'm</span>
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
          <button onClick={handlePlaceOrder} disabled={loading || !defaultAddress} style={{
            width: '100%', padding: '16px', borderRadius: 'var(--radius-lg)',
            background: loading ? 'var(--color-success)' : 'var(--color-primary)',
            color: 'white', border: 'none', fontSize: '15px', fontWeight: 800,
            cursor: loading ? 'default' : 'pointer', fontFamily: 'var(--font-family)',
            boxShadow: loading ? '0 6px 24px rgba(43, 138, 62, 0.35)' : 'var(--shadow-primary)',
            transition: 'all 0.3s ease', letterSpacing: '-0.01em',
            opacity: !defaultAddress ? 0.5 : 1,
          }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />
                Processing...
              </div>
            ) : (
              `Place Order — ${totals.total.toLocaleString()} so'm`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
