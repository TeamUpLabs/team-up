import { server } from '@/auth/server';
import { useAuthStore } from '@/auth/authStore';
import { AxiosError } from 'axios';

export const login = async (email: string, password: string) => {
  try {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const res = await server.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    const data = res.data;
    if (!data || !data.access_token) {
      throw new Error('Invalid response from server');
    }

    const token = data.access_token;
    useAuthStore.getState().setToken(token);
    useAuthStore.getState().setUser(data.user_info);
    useAuthStore.getState().setAlert("로그인 성공", "success");
    window.location.href = '/';
  } catch (error: unknown) {
    console.error("Login error:", error);
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        useAuthStore.getState().setAlert("이메일 또는 비밀번호가 올바르지 않습니다.", "error");
      } else {
        useAuthStore.getState().setAlert("로그인에 실패했습니다.", "error");
      }
      throw error;
    }
  }
};

export const logout = async () => {
  const user = useAuthStore.getState().user;
  if (!user) {
    throw new Error('User not found');
  }
  try {
    const token = useAuthStore.getState().token;
    if (!token) {
      throw new Error('Token not found');
    }
    const res = await server.post(`/auth/${user.id}/logout`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (res.status === 200) {
      useAuthStore.getState().logout();
      useAuthStore.getState().setAlert("로그아웃 되었습니다.", "info");
      window.location.href = '/';
    } else {
      throw new Error('Logout failed');
    }
  } catch (error) {
    console.error("Logout error:", error);
    useAuthStore.getState().setAlert("로그아웃에 실패했습니다.", "error");
  }
};