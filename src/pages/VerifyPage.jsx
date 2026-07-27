import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';

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
    if (e.key === 'Backspace' && !code[index] && index > 0) inputsRef.current[index - 1]?.focus();
  };

  const handleVerify = (fullCode) => {
    setLoading(true);
    setTimeout(() => {
      if (fullCode === '000000') {
        setError('Noto\'g\'ri kod');
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
    <div className="h-full flex flex-col items-center justify-center px-5" style={{ background: '#0a0a0a' }}>
      <div style={{ width: '100%', maxWidth: 320 }}>
        {/* Top bar */}
        <div style={{ width: 40, height: 4, background: '#333', borderRadius: 2, margin: '0 auto 28px' }} />

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#fff', fontSize: 20, marginBottom: 6 }}>
            Kodni kiriting
          </div>
          <div style={{ color: '#b8b8b8', fontSize: 12 }}>
            Telegram'ga <span style={{ color: '#fff' }}>{phone}</span> raqamiga kod yubordik
          </div>
        </div>

        {/* OTP inputs */}
        <div className={`code-inputs ${error ? 'animate-shake' : ''}`} onPaste={handlePaste} style={{ marginBottom: 20 }}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`code-digit ${digit ? 'filled' : ''}`}
              style={error ? { borderColor: '#e51e1e', background: '#1a0505' } : {}}
            />
          ))}
        </div>

        {error && (
          <div style={{ color: '#e51e1e', fontSize: 12, textAlign: 'center', marginBottom: 16 }}>
            {error}
          </div>
        )}

        {/* Resend timer */}
        <div style={{ textAlign: 'center' }}>
          {resendTimer > 0 ? (
            <span style={{ color: '#6b6b6b', fontSize: 11 }}>
              Kodni qayta yuborish · {formatTimer(resendTimer)}
            </span>
          ) : (
            <button
              onClick={() => { setResendTimer(60); setError(''); setCode(['', '', '', '', '', '']); }}
              style={{ color: '#e51e1e', fontSize: 11, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Kodni qayta yuborish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
