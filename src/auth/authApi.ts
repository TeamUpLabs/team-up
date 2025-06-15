import { server } from '@/auth/server';
import { useAuthStore } from '@/auth/authStore';
import { AxiosError } from 'axios';
import { getCurrentKoreanTime } from '@/utils/dateUtils';

export const login = async (email: string, password: string) => {
  try {
    const res = await server.post('/login', {
      userEmail: email,
      password: password,
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
        try {
          const res = await server.put(`/member/${userRes.data.id}`, {
            status: "활성",
            lastLogin: getCurrentKoreanTime()
          });
          if (res.status === 200) {
            useAuthStore.getState().setUser(userRes.data);
            useAuthStore.getState().setAlert("로그인 성공", "success");
            window.location.href = '/platform';
          } else {
            throw new Error('Failed to update user status');
          }
        } catch (error) {
          console.error("Failed to update user status:", error);
          useAuthStore.getState().logout();
          useAuthStore.getState().setAlert("사용자 정보를 가져오는데 실패했습니다.", "error");
        }
      } else {
        throw new Error('User data not found');
      }
    } catch (userError) {
      console.error("Failed to fetch user data:", userError);
      useAuthStore.getState().logout();
      useAuthStore.getState().setAlert("사용자 정보를 가져오는데 실패했습니다.", "error");
    }
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
  useAuthStore.getState().logout();
  try {
    const res = await server.put(`/member/${user.id}`, {
      status: "비활성"
    });
    if (res.status === 200) {
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