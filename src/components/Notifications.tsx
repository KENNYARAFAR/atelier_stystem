import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Bell, Check, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const { notifications, markNotificationRead } = useData();

  const userNotifications = user?.role === 'admin' 
    ? notifications 
    : notifications.filter(n => n.userId === user?.id);

  const unreadNotifications = userNotifications.filter(n => !n.isRead);
  const readNotifications = userNotifications.filter(n => n.isRead);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    unreadNotifications.forEach(notification => {
      markNotificationRead(notification.id);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600">Stay updated with system activities and alerts</p>
        </div>
        {unreadNotifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <Check className="h-5 w-5" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Notifications</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{userNotifications.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Bell className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{unreadNotifications.length}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Read</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{readNotifications.length}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Unread Notifications */}
      {unreadNotifications.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Unread Notifications ({unreadNotifications.length})
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {unreadNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${getNotificationBg(notification.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Read Notifications */}
      {readNotifications.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Read Notifications ({readNotifications.length})
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {readNotifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 rounded-lg border border-gray-200 bg-gray-50 opacity-75"
              >
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {userNotifications.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-500">You'll see notifications here when there are updates</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;