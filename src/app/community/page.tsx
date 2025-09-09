'use client';

import Posts from "@/components/community/Posts";
import { useCommunity } from "@/contexts/CommunityContext";
import Loading from "@/components/ui/Loading";
import { useState, useEffect, useCallback, useMemo } from "react";

export default function CommunityPage() {
  const { posts, isLoading, error } = useCommunity();
  const [searchQuery, setSearchQuery] = useState("");
  // 디바운스된 검색 함수
  const debouncedSetSearchQuery = useCallback((value: string) => {
    const timeoutId = setTimeout(() => setSearchQuery(value), 300);
    return () => clearTimeout(timeoutId);
  }, []);

  // Listen for header search events
  useEffect(() => {
    const handleHeaderSearch = (event: Event) => {
      const customEvent = event as CustomEvent;
      const searchValue = customEvent.detail || '';

      // 디바운스된 검색 적용
      debouncedSetSearchQuery(searchValue);
    };

    window.addEventListener('headerSearch', handleHeaderSearch);

    return () => {
      window.removeEventListener('headerSearch', handleHeaderSearch);
    };
  }, [debouncedSetSearchQuery]);


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
          게시글이 없습니다.
        </p>
      ) : (
        filteredPosts?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((post) => (
          <Posts key={post.id} post={post} />
        ))
      )}
    </div>
  );
}