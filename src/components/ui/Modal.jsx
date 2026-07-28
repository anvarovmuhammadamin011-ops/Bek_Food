'use client';

import { Fragment, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[90vw]',
};

export const Modal = memo(function Modal({
  isOpen, onClose, title, description, children, size = 'md',
  closeOnOverlayClick = true, showCloseButton = true, className
}) {
  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
      >
        <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
        <motion.div className={cn('relative w-full bg-surface rounded-[24px] shadow-[0_25px_80px_rgba(0,0,0,0.15)] border border-divider overflow-hidden', sizeClasses[size], className)}
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-6 pb-4 border-b border-divider">
              <div>
                {title && (
                  <motion.h2 className="text-xl font-bold text-text tracking-tight"
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  >
                    {title}
                  </motion.h2>
                )}
                {description && (
                  <motion.p className="text-sm text-textMuted mt-1"
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                  >
                    {description}
                  </motion.p>
                )}
              </div>
              {showCloseButton && (
                <motion.button onClick={onClose}
                  className="p-2 rounded-[10px] text-textMuted hover:text-text hover:bg-surfaceActive transition-colors"
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Close"
                >
                  <X size={20} />
                </motion.button>
              )}
            </div>
          )}
          <div className="p-6">
            <AnimatePresence mode="popLayout">{children}</AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
});

export const BottomSheet = memo(function BottomSheet({
  isOpen, onClose, title, children, height = 'auto', showHandle = true, className
}) {
  if (!isOpen) return null;

  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  return createPortal(
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-end" initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        />
        <motion.div className={cn('w-full bg-surface rounded-t-[24px] border-t border-divider shadow-[0_-10px_40px_rgba(0,0,0,0.1)]', className)}
          style={{ maxHeight: heightStyle === 'auto' ? '90vh' : heightStyle }}
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className="flex flex-col">
            {showHandle && (
              <div className="flex items-center justify-center py-3">
                <motion.div className="w-10 h-1.5 bg-divider rounded-full" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} />
              </div>
            )}
            {title && (
              <div className="px-6 pb-4 border-b border-divider">
                <h2 className="text-lg font-bold text-text">{title}</h2>
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
});

export const Toast = memo(function Toast({ id, title, description, type = 'default', onClose, action, duration = 5000 }) {
  const typeStyles = {
    default: 'bg-surface border-divider',
    success: 'bg-success/10 border-success/20',
    error: 'bg-danger/10 border-danger/20',
    warning: 'bg-warning/10 border-warning/20',
  };

  const icons = {
    default: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>,
    success: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
    error: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>,
    warning: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  };

  const iconColors = {
    default: 'text-textMuted',
    success: 'text-success',
    error: 'text-danger',
    warning: 'text-warning',
  };

  return (
    <AnimatePresence>
      <motion.div className={cn('flex items-start gap-3 p-4 rounded-[16px] border shadow-lg min-w-[300px] max-w-md', typeStyles[type])}
        initial={{ opacity: 0, x: 100, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 100, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className={cn('flex-shrink-0 mt-0.5', iconColors[type])}>{icons[type]}</div>
        <div className="flex-1 min-w-0">
          <motion.p className="text-sm font-semibold text-text" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>{title}</motion.p>
          {description && <motion.p className="text-sm text-textMuted mt-0.5" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>{description}</motion.p>}
          {action && <motion.div className="mt-3" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>{action}</motion.div>}
        </div>
        <motion.button onClick={() => onClose(id)} className="flex-shrink-0 p-1 rounded-[8px] text-textMuted hover:text-text hover:bg-black/5 transition-colors"
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Dismiss"
        >
          <X size={16} />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
});

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export const Toaster = memo(function Toaster({ toasts, onClose, position = 'top-right' }) {
  return (
    <AnimatePresence>
      <div className={cn('fixed z-[1700] flex flex-col gap-3 pointer-events-none p-2', positionClasses[position])} aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto w-full">
            <Toast {...toast} onClose={onClose} />
          </div>
        ))}
      </div>
    </AnimatePresence>
  );
});

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, type = 'default', action, duration = 5000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, type, action, duration, onClose: dismiss };
    setToasts((prev) => [...prev, newToast]);
    if (duration > 0) setTimeout(() => dismiss(id), duration);
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, toast, dismiss };
};