import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Ticket, Bike, FileText, CreditCard, Percent, X, Check } from 'lucide-react';
import useStore from '../store/useStore';
import { cn, formatPrice } from '../utils/cn';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
};

function SwipeableCartItem({ item, onRemove, onQuantityChange }) {
  const controls = useDragControls();
  const [isRemoving, setIsRemoving] = useState(false);
  const [dragX, setDragX] = useState(0);

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -100) {
      setIsRemoving(true);
      setTimeout(() => onRemove(item.id), 250);
    }
    setDragX(0);
  };

  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, x: 60 }}
        animate={isRemoving ? { opacity: 0, x: -120, height: 0, marginBottom: 0, padding: 0 } : { opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -120, height: 0, marginBottom: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative overflow-hidden rounded-[20px] mb-3"
      >
        <motion.div
          className="absolute inset-y-0 right-0 flex items-center justify-end rounded-[20px]"
          style={{ background: 'var(--danger)', width: 80 }}
          animate={{ opacity: dragX < -20 ? 1 : 0 }}
        >
          <Trash2 size={20} style={{ color: 'white', marginRight: 20 }} />
        </motion.div>

        <motion.div
          drag="x"
          dragControls={controls}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={{ left: 0.4, right: 0 }}
          onDrag={(_, info) => setDragX(info.offset.x)}
          onDragEnd={handleDragEnd}
          style={{ x: 0, touchAction: 'pan-y' }}
          className="relative rounded-[20px]"
        >
          <Card variant="glass" padding="sm" className="border">
            <div className="flex items-center gap-3 p-1">
              <div
                className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0"
                style={{ background: 'var(--surface-active)' }}
              >
                <img
                  src={item.food.image}
                  alt={item.food.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{item.food.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {formatPrice(item.price)} so'm/dona
                </p>
                <motion.p
                  key={item.quantity}
                  className="text-base font-bold mt-1"
                  style={{ color: 'var(--primary)' }}
                  initial={{ scale: 1.1, color: 'var(--text)' }}
                  animate={{ scale: 1, color: 'var(--primary)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  {formatPrice(item.price * item.quantity)} so'm
                </motion.p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <motion.button
                  onClick={() => onRemove(item.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  whileHover={{ background: 'var(--danger-50)', color: 'var(--danger)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 size={15} />
                </motion.button>

                <div
                  className="flex items-center rounded-xl"
                  style={{ background: 'var(--surface-active)', border: '1px solid var(--border)' }}
                >
                  <motion.button
                    onClick={() => onQuantityChange(item.id, -1)}
                    className="flex items-center justify-center"
                    style={{ width: 32, height: 32, color: 'var(--text-muted)' }}
                    whileTap={{ scale: 0.9 }}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={14} />
                  </motion.button>
                  <motion.span
                    key={item.quantity}
                    className="text-sm font-bold text-center tabular-nums"
                    style={{ minWidth: 28, color: 'var(--text)' }}
                    initial={{ scale: 1.3, color: 'var(--primary)' }}
                    animate={{ scale: 1, color: 'var(--text)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    {item.quantity}
                  </motion.span>
                  <motion.button
                    onClick={() => onQuantityChange(item.id, 1)}
                    className="flex items-center justify-center"
                    style={{ width: 32, height: 32, color: 'var(--text-muted)' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus size={14} />
                  </motion.button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cart, removeFromCart, updateCartItemQuantity, getCartTotal,
    appliedCoupon, applyPromoCode, removeCoupon,
  } = useStore();
  const totals = getCartTotal();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('cash');

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const success = applyPromoCode(couponCode.trim().toUpperCase());
    if (success) {
      setCouponSuccess(true);
      setCouponError('');
    } else {
      setCouponError('Promokod topilmadi');
      setCouponSuccess(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode('');
    setCouponSuccess(false);
    setCouponError('');
  };

  const handleCheckout = () => {
    setShowPaymentModal(true);
  };

  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8" style={{ background: 'var(--bg)' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="text-center"
        >
          <motion.div
            className="w-24 h-24 rounded-[28px] flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, var(--primary-light), var(--surface))', border: '1px solid var(--border)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, -10, 10, -5, 0] }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
          >
            <ShoppingBag size={36} style={{ color: 'var(--primary)' }} />
          </motion.div>
          <h2 className="text-2xl font-extrabold tracking-tight mb-2">Savatingiz bo'sh</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)', maxWidth: 240, margin: '0 auto 24px' }}>
            Taomlarni ko'rish va buyurtma berishni boshlang
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/')}
            rightIcon={<ArrowRight size={18} />}
          >
            Menyuga o'tish
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-40" style={{ background: 'var(--bg)' }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 pt-4"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Savat</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{cart.length} ta mahsulot</p>
          </div>
          <Badge variant="primary" size="lg">
            <ShoppingBag size={14} />
            {cart.length}
          </Badge>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-5">
          <div
            className="rounded-[16px] p-4 flex items-center gap-3"
            style={{ background: 'var(--primary-50)', border: '1px solid rgba(249,115,22,0.15)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(249,115,22,0.15)' }}>
              <Bike size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Yetkazib berish bepul</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>30 daqiqa ichida yetkaziladi</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-5 space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 rounded-full" style={{ background: 'var(--primary)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Mahsulotlar</span>
          </div>
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <SwipeableCartItem
                key={item.id}
                item={item}
                onRemove={removeFromCart}
                onQuantityChange={updateCartItemQuantity}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card variant="glass" padding="lg" className="mb-3">
            <div className="flex items-center gap-2 mb-4">
              <Ticket size={16} style={{ color: 'var(--primary)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Promokod</span>
            </div>

            {appliedCoupon ? (
              <motion.div
                className="flex items-center gap-3 p-3.5 rounded-2xl"
                style={{ background: 'var(--success-50)', border: '1px solid rgba(34,197,94,0.2)' }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
                  <Percent size={18} style={{ color: 'var(--success)' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold" style={{ color: 'var(--success)' }}>{appliedCoupon.code}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {appliedCoupon.discountType === 'percent' ? `${appliedCoupon.discount}%` : formatPrice(appliedCoupon.discount)} chegirma
                  </p>
                </div>
                <motion.button
                  onClick={handleRemoveCoupon}
                  className="w-8 h-8 flex items-center justify-center rounded-xl"
                  style={{ color: 'var(--text-muted)' }}
                  whileHover={{ background: 'var(--surface-active)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} />
                </motion.button>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  variant="filled"
                  size="md"
                  placeholder="Promokodni kiriting"
                  value={couponCode}
                  onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                  error={couponError}
                  className="flex-1"
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleApplyCoupon}
                  className="flex-shrink-0"
                  style={{ height: 44 }}
                >
                  <ArrowRight size={18} />
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card variant="glass" padding="lg" className="mb-3">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} style={{ color: 'var(--text-muted)' }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Hisob</span>
            </div>

            <div className="space-y-3">
              <motion.div className="flex items-center justify-between" variants={itemVariants}>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Mahsulotlar summasi</span>
                <span className="text-sm font-semibold tabular-nums">{formatPrice(totals.subtotal)} so'm</span>
              </motion.div>
              <motion.div className="flex items-center justify-between" variants={itemVariants}>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Yetkazib berish</span>
                <Badge variant="success" size="xs">Bepul</Badge>
              </motion.div>
              <motion.div className="flex items-center justify-between" variants={itemVariants}>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Xizmat haqi (2%)</span>
                <span className="text-sm font-semibold tabular-nums">{formatPrice(totals.serviceFee)} so'm</span>
              </motion.div>
              {totals.tax > 0 && (
                <motion.div className="flex items-center justify-between" variants={itemVariants}>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Soliq</span>
                  <span className="text-sm font-semibold tabular-nums">-{formatPrice(totals.tax)} so'm</span>
                </motion.div>
              )}
              {totals.discount > 0 && (
                <motion.div
                  className="flex items-center justify-between"
                  variants={itemVariants}
                  style={{ color: 'var(--success)' }}
                >
                  <span className="text-sm font-semibold">Chegirma</span>
                  <span className="text-sm font-bold tabular-nums">-{formatPrice(totals.discount)} so'm</span>
                </motion.div>
              )}
              <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
              <motion.div
                className="flex items-baseline justify-between pt-1"
                variants={itemVariants}
              >
                <span className="text-base font-bold">Jami</span>
                <motion.span
                  key={totals.total}
                  className="text-2xl font-extrabold tracking-tight tabular-nums"
                  style={{ color: 'var(--primary)' }}
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  {formatPrice(totals.total)} so'm
                </motion.span>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        className="fixed bottom-0 inset-x-0 z-40"
        style={{
          padding: '12px 16px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          borderTop: '1px solid var(--border)',
        }}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleCheckout}
            rightIcon={<ArrowRight size={20} />}
          >
            Buyurtma berish — {formatPrice(totals.total)} so'm
          </Button>
        </div>
      </motion.div>

      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="To'lov usulini tanlang"
        size="sm"
      >
        <div className="space-y-3">
          {[
            { id: 'cash', label: 'Naqd pul', desc: 'Yetkazib berishda naqd to\'lov', icon: FileText },
            { id: 'card', label: 'Karta orqali', desc: 'Online to\'lov (tez kunda)', icon: CreditCard, comingSoon: true },
          ].map((method) => {
            const Icon = method.icon;
            const isSelected = selectedPayment === method.id;
            return (
              <motion.button
                key={method.id}
                onClick={() => !method.comingSoon && setSelectedPayment(method.id)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left"
                style={{
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                  background: isSelected ? 'var(--primary-light)' : 'var(--surface)',
                  opacity: method.comingSoon ? 0.5 : 1,
                }}
                whileHover={method.comingSoon ? {} : { scale: 1.01 }}
                whileTap={method.comingSoon ? {} : { scale: 0.98 }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: isSelected ? 'rgba(249,115,22,0.15)' : 'var(--surface-active)' }}
                >
                  <Icon size={22} style={{ color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{method.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{method.desc}</p>
                </div>
                {method.comingSoon && (
                  <Badge variant="warning" size="xs">Tez kunda</Badge>
                )}
                {isSelected && !method.comingSoon && (
                  <motion.div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--primary)' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <Check size={14} strokeWidth={3} style={{ color: 'white' }} />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => { setShowPaymentModal(false); navigate('/checkout'); }}
            className="mt-2"
          >
            Davom etish
            <ArrowRight size={18} />
          </Button>
        </div>
      </Modal>
    </div>
  );
}