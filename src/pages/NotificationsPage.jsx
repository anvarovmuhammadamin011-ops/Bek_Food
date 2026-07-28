import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellRing, ShoppingBag, Gift } from 'lucide-react';
import useStore from '../store/useStore';
import { cn } from '../utils/cn';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { timeAgo } from '../utils/cn';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const notifItem = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};

const typeIcons = {
  order: ShoppingBag,
  promo: Gift,
};

const typeColors = {
  order: 'bg-primary/10 text-primary',
  promo: 'bg-warning/10 text-warning',
};

export default function NotificationsPage() {
  const { notifications, markNotifRead, clearNotifs } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="h-full overflow-y-auto scrollbar-hide pb-28">
        <div className="px-4 pt-4 pb-2">
          <div className="w-32 h-7 rounded-lg bg-surfaceActive animate-pulse mb-5" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-surfaceActive animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-4 rounded-md bg-surfaceActive animate-pulse" />
                <div className="w-full h-3 rounded-md bg-surfaceActive animate-pulse" />
                <div className="w-16 h-2.5 rounded-md bg-surfaceActive animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div className="h-full overflow-y-auto scrollbar-hide pb-28" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="px-4 pt-4 pb-2 flex items-center justify-between mb-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold text-text">Bildirishnomalar</h1>
          {unreadCount > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Badge variant="primary" size="xs">{unreadCount}</Badge>
            </motion.div>
          )}
        </div>
        {notifications.length > 0 && (
          <motion.button
            onClick={clearNotifs}
            className="text-xs font-semibold text-primary bg-primary/10 px-3.5 py-1.5 rounded-[10px]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Hammasini oqish
          </motion.button>
        )}
      </div>

      <div className="px-4 space-y-2">
        <AnimatePresence mode="popLayout">
          {notifications.length === 0 ? (
            <motion.div
              className="flex flex-col items-center py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div
                className="w-16 h-16 rounded-[20px] bg-primary/10 flex items-center justify-center mb-4"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BellRing size={28} className="text-primary" />
              </motion.div>
              <h3 className="text-base font-bold text-text mb-1">Bildirishnoma yoq</h3>
              <p className="text-sm text-textMuted">Yangiliklar va buyurtma holati haqida xabarlar keladi</p>
            </motion.div>
          ) : (
            <motion.div className="space-y-2" variants={container} initial="hidden" animate="show">
              {notifications.map((n) => {
                const Icon = typeIcons[n.type] || Bell;
                const colorClass = typeColors[n.type] || 'bg-primary/10 text-primary';
                return (
                  <motion.button
                    key={n.id}
                    onClick={() => markNotifRead(n.id)}
                    className="w-full text-left"
                    variants={notifItem}
                    layout
                  >
                    <Card
                      variant="default"
                      padding="md"
                      className={cn('cursor-pointer transition-all duration-200', !n.isRead && 'border-primary/20')}
                      hoverable
                    >
                      <div className="flex items-start gap-3">
                        <motion.div
                          className={cn('w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0', colorClass)}
                          whileHover={{ scale: 1.1 }}
                        >
                          <Icon size={16} />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={cn('text-sm truncate', !n.isRead ? 'font-bold text-text' : 'font-medium text-text')}>
                              {n.title}
                            </h4>
                            <span className="text-[11px] text-textMuted whitespace-nowrap flex-shrink-0">{timeAgo(n.time)}</span>
                          </div>
                          <p className="text-xs text-textMuted mt-1 line-clamp-2">{n.message}</p>
                        </div>
                        {!n.isRead && (
                          <motion.div
                            className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          />
                        )}
                      </div>
                    </Card>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
