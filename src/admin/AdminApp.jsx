import { Routes, Route, Navigate } from 'react-router-dom';
import useAdminStore from './store/useAdminStore';
import Sidebar from './components/Sidebar';
import AdminHeader from './components/AdminHeader';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import DeliveryPage from './pages/DeliveryPage';
import DriversPage from './pages/DriversPage';
import FoodManagementPage from './pages/FoodManagementPage';
import CategoriesPage from './pages/CategoriesPage';
import PromotionsPage from './pages/PromotionsPage';
import CustomersPage from './pages/CustomersPage';
import InventoryPage from './pages/InventoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import './admin.css';

function AdminLayout() {
  const { activePage, sidebarCollapsed, darkMode } = useAdminStore();

  const pages = {
    dashboard: DashboardPage,
    orders: OrdersPage,
    delivery: DeliveryPage,
    drivers: DriversPage,
    food: FoodManagementPage,
    categories: CategoriesPage,
    promotions: PromotionsPage,
    customers: CustomersPage,
    inventory: InventoryPage,
    analytics: AnalyticsPage,
    notifications: NotificationsPage,
    settings: SettingsPage,
  };

  const ActivePage = pages[activePage] || DashboardPage;

  return (
    <div className={`admin-layout${darkMode ? ' admin-dark' : ''}`}>
      <Sidebar />
      <div className={`admin-main${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
        <AdminHeader />
        <main className="admin-content">
          <ActivePage />
        </main>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const { isAuthenticated } = useAdminStore();

  return (
    <Routes>
      <Route index element={isAuthenticated ? <AdminLayout /> : <Navigate to="/admin/login" replace />} />
      <Route path="login" element={isAuthenticated ? <Navigate to="/admin" replace /> : <LoginPage />} />
      <Route path="*" element={isAuthenticated ? <AdminLayout /> : <Navigate to="/admin/login" replace />} />
    </Routes>
  );
}
