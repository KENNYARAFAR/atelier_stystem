import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import OrderManagement from './components/OrderManagement';
import AddOrder from './components/AddOrder';
import Reports from './components/Reports';
import UserManagement from './components/UserManagement';
import Customers from './components/Customers';
import Inventory from './components/Inventory';
import Notifications from './components/Notifications';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import RegistrationManagement from './components/RegistrationManagement';
import TailorOrders from './components/TailorOrders';
import TailorProfile from './components/TailorProfile';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <OrderManagement />;
      case 'add-order':
        return <AddOrder />;
      case 'reports':
        return <Reports />;
      case 'user-management':
        return <UserManagement />;
      case 'registration-management':
        return <RegistrationManagement />;
      case 'customers':
        return <Customers />;
      case 'inventory':
        return <Inventory />;
      case 'notifications':
        return <Notifications />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'my-orders':
        return <TailorOrders />;
      case 'my-profile':
        return <TailorProfile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
