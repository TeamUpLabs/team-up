'use client';

import Posts from "@/components/community/Posts";
import { useCommunity } from "@/contexts/CommunityContext";
import Loading from "@/components/ui/Loading";

export default function CommunityPage() {
  const { posts, isLoading, error } = useCommunity();
  if (error) {
    console.error('Error loading recent posts:', error);
    return null;
  }
  if (isLoading) {
    return <Loading />;
  }
  if (!posts) {
    return null;
  }
  return (
    <div className="space-y-4">
      {posts?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((post, index) => (
        <Posts key={index} post={post} />
      ))}
    </div>
  );
}