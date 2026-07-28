import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';
import useStore from '../store/useStore';
import { cn } from '../utils/cn';

export default function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useStore((s) => s.login);
  const phone = location.state?.phone || '+998 __ ___ __ __';
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
    if (index === 5 && newCode.every((d) => d)) handleVerify(newCode.join(''));
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = (fullCode) => {
    setLoading(true);
    setTimeout(() => {
      if (fullCode === '000000') {
        setError("Noto'g'ri kod");
        setLoading(false);
        return;
      }
      login(phone);
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      const newCode = pasted.split('');
      setCode(newCode);
      inputsRef.current[5]?.focus();
      handleVerify(pasted);
    }
  };

  const formatTimer = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <motion.div
      className="h-full flex flex-col px-6"
      style={{ background: 'var(--bg)', paddingTop: 60 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.button
        onClick={() => navigate(-1)}
        style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'var(--text)',
          marginBottom: 40,
        }}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={20} strokeWidth={2} />
      </motion.button>

      <motion.div
        className="w-full"
        style={{ maxWidth: 360, margin: '0 auto' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          style={{ marginBottom: 32 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 style={{ fontWeight: 700, color: 'var(--text)', fontSize: 26, marginBottom: 10, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Tasdiqlash kodi
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.5 }}>
            Biz <span style={{ color: 'var(--text)', fontWeight: 600 }}>{phone}</span> raqamiga 6 xonali kodni yubordik
          </p>
        </motion.div>

        <motion.div
          className="flex gap-2.5 justify-center"
          style={{ marginBottom: 28 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onPaste={handlePaste}
        >
          {code.map((digit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.22 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'relative' }}
            >
              <input
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={cn(error && 'animate-shake')}
                style={{
                  width: 48, height: 56,
                  borderRadius: 14,
                  border: `2px solid ${error ? 'var(--danger)' : digit ? 'var(--primary)' : 'var(--border)'}`,
                  background: digit || inputsRef.current[i] === document.activeElement ? 'var(--surface)' : 'var(--surface)',
                  textAlign: 'center',
                  fontSize: 22,
                  fontWeight: 600,
                  color: 'var(--text)',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: digit ? '0 0 0 3px rgba(249,115,22,0.1)' : 'none',
                  caretColor: 'var(--primary)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)';
                }}
                onBlur={(e) => {
                  if (!digit) {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {error && (
          <motion.p
            style={{ color: 'var(--danger)', fontSize: 14, textAlign: 'center', marginBottom: 16, fontWeight: 500 }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 16 }}
        >
          <button
            type="button"
            disabled={loading || code.some((d) => !d)}
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
            onClick={() => handleVerify(code.join(''))}
          >
            {loading ? (
              <div style={{ width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
            ) : (
              'Tasdiqlash'
            )}
          </button>
        </motion.div>

        <motion.div
          style={{ textAlign: 'center' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          {resendTimer > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--text-dim)', fontSize: 13 }}>
              <Clock size={14} strokeWidth={1.5} />
              <span>Kodni qayta yuborish {formatTimer(resendTimer)}</span>
            </div>
          ) : (
            <button
              onClick={() => { setResendTimer(60); setError(''); setCode(['', '', '', '', '', '']); inputsRef.current[0]?.focus(); }}
              style={{ color: 'var(--primary)', fontSize: 14, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              Kodni qayta yuborish
            </button>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
