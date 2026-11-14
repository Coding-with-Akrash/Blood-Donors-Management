import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api, authService } from '../services/api';
import type { User, UserRole } from '../types';
import { STORAGE_KEYS } from '../constants';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  city: string;
  bloodGroup?: string;
  rhFactor?: 'Positive' | 'Negative';
  hospital?: string;
  address?: string;
  emergencyContact?: string;
  weight?: number;
  height?: number;
  lastDonationDate?: string;
  medicalScreening?: {
    notFeelingHealthy: boolean;
    recentSurgery: boolean;
    medication: boolean;
    medicalCondition: boolean;
    infectionsFever: boolean;
    recentVaccination: boolean;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData));
    } catch (error) {
      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.user);
    const token = localStorage.getItem(STORAGE_KEYS.authToken);

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.user);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    const response = await authService.login(email, password, rememberMe);
    
    api.setAuthToken(response.accessToken);
    api.setRefreshToken(response.refreshToken);
    
    setUser(response.user);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(response.user));
    
    if (rememberMe) {
      localStorage.setItem('lifeblood_remember', 'true');
    }
  };

  const register = async (data: RegisterData) => {
    const response = await authService.register(data);
    
    api.setAuthToken(response.accessToken);
    api.setRefreshToken(response.refreshToken);
    
    setUser(response.user);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(response.user));
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors
    } finally {
      api.setAuthToken('');
      api.setRefreshToken('');
      localStorage.removeItem(STORAGE_KEYS.authToken);
      localStorage.removeItem(STORAGE_KEYS.refreshToken);
      localStorage.removeItem(STORAGE_KEYS.user);
      localStorage.removeItem('lifeblood_remember');
      setUser(null);
    }
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}