"use client";

import { useState, useEffect } from "react"
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

  const filteredMembers = (members ?? []).filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row gap-4 md:items-center md:space-x-3">
        <div className="relative flex-1">
          <input
            type="search"
            placeholder="팀원 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-300 placeholder-gray-400 hover:border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center text-gray-400 mt-8 p-8 bg-gray-800/50 rounded-lg">
          검색 결과가 없습니다.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {filteredMembers.map(member => (
          <MemberCard key={member.id} member={member} onClick={() => handleMemberClick(member)} isLeader={false} />
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