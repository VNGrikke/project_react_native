// Custom hook for authentication
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { authService } from '../services/auth';
import { storage } from '../utils/storage';
import type { RegisterRequest } from '../types';

interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string | null;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const accessToken = await storage.getAccessToken();
      const role = await storage.getUserRole();
      const email = await storage.getUserEmail();

      if (accessToken && role && email) {
        setIsAuthenticated(true);
        setUserRole(role);
        setUserEmail(email);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await authService.login({ email, password });
      
      if (response.success && response.data) {
        const { accessToken, refreshToken, role } = response.data;
        
        await storage.saveTokens(accessToken, refreshToken, role, email);
        
        setIsAuthenticated(true);
        setUserRole(role);
        setUserEmail(email);
        
        // Navigate to main app
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await authService.register(userData);
      
      if (response.success && response.data) {
        const { accessToken, refreshToken, role } = response.data;
        
        await storage.saveTokens(accessToken, refreshToken, role, userData.email);
        
        setIsAuthenticated(true);
        setUserRole(role);
        setUserEmail(userData.email);
        
        // Navigate to main app
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const email = await storage.getUserEmail();
      
      if (email) {
        await authService.logout(email);
      }
      
      await storage.clearTokens();
      setIsAuthenticated(false);
      setUserRole(null);
      setUserEmail(null);
      
      // Navigate to register
      router.replace('/(auth)/register');
    } catch (err: any) {
      console.error('Logout error:', err);
      // Still clear local storage even if API call fails
      await storage.clearTokens();
      setIsAuthenticated(false);
      setUserRole(null);
      setUserEmail(null);
      router.replace('/(auth)/register');
    }
  };

  return {
    isAuthenticated,
    isLoading,
    userRole,
    userEmail,
    login,
    register,
    logout,
    error,
  };
}

