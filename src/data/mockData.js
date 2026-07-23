export const categories = [
  { id: 1, name: 'Fast Food', icon: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200' },
  { id: 2, name: 'Pizza', icon: '🍕', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200' },
  { id: 3, name: 'Burger', icon: '🍔', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200' },
  { id: 4, name: 'Lavash', icon: '🫓', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=200' },
  { id: 5, name: 'Hot Dog', icon: '🌭', image: 'https://images.unsplash.com/photo-1612392062120-e5a0e2e4f5b4?w=200' },
  { id: 6, name: 'Chicken', icon: '🍗', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=200' },
  { id: 7, name: 'Desserts', icon: '🍰', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200' },
  { id: 8, name: 'Drinks', icon: '🥤', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200' },
];

export const restaurants = [
  {
    id: 1, name: 'Burger King', logo: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=100',
    coverImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    rating: 4.8, deliveryTime: '20-30', distance: '1.2 km', isOpen: true,
    address: 'Tashkent, Amir Temur street 78', latitude: 41.3111, longitude: 69.2797, categoryId: 1,
  },
  {
    id: 2, name: 'Pizza Master', logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100',
    coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    rating: 4.6, deliveryTime: '25-35', distance: '2.1 km', isOpen: true,
    address: 'Tashkent, Navoi street 34', latitude: 41.3028, longitude: 69.2856, categoryId: 2,
  },
  {
    id: 3, name: 'KFC Express', logo: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=100',
    coverImage: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800',
    rating: 4.5, deliveryTime: '15-25', distance: '0.8 km', isOpen: true,
    address: 'Tashkent, Buyuk Ipak Yoli 56', latitude: 41.3089, longitude: 69.2721, categoryId: 6,
  },
  {
    id: 4, name: 'Lavash House', logo: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=100',
    coverImage: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800',
    rating: 4.7, deliveryTime: '20-30', distance: '1.5 km', isOpen: true,
    address: 'Tashkent, Shayxontohur district', latitude: 41.2956, longitude: 69.2678, categoryId: 4,
  },
  {
    id: 5, name: 'Sweet Dreams', logo: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=100',
    coverImage: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800',
    rating: 4.9, deliveryTime: '30-40', distance: '3.0 km', isOpen: false,
    address: 'Tashkent, Mirzo Ulugbek district', latitude: 41.3256, longitude: 69.3123, categoryId: 7,
  },
];

export const foods = [
  { id: 1, restaurantId: 1, categoryId: 1, name: 'Whopper Burger', description: 'Flame-grilled beef patty with fresh toppings', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', price: 45000, discountPrice: 38000, calories: 650, ingredients: ['Beef', 'Lettuce', 'Tomato', 'Onion', 'Pickles', 'Mayo'], spiceLevel: 1, isAvailable: true, isPopular: true, isRecommended: true },
  { id: 2, restaurantId: 1, categoryId: 1, name: 'Chicken Royale', description: 'Crispy chicken fillet with special sauce', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400', price: 38000, discountPrice: null, calories: 580, ingredients: ['Chicken', 'Lettuce', 'Mayo', 'Brioche Bun'], spiceLevel: 2, isAvailable: true, isPopular: true, isRecommended: false },
  { id: 3, restaurantId: 2, categoryId: 2, name: 'Pepperoni Pizza', description: 'Classic pepperoni with mozzarella cheese', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', price: 85000, discountPrice: 72000, calories: 890, ingredients: ['Dough', 'Tomato Sauce', 'Mozzarella', 'Pepperoni'], spiceLevel: 1, isAvailable: true, isPopular: true, isRecommended: true },
  { id: 4, restaurantId: 2, categoryId: 2, name: 'Four Cheese Pizza', description: 'Mozzarella, parmesan, cheddar, gouda', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', price: 95000, discountPrice: null, calories: 950, ingredients: ['Dough', '4 Cheeses', 'Herbs'], spiceLevel: 0, isAvailable: true, isPopular: false, isRecommended: true },
  { id: 5, restaurantId: 3, categoryId: 6, name: 'Crispy Bucket', description: '8 pieces of crispy fried chicken', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400', price: 120000, discountPrice: 99000, calories: 1200, ingredients: ['Chicken', 'Secret Spices', 'Breading'], spiceLevel: 3, isAvailable: true, isPopular: true, isRecommended: true },
  { id: 6, restaurantId: 1, categoryId: 3, name: 'Double Cheeseburger', description: 'Double beef patty with cheese slices', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', price: 55000, discountPrice: null, calories: 780, ingredients: ['Beef x2', 'Cheese x2', 'Lettuce', 'Pickles'], spiceLevel: 1, isAvailable: true, isPopular: true, isRecommended: false },
  { id: 7, restaurantId: 4, categoryId: 4, name: 'Lavash with Chicken', description: 'Grilled chicken lavash with veggies', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400', price: 32000, discountPrice: 28000, calories: 450, ingredients: ['Lavash', 'Chicken', 'Tomato', 'Onion', 'Sauce'], spiceLevel: 2, isAvailable: true, isPopular: true, isRecommended: true },
  { id: 8, restaurantId: 5, categoryId: 7, name: 'Chocolate Cake', description: 'Rich dark chocolate layer cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', price: 42000, discountPrice: null, calories: 520, ingredients: ['Chocolate', 'Flour', 'Eggs', 'Butcream'], spiceLevel: 0, isAvailable: true, isPopular: true, isRecommended: true },
  { id: 9, restaurantId: 1, categoryId: 5, name: 'Hot Dog Classic', description: 'Grilled sausage with mustard and ketchup', image: 'https://images.unsplash.com/photo-1612392062120-e5a0e2e4f5b4?w=400', price: 22000, discountPrice: 18000, calories: 380, ingredients: ['Sausage', 'Bun', 'Mustard', 'Ketchup', 'Onion'], spiceLevel: 1, isAvailable: true, isPopular: false, isRecommended: true },
  { id: 10, restaurantId: 3, categoryId: 8, name: 'Fresh Lemonade', description: 'Freshly squeezed lemon with mint', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', price: 15000, discountPrice: null, calories: 120, ingredients: ['Lemon', 'Sugar', 'Mint', 'Water'], spiceLevel: 0, isAvailable: true, isPopular: true, isRecommended: true },
];

export const banners = [
  { id: 1, title: '50% OFF', subtitle: 'On All Pizzas', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', linkType: 'restaurant', linkId: 2 },
  { id: 2, title: 'Free Delivery', subtitle: 'Orders over 50,000', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', linkType: 'category', linkId: 1 },
  { id: 3, title: 'New Menu', subtitle: 'Try our new Lavash', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800', linkType: 'restaurant', linkId: 4 },
];

export const coupons = [
  { id: 1, code: 'BEKFOOD50', discount: 50, discountType: 'percent', minOrder: 50000, maxUses: 100, expiresAt: '2026-08-30', isActive: true },
  { id: 2, code: 'FIRSTORDER', discount: 30, discountType: 'percent', minOrder: 30000, maxUses: 1, expiresAt: '2026-12-31', isActive: true },
  { id: 3, code: 'DELIVERY', discount: 15000, discountType: 'fixed', minOrder: 40000, maxUses: 50, expiresAt: '2026-09-15', isActive: true },
];

export const notifications = [
  { id: 1, userId: 1, title: 'Order Confirmed', body: 'Your order #1234 has been confirmed!', type: 'order', isRead: false, createdAt: '2026-07-23T10:00:00' },
  { id: 2, userId: 1, title: '50% OFF Deal!', body: 'Get 50% off on all pizzas today!', type: 'offer', isRead: false, createdAt: '2026-07-23T09:00:00' },
  { id: 3, userId: 1, title: 'Welcome to BEK FOOD', body: 'Thank you for joining! Use code FIRSTORDER for 30% off.', type: 'system', isRead: true, createdAt: '2026-07-22T12:00:00' },
];

export const addresses = [
  { id: 1, userId: 1, label: 'Home', fullAddress: 'Tashkent, Mirzo Ulugbek district, Street 5, House 12', latitude: 41.3111, longitude: 69.2797, isDefault: true },
  { id: 2, userId: 1, label: 'Work', fullAddress: 'Tashkent, Amir Temur street 78, Office 301', latitude: 41.3028, longitude: 69.2856, isDefault: false },
];

export const drivers = [
  { id: 1, name: 'Sardor R.', phone: '+998901234567', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', vehicleType: 'Car', rating: 4.9, latitude: 41.3089, longitude: 69.2721 },
  { id: 2, name: 'Jamshid K.', phone: '+998907654321', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', vehicleType: 'Bike', rating: 4.7, latitude: 41.3156, longitude: 69.2812 },
];
