"use client";

import { useState, useEffect, useRef } from "react"
import { User } from "@/types/User";
import MemberCard from "@/components/project/members/MemberCard";
import MemberScoutDetailModal from "@/components/platform/MemberScoutDetailModal";
import { fetcher } from "@/auth/server";
import useSWR from "swr";
import { useAuthStore } from "@/auth/authStore";

export default function ExploreMember() {
  const user = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMounted = useRef(false);
  const { data, error } = useSWR(`/users/exclude/${user?.id}`, fetcher, {
    revalidateOnFocus: false,  // 탭 다시 돌아왔을 때 다시 요청 안 함
    dedupingInterval: 1000 * 60 * 10, // 10분 간 재요청 방지
  });

  const members = data;

  if (error) {
    console.error("Error fetching members:", error);
    alert("멤버 목록을 가져오는 데 실패했습니다.");
  }

  // Listen for header search events
  useEffect(() => {
    const handleHeaderSearch = (event: Event) => {
      const customEvent = event as CustomEvent;
      const searchValue = customEvent.detail || '';
      
      // Only update if value is different
      if (searchValue !== searchQuery) {
        setSearchQuery(searchValue);
      }
    };

    // Add event listener
    window.addEventListener('headerSearch', handleHeaderSearch);
    
    return () => {
      window.removeEventListener('headerSearch', handleHeaderSearch);
    };
  }, [searchQuery]);

  // Set mounted flag
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const filteredMembers = (members ?? []).filter((member: User) => {
    // If no search query, show all members
    if (!searchQuery.trim()) return true;
    
    const lowercaseQuery = searchQuery.toLowerCase();
    
    // Comprehensive search across all relevant fields
    return member.id.toString().includes(lowercaseQuery) ||
      member.name.toLowerCase().includes(lowercaseQuery) ||
      member.tech_stacks.some(skill => skill.tech.toLowerCase().includes(lowercaseQuery)) ||
      member.role.toLowerCase().includes(lowercaseQuery) ||
      (member.email && member.email.toLowerCase().includes(lowercaseQuery)) ||
      (member.phone && member.phone.toLowerCase().includes(lowercaseQuery)) ||
      member.languages.some(lang => lang.toLowerCase().includes(lowercaseQuery));
  });
  
  const handleMemberClick = (member: User) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="mx-auto">
      {filteredMembers.length === 0 && (
        <div className="text-center text-text-secondary p-8 bg-component-background border border-component-border rounded-lg">
          검색 결과가 없습니다.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {filteredMembers.map((member: User) => (
          <MemberCard key={member.id} member={member} onClick={() => handleMemberClick(member)} isLeader={false} isManager={false} isExplore={true} />
        ))}
      </div>

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