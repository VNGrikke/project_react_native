import axios from 'axios';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ApiResponse } from '../types';

export const API_BASE_URL = 'http://192.168.51.106:8080';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - tự động thêm token vào headers
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('ACCESS_TOKEN');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let queue: ((token: string | null) => void)[] = [];

const refreshToken = async () => {
  const token = await AsyncStorage.getItem('REFRESH_TOKEN');
  if (!token) throw new Error('No refresh token');
  
  const res = await axios.post(`${API_BASE_URL}/auth/v1/refresh`, null, {
    params: { token },
  });
  
  const { accessToken, refreshToken: newRefreshToken } = res.data.data;
  
  await AsyncStorage.multiSet([
    ['ACCESS_TOKEN', accessToken],
    ['REFRESH_TOKEN', newRefreshToken],
  ]);
  
  axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
  return accessToken;
};

// Response interceptor - tự động refresh token khi access token hết hạn
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    
    // Nếu không phải lỗi 401 hoặc đã retry rồi thì reject
    if (err.response?.status !== 401 || original._retry) {
      return Promise.reject(err);
    }
    
    original._retry = true;

    // Nếu đang refresh token thì đợi
    if (isRefreshing) {
      return new Promise((resolve) =>
        queue.push((token) => {
          if (token) {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(original));
          } else {
            resolve(Promise.reject(err));
          }
        })
      );
    }

    isRefreshing = true;
    try {
      const newToken = await refreshToken();
      queue.forEach((cb) => cb(newToken));
      queue = [];
      original.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(original);
    } catch (e) {
      queue.forEach((cb) => cb(null));
      queue = [];
      await AsyncStorage.multiRemove([
        'ACCESS_TOKEN',
        'REFRESH_TOKEN',
        'USER_ROLE',
        'USER_EMAIL',
      ]);
      router.replace('/(auth)/register');
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);

// Generic API request function
export async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: any;
    params?: any;
  } = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await axiosInstance({
      url: endpoint,
      method: options.method || 'GET',
      data: options.data,
      params: options.params,
    });

    return response.data;
  } catch (error: any) {
    console.error('API request error:', error);
    
    // Nếu là lỗi từ axios response thì throw với message từ server
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw error;
  }
}

export default axiosInstance;
