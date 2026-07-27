import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Wallet, Check, ChevronLeft } from 'lucide-react';
import useStore from '../store/useStore';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getCartTotal, selectedPaymentMethod, setPaymentMethod, placeOrder, addresses } = useStore();
  const [notes, setNotes] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(addresses.find((a) => a.isDefault)?.id || addresses[0]?.id);
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
      <div className="h-full flex flex-col items-center justify-center px-8 text-center animate-scale-in" style={{ background: '#0a0a0a' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(229,30,30,.1)', border: '1px solid rgba(229,30,30,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Check size={40} color="#e51e1e" />
        </div>
        <h2 className="display-2" style={{ marginBottom: 4 }}>Buyurtma qabul qilindi!</h2>
        <p style={{ color: '#b8b8b8', fontSize: 12 }}>Buyurtmangiz tasdiqlandi va tayyorlanmoqda</p>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronLeft size={18} color="#fff" />
          </button>
          <h1 style={{ color: '#fff', fontSize: 15, fontWeight: 500 }}>Buyurtma berish</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Delivery address */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} color="#e51e1e" />
            <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>Yetkazish manzili</h3>
          </div>
          <div className="space-y-2">
            {addresses.map((addr) => (
              <button key={addr.id} onClick={() => setSelectedAddress(addr.id)}
                className="w-full flex items-center gap-3 p-3 text-left" style={{
                  borderRadius: 10, transition: 'all .15s',
                  background: selectedAddress === addr.id ? 'rgba(229,30,30,.1)' : '#141414',
                  border: `1px solid ${selectedAddress === addr.id ? 'rgba(229,30,30,.3)' : 'rgba(255,255,255,0.08)'}`,
                  cursor: 'pointer'
                }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${selectedAddress === addr.id ? '#e51e1e' : '#555'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedAddress === addr.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e51e1e' }} />}
                </div>
                <div>
                  <span style={{ color: '#e51e1e', fontSize: 12, fontWeight: 500 }}>{addr.label}</span>
                  <p style={{ color: '#6b6b6b', fontSize: 12, marginTop: 2 }}>{addr.fullAddress}</p>
                </div>
              </button>
            ))}
          </div>
          <button style={{ width: '100%', marginTop: 8, padding: '10px 0', borderRadius: 10, border: '1px dashed rgba(255,255,255,0.15)', background: 'none', color: '#6b6b6b', fontSize: 12, cursor: 'pointer' }}>
            + Yangi manzil
          </button>
        </div>

        {/* Delivery time */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} color="#e51e1e" />
            <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>Yetkazish vaqti</h3>
          </div>
          <div className="p-3 text-center" style={{ borderRadius: 10, background: 'rgba(229,30,30,.1)', border: '1px solid rgba(229,30,30,.15)' }}>
            <span style={{ color: '#e51e1e', fontSize: 14, fontWeight: 500 }}>25-35 daqiqa</span>
            <p style={{ color: '#6b6b6b', fontSize: 10, marginTop: 2 }}>Taxminiy</p>
          </div>
        </div>

        {/* Payment */}
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Wallet size={16} color="#e51e1e" />
            <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500 }}>To'lov turi</h3>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setPaymentMethod('cash')} className="flex-1 flex flex-col items-center gap-2 p-3" style={{
              borderRadius: 10, cursor: 'pointer', transition: 'all .15s',
              background: selectedPaymentMethod === 'cash' ? 'rgba(229,30,30,.1)' : '#141414',
              border: `1px solid ${selectedPaymentMethod === 'cash' ? 'rgba(229,30,30,.3)' : 'rgba(255,255,255,0.08)'}`
            }}>
              <span style={{ fontSize: 20 }}>💵</span>
              <span style={{ color: '#fff', fontSize: 12 }}>Naqd pul</span>
            </button>
            <button className="flex-1 flex flex-col items-center gap-2 p-3" style={{
              borderRadius: 10, cursor: 'pointer', opacity: .5,
              background: '#141414', border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <span style={{ fontSize: 20 }}>💳</span>
              <span style={{ color: '#fff', fontSize: 12 }}>Karta</span>
              <span style={{ color: '#6b6b6b', fontSize: 10 }}>Tez orada</span>
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="card p-4">
          <h3 style={{ color: '#fff', fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Izoh</h3>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Maxsus talablar..."
            className="input" style={{ minHeight: 64 }} />
        </div>

        {/* Summary */}
        <div className="card p-4 space-y-2">
          <div className="flex justify-between" style={{ fontSize: 12 }}><span style={{ color: '#6b6b6b' }}>Mahsulotlar ({cart.reduce((s, i) => s + i.quantity, 0)})</span><span style={{ color: '#fff' }}>{totals.subtotal.toLocaleString()} so'm</span></div>
          <div className="flex justify-between" style={{ fontSize: 12 }}><span style={{ color: '#6b6b6b' }}>Yetkazish</span><span style={{ color: '#7fbf7f' }}>Bepul</span></div>
          <div className="flex justify-between" style={{ fontSize: 12 }}><span style={{ color: '#6b6b6b' }}>Xizmat haqi</span><span style={{ color: '#fff' }}>+{totals.serviceFee.toLocaleString()} so'm</span></div>
          {totals.discount > 0 && <div className="flex justify-between" style={{ fontSize: 12, color: '#7fbf7f' }}><span>Chegirma</span><span>-{totals.discount.toLocaleString()} so'm</span></div>}
          <div className="divider" />
          <div className="flex justify-between" style={{ fontWeight: 500 }}><span style={{ color: '#fff' }}>Jami</span><span className="price" style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>{totals.total.toLocaleString()} so'm</span></div>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 z-40" style={{ padding: '16px', background: 'rgba(10,10,10,.9)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={handlePlaceOrder} disabled={loading || !selectedAddress} className="btn btn-primary w-full" style={{ borderRadius: 10 }}>
          {loading ? <div className="spinner" /> : `Buyurtmani tasdiqlash — ${totals.total.toLocaleString()} so'm`}
        </button>
      </div>
    </div>
  );
}
