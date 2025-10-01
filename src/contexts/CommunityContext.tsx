import { createContext, useContext, ReactNode } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/auth/server';
import { Topic } from '@/types/community/HotTopic';
import { Post } from '@/types/community/Post';
import { RecommendedFollow } from '@/types/community/RecommendedFollow';
import useAuthHydration from "@/hooks/useAuthHydration";
import { useAuthStore } from "@/auth/authStore";

interface CommunityContextType {
  hot_topic: Topic[];
  recommended_follow: RecommendedFollow[];
  posts: Post[];
  isLoading: boolean;
  error: Error | null;
}

interface CommunityData {
  hot_topic: Topic[];
  recommended_follow: RecommendedFollow[];
  posts: Post[];
}

const CommunityContext = createContext<CommunityContextType>({
  hot_topic: [],
  recommended_follow: [],
  posts: [],
  isLoading: true,
  error: null,
});

export const CommunityProvider = ({ children }: { children: ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthHydration();
  const { data, error, isLoading } = useSWR<CommunityData>(
    hydrated && user?.id ? '/api/v1/community' : null, (url: string) => fetcher(url));

  return (
    <CommunityContext.Provider
      value={{
        hot_topic: data?.hot_topic || [],
        recommended_follow: data?.recommended_follow || [],
        posts: data?.posts || [],
        isLoading,
        error: error || null,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = (): CommunityContextType => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};
