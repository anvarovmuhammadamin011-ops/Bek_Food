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
      <div className="h-full flex flex-col items-center justify-center px-8 text-center animate-scale-in">
        <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mb-6 animate-pulse-glow">
          <Check size={48} className="text-success" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
        <p className="text-text-secondary text-sm">Your order has been confirmed and is being prepared</p>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="p-4 glass-strong sticky top-0 z-30">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl bg-bg-card active:scale-95 transition-transform">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">Checkout</h1>
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-4">
        {/* Delivery Address */}
        <div className="bg-bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-accent-orange" />
            <h3 className="text-sm font-semibold">Delivery Address</h3>
          </div>
          <div className="space-y-2">
            {addresses.map(addr => (
              <button key={addr.id} onClick={() => setSelectedAddress(addr.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${selectedAddress === addr.id ? 'border-accent-orange/40 bg-accent-orange/10' : 'border-border bg-bg-primary'}`}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedAddress === addr.id ? 'border-accent-orange' : 'border-text-muted'}`}>
                  {selectedAddress === addr.id && <div className="w-2 h-2 rounded-full bg-accent-orange" />}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-semibold text-accent-orange">{addr.label}</span>
                  <p className="text-xs text-text-secondary mt-0.5">{addr.fullAddress}</p>
                </div>
              </button>
            ))}
          </div>
          <button className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-border text-text-secondary text-xs font-medium active:scale-[0.98] transition-transform">
            + Add New Address
          </button>
        </div>

        {/* Delivery Time */}
        <div className="bg-bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-accent-orange" />
            <h3 className="text-sm font-semibold">Delivery Time</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 p-3 rounded-xl border border-accent-orange/40 bg-accent-orange/10 text-center">
              <span className="text-sm font-bold text-accent-orange">25-35 min</span>
              <p className="text-[10px] text-text-secondary mt-0.5">Estimated</p>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Wallet size={16} className="text-accent-orange" />
            <h3 className="text-sm font-semibold">Payment Method</h3>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {paymentMethods.map(method => (
              <button key={method.id} onClick={() => setPaymentMethod(method.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${selectedPaymentMethod === method.id ? 'border-accent-orange/40 bg-accent-orange/10' : 'border-border bg-bg-primary'}`}>
                <method.icon size={20} className={selectedPaymentMethod === method.id ? 'text-accent-orange' : 'text-text-secondary'} />
                <span className="text-[10px] font-medium text-text-secondary">{method.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Order Notes */}
        <div className="bg-bg-card rounded-2xl p-4 border border-border">
          <h3 className="text-sm font-semibold mb-2">Order Notes</h3>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions..."
            className="w-full bg-bg-primary border border-border rounded-xl p-3 text-sm focus:border-accent-orange focus:outline-none transition-colors placeholder:text-text-muted resize-none h-20" />
        </div>

        {/* Order Summary */}
        <div className="bg-bg-card rounded-2xl p-4 border border-border space-y-2">
          <div className="flex justify-between text-sm"><span className="text-text-secondary">Items ({cart.reduce((s, i) => s + i.quantity, 0)})</span><span>{totals.subtotal.toLocaleString()} so'm</span></div>
          <div className="flex justify-between text-sm"><span className="text-text-secondary">Delivery</span><span>{totals.deliveryFee === 0 ? 'Free' : `${totals.deliveryFee.toLocaleString()}`}</span></div>
          <div className="flex justify-between text-sm"><span className="text-text-secondary">Service Fee</span><span>{totals.serviceFee.toLocaleString()} so'm</span></div>
          {totals.discount > 0 && <div className="flex justify-between text-sm text-success"><span>Discount</span><span>-{totals.discount.toLocaleString()} so'm</span></div>}
          <div className="border-t border-border pt-2 flex justify-between font-bold"><span>Total</span><span className="text-accent-orange">{totals.total.toLocaleString()} so'm</span></div>
        </div>
      </div>

      {/* Bottom */}
      <div className="fixed bottom-16 left-0 right-0 p-4 glass-strong border-t border-border z-40">
        <div className="max-w-lg mx-auto">
          <button onClick={handlePlaceOrder} disabled={loading || !defaultAddress} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : `Place Order — ${totals.total.toLocaleString()} so'm`}
          </button>
        </div>
      </div>
    </div>
  );
}
