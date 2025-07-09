import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthUser } from "@/types/AuthUser";
import { Notification } from "@/types/Notification";
import { server } from '@/auth/server';

type AlertType = "success" | "error" | "info" | "warning";
type NotificationAlertType = "info" | "message" | "task" | "milestone" | "chat" | "scout";

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  alert: { message: string; type: AlertType } | null;
  confirm: { message: string; onConfirm?: () => void } | null;
  notificationAlert: { message: Notification; type: NotificationAlertType } | null;
  setToken: (token: string) => void;
  setUser: (user: AuthUser) => void;
  setAlert: (message: string, type: AlertType) => void;
  setConfirm: (message: string, onConfirm?: () => void) => void;
  setNotificationAlert: (message: Notification, type: NotificationAlertType) => void;
  clearAlert: () => void;
  clearConfirm: () => void;
  clearNotificationAlert: () => void;
  logout: () => void;
  isAuthenticated: () => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      alert: null,
      confirm: null,
      notificationAlert: null,
      setToken: (token: string) => set({ token }),
      setUser: (user: AuthUser) => set({ user }),
      setAlert: (message: string, type: AlertType) => set({ alert: { message, type } }),
      setConfirm: (message: string, onConfirm?: () => void) => set({ confirm: { message, onConfirm } }),
      setNotificationAlert: (message: Notification, type: NotificationAlertType) => set({ notificationAlert: { message, type } }),
      clearAlert: () => set({ alert: null }),
      clearConfirm: () => set({ confirm: null }),
      clearNotificationAlert: () => set({ notificationAlert: null }),
      logout: () => set({ token: null, user: null, alert: null, confirm: null, notificationAlert: null }),
      isAuthenticated: () => {
        const state = get();
        return !!state.token;
      },
    }),
    {
      name: "teamup-auth",
    }
  )
);

export const checkAndRefreshAuth = async () => {
  const token = useAuthStore.getState().token;
  if (!token) return false;

  try {
    const res = await server.get('/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.status === 200) {
      if (res.data) {
        useAuthStore.getState().setUser(res.data);
        return true;
      }
    }
    
    throw new Error('Invalid user data');
  } catch (error: unknown) {
    console.error("Auth check failed:", error);
    if ((error as { response?: { status: number } }).response?.status === 401) {
      useAuthStore.getState().logout();
      useAuthStore.getState().setAlert('세션이 만료되었습니다. 다시 로그인 해주세요.', 'error');
      window.location.href = '/signin';
    }
    return false;
  }
};