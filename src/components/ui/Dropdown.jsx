'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Dropdown = memo(function Dropdown({
  trigger, items, align = 'start', className, ...props
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={cn('relative inline-block', className)} {...props}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            className={cn(
              'absolute z-50 min-w-[180px] bg-surface border border-border rounded-[16px] shadow-lg p-1.5 mt-1',
              align === 'start' ? 'left-0' : align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2'
            )}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {items.map((item, i) => (
              <button key={i}
                onClick={() => { item.onClick?.(); setOpen(false); }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-[10px] transition-colors text-left',
                  item.danger ? 'text-danger hover:bg-danger/5' : 'text-text hover:bg-surfaceActive',
                  item.disabled && 'opacity-40 cursor-not-allowed'
                )}
                disabled={item.disabled}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
                {item.rightIcon && <span className="flex-shrink-0 text-textMuted">{item.rightIcon}</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Dropdown.displayName = 'Dropdown';