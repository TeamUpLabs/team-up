import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Member } from "@/types/Member";
import { server } from '@/auth/server';

type AlertType = "success" | "error" | "info" | "warning";

type AuthState = {
  token: string | null;
  user: Member | null;
  alert: { message: string; type: AlertType } | null;
  confirm: { message: string; onConfirm?: () => void } | null;
  setToken: (token: string) => void;
  setUser: (user: Member) => void;
  setAlert: (message: string, type: AlertType) => void;
  setConfirm: (message: string, onConfirm?: () => void) => void;
  clearAlert: () => void;
  clearConfirm: () => void;
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
      setToken: (token: string) => set({ token }),
      setUser: (user: Member) => set({ user }),
      setAlert: (message: string, type: AlertType) => set({ alert: { message, type } }),
      setConfirm: (message: string, onConfirm?: () => void) => set({ confirm: { message, onConfirm } }),
      clearAlert: () => set({ alert: null }),
      clearConfirm: () => set({ confirm: null }),
      logout: () => set({ token: null, user: null }),
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
  const store = useAuthStore.getState();
  if (!store.token) return false;

  try {
    const res = await server.get('/me', {
      headers: {
        'Authorization': `Bearer ${store.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (res.status === 200 && res.data.user) {
      store.setUser(res.data.user);
      return true;
    }
    
    throw new Error('Invalid user data');
  } catch (error: unknown) {
    console.error("Auth check failed:", error);
    if ((error as { response?: { status: number } }).response?.status === 401) {
      store.logout();
      store.setAlert('세션이 만료되었습니다. 다시 로그인 해주세요.', 'error');
      window.location.href = '/signin';
    }
    return false;
  }
};