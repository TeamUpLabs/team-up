"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user/User';
import { TechStack } from '@/types/user/TechStack';
import { useRouter } from 'next/navigation';
import { server } from '@/auth/server';
import { CollaborationPreference } from '@/types/user/CollaborationPreference';
import { useCallback } from 'react';
import { useAuthStore } from '@/auth/authStore';
import { Interest } from '@/types/user/Interest';
import { SocialLink } from '@/types/user/SocialLink';
import { Notification } from '@/types/Notification';
import { Session } from '@/types/user/Session';

export interface IntegratedUser extends User {
  collaboration_preference?: CollaborationPreference;
  tech_stacks?: TechStack[];
  interests?: Interest[];
  social_links?: SocialLink[];
  notifications?: Notification[];
  sessions?: Session[];
}

interface UserContextType {
  user: IntegratedUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setUser: React.Dispatch<React.SetStateAction<IntegratedUser | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IntegratedUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadedData, setLoadedData] = useState<Set<string>>(new Set());
  const router = useRouter();
  const token = useAuthStore.getState().token;

  const fetchRelatedData = useCallback(async <T,>(url: string): Promise<T> => {
    try {
      // Ensure the URL is properly formed
      const fullUrl = url.startsWith('http') 
        ? url 
        : `${process.env.NEXT_PUBLIC_API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
      
      // Extract the path for the server request
      const urlPath = new URL(fullUrl).pathname + new URL(fullUrl).search;
      
      const response = await server.get(urlPath, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });
      
      return response.data;
    } catch (err) {
      console.error(`Error fetching data from ${url}:`, err);
      throw err;
    }
  }, [token]);

  const fetchCollaborationPreference = useCallback(async () => {
    if (!user?.links?.collaboration_preferences?.href || loadedData.has('collaboration_preference')) {
      return;
    }
    try {
      const url = user.links.collaboration_preferences.href;
      const res = await fetchRelatedData<CollaborationPreference>(url);
      setUser(prev => ({ ...prev!, collaboration_preference: res }));
      setLoadedData(prev => new Set(prev).add('collaboration_preference'));
    } catch (error) {
      console.error('Error fetching collaboration preference:', error);
    }
  }, [fetchRelatedData, user?.links?.collaboration_preferences?.href, loadedData]);

  const fetchTechStack = useCallback(async () => {
    if (!user?.links?.tech_stacks?.href || loadedData.has('tech_stacks')) {
      return;
    }
    try {
      const res = await fetchRelatedData<TechStack[]>(user.links.tech_stacks.href);
      setUser(prev => ({ ...prev!, tech_stacks: res }));
      setLoadedData(prev => new Set(prev).add('tech_stacks'));
    } catch (error) {
      console.error('Error fetching tech stack:', error);
    }
  }, [fetchRelatedData, user?.links?.tech_stacks?.href, loadedData]);

  const fetchInterests = useCallback(async () => {
    if (!user?.links?.interests?.href || loadedData.has('interests')) {
      return;
    }
    try {
      const res = await fetchRelatedData<Interest[]>(user.links.interests.href);
      setUser(prev => ({ ...prev!, interests: res }));
      setLoadedData(prev => new Set(prev).add('interests'));
    } catch (error) {
      console.error('Error fetching interests:', error);
    }
  }, [fetchRelatedData, user?.links?.interests?.href, loadedData]);

  const fetchSocialLinks = useCallback(async () => {
    if (!user?.links?.social_links?.href || loadedData.has('social_links')) {
      return;
    }
    try {
      const res = await fetchRelatedData<SocialLink[]>(user.links.social_links.href);
      setUser(prev => ({ ...prev!, social_links: res }));
      setLoadedData(prev => new Set(prev).add('social_links'));
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  }, [fetchRelatedData, user?.links?.social_links?.href, loadedData]);

  const fetchNotifications = useCallback(async () => {
    if (!user?.links?.notifications?.href || loadedData.has('notifications')) {
      return;
    }
    try {
      const res = await fetchRelatedData<Notification[]>(user.links.notifications.href);
      setUser(prev => ({ ...prev!, notifications: res }));
      setLoadedData(prev => new Set(prev).add('notifications'));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [fetchRelatedData, user?.links?.notifications?.href, loadedData]);

  const fetchSessions = useCallback(async () => {
    if (!user?.links?.sessions?.href || loadedData.has('sessions')) {
      return;
    }
    try {
      const res = await fetchRelatedData<Session[]>(user.links.sessions.href);
      setUser(prev => ({ ...prev!, sessions: res }));
      setLoadedData(prev => new Set(prev).add('sessions'));
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  }, [fetchRelatedData, user?.links?.sessions?.href, loadedData]);
  
  // Update user data and related data when user changes
  useEffect(() => {
    if (!user?.links) return;

    // Only try to fetch related data if the links exist
    const { links } = user;
    if (links.collaboration_preferences?.href) fetchCollaborationPreference();
    if (links.tech_stacks?.href) fetchTechStack();
    if (links.interests?.href) fetchInterests();
    if (links.social_links?.href) fetchSocialLinks();
    if (links.notifications?.href) fetchNotifications();
    if (links.sessions?.href) fetchSessions();
  }, [user, fetchCollaborationPreference, fetchTechStack, fetchInterests, fetchSocialLinks, fetchNotifications, fetchSessions]);

  // Initial auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = useAuthStore.getState().token;
        if (token) {
          const res = await server.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
          });
          setUser(res.data);
        } else {
          console.log('No token found, user is not authenticated');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        useAuthStore.getState().logout();
        router.push('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const login = (userData: User) => {
    setUser(userData);
    setLoadedData(new Set()); // Reset loaded data when logging in
    useAuthStore.getState().setToken(userData.auth.provider_access_token);
  };

  const logout = () => {
    setUser(null);
    setLoadedData(new Set()); // Reset loaded data when logging out
    useAuthStore.getState().logout();
    router.push('/signin');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    setUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Helper function to get user initials
export const getUserInitials = (user: User | null): string => {
  if (!user?.name) return '';
  return user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export default UserContext;
