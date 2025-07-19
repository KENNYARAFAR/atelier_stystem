import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, DailyReport, User, Notification, Customer, Inventory, RegistrationRequest } from '../types';

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

// Mock data
const mockTailors: User[] = [
  {
    id: '2',
    name: 'John Tailor',
    email: 'john@tailoring.com',
    role: 'tailor',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Sarah Seamstress',
    email: 'sarah@tailoring.com',
    role: 'tailor',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const mockOrders: Order[] = [
  {
    id: '1',
    customerName: 'Alice Johnson',
    garmentType: 'Business Suit',
    fabricType: 'Wool Blend',
    measurements: {
      chest: 38,
      waist: 32,
      length: 42,
      sleeve: 24,
    },
    style: 'Classic fit with notched lapels',
    instructions: 'Customer prefers a conservative cut. Pay attention to shoulder alignment.',
    assignedTo: '2',
    assignedToName: 'John Tailor',
    status: 'in-progress',
    dueDate: '2025-01-20',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
  {
    id: '2',
    customerName: 'Bob Smith',
    garmentType: 'Evening Dress',
    fabricType: 'Silk',
    measurements: {
      chest: 34,
      waist: 28,
      length: 60,
    },
    style: 'A-line with beaded details',
    instructions: 'Handle silk carefully. Customer wants subtle beading on the bodice.',
    assignedTo: '3',
    assignedToName: 'Sarah Seamstress',
    status: 'pending',
    dueDate: '2025-01-25',
    createdAt: '2025-01-10T14:00:00Z',
    updatedAt: '2025-01-10T14:00:00Z',
  },
];

const mockReports: DailyReport[] = [
  {
    id: '1',
    userId: '2',
    userName: 'John Tailor',
    orderId: '1',
    orderTitle: 'Business Suit for Alice Johnson',
    progress: 60,
    workDone: 'Completed cutting and started stitching the jacket body',
    challenges: 'Fabric alignment required extra attention',
    estimatedCompletion: '2025-01-18',
    date: '2025-01-10',
    createdAt: '2025-01-10T18:00:00Z',
  },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '2',
    title: 'New Order Assigned',
    message: 'You have been assigned a new Business Suit order for Alice Johnson',
    type: 'info',
    isRead: false,
    createdAt: '2025-01-10T10:00:00Z',
  },
];

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@email.com',
    phone: '+1-555-0123',
    address: '123 Main St, City, State 12345',
    notes: 'Prefers conservative cuts, regular customer',
    createdAt: '2025-01-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@email.com',
    phone: '+1-555-0124',
    address: '456 Oak Ave, City, State 12345',
    notes: 'First-time customer, needs extra attention to detail',
    createdAt: '2025-01-05T14:00:00Z',
  },
];

const mockInventory: Inventory[] = [
  {
    id: '1',
    itemName: 'Wool Blend Fabric',
    category: 'fabric',
    quantity: 50,
    unit: 'yards',
    minStock: 10,
    supplier: 'Premium Fabrics Co.',
    cost: 25.99,
    lastUpdated: '2025-01-10T10:00:00Z',
  },
  {
    id: '2',
    itemName: 'Silk Thread - Black',
    category: 'thread',
    quantity: 25,
    unit: 'spools',
    minStock: 5,
    supplier: 'Thread Masters',
    cost: 3.50,
    lastUpdated: '2025-01-10T10:00:00Z',
  },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([]);
  const [tailors] = useState<User[]>(mockTailors);

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    const savedReports = localStorage.getItem('reports');
    const savedNotifications = localStorage.getItem('notifications');
    const savedCustomers = localStorage.getItem('customers');
    const savedInventory = localStorage.getItem('inventory');
    const savedRegistrations = localStorage.getItem('registrationRequests');
    
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders(mockOrders);
    }
    
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    } else {
      setReports(mockReports);
    }
    
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    } else {
      setNotifications(mockNotifications);
    }
    
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    } else {
      setCustomers(mockCustomers);
    }
    
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    } else {
      setInventory(mockInventory);
    }
    
    if (savedRegistrations) {
      setRegistrationRequests(JSON.parse(savedRegistrations));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('registrationRequests', JSON.stringify(registrationRequests));
  }, [registrationRequests]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOrders(prev => [...prev, newOrder]);
    
    // Add notification for assigned tailor
    const notification: Omit<Notification, 'id' | 'createdAt'> = {
      userId: orderData.assignedTo,
      title: 'New Order Assigned',
      message: `You have been assigned a new ${orderData.garmentType} order for ${orderData.customerName}`,
      type: 'info',
      isRead: false,
    };
    addNotification(notification);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  const addReport = (reportData: Omit<DailyReport, 'id' | 'createdAt'>) => {
    const newReport: DailyReport = {
      ...reportData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setReports(prev => [...prev, newReport]);
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (customerId: string, customerData: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId 
        ? { ...customer, ...customerData }
        : customer
    ));
  };

  const addInventoryItem = (itemData: Omit<Inventory, 'id' | 'lastUpdated'>) => {
    const newItem: Inventory = {
      ...itemData,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString(),
    };
    setInventory(prev => [...prev, newItem]);
  };

  const updateInventoryItem = (itemId: string, itemData: Partial<Inventory>) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, ...itemData, lastUpdated: new Date().toISOString() }
        : item
    ));
  };

  const updateRegistrationStatus = (requestId: string, status: 'approved' | 'rejected', reviewedBy: string) => {
    setRegistrationRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { 
            ...request, 
            status, 
            reviewedAt: new Date().toISOString(),
            reviewedBy 
          }
        : request
    ));
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