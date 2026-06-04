import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Order, DailyReport, User, Notification, Customer, Inventory, RegistrationRequest } from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
  orders: Order[];
  reports: DailyReport[];
  tailors: User[];
  notifications: Notification[];
  customers: Customer[];
  inventory: Inventory[];
  registrationRequests: RegistrationRequest[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addReport: (report: Omit<DailyReport, 'id' | 'createdAt'>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (notificationId: string) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (customerId: string, customer: Partial<Customer>) => void;
  addInventoryItem: (item: Omit<Inventory, 'id' | 'lastUpdated'>) => void;
  updateInventoryItem: (itemId: string, item: Partial<Inventory>) => void;
  updateRegistrationStatus: (requestId: string, status: 'approved' | 'rejected', reviewedBy: string) => void;
  getOrdersByTailor: (tailorId: string) => Order[];
  getReportsByOrder: (orderId: string) => DailyReport[];
  getUnreadNotifications: (userId: string) => Notification[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([]);
  const [tailors, setTailors] = useState<User[]>([]);

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders', { headers: getHeaders() });
      if (res.ok) setOrders(await res.json());
    } catch (e) {
      console.error('Error fetching orders:', e);
    }
  }, [getHeaders]);

  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch('/api/reports', { headers: getHeaders() });
      if (res.ok) setReports(await res.json());
    } catch (e) {
      console.error('Error fetching reports:', e);
    }
  }, [getHeaders]);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications', { headers: getHeaders() });
      if (res.ok) setNotifications(await res.json());
    } catch (e) {
      console.error('Error fetching notifications:', e);
    }
  }, [getHeaders]);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await fetch('/api/customers', { headers: getHeaders() });
      if (res.ok) setCustomers(await res.json());
    } catch (e) {
      console.error('Error fetching customers:', e);
    }
  }, [getHeaders]);

  const fetchInventory = useCallback(async () => {
    try {
      const res = await fetch('/api/inventory', { headers: getHeaders() });
      if (res.ok) setInventory(await res.json());
    } catch (e) {
      console.error('Error fetching inventory:', e);
    }
  }, [getHeaders]);

  const fetchTailors = useCallback(async () => {
    try {
      const res = await fetch('/api/users/tailors', { headers: getHeaders() });
      if (res.ok) setTailors(await res.json());
    } catch (e) {
      console.error('Error fetching tailors:', e);
    }
  }, [getHeaders]);

  const fetchRegistrations = useCallback(async () => {
    try {
      const res = await fetch('/api/registrations', { headers: getHeaders() });
      if (res.ok) setRegistrationRequests(await res.json());
    } catch (e) {
      console.error('Error fetching registrations:', e);
    }
  }, [getHeaders]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchReports();
      fetchNotifications();
      fetchCustomers();
      fetchInventory();
      fetchTailors();
      if (user?.role === 'admin') {
        fetchRegistrations();
      }
    }
  }, [isAuthenticated, user?.role, fetchOrders, fetchReports, fetchNotifications, fetchCustomers, fetchInventory, fetchTailors, fetchRegistrations]);

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        const newOrder = await res.json();
        setOrders(prev => [newOrder, ...prev]);
        fetchNotifications(); // Refresh notifications since new order generates one
      }
    } catch (e) {
      console.error('Error adding order:', e);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
      }
    } catch (e) {
      console.error('Error updating order status:', e);
    }
  };

  const addReport = async (reportData: Omit<DailyReport, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(reportData),
      });
      if (res.ok) {
        const newReport = await res.json();
        setReports(prev => [newReport, ...prev]);
        // Re-fetch orders because updating report can alter order status
        fetchOrders();
      }
    } catch (e) {
      console.error('Error adding report:', e);
    }
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    // Notifications are handled automatically on the backend upon order creation/events
    console.log('addNotification called client-side (handled by server)', notificationData);
  };

  const markNotificationRead = async (notificationId: string) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: getHeaders(),
      });
      if (res.ok) {
        const updatedNotification = await res.json();
        setNotifications(prev => prev.map(n => n.id === notificationId ? updatedNotification : n));
      }
    } catch (e) {
      console.error('Error marking notification read:', e);
    }
  };

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(customerData),
      });
      if (res.ok) {
        const newCustomer = await res.json();
        setCustomers(prev => [...prev, newCustomer]);
      }
    } catch (e) {
      console.error('Error adding customer:', e);
    }
  };

  const updateCustomer = async (customerId: string, customerData: Partial<Customer>) => {
    try {
      const res = await fetch(`/api/customers/${customerId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(customerData),
      });
      if (res.ok) {
        const updatedCustomer = await res.json();
        setCustomers(prev => prev.map(c => c.id === customerId ? updatedCustomer : c));
      }
    } catch (e) {
      console.error('Error updating customer:', e);
    }
  };

  const addInventoryItem = async (itemData: Omit<Inventory, 'id' | 'lastUpdated'>) => {
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(itemData),
      });
      if (res.ok) {
        const newItem = await res.json();
        setInventory(prev => [...prev, newItem]);
      }
    } catch (e) {
      console.error('Error adding inventory item:', e);
    }
  };

  const updateInventoryItem = async (itemId: string, itemData: Partial<Inventory>) => {
    try {
      const res = await fetch(`/api/inventory/${itemId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(itemData),
      });
      if (res.ok) {
        const updatedItem = await res.json();
        setInventory(prev => prev.map(i => i.id === itemId ? updatedItem : i));
      }
    } catch (e) {
      console.error('Error updating inventory item:', e);
    }
  };

  const updateRegistrationStatus = async (requestId: string, status: 'approved' | 'rejected', reviewedBy: string) => {
    try {
      const res = await fetch(`/api/registrations/${requestId}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updatedRequest = await res.json();
        setRegistrationRequests(prev => prev.map(r => r.id === requestId ? updatedRequest : r));
        
        // Approved status means a new tailor account is created; re-fetch tailors list
        if (status === 'approved') {
          fetchTailors();
        }
      }
    } catch (e) {
      console.error('Error updating registration status:', e);
    }
  };

  const getOrdersByTailor = (tailorId: string) => {
    return orders.filter(order => order.assignedTo === tailorId);
  };

  const getReportsByOrder = (orderId: string) => {
    return reports.filter(report => report.orderId === orderId);
  };

  const getUnreadNotifications = (userId: string) => {
    return notifications.filter(notification => 
      notification.userId === userId && !notification.isRead
    );
  };

  return (
    <DataContext.Provider value={{
      orders,
      reports,
      tailors,
      notifications,
      customers,
      inventory,
      registrationRequests,
      addOrder,
      updateOrderStatus,
      addReport,
      addNotification,
      markNotificationRead,
      addCustomer,
      updateCustomer,
      addInventoryItem,
      updateInventoryItem,
      updateRegistrationStatus,
      getOrdersByTailor,
      getReportsByOrder,
      getUnreadNotifications,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};