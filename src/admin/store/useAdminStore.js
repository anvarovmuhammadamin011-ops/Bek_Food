import { create } from 'zustand';
import {
  adminUser as initialUser,
  orders as initialOrders,
  drivers as initialDrivers,
  customers as initialCustomers,
  inventory as initialInventory,
  coupons as initialCoupons,
  notifications as initialNotifications,
  dailyStats,
  weeklyData,
  monthlyData,
  topFoods,
  peakHours,
  topCategories,
  recentActivity,
  restaurantStatus,
  systemHealth,
  staff as initialStaff,
  settings as initialSettings,
} from '../data/adminMockData';

const useAdminStore = create((set, get) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  login: (email, password) => {
    set({ user: initialUser, isAuthenticated: true });
    return true;
  },
  logout: () => set({ user: null, isAuthenticated: false }),

  // Orders
  orders: initialOrders,
  updateOrderStatus: (orderId, status, driverId = null) => set((s) => ({
    orders: s.orders.map((o) =>
      o.id === orderId ? { ...o, status, ...(driverId && { driverId }) } : o
    ),
  })),
  getOrderById: (id) => get().orders.find((o) => o.id === id),

  // Drivers
  drivers: initialDrivers,
  updateDriverStatus: (driverId, status) => set((s) => ({
    drivers: s.drivers.map((d) =>
      d.id === driverId ? { ...d, status } : d
    ),
  })),
  assignDriver: (orderId, driverId) => set((s) => ({
    orders: s.orders.map((o) =>
      o.id === orderId ? { ...o, driverId, status: 'assigned' } : o
    ),
    drivers: s.drivers.map((d) =>
      d.id === driverId ? { ...d, currentOrders: d.currentOrders + 1 } : d
    ),
  })),
  getAvailableDrivers: () => get().drivers.filter((d) => d.status === 'available'),

  // Customers
  customers: initialCustomers,
  toggleBlockCustomer: (customerId) => set((s) => ({
    customers: s.customers.map((c) =>
      c.id === customerId ? { ...c, isBlocked: !c.isBlocked } : c
    ),
  })),

  // Inventory
  inventory: initialInventory,
  updateInventoryStock: (itemId, stock) => set((s) => ({
    inventory: s.inventory.map((i) =>
      i.id === itemId ? { ...i, stock } : i
    ),
  })),
  addInventoryItem: (item) => set((s) => ({
    inventory: [...s.inventory, { ...item, id: Date.now() }],
  })),
  removeInventoryItem: (itemId) => set((s) => ({
    inventory: s.inventory.filter((i) => i.id !== itemId),
  })),

  // Coupons
  coupons: initialCoupons,
  addCoupon: (coupon) => set((s) => ({
    coupons: [...s.coupons, { ...coupon, id: Date.now(), usedCount: 0 }],
  })),
  toggleCouponActive: (couponId) => set((s) => ({
    coupons: s.coupons.map((c) =>
      c.id === couponId ? { ...c, isActive: !c.isActive } : c
    ),
  })),
  deleteCoupon: (couponId) => set((s) => ({
    coupons: s.coupons.filter((c) => c.id !== couponId),
  })),

  // Notifications
  notifications: initialNotifications,
  markNotificationRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    ),
  })),
  markAllNotificationsRead: () => set((s) => ({
    notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
  })),
  unreadCount: () => get().notifications.filter((n) => !n.isRead).length,

  // Staff
  staff: initialStaff,

  // Stats & Analytics
  dailyStats,
  weeklyData,
  monthlyData,
  topFoods,
  peakHours,
  topCategories,
  recentActivity,
  restaurantStatus,
  systemHealth,

  // Settings
  settings: initialSettings,
  updateSettings: (data) => set((s) => ({
    settings: { ...s.settings, ...data },
  })),

  // Sidebar
  sidebarOpen: true,
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebarCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  // Active page
  activePage: 'dashboard',
  setActivePage: (page) => set({ activePage: page }),

  // Dark mode
  darkMode: false,
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
}));

export default useAdminStore;
