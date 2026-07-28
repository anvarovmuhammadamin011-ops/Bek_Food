import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, TrendingUp, Star, Plus, Heart } from 'lucide-react';
import useStore from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { cn, formatPrice } from '../utils/cn';

const popularTags = ['Shashlik', 'Lavash', 'Gamburger', 'Kartoshka Fri', 'Manti', 'Sho\'rva', 'Kebab', 'Pitsa'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

export default function SearchPage() {
  const navigate = useNavigate();
  const { search, searchResults, recentSearches, toggleFavorite, addToCart, favorites } = useStore();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [addedIds, setAddedIds] = useState(new Set());
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) search(debouncedQuery);
  }, [debouncedQuery, search]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleAdd = (food) => {
    addToCart(food);
    setAddedIds((prev) => new Set(prev).add(food.id));
    setTimeout(() => setAddedIds((prev) => { const n = new Set(prev); n.delete(food.id); return n; }), 600);
  };

  const results = debouncedQuery ? searchResults : [];

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 pt-4 pb-3 border-b border-divider">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-textMuted pointer-events-none" />
          <input
            ref={inputRef}
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Taom yoki restoran..."
            className="w-full h-12 pl-11 pr-11 bg-surfaceActive text-text text-[15px] font-medium rounded-[14px] border-2 border-transparent focus:border-primary/50 focus:bg-surface focus:outline-none transition-all duration-200 placeholder:text-textDim"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-surfaceActive flex items-center justify-center"
              >
                <X className="w-4 h-4 text-textMuted" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="wait">
          {!debouncedQuery ? (
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-6"
            >
              {recentSearches.length > 0 && (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h3 className="text-[13px] font-semibold text-textMuted uppercase tracking-wider mb-3">
                    So'nggi qidiruvlar
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((s, i) => (
                      <motion.button
                        key={i}
                        variants={itemVariants}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setQuery(s)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface text-text text-[13px] font-medium rounded-[10px] border border-divider hover:border-borderStrong transition-colors shadow-sm"
                      >
                        <Clock className="w-3.5 h-3.5 text-textMuted" />
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <h3 className="text-[13px] font-semibold text-textMuted uppercase tracking-wider mb-3">
                  Mashhur
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, i) => (
                    <motion.button
                      key={tag}
                      variants={itemVariants}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setQuery(tag)}
                    >
                      <Badge
                        variant="primary"
                        size="md"
                        leftIcon={<TrendingUp className="w-3.5 h-3.5" />}
                        className="cursor-pointer"
                      >
                        {tag}
                      </Badge>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : results.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center pt-20 pb-8"
            >
              <div className="w-20 h-20 rounded-full bg-surfaceActive flex items-center justify-center mb-5">
                <Search className="w-10 h-10 text-textMuted" />
              </div>
              <h3 className="text-lg font-semibold text-text mb-1.5">Natija topilmadi</h3>
              <p className="text-sm text-textMuted">"{debouncedQuery}" bo'yicha hech narsa topilmadi</p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="p-4 space-y-3"
            >
              <motion.p variants={itemVariants} className="text-[13px] text-textMuted font-medium mb-1">
                {results.length} ta natija
              </motion.p>
              {results.map((item) => {
                const isFav = favorites.some((f) => f.type === item.type && f.id === item.id);
                const isAdded = item.type === 'food' && addedIds.has(item.id);

                if (item.type === 'restaurant') {
                  return (
                    <motion.div key={`r-${item.id}`} variants={itemVariants}>
                      <Card
                        variant="default"
                        padding="none"
                        hoverable
                        className="overflow-hidden"
                        onClick={() => navigate(`/restaurant/${item.id}`)}
                      >
                        <div className="relative h-[110px] overflow-hidden">
                          <img src={item.coverImage} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                          <div className="absolute bottom-3 left-4 right-4">
                            <h3 className="text-white text-[16px] font-bold">{item.name}</h3>
                            <p className="text-white/80 text-[12px] mt-0.5">{item.cuisine}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 px-4 py-3 text-[12px] text-textMuted font-medium">
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                            {item.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {item.deliveryTime} min
                          </span>
                        </div>
                      </Card>
                    </motion.div>
                  );
                }

                return (
                  <motion.div key={`f-${item.id}`} variants={itemVariants}>
                    <Card
                      variant="default"
                      padding="none"
                      className="overflow-hidden"
                    >
                      <div className="flex">
                        <div className="w-[100px] h-[100px] flex-shrink-0 overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="flex-1 min-w-0 p-3.5 pl-3">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1 mr-2">
                              <h3 className="text-[14px] font-semibold text-text truncate">{item.name}</h3>
                              <p className="text-[11px] text-textMuted mt-0.5 truncate">{item.description}</p>
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => toggleFavorite('food', item.id)}
                            >
                              <Heart
                                className={cn('w-[18px] h-[18px] flex-shrink-0', isFav ? 'text-danger fill-danger' : 'text-textDim')}
                              />
                            </motion.button>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-[11px] text-textMuted">
                              <Star className="w-3 h-3 text-warning fill-warning" />
                              {item.rating || 4.5}
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-textMuted">
                              <Clock className="w-3 h-3" />
                              {item.deliveryTime || 20} min
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2.5">
                            <div>
                              <span className="text-[15px] font-bold text-text tabular-nums">
                                {formatPrice(item.discountPrice || item.price)}
                              </span>
                              <span className="text-[11px] text-textMuted ml-0.5">so'm</span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAdd(item)}
                              className={cn(
                                'w-8 h-8 rounded-[10px] flex items-center justify-center transition-colors duration-200',
                                isAdded ? 'bg-success' : 'bg-primary'
                              )}
                            >
                              <Plus className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
                            </motion.button>
                          </div>
                        </div>
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