import axios from 'axios';
import { useAuthStore } from './authStore';

export const server = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

server.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  }
);

server.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      const currentPath = window.location.pathname;
      if (currentPath !== '/signin') {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export const fetcher = async (url: string) => {
  const token = useAuthStore.getState().token;

  const res = await server.get(url, {
    withCredentials: true,
    ...(token ? {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    } : {}),
  });
  return res.data;
};
