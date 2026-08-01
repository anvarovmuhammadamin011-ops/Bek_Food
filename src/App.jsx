import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';
import BottomNav from './components/BottomNav';

// Customer pages
import SplashScreen from './pages/SplashScreen';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import RestaurantPage from './pages/RestaurantPage';
import FoodDetailPage from './pages/FoodDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import TrackingPage from './pages/TrackingPage';
import OrdersPage from './pages/OrdersPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import AddressesPage from './pages/AddressesPage';

// Seller pages
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerOrders from './pages/seller/SellerOrders';
import SellerDelivery from './pages/seller/SellerDelivery';
import SellerReceipts from './pages/seller/SellerReceipts';
import SellerProfile from './pages/seller/SellerProfile';
import SellerLayout from './components/SellerLayout';

// Courier pages
import CourierDashboard from './pages/courier/CourierDashboard';
import CourierDelivery from './pages/courier/CourierDelivery';
import CourierHistory from './pages/courier/CourierHistory';
import CourierProfile from './pages/courier/CourierProfile';
import CourierLayout from './components/CourierLayout';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminPromotions from './pages/admin/AdminPromotions';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLayout from './components/AdminLayout';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, role } = useStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return children;
}

function AppShell({ children, wide = false }) {
  return <div className={wide ? 'app-shell-wide' : 'app-shell'} style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>{children}</div>;
}

function CustomerLayout({ children }) {
  return (
    <AppShell>
      {children}
      <BottomNav />
    </AppShell>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/splash" element={<AppShell><SplashScreen /></AppShell>} />
        <Route path="/login" element={<AppShell><LoginPage /></AppShell>} />

        {/* Customer routes */}
        <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
        <Route path="/search" element={<CustomerLayout><SearchPage /></CustomerLayout>} />
        <Route path="/restaurant/:id" element={<CustomerLayout><RestaurantPage /></CustomerLayout>} />
        <Route path="/food/:id" element={<CustomerLayout><FoodDetailPage /></CustomerLayout>} />
        <Route path="/cart" element={<CustomerLayout><CartPage /></CustomerLayout>} />
        <Route path="/checkout" element={<CustomerLayout><CheckoutPage /></CustomerLayout>} />
        <Route path="/tracking" element={<CustomerLayout><TrackingPage /></CustomerLayout>} />
        <Route path="/orders" element={<CustomerLayout><OrdersPage /></CustomerLayout>} />
        <Route path="/favorites" element={<CustomerLayout><FavoritesPage /></CustomerLayout>} />
        <Route path="/profile" element={<CustomerLayout><ProfilePage /></CustomerLayout>} />
        <Route path="/notifications" element={<CustomerLayout><NotificationsPage /></CustomerLayout>} />
        <Route path="/addresses" element={<CustomerLayout><AddressesPage /></CustomerLayout>} />

        {/* Seller routes */}
        <Route path="/seller" element={<ProtectedRoute allowedRoles={['seller']}><SellerLayout><SellerDashboard /></SellerLayout></ProtectedRoute>} />
        <Route path="/seller/orders" element={<ProtectedRoute allowedRoles={['seller']}><SellerLayout><SellerOrders /></SellerLayout></ProtectedRoute>} />
        <Route path="/seller/delivery" element={<ProtectedRoute allowedRoles={['seller']}><SellerLayout><SellerDelivery /></SellerLayout></ProtectedRoute>} />
        <Route path="/seller/receipts" element={<ProtectedRoute allowedRoles={['seller']}><SellerLayout><SellerReceipts /></SellerLayout></ProtectedRoute>} />
        <Route path="/seller/profile" element={<ProtectedRoute allowedRoles={['seller']}><SellerLayout><SellerProfile /></SellerLayout></ProtectedRoute>} />

        {/* Courier routes */}
        <Route path="/courier" element={<ProtectedRoute allowedRoles={['courier']}><CourierLayout><CourierDashboard /></CourierLayout></ProtectedRoute>} />
        <Route path="/courier/delivery" element={<ProtectedRoute allowedRoles={['courier']}><CourierLayout><CourierDelivery /></CourierLayout></ProtectedRoute>} />
        <Route path="/courier/history" element={<ProtectedRoute allowedRoles={['courier']}><CourierLayout><CourierHistory /></CourierLayout></ProtectedRoute>} />
        <Route path="/courier/profile" element={<ProtectedRoute allowedRoles={['courier']}><CourierLayout><CourierProfile /></CourierLayout></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminOrders /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminProducts /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminCategories /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/promotions" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminPromotions /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminAnalytics /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
