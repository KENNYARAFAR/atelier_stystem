export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'tailor';
  isActive: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  garmentType: string;
  fabricType: string;
  measurements: {
    chest?: number;
    waist?: number;
    length?: number;
    sleeve?: number;
    [key: string]: number | undefined;
  };
  style: string;
  instructions: string;
  assignedTo: string;
  assignedToName: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  specialization: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface DailyReport {
  id: string;
  userId: string;
  userName: string;
  orderId: string;
  orderTitle: string;
  progress: number;
  workDone: string;
  challenges: string;
  estimatedCompletion: string;
  date: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: string;
}

export interface Inventory {
  id: string;
  itemName: string;
  category: 'fabric' | 'thread' | 'button' | 'zipper' | 'other';
  quantity: number;
  unit: string;
  minStock: number;
  supplier: string;
  cost: number;
  lastUpdated: string;
}