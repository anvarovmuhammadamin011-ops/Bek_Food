import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, Heart, MapPin, CreditCard, Star,
  Tag, MessageSquare, Settings, ChevronRight, LogOut,
  Package, Gift, Award
} from 'lucide-react';
import useStore from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { cn, formatPrice } from '../utils/cn';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

const menuItems = [
  { icon: ClipboardList, label: 'Buyurtmalar tarixi', path: '/orders' },
  { icon: Heart, label: 'Sevimli taomlar', path: '/favorites' },
  { icon: MapPin, label: 'Manzillar', path: '/addresses' },
  { icon: CreditCard, label: "To'lov kartalari", path: '/payments' },
  { icon: Star, label: 'Bonus ballari', path: '/bonuses' },
  { icon: Tag, label: 'Promo kodlar', path: '/promocodes' },
  { icon: MessageSquare, label: 'Sharhlar', path: '/reviews' },
  { icon: Settings, label: 'Sozlamalar', path: '/settings' },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, orders, favorites, logout, isAuthenticated } = useStore();

  const handleLogout = () => { logout(); navigate('/login'); };

  if (!isAuthenticated) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className="flex flex-col items-center text-center"
        >
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Award className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-text tracking-tight mb-2">Profilingizga kiring</h2>
          <p className="text-textMuted text-sm mb-8 max-w-[240px]">Buyurtma berish uchun kirish kerak</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="px-10 py-3.5 bg-primary text-white font-semibold text-[15px] rounded-[14px] shadow-lg shadow-primary/20"
          >
            Kirish
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const stats = [
    { icon: Package, label: 'Buyurtmalar', value: orders.length, color: 'primary' },
    { icon: Heart, label: 'Sevimlilar', value: favorites.length, color: 'danger' },
    { icon: Gift, label: 'Bonus', value: formatPrice(user?.bonus || 0), color: 'warning' },
  ];

  const points = user?.bonus || 0;
  const maxPoints = 1000;
  const progress = Math.min(points / maxPoints, 1);
  const tiers = [
    { label: 'Standart', min: 0, icon: Award },
    { label: 'Kumush', min: 250, icon: Award },
    { label: 'Oltin', min: 500, icon: Award },
    { label: 'Platina', min: 1000, icon: Award },
  ];
  let currentTierIdx = 0;
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (points >= tiers[i].min) { currentTierIdx = i; break; }
  }
  const currentTier = tiers[currentTierIdx];
  const nextTier = currentTierIdx < tiers.length - 1 ? tiers[currentTierIdx + 1] : null;
  const needsForNext = nextTier ? Math.max(0, nextTier.min - points) : 0;

  const colorMap = {
    primary: 'bg-primary/10 text-primary',
    danger: 'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-warning',
  };
  const iconColorMap = {
    primary: 'primary',
    danger: 'danger',
    warning: 'warning',
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <motion.div
        className="p-4 space-y-5 mt-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex flex-col items-center pt-8 pb-2">
          <Avatar name={user?.name || 'B'} size="2xl" className="ring-4 ring-primary/15 mb-4" />
          <h1 className="text-[26px] font-bold text-text tracking-tight">{user?.name || 'Foydalanuvchi'}</h1>
          <p className="text-textMuted text-sm mt-1">{user?.phone || '+998901234567'}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} variant="default" padding="sm" className="text-center">
                <div className={cn('w-10 h-10 rounded-[12px] flex items-center justify-center mx-auto mb-2', colorMap[stat.color])}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-lg font-bold text-text tabular-nums">{stat.value}</p>
                <p className="text-[11px] text-textMuted mt-[2px] font-medium">{stat.label}</p>
              </Card>
            );
          })}
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card variant="elevated" padding="lg" className="overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[15px] font-semibold text-text">
                  <span className="text-primary">{currentTier.label}</span> a'zosi
                </p>
                <p className="text-xs text-textMuted mt-1">
                  {nextTier
                    ? `${formatPrice(needsForNext)} so'm qoldi ${nextTier.label} uchun`
                    : "Eng yuqori darajaga yetdingiz"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-[14px] bg-primary/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="w-full h-2.5 bg-surfaceActive rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-warning"
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-textMuted">
                <span className="font-semibold text-primary">{formatPrice(points)}</span> ball
              </p>
              <Badge variant="primary" size="xs">{currentTier.label}</Badge>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card variant="default" padding="none" className="divide-y divide-divider overflow-hidden rounded-[20px]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.path}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center justify-between px-5 py-[17px] bg-surface hover:bg-surfaceActive transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-[10px] bg-surfaceActive flex items-center justify-center">
                      <Icon className="w-[18px] h-[18px] text-textMuted" />
                    </div>
                    <span className="text-[15px] font-medium text-text">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-textDim" />
                </motion.button>
              );
            })}
          </Card>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 py-[17px] rounded-[16px] border border-danger/20 text-danger font-semibold text-[15px] bg-transparent hover:bg-danger/5 transition-colors duration-200"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Chiqish
        </motion.button>
      </motion.div>
    </div>
  );
}