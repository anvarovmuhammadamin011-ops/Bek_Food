'use client';

import { forwardRef, memo, useState, useRef, useEffect, useId, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, ChevronDown, ChevronUp, Loader2, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

const inputVariants = {
  default: 'border-borderStrong',
  filled: 'bg-surfaceActive border-transparent hover:bg-surfaceActive focus:bg-surface',
  ghost: 'bg-transparent border-divider hover:border-borderStrong',
  underlined: 'bg-transparent border-0 border-b-2 border-divider rounded-none hover:border-b-primary focus:border-b-primary',
};

const sizeVariants = {
  sm: 'h-9 px-3 text-sm rounded-[10px]',
  md: 'h-11 px-4 text-base rounded-[12px]',
  lg: 'h-13 px-5 text-lg rounded-[14px]',
};

export const Input = forwardRef(function Input({
  className, variant = 'default', size = 'md', label, error, hint,
  leftIcon, rightIcon, leftElement, rightElement, showPasswordToggle,
  loading, fullWidth = true, id: providedId, disabled, required, type = 'text', ...props
}, ref) {
  const generatedId = useId();
  const id = providedId || generatedId;
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = showPasswordToggle && showPassword ? 'text' : type;

  return (
    <div className={cn('relative', fullWidth && 'w-full')}>
      <AnimatePresence>
        {label && (
          <motion.label
            htmlFor={id}
            className={cn('block text-sm font-medium text-textSecondary mb-1.5 transition-colors', error && 'text-danger')}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
          >
            {label}
            {required && <span className="text-danger ml-0.5">*</span>}
          </motion.label>
        )}
      </AnimatePresence>

      <div className={cn('relative', isFocused && 'ring-2 ring-primary/20 rounded-[12px] -inset-0.5 pointer-events-none')}>
        {leftElement && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted flex items-center">{leftElement}</div>
        )}
        {leftIcon && (
          <div className={cn('absolute top-1/2 -translate-y-1/2 text-textMuted flex items-center', leftElement ? 'left-10' : 'left-3')}>
            {leftIcon}
          </div>
        )}

        <motion.input
          ref={ref}
          id={id}
          type={inputType}
          disabled={disabled || loading}
          required={required}
          aria-invalid={!!error}
          aria-describedby={cn(errorId, hintId)}
          className={cn(
            'w-full bg-surface font-medium transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] placeholder:text-textDim disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-transparent hover:border-borderStrong selection:bg-primary/20',
            inputVariants[variant], sizeVariants[size],
            error && 'border-danger focus:ring-danger/20',
            leftElement && 'pl-10', leftIcon && !leftElement && 'pl-10',
            rightIcon || rightElement || showPasswordToggle || loading ? 'pr-12' : '', className
          )}
          onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
          {...props}
        />

        <AnimatePresence>
          {loading && (
            <motion.div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {(rightElement || rightIcon) && !loading && (
            <motion.div className={cn('absolute right-3 top-1/2 -translate-y-1/2 text-textMuted flex items-center', showPasswordToggle && 'pr-10')}
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
            >
              {rightElement || rightIcon}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPasswordToggle && (
            <motion.button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-text p-1 rounded-[6px] hover:bg-surfaceActive transition-colors"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {props.value && props.onChange && !disabled && !loading && !showPasswordToggle && (
            <motion.button type="button"
              onClick={(e) => { e.preventDefault(); props.onChange({ ...e, target: { ...e.target, value: '' } }); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted hover:text-text p-1 rounded-[6px] hover:bg-surfaceActive transition-colors"
              initial={{ opacity: 0, scale: 0.8, rotate: -90 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
              aria-label="Clear"
            >
              <X size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {(error || hint) && (
          <motion.p id={error ? errorId : hintId}
            className={cn('mt-1.5 text-sm transition-colors', error ? 'text-danger' : 'text-textMuted')}
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
          >
            {error || hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';

export const Textarea = forwardRef(function Textarea({
  className, variant = 'default', size = 'md', label, error, hint, disabled, required, ...props
}, ref) {
  const generatedId = useId();
  const id = props.id || generatedId;

  return (
    <div className="w-full">
      <AnimatePresence>
        {label && (
          <motion.label htmlFor={id}
            className={cn('block text-sm font-medium text-textSecondary mb-1.5 transition-colors', error && 'text-danger')}
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
          >
            {label}
            {required && <span className="text-danger ml-0.5">*</span>}
          </motion.label>
        )}
      </AnimatePresence>

      <motion.textarea
        ref={ref} id={id} disabled={disabled} required={required}
        aria-invalid={!!error}
        className={cn(
          'w-full bg-surface border font-medium transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] placeholder:text-textDim disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-transparent hover:border-borderStrong selection:bg-primary/20 resize-y min-h-[100px] p-4',
          inputVariants[variant], sizeVariants[size],
          error && 'border-danger focus:ring-danger/20', className
        )}
        {...props}
      />

      <AnimatePresence>
        {(error || hint) && (
          <motion.p className={cn('mt-1.5 text-sm transition-colors', error ? 'text-danger' : 'text-textMuted')}
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
          >
            {error || hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

Textarea.displayName = 'Textarea';

export const Select = forwardRef(function Select({
  className, variant = 'default', size = 'md', label, error, hint, options, disabled, required, leftIcon, ...props
}, ref) {
  const generatedId = useId();
  const id = props.id || generatedId;

  return (
    <div className="w-full">
      <AnimatePresence>
        {label && (
          <motion.label htmlFor={id}
            className={cn('block text-sm font-medium text-textSecondary mb-1.5 transition-colors', error && 'text-danger')}
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
          >
            {label}
            {required && <span className="text-danger ml-0.5">*</span>}
          </motion.label>
        )}
      </AnimatePresence>

      <div className="relative">
        {leftIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted">{leftIcon}</div>}
        <motion.select ref={ref} id={id} disabled={disabled} required={required} aria-invalid={!!error}
          className={cn(
            'w-full bg-surface font-medium transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] placeholder:text-textDim disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-transparent hover:border-borderStrong selection:bg-primary/20 appearance-none cursor-pointer pr-10',
            inputVariants[variant], sizeVariants[size],
            leftIcon && 'pl-10', error && 'border-danger focus:ring-danger/20', className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </motion.select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-textMuted">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      <AnimatePresence>
        {(error || hint) && (
          <motion.p className={cn('mt-1.5 text-sm transition-colors', error ? 'text-danger' : 'text-textMuted')}
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
          >
            {error || hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

Select.displayName = 'Select';