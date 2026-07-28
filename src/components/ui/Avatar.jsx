'use client';

import { forwardRef, memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
};

const statusSizeClasses = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5',
  '2xl': 'w-4 h-4',
};

const statusPositionClasses = {
  'bottom-right': 'bottom-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'top-right': 'top-0 right-0',
  'top-left': 'top-0 left-0',
};

const statusColors = {
  online: '#22C55E',
  offline: '#9CA3AF',
  busy: '#EF4444',
  away: '#F59E0B',
};

function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColorFromName(name) {
  const colors = [
    'bg-primary/10 text-primary',
    'bg-success/10 text-success',
    'bg-warning/10 text-warning',
    'bg-info/10 text-info',
    'bg-purple/10 text-purple',
    'bg-pink/10 text-pink',
    'bg-orange/10 text-orange',
    'bg-teal/10 text-teal',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export const Avatar = forwardRef(function Avatar({
  className, src, alt, fallback, name, size = 'md', shape = 'circle', status,
  statusPosition = 'bottom-right', border = false, hoverScale = false, children, ...props
}, ref) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const showFallback = !src || imageError || !isLoaded;

  return (
    <motion.div ref={ref}
      className={cn('relative inline-flex items-center justify-center overflow-hidden bg-surfaceActive flex-shrink-0',
        sizeClasses[size],
        shape === 'circle' ? 'rounded-full' : 'rounded-[12px]',
        border && 'ring-2 ring-surface',
        hoverScale && 'cursor-pointer transition-transform duration-200 hover:scale-105', className
      )}
      whileHover={hoverScale ? { scale: 1.05 } : undefined}
      whileTap={hoverScale ? { scale: 0.95 } : undefined}
      {...props}
    >
      {children || (
        <>
          {showFallback && !fallback ? (
            <motion.div className={cn('w-full h-full flex items-center justify-center font-semibold select-none', getColorFromName(name || ''), sizeClasses[size])}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}
            >
              {name ? getInitials(name) : '?'}
            </motion.div>
          ) : fallback ? (
            <motion.div className="w-full h-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            >
              {fallback}
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.img src={src} alt={alt || name || 'Avatar'} className="w-full h-full object-cover"
                style={{ opacity: isLoaded ? 1 : 0 }}
                onLoad={() => setIsLoaded(true)} onError={() => setImageError(true)}
                initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
              />
            </AnimatePresence>
          )}
        </>
      )}
      {status && (
        <motion.span className={cn('absolute rounded-full border-2 border-surface', statusSizeClasses[size], statusPositionClasses[statusPosition])}
          style={{ backgroundColor: statusColors[status] }}
          initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      )}
    </motion.div>
  );
});

Avatar.displayName = 'Avatar';

export const AvatarGroup = memo(function AvatarGroup({ avatars, max = 5, size = 'md', className, ...props }) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn('flex -space-x-2', className)} {...props}>
      {visibleAvatars.map((avatar, index) => (
        <motion.div key={avatar.key} style={{ zIndex: visibleAvatars.length - index }}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
        >
          <Avatar size={size} {...avatar} />
        </motion.div>
      ))}
      {remainingCount > 0 && (
        <motion.div className={cn('flex items-center justify-center font-semibold bg-surfaceActive text-textMuted border-2 border-surface flex-shrink-0', sizeClasses[size], 'rounded-full')}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: visibleAvatars.length * 0.05 }}
        >
          +{remainingCount}
        </motion.div>
      )}
    </div>
  );
});

AvatarGroup.displayName = 'AvatarGroup';