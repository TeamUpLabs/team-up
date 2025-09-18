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

interface UserContextType {
  user: User | null;
  collaboration_preference: CollaborationPreference | null;
  tech_stacks: TechStack[] | null;
  interests: Interest[] | null;
  social_links: SocialLink[] | null;
  notifications: Notification[] | null;
  sessions: Session[] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [collaboration_preference, setCollaborationPreference] = useState<CollaborationPreference | null>(null);
  const [tech_stacks, setTechStacks] = useState<TechStack[] | null>(null);
  const [interests, setInterests] = useState<Interest[] | null>(null);
  const [social_links, setSocialLinks] = useState<SocialLink[] | null>(null);
  const [notifications, setNotifications] = useState<Notification[] | null>(null);
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    if (!user?.links?.collaboration_preferences?.href) {
      console.log('No collaboration preferences link available');
      return;
    }
    try {
      const url = user.links.collaboration_preferences.href;
      const res = await fetchRelatedData<CollaborationPreference>(url);
      setCollaborationPreference(res);
    } catch (error) {
      console.error('Error fetching collaboration preference:', error);
    }
  }, [fetchRelatedData, user]);

  const fetchTechStack = useCallback(async () => {
    if (!user?.links?.tech_stacks?.href) {
      console.log('No tech stacks link available');
      return;
    }
    try {
      const res = await fetchRelatedData<TechStack[]>(user.links.tech_stacks.href);
      setTechStacks(res);
    } catch (error) {
      console.error('Error fetching tech stack:', error);
    }
  }, [fetchRelatedData, user]);

  const fetchInterests = useCallback(async () => {
    if (!user?.links?.interests?.href) {
      console.log('No interests link available');
      return;
    }
    try {
      const res = await fetchRelatedData<Interest[]>(user.links.interests.href);
      setInterests(res);
    } catch (error) {
      console.error('Error fetching interests:', error);
    }
  }, [fetchRelatedData, user]);

  const fetchSocialLinks = useCallback(async () => {
    if (!user?.links?.social_links?.href) {
      console.log('No social links available');
      return;
    }
    try {
      const res = await fetchRelatedData<SocialLink[]>(user.links.social_links.href);
      setSocialLinks(res);
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  }, [fetchRelatedData, user]);

  const fetchNotifications = useCallback(async () => {
    if (!user?.links?.notifications?.href) {
      console.log('No notifications link available');
      return;
    }
    try {
      const res = await fetchRelatedData<Notification[]>(user.links.notifications.href);
      setNotifications(res);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [fetchRelatedData, user]);

  const fetchSessions = useCallback(async () => {
    if (!user?.links?.sessions?.href) {
      console.log('No sessions link available');
      return;
    }
    try {
      const res = await fetchRelatedData<Session[]>(user.links.sessions.href);
      setSessions(res);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  }, [fetchRelatedData, user]);
  
  // Update user data and related data when user changes
  useEffect(() => {
    if (!user) return;
    
    // Only try to fetch related data if the links exist
    if (user.links) {
      if (user.links.collaboration_preferences?.href) fetchCollaborationPreference();
      if (user.links.tech_stacks?.href) fetchTechStack();
      if (user.links.interests?.href) fetchInterests();
      if (user.links.social_links?.href) fetchSocialLinks();
      if (user.links.notifications?.href) fetchNotifications();
      if (user.links.sessions?.href) fetchSessions();
    }
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
    useAuthStore.getState().setToken(userData.auth.provider_access_token);
  };

  const logout = () => {
    setUser(null);
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
    collaboration_preference,
    tech_stacks,
    interests,
    social_links,
    notifications,
    sessions,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
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
