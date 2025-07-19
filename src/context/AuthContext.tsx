import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (registrationData: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@tailoring.com',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setAuthState({
        user: JSON.parse(savedUser),
        isAuthenticated: true,
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    const user = mockUsers.find(u => u.email === email);
    
    if (user && password === 'password123') {
      setAuthState({
        user,
        isAuthenticated: true,
      });
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('currentUser');
  };

  const register = async (registrationData: any): Promise<boolean> => {
    // In a real app, this would call an API to submit registration
    // For demo, we'll save to localStorage and return success
    const existingRegistrations = JSON.parse(localStorage.getItem('registrationRequests') || '[]');
    const newRegistration = {
      id: Date.now().toString(),
      ...registrationData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    existingRegistrations.push(newRegistration);
    localStorage.setItem('registrationRequests', JSON.stringify(existingRegistrations));
    return true;
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};