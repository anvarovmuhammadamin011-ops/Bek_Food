import { Routes, Route, Navigate } from 'react-router-dom';
import useDriverStore from './store/useDriverStore';
import DriverSidebar from './components/DriverSidebar';
import DriverTopBar from './components/DriverTopBar';
import DriverLoginPage from './pages/DriverLoginPage';
import DriverDashboard from './pages/DriverDashboard';
import DriverOrdersPage from './pages/DriverOrdersPage';
import DriverHistoryPage from './pages/DriverHistoryPage';
import DriverEarningsPage from './pages/DriverEarningsPage';
import DriverProfilePage from './pages/DriverProfilePage';
import './driver.css';

function DriverLayout() {
  const { activePage, sidebarCollapsed } = useDriverStore();

  const pages = {
    dashboard: DriverDashboard,
    orders: DriverOrdersPage,
    history: DriverHistoryPage,
    earnings: DriverEarningsPage,
    profile: DriverProfilePage,
  };

  const ActivePage = pages[activePage] || DriverDashboard;

  return (
    <div className="driver-layout">
      <DriverSidebar />
      <div className={`driver-main${sidebarCollapsed ? ' driver-collapsed' : ''}`}>
        <DriverTopBar />
        <main className="driver-content">
          <ActivePage />
        </main>
      </div>
    </div>
  );
}

export default function DriverApp() {
  const { isAuthenticated } = useDriverStore();

  return (
    <Routes>
      <Route path="/driver/login" element={isAuthenticated ? <Navigate to="/driver" /> : <DriverLoginPage />} />
      <Route path="/driver/*" element={isAuthenticated ? <DriverLayout /> : <Navigate to="/driver/login" />} />
      <Route path="/driver" element={isAuthenticated ? <DriverLayout /> : <Navigate to="/driver/login" />} />
    </Routes>
  );
}
