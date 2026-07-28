import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, User, Flame, Star, Sparkles, Tag, TrendingUp,
  Heart, Plus, Clock, MapPin,
  UtensilsCrossed, Pizza, Beer, Cake, Salad
} from 'lucide-react';
import useStore from '../store/useStore';
import { cn, formatPrice } from '../utils/cn';
import { Skeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';

const CATEGORY_ICONS = {
  1: UtensilsCrossed,
  2: Pizza,
  3: Beer,
  4: Cake,
  5: Salad,
};

const FOOD_RATINGS = {
  1: 4.8, 2: 4.6, 3: 4.7, 4: 4.9, 5: 4.5,
  6: 4.3, 7: 4.4, 8: 4.2, 9: 4.1, 10: 4.6,
  11: 4.3, 12: 4.7,
};

const FOOD_PREP = {
  1: '20-25', 2: '15-20', 3: '25-30', 4: '10-15', 5: '15-20',
  6: '8-12', 7: '3-5', 8: '5-8', 9: '5-8', 10: '20-25',
  11: '20-25', 12: '10-15',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 200, damping: 25 },
  },
};

function FoodCard({ food }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const isFav = isFavorite('food', food.id);
  const hasDiscount = !!food.discountPrice;
  const discountPct = hasDiscount ? Math.round((1 - food.discountPrice / food.price) * 100) : 0;
  const rating = FOOD_RATINGS[food.id] || 4.5;
  const prep = FOOD_PREP[food.id] || '15-20';

  return (
    <motion.div
      variants={itemVariants}
      className="bg-surface rounded-[20px] overflow-hidden border border-border shadow-sm"
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative h-[140px] overflow-hidden bg-surfaceActive">
        {!imgLoaded && (
          <div className="absolute inset-0 z-10">
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </div>
        )}
        <motion.img
          src={food.image}
          alt={food.name}
          className={`w-full h-full object-cover ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
          initial={{ scale: 1.1 }}
          animate={imgLoaded ? { scale: 1 } : {}}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <motion.button
          onClick={() => toggleFavorite('food', food.id)}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center z-20"
          whileTap={{ scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
        >
          <Heart
            size={14}
            className={cn(
              'transition-colors duration-200',
              isFav ? 'fill-red-500 text-red-500' : 'text-white'
            )}
          />
        </motion.button>
        <div className="absolute top-2.5 left-2.5 z-20">
          <Badge variant="warning" size="xs" leftIcon={<Star size={10} className="fill-current" />}>
            {rating}
          </Badge>
        </div>
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5 z-20">
          <Clock size={10} className="text-white" />
          <span className="text-white text-[10px] font-medium leading-none">{prep} min</span>
        </div>
        {hasDiscount && (
          <div className="absolute bottom-2.5 right-2.5 z-20">
            <Badge variant="danger" size="xs">-{discountPct}%</Badge>
          </div>
        )}
      </div>
      <div className="p-3.5 space-y-2">
        <h3 className="font-bold text-text text-sm leading-tight truncate">{food.name}</h3>
        <p className="text-textMuted text-[11px] leading-tight truncate">{food.description}</p>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1">
            <span className={cn(
              'text-base font-bold',
              hasDiscount ? 'text-danger' : 'text-text'
            )}>
              {formatPrice(hasDiscount ? food.discountPrice : food.price)}
            </span>
            <span className="text-[10px] text-textMuted font-medium">so'm</span>
            {hasDiscount && (
              <span className="text-[10px] text-textMuted line-through ml-1">{formatPrice(food.price)}</span>
            )}
          </div>
          <motion.button
            onClick={() => addToCart(food)}
            className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg"
            style={{ boxShadow: '0 4px 12px rgba(249,115,22,0.3)' }}
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
          >
            <Plus size={14} strokeWidth={3} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function PromoCarousel({ banners }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);

  const goTo = useCallback((index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    timerRef.current = setInterval(next, 4000);
    return () => clearInterval(timerRef.current);
  }, [next]);

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 400 : -400, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -400 : 400, opacity: 0 }),
  };

  if (!banners.length) return null;

  return (
    <div className="relative overflow-hidden rounded-[20px] shadow-md">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="relative h-[180px] cursor-pointer"
        >
          <img
            src={banners[current].image}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white text-xl font-bold tracking-tight">{banners[current].title}</h3>
            <p className="text-white/70 text-sm mt-0.5">{banners[current].subtitle}</p>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-3 right-4 flex items-center gap-1.5 z-10">
        {banners.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 20 : 6,
              height: 6,
              backgroundColor: i === current ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
            }}
            whileTap={{ scale: 0.8 }}
            layout
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { banners, foods, categories, cart } = useStore();
  const [selectedCat, setSelectedCat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const discounted = foods.filter((f) => f.discountPrice);
  const popular = foods.filter((f) => f.isPopular);
  const recommendations = popular.filter((f) => !f.discountPrice);
  const comboItems = foods.slice(0, 4);
  const newItems = [...foods].reverse().slice(0, 4);
  const filtered = selectedCat ? foods.filter((f) => f.categoryId === selectedCat) : null;

  return (
    <motion.div
      className="h-full overflow-y-auto scrollbar-hide pb-28 bg-[var(--bg,#FAFAFA)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4">
        <motion.div
          className="flex items-center justify-between pt-4 pb-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div>
            <h1 className="text-2xl font-bold text-text tracking-tight leading-tight">Bek Food</h1>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={11} className="text-primary" />
              <span className="text-textMuted text-[11px] font-medium">Chinobod, O'zbekiston</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => navigate('/profile')}
              className="w-[42px] h-[42px] rounded-[14px] bg-surface border border-border flex items-center justify-center shadow-sm"
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
            >
              <User size={18} className="text-textMuted" />
            </motion.button>
            <motion.button
              onClick={() => navigate('/cart')}
              className="w-[42px] h-[42px] rounded-[14px] bg-surface border border-border flex items-center justify-center shadow-sm relative"
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
            >
              <ShoppingCart size={18} className="text-text" />
              {cart.length > 0 && (
                <motion.span
                  className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  {cart.length}
                </motion.span>
              )}
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {loading ? (
            <Skeleton variant="rectangular" height="180px" width="100%" className="rounded-[20px]" />
          ) : (
            <PromoCarousel banners={banners} />
          )}
        </motion.div>

        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {loading ? (
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="rectangular" width="100px" height="38px" className="rounded-full" />
              ))}
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
              {categories.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.id] || UtensilsCrossed;
                const isActive = selectedCat === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    onClick={() => setSelectedCat(isActive ? null : cat.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors flex-shrink-0',
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-surface text-textMuted border border-border hover:border-primary/30 hover:text-text'
                    )}
                    whileTap={{ scale: 0.92 }}
                    whileHover={isActive ? {} : { scale: 1.02 }}
                  >
                    <Icon size={14} />
                    {cat.name}
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>

        {filtered !== null && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-text">
                {categories.find((c) => c.id === selectedCat)?.name}
              </h2>
              <button
                onClick={() => setSelectedCat(null)}
                className="text-primary text-sm font-semibold"
              >
                Barchasi
              </button>
            </div>
            <motion.div
              className="grid grid-cols-2 gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filtered.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </motion.div>
            {filtered.length === 0 && (
              <div className="text-center py-10">
                <p className="text-textMuted text-sm">Bu kategoriyada mahsulot yo'q</p>
              </div>
            )}
          </motion.div>
        )}

        {filtered === null && (
          <>
            {!loading && popular.length > 0 && (
              <motion.div
                className="mb-7"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-[10px] bg-primary/10 flex items-center justify-center">
                    <Flame size={16} className="text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-text">Mashhur taomlar</h2>
                </div>
                <motion.div
                  className="grid grid-cols-2 gap-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {popular.map((food) => (
                    <FoodCard key={food.id} food={food} />
                  ))}
                </motion.div>
              </motion.div>
            )}

            {!loading && recommendations.length > 0 && (
              <motion.div
                className="mb-7"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-[10px] bg-warning/10 flex items-center justify-center">
                    <Star size={16} className="text-warning" />
                  </div>
                  <h2 className="text-lg font-bold text-text">Bugungi tavsiyalar</h2>
                </div>
                <motion.div
                  className="grid grid-cols-2 gap-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {recommendations.map((food) => (
                    <FoodCard key={food.id} food={food} />
                  ))}
                </motion.div>
              </motion.div>
            )}

            {!loading && comboItems.length > 0 && (
              <motion.div
                className="mb-7"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-[10px] bg-purple/10 flex items-center justify-center">
                    <Sparkles size={16} className="text-purple" />
                  </div>
                  <h2 className="text-lg font-bold text-text">Combo to'plamlar</h2>
                </div>
                <motion.div
                  className="grid grid-cols-2 gap-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {comboItems.map((food) => (
                    <FoodCard key={food.id} food={food} />
                  ))}
                </motion.div>
              </motion.div>
            )}

            {!loading && newItems.length > 0 && (
              <motion.div
                className="mb-7"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-[10px] bg-success/10 flex items-center justify-center">
                    <Tag size={16} className="text-success" />
                  </div>
                  <h2 className="text-lg font-bold text-text">Yangi qo'shilganlar</h2>
                </div>
                <motion.div
                  className="grid grid-cols-2 gap-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {newItems.map((food) => (
                    <FoodCard key={food.id} food={food} />
                  ))}
                </motion.div>
              </motion.div>
            )}

            {!loading && discounted.length > 0 && (
              <motion.div
                className="mb-7"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-[10px] bg-danger/10 flex items-center justify-center">
                    <TrendingUp size={16} className="text-danger" />
                  </div>
                  <h2 className="text-lg font-bold text-text">Chegirmadagi mahsulotlar</h2>
                </div>
                <motion.div
                  className="grid grid-cols-2 gap-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {discounted.map((food) => (
                    <FoodCard key={food.id} food={food} />
                  ))}
                </motion.div>
              </motion.div>
            )}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-7"
              >
                {[1, 2, 3].map((s) => (
                  <div key={s}>
                    <div className="flex items-center gap-2.5 mb-4">
                      <Skeleton variant="rectangular" width="32px" height="32px" className="rounded-[10px]" />
                      <Skeleton variant="text" width="160px" height="22px" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-surface rounded-[20px] overflow-hidden border border-border">
                          <Skeleton variant="rectangular" height="140px" width="100%" />
                          <div className="p-3.5 space-y-2">
                            <Skeleton variant="text" width="80%" height="16px" />
                            <Skeleton variant="text" width="60%" height="12px" />
                            <div className="flex items-center justify-between pt-1">
                              <Skeleton variant="text" width="60px" height="20px" />
                              <Skeleton variant="circular" width="32px" height="32px" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
