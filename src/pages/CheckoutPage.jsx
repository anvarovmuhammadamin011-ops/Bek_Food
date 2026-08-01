import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Wallet, Check, ChevronLeft, MessageSquare, Phone, Crosshair, Plus, Tag, X } from 'lucide-react';
import useStore from '../store/useStore';
import GoogleMap from '../components/GoogleMap';

const STEPS = ['Manzil', "To'lov", 'Tasdiqlash'];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getCartTotal, selectedPaymentMethod, setPaymentMethod, placeOrder, addresses, user, addAddress, applyPromoCode, removeCoupon, appliedCoupon } = useStore();
  const [notes, setNotes] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState(null);
  const [promoError, setPromoError] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(addresses.find((a) => a.isDefault)?.id || addresses[0]?.id);
  const [mapLocation, setMapLocation] = useState(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState('');
  const [newAddressText, setNewAddressText] = useState('');
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const totals = getCartTotal();
  const needsPhone = !user?.phone;

  const handleSaveAddress = () => {
    if (!newAddressText.trim()) return;
    const addr = addAddress({ label: newAddressLabel.trim(), fullAddress: newAddressText.trim() });
    setSelectedAddress(addr.id);
    setShowNewAddress(false);
    setNewAddressLabel('');
    setNewAddressText('');
  };

  const deliveryAddress = mapLocation ? mapLocation.address : (addresses.find((a) => a.id === selectedAddress)?.fullAddress || '');

  const handlePlaceOrder = () => {
    if (needsPhone && contactPhone.replace(/\D/g, '').length < 9) return;
    if (!deliveryAddress) return;
    setLoading(true);
    setTimeout(() => {
      placeOrder(selectedPaymentMethod, deliveryAddress, notes);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate('/tracking'), 1200);
    }, 1500);
  };

  const handleApplyPromo = () => {
    const code = promoInput.trim();
    if (!code) return;
    if (applyPromoCode(code, totals.subtotal)) {
      setPromoMsg({ code: code.toUpperCase(), text: "Chegirma qo'llandi" });
      setPromoError(false);
      setPromoInput('');
    } else {
      setPromoError(true);
      setPromoMsg({ code: code.toUpperCase(), text: 'Kod noto\'g\'ri yoki amal qilmagan' });
    }
  };

  const handleRemovePromo = () => {
    removeCoupon();
    setPromoMsg(null);
    setPromoError(false);
    setPromoInput('');
  };

  if (success) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 text-center animate-scale-in" style={{ background: 'var(--bg)' }}>
        <div className="animate-pop-in" style={{ width: 88, height: 88, borderRadius: 'var(--radius-xl)', background: 'var(--success-light)', border: '1px solid rgba(34,197,94,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Check size={44} color="var(--success)" strokeWidth={2.5} />
        </div>
        <h2 className="display-2 animate-fade-in-up" style={{ marginBottom: 6 }}>Buyurtma qabul qilindi!</h2>
        <p className="animate-fade-in-up body" style={{ animationDelay: '.1s' }}>Buyurtmangiz tasdiqlandi va tayyorlanmoqda</p>
      </div>
    );
  }

  if (cart.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-36">
        <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center" style={{ gap: 12 }}>
            <button onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ChevronLeft size={18} color="var(--text)" />
            </button>
            <h1 className="heading">Buyurtma berish</h1>
          </div>
        </div>

        <div className="animate-fade-in" style={{ padding: '18px 16px 0' }}>
          <div className="flex items-center" style={{ gap: 8 }}>
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center" style={{ flex: 1 }}>
                <div className="flex items-center justify-center" style={{
                  width: 28, height: 28, borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 600,
                  background: i <= step ? 'var(--primary)' : 'var(--surface-active)',
                  color: i <= step ? '#fff' : 'var(--text-dim)',
                  border: `1.5px solid ${i <= step ? 'var(--primary)' : 'var(--border)'}`,
                  transition: 'all .3s',
                  boxShadow: i === step ? 'var(--shadow-primary)' : 'none',
                }}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: i < step ? 'var(--primary)' : 'var(--border)', borderRadius: 1, margin: '0 6px', transition: 'background .3s' }} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between" style={{ marginTop: 8 }}>
            {STEPS.map((s, i) => (
              <span key={s} style={{ fontSize: 11, color: i <= step ? 'var(--primary)' : 'var(--text-dim)', fontWeight: i === step ? 600 : 400, transition: 'all .3s' }}>{s}</span>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-4">
          {step === 0 && (
            <>
              {needsPhone && (
                <div className="card p-4 animate-fade-in-up">
                  <div className="flex items-center" style={{ gap: 8, marginBottom: 14 }}>
                    <Phone size={18} color="var(--primary)" />
                    <h3 className="subheading">Telefon raqam</h3>
                  </div>
                  <div className="input-group">
                    <span className="input-group-icon" style={{ fontWeight: 600, color: 'var(--text-muted)' }}>+998</span>
                    <input type="tel" inputMode="numeric" value={contactPhone.replace(/^998/, '')} onChange={(e) => setContactPhone('998' + e.target.value.replace(/\D/g, '').slice(0, 9))} placeholder="__ ___ __ __" className="input" style={{ paddingLeft: 60, fontSize: 16, fontWeight: 500, letterSpacing: '.05em' }} />
                  </div>
                  <div style={{ color: 'var(--text-dim)', fontSize: 11, marginTop: 8 }}>Yetkazib berish uchun bog'lanish raqami</div>
                </div>
              )}
              <div className="card p-4 animate-fade-in-up">
                <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                  <div className="flex items-center" style={{ gap: 8 }}>
                    <Crosshair size={18} color="var(--primary)" />
                    <h3 className="subheading">Xaritada tanlash</h3>
                  </div>
                  {mapLocation && (
                    <button onClick={() => setMapLocation(null)} style={{ color: 'var(--primary)', fontSize: 12, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Bekor qilish</button>
                  )}
                </div>
                <GoogleMap center={{ lat: 41.3111, lng: 69.2797 }} height={200} onLocationSelect={setMapLocation} />
                {mapLocation && (
                  <div className="animate-fade-in-up" style={{ marginTop: 10, padding: '10px 12px', borderRadius: 'var(--radius)', background: 'var(--primary-light)', border: '1px solid rgba(249,115,22,.2)' }}>
                    <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{mapLocation.address}</div>
                  </div>
                )}
              </div>

              <div className="card p-4 animate-fade-in-up">
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <button key={addr.id} onClick={() => setSelectedAddress(addr.id)} className="w-full flex items-center p-3 text-left" style={{
                      borderRadius: 'var(--radius)', transition: 'all .25s', gap: 12,
                      background: selectedAddress === addr.id ? 'var(--primary-light)' : 'var(--surface)',
                      border: `1.5px solid ${selectedAddress === addr.id ? 'rgba(249,115,22,.3)' : 'var(--border)'}`,
                      cursor: 'pointer',
                    }}>
                      <div style={{ width: 18, height: 18, borderRadius: 'var(--radius-full)', border: `2px solid ${selectedAddress === addr.id ? 'var(--primary)' : 'var(--border-strong)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}>
                        {selectedAddress === addr.id && <div className="animate-pop-in" style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', background: 'var(--primary)' }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ color: 'var(--primary)', fontSize: 13, fontWeight: 600 }}>{addr.label}</span>
                        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{addr.fullAddress}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {!showNewAddress ? (
                <button onClick={() => setShowNewAddress(true)} className="w-full animate-fade-in-up" style={{
                  padding: '14px 0', borderRadius: 'var(--radius)', border: '1.5px dashed var(--border-strong)',
                  background: 'none', color: 'var(--primary)', fontSize: 13, cursor: 'pointer', fontWeight: 600,
                  transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <Plus size={16} /> Yangi manzil qo'shish
                </button>
              ) : (
                <div className="card p-4 animate-fade-in-up space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="subheading">Yangi manzil</h3>
                    <button onClick={() => setShowNewAddress(false)} style={{ color: 'var(--text-muted)', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}>Bekor qilish</button>
                  </div>
                  <input value={newAddressLabel} onChange={(e) => setNewAddressLabel(e.target.value)} placeholder="Nomi (masalan: Uy, Ish)" className="input" />
                  <textarea value={newAddressText} onChange={(e) => setNewAddressText(e.target.value)} placeholder="To'liq manzil..." className="input resize-none" style={{ minHeight: 64 }} />
                  <button onClick={handleSaveAddress} disabled={!newAddressText.trim()} className="btn btn-primary w-full">Saqlash</button>
                </div>
              )}
            </>
          )}

          {step === 1 && (
            <div className="card p-4 animate-fade-in-up">
              <div className="flex items-center" style={{ gap: 8, marginBottom: 14 }}>
                <Wallet size={18} color="var(--primary)" />
                <h3 className="subheading">To'lov turi</h3>
              </div>
              <div className="flex" style={{ gap: 12 }}>
                <button onClick={() => setPaymentMethod('cash')} className="flex-1 flex flex-col items-center" style={{
                  padding: '18px 12px', gap: 8, borderRadius: 'var(--radius-lg)', cursor: 'pointer', transition: 'all .25s',
                  background: selectedPaymentMethod === 'cash' ? 'var(--primary-light)' : 'var(--surface)',
                  border: `1.5px solid ${selectedPaymentMethod === 'cash' ? 'rgba(249,115,22,.3)' : 'var(--border)'}`,
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Wallet size={20} color="var(--primary)" />
                  </div>
                  <span style={{ color: 'var(--text)', fontSize: 14, fontWeight: 500 }}>Naqd pul</span>
                  {selectedPaymentMethod === 'cash' && <Check size={16} color="var(--primary)" />}
                </button>
                <button className="flex-1 flex flex-col items-center" style={{
                  padding: '18px 12px', gap: 8, borderRadius: 'var(--radius-lg)', cursor: 'pointer', opacity: .4,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius)', background: 'var(--surface-active)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Wallet size={20} color="var(--text-dim)" />
                  </div>
                  <span style={{ color: 'var(--text)', fontSize: 14, fontWeight: 500 }}>Karta</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>Tez orada</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <>
              <div className="card p-4 animate-fade-in-up">
                <div className="flex items-center" style={{ gap: 8, marginBottom: 14 }}>
                  <Clock size={18} color="var(--primary)" />
                  <h3 className="subheading">Yetkazish vaqti</h3>
                </div>
                <div className="p-3 text-center" style={{ borderRadius: 'var(--radius)', background: 'var(--primary-light)', border: '1px solid rgba(249,115,22,.15)' }}>
                  <span style={{ color: 'var(--primary)', fontSize: 15, fontWeight: 600 }}>25-35 daqiqa</span>
                  <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 2 }}>Taxminiy</p>
                </div>
              </div>

              <div className="card p-4 animate-fade-in-up" style={{ animationDelay: '.05s' }}>
                <div className="flex items-center" style={{ gap: 8, marginBottom: 14 }}>
                  <MessageSquare size={18} color="var(--primary)" />
                  <h3 className="subheading">Izoh</h3>
                </div>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Maxsus talablar..."
                  className="input resize-none" style={{ minHeight: 64 }} />
              </div>

              <div className="card p-4 animate-fade-in-up" style={{ animationDelay: '.05s' }}>
                <div className="flex items-center" style={{ gap: 8, marginBottom: 14 }}>
                  <Tag size={18} color="var(--primary)" />
                  <h3 className="subheading">Promo kod</h3>
                </div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between" style={{ padding: '12px 14px', borderRadius: 'var(--radius)', background: 'var(--success-light)', border: '1px solid rgba(34,197,94,.2)' }}>
                    <div className="flex items-center" style={{ gap: 10 }}>
                      <Tag size={16} color="var(--success)" />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--success)' }}>{appliedCoupon.code}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>-{totals.discount.toLocaleString()} so'm chegirma</div>
                      </div>
                    </div>
                    <button onClick={handleRemovePromo} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex" style={{ gap: 8 }}>
                      <input
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                        placeholder="Kodni kiriting"
                        className="input"
                        style={{ flex: 1, textTransform: 'uppercase', letterSpacing: '.04em' }}
                      />
                      <button onClick={handleApplyPromo} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>Qo'llash</button>
                    </div>
                    {promoMsg && (
                      <div style={{ fontSize: 12, marginTop: 8, color: promoError ? 'var(--danger)' : 'var(--success)', fontWeight: 500 }}>{promoMsg.text}</div>
                    )}
                  </>
                )}
              </div>

              <div className="card p-4 animate-fade-in-up" style={{ animationDelay: '.1s' }}>
                <h3 className="subheading" style={{ marginBottom: 14 }}>Buyurtma xulosasi</h3>
                <div className="space-y-3">
                  <div className="flex justify-between" style={{ fontSize: 13 }}><span style={{ color: 'var(--text-muted)' }}>Mahsulotlar ({cart.reduce((s, i) => s + i.quantity, 0)})</span><span style={{ color: 'var(--text)' }}>{totals.subtotal.toLocaleString()} so'm</span></div>
                  <div className="flex justify-between" style={{ fontSize: 13 }}><span style={{ color: 'var(--text-muted)' }}>Xizmat haqi (2%)</span><span style={{ color: 'var(--text)' }}>+{totals.serviceFee.toLocaleString()} so'm</span></div>
                  <div className="flex justify-between" style={{ fontSize: 13 }}><span style={{ color: 'var(--text-muted)' }}>Soliq (1%)</span><span style={{ color: 'var(--text)' }}>-{totals.tax.toLocaleString()} so'm</span></div>
                  <div className="flex justify-between" style={{ fontSize: 13 }}><span style={{ color: 'var(--text-muted)' }}>Yetkazish</span><span style={{ color: totals.deliveryFee > 0 ? 'var(--text)' : 'var(--success)', fontWeight: 500 }}>{totals.deliveryFee > 0 ? `+${totals.deliveryFee.toLocaleString()} so'm` : 'Bepul'}</span></div>
                  {totals.discount > 0 && <div className="flex justify-between" style={{ fontSize: 13, color: 'var(--success)' }}><span>Chegirma</span><span>-{totals.discount.toLocaleString()} so'm</span></div>}
                  <div className="divider" />
                  <div className="flex justify-between items-baseline"><span style={{ color: 'var(--text)', fontWeight: 600, fontSize: 15 }}>Jami</span><span className="price-hero" style={{ fontSize: 22 }}>{totals.total.toLocaleString()} so'm</span></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 z-40" style={{ bottom: 82, padding: '12px 16px', background: 'rgba(255,255,255,.97)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', borderRadius: 'var(--radius-lg)', padding: 10 }}>
          {step < 2 ? (
            <button onClick={() => setStep(step + 1)} disabled={step === 0 && needsPhone && contactPhone.replace(/\D/g, '').length < 9} className="btn btn-primary w-full">
              Keyingisi
            </button>
          ) : (
            <button onClick={handlePlaceOrder} disabled={loading || !deliveryAddress || (needsPhone && contactPhone.replace(/\D/g, '').length < 9)} className="btn btn-primary w-full">
              {loading ? <div className="spinner" style={{ borderTopColor: '#fff' }} /> : `Buyurtmani tasdiqlash — ${totals.total.toLocaleString()} so'm`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
