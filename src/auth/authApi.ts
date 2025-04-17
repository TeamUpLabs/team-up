import { server } from '@/auth/server';
import { useAuthStore } from '@/auth/authStore';
import { AxiosError } from 'axios';

export const login = async (userEmail: string, password: string) => {
  try {
    const res = await server.post('/login', {
      userEmail,  // Changed from userEmail to email to match server expectation
      password,
    });

    const data = res.data;
    if (!data || !data.access_token) {
      throw new Error('Invalid response from server');
    }

    const token = data.access_token;
    useAuthStore.getState().setToken(token);

    try {
      const userRes = await server.get('/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (userRes.data) {
        useAuthStore.getState().setUser(userRes.data);
        alert("로그인 성공");
        window.location.href = '/platform';
      } else {
        throw new Error('User data not found');
      }
    } catch (userError) {
      console.error("Failed to fetch user data:", userError);
      useAuthStore.getState().logout();
      alert("사용자 정보를 가져오는데 실패했습니다.");
  } 
} catch (error: unknown) {
    console.error("Login error:", error);
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        alert("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        alert("로그인에 실패했습니다.");
      }
      throw error;
    }
  }
};