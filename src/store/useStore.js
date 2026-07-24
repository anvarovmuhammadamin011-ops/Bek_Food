import { create } from 'zustand';
import { restaurants, foods, categories, banners, coupons as couponData, notifications as notifData, addresses as addrData } from '../data/mockData';

const useStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,

  restaurants,
  foods,
  categories,
  banners,
  coupons: couponData,
  notifications: notifData,
  addresses: addrData,
  favorites: [],
  orders: [],
  cart: [],
  selectedRestaurant: null,
  selectedFood: null,
  searchQuery: '',
  searchResults: [],
  recentSearches: ['Burger', 'Pizza', 'Chicken'],
  selectedPaymentMethod: 'cash',
  appliedCoupon: null,
  currentOrder: null,

  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false, cart: [], orders: [], favorites: [] }),

  updateUser: (data) => set((s) => ({ user: { ...s.user, ...data } })),

  selectRestaurant: (id) => {
    const r = get().restaurants.find((r) => r.id === id);
    set({ selectedRestaurant: r });
  },

  selectFood: (id) => {
    const f = get().foods.find((f) => f.id === id);
    set({ selectedFood: f });
  },

  search: (q) => {
    const foods = get().foods.filter((f) => f.name.toLowerCase().includes(q.toLowerCase()));
    const restaurants = get().restaurants.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));
    set({ searchQuery: q, searchResults: [...restaurants.map(r => ({...r, type: 'restaurant'})), ...foods.map(f => ({...f, type: 'food'}))] });
    if (q && !get().recentSearches.includes(q)) {
      set((s) => ({ recentSearches: [q, ...s.recentSearches.slice(0, 9)] }));
    }
  },

  addToCart: (food, quantity = 1, extras = [], notes = '') => {
    const item = {
      id: Date.now(),
      foodId: food.id,
      food,
      quantity,
      extras,
      notes,
      price: (food.discountPrice || food.price) + extras.reduce((s, e) => s + (e.price || 0), 0),
    };
    set((s) => ({ cart: [...s.cart, item] }));
  },

  removeFromCart: (foodId) => set((s) => ({ cart: s.cart.filter((i) => i.foodId !== foodId) })),

  updateCartItemQuantity: (foodId, delta) => set((s) => ({
    cart: s.cart.map((i) => i.foodId === foodId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i),
  })),

  clearCart: () => set({ cart: [] }),

  getCartTotal: () => {
    const cart = get().cart;
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const deliveryFee = subtotal > 50000 ? 0 : 10000;
    const serviceFee = Math.round(subtotal * 0.05);
    const tax = Math.round(subtotal * 0.12);
    let discount = 0;
    const coupon = get().appliedCoupon;
    if (coupon) {
      discount = coupon.discountType === 'percent' ? Math.round(subtotal * coupon.discount / 100) : coupon.discount;
    }
    return { subtotal, deliveryFee, serviceFee, tax, discount, total: subtotal + deliveryFee + serviceFee - tax - discount };
  },

  applyPromoCode: (code) => {
    const coupon = get().coupons.find((c) => c.code === code.toUpperCase() && c.isActive);
    if (coupon) {
      set({ appliedCoupon: coupon });
      return true;
    }
    return false;
  },

  removeCoupon: () => set({ appliedCoupon: null }),

  toggleFavorite: (type, id) => set((s) => {
    const exists = s.favorites.find((f) => f.type === type && f.id === id);
    if (exists) return { favorites: s.favorites.filter((f) => !(f.type === type && f.id === id)) };
    return { favorites: [...s.favorites, { type, id }] };
  }),

  isFavorite: (type, id) => get().favorites.some((f) => f.type === type && f.id === id),

  placeOrder: (paymentMethod, address, notes) => {
    const cart = get().cart;
    const totals = get().getCartTotal();
    const order = {
      id: Date.now(),
      userId: get().user?.id || 1,
      restaurantId: cart[0]?.food?.restaurantId,
      items: [...cart],
      status: 'preparing',
      deliveryAddress: address,
      paymentMethod,
      deliveryFee: totals.deliveryFee,
      serviceFee: totals.serviceFee,
      tax: totals.tax,
      total: totals.total,
      notes,
      createdAt: new Date().toISOString(),
      estimatedDelivery: '25-35 min',
      driver: { id: 1, name: 'Sardor R.', phone: '+998901234567', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', vehicleType: 'Car', rating: 4.9 },
    };
    set((s) => ({ orders: [order, ...s.orders], currentOrder: order, cart: [], appliedCoupon: null }));
    return order;
  },

  updateOrderStatus: (orderId, status) => set((s) => ({
    orders: s.orders.map((o) => o.id === orderId ? { ...o, status } : o),
    currentOrder: s.currentOrder?.id === orderId ? { ...s.currentOrder, status } : s.currentOrder,
  })),

  addNotification: (notif) => set((s) => ({ notifications: [notif, ...s.notifications] })),

  markNotificationRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n),
  })),

  addAddress: (addr) => set((s) => ({ addresses: [...s.addresses, { ...addr, id: Date.now(), userId: s.user?.id || 1 }] })),

  removeAddress: (id) => set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),

  setDefaultAddress: (id) => set((s) => ({
    addresses: s.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
  })),

  setPaymentMethod: (method) => set({ selectedPaymentMethod: method }),
}));

export default useStore;
