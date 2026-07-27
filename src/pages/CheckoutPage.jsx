import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Wallet, Check, ChevronLeft, MessageSquare } from 'lucide-react';
import useStore from '../store/useStore';

const STEPS = ['Manzil', 'To\'lov', 'Tasdiqlash'];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getCartTotal, selectedPaymentMethod, setPaymentMethod, placeOrder, addresses } = useStore();
  const [notes, setNotes] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(addresses.find((a) => a.isDefault)?.id || addresses[0]?.id);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const totals = getCartTotal();

  const handlePlaceOrder = () => {
    setLoading(true);
    setTimeout(() => {
      placeOrder(selectedPaymentMethod, addresses.find((a) => a.id === selectedAddress)?.fullAddress || '', notes);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/tracking'), 1200);
    }, 1500);
  };

  if (success) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 text-center animate-scale-in" style={{ background: 'var(--bg)' }}>
        <div className="animate-pop-in" style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(229,30,30,.1)', border: '1px solid rgba(229,30,30,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Check size={40} color="#e51e1e" />
        </div>
        <h2 className="display-2 animate-fade-in-up" style={{ marginBottom: 4 }}>Buyurtma qabul qilindi!</h2>
        <p className="animate-fade-in-up" style={{ color: '#b8b8b8', fontSize: 12, animationDelay: '.1s' }}>Buyurtmangiz tasdiqlandi va tayyorlanmoqda</p>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      {/* Header */}
      <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s' }}>
            <ChevronLeft size={18} color="#fff" />
          </button>
          <h1 style={{ color: '#fff', fontSize: 15, fontWeight: 500 }}>Buyurtma berish</h1>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="animate-fade-in" style={{ padding: '16px 16px 0' }}>
        <div className="flex items-center" style={{ gap: 8 }}>
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center" style={{ flex: 1 }}>
              <div className="flex items-center justify-center" style={{
                width: 24, height: 24, borderRadius: '50%', fontSize: 11, fontWeight: 600,
                background: i <= step ? 'var(--red)' : 'var(--surface)',
                color: i <= step ? '#fff' : '#6b6b6b',
                border: `1.5px solid ${i <= step ? 'var(--red)' : 'var(--border)'}`,
                transition: 'all .3s',
                boxShadow: i === step ? 'var(--shadow-red)' : 'none'
              }}>
                {i < step ? <Check size={12} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: i < step ? 'var(--red)' : 'var(--surface)', borderRadius: 1, margin: '0 4px', transition: 'background .3s' }} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between" style={{ marginTop: 6 }}>
          {STEPS.map((s, i) => (
            <span key={s} style={{ fontSize: 10, color: i <= step ? '#e51e1e' : '#6b6b6b', fontWeight: i === step ? 600 : 400, transition: 'all .3s' }}>{s}</span>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Step 0: Address */}
        {step === 0 && (
          <div className="card p-4 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} color="#e51e1e" />
              <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>Yetkazish manzili</h3>
            </div>
            <div className="space-y-2">
              {addresses.map((addr) => (
                <button key={addr.id} onClick={() => setSelectedAddress(addr.id)}
                  className="w-full flex items-center gap-3 p-3 text-left" style={{
                    borderRadius: 'var(--radius)', transition: 'all .25s',
                    background: selectedAddress === addr.id ? 'rgba(229,30,30,.08)' : 'var(--surface)',
                    border: `1.5px solid ${selectedAddress === addr.id ? 'rgba(229,30,30,.3)' : 'var(--border)'}`,
                    cursor: 'pointer', transform: selectedAddress === addr.id ? 'scale(1.01)' : 'scale(1)'
                  }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${selectedAddress === addr.id ? '#e51e1e' : '#555'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}>
                    {selectedAddress === addr.id && <div className="animate-pop-in" style={{ width: 8, height: 8, borderRadius: '50%', background: '#e51e1e' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ color: '#e51e1e', fontSize: 12, fontWeight: 500 }}>{addr.label}</span>
                    <p style={{ color: '#6b6b6b', fontSize: 12, marginTop: 2 }}>{addr.fullAddress}</p>
                  </div>
                </button>
              ))}
            </div>
            <button style={{ width: '100%', marginTop: 8, padding: '10px 0', borderRadius: 'var(--radius)', border: '1.5px dashed rgba(255,255,255,.12)', background: 'none', color: '#6b6b6b', fontSize: 12, cursor: 'pointer', transition: 'all .2s' }}>
              + Yangi manzil
            </button>
          </div>
        )}

        {/* Step 1: Payment */}
        {step === 1 && (
          <div className="card p-4 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <Wallet size={16} color="#e51e1e" />
              <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>To'lov turi</h3>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPaymentMethod('cash')} className="flex-1 flex flex-col items-center gap-2 p-4" style={{
                borderRadius: 'var(--radius)', cursor: 'pointer', transition: 'all .25s',
                background: selectedPaymentMethod === 'cash' ? 'rgba(229,30,30,.08)' : 'var(--surface)',
                border: `1.5px solid ${selectedPaymentMethod === 'cash' ? 'rgba(229,30,30,.3)' : 'var(--border)'}`,
                transform: selectedPaymentMethod === 'cash' ? 'scale(1.02)' : 'scale(1)'
              }}>
                <div style={{ fontSize: 24 }}>💵</div>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>Naqd pul</span>
                {selectedPaymentMethod === 'cash' && <Check size={14} color="#e51e1e" />}
              </button>
              <button className="flex-1 flex flex-col items-center gap-2 p-4" style={{
                borderRadius: 'var(--radius)', cursor: 'pointer', opacity: .4,
                background: 'var(--surface)', border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: 24 }}>💳</div>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>Karta</span>
                <span style={{ color: '#6b6b6b', fontSize: 10 }}>Tez orada</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Confirm */}
        {step === 2 && (
          <>
            {/* Delivery time */}
            <div className="card p-4 animate-fade-in-up">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} color="#e51e1e" />
                <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>Yetkazish vaqti</h3>
              </div>
              <div className="p-3 text-center" style={{ borderRadius: 'var(--radius)', background: 'rgba(229,30,30,.08)', border: '1px solid rgba(229,30,30,.15)' }}>
                <span style={{ color: '#e51e1e', fontSize: 14, fontWeight: 500 }}>25-35 daqiqa</span>
                <p style={{ color: '#6b6b6b', fontSize: 10, marginTop: 2 }}>Taxminiy</p>
              </div>
            </div>

            {/* Notes */}
            <div className="card p-4 animate-fade-in-up" style={{ animationDelay: '.05s' }}>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={16} color="#e51e1e" />
                <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>Izoh</h3>
              </div>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Maxsus talablar..."
                className="input" style={{ minHeight: 64, borderRadius: 'var(--radius)' }} />
            </div>

            {/* Summary */}
            <div className="card p-4 animate-fade-in-up" style={{ animationDelay: '.1s' }}>
              <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Buyurtma xulosasi</h3>
              <div className="space-y-2">
                <div className="flex justify-between" style={{ fontSize: 12 }}><span style={{ color: '#6b6b6b' }}>Mahsulotlar ({cart.reduce((s, i) => s + i.quantity, 0)})</span><span style={{ color: '#fff' }}>{totals.subtotal.toLocaleString()} so'm</span></div>
                <div className="flex justify-between" style={{ fontSize: 12 }}><span style={{ color: '#6b6b6b' }}>Yetkazish</span><span style={{ color: '#7fbf7f' }}>Bepul</span></div>
                <div className="flex justify-between" style={{ fontSize: 12 }}><span style={{ color: '#6b6b6b' }}>Xizmat haqi</span><span style={{ color: '#fff' }}>+{totals.serviceFee.toLocaleString()} so'm</span></div>
                {totals.discount > 0 && <div className="flex justify-between" style={{ fontSize: 12, color: '#7fbf7f' }}><span>Chegirma</span><span>-{totals.discount.toLocaleString()} so'm</span></div>}
                <div className="divider" />
                <div className="flex justify-between items-baseline"><span style={{ color: '#fff', fontWeight: 500 }}>Jami</span><span style={{ fontFamily: 'var(--font-display)', color: '#e51e1e', fontSize: 20, fontWeight: 600 }}>{totals.total.toLocaleString()} so'm</span></div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40" style={{ padding: '12px 16px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}>
        <div className="glass-floating" style={{ padding: '12px 16px' }}>
          {step < 2 ? (
            <button onClick={() => setStep(step + 1)} className="btn btn-primary w-full" style={{ borderRadius: 'var(--radius)', minHeight: 50, fontSize: 15, fontWeight: 600 }}>
              Keyingisi
            </button>
          ) : (
            <button onClick={handlePlaceOrder} disabled={loading || !selectedAddress} className="btn btn-primary w-full" style={{ borderRadius: 'var(--radius)', minHeight: 50, fontSize: 15, fontWeight: 600 }}>
              {loading ? <div className="spinner" /> : `Buyurtmani tasdiqlash — ${totals.total.toLocaleString()} so'm`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
