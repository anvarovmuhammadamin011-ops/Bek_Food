import { Routes, Route, Navigate } from 'react-router-dom';
import useOrderManagerStore from './store/useOrderManagerStore';
import OMSidebar from './components/OMSidebar';
import OMTopBar from './components/OMTopBar';
import OMDriverModal from './components/OMDriverModal';
import OMConfirmDialog from './components/OMConfirmDialog';
import OMLoginPage from './pages/OMLoginPage';
import OMDashboard from './pages/OMDashboard';
import OMOrdersPage from './pages/OMOrdersPage';
import OMDeliveryPage from './pages/OMDeliveryPage';
import OMReceiptsPage from './pages/OMReceiptsPage';
import OMProfilePage from './pages/OMProfilePage';
import './orderManager.css';

function OMLayout() {
  const { activePage, sidebarCollapsed, darkMode } = useOrderManagerStore();

  const pages = {
    dashboard: OMDashboard,
    orders: OMOrdersPage,
    delivery: OMDeliveryPage,
    receipts: OMReceiptsPage,
    profile: OMProfilePage,
  };

  const ActivePage = pages[activePage] || OMDashboard;

  return (
    <div className={`om-layout${darkMode ? ' om-dark' : ''}`}>
      <OMSidebar />
      <div className={`om-main${sidebarCollapsed ? ' om-collapsed' : ''}`}>
        <OMTopBar />
        <main className="om-content">
          <ActivePage />
        </main>
      </div>
      <OMDriverModal />
      <OMConfirmDialog />
    </div>
  );
}

export default function OrderManagerApp() {
  const { isAuthenticated } = useOrderManagerStore();

  return (
    <Routes>
      <Route index element={isAuthenticated ? <OMLayout /> : <Navigate to="/order-manager/login" replace />} />
      <Route path="login" element={isAuthenticated ? <Navigate to="/order-manager" replace /> : <OMLoginPage />} />
      <Route path="*" element={isAuthenticated ? <OMLayout /> : <Navigate to="/order-manager/login" replace />} />
    </Routes>
  );
}
