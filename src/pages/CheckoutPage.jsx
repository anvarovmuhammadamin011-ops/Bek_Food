import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Check, MapPin, Wallet, CreditCard, Landmark, Clock, MessageSquare, Package, Receipt } from 'lucide-react';
import useStore from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Textarea } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { formatPrice } from '../utils/cn';

const STEPS = [
  { key: 'address', label: 'Manzil', icon: MapPin },
  { key: 'payment', label: "To'lov", icon: Wallet },
  { key: 'confirm', label: 'Tasdiqlash', icon: Receipt },
];

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Naqd pul', desc: "Yetkazib berishda to'lang", icon: Wallet },
  { id: 'card', label: 'Karta', desc: 'Visa, UzCard, Humo', icon: CreditCard },
  { id: 'click', label: 'Click', desc: "Click orqali to'lov", icon: Landmark },
];

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

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
      <div className="h-full flex flex-col items-center justify-center px-8 text-center" style={{ background: 'var(--bg)' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          style={{
            width: 96, height: 96, borderRadius: 'var(--radius-full)',
            background: 'var(--success-light)',
            border: '1px solid rgba(34,197,94,.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <Check size={48} color="var(--success)" strokeWidth={2.5} />
        </motion.div>
        <motion.h2
          className="display-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ marginBottom: 8 }}
        >
          Buyurtma qabul qilindi!
        </motion.h2>
        <motion.p
          className="body"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{ color: 'var(--text-muted)' }}
        >
          Buyurtmangiz tasdiqlandi va tayyorlanmoqda
        </motion.p>
      </div>
    );
  }

  if (cart.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg)' }}>
      <div className="flex-shrink-0" style={{ padding: '16px 16px 0' }}>
        <div className="flex items-center gap-3 mb-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)}
            style={{
              width: 40, height: 40, borderRadius: 'var(--radius-sm)',
              background: 'var(--surface)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={18} color="var(--text)" />
          </motion.button>
          <h1 className="heading">Buyurtma berish</h1>
        </div>

        <div className="flex items-center gap-2 mb-1" style={{ padding: '0 2px' }}>
          {STEPS.map((s, i) => {
            const isActive = i === step;
            const isCompleted = i < step;
            return (
              <div key={s.key} className="flex items-center" style={{ flex: 1 }}>
                <motion.div
                  initial={false}
                  animate={{
                    width: 32, height: 32, borderRadius: 'var(--radius-full)',
                    background: isCompleted ? 'var(--success)' : isActive ? 'var(--primary)' : 'var(--surface)',
                    border: `2px solid ${isCompleted ? 'var(--success)' : isActive ? 'var(--primary)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: isActive ? '0 0 0 4px rgba(249,115,22,0.15)' : 'none',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  {isCompleted ? (
                    <Check size={14} color="#fff" strokeWidth={3} />
                  ) : (
                    <span style={{ fontSize: 13, fontWeight: 700, color: isActive ? '#fff' : 'var(--text-dim)' }}>{i + 1}</span>
                  )}
                </motion.div>
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      flex: 1, height: 3, margin: '0 8px', borderRadius: 2,
                      background: i < step ? 'var(--success)' : 'var(--border)',
                      transition: 'background 0.3s var(--ease)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between" style={{ padding: '0 4px', marginBottom: 8 }}>
          {STEPS.map((s, i) => (
            <span
              key={s.key}
              style={{
                fontSize: 11, fontWeight: i === step ? 600 : 400,
                color: i <= step ? (i < step ? 'var(--success)' : 'var(--primary)') : 'var(--text-dim)',
                transition: 'color 0.3s var(--ease)',
              }}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ padding: '0 16px 120px' }}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="address"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <Card variant="default" padding="md" className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={18} color="var(--primary)" />
                  <h3 className="subheading">Yetkazish manzili</h3>
                </div>
                {addresses.map((addr) => (
                  <motion.button
                    key={addr.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedAddress(addr.id)}
                    className="w-full flex items-center text-left"
                    style={{
                      padding: 14, borderRadius: 'var(--radius)',
                      transition: 'all 0.2s var(--ease)',
                      background: selectedAddress === addr.id ? 'var(--primary-light)' : 'var(--surface)',
                      border: `1.5px solid ${selectedAddress === addr.id ? 'rgba(249,115,22,0.25)' : 'var(--border)'}`,
                      cursor: 'pointer', gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 20, height: 20, borderRadius: 'var(--radius-full)',
                        border: `2px solid ${selectedAddress === addr.id ? 'var(--primary)' : 'var(--border-strong)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, transition: 'border-color 0.2s var(--ease)',
                      }}
                    >
                      {selectedAddress === addr.id && (
                        <motion.div
                          layoutId="addressDot"
                          style={{ width: 10, height: 10, borderRadius: 'var(--radius-full)', background: 'var(--primary)' }}
                        />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ color: 'var(--primary)', fontSize: 13, fontWeight: 600 }}>{addr.label}</span>
                      <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{addr.fullAddress}</p>
                    </div>
                  </motion.button>
                ))}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%', padding: '12px 0', borderRadius: 'var(--radius)',
                    border: '1.5px dashed var(--border-strong)', background: 'none',
                    color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer',
                    fontWeight: 500, transition: 'all 0.2s var(--ease)',
                  }}
                >
                  + Yangi manzil
                </motion.button>
              </Card>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="payment"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <Card variant="default" padding="md">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet size={18} color="var(--primary)" />
                  <h3 className="subheading">To'lov turi</h3>
                </div>
                <div className="flex flex-col gap-3">
                  {PAYMENT_METHODS.map((pm) => {
                    const selected = selectedPaymentMethod === pm.id;
                    const disabled = pm.id === 'click';
                    return (
                      <motion.button
                        key={pm.id}
                        whileTap={disabled ? {} : { scale: 0.98 }}
                        onClick={() => !disabled && setPaymentMethod(pm.id)}
                        className="flex items-center"
                        style={{
                          padding: '16px 18px', gap: 14,
                          borderRadius: 'var(--radius)',
                          cursor: disabled ? 'not-allowed' : 'pointer',
                          opacity: disabled ? 0.45 : 1,
                          transition: 'all 0.2s var(--ease)',
                          background: selected ? 'var(--primary-light)' : 'var(--surface)',
                          border: `1.5px solid ${selected ? 'rgba(249,115,22,0.25)' : 'var(--border)'}`,
                        }}
                      >
                        <div
                          style={{
                            width: 48, height: 48, borderRadius: 'var(--radius)',
                            background: selected ? 'var(--primary)' : 'var(--surface-active)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, transition: 'background 0.2s var(--ease)',
                          }}
                        >
                          <pm.icon size={22} color={selected ? '#fff' : 'var(--text-dim)'} />
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                          <span style={{ color: 'var(--text)', fontSize: 14, fontWeight: 600, display: 'block' }}>{pm.label}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{pm.desc}</span>
                        </div>
                        <div
                          style={{
                            width: 22, height: 22, borderRadius: 'var(--radius-full)',
                            border: `2px solid ${selected ? 'var(--primary)' : 'var(--border-strong)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {selected && (
                            <motion.div
                              layoutId="paymentDot"
                              style={{ width: 12, height: 12, borderRadius: 'var(--radius-full)', background: 'var(--primary)' }}
                            />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="confirm"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <Card variant="default" padding="md">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={18} color="var(--primary)" />
                  <h3 className="subheading">Yetkazish vaqti</h3>
                </div>
                <div
                  className="flex items-center justify-between"
                  style={{
                    padding: '14px 16px', borderRadius: 'var(--radius)',
                    background: 'var(--primary-light)',
                    border: '1px solid rgba(249,115,22,0.12)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock size={20} color="#fff" />
                    </div>
                    <div>
                      <span style={{ color: 'var(--primary)', fontSize: 16, fontWeight: 700 }}>25-35 daqiqa</span>
                      <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 1 }}>Taxminiy yetib kelish</p>
                    </div>
                  </div>
                  <Badge variant="primary" size="sm">Tez</Badge>
                </div>
              </Card>

              <Card variant="default" padding="md">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare size={18} color="var(--primary)" />
                  <h3 className="subheading">Izoh</h3>
                </div>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Maxsus talablar..."
                  variant="default"
                  size="md"
                  style={{ minHeight: 72 }}
                />
              </Card>

              <Card variant="default" padding="md">
                <div className="flex items-center gap-2 mb-4">
                  <Package size={18} color="var(--primary)" />
                  <h3 className="subheading">Buyurtma xulosasi</h3>
                </div>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
                        <div
                          style={{
                            width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden', background: 'var(--surface-active)',
                            flexShrink: 0,
                          }}
                        >
                          <img src={item.food.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 500, display: 'block' }}>{item.food.name}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>x{item.quantity}</span>
                        </div>
                      </div>
                      <span className="price-sm">{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div style={{ height: 1, background: 'var(--border)', margin: '14px 0' }} />
                <div className="space-y-2.5">
                  <div className="flex justify-between" style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Mahsulotlar ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                    <span style={{ color: 'var(--text)' }}>{formatPrice(totals.subtotal)} so'm</span>
                  </div>
                  <div className="flex justify-between" style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Yetkazish</span>
                    <span style={{ color: 'var(--success)', fontWeight: 600 }}>Bepul</span>
                  </div>
                  <div className="flex justify-between" style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Xizmat haqi</span>
                    <span style={{ color: 'var(--text)' }}>+{formatPrice(totals.serviceFee)} so'm</span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between" style={{ fontSize: 13 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Chegirma</span>
                      <span style={{ color: 'var(--success)' }}>-{formatPrice(totals.discount)} so'm</span>
                    </div>
                  )}
                  <div style={{ height: 1, background: 'var(--border)', margin: '2px 0' }} />
                  <div className="flex justify-between items-baseline">
                    <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: 15 }}>Jami</span>
                    <span className="price-lg" style={{ fontSize: 22, color: 'var(--primary)' }}>{formatPrice(totals.total)} so'm</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        className="fixed bottom-0 inset-x-0 z-40"
        style={{
          padding: '12px 16px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
          background: 'linear-gradient(to top, var(--bg) 60%, transparent)',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            maxWidth: 480, margin: '0 auto',
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(20px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
            borderRadius: 'var(--radius-lg)',
            padding: 10,
            boxShadow: '0 -4px 24px rgba(0,0,0,0.06)',
            pointerEvents: 'auto',
          }}
        >
          {step < 2 ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep(step + 1)}
              className="w-full"
              style={{
                padding: '14px 0', borderRadius: 'var(--radius-button)',
                background: 'var(--primary)', color: '#fff',
                fontSize: 15, fontWeight: 600, border: 'none',
                cursor: 'pointer', boxShadow: 'var(--shadow-primary)',
              }}
            >
              Keyingisi
            </motion.button>
          ) : (
            <motion.button
              whileTap={loading ? undefined : { scale: 0.97 }}
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddress}
              className="w-full"
              style={{
                padding: '14px 0', borderRadius: 'var(--radius-button)',
                background: loading ? 'var(--primary)' : 'var(--primary)',
                color: '#fff', fontSize: 15, fontWeight: 600, border: 'none',
                cursor: loading || !selectedAddress ? 'not-allowed' : 'pointer',
                opacity: loading || !selectedAddress ? 0.6 : 1,
                boxShadow: 'var(--shadow-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8,
              }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}
                />
              ) : (
                <>
                  <Receipt size={18} />
                  Buyurtmani tasdiqlash — {formatPrice(totals.total)} so'm
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
