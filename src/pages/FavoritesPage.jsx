import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, Clock, MapPin, Plus, ChevronRight } from 'lucide-react';
import useStore from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { cn, formatPrice } from '../utils/cn';

const tabs = [
  { id: 'foods', label: 'Taomlar' },
  { id: 'restaurants', label: 'Restoranlar' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, foods, restaurants, toggleFavorite, addToCart } = useStore();
  const [tab, setTab] = useState('foods');
  const [addedIds, setAddedIds] = useState(new Set());

  const favRestaurants = restaurants.filter((r) => favorites.some((f) => f.type === 'restaurant' && f.id === r.id));
  const favFoods = foods.filter((f) => favorites.some((fav) => fav.type === 'food' && fav.id === f.id));

  const handleAdd = (food) => {
    addToCart(food);
    setAddedIds((prev) => new Set(prev).add(food.id));
    setTimeout(() => setAddedIds((prev) => { const n = new Set(prev); n.delete(food.id); return n; }), 600);
  };

  const isEmpty = (tab === 'foods' ? favFoods : favRestaurants).length === 0;

  return (
    <div className="h-full overflow-y-auto scrollbar-hide pb-28">
      <div className="p-4 pt-6">
        <h1 className="text-[26px] font-bold text-text tracking-tight text-center mb-5">Sevimlilar</h1>

        <div className="flex bg-surfaceActive rounded-[12px] p-1 mb-5">
          {tabs.map((t) => {
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
                {t.label}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {isEmpty ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center pt-16 pb-8"
            >
              <div className="w-20 h-20 rounded-full bg-danger/10 flex items-center justify-center mb-5">
                <Heart className="w-10 h-10 text-danger" />
              </div>
              <h3 className="text-lg font-semibold text-text mb-1.5">Sevimlilar yo'q</h3>
              <p className="text-sm text-textMuted">Yurakcha bosib sevimlilarga qo'shing</p>
            </motion.div>
          ) : tab === 'foods' ? (
            <motion.div
              key="foods"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-3"
            >
              {favFoods.map((food) => {
                const isFav = favorites.some((f) => f.type === 'food' && f.id === food.id);
                const isAdded = addedIds.has(food.id);
                return (
                  <motion.div key={food.id} variants={cardVariants}>
                    <Card variant="default" padding="none" className="overflow-hidden">
                      <div className="relative h-[130px] bg-surfaceActive overflow-hidden">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {food.discountPrice && (
                          <Badge
                            variant="danger"
                            size="xs"
                            className="absolute top-2.5 left-2.5"
                          >
                            -{Math.round((1 - food.discountPrice / food.price) * 100)}%
                          </Badge>
                        )}
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={(e) => { e.stopPropagation(); toggleFavorite('food', food.id); }}
                          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm"
                        >
                          <Heart
                            className={cn('w-4 h-4', isFav ? 'text-danger fill-danger' : 'text-textMuted')}
                          />
                        </motion.button>
                        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                      <div className="p-3.5">
                        <h3 className="text-[14px] font-semibold text-text truncate">{food.name}</h3>
                        <p className="text-[11px] text-textMuted mt-0.5 truncate">{food.description}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex items-center gap-1 text-[11px] text-textMuted">
                            <Star className="w-3 h-3 text-warning fill-warning" />
                            {food.rating || 4.5}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-textMuted">
                            <Clock className="w-3 h-3" />
                            {food.deliveryTime || 20} min
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <span className="text-[15px] font-bold text-text tabular-nums">
                              {formatPrice(food.discountPrice || food.price)}
                            </span>
                            <span className="text-[11px] text-textMuted ml-0.5"> so'm</span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAdd(food)}
                            className={cn(
                              'w-8 h-8 rounded-[10px] flex items-center justify-center transition-colors duration-200',
                              isAdded ? 'bg-success shadow-sm' : 'bg-primary shadow-sm'
                            )}
                          >
                            <Plus className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
                          </motion.button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="restaurants"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {favRestaurants.map((r) => {
                const isFav = favorites.some((f) => f.type === 'restaurant' && f.id === r.id);
                return (
                  <motion.div key={r.id} variants={cardVariants}>
                    <Card
                      variant="default"
                      padding="none"
                      hoverable
                      className="overflow-hidden"
                      onClick={() => navigate(`/restaurant/${r.id}`)}
                    >
                      <div className="relative h-[130px] overflow-hidden">
                        <img src={r.coverImage} alt={r.name} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={(e) => { e.stopPropagation(); toggleFavorite('restaurant', r.id); }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm"
                        >
                          <Heart
                            className={cn('w-4 h-4', isFav ? 'text-danger fill-danger' : 'text-textMuted')}
                          />
                        </motion.button>
                        <div className="absolute bottom-3 left-4 right-4">
                          <h3 className="text-white text-[17px] font-bold">{r.name}</h3>
                          <p className="text-white/80 text-[12px] mt-0.5 font-medium">{r.cuisine}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 px-4 py-3 text-[12px] text-textMuted font-medium">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                          {r.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {r.deliveryTime} min
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {r.distance}
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 ml-auto text-textDim" />
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