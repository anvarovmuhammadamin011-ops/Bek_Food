import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import BottomNav from './components/BottomNav';
import AdminApp from './admin/AdminApp';
import DriverApp from './driver/DriverApp';
import OrderManagerApp from './order-manager/OrderManagerApp';

// Lazy load pages for code splitting
const SplashScreen = lazy(() => import('./pages/SplashScreen'));
const AuthScreen = lazy(() => import('./pages/AuthScreen'));
const HomePage = lazy(() => import('./pages/HomePage'));
const RestaurantPage = lazy(() => import('./pages/RestaurantPage'));
const FoodDetailPage = lazy(() => import('./pages/FoodDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LiveTrackingPage = lazy(() => import('./pages/LiveTrackingPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const CouponsPage = lazy(() => import('./pages/CouponsPage'));
const AddressesPage = lazy(() => import('./pages/AddressesPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Loading fallback — matches warm theme
function PageLoader() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-terracotta))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(232, 89, 12, 0.3)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>
          <span style={{ fontWeight: 900, color: 'white', fontSize: '13px' }}>BF</span>
        </div>
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-muted)',
          letterSpacing: '0.05em',
        }}>
          Loading...
        </span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Admin Routes - No app shell */}
          <Route path="/admin/*" element={<AdminApp />} />

          {/* Driver Routes - No app shell */}
          <Route path="/driver/*" element={<DriverApp />} />

          {/* Order Manager Routes - No app shell */}
          <Route path="/order-manager/*" element={<OrderManagerApp />} />

          {/* Customer App Routes */}
          <Route path="*" element={
            <div className="app-shell">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/splash" element={<SplashScreen />} />
                  <Route path="/login" element={<AuthScreen />} />
                  <Route path="/" element={<HomePage />} />
                  <Route path="/restaurant/:id" element={<RestaurantPage />} />
                  <Route path="/food/:id" element={<FoodDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/tracking" element={<LiveTrackingPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/reviews" element={<ReviewsPage />} />
                  <Route path="/coupons" element={<CouponsPage />} />
                  <Route path="/addresses" element={<AddressesPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
              <BottomNav />
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
