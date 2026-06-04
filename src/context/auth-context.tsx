'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'dancer' | 'artist';

interface User {
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load mock session from local storage for persistence during demo
  useEffect(() => {
    const savedUser = localStorage.getItem('dance-realm-mock-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (role: UserRole) => {
    const mockUser = {
      name: role === 'dancer' ? 'Demo Dancer' : 'Demo Artist',
      role: role
    };
    setUser(mockUser);
    localStorage.setItem('dance-realm-mock-user', JSON.stringify(mockUser));
    
    if (role === 'dancer') {
      router.push('/dashboard');
    } else {
      router.push('/studio');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dance-realm-mock-user');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a MockAuthProvider');
  }
  return context;
}
