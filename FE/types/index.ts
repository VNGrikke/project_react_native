// Type definitions for the application

// API Response types matching BE structure
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// Auth types
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

// User types
export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  role?: string;
}

// Add more types as needed for other modules
// Product types, Cart types, etc.

