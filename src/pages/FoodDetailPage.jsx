import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Heart, Star, Clock, Flame, Plus, Minus, ShoppingCart, Check, Share2 } from 'lucide-react';
import useStore from '../store/useStore';
import { cn, formatPrice } from '../utils/cn';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
};

const mockReviews = [
  { id: 1, name: 'Aziz', rating: 5, text: 'Ajoyib taom, albatta tavsiya qilaman!', date: '2024-12-15' },
  { id: 2, name: 'Sardor', rating: 4, text: 'Mazali, lekin biroz kutishga to\'g\'ri keldi', date: '2024-12-10' },
  { id: 3, name: 'Jamshid', rating: 5, text: 'Eng yaxshi shashlik, doim buyurtma beraman', date: '2024-11-28' },
];

export default function FoodDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { foods, addToCart, toggleFavorite, isFavorite } = useStore();
  const food = foods.find((f) => f.id === Number(id));

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const imageScale = useTransform(scrollYProgress, [0, 0.3], [1.1, 1]);
  const imageY = useTransform(scrollYProgress, [0, 0.3], [0, 80]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  if (!food) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8" style={{ background: 'var(--bg)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-surfaceActive flex items-center justify-center mx-auto mb-4">
            <ShoppingCart size={32} style={{ color: 'var(--text-muted)' }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Taom topilmadi</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Bu taom mavjud emas yoki olib tashlangan</p>
          <Button variant="primary" onClick={() => navigate(-1)}>
            <ChevronLeft size={18} />
            Orqaga qaytish
          </Button>
        </motion.div>
      </div>
    );
  }

  const basePrice = food.discountPrice || food.price;
  const totalPrice = basePrice * quantity;
  const fav = isFavorite('food', food.id);
  const relatedFoods = foods.filter((f) => f.categoryId === food.categoryId && f.id !== food.id).slice(0, 4);

  const galleryImages = [
    food.image,
    food.image.replace('w=400', 'w=800'),
    food.image.replace('fit=crop', 'fit=fill'),
  ];

  const handleAdd = () => {
    addToCart(food, quantity, [], notes);
    setAdded(true);
    setTimeout(() => { setAdded(false); navigate(-1); }, 800);
  };

  const rating = 4.8;
  const prepTime = '20-30';

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto scrollbar-hide pb-28" style={{ background: 'var(--bg)' }}>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <div className="relative" style={{ height: 420, overflow: 'hidden' }}>
          <motion.div
            style={{ scale: imageScale, y: imageY }}
            className="w-full h-full"
          >
            <motion.img
              src={food.image}
              alt={food.name}
              className="w-full h-full object-cover"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              style={{ willChange: 'transform' }}
            />
          </motion.div>

          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.15) 40%, transparent 65%)',
              opacity: overlayOpacity,
            }}
          />

          <motion.div style={{ opacity: headerOpacity }}>
            <div className="absolute inset-x-0 top-0" style={{ height: 180, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)' }} />
          </motion.div>

          <div className="absolute top-0 inset-x-0 z-20" style={{ paddingTop: 'env(safe-area-inset-top, 12px)' }}>
            <div className="flex items-center justify-between px-4 pt-3">
              <motion.button
                onClick={() => navigate(-1)}
                className="w-10 h-10 flex items-center justify-center rounded-full glass-strong"
                style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              >
                <ChevronLeft size={20} style={{ color: 'var(--text)' }} />
              </motion.button>

              <div className="flex items-center gap-2">
                <motion.button
                  className="w-10 h-10 flex items-center justify-center rounded-full glass-strong"
                  style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.05 }}
                >
                  <Share2 size={18} style={{ color: 'var(--text)' }} />
                </motion.button>
                <motion.button
                  onClick={() => toggleFavorite('food', food.id)}
                  className="w-10 h-10 flex items-center justify-center rounded-full glass-strong"
                  style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.1 }}
                >
                  <Heart
                    size={18}
                    style={{ color: fav ? 'var(--danger)' : 'var(--text)' }}
                    fill={fav ? 'var(--danger)' : 'none'}
                  />
                </motion.button>
              </div>
            </div>
          </div>

          {galleryImages.length > 1 && (
            <motion.div
              className="absolute bottom-4 left-1/2 flex items-center gap-1.5 z-20"
              style={{ transform: 'translateX(-50%)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {galleryImages.map((_, i) => (
                <motion.button
                  key={i}
                  className="rounded-full"
                  style={{
                    width: selectedImage === i ? 20 : 6,
                    height: 6,
                    background: selectedImage === i ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  }}
                  onClick={() => setSelectedImage(i)}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </motion.div>
          )}
        </div>

        <div className="px-4" style={{ marginTop: -32, position: 'relative', zIndex: 10 }}>
          <Card variant="glass" padding="lg" className="mb-3">
            <motion.div variants={itemVariants}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-extrabold tracking-tight mb-1" style={{ color: 'var(--text)' }}>{food.name}</h1>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{food.description}</p>
                </div>
                {food.discountPrice && (
                  <Badge variant="danger" size="sm">
                    -{Math.round((1 - food.discountPrice / food.price) * 100)}%
                  </Badge>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-1" style={{ color: 'var(--warning)' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div
                    key={star}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + star * 0.04, type: 'spring', stiffness: 400 }}
                  >
                    <Star size={14} fill={star <= Math.round(rating) ? 'var(--warning)' : 'none'} strokeWidth={star <= Math.round(rating) ? 0 : 1.5} />
                  </motion.div>
                ))}
              </div>
              <span className="text-sm font-semibold">{rating}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>(124 ta sharh)</span>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-2 mt-4">
              <Badge variant="primary" size="sm" leftIcon={<Flame size={12} />}>
                {food.calories || 0} kcal
              </Badge>
              <Badge variant="info" size="sm" leftIcon={<Clock size={12} />}>
                {prepTime} daqiqa
              </Badge>
              {food.spiceLevel > 0 && (
                <Badge variant="warning" size="sm">
                  {'*'.repeat(food.spiceLevel)}
                </Badge>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-5">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--primary)' }}>
                  {formatPrice(totalPrice)} so'm
                </span>
                {food.discountPrice && (
                  <span className="text-sm line-through" style={{ color: 'var(--text-muted)' }}>
                    {formatPrice(food.price * quantity)} so'm
                  </span>
                )}
              </div>
            </motion.div>

            {food.ingredients?.length > 0 && (
              <motion.div variants={itemVariants} className="mt-5">
                <h3 className="text-sm font-semibold mb-2.5" style={{ color: 'var(--text-secondary)' }}>Masalliqlar</h3>
                <div className="flex flex-wrap gap-2">
                  {food.ingredients.map((ing, i) => (
                    <motion.span
                      key={i}
                      className="px-3 py-1.5 text-xs font-medium rounded-full"
                      style={{ background: 'var(--surface-active)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                    >
                      {ing}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="mt-5">
              <h3 className="text-sm font-semibold mb-2.5" style={{ color: 'var(--text-secondary)' }}>Maxsus talablar</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Achchiq qiling, piyozsiz..."
                className="w-full text-sm rounded-2xl border px-4 py-3 resize-none"
                style={{
                  background: 'var(--surface-active)',
                  borderColor: 'var(--border-strong)',
                  color: 'var(--text)',
                  minHeight: 80,
                  outline: 'none',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-strong)'; e.target.style.boxShadow = 'none'; }}
              />
            </motion.div>
          </Card>

          <motion.div variants={itemVariants}>
            <Card variant="glass" padding="lg" className="mb-3">
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>Sharhlar</h3>
              <div className="space-y-4">
                {mockReviews.map((review, i) => (
                  <motion.div
                    key={review.id}
                    className="pb-4"
                    style={{ borderBottom: i < mockReviews.length - 1 ? '1px solid var(--border)' : 'none' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: 'var(--primary-50)', color: 'var(--primary)' }}
                        >
                          {review.name[0]}
                        </div>
                        <span className="text-sm font-semibold">{review.name}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, s) => (
                          <Star key={s} size={11} fill={s < review.rating ? 'var(--warning)' : 'none'} strokeWidth={s < review.rating ? 0 : 1.5} style={{ color: s < review.rating ? 'var(--warning)' : 'var(--text-dim)' }} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm ml-10" style={{ color: 'var(--text-secondary)' }}>{review.text}</p>
                  </motion.div>
                ))}
              </div>
              <motion.button
                className="w-full mt-4 py-2.5 text-sm font-semibold rounded-2xl transition-all"
                style={{ background: 'var(--surface-active)', color: 'var(--text)' }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                Barcha sharhlarni ko'rish
              </motion.button>
            </Card>
          </motion.div>

          {relatedFoods.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card variant="glass" padding="lg" className="mb-3">
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>O'xshash taomlar</h3>
                <div className="grid grid-cols-2 gap-3">
                  {relatedFoods.map((item, i) => {
                    const itemPrice = item.discountPrice || item.price;
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => { navigate(`/food/${item.id}`); setQuantity(1); setSelectedImage(0); }}
                        className="text-left overflow-hidden rounded-2xl border"
                        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.06 }}
                        whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" style={{ transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)' }} />
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-semibold truncate">{item.name}</p>
                          <p className="text-sm font-bold mt-1" style={{ color: 'var(--primary)' }}>{formatPrice(itemPrice)} so'm</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div
        className="fixed bottom-0 inset-x-0 z-40"
        style={{
          padding: '12px 16px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          borderTop: '1px solid var(--border)',
        }}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.2 }}
      >
        <div className="flex items-center gap-3" style={{ maxWidth: 480, margin: '0 auto' }}>
          <motion.div
            className="flex items-center rounded-2xl"
            style={{ background: 'var(--surface-active)', border: '1px solid var(--border)' }}
            layout
          >
            <motion.button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex items-center justify-center"
              style={{ width: 44, height: 44, color: 'var(--text-muted)' }}
              whileTap={{ scale: 0.9 }}
              disabled={quantity <= 1}
            >
              <Minus size={18} />
            </motion.button>
            <motion.span
              key={quantity}
              className="text-base font-bold text-center tabular-nums"
              style={{ minWidth: 36, color: 'var(--text)' }}
              initial={{ scale: 1.3, color: 'var(--primary)' }}
              animate={{ scale: 1, color: 'var(--text)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {quantity}
            </motion.span>
            <motion.button
              onClick={() => setQuantity(quantity + 1)}
              className="flex items-center justify-center"
              style={{ width: 44, height: 44, color: 'var(--text-muted)' }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus size={18} />
            </motion.button>
          </motion.div>

          <AnimatePresence mode="wait">
            {added ? (
              <motion.button
                key="added"
                className="flex-1 h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                style={{ background: 'var(--success)', color: 'white', boxShadow: '0 8px 30px rgba(34,197,94,0.2)' }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Check size={20} />
                Qo'shildi
              </motion.button>
            ) : (
              <motion.button
                key="add"
                onClick={handleAdd}
                className="flex-1 h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  boxShadow: '0 8px 30px rgba(249,115,22,0.2)',
                }}
                whileHover={{ scale: 1.01, boxShadow: '0 12px 40px rgba(249,115,22,0.25)' }}
                whileTap={{ scale: 0.97 }}
              >
                <ShoppingCart size={18} />
                Savatga qo'shish — {formatPrice(totalPrice)} so'm
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}