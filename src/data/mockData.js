export const categories = [
  { id: 1, name: 'Mini Burgers', icon: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200' },
  { id: 2, name: 'Snack Pizza', icon: '🍕', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200' },
  { id: 3, name: 'Chicken Bites', icon: '🍗', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=200' },
  { id: 4, name: 'Hot Dogs', icon: '🌭', image: 'https://images.unsplash.com/photo-1612392062120-e5a0e2e4f5b4?w=200' },
  { id: 5, name: 'Wraps & Lavash', icon: '🫓', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=200' },
  { id: 6, name: 'Sides', icon: '🍟', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200' },
  { id: 7, name: 'Drinks', icon: '🥤', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200' },
  { id: 8, name: 'Desserts', icon: '🍦', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200' },
];

export const restaurants = [
  {
    id: 1, name: 'Mini Burger Hub', logo: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=100',
    coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    rating: 4.8, deliveryTime: '8-12', distance: '0.5 km', isOpen: true, minOrder: 15000,
    address: 'Tashkent, Amir Temur street 78', latitude: 41.3111, longitude: 69.2797, categoryId: 1,
  },
  {
    id: 2, name: 'Pizza Bite', logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100',
    coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    rating: 4.6, deliveryTime: '10-15', distance: '0.8 km', isOpen: true, minOrder: 20000,
    address: 'Tashkent, Navoi street 34', latitude: 41.3028, longitude: 69.2856, categoryId: 2,
  },
  {
    id: 3, name: 'Chicken Express', logo: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=100',
    coverImage: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800',
    rating: 4.5, deliveryTime: '8-12', distance: '0.3 km', isOpen: true, minOrder: 12000,
    address: 'Tashkent, Buyuk Ipak Yoli 56', latitude: 41.3089, longitude: 69.2721, categoryId: 3,
  },
  {
    id: 4, name: 'Quick Wrap', logo: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=100',
    coverImage: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800',
    rating: 4.7, deliveryTime: '10-15', distance: '1.0 km', isOpen: true, minOrder: 18000,
    address: 'Tashkent, Shayxontohur district', latitude: 41.2956, longitude: 69.2678, categoryId: 5,
  },
  {
    id: 5, name: 'Snack Attack', logo: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=100',
    coverImage: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
    rating: 4.9, deliveryTime: '5-8', distance: '0.2 km', isOpen: true, minOrder: 10000,
    address: 'Tashkent, Mirzo Ulugbek district', latitude: 41.3256, longitude: 69.3123, categoryId: 8,
  },
];

export const foods = [
  { id: 1, restaurantId: 1, categoryId: 1, name: 'Mini Slider', description: '2 bite-sized beef sliders', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', price: 18000, discountPrice: 15000, calories: 320, ingredients: ['Beef', 'Mini Bun', 'Lettuce', 'Sauce'], spiceLevel: 1, isAvailable: true, isPopular: true, isRecommended: true, prepTime: 5 },
  { id: 2, restaurantId: 1, categoryId: 1, name: 'Cheese Slider', description: 'Mini cheeseburger with pickles', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', price: 20000, discountPrice: null, calories: 350, ingredients: ['Beef', 'Cheese', 'Pickle', 'Mini Bun'], spiceLevel: 0, isAvailable: true, isPopular: true, isRecommended: false, prepTime: 5 },
  { id: 3, restaurantId: 2, categoryId: 2, name: 'Pizza Slice', description: 'Single slice pepperoni', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', price: 12000, discountPrice: 10000, calories: 280, ingredients: ['Dough', 'Tomato', 'Mozzarella', 'Pepperoni'], spiceLevel: 1, isAvailable: true, isPopular: true, isRecommended: true, prepTime: 8 },
  { id: 4, restaurantId: 2, categoryId: 2, name: 'Mini Margherita', description: '4-inch personal pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', price: 15000, discountPrice: null, calories: 310, ingredients: ['Dough', 'Tomato', 'Mozzarella', 'Basil'], spiceLevel: 0, isAvailable: true, isPopular: false, isRecommended: true, prepTime: 10 },
  { id: 5, restaurantId: 3, categoryId: 3, name: '5pc Chicken Bites', description: '5 pieces crispy chicken nuggets', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400', price: 16000, discountPrice: 13000, calories: 290, ingredients: ['Chicken', 'Breading', 'Spices'], spiceLevel: 2, isAvailable: true, isPopular: true, isRecommended: true, prepTime: 6 },
  { id: 6, restaurantId: 3, categoryId: 3, name: 'Wings 4pc', description: '4 spicy chicken wings', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400', price: 22000, discountPrice: null, calories: 380, ingredients: ['Chicken Wings', 'Hot Sauce', 'Spices'], spiceLevel: 3, isAvailable: true, isPopular: true, isRecommended: false, prepTime: 8 },
  { id: 7, restaurantId: 4, categoryId: 5, name: 'Mini Lavash', description: 'Small chicken wrap with veggies', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400', price: 14000, discountPrice: 12000, calories: 260, ingredients: ['Lavash', 'Chicken', 'Tomato', 'Sauce'], spiceLevel: 1, isAvailable: true, isPopular: true, isRecommended: true, prepTime: 5 },
  { id: 8, restaurantId: 5, categoryId: 8, name: 'Mini Ice Cream', description: 'Single scoop vanilla/chocolate', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400', price: 8000, discountPrice: null, calories: 180, ingredients: ['Milk', 'Sugar', 'Cream'], spiceLevel: 0, isAvailable: true, isPopular: true, isRecommended: true, prepTime: 2 },
  { id: 9, restaurantId: 1, categoryId: 4, name: 'Mini Hot Dog', description: 'Bite-sized hot dog with mustard', image: 'https://images.unsplash.com/photo-1612392062120-e5a0e2e4f5b4?w=400', price: 10000, discountPrice: 8000, calories: 220, ingredients: ['Sausage', 'Mini Bun', 'Mustard'], spiceLevel: 0, isAvailable: true, isPopular: false, isRecommended: true, prepTime: 4 },
  { id: 10, restaurantId: 3, categoryId: 7, name: 'Small Lemonade', description: '250ml fresh lemonade', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', price: 6000, discountPrice: null, calories: 80, ingredients: ['Lemon', 'Sugar', 'Water'], spiceLevel: 0, isAvailable: true, isPopular: true, isRecommended: true, prepTime: 2 },
  { id: 11, restaurantId: 5, categoryId: 6, name: 'Small Fries', description: 'Crispy mini portion fries', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', price: 8000, discountPrice: 6000, calories: 200, ingredients: ['Potato', 'Salt', 'Oil'], spiceLevel: 0, isAvailable: true, isPopular: true, isRecommended: true, prepTime: 3 },
  { id: 12, restaurantId: 4, categoryId: 5, name: 'Falafel Wrap', description: '3 mini falafel in lavash', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400', price: 12000, discountPrice: null, calories: 240, ingredients: ['Lavash', 'Falafel', 'Tahini', 'Lettuce'], spiceLevel: 1, isAvailable: true, isPopular: false, isRecommended: true, prepTime: 6 },
];

export const banners = [
  { id: 1, title: '50% OFF', subtitle: 'Mini Sliders', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', linkType: 'restaurant', linkId: 1 },
  { id: 2, title: 'Quick Bite', subtitle: 'Under 10 min delivery', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800', linkType: 'category', linkId: 3 },
  { id: 3, title: 'New Snacks', subtitle: 'Try our mini menu', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800', linkType: 'restaurant', linkId: 4 },
];

export const coupons = [
  { id: 1, code: 'SNACK50', discount: 50, discountType: 'percent', minOrder: 20000, maxUses: 100, expiresAt: '2026-08-30', isActive: true },
  { id: 2, code: 'FIRSTBITE', discount: 30, discountType: 'percent', minOrder: 15000, maxUses: 1, expiresAt: '2026-12-31', isActive: true },
  { id: 3, code: 'QUICK10', discount: 10000, discountType: 'fixed', minOrder: 25000, maxUses: 50, expiresAt: '2026-09-15', isActive: true },
];

export const notifications = [
  { id: 1, userId: 1, title: 'Order Ready!', body: 'Your mini bites are on the way!', type: 'order', isRead: false, createdAt: '2026-07-23T10:00:00' },
  { id: 2, userId: 1, title: '50% OFF Deal!', body: 'Mini sliders half price today!', type: 'offer', isRead: false, createdAt: '2026-07-23T09:00:00' },
  { id: 3, userId: 1, title: 'Welcome to BEK FOOD', body: 'Quick bites, quick delivery. Use FIRSTBITE for 30% off.', type: 'system', isRead: true, createdAt: '2026-07-22T12:00:00' },
];

export const addresses = [
  { id: 1, userId: 1, label: 'Home', fullAddress: 'Tashkent, Mirzo Ulugbek district, Street 5, House 12', latitude: 41.3111, longitude: 69.2797, isDefault: true },
  { id: 2, userId: 1, label: 'Work', fullAddress: 'Tashkent, Amir Temur street 78, Office 301', latitude: 41.3028, longitude: 69.2856, isDefault: false },
];

export const drivers = [
  { id: 1, name: 'Sardor R.', phone: '+998901234567', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', vehicleType: 'Bike', rating: 4.9, latitude: 41.3089, longitude: 69.2721 },
  { id: 2, name: 'Jamshid K.', phone: '+998907654321', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', vehicleType: 'Bike', rating: 4.7, latitude: 41.3156, longitude: 69.2812 },
];
