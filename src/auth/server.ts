import axios from 'axios';

export const server = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  headers: {
    'Content-Type': 'application/json',
  }
});

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

export const fetcher = (url: string, token?: string) => server.get(url, {
  withCredentials: true,
  ...(token ? {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  } : {}),
}).then((res) => res.data);