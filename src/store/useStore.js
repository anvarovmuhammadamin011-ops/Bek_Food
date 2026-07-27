import { create } from 'zustand';
import { foods, restaurants, categories, banners, addresses, notifications } from '../data/mockData';

const initialState = {
  user: null,
  isAuthenticated: false,
  role: null,
  cart: [],
  orders: [],
  favorites: [],
  appliedCoupon: null,
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
  // Seller state
  inventory: [],
  // Admin state
  branches: restaurants,
  employees: [],
  isAppLoading: true,
};

export const useStore = create((set, get) => ({
  ...initialState,

  // Auth
  setLoading: (v) => set({ isAppLoading: v }),
  login: (phone) => {
    set({
      user: { id: 1, name: 'Bekzod', phone, photo: null, bonus: 15000 },
      isAuthenticated: true,
      role: 'customer',
    });
  },
  loginAs: (role, userData) => {
    set({
      user: userData || { id: 1, name: 'Bekzod', phone: '+998901234567' },
      isAuthenticated: true,
      role,
    });
  },
  logout: () => set({ user: null, isAuthenticated: false, role: null, cart: [], orders: [], currentOrder: null }),

  // Cart
  addToCart: (food, quantity = 1, extras = [], notes = '') => {
    const cart = get().cart;
    const existing = cart.find((i) => i.food.id === food.id && i.extras.length === extras.length);
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
  getCartTotal: () => {
    const cart = get().cart;
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const deliveryFee = 0;
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
    };
    set({ orders: [order, ...get().orders], currentOrder: order, cart: [] });
    // Auto progress simulation
    const statuses = ['pending', 'preparing', 'ready', 'onTheWay', 'delivered'];
    statuses.forEach((s, i) => {
      setTimeout(() => {
        const o = get().orders.find((o) => o.id === order.id);
        if (o) get().updateOrderStatus(order.id, s);
      }, (i + 1) * 8000);
    });
    return order;
  },
  updateOrderStatus: (id, status) => {
    set({
      orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)),
      currentOrder: get().currentOrder?.id === id ? { ...get().currentOrder, status } : get().currentOrder,
    });
  },
  cancelOrder: (id) => get().updateOrderStatus(id, 'cancelled'),

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

  // Payment
  setPaymentMethod: (method) => set({ selectedPaymentMethod: method }),

  // Notifications
  markNotifRead: (id) =>
    set({ notifications: get().notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)) }),
  clearNotifs: () => set({ notifications: [] }),

  // Coupon
  applyPromoCode: (code) => {
    if (code === 'BEK20') {
      set({ appliedCoupon: { code: 'BEK20', discount: 20, discountType: 'percent' } });
      return true;
    }
    return false;
  },
  removeCoupon: () => set({ appliedCoupon: null }),

  // Seller actions
  addProduct: (product) => set({ foods: [...get().foods, { ...product, id: Date.now() }] }),
  updateProduct: (id, data) => set({ foods: get().foods.map((f) => (f.id === id ? { ...f, ...data } : f)) }),
  deleteProduct: (id) => set({ foods: get().foods.filter((f) => f.id !== id) }),
  addInventory: (entry) => set({ inventory: [...get().inventory, { ...entry, id: Date.now() }] }),

  // Notify seller about new orders
  getPendingOrders: () => get().orders.filter((o) => o.status === 'pending' || o.status === 'preparing'),

  // Admin actions
  addBranch: (branch) => set({ branches: [...get().branches, { ...branch, id: Date.now() }] }),
  addEmployee: (employee) => set({ employees: [...get().employees, { ...employee, id: Date.now() }] }),
  removeEmployee: (id) => set({ employees: get().employees.filter((e) => e.id !== id) }),

  // Reset
  reset: () => set(initialState),
}));

export default useStore;
