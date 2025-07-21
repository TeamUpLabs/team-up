import { server } from '@/auth/server';
import { useAuthStore } from '@/auth/authStore';
import { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const getOrCreateDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

export const getDeviceIdentifier = () => {
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  const language = navigator.language;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return btoa(`${ua}::${platform}::${language}::${timezone}`);
};

export const login = async (email: string, password: string) => {
  try {
    const deviceId = getOrCreateDeviceId();
    const sessionId = getDeviceIdentifier();
    
    const res = await server.post('/auth/login', {
      email,
      password,
      device_id: deviceId,
      session_id: sessionId,
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
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
      session_id: getDeviceIdentifier(),
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true,
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