// Auth API service
import { apiRequest } from './api';
import type { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiRequest<AuthResponse>('/auth/v1/login', {
      method: 'POST',
      data: credentials,
    });
  },

  register: async (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiRequest<AuthResponse>('/auth/v1/register', {
      method: 'POST',
      data: userData,
    });
  },

  refresh: async (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
    return apiRequest<AuthResponse>('/auth/v1/refresh', {
      method: 'POST',
      params: { token: refreshToken },
    });
  },

  logout: async (tokenOrEmail: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>('/auth/v1/logout', {
      method: 'POST',
      params: { tokenOrEmail },
    });
  },
};

