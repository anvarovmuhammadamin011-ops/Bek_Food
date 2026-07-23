import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import SplashScreen from './pages/SplashScreen';
import AuthScreen from './pages/AuthScreen';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import RestaurantPage from './pages/RestaurantPage';
import FoodDetailPage from './pages/FoodDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LiveTrackingPage from './pages/LiveTrackingPage';
import OrdersPage from './pages/OrdersPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import ReviewsPage from './pages/ReviewsPage';
import CouponsPage from './pages/CouponsPage';
import AddressesPage from './pages/AddressesPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
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
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
