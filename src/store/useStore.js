import { create } from 'zustand';
import api from '../lib/api';
import { restaurants, foods, categories, banners, coupons as couponData, notifications as notifData, addresses as addrData } from '../data/mockData';

const useStore = create((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  authLoading: false,
  authError: null,

  // Data (mock fallback + real API)
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

  // Delivery state
  deliveryType: 'delivery',
  selectedAddressId: addrData.find(a => a.isDefault)?.id || addrData[0]?.id || null,
  deliveryLocation: null,
  estimatedDeliveryTime: '25-35 min',

  // Loading states
  loading: false,
  cartLoading: false,

  // ── AUTH ──
  login: async (email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const res = await api.login(email, password);
      set({ user: res.data.user, isAuthenticated: true, authLoading: false });
      // Load user data after login
      get().loadUserData();
      return true;
    } catch (err) {
      // Fallback to mock login if backend unavailable
      if (err.message.includes('fetch') || err.message.includes('NetworkError')) {
        set({ user: { id: 1, name: 'Guest', email, role: 'CUSTOMER' }, isAuthenticated: true, authLoading: false });
        return true;
      }
      set({ authError: err.message, authLoading: false });
      return false;
    }
  },

  register: async (data) => {
    set({ authLoading: true, authError: null });
    try {
      const res = await api.register(data);
      set({ user: res.data.user, isAuthenticated: true, authLoading: false });
      return true;
    } catch (err) {
      if (err.message.includes('fetch') || err.message.includes('NetworkError')) {
        set({ user: { id: 1, ...data, role: 'CUSTOMER' }, isAuthenticated: true, authLoading: false });
        return true;
      }
      set({ authError: err.message, authLoading: false });
      return false;
    }
  },

  logout: async () => {
    try { await api.logout(); } catch {}
    set({
      user: null, isAuthenticated: false, cart: [], orders: [], favorites: [],
      appliedCoupon: null, currentOrder: null,
    });
  },

  // ── LOAD DATA FROM API ──
  loadUserData: async () => {
    try {
      const [profileRes, cartRes, ordersRes, addressesRes] = await Promise.allSettled([
        api.getProfile(),
        api.getCart(),
        api.getOrders(),
        api.getAddresses(),
      ]);

      const updates = {};
      if (profileRes.status === 'fulfilled') updates.user = profileRes.value.data;
      if (cartRes.status === 'fulfilled' && cartRes.value.data?.items) {
        updates.cart = cartRes.value.data.items.map(i => ({
          id: i.id,
          foodId: i.productId,
          food: i.product,
          quantity: i.quantity,
          notes: i.notes || '',
          price: i.product.discountPrice || i.product.price,
          extras: [],
        }));
      }
      if (ordersRes.status === 'fulfilled') updates.orders = ordersRes.value.data || [];
      if (addressesRes.status === 'fulfilled') updates.addresses = addressesRes.value.data || [];

      set(updates);
    } catch {}
  },

  loadProducts: async () => {
    try {
      const res = await api.getProducts({ page: 1, limit: 100 });
      if (res.data) set({ foods: res.data });
    } catch {}
  },

  loadCategories: async () => {
    try {
      const res = await api.getCategories();
      if (res.data) set({ categories: res.data });
    } catch {}
  },

  // ── SELECTORS ──
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

  // ── CART ──
  addToCart: async (food, quantity = 1, extras = [], notes = '') => {
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

    // Try to sync with backend
    try { await api.addToCart(food.id, quantity); } catch {}
  },

  removeFromCart: async (foodId) => {
    set((s) => ({ cart: s.cart.filter((i) => i.foodId !== foodId) }));
    try { await api.removeFromCart(foodId); } catch {}
  },

  updateCartItemQuantity: async (foodId, delta) => {
    set((s) => {
      const item = s.cart.find(i => i.foodId === foodId);
      if (!item) return {};
      const newQty = Math.max(1, item.quantity + delta);
      if (delta < 0 && item.quantity <= 1) {
        return { cart: s.cart.filter(i => i.foodId !== foodId) };
      }
      return {
        cart: s.cart.map(i => i.foodId === foodId ? { ...i, quantity: newQty } : i),
      };
    });
    const item = get().cart.find(i => i.foodId === foodId);
    if (item) { try { await api.updateCartItem(foodId, item.quantity); } catch {} }
  },

  clearCart: async () => {
    set({ cart: [] });
    try { await api.request('/cart/clear', { method: 'DELETE' }); } catch {}
  },

  getCartTotal: () => {
    const cart = get().cart;
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const deliveryFee = get().deliveryType === 'pickup' ? 0 : (subtotal > 50000 ? 0 : 10000);
    const serviceFee = Math.round(subtotal * 0.05);
    const tax = Math.round(subtotal * 0.12);
    let discount = 0;
    const coupon = get().appliedCoupon;
    if (coupon) {
      discount = coupon.discountType === 'percent' ? Math.round(subtotal * coupon.discount / 100) : coupon.discount;
    }
    return { subtotal, deliveryFee, serviceFee, tax, discount, total: subtotal + deliveryFee + serviceFee - tax - discount };
  },

  // ── PROMO ──
  applyPromoCode: async (code) => {
    // Try backend first
    try {
      const totals = get().getCartTotal();
      const res = await api.validatePromo(code, totals.subtotal);
      if (res.data) {
        set({ appliedCoupon: { code: res.data.code, discount: res.data.discount, discountType: res.data.discountType === 'PERCENT' ? 'percent' : 'fixed' } });
        return true;
      }
    } catch {}
    // Fallback to local coupons
    const coupon = get().coupons.find((c) => c.code === code.toUpperCase() && c.isActive);
    if (coupon) {
      set({ appliedCoupon: coupon });
      return true;
    }
    return false;
  },

  removeCoupon: () => set({ appliedCoupon: null }),

  // ── FAVORITES ──
  toggleFavorite: (type, id) => set((s) => {
    const exists = s.favorites.find((f) => f.type === type && f.id === id);
    if (exists) return { favorites: s.favorites.filter((f) => !(f.type === type && f.id === id)) };
    return { favorites: [...s.favorites, { type, id }] };
  }),

  isFavorite: (type, id) => get().favorites.some((f) => f.type === type && f.id === id),

  // ── ORDERS ──
  placeOrder: async (paymentMethod, address, notes) => {
    const cart = get().cart;
    const totals = get().getCartTotal();

    // Try backend
    try {
      const res = await api.createOrder({
        deliveryType: get().deliveryType,
        addressId: get().selectedAddressId,
        notes,
        paymentMethod: paymentMethod.toUpperCase(),
        items: cart.map(i => ({ productId: i.foodId, quantity: i.quantity })),
        promoCode: get().appliedCoupon?.code,
      });
      if (res.data) {
        set((s) => ({ orders: [res.data, ...s.orders], currentOrder: res.data, cart: [], appliedCoupon: null }));
        return res.data;
      }
    } catch {}

    // Fallback to local
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

  // ── NOTIFICATIONS ──
  addNotification: (notif) => set((s) => ({ notifications: [notif, ...s.notifications] })),

  markNotificationRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n),
  })),

  // ── ADDRESSES ──
  addAddress: async (addr) => {
    const newAddr = { ...addr, id: Date.now(), userId: get().user?.id || 1 };
    set((s) => ({ addresses: [...s.addresses, newAddr] }));
    try { await api.addAddress(addr); } catch {}
  },

  removeAddress: (id) => set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),

  setDefaultAddress: (id) => set((s) => ({
    addresses: s.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
  })),

  // ── SETTINGS ──
  setPaymentMethod: (method) => set({ selectedPaymentMethod: method }),
  setDeliveryType: (type) => set({ deliveryType: type }),
  setSelectedAddress: (id) => set({ selectedAddressId: id }),
  setDeliveryLocation: (loc) => set({ deliveryLocation: loc }),
}));

export default useStore;
