// Admin Dashboard Mock Data
export const adminUser = {
  id: 1,
  name: 'Alif Admin',
  email: 'admin@alifcafe.uz',
  role: 'super_admin',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
};

export const roles = [
  { id: 'super_admin', name: 'Super Admin', permissions: ['all'] },
  { id: 'restaurant_manager', name: 'Restaurant Manager', permissions: ['orders', 'food', 'customers', 'analytics'] },
  { id: 'cashier', name: 'Cashier', permissions: ['orders', 'payments'] },
  { id: 'kitchen_staff', name: 'Kitchen Staff', permissions: ['orders_view', 'food_view'] },
  { id: 'delivery_manager', name: 'Delivery Manager', permissions: ['delivery', 'drivers'] },
];

export const staff = [
  { id: 1, name: 'Bekzod Admin', role: 'Super Admin', phone: '+998901234567', email: 'admin@bekfood.uz', status: 'active', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', joinedAt: '2025-06-01' },
  { id: 2, name: 'Dilshod K.', role: 'Restaurant Manager', phone: '+998901112233', email: 'dilshod@bekfood.uz', status: 'active', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', joinedAt: '2025-08-15' },
  { id: 3, name: 'Nodira S.', role: 'Cashier', phone: '+998902223344', email: 'nodira@bekfood.uz', status: 'active', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', joinedAt: '2026-01-10' },
  { id: 4, name: 'Jasur T.', role: 'Kitchen Staff', phone: '+998903334455', email: 'jasur@bekfood.uz', status: 'active', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', joinedAt: '2026-02-20' },
  { id: 5, name: 'Malika R.', role: 'Cashier', phone: '+998904445566', email: 'malika@bekfood.uz', status: 'inactive', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', joinedAt: '2026-03-05' },
];

export const drivers = [
  { id: 1, name: 'Sardor R.', phone: '+998901234567', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', vehicleType: 'Bike', rating: 4.9, status: 'available', currentOrders: 0, completedToday: 12, earnings: 185000, latitude: 41.3089, longitude: 69.2721 },
  { id: 2, name: 'Jamshid K.', phone: '+998907654321', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', vehicleType: 'Car', rating: 4.7, status: 'busy', currentOrders: 2, completedToday: 8, earnings: 142000, latitude: 41.3156, longitude: 69.2812 },
  { id: 3, name: 'Otabek M.', phone: '+998903456789', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', vehicleType: 'Bike', rating: 4.8, status: 'offline', currentOrders: 0, completedToday: 15, earnings: 210000, latitude: 41.3200, longitude: 69.2850 },
  { id: 4, name: 'Davron T.', phone: '+998904567890', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', vehicleType: 'Scooter', rating: 4.6, status: 'on_break', currentOrders: 0, completedToday: 10, earnings: 165000, latitude: 41.3050, longitude: 69.2780 },
  { id: 5, name: 'Sarvar B.', phone: '+998905678901', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', vehicleType: 'Bike', rating: 4.9, status: 'available', currentOrders: 1, completedToday: 14, earnings: 198000, latitude: 41.3120, longitude: 69.2750 },
];

export const orders = [
  { id: 1001, orderNumber: '#BF-1001', customerName: 'Azizbek N.', customerPhone: '+998901112233', deliveryAddress: 'Tashkent, Mirzo Ulugbek district, Street 12, House 5', items: [{ name: 'Mini Slider', qty: 2, price: 15000 }, { name: 'Small Fries', qty: 1, price: 6000 }], total: 36000, deliveryFee: 10000, paymentMethod: 'cash', status: 'preparing', orderTime: '2026-07-24T10:30:00', estimatedDelivery: '11:00', notes: 'Extra sauce please', driverId: null },
  { id: 1002, orderNumber: '#BF-1002', customerName: 'Nodira K.', customerPhone: '+998902223344', deliveryAddress: 'Tashkent, Shayxontohur, Navoi street 45', items: [{ name: 'Pizza Slice', qty: 3, price: 10000 }, { name: 'Small Lemonade', qty: 2, price: 6000 }], total: 42000, deliveryFee: 0, paymentMethod: 'card', status: 'out_for_delivery', orderTime: '2026-07-24T10:15:00', estimatedDelivery: '10:45', notes: '', driverId: 1 },
  { id: 1003, orderNumber: '#BF-1003', customerName: 'Jasur T.', customerPhone: '+998903334455', deliveryAddress: 'Tashkent, Chilonzor, Buyuk Ipak Yoli 78', items: [{ name: '5pc Chicken Bites', qty: 2, price: 13000 }, { name: 'Wings 4pc', qty: 1, price: 22000 }], total: 48000, deliveryFee: 10000, paymentMethod: 'cash', status: 'delivered', orderTime: '2026-07-24T09:45:00', estimatedDelivery: '10:15', notes: '', driverId: 2 },
  { id: 1004, orderNumber: '#BF-1004', customerName: 'Malika S.', customerPhone: '+998904445566', deliveryAddress: 'Tashkent, Olmazor, Amir Temur 12', items: [{ name: 'Mini Lavash', qty: 1, price: 12000 }, { name: 'Mini Ice Cream', qty: 2, price: 8000 }], total: 28000, deliveryFee: 10000, paymentMethod: 'card', status: 'pending', orderTime: '2026-07-24T10:45:00', estimatedDelivery: '11:15', notes: 'No onions', driverId: null },
  { id: 1005, orderNumber: '#BF-1005', customerName: 'Sardor A.', customerPhone: '+998905556677', deliveryAddress: 'Tashkent, Sergeli, 7th Block', items: [{ name: 'Cheese Slider', qty: 3, price: 20000 }], total: 60000, deliveryFee: 0, paymentMethod: 'cash', status: 'ready', orderTime: '2026-07-24T10:20:00', estimatedDelivery: '10:50', notes: '', driverId: null },
  { id: 1006, orderNumber: '#BF-1006', customerName: 'Dilshod R.', customerPhone: '+998906667788', deliveryAddress: 'Tashkent, Mirabad, Bobur street 5', items: [{ name: 'Mini Margherita', qty: 2, price: 15000 }, { name: 'Small Fries', qty: 2, price: 6000 }], total: 42000, deliveryFee: 10000, paymentMethod: 'card', status: 'cancelled', orderTime: '2026-07-24T09:30:00', estimatedDelivery: '10:00', notes: '', driverId: null },
  { id: 1007, orderNumber: '#BF-1007', customerName: 'Gulnora M.', customerPhone: '+998907778899', deliveryAddress: 'Tashkent, Yakkasaroy, Buyuk Ipak Yoli 100', items: [{ name: 'Falafel Wrap', qty: 1, price: 12000 }, { name: 'Small Lemonade', qty: 1, price: 6000 }], total: 18000, deliveryFee: 10000, paymentMethod: 'cash', status: 'accepted', orderTime: '2026-07-24T10:50:00', estimatedDelivery: '11:20', notes: '', driverId: null },
  { id: 1008, orderNumber: '#BF-1008', customerName: 'Bobur J.', customerPhone: '+998908889900', deliveryAddress: 'Tashkent, Yunusabad, 5th District', items: [{ name: 'Mini Hot Dog', qty: 4, price: 8000 }, { name: 'Small Fries', qty: 3, price: 6000 }], total: 50000, deliveryFee: 0, paymentMethod: 'card', status: 'preparing', orderTime: '2026-07-24T10:40:00', estimatedDelivery: '11:10', notes: 'Extra mustard', driverId: null },
];

export const customers = [
  { id: 1, name: 'Azizbek N.', phone: '+998901112233', email: 'aziz@gmail.com', totalOrders: 28, totalSpending: 520000, loyaltyPoints: 520, addresses: ['Mirzo Ulugbek, Street 12'], favoriteFoods: ['Mini Slider', 'Small Fries'], isBlocked: false, notes: 'VIP Customer', createdAt: '2026-01-15' },
  { id: 2, name: 'Nodira K.', phone: '+998902223344', email: 'nodira@gmail.com', totalOrders: 45, totalSpending: 890000, loyaltyPoints: 890, addresses: ['Shayxontohur, Navoi 45'], favoriteFoods: ['Pizza Slice', 'Small Lemonade'], isBlocked: false, notes: '', createdAt: '2025-11-20' },
  { id: 3, name: 'Jasur T.', phone: '+998903334455', email: 'jasur@gmail.com', totalOrders: 15, totalSpending: 280000, loyaltyPoints: 280, addresses: ['Chilonzor, Buyuk Ipak Yoli 78'], favoriteFoods: ['5pc Chicken Bites'], isBlocked: false, notes: '', createdAt: '2026-03-10' },
  { id: 4, name: 'Malika S.', phone: '+998904445566', email: 'malika@gmail.com', totalOrders: 32, totalSpending: 610000, loyaltyPoints: 610, addresses: ['Olmazor, Amir Temur 12'], favoriteFoods: ['Mini Lavash', 'Mini Ice Cream'], isBlocked: false, notes: 'Allergic to nuts', createdAt: '2026-02-05' },
  { id: 5, name: 'Sardor A.', phone: '+998905556677', email: 'sardor@gmail.com', totalOrders: 8, totalSpending: 150000, loyaltyPoints: 150, addresses: ['Sergeli, 7th Block'], favoriteFoods: ['Cheese Slider'], isBlocked: true, notes: 'Cancelled multiple orders', createdAt: '2026-05-01' },
];

export const inventory = [
  { id: 1, name: 'Beef Patties', stock: 150, unit: 'pcs', lowStock: 30, supplier: 'Tashkent Meat Co.', expiryDate: '2026-07-28', lastPurchase: '2026-07-20', cost: 5000 },
  { id: 2, name: 'Mini Buns', stock: 200, unit: 'pcs', lowStock: 40, supplier: 'Fresh Bakery', expiryDate: '2026-07-26', lastPurchase: '2026-07-22', cost: 1000 },
  { id: 3, name: 'Cheese Slices', stock: 100, unit: 'pcs', lowStock: 25, supplier: 'Dairy Plus', expiryDate: '2026-08-05', lastPurchase: '2026-07-18', cost: 2000 },
  { id: 4, name: 'Chicken Nuggets', stock: 80, unit: 'pcs', lowStock: 20, supplier: 'Poultry Farm', expiryDate: '2026-07-30', lastPurchase: '2026-07-21', cost: 3000 },
  { id: 5, name: 'Potato (Fries)', stock: 50, unit: 'kg', lowStock: 10, supplier: 'Green Valley', expiryDate: '2026-08-10', lastPurchase: '2026-07-19', cost: 8000 },
  { id: 6, name: 'Lettuce', stock: 8, unit: 'heads', lowStock: 10, supplier: 'Fresh Farm', expiryDate: '2026-07-27', lastPurchase: '2026-07-23', cost: 3000 },
  { id: 7, name: 'Tomatoes', stock: 5, unit: 'kg', lowStock: 8, supplier: 'Green Valley', expiryDate: '2026-07-28', lastPurchase: '2026-07-22', cost: 6000 },
  { id: 8, name: 'Sauces (Ketchup)', stock: 40, unit: 'bottles', lowStock: 10, supplier: 'Sauce Masters', expiryDate: '2026-12-31', lastPurchase: '2026-07-15', cost: 4000 },
];

export const coupons = [
  { id: 1, code: 'SNACK50', discount: 50, discountType: 'percent', minOrder: 20000, maxUses: 100, usedCount: 67, expiresAt: '2026-08-30', isActive: true },
  { id: 2, code: 'FIRSTBITE', discount: 30, discountType: 'percent', minOrder: 15000, maxUses: 500, usedCount: 234, expiresAt: '2026-12-31', isActive: true },
  { id: 3, code: 'QUICK10', discount: 10000, discountType: 'fixed', minOrder: 25000, maxUses: 50, usedCount: 12, expiresAt: '2026-09-15', isActive: true },
  { id: 4, code: 'WEEKEND20', discount: 20, discountType: 'percent', minOrder: 30000, maxUses: 200, usedCount: 89, expiresAt: '2026-08-01', isActive: true },
  { id: 5, code: 'FREEDEL', discount: 10000, discountType: 'fixed', minOrder: 40000, maxUses: 100, usedCount: 45, expiresAt: '2026-07-31', isActive: false },
];

export const notifications = [
  { id: 1, title: 'New Order #BF-1008', body: 'Bobur J. placed an order for 50,000 so\'m', type: 'order', isRead: false, createdAt: '2026-07-24T10:40:00' },
  { id: 2, title: 'Low Stock Alert', body: 'Lettuce is running low (8 heads left)', type: 'alert', isRead: false, createdAt: '2026-07-24T09:30:00' },
  { id: 3, title: 'Driver Sardor completed delivery', body: 'Order #BF-1003 delivered successfully', type: 'delivery', isRead: true, createdAt: '2026-07-24T10:20:00' },
  { id: 4, title: 'Payment Received', body: '42,000 so\'m from Nodira K. (Card)', type: 'payment', isRead: true, createdAt: '2026-07-24T10:15:00' },
  { id: 5, title: 'System Update', body: 'Dashboard updated to v2.1.0', type: 'system', isRead: true, createdAt: '2026-07-24T08:00:00' },
];

export const recentActivity = [
  { id: 1, action: 'New Product Added', detail: 'Cheese Slider added to menu', user: 'Bekzod Admin', time: '10 min ago', status: 'success', icon: 'plus' },
  { id: 2, action: 'Price Changed', detail: 'Mini Slider price updated to 15,000 so\'m', user: 'Dilshod K.', time: '25 min ago', status: 'info', icon: 'edit' },
  { id: 3, action: 'Promotion Created', detail: 'WEEKEND20 — 20% off weekend orders', user: 'Bekzod Admin', time: '1 hour ago', status: 'success', icon: 'tag' },
  { id: 4, action: 'Category Updated', detail: 'Burgers category description changed', user: 'Dilshod K.', time: '2 hours ago', status: 'info', icon: 'folder' },
  { id: 5, action: 'Staff Added', detail: 'Malika R. added as Cashier', user: 'Bekzod Admin', time: '3 hours ago', status: 'success', icon: 'user-plus' },
  { id: 6, action: 'Product Deleted', detail: 'Old Chicken Wrap removed from menu', user: 'Bekzod Admin', time: '4 hours ago', status: 'warning', icon: 'trash' },
  { id: 7, action: 'Settings Updated', detail: 'Delivery radius changed to 5km', user: 'Bekzod Admin', time: '5 hours ago', status: 'info', icon: 'settings' },
];

export const dailyStats = {
  orders: 47,
  revenue: 892000,
  activeOrders: 8,
  preparing: 3,
  outForDelivery: 5,
  completed: 32,
  cancelled: 4,
  pending: 3,
  avgDeliveryTime: 28,
  topFood: 'Mini Slider',
  bestCustomer: 'Nodira K.',
  totalCustomers: 128,
  avgOrderValue: 18979,
  activePromotions: 4,
  totalProducts: 24,
  totalCategories: 8,
  totalSalesToday: 892000,
};

export const weeklyData = [
  { day: 'Mon', orders: 42, revenue: 780000 },
  { day: 'Tue', orders: 38, revenue: 720000 },
  { day: 'Wed', orders: 55, revenue: 1050000 },
  { day: 'Thu', orders: 47, revenue: 892000 },
  { day: 'Fri', orders: 62, revenue: 1180000 },
  { day: 'Sat', orders: 78, revenue: 1450000 },
  { day: 'Sun', orders: 71, revenue: 1320000 },
];

export const monthlyData = [
  { month: 'Jan', revenue: 18500000 },
  { month: 'Feb', revenue: 21200000 },
  { month: 'Mar', revenue: 24800000 },
  { month: 'Apr', revenue: 22100000 },
  { month: 'May', revenue: 26500000 },
  { month: 'Jun', revenue: 28900000 },
  { month: 'Jul', revenue: 19200000 },
];

export const topFoods = [
  { name: 'Mini Slider', orders: 156, revenue: 2340000 },
  { name: 'Pizza Slice', orders: 134, revenue: 1340000 },
  { name: '5pc Chicken Bites', orders: 112, revenue: 1456000 },
  { name: 'Small Fries', orders: 98, revenue: 588000 },
  { name: 'Mini Lavash', orders: 87, revenue: 1044000 },
];

export const peakHours = [
  { hour: '09:00', orders: 5 },
  { hour: '10:00', orders: 12 },
  { hour: '11:00', orders: 18 },
  { hour: '12:00', orders: 35 },
  { hour: '13:00', orders: 28 },
  { hour: '14:00', orders: 15 },
  { hour: '15:00', orders: 8 },
  { hour: '16:00', orders: 10 },
  { hour: '17:00', orders: 22 },
  { hour: '18:00', orders: 32 },
  { hour: '19:00', orders: 25 },
  { hour: '20:00', orders: 14 },
  { hour: '21:00', orders: 6 },
];

export const topCategories = [
  { name: 'Burgers', orders: 198, revenue: 3420000, percentage: 34 },
  { name: 'Pizza', orders: 134, revenue: 1340000, percentage: 23 },
  { name: 'Chicken', orders: 112, revenue: 1456000, percentage: 19 },
  { name: 'Sides', orders: 98, revenue: 588000, percentage: 17 },
  { name: 'Drinks', orders: 42, revenue: 252000, percentage: 7 },
];

export const restaurantStatus = {
  isOpen: true,
  openTime: '09:00',
  closeTime: '23:00',
  kitchenStatus: 'active',
  onlineStatus: 'online',
  deliveryStatus: 'active',
  currentOrders: 8,
};

export const systemHealth = {
  serverStatus: 'operational',
  databaseStatus: 'operational',
  storageUsage: 67,
  imageStorage: 2.4,
  apiStatus: 'operational',
  lastBackup: '2026-07-24 06:00',
  version: '2.1.0',
};

export const settings = {
  restaurantName: 'Alif Cafe',
  address: 'Tashkent, Amir Temur street 78',
  phone: '+998 90 123 45 67',
  email: 'info@alifcafe.uz',
  openingHours: '09:00 - 23:00',
  deliveryRadius: 5,
  deliveryFee: 10000,
  freeDeliveryMin: 50000,
  taxRate: 12,
  serviceFeeRate: 5,
  paymentMethods: ['cash', 'card'],
  languages: ['uz', 'ru', 'en'],
  theme: 'light',
  socialMedia: {
    telegram: 'https://t.me/alifcafe',
    instagram: 'https://instagram.com/alifcafe',
  },
};
