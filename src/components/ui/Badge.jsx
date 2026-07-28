'use client';

import { forwardRef, memo } from 'react';
import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-semibold transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]',
  {
    variants: {
      variant: {
        default: 'bg-surfaceActive text-text border border-divider',
        primary: 'bg-primary/10 text-primary border-primary/20',
        success: 'bg-success/10 text-success border-success/20',
        warning: 'bg-warning/10 text-warning border-warning/20',
        danger: 'bg-danger/10 text-danger border-danger/20',
        info: 'bg-info/10 text-info border-info/20',
        outline: 'bg-transparent text-text border-borderStrong',
        ghost: 'bg-transparent text-textMuted border-transparent hover:bg-surfaceActive',
      },
      size: {
        xs: 'px-2 py-0.5 text-[10px] rounded-[6px] gap-1',
        sm: 'px-2.5 py-1 text-xs rounded-[8px] gap-1',
        md: 'px-3 py-1 text-sm rounded-[10px] gap-1.5',
        lg: 'px-4 py-1.5 text-base rounded-[12px] gap-2',
      },
      dot: {
        true: '',
        false: '',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

export const Badge = forwardRef(function Badge({
  className, variant, size, dot, dotColor, leftIcon, rightIcon, children, ...props
}, ref) {
  return (
    <motion.span
      ref={ref}
      className={cn(badgeVariants({ variant, size, dot }), className)}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {dot && (
        <motion.span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: dotColor }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
        />
      )}
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span className="whitespace-nowrap">{children}</span>
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </motion.span>
  );
});

Badge.displayName = 'Badge';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold rounded-[10px]',
  {
    variants: {
      status: {
        pending: 'bg-warning/10 text-warning border-warning/20',
        preparing: 'bg-info/10 text-info border-info/20',
        ready: 'bg-success/10 text-success border-success/20',
        delivered: 'bg-success/10 text-success border-success/20',
        cancelled: 'bg-danger/10 text-danger border-danger/20',
        accepted: 'bg-info/10 text-info border-info/20',
        onTheWay: 'bg-purple/10 text-purple border-purple/20',
        active: 'bg-success/10 text-success border-success/20',
        inactive: 'bg-textDim/10 text-textDim border-textDim/20',
        new: 'bg-primary/10 text-primary border-primary/20',
        popular: 'bg-warning/10 text-warning border-warning/20',
      },
    },
    defaultVariants: { status: 'pending' },
  }
);

export const StatusBadge = memo(function StatusBadge({ status, children, className, dot = true, ...props }) {
  const statusLabels = {
    pending: 'Kutilmoqda',
    preparing: 'Tayyorlanmoqda',
    ready: 'Tayyor',
    delivered: 'Yetkazildi',
    cancelled: 'Bekor qilingan',
    accepted: 'Qabul qilingan',
    onTheWay: "Yo'lda",
    active: 'Faol',
    inactive: 'Nofaol',
    new: 'Yangi',
    popular: 'Mashhur',
  };

  return (
    <Badge
      variant="outline"
      size="md"
      dot={dot}
      dotColor={getDotColor(status)}
      className={cn(statusBadgeVariants({ status }), className)}
      {...props}
    >
      {children || statusLabels[status] || status}
    </Badge>
  );
});

function getDotColor(status) {
  const colors = {
    pending: '#F59E0B',
    preparing: '#3B82F6',
    ready: '#22C55E',
    delivered: '#22C55E',
    cancelled: '#EF4444',
    accepted: '#3B82F6',
    onTheWay: '#8B5CF6',
    active: '#22C55E',
    inactive: '#9CA3AF',
    new: '#F97316',
    popular: '#F59E0B',
  };
  return colors[status] || '#6B7280';
}

StatusBadge.displayName = 'StatusBadge';

const roleBadgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-[8px]',
  {
    variants: {
      role: {
        customer: 'bg-primary/10 text-primary border-primary/20',
        seller: 'bg-success/10 text-success border-success/20',
        courier: 'bg-info/10 text-info border-info/20',
        admin: 'bg-purple/10 text-purple border-purple/20',
      },
    },
    defaultVariants: { role: 'customer' },
  }
);

export const RoleBadge = memo(function RoleBadge({ role, children, className, ...props }) {
  const labels = { customer: 'Mijoz', seller: 'Sotuvchi', courier: 'Kuryer', admin: 'Admin' };
  return (
    <Badge variant="outline" size="sm" className={cn(roleBadgeVariants({ role }), className)} {...props}>
      {children || labels[role]}
    </Badge>
  );
});

RoleBadge.displayName = 'RoleBadge';

export { badgeVariants };