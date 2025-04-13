"use client";

import { useState, useEffect } from 'react';
import MemberDetailModal from '@/components/platform/MemberDetailModal';
import MemberCard from '@/components/project/members/MemberCard';
import SearchFilterBar from '@/components/project/members/SearchFilterBar';
import { TeamMember } from '@/types/Member';
import { useProject } from "@/contexts/ProjectContext";

export default function MembersPage() {
  const { project } = useProject();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [allTeamMembers, setAllTeamMembers] = useState<TeamMember[]>();

  useEffect(() => {
    setAllTeamMembers(project?.members);
  }, [project])

  const filteredMembers = (allTeamMembers ?? []).filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.currentTask.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && member.status === '활성') ||
      (statusFilter === 'away' && member.status === '자리비움') ||
      (statusFilter === 'offline' && member.status === '오프라인');

    return matchesSearch && matchesStatus;
  });

  const handleCardClick = (member: TeamMember, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCardPosition({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    });
    setSelectedMember(member);
  };

  return (
    <div className="py-6 px-2 sm:px-4 md:px-6">
      <SearchFilterBar
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
      />
      {filteredMembers.length === 0 && (
        <div className="text-center text-gray-400 mt-8 p-8 bg-gray-800/50 rounded-lg">
          검색 결과가 없습니다.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {filteredMembers.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onClick={(e) => handleCardClick(member, e)}
          />
        ))}
      </div>

      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          cardPosition={cardPosition}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}