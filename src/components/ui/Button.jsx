'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white shadow-primary hover:bg-primary-hover hover:shadow-primary-hover',
        secondary: 'bg-surfaceActive text-text border border-border hover:bg-surfaceHover hover:border-borderStrong',
        outline: 'bg-transparent text-text border border-borderStrong hover:bg-surfaceActive',
        ghost: 'bg-transparent text-textMuted hover:text-text hover:bg-surfaceActive border-transparent',
        danger: 'bg-danger text-white shadow-danger hover:brightness-110',
        success: 'bg-success text-white shadow-success hover:brightness-110',
        glass: 'bg-white/80 backdrop-blur-xl text-text border border-white/20 hover:bg-white/90',
        link: 'bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        xs: 'h-8 px-3 text-xs rounded-[10px]',
        sm: 'h-9 px-4 text-sm rounded-[12px]',
        md: 'h-11 px-5 text-sm rounded-[14px]',
        lg: 'h-13 px-6 text-base rounded-[14px]',
        xl: 'h-14 px-8 text-lg rounded-[16px]',
        icon: 'h-10 w-10 p-0 rounded-[12px]',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export const Button = forwardRef(function Button({
  className, variant, size, fullWidth, loading, leftIcon, rightIcon, children, ...props
}, ref) {
  return (
    <motion.button
      ref={ref}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      whileHover={props.disabled ? undefined : { y: -1 }}
      whileTap={props.disabled ? undefined : { scale: 0.97 }}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </motion.button>
  );
});

Button.displayName = 'Button';

export { buttonVariants };