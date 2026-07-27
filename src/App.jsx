import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store/useStore';
import BottomNav from './components/BottomNav';

// Customer pages
import SplashScreen from './pages/SplashScreen';
import LoginPage from './pages/LoginPage';
import VerifyPage from './pages/VerifyPage';
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
import SellerMenu from './pages/seller/SellerMenu';
import SellerInventory from './pages/seller/SellerInventory';
import SellerBonuses from './pages/seller/SellerBonuses';

// Courier pages
import CourierDashboard from './pages/courier/CourierDashboard';
import CourierOrders from './pages/courier/CourierOrders';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBranches from './pages/admin/AdminBranches';
import AdminEmployees from './pages/admin/AdminEmployees';
import AdminStatistics from './pages/admin/AdminStatistics';
import AdminOrders from './pages/admin/AdminOrders';

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
        <Route path="/verify" element={<AppShell><VerifyPage /></AppShell>} />

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
        <Route path="/seller" element={<ProtectedRoute allowedRoles={['seller']}><AppShell wide><SellerDashboard /></AppShell></ProtectedRoute>} />
        <Route path="/seller/orders" element={<ProtectedRoute allowedRoles={['seller']}><AppShell wide><SellerOrders /></AppShell></ProtectedRoute>} />
        <Route path="/seller/menu" element={<ProtectedRoute allowedRoles={['seller']}><AppShell wide><SellerMenu /></AppShell></ProtectedRoute>} />
        <Route path="/seller/inventory" element={<ProtectedRoute allowedRoles={['seller']}><AppShell wide><SellerInventory /></AppShell></ProtectedRoute>} />
        <Route path="/seller/bonuses" element={<ProtectedRoute allowedRoles={['seller']}><AppShell wide><SellerBonuses /></AppShell></ProtectedRoute>} />

        {/* Courier routes */}
        <Route path="/courier" element={<ProtectedRoute allowedRoles={['courier']}><AppShell wide><CourierDashboard /></AppShell></ProtectedRoute>} />
        <Route path="/courier/orders" element={<ProtectedRoute allowedRoles={['courier']}><AppShell wide><CourierOrders /></AppShell></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AppShell wide><AdminDashboard /></AppShell></ProtectedRoute>} />
        <Route path="/admin/branches" element={<ProtectedRoute allowedRoles={['admin']}><AppShell wide><AdminBranches /></AppShell></ProtectedRoute>} />
        <Route path="/admin/employees" element={<ProtectedRoute allowedRoles={['admin']}><AppShell wide><AdminEmployees /></AppShell></ProtectedRoute>} />
        <Route path="/admin/statistics" element={<ProtectedRoute allowedRoles={['admin']}><AppShell wide><AdminStatistics /></AppShell></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute allowedRoles={['admin']}><AppShell wide><AdminOrders /></AppShell></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
