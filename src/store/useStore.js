import { create } from 'zustand';
import { foods, restaurants, categories, banners, addresses, notifications } from '../data/mockData';
import api from '../api/client';

const SERVER_KEYS = ['foods', 'categories', 'restaurants', 'banners', 'promoCodes', 'settings', 'inventory', 'employees', 'branches', 'orders', 'addresses', 'notifications'];
const SESSION_KEYS = ['user', 'cart', 'favorites', 'addresses', 'appliedCoupon'];
const SESSION_KEY = 'bekfood_session';

function buildSnapshot(s) {
  const out = {};
  for (const k of SERVER_KEYS) if (s[k] !== undefined) out[k] = s[k];
  return out;
}

const mockOrders = [
  { id: 1001, items: [{ food: foods[0], quantity: 2, price: 12000 }], total: 24000, status: 'pending', paymentMethod: 'cash', address: "Chinobod, Oqtepa ko'chasi, 15", notes: 'Achchiq qiling', createdAt: new Date(Date.now() - 300000).toISOString(), customerName: 'Aziz', customerPhone: '+998901112233', priority: 'high', estimatedReady: '14:30', deliveryType: 'delivery' },
  { id: 1002, items: [{ food: foods[5], quantity: 1, price: 33000 }, { food: foods[14], quantity: 2, price: 25000 }], total: 83000, status: 'confirmed', paymentMethod: 'card', address: '', notes: '', createdAt: new Date(Date.now() - 600000).toISOString(), customerName: 'Sardor', customerPhone: '+998902223344', priority: 'normal', estimatedReady: '14:45', deliveryType: 'pickup' },
  { id: 1003, items: [{ food: foods[9], quantity: 3, price: 35000 }], total: 105000, status: 'preparing', paymentMethod: 'cash', address: "Chinobod, Bog'ishamol ko'chasi, 8", notes: 'Tezroq', createdAt: new Date(Date.now() - 900000).toISOString(), customerName: 'Jamshid', customerPhone: '+998903334455', priority: 'low', estimatedReady: '14:15', courierId: null, deliveryType: 'delivery' },
  { id: 1004, items: [{ food: foods[10], quantity: 1, price: 38000 }, { food: foods[18], quantity: 1, price: 15000 }], total: 53000, status: 'ready', paymentMethod: 'cash', address: "Chinobod, Mustaqillik ko'chasi, 42", notes: '', createdAt: new Date(Date.now() - 1200000).toISOString(), customerName: 'Otabek', customerPhone: '+998904445566', priority: 'normal', deliveryType: 'delivery' },
  { id: 1005, items: [{ food: foods[1], quantity: 2, price: 15000 }], total: 30000, status: 'pickedUp', paymentMethod: 'cash', address: "Chinobod, Bobur ko'chasi, 12", notes: '', createdAt: new Date(Date.now() - 1800000).toISOString(), customerName: 'Dilshod', customerPhone: '+998905556677', priority: 'normal', courierId: 1, assignedAt: new Date(Date.now() - 1500000).toISOString(), courierAcceptedAt: new Date(Date.now() - 1300000).toISOString(), pickedUpAt: new Date(Date.now() - 900000).toISOString(), deliveryType: 'delivery' },
  { id: 1006, items: [{ food: foods[18], quantity: 4, price: 15000 }], total: 60000, status: 'pending', paymentMethod: 'cash', address: '', notes: 'Ketchup ko\'proq', createdAt: new Date(Date.now() - 120000).toISOString(), customerName: 'Nodir', customerPhone: '+998906667788', priority: 'high', estimatedReady: '15:00', deliveryType: 'pickup' },
  { id: 1007, items: [{ food: foods[9], quantity: 1, price: 35000 }], total: 35000, status: 'delivered', paymentMethod: 'card', address: "Chinobod, Yangi ko'chasi, 3", notes: '', createdAt: new Date(Date.now() - 3600000).toISOString(), customerName: 'Shohruh', customerPhone: '+998907778899', priority: 'normal', courierId: 2, assignedAt: new Date(Date.now() - 3000000).toISOString(), courierAcceptedAt: new Date(Date.now() - 2800000).toISOString(), deliveredAt: new Date(Date.now() - 1200000).toISOString(), deliveryType: 'delivery' },
  { id: 1008, items: [{ food: foods[14], quantity: 2, price: 25000 }], total: 50000, status: 'cancelled', paymentMethod: 'cash', address: '', notes: 'Buyurtma bekor qilindi', createdAt: new Date(Date.now() - 5400000).toISOString(), customerName: 'Ulugbek', customerPhone: '+998908889900', priority: 'normal', deliveryType: 'pickup' },
];

const mockCourierStats = {
  today: { orders: 12, distance: 47.5, avgTime: 28, earnings: 180000, hours: 6.5 },
  week: { orders: 78, distance: 312, avgTime: 31, earnings: 1150000 },
  month: { orders: 312, distance: 1248, avgTime: 29, earnings: 4600000 },
  weekChart: [12, 15, 10, 14, 16, 11, 13],
  monthChart: [78, 82, 75, 88, 92, 85, 78, 95, 89, 84, 91, 86],
};

const mockSellerStats = {
  today: { revenue: 1250000, orders: 34, cancelled: 2, preparing: 5, waitingCourier: 3, avgPrepTime: 18 },
  week: { revenue: 8750000, orders: 238 },
  month: { revenue: 35000000, orders: 952 },
  topItems: [
    { name: 'Hot-dog oddiy', sold: 156, revenue: 1872000 },
    { name: 'Lavash', sold: 134, revenue: 4422000 },
    { name: 'Gamburger', sold: 98, revenue: 3430000 },
    { name: 'Doner kichik', sold: 87, revenue: 2175000 },
    { name: 'Fri', sold: 76, revenue: 1140000 },
  ],
  weekChart: [1250000, 980000, 1450000, 1320000, 1680000, 1120000, 1350000],
};

const mockInventory = [
  { id: 1, name: "Qiyma go'sht", quantity: 15, unit: 'kg', minQuantity: 5, unitCost: 55000, status: 'ok' },
  { id: 2, name: "Tovuq go'shti", quantity: 8, unit: 'kg', minQuantity: 5, unitCost: 28000, status: 'low' },
  { id: 3, name: "Piyoz", quantity: 20, unit: 'kg', minQuantity: 10, unitCost: 5000, status: 'ok' },
  { id: 4, name: "Kartoshka", quantity: 3, unit: 'kg', minQuantity: 8, unitCost: 6000, status: 'critical' },
  { id: 5, name: "Non", quantity: 50, unit: 'dona', minQuantity: 20, unitCost: 3000, status: 'ok' },
  { id: 6, name: "Pishloq", quantity: 4, unit: 'kg', minQuantity: 3, unitCost: 45000, status: 'ok' },
  { id: 7, name: "Sosiska", quantity: 24, unit: 'dona', minQuantity: 12, unitCost: 8000, status: 'ok' },
  { id: 8, name: "Sosiska", quantity: 2, unit: 'kg', minQuantity: 4, unitCost: 70000, status: 'critical' },
];

const mockPromoCodes = [
  { id: 1, code: 'BEK20', discount: 20, discountType: 'percent', minOrder: 0, maxUses: 0, usedCount: 12, active: true, startDate: '', endDate: '' },
  { id: 2, code: 'BEK50', discount: 5000, discountType: 'fixed', minOrder: 100000, maxUses: 50, usedCount: 18, active: true, startDate: '', endDate: '' },
  { id: 3, code: 'CHINOBOD', discount: 10, discountType: 'percent', minOrder: 50000, maxUses: 100, usedCount: 34, active: false, startDate: '', endDate: '' },
];

const mockSettings = {
  name: 'BEK FOOD',
  phone: '+998 90 123 45 67',
  address: "Chinobod tumani, Oqtepa ko'chasi, 15",
  logo: '/logo.png',
  lat: 41.2995,
  lng: 69.2401,
  openTime: '10:00',
  closeTime: '23:00',
  deliveryFee: 0,
  minOrder: 0,
  paymentMethods: { cash: true, card: false, click: false, payme: false },
};

const mockEmployees = [
  { id: 1, name: 'Akbar', role: 'courier', phone: '+998901112233', rating: 4.8, totalDeliveries: 312, isOnline: true },
  { id: 2, name: 'Sardor', role: 'courier', phone: '+998902223344', rating: 4.6, totalDeliveries: 198, isOnline: false },
  { id: 3, name: 'Otabek', role: 'seller', phone: '+998903334455', rating: 4.9, totalOrders: 1245, isOnline: true },
  { id: 4, name: 'Jamshid', role: 'seller', phone: '+998904445566', rating: 4.7, totalOrders: 980, isOnline: true },
];

const initialState = {
  user: null,
  isAuthenticated: false,
  role: null,
  cart: [],
  orders: mockOrders,
  favorites: [],
  appliedCoupon: null,
  promoCodes: mockPromoCodes,
  settings: mockSettings,
  productDiscounts: [],
  categoryDiscounts: [],
  selectedPaymentMethod: 'cash',
  selectedFood: null,
  selectedRestaurant: null,
  currentOrder: null,
  foods,
  restaurants,
  categories,
  banners,
  notifications,
  addresses,
  searchQuery: '',
  searchResults: [],
  recentSearches: [],
  inventory: mockInventory,
  branches: restaurants,
  employees: mockEmployees,
  isAppLoading: true,
  courierStats: mockCourierStats,
  sellerStats: mockSellerStats,
  activeOrderTimers: {},
  sellerNotifications: [
    { id: 1, title: 'Yangi buyurtma', message: '#1001 - 50,000 so\'m', time: new Date(Date.now() - 300000).toISOString(), isRead: false, sound: true },
    { id: 2, title: 'Yangi buyurtma', message: '#1006 - 60,000 so\'m', time: new Date(Date.now() - 120000).toISOString(), isRead: false, sound: true },
  ],
  courierNotifications: [
    { id: 1, title: 'Buyurtma tayyor', message: '#1003 - olishingiz mumkin', time: new Date(Date.now() - 60000).toISOString(), isRead: false },
  ],
  quickMessages: [
    '5 daqiqada yetib boraman',
    'Uy oldidaman',
    'Iltimos telefonni ko\'taring',
    'Buyurtma tayyor, chiqyapman',
    'Xech narsa unutmang',
  ],
};

export const useStore = create((set, get) => ({
  ...initialState,

  // Auth
  setLoading: (v) => set({ isAppLoading: v }),
  boot: async () => {
    let restored = false;
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const s = JSON.parse(saved);
        const patch = {};
        for (const k of SESSION_KEYS) if (s[k] !== undefined) patch[k] = s[k];
        if (patch.user) patch.isAuthenticated = true;
        set(patch);
        restored = true;
      }
    } catch { /* ber munkin emas */ }
    try {
      const res = await api.getData();
      const data = res?.data;
      if (data && Array.isArray(data.foods) && data.foods.length) {
        const patch = {};
        for (const k of SERVER_KEYS) if (data[k] !== undefined) patch[k] = data[k];
        set(patch);
      } else if (!restored) {
        api.saveData(buildSnapshot(get())).catch(() => {});
      }
    } catch {
      // Server o'chgan bo'lsa mahalliy (mock) ma'lumotlar bilan davom etamiz
    } finally {
      set({ isAppLoading: false });
    }
  },
  login: (user) => {
    const role = (user.role || '').toLowerCase();
    const mapped = role === 'courier' || role === 'driver' ? 'courier' : role === 'seller' || role === 'order_manager' ? 'seller' : 'customer';
    set({
      user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: mapped, avatar: user.avatar },
      isAuthenticated: true,
      role: mapped,
    });
  },
  logout: () => set({ user: null, isAuthenticated: false, role: null, cart: [], orders: mockOrders, currentOrder: null }),

  updateProfile: (patch) => set({ user: { ...get().user, ...patch } }),

  // Cart
  addToCart: (food, quantity = 1, extras = [], notes = '') => {
    const cart = get().cart;
    const existing = cart.find((i) => i.food.id === food.id && JSON.stringify(i.extras) === JSON.stringify(extras));
    if (existing) {
      get().updateCartItemQuantity(existing.id, quantity);
    } else {
      const totalPrice = (food.discountPrice || food.price) + extras.reduce((s, e) => s + e.price, 0);
      set({ cart: [...cart, { id: Date.now(), food, quantity, extras, notes, price: totalPrice }] });
    }
  },
  removeFromCart: (id) => set({ cart: get().cart.filter((i) => i.id !== id) }),
  updateCartItemQuantity: (id, delta) =>
    set({
      cart: get().cart.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)),
    }),
  clearCart: () => set({ cart: [] }),
  addAddress: (address) => {
    const list = get().addresses;
    const newAddr = { id: Date.now(), label: address.label || 'Yangi manzil', fullAddress: address.fullAddress, isDefault: list.length === 0 };
    set({ addresses: [...list, newAddr] });
    return newAddr;
  },
  getCartTotal: () => {
    const cart = get().cart;
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const deliveryFee = get().settings?.deliveryFee && subtotal > 0 ? Number(get().settings.deliveryFee) : 0;
    const serviceFee = Math.round(subtotal * 0.02);
    const tax = Math.round(subtotal * 0.01);
    const discount = get().appliedCoupon
      ? get().appliedCoupon.discountType === 'percent'
        ? Math.round(subtotal * (get().appliedCoupon.discount / 100))
        : get().appliedCoupon.discount
      : 0;
    return { subtotal, deliveryFee, serviceFee, tax, discount, total: subtotal + deliveryFee + serviceFee - tax - discount };
  },

  // Favorites
  toggleFavorite: (type, id) => {
    const favs = get().favorites;
    const exists = favs.some((f) => f.type === type && f.id === id);
    set({ favorites: exists ? favs.filter((f) => !(f.type === type && f.id === id)) : [...favs, { type, id }] });
  },
  isFavorite: (type, id) => get().favorites.some((f) => f.type === type && f.id === id),

  // Orders
  placeOrder: (paymentMethod, address, notes = '') => {
    const order = {
      id: Date.now(),
      items: get().cart,
      total: get().getCartTotal().total,
      subtotal: get().getCartTotal().subtotal,
      status: 'pending',
      paymentMethod,
      address,
      notes,
      createdAt: new Date().toISOString(),
      driver: null,
      customerName: get().user?.name || 'Mijoz',
      customerPhone: get().user?.phone || '',
      priority: 'normal',
    };
    set({ orders: [order, ...get().orders], currentOrder: order, cart: [] });
    return order;
  },
  updateOrderStatus: (id, status) => {
    set({
      orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)),
      currentOrder: get().currentOrder?.id === id ? { ...get().currentOrder, status } : get().currentOrder,
    });
  },
  cancelOrder: (id) => get().updateOrderStatus(id, 'cancelled'),

  // Seller order actions
  acceptOrder: (id) => get().updateOrderStatus(id, 'confirmed'),
  startPreparing: (id) => get().updateOrderStatus(id, 'preparing'),
  readyOrder: (id) => get().updateOrderStatus(id, 'ready'),
  assignCourier: (id, courierId) => {
    set({
      orders: get().orders.map((o) => (o.id === id ? { ...o, status: 'assigned', courierId, assignedAt: new Date().toISOString() } : o)),
    });
  },

  // Courier order actions
  courierHasActiveOrder: (courierId) =>
    get().orders.some((o) => o.courierId === courierId && ['assigned', 'onTheWay', 'pickedUp'].includes(o.status)),
  courierAcceptOrder: (id) => {
    const courierId = get().user?.id || 10;
    if (get().courierHasActiveOrder(courierId)) return false;
    const order = get().orders.find((o) => o.id === id);
    if (!order || order.status !== 'assigned' || order.courierId !== courierId) return false;
    set({
      orders: get().orders.map((o) => (o.id === id ? { ...o, status: 'onTheWay', courierAcceptedAt: new Date().toISOString() } : o)),
    });
    return true;
  },
  courierPickedUp: (id) => {
    set({
      orders: get().orders.map((o) =>
        o.id === id && o.status === 'onTheWay' ? { ...o, status: 'pickedUp', pickedUpAt: new Date().toISOString() } : o
      ),
    });
  },
  courierDelivered: (id) => {
    set({
      orders: get().orders.map((o) =>
        o.id === id && (o.status === 'pickedUp' || o.status === 'onTheWay')
          ? { ...o, status: 'delivered', deliveredAt: new Date().toISOString() }
          : o
      ),
    });
  },

  // Selection
  selectFood: (id) => set({ selectedFood: foods.find((f) => f.id === id) }),
  selectRestaurant: (id) => set({ selectedRestaurant: restaurants.find((r) => r.id === id) }),

  // Search
  search: (query) => {
    const q = query.toLowerCase();
    const results = [...foods.map((f) => ({ ...f, type: 'food' })), ...restaurants.map((r) => ({ ...r, type: 'restaurant' }))].filter(
      (item) => item.name?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q)
    );
    set({ searchQuery: q, searchResults: results });
    if (q && !get().recentSearches.includes(q)) {
      set({ recentSearches: [q, ...get().recentSearches.slice(0, 9)] });
    }
  },
  clearRecentSearches: () => set({ recentSearches: [] }),
  removeRecentSearch: (q) => set({ recentSearches: get().recentSearches.filter((s) => s !== q) }),

  // Payment
  setPaymentMethod: (method) => set({ selectedPaymentMethod: method }),

  // Notifications
  markNotifRead: (id) =>
    set({ notifications: get().notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)) }),
  clearNotifs: () => set({ notifications: [] }),
  markSellerNotifRead: (id) =>
    set({ sellerNotifications: get().sellerNotifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)) }),
  markCourierNotifRead: (id) =>
    set({ courierNotifications: get().courierNotifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)) }),

  // Coupon
  applyPromoCode: (code, subtotal) => {
    const promo = get().promoCodes.find(
      (p) => String(p.code).toLowerCase() === String(code || '').trim().toLowerCase()
    );
    if (!promo || !promo.active) return false;
    if (promo.minOrder && subtotal < promo.minOrder) return false;
    if (promo.maxUses && promo.usedCount >= promo.maxUses) return false;
    set({
      appliedCoupon: { code: promo.code, discount: promo.discount, discountType: promo.discountType },
      promoCodes: get().promoCodes.map((p) => (p.id === promo.id ? { ...p, usedCount: p.usedCount + 1 } : p)),
    });
    return true;
  },
  removeCoupon: () => set({ appliedCoupon: null }),
  addPromoCode: (promo) => set({ promoCodes: [...get().promoCodes, { ...promo, id: Date.now() }] }),
  updatePromoCode: (id, data) =>
    set({ promoCodes: get().promoCodes.map((p) => (p.id === id ? { ...p, ...data } : p)) }),
  deletePromoCode: (id) => set({ promoCodes: get().promoCodes.filter((p) => p.id !== id) }),

  // Seller actions
  addProduct: (product) => set({ foods: [...get().foods, { ...product, id: Date.now() }] }),
  updateProduct: (id, data) => set({ foods: get().foods.map((f) => (f.id === id ? { ...f, ...data } : f)) }),
  deleteProduct: (id) => set({ foods: get().foods.filter((f) => f.id !== id) }),
  toggleProductAvailability: (id) =>
    set({ foods: get().foods.map((f) => (f.id === id ? { ...f, available: !(f.available !== false) } : f)) }),
  toggleProductPopular: (id) =>
    set({ foods: get().foods.map((f) => (f.id === id ? { ...f, isPopular: !f.isPopular } : f)) }),

  // Categories
  addCategory: (category) => set({ categories: [...get().categories, { ...category, id: Date.now() }] }),
  updateCategory: (id, data) =>
    set({ categories: get().categories.map((c) => (c.id === id ? { ...c, ...data } : c)) }),
  deleteCategory: (id) => set({ categories: get().categories.filter((c) => c.id !== id) }),
  toggleCategoryActive: (id) =>
    set({ categories: get().categories.map((c) => (c.id === id ? { ...c, isActive: !(c.isActive !== false) } : c)) }),
  moveCategory: (id, dir) => {
    const arr = [...get().categories];
    const idx = arr.findIndex((c) => c.id === id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (idx === -1 || swapIdx < 0 || swapIdx >= arr.length) return;
    [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
    set({ categories: arr });
  },

  // Discounts (product / category)
  applyProductDiscount: (productId, percent, expiresAt = '') => {
    const food = get().foods.find((f) => f.id === productId);
    if (!food) return;
    const discountPrice = Math.round(food.price * (1 - percent / 100));
    set({
      foods: get().foods.map((f) => (f.id === productId ? { ...f, discountPrice } : f)),
      productDiscounts: [
        ...get().productDiscounts.filter((d) => d.productId !== productId),
        { id: Date.now(), productId, productName: food.name, percent, expiresAt },
      ],
    });
  },
  removeProductDiscount: (productId) => {
    set({
      foods: get().foods.map((f) => (f.id === productId ? { ...f, discountPrice: undefined } : f)),
      productDiscounts: get().productDiscounts.filter((d) => d.productId !== productId),
    });
  },
  applyCategoryDiscount: (categoryId, percent, expiresAt = '') => {
    const cat = get().categories.find((c) => c.id === categoryId);
    if (!cat) return;
    const targetIds = get().foods.filter((f) => f.categoryId === categoryId).map((f) => f.id);
    const prev = get().productDiscounts.filter((d) => !targetIds.includes(d.productId));
    set({
      foods: get().foods.map((f) =>
        f.categoryId === categoryId && !f.discountPrice
          ? { ...f, discountPrice: Math.round(f.price * (1 - percent / 100)) }
          : f
      ),
      productDiscounts: prev,
      categoryDiscounts: [
        ...get().categoryDiscounts.filter((d) => d.categoryId !== categoryId),
        { id: Date.now(), categoryId, categoryName: cat.name, percent, expiresAt },
      ],
    });
  },
  removeCategoryDiscount: (categoryId) => {
    const disc = get().categoryDiscounts.find((d) => d.categoryId === categoryId);
    if (disc) {
      set({
        foods: get().foods.map((f) =>
          f.categoryId === categoryId && f.discountPrice
            ? { ...f, discountPrice: undefined }
            : f
        ),
        categoryDiscounts: get().categoryDiscounts.filter((d) => d.categoryId !== categoryId),
      });
    }
  },

  // Settings
  updateSettings: (data) => set({ settings: { ...get().settings, ...data } }),
  addInventory: (entry) => set({ inventory: [...get().inventory, { ...entry, id: Date.now() }] }),
  updateInventory: (id, data) => set({ inventory: get().inventory.map((i) => (i.id === id ? { ...i, ...data } : i)) }),

  // Notify seller about new orders
  getPendingOrders: () => get().orders.filter((o) => o.status === 'pending' || o.status === 'preparing'),

  // Courier helpers
  getCourierOrders: () => get().orders.filter((o) => o.status === 'onTheWay' || o.status === 'ready'),
  getAvailableOrders: () => get().orders.filter((o) => o.status === 'ready' && !o.courierId),

  // Admin actions
  addBranch: (branch) => set({ branches: [...get().branches, { ...branch, id: Date.now() }] }),
  addEmployee: (employee) => set({ employees: [...get().employees, { ...employee, id: Date.now() }] }),
  removeEmployee: (id) => set({ employees: get().employees.filter((e) => e.id !== id) }),

  // Timer
  startOrderTimer: (orderId) => {
    const timers = { ...get().activeOrderTimers };
    timers[orderId] = { startTime: Date.now(), elapsed: 0 };
    set({ activeOrderTimers: timers });
  },
  stopOrderTimer: (orderId) => {
    const timers = { ...get().activeOrderTimers };
    if (timers[orderId]) {
      timers[orderId].elapsed = Date.now() - timers[orderId].startTime;
      set({ activeOrderTimers: timers });
    }
  },

  // Reset
  reset: () => set(initialState),
}));

// Backendga avtomatik saqlash (hamma o'zgarishlar bazaga yoziladi)
let saveTimer = null;
useStore.subscribe((state, prev) => {
  let serverDirty = false;
  let clientDirty = false;
  for (const k of SERVER_KEYS) if (state[k] !== prev[k]) { serverDirty = true; break; }
  for (const k of SESSION_KEYS) if (state[k] !== prev[k]) { clientDirty = true; break; }
  if (serverDirty) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      api.saveData(buildSnapshot(useStore.getState())).catch(() => {});
    }, 600);
  }
  if (clientDirty) {
    try {
      const s = useStore.getState();
      const item = {};
      for (const k of SESSION_KEYS) item[k] = s[k];
      localStorage.setItem(SESSION_KEY, JSON.stringify(item));
    } catch { /* localStorage band bo'lishi mumkin */ }
  }
});

export default useStore;
