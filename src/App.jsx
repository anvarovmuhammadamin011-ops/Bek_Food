import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import BottomNav from './components/BottomNav';

// Lazy load pages for code splitting
const SplashScreen = lazy(() => import('./pages/SplashScreen'));
const AuthScreen = lazy(() => import('./pages/AuthScreen'));
const HomePage = lazy(() => import('./pages/HomePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
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

// Loading fallback
function PageLoader() {
  return (
    <div className="h-full flex items-center justify-center bg-primary">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-muted">Loading...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="app-shell">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/splash" element={<SplashScreen />} />
              <Route path="/login" element={<AuthScreen />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
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
      </BrowserRouter>
    </ErrorBoundary>
  );
}
