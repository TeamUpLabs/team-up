import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TeamMember } from "@/types/Member";
import { server } from '@/auth/server';

type AuthState = {
  token: string | null;
  user: TeamMember | null;
  setToken: (token: string) => void;
  setUser: (user: TeamMember) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setToken: (token: string) => set({ token }),
      setUser: (user: TeamMember) => set({ user }),
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
      window.location.href = '/signin';
    }
    return false;
  }
};