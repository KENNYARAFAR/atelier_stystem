import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { LogOut, Scissors, User, FileText, Plus, BarChart3, Users, Bell, Package, Settings, UserPlus } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { user, logout } = useAuth();
  const { getUnreadNotifications } = useData();
  const unreadCount = getUnreadNotifications(user?.id || '').length;

  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: FileText },
    { id: 'add-order', label: 'Add Order', icon: Plus },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'user-management', label: 'User Management', icon: UserPlus },
    { id: 'registration-management', label: 'Registration Requests', icon: UserPlus },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const tailorMenuItems = [
    { id: 'dashboard', label: 'My Tasks', icon: FileText },
    { id: 'reports', label: 'Submit Report', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : tailorMenuItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Scissors className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Elite Tailoring Co.</h1>
                <p className="text-sm text-gray-500">Professional Garment Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                  {user?.role}
                </span>
              </div>
              
              {/* Notifications Bell */}
              <button
                onClick={() => onPageChange('notifications')}
                className="relative text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => onPageChange(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          currentPage === item.id
                            ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">
                          {item.label}
                          {item.id === 'notifications' && unreadCount > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                              {unreadCount}
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Rules & Regulations */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Rules & Regulations</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Submit daily progress reports</li>
                <li>• Follow garment specifications exactly</li>
                <li>• Report any issues immediately</li>
                <li>• Maintain quality standards</li>
                <li>• Meet delivery deadlines</li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;