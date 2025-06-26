"use client";

import { useState, useEffect, useRef } from "react"
import { getAllMembers } from "@/hooks/getMemberData";
import { useAuthStore } from "@/auth/authStore";
import { Member } from "@/types/Member";
import MemberCard from "@/components/project/members/MemberCard";
import MemberScoutDetailModal from "@/components/platform/MemberScoutDetailModal";

export default function ExploreMember() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const user = useAuthStore((state) => state.user);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMounted = useRef(false);

  // Fetch members data
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getAllMembers();
        // Filter out the current user from the members list
        const filteredMembers = user ? data.filter((member: Member) => member.id !== user.id) : data;
        setMembers(filteredMembers);
      } catch (error) {
        console.error("Error fetching members:", error);
        alert("멤버 목록을 가져오는 데 실패했습니다.");
      }
    };

    fetchMembers();
  }, [user]);

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

  const filteredMembers = (members ?? []).filter(member => {
    // If no search query, show all members
    if (!searchQuery.trim()) return true;
    
    const lowercaseQuery = searchQuery.toLowerCase();
    
    // Comprehensive search across all relevant fields
    return member.id.toString().includes(lowercaseQuery) ||
      member.name.toLowerCase().includes(lowercaseQuery) ||
      member.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery)) ||
      member.role.toLowerCase().includes(lowercaseQuery) ||
      (member.email && member.email.toLowerCase().includes(lowercaseQuery)) ||
      (member.contactNumber && member.contactNumber.toLowerCase().includes(lowercaseQuery)) ||
      member.languages.some(lang => lang.toLowerCase().includes(lowercaseQuery));
  });

  const handleMemberClick = (member: Member) => {
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
        {filteredMembers.map(member => (
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