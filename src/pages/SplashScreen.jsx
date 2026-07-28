import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => navigate('/login'), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [navigate]);

  return (
    <motion.div
      className="h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#FAFAFA' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)' }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.div
        className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)' }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      />

      <AnimatePresence mode="wait">
        {phase >= 1 && (
          <motion.div
            className="flex flex-col items-center z-10"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <motion.div
              className="w-24 h-24 rounded-[28px] flex items-center justify-center mb-5"
              style={{
                backgroundColor: 'rgba(249,115,22,0.1)',
                border: '2px solid rgba(249,115,22,0.2)',
              }}
              initial={{ rotate: -20, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            >
              <img
                src="/logo.png"
                alt=""
                className="w-14 h-14 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = document.createElement('span');
                  fallback.textContent = 'BF';
                  fallback.style.cssText = 'font-size:28px;font-weight:700;color:#F97316';
                  e.target.parentNode.appendChild(fallback);
                }}
              />
            </motion.div>
            <motion.h1
              className="text-3xl font-extrabold tracking-tight mb-1"
              style={{ color: '#111827' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Bek{' '}
              <span style={{ color: '#F97316' }}>Food</span>
            </motion.h1>
            <motion.p
              className="text-sm font-medium"
              style={{ color: '#6B7280' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Chinobodning eng yaxshi taomlari
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute bottom-20 w-40 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: '#F97316' }}
            initial={{ width: '0%' }}
            animate={{ width: phase === 1 ? '50%' : phase >= 2 ? '100%' : '0%' }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
