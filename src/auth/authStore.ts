import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types/user/User";
import { Notification } from "@/types/Notification";
import { server } from '@/auth/server';
import { logout } from "@/auth/authApi";
import CryptoJS from 'crypto-js';

// 암호화 키 (실제 프로덕션에서는 환경변수 등으로 관리해야 합니다)
const ENCRYPTION_KEY = 'teamup-secure-key-2024';

// 데이터 암호화 함수
const encryptData = (data: User | null): string => {
  if (!data) return '';
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

// 데이터 복호화 함수
const decryptData = (ciphertext: string): User | null => {
  if (!ciphertext) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error('복호화 중 오류 발생:', error);
    return null;
  }
};


type AlertType = "success" | "error" | "info" | "warning";
type NotificationAlertType = "info" | "message" | "task" | "milestone" | "chat" | "scout";

type AuthState = {
  token: string | null;
  user: User | null;
  alert: { message: string; type: AlertType } | null;
  confirm: { message: string; onConfirm?: () => void } | null;
  notificationAlert: { message: Notification; type: NotificationAlertType } | null;
  isInitialized: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
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
      isInitialized: false,
      alert: null,
      confirm: null,
      notificationAlert: null,
      setToken: (token: string) => set({ token }),
      setUser: (user: User) => set({ user }),
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
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => {
          const item = sessionStorage.getItem(name);
          if (!item) return null;
          try {
            const parsed = JSON.parse(item);
            if (parsed.state?.user) {
              parsed.state.user = decryptData(parsed.state.user);
            }
            return JSON.stringify(parsed);
          } catch (error) {
            console.error('Failed to parse storage item:', error);
            return null;
          }
        },
        setItem: async (name: string, value: string) => {
          try {
            const parsed = JSON.parse(value);
            if (parsed.state?.user) {
              parsed.state.user = encryptData(parsed.state.user);
            }
            sessionStorage.setItem(name, JSON.stringify(parsed));
          } catch (error) {
            console.error('Failed to save to storage:', error);
          }
        },
        removeItem: (name: string) => sessionStorage.removeItem(name),
      })),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = true;
        }
      },
    }
  )
);

export const checkAndRefreshAuth = async () => {
  const user = useAuthStore.getState().user;

  if (!user) return false;

  try {
    const res = await server.get(user.links.self.href);

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
      await logout();
      useAuthStore.getState().logout();
      useAuthStore.getState().setAlert('세션이 만료되었습니다. 다시 로그인 해주세요.', 'error');
      window.location.href = '/signin';
    }
    return false;
  }
};

export const fetchUserDetail = async (url: string) => {
  const res = await server.get(url);
  return res.data;
};