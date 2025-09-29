"use client";

import { useState, useEffect, useMemo, Suspense, lazy } from "react";
import useSWR from 'swr';
import { User } from "@/types/user/User";
import MemberScoutDetailModal from "@/components/platform/MemberScoutDetailModal";
import { fetcher } from "@/auth/server";
import { useAuthStore } from "@/auth/authStore";
import useAuthHydration from "@/hooks/useAuthHydration";

// Lazy load MemberCard
const MemberCard = lazy(() => import("@/components/project/members/MemberCard"));

export default function ExploreMember() {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthHydration();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch members using SWR
  const { data: users, error, isLoading } = useSWR<User[]>(
    hydrated && user?.id ? `api/v1/users/exclude/me` : null,
    fetcher
  );

  // Listen for header search events
  useEffect(() => {
    const handleHeaderSearch = (event: Event) => {
      const customEvent = event as CustomEvent;
      const searchValue = customEvent.detail || '';
      
      if (searchValue !== searchQuery) {
        setSearchQuery(searchValue);
      }
    };

    window.addEventListener('headerSearch', handleHeaderSearch);
    
    return () => {
      window.removeEventListener('headerSearch', handleHeaderSearch);
    };
  }, [searchQuery]);

  // Debounce search input (type-safe for string)
  useEffect(() => {
    // Only set debounced query on client after hydration
    if (hydrated) {
      const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
      return () => clearTimeout(handler);
    }
  }, [searchQuery, hydrated]);

  // Memoize filtered users
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!debouncedQuery.trim()) return users;
    const lowercaseQuery = debouncedQuery.toLowerCase();
    return users.filter((user: User) =>
      user.id.toString().includes(lowercaseQuery) ||
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.role.toLowerCase().includes(lowercaseQuery) ||
      (user.email && user.email.toLowerCase().includes(lowercaseQuery)) ||
      (user.phone && user.phone.toLowerCase().includes(lowercaseQuery)) ||
      user.languages.some(lang => lang.toLowerCase().includes(lowercaseQuery))
    );
  }, [users, debouncedQuery]);
  
  const handleMemberClick = (user: User) => {
    setSelectedMember(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Always render the same structure, just conditionally show content
  return (
    <div className="mx-auto">
      {!hydrated || isLoading ? (
        <div className="text-center text-text-secondary p-8">로딩 중...</div>
      ) : error ? (
        <div className="text-center text-red-500 p-8">멤버 목록을 가져오는 데 실패했습니다.</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center text-text-secondary p-8 bg-component-background border border-component-border rounded-lg">
          검색 결과가 없습니다.
        </div>
      ) : (
        <Suspense fallback={<div className="text-center text-text-secondary p-8">로딩 중...</div>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
            {filteredUsers.map((user: User) => (
              <MemberCard key={user.id} member={user} onClick={() => handleMemberClick(user)} isLeader={false} isManager={false} isExplore={true} />
            ))}
          </div>
        </Suspense>
      )}

      {selectedMember && (
        <MemberScoutDetailModal
          member={selectedMember}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}