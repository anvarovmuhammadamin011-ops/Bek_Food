'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const skeletonVariants = {
  rect: 'rounded-[12px]',
  circle: 'rounded-full',
  text: 'rounded-[4px] h-4',
};

export const Skeleton = memo(function Skeleton({
  className, variant = 'rect', width, height, ...props
}) {
  return (
    <motion.div
      className={cn('animate-shimmer bg-surfaceActive', skeletonVariants[variant], className)}
      style={{ width, height }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      {...props}
    />
  );
});

Skeleton.displayName = 'Skeleton';

export const SkeletonCard = memo(function SkeletonCard({ className, ...props }) {
  return (
    <div className={cn('bg-surface border border-border rounded-[20px] p-5 space-y-4', className)} {...props}>
      <div className="flex items-center gap-4">
        <Skeleton variant="circle" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="80%" />
      <div className="flex gap-3 pt-2">
        <Skeleton variant="rect" width={80} height={36} />
        <Skeleton variant="rect" width={80} height={36} />
      </div>
    </div>
  );
});

SkeletonCard.displayName = 'SkeletonCard';

export const SkeletonList = memo(function SkeletonList({ count = 5, className, ...props }) {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-surface border border-border rounded-[16px]">
          <Skeleton variant="circle" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="30%" />
          </div>
          <Skeleton variant="rect" width={60} height={32} />
        </div>
      ))}
    </div>
  );
});

SkeletonList.displayName = 'SkeletonList';

export { skeletonVariants };