'use client';

import Posts from "@/components/community/Posts";
import useSWR from 'swr';
import useAuthHydration from "@/hooks/useAuthHydration";
import { useAuthStore } from "@/auth/authStore";
import { fetcher } from "@/auth/server";
import { Post } from "@/types/community/Post";

export default function CommunityPage() {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthHydration();
  const { data: posts, error, isLoading } = useSWR<Post[]>(
    hydrated && user?.id ? `/community/posts/all` : null,
    fetcher
  );

  if (!isLoading && !posts) {
    return (
      <div className="mx-auto">
        <div className="text-center text-text-secondary p-8">로딩 중...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="mx-auto">
        <div className="text-center text-text-secondary p-8">로딩 중...</div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {posts?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((post, index) => (
        <Posts key={index} post={post} />
      ))}
    </div>
  );
}