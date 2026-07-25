export const driverProfile = {
  id: 1,
  name: 'Sardor Rakhimov',
  phone: '+998 90 123 45 67',
  email: 'sardor@bekfood.uz',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
  vehicleType: 'Motorcycle',
  vehiclePlate: '01 A 123 45',
  rating: 4.9,
  totalDeliveries: 847,
  joinDate: '2025-03-15',
  isOnline: true,
  language: 'English',
  currentLocation: { lat: 41.3111, lng: 69.2797 },
};

export const driverStats = {
  todayEarnings: 185000,
  weeklyEarnings: 1250000,
  monthlyEarnings: 4800000,
  todayDeliveries: 12,
  weeklyDeliveries: 84,
  monthlyDeliveries: 342,
  todayDistance: 28.5,
  weeklyDistance: 195.3,
  monthlyDistance: 812.7,
  avgDeliveryTime: 22,
  avgDeliveryFee: 15500,
  avgRating: 4.9,
  onlineHoursToday: 6.5,
  onlineHoursWeek: 42,
  completionRate: 97,
  acceptanceRate: 92,
};

export const availableOrders = [
  {
    id: 1001,
    orderNumber: '#ORD-7842',
    restaurant: { id: 1, name: 'Mini Burger Hub', address: 'Tashkent, Amir Temur street 78', lat: 41.3111, lng: 69.2797 },
    customer: { name: 'Azizbek T.', phone: '+998 91 234 56 78', address: 'Tashkent, Mirzo Ulugbek district, Street 5, House 12', lat: 41.3156, lng: 69.2812 },
    items: [
      { name: 'Mini Slider', quantity: 2, price: 15000 },
      { name: 'Cheese Slider', quantity: 1, price: 20000 },
      { name: 'Small Fries', quantity: 2, price: 6000 },
    ],
    notes: 'Please add extra napkins',
    total: 62000,
    deliveryFee: 15000,
    paymentMethod: 'Cash',
    distance: 2.3,
    estimatedTime: '18 min',
    createdAt: '2026-07-25T10:15:00',
    status: 'pending',
  },
  {
    id: 1002,
    orderNumber: '#ORD-7843',
    restaurant: { id: 2, name: 'Pizza Bite', address: 'Tashkent, Navoi street 34', lat: 41.3028, lng: 69.2856 },
    customer: { name: 'Malika S.', phone: '+998 93 456 78 90', address: 'Tashkent, Shayxontohur district, House 45', lat: 41.2956, lng: 69.2678 },
    items: [
      { name: 'Pizza Slice', quantity: 3, price: 10000 },
      { name: 'Mini Margherita', quantity: 1, price: 15000 },
    ],
    notes: '',
    total: 45000,
    deliveryFee: 12000,
    paymentMethod: 'UzCard',
    distance: 3.1,
    estimatedTime: '22 min',
    createdAt: '2026-07-25T10:20:00',
    status: 'pending',
  },
  {
    id: 1003,
    orderNumber: '#ORD-7844',
    restaurant: { id: 3, name: 'Chicken Express', address: 'Tashkent, Buyuk Ipak Yoli 56', lat: 41.3089, lng: 69.2721 },
    customer: { name: 'Javlon K.', phone: '+998 97 890 12 34', address: 'Tashkent, Mirzo Ulugbek district, Avenue 32', lat: 41.3256, lng: 69.3123 },
    items: [
      { name: '5pc Chicken Bites', quantity: 2, price: 13000 },
      { name: 'Wings 4pc', quantity: 1, price: 22000 },
      { name: 'Small Lemonade', quantity: 2, price: 6000 },
    ],
    notes: 'Ring doorbell twice',
    total: 60000,
    deliveryFee: 18000,
    paymentMethod: 'Cash',
    distance: 4.2,
    estimatedTime: '28 min',
    createdAt: '2026-07-25T10:25:00',
    status: 'pending',
  },
];

export const activeDelivery = {
  id: 1001,
  orderNumber: '#ORD-7842',
  restaurant: { id: 1, name: 'Mini Burger Hub', address: 'Tashkent, Amir Temur street 78', lat: 41.3111, lng: 69.2797, phone: '+998 90 111 22 33' },
  customer: { name: 'Azizbek T.', phone: '+998 91 234 56 78', address: 'Tashkent, Mirzo Ulugbek district, Street 5, House 12', lat: 41.3156, lng: 69.2812 },
  items: [
    { name: 'Mini Slider', quantity: 2, price: 15000 },
    { name: 'Cheese Slider', quantity: 1, price: 20000 },
    { name: 'Small Fries', quantity: 2, price: 6000 },
  ],
  notes: 'Please add extra napkins',
  total: 62000,
  deliveryFee: 15000,
  paymentMethod: 'Cash',
  distance: 2.3,
  estimatedTime: '18 min',
  createdAt: '2026-07-25T10:15:00',
  status: 'accepted',
  statusHistory: [
    { status: 'assigned', time: '2026-07-25T10:12:00' },
    { status: 'accepted', time: '2026-07-25T10:13:30' },
  ],
};

export const deliveryHistory = [
  { id: 901, orderNumber: '#ORD-7801', customer: 'Dilshod M.', date: '2026-07-24', distance: 2.1, deliveryFee: 15000, earnings: 15000, timeTaken: 18, status: 'completed', rating: 5 },
  { id: 902, orderNumber: '#ORD-7798', customer: 'Nodira K.', date: '2026-07-24', distance: 3.5, deliveryFee: 18000, earnings: 18000, timeTaken: 25, status: 'completed', rating: 4 },
  { id: 903, orderNumber: '#ORD-7795', customer: 'Sardor A.', date: '2026-07-24', distance: 1.8, deliveryFee: 12000, earnings: 12000, timeTaken: 15, status: 'completed', rating: 5 },
  { id: 904, orderNumber: '#ORD-7790', customer: 'Gulnora B.', date: '2026-07-23', distance: 4.2, deliveryFee: 20000, earnings: 20000, timeTaken: 30, status: 'completed', rating: 4 },
  { id: 905, orderNumber: '#ORD-7788', customer: 'Bobur T.', date: '2026-07-23', distance: 2.8, deliveryFee: 16000, earnings: 16000, timeTaken: 20, status: 'cancelled', rating: null },
  { id: 906, orderNumber: '#ORD-7785', customer: 'Zilola R.', date: '2026-07-23', distance: 1.5, deliveryFee: 12000, earnings: 12000, timeTaken: 12, status: 'completed', rating: 5 },
  { id: 907, orderNumber: '#ORD-7780', customer: 'Farruh N.', date: '2026-07-22', distance: 3.0, deliveryFee: 18000, earnings: 18000, timeTaken: 22, status: 'completed', rating: 5 },
  { id: 908, orderNumber: '#ORD-7776', customer: 'Madina S.', date: '2026-07-22', distance: 2.5, deliveryFee: 15000, earnings: 15000, timeTaken: 18, status: 'failed', rating: null },
];

export const weeklyEarningsData = [
  { day: 'Mon', earnings: 185000, deliveries: 12 },
  { day: 'Tue', earnings: 210000, deliveries: 14 },
  { day: 'Wed', earnings: 165000, deliveries: 11 },
  { day: 'Thu', earnings: 195000, deliveries: 13 },
  { day: 'Fri', earnings: 230000, deliveries: 15 },
  { day: 'Sat', earnings: 265000, deliveries: 17 },
  { day: 'Sun', earnings: 0, deliveries: 0 },
];

export const driverNotifications = [
  { id: 1, title: 'New Delivery Request', body: 'Order #ORD-7842 from Mini Burger Hub — 2.3 km away', type: 'delivery', isRead: false, time: '2 min ago' },
  { id: 2, title: 'Customer Called', body: 'Azizbek T. is calling you', type: 'call', isRead: false, time: '5 min ago' },
  { id: 3, title: 'Delivery Completed', body: 'Order #ORD-7801 completed. You earned 15,000 so\'m', type: 'earnings', isRead: true, time: '1 hour ago' },
  { id: 4, title: 'Traffic Alert', body: 'Heavy traffic on Amir Temur street. Consider alternative route.', type: 'alert', isRead: true, time: '2 hours ago' },
  { id: 5, title: 'System Update', body: 'App updated to v2.1.0. New features available.', type: 'system', isRead: true, time: '1 day ago' },
  { id: 6, title: 'Rating Update', body: 'Your rating is now 4.9 stars. Great work!', type: 'rating', isRead: true, time: '1 day ago' },
];

export const quickMessages = [
  "I'm on my way!",
  "I'm arriving in 5 minutes.",
  "I'm outside.",
  "Please answer your phone.",
  "I can't find your address.",
  "Order is ready for pickup.",
];
