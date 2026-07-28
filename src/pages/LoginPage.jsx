import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import useStore from '../store/useStore';
import { Input } from '../components/ui/Input';
import { cn } from '../utils/cn';

export default function LoginPage() {
  const navigate = useNavigate();
  const loginAs = useStore((s) => s.loginAs);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone.length < 9) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/verify', { state: { phone: `+998 ${phone}` } });
    }, 800);
  };

  const formatPhone = (value) => {
    const nums = value.replace(/\D/g, '').slice(0, 9);
    if (nums.length <= 2) return nums;
    if (nums.length <= 5) return `${nums.slice(0, 2)} ${nums.slice(2)}`;
    return `${nums.slice(0, 2)} ${nums.slice(2, 5)} ${nums.slice(5)}`;
  };

  return (
    <motion.div
      className="h-full flex flex-col items-center justify-center px-6"
      style={{ background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: 320, height: 320, background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '-15%', width: 280, height: 280, background: 'radial-gradient(circle, rgba(249,115,22,0.05) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', top: '40%', left: '60%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />

      <motion.div
        className="w-full"
        style={{ maxWidth: 360, position: 'relative', zIndex: 1 }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="flex flex-col items-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            style={{
              width: 72, height: 72, borderRadius: 22,
              background: 'var(--primary-light)',
              border: '1.5px solid rgba(249,115,22,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
              boxShadow: '0 8px 32px rgba(249,115,22,0.12)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em' }}>BF</span>
          </motion.div>
          <h1 style={{ fontWeight: 700, color: 'var(--text)', fontSize: 28, marginBottom: 8, textAlign: 'center', letterSpacing: '-0.03em', lineHeight: 1.15 }}>Bek Food</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, textAlign: 'center', lineHeight: 1.5, maxWidth: 260 }}>
            Buyurtma berish uchun telefon raqamingizni kiriting
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: 20 }}
          >
            <Input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="__ ___ __ __"
              leftElement={
                <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: 15, paddingRight: 4 }}>+998</span>
              }
              className="tracking-[0.05em]"
              size="lg"
              variant="default"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="submit"
              disabled={loading || phone.length < 9}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-3.5 rounded-[14px] text-base font-semibold text-white transition-all duration-200',
                'disabled:opacity-40 disabled:cursor-not-allowed',
              )}
              style={{
                background: 'var(--primary)',
                boxShadow: '0 8px 24px rgba(249,115,22,0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--primary-hover)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(249,115,22,0.3)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(249,115,22,0.25)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {loading ? (
                <div className="spinner" style={{ width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              ) : (
                <>
                  Davom etish
                  <ArrowRight size={18} strokeWidth={2.5} />
                </>
              )}
            </button>
          </motion.div>
        </form>

        <motion.p
          style={{ color: 'var(--text-dim)', fontSize: 12, textAlign: 'center', marginTop: 24, lineHeight: 1.5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          Davom etish orqali siz Foydalanish shartlari va Maxfiylik siyosatiga rozilik bildirasiz
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
