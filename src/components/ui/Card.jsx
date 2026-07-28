'use client';

import { forwardRef, memo } from 'react';
import { motion } from 'framer-motion';
import { cva, cn } from '../../utils/cn';

const cardVariants = cva(
  'rounded-[20px] border transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
  {
    variants: {
      variant: {
        default: 'bg-surface border-border shadow-sm hover:shadow-md',
        elevated: 'bg-surface border-border shadow-lg hover:shadow-xl',
        outlined: 'bg-transparent border-borderStrong',
        filled: 'bg-surfaceActive border-transparent',
        ghost: 'bg-transparent border-transparent hover:bg-surfaceActive',
        glass: 'bg-white/80 backdrop-blur-xl border-white/20',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-5',
        lg: 'p-6',
        xl: 'p-8',
      },
      hoverable: {
        true: 'hover:-translate-y-1 hover:shadow-lg cursor-pointer',
      },
    },
    defaultVariants: { variant: 'default', padding: 'md' },
  }
);

export const Card = forwardRef(function Card({
  className, variant, padding, hoverable, children, ...props
}, ref) {
  return (
    <motion.div
      ref={ref}
      className={cn(cardVariants({ variant, padding, hoverable }), className)}
      whileHover={hoverable ? { y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

const cardHeaderVariants = cva('flex flex-col gap-1.5', {
  variants: {
    align: {
      start: 'items-start',
      center: 'items-center',
      between: 'items-center justify-between',
    },
  },
  defaultVariants: { align: 'start' },
});

export const CardHeader = memo(function CardHeader({
  className, align = 'start', children, ...props
}) {
  return (
    <div className={cn(cardHeaderVariants({ align }), className)} {...props}>
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

export const CardTitle = memo(function CardTitle({
  className, children, ...props
}) {
  return (
    <motion.h3
      className={cn('text-xl font-bold text-text tracking-tight', className)}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      {...props}
    >
      {children}
    </motion.h3>
  );
});

CardTitle.displayName = 'CardTitle';

export const CardDescription = memo(function CardDescription({
  className, children, ...props
}) {
  return (
    <motion.p
      className={cn('text-sm text-textMuted', className)}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      {...props}
    >
      {children}
    </motion.p>
  );
});

CardDescription.displayName = 'CardDescription';

export const CardContent = memo(function CardContent({
  className, children, ...props
}) {
  return (
    <motion.div
      className={cn('pt-2', className)}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

CardContent.displayName = 'CardContent';

export const CardFooter = memo(function CardFooter({
  className, align = 'end', children, ...props
}) {
  const alignClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  };

  return (
    <motion.div
      className={cn('flex flex-wrap gap-3 pt-4 mt-2 border-t border-divider', alignClasses[align], className)}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

CardFooter.displayName = 'CardFooter';

export const StatCard = memo(function StatCard({
  label, value, trend, trendLabel, icon: Icon, iconColor = 'primary', className, ...props
}) {
  const iconColors = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    info: 'bg-info/10 text-info',
  };

  return (
    <Card variant="default" padding="lg" hoverable className={className} {...props}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-textSecondary">{label}</p>
          <motion.p
            className="text-3xl font-bold text-text mt-1 tabular-nums"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {value}
          </motion.p>
          {trend && (
            <motion.div
              className="flex items-center gap-1.5 mt-2"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className={cn('text-sm font-semibold', trend.startsWith('-') ? 'text-danger' : 'text-success')}>
                {trend}
              </span>
              {trendLabel && <span className="text-sm text-textMuted">{trendLabel}</span>}
            </motion.div>
          )}
        </div>
        {Icon && (
          <motion.div
            className={cn('w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0', iconColors[iconColor])}
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
          >
            <Icon className="w-6 h-6" />
          </motion.div>
        )}
      </div>
    </Card>
  );
});

StatCard.displayName = 'StatCard';

export { cardVariants };