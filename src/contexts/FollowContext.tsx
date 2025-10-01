"use client";

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import useSWR from 'swr';
import { useAuthStore, fetchUserDetail } from '@/auth/authStore';

interface FollowContextType {
  followingUsers: Set<number>;
  followUser: (userId: number) => Promise<void>;
  unfollowUser: (userId: number) => Promise<void>;
  isFollowing: (userId: number) => boolean;
}

interface UserFollowingMinimal {
  following?: {
    count: number;
    users: Array<{ id: number }>;
  };
}

const FollowContext = createContext<FollowContextType | undefined>(undefined);

interface FollowProviderProps {
  children: ReactNode;
}

export function FollowProvider({ children }: FollowProviderProps) {
  const user = useAuthStore.getState().user;

  const { data, mutate } = useSWR<UserFollowingMinimal | null>(user ? `/api/v1/users/${user.id}` : null, fetchUserDetail, {
    revalidateOnFocus: true,
  });

  const followingUsers = useMemo(() => {
    const users = data?.following?.users || [];
    const ids = Array.isArray(users) ? users.map((u: { id: number }) => u.id) : [];
    return new Set<number>(ids);
  }, [data]);

  const followUser = async (targetUserId: number) => {
    const { followUser: followUserAPI } = await import('@/hooks/follow');

    // 낙관적 업데이트
    await mutate(async (current: UserFollowingMinimal | null | undefined) => {
      const optimistic: UserFollowingMinimal = {
        ...current,
        following: {
          count: (current?.following?.count || 0) + 1,
          users: [...(current?.following?.users || []), { id: targetUserId }],
        },
      };
      try {
        await followUserAPI(user?.id || 0, targetUserId);
        return optimistic; // 서버 재검증 전까지 유지
      } catch (error) {
        useAuthStore.getState().setAlert("팔로우 추가에 실패했습니다.", "error");
        throw error;
      }
    }, { revalidate: true, rollbackOnError: true, populateCache: true });

    useAuthStore.getState().setAlert("팔로우를 추가했습니다.", "success");
  };

  const unfollowUser = async (targetUserId: number) => {
    const { unfollowUser: unfollowUserAPI } = await import('@/hooks/follow');

    // 낙관적 업데이트
    await mutate(async (current: UserFollowingMinimal | null | undefined) => {
      const nextFollowing = {
        count: (current?.following?.count || 0) - 1,
        users: (current?.following?.users || []).filter((u) => u.id !== targetUserId),
      };
      const optimistic: UserFollowingMinimal = { ...(current ?? {}), following: nextFollowing };
      try {
        await unfollowUserAPI(user?.id || 0, targetUserId);
        return optimistic;
      } catch (error) {
        useAuthStore.getState().setAlert("팔로우 취소에 실패했습니다.", "error");
        throw error;
      }
    }, { revalidate: true, rollbackOnError: true, populateCache: true });

    useAuthStore.getState().setAlert("팔로우를 취소했습니다.", "success");
  };

  const isFollowing = (userId: number): boolean => followingUsers.has(userId);

  const value: FollowContextType = {
    followingUsers,
    followUser,
    unfollowUser,
    isFollowing,
  };

  return (
    <FollowContext.Provider value={value}>
      {children}
    </FollowContext.Provider>
  );
}

export function useFollow() {
  const context = useContext(FollowContext);
  if (context === undefined) {
    throw new Error('useFollow must be used within a FollowProvider');
  }
  return context;
}
