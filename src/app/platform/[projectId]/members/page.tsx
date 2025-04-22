"use client";

import { useState, useEffect } from 'react';
import MemberDetailModal from '@/components/project/members/MemberDetailModal';
import MemberCard from '@/components/project/members/MemberCard';
import SearchFilterBar from '@/components/project/members/SearchFilterBar';
import { Member } from '@/types/Member';
import { useProject } from "@/contexts/ProjectContext";

export default function MembersPage() {
  const { project } = useProject();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [allTeamMembers, setAllTeamMembers] = useState<Member[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setAllTeamMembers(project?.members);
  }, [project])

  useEffect(() => {
    const selectedAssiId = localStorage.getItem('selectedAssiId');
    const memberCount = project?.members?.length ?? 0
    
    if (selectedAssiId && memberCount > 0) {
      const memberToOpen = project?.members.find(member => member.id === Number(selectedAssiId));
      
      if (memberToOpen) {
        setSelectedMember(memberToOpen);
      }
    
      localStorage.removeItem('selectedAssiId');
    }
  }, [project]);

  const filteredMembers = (allTeamMembers ?? []).filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.currentTask?.every((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && member.status === '활성') ||
      (statusFilter === 'away' && member.status === '자리비움') ||
      (statusFilter === 'offline' && member.status === '오프라인');

    return matchesSearch && matchesStatus;
  });

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {filteredMembers.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            isLeader={member.id === project?.leader.id}
            onClick={() => handleMemberClick(member)}
          />
        ))}
      </div>

      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          leader_id={project?.leader.id}
        />
      )}
    </div>
  );
}