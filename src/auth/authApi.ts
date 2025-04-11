import { server } from '@/auth/server';
import { useAuthStore } from '@/auth/authStore';

export const login = async (userEmail: string, password: string) => {
  try {
    const res = await server.post('/login', {
      userEmail,
      password,
    }
    );

    if (!res.data.access_token) {
      throw new Error('로그인에 실패했습니다.');
    }

    const data = await res.data;
    if (data.access_token) {
      useAuthStore.getState().setToken(data.access_token);
      alert("로그인 성공");
      window.location.href = '/platform'; // Redirect to home page after successful login
    } else {
      alert("로그인 실패");
    }
  } catch (error) {
    throw error;
  }
}