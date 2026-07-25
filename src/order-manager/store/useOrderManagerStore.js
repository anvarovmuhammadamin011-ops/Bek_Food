import { create } from 'zustand';
import { orders as initialOrders, drivers as initialDrivers, operator } from '../data/orderManagerData';

const useOrderManagerStore = create((set, get) => ({
  // Auth
  operator,
  isAuthenticated: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),

  // Orders
  orders: initialOrders,
  selectedOrder: null,
  setSelectedOrder: (order) => set({ selectedOrder: order }),

  updateOrderStatus: (orderId, status, driverId = null, driverName = null) => set((s) => ({
    orders: s.orders.map((o) =>
      o.id === orderId
        ? { ...o, status, ...(driverId && { driverId, driverName }) }
        : o
    ),
  })),

  acceptOrder: (orderId) => {
    get().updateOrderStatus(orderId, 'accepted');
    get().addNotification({ type: 'success', message: `Order accepted` });
  },

  rejectOrder: (orderId) => {
    get().updateOrderStatus(orderId, 'cancelled');
    get().addNotification({ type: 'error', message: `Order cancelled` });
  },

  startPreparing: (orderId) => {
    get().updateOrderStatus(orderId, 'preparing');
    get().addNotification({ type: 'info', message: `Order is now preparing` });
  },

  markReady: (orderId) => {
    get().updateOrderStatus(orderId, 'ready');
    get().addNotification({ type: 'success', message: `Order is ready` });
  },

  assignDriver: (orderId, driverId, driverName) => {
    get().updateOrderStatus(orderId, 'out_for_delivery', driverId, driverName);
    get().addNotification({ type: 'success', message: `Driver ${driverName} assigned` });
  },

  completeOrder: (orderId) => {
    get().updateOrderStatus(orderId, 'delivered');
    get().addNotification({ type: 'success', message: `Order completed` });
  },

  // Drivers
  drivers: initialDrivers,
  getAvailableDrivers: () => get().drivers.filter((d) => d.status === 'available'),

  // Filters
  activeFilter: 'all',
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  sortBy: 'newest',
  setSortBy: (s) => set({ sortBy: s }),

  getFilteredOrders: () => {
    const { orders, activeFilter, searchQuery, sortBy } = get();
    let filtered = [...orders];

    // Filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'delivery') filtered = filtered.filter((o) => o.type === 'delivery');
      else if (activeFilter === 'pickup') filtered = filtered.filter((o) => o.type === 'pickup');
      else if (activeFilter === 'high-value') filtered = filtered.filter((o) => o.total >= 80000);
      else filtered = filtered.filter((o) => o.status === activeFilter);
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'oldest': filtered.sort((a, b) => new Date(a.orderTime) - new Date(b.orderTime)); break;
      case 'highest': filtered.sort((a, b) => b.total - a.total); break;
      case 'lowest': filtered.sort((a, b) => a.total - b.total); break;
      case 'waiting': filtered.sort((a, b) => new Date(a.orderTime) - new Date(b.orderTime)); break;
      case 'delivery': filtered.sort((a, b) => (a.type === 'delivery' ? -1 : 1)); break;
      case 'pickup': filtered.sort((a, b) => (a.type === 'pickup' ? -1 : 1)); break;
      default: filtered.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));
    }

    return filtered;
  },

  // Stats
  getStats: () => {
    const orders = get().orders;
    return {
      pending: orders.filter((o) => o.status === 'pending').length,
      accepted: orders.filter((o) => o.status === 'accepted').length,
      preparing: orders.filter((o) => o.status === 'preparing').length,
      ready: orders.filter((o) => o.status === 'ready').length,
      waitingDriver: orders.filter((o) => o.status === 'ready' && o.type === 'delivery').length,
      outForDelivery: orders.filter((o) => o.status === 'out_for_delivery').length,
      completed: orders.filter((o) => o.status === 'delivered').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
      total: orders.length,
    };
  },

  // Notifications
  notifications: [],
  addNotification: (notif) => set((s) => ({
    notifications: [{ id: Date.now(), ...notif, time: new Date().toISOString(), read: false }, ...s.notifications].slice(0, 50),
  })),
  markNotificationRead: (id) => set((s) => ({
    notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
  })),
  unreadCount: () => get().notifications.filter((n) => !n.read).length,

  // UI
  sidebarOpen: false,
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebarCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  darkMode: false,
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
  activePage: 'dashboard',
  setActivePage: (page) => set({ activePage: page }),

  // Modals
  showDriverModal: false,
  driverModalOrderId: null,
  openDriverModal: (orderId) => set({ showDriverModal: true, driverModalOrderId: orderId }),
  closeDriverModal: () => set({ showDriverModal: false, driverModalOrderId: null }),

  showConfirmDialog: false,
  confirmAction: null,
  confirmMessage: '',
  openConfirm: (message, action) => set({ showConfirmDialog: true, confirmMessage: message, confirmAction: action }),
  closeConfirm: () => set({ showConfirmDialog: false, confirmAction: null, confirmMessage: '' }),
}));

export default useOrderManagerStore;
