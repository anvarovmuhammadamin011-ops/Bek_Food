import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, RotateCcw, ShoppingBag } from 'lucide-react';
import useStore from '../store/useStore';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import { cn, formatPrice } from '../utils/cn';

const tabs = [
  { id: 'all', label: "Barchasi" },
  { id: 'active', label: 'Faol' },
  { id: 'history', label: 'Tarix' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders } = useStore();
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = orders.filter((o) => {
    if (tab === 'active') return !['delivered', 'cancelled'].includes(o.status);
    if (tab === 'history') return ['delivered', 'cancelled'].includes(o.status);
    return true;
  });

  const statusIcon = (status) => {
    if (status === 'delivered' || status === 'ready') return CheckCircle;
    if (status === 'cancelled') return XCircle;
    return Clock;
  };

  if (loading) {
    return (
      <div className="h-full overflow-y-auto scrollbar-hide pb-28">
        <div className="p-4 pt-6">
          <div className="flex justify-center mb-6">
            <div className="w-48 h-8 bg-surfaceActive rounded-[10px] animate-pulse" />
          </div>
          <SkeletonCard variant="order" count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="p-4 pt-6">
        <h1 className="text-[26px] font-bold text-text tracking-tight text-center mb-5">Buyurtmalar</h1>

        <div className="flex bg-surfaceActive rounded-[12px] p-1 mb-5">
          {tabs.map((t) => {
            const count = t.id === 'all' ? orders.length
              : t.id === 'active' ? orders.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length
              : orders.filter((o) => ['delivered', 'cancelled'].includes(o.status)).length;
            const isActive = tab === t.id;
            return (
              <motion.button
                key={t.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex-1 py-2.5 text-sm font-semibold rounded-[10px] transition-all duration-200',
                  isActive ? 'bg-surface text-text shadow-sm' : 'text-textMuted hover:text-text'
                )}
              >
                {t.label}{count > 0 ? ` (${count})` : ''}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center pt-16 pb-8"
            >
              <div className="w-20 h-20 rounded-full bg-surfaceActive flex items-center justify-center mb-5">
                {tab === 'history' ? (
                  <CheckCircle className="w-10 h-10 text-textMuted" />
                ) : tab === 'active' ? (
                  <Clock className="w-10 h-10 text-textMuted" />
                ) : (
                  <ShoppingBag className="w-10 h-10 text-textMuted" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-text mb-1.5">Buyurtma yo'q</h3>
              <p className="text-sm text-textMuted">Hozircha buyurtmalar mavjud emas</p>
            </motion.div>
          ) : (
            <motion.div
              key={tab}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {filtered.map((order) => {
                const StatusIcon = statusIcon(order.status);
                return (
                  <motion.div key={order.id} variants={cardVariants}>
                    <Card variant="default" padding="md">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-[13px] font-semibold text-text">
                            Buyurtma #{String(order.id).slice(-6)}
                          </p>
                          <p className="text-xs text-textMuted mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString('uz-UZ', {
                              day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item, i) => (
                            <div
                              key={i}
                              className="w-9 h-9 rounded-[10px] border-2 border-surface overflow-hidden"
                              style={{ zIndex: 3 - i }}
                            >
                              <img
                                src={item.food.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-9 h-9 rounded-[10px] bg-surfaceActive border-2 border-surface flex items-center justify-center text-[11px] font-semibold text-textMuted">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-textMuted font-medium">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} ta mahsulot
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-divider">
                        <div>
                          <p className="text-[13px] text-textMuted font-medium">Jami</p>
                          <p className="text-[17px] font-bold text-text tabular-nums">
                            {formatPrice(order.total)} so'm
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 text-primary text-[13px] font-semibold rounded-[10px] hover:bg-primary/15 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Qayta buyurtma
                        </motion.button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}