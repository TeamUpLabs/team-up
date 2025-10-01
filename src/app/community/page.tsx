'use client';

import Posts from "@/components/community/Posts";
import { useCommunity } from "@/contexts/CommunityContext";
import Loading from "@/components/ui/Loading";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CommunityPageContent() {
  const searchParams = useSearchParams();
  const { posts, isLoading, error } = useCommunity();

  // Get search query from URL
  const searchQuery = searchParams?.get('search') || '';

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // If there's no search query, just return tab matches
      if (!searchQuery.trim()) return true;

      // Filter by search query
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        post.content.toLowerCase().includes(searchLower) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        post.creator.name.toLowerCase().includes(searchLower)

      return matchesSearch;
    }) ?? [];
  }, [posts, searchQuery]);

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
      {filteredPosts.length === 0 ? (
        <p className="text-center text-text-secondary">
          {searchQuery ? '검색 결과가 없습니다.' : '게시글이 없습니다.'}
        </p>
      ) : (
        filteredPosts?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((post) => (
          <Posts key={post.id} post={post} />
        ))
      )}
    </div>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CommunityPageContent />
    </Suspense>
  );
}