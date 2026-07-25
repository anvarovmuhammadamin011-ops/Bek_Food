import { create } from 'zustand';
import {
  driverProfile,
  driverStats,
  availableOrders as initialAvailable,
  activeDelivery as initialActive,
  deliveryHistory as initialHistory,
  weeklyEarningsData,
  driverNotifications as initialNotifications,
  quickMessages,
} from '../data/driverMockData';

const useDriverStore = create((set, get) => ({
  // Auth
  isAuthenticated: false,
  user: null,
  login: (email, password) => {
    set({ isAuthenticated: true, user: driverProfile });
    return true;
  },
  logout: () => set({ isAuthenticated: false, user: null }),

  // Profile
  profile: driverProfile,
  updateProfile: (data) => set((s) => ({ profile: { ...s.profile, ...data } })),

  // Online status
  isOnline: true,
  toggleOnline: () => set((s) => ({ isOnline: !s.isOnline })),

  // Stats
  stats: driverStats,

  // Available orders (pending delivery requests)
  availableOrders: initialAvailable,
  acceptOrder: (orderId) => {
    const order = get().availableOrders.find((o) => o.id === orderId);
    if (order) {
      set((s) => ({
        availableOrders: s.availableOrders.filter((o) => o.id !== orderId),
        activeDelivery: { ...order, status: 'accepted', statusHistory: [
          { status: 'assigned', time: order.createdAt },
          { status: 'accepted', time: new Date().toISOString() },
        ]},
      }));
    }
  },
  rejectOrder: (orderId) => {
    set((s) => ({
      availableOrders: s.availableOrders.filter((o) => o.id !== orderId),
    }));
  },

  // Active delivery
  activeDelivery: initialActive,
  updateDeliveryStatus: (status) => {
    set((s) => {
      if (!s.activeDelivery) return {};
      return {
        activeDelivery: {
          ...s.activeDelivery,
          status,
          statusHistory: [
            ...s.activeDelivery.statusHistory,
            { status, time: new Date().toISOString() },
          ],
        },
      };
    });
  },
  completeDelivery: (outcome = 'delivered') => {
    const delivery = get().activeDelivery;
    if (!delivery) return;
    const record = {
      ...delivery,
      status: outcome,
      completedAt: new Date().toISOString(),
      timeTaken: get().stats.avgDeliveryTime,
    };
    set((s) => ({
      activeDelivery: null,
      deliveryHistory: [record, ...s.deliveryHistory],
      stats: {
        ...s.stats,
        todayDeliveries: s.stats.todayDeliveries + 1,
        todayEarnings: s.stats.todayEarnings + delivery.deliveryFee,
      },
    }));
  },

  // Delivery history
  deliveryHistory: initialHistory,

  // Earnings
  weeklyEarnings: weeklyEarningsData,

  // Notifications
  notifications: initialNotifications,
  markNotificationRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n),
  })),
  unreadCount: () => get().notifications.filter((n) => !n.isRead).length,

  // Quick messages
  quickMessages,

  // Active page
  activePage: 'dashboard',
  setActivePage: (page) => set({ activePage: page }),

  // Sidebar
  sidebarOpen: false,
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebarCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  // Dark mode
  darkMode: false,
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

  // Delivery request countdown
  requestCountdown: 30,
  setRequestCountdown: (val) => set({ requestCountdown: val }),

  // Toast
  toast: null,
  showToast: (message, type = 'info') => {
    set({ toast: { message, type, id: Date.now() } });
    setTimeout(() => set({ toast: null }), 3000);
  },
}));

export default useDriverStore;
