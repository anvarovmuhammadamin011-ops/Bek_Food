import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Star, Clock, Plus, Heart } from 'lucide-react';
import useStore from '../store/useStore';
import { cn } from '../utils/cn';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};

export default function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { restaurants, foods, categories, addToCart, toggleFavorite, isFavorite } = useStore();
  const restaurant = restaurants.find((r) => r.id === Number(id));
  const [activeCategory, setActiveCategory] = useState(null);
  const scrollRef = useRef(null);

  if (!restaurant) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-textMuted text-sm">Topilmadi</motion.p>
      </div>
    );
  }

  const restaurantFoods = foods.filter((f) => f.restaurantId === restaurant.id);
  const filtered = activeCategory ? restaurantFoods.filter((f) => f.categoryId === activeCategory) : restaurantFoods;
  const foodCats = [...new Set(restaurantFoods.map((f) => f.categoryId))];

  return (
    <motion.div className="h-full overflow-y-auto scrollbar-hide pb-28" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="relative h-[280px] overflow-hidden">
        <motion.img
          src={restaurant.coverImage}
          alt=""
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <motion.button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-xl rounded-xl shadow-sm border border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft size={20} className="text-text" />
          </motion.button>
          <motion.button
            onClick={() => toggleFavorite('restaurant', restaurant.id)}
            className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-xl rounded-xl shadow-sm border border-white/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart size={18} className={cn(isFavorite('restaurant', restaurant.id) ? 'text-danger fill-danger' : 'text-textMuted')} />
          </motion.button>
        </div>
      </div>

      <div className="px-4 -mt-10 relative z-10">
        <Card variant="default" padding="lg" className="shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-start gap-3.5 mb-3">
            <motion.div
              className="w-14 h-14 rounded-2xl border-2 border-border overflow-hidden flex-shrink-0"
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            >
              <img src={restaurant.logo} alt="" className="w-full h-full object-cover" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-text tracking-tight">{restaurant.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <Star size={13} className="text-primary fill-primary" />
                  <span className="text-xs font-semibold text-textMuted">{restaurant.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={13} className="text-textMuted" />
                  <span className="text-xs text-textMuted">{restaurant.deliveryTime} min</span>
                </div>
                {restaurant.minOrder > 0 && (
                  <Badge variant="outline" size="xs">Min: {restaurant.minOrder.toLocaleString()}</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Badge variant={restaurant.isOpen ? 'success' : 'danger'} size="sm" dot dotColor={restaurant.isOpen ? '#22C55E' : '#EF4444'}>
              {restaurant.isOpen ? 'Ishlamoqda' : 'Yopiq'}
            </Badge>
            <span className="text-xs text-textMuted">{restaurant.workingHours}</span>
          </div>
        </Card>

        <div ref={scrollRef} className="flex overflow-x-auto scrollbar-hide gap-2 mt-5 mb-4 pb-1">
          <motion.button
            onClick={() => setActiveCategory(null)}
            className={cn(
              'whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border flex-shrink-0',
              !activeCategory
                ? 'bg-primary text-white border-primary shadow-[0_4px_12px_rgba(249,115,22,0.3)]'
                : 'bg-surface text-textMuted border-border hover:border-primary/30'
            )}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Hammasi
          </motion.button>
          {foodCats.map((catId) => {
            const cat = categories.find((c) => c.id === catId);
            const isActive = activeCategory === catId;
            return (
              <motion.button
                key={catId}
                onClick={() => setActiveCategory(catId)}
                className={cn(
                  'whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border flex-shrink-0',
                  isActive
                    ? 'bg-primary text-white border-primary shadow-[0_4px_12px_rgba(249,115,22,0.3)]'
                    : 'bg-surface text-textMuted border-border hover:border-primary/30'
                )}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {cat?.name}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory || 'all'}
            className="grid grid-cols-2 gap-3 pb-8"
            variants={container}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            {filtered.length === 0 ? (
              <motion.div className="col-span-2 flex flex-col items-center py-16" variants={item}>
                <p className="text-sm text-textMuted">Bu kategoriyada mahsulot yoq</p>
              </motion.div>
            ) : (
              filtered.map((food) => (
                <FoodGridCard key={food.id} food={food} onAdd={addToCart} onFav={toggleFavorite} isFav={isFavorite('food', food.id)} />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function FoodGridCard({ food, onAdd, onFav, isFav }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAdd(food);
    setAdded(true);
    setTimeout(() => setAdded(false), 600);
  };

  return (
    <motion.div
      className="bg-surface rounded-[20px] border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      variants={item}
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative h-[130px] bg-surfaceActive overflow-hidden">
        {!imgLoaded && <div className="absolute inset-0 bg-surfaceActive animate-pulse" />}
        <img
          src={food.image}
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: imgLoaded ? 1 : 0 }}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
        />
        {food.discountPrice && (
          <Badge variant="danger" size="xs" className="absolute top-2.5 left-2.5 shadow-sm">
            -{Math.round((1 - food.discountPrice / food.price) * 100)}%
          </Badge>
        )}
        <motion.button
          onClick={(e) => { e.stopPropagation(); onFav('food', food.id); }}
          className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full shadow-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart size={12} className={cn(isFav ? 'text-danger fill-danger' : 'text-textMuted')} />
        </motion.button>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-text truncate">{food.name}</h3>
        <p className="text-xs text-textMuted truncate mt-0.5 mb-2.5">{food.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-text">{(food.discountPrice || food.price).toLocaleString()}</span>
            {food.discountPrice && (
              <span className="text-[11px] text-textMuted line-through">{food.price.toLocaleString()}</span>
            )}
          </div>
          <motion.button
            onClick={handleAdd}
            className={cn(
              'w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-300',
              added ? 'bg-success shadow-[0_4px_12px_rgba(34,197,94,0.3)]' : 'bg-primary shadow-[0_4px_12px_rgba(249,115,22,0.25)]'
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus size={15} className="text-white" strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
