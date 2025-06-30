"use client";

import { useState, useEffect, useRef } from "react";
import MemberDetailModal from "@/components/project/members/MemberDetailModal";
import MemberCard from "@/components/project/members/MemberCard";
import { Member } from "@/types/Member";
import { useProject } from "@/contexts/ProjectContext";
import TotalMemberCard from "@/components/project/members/TotalMemberCard";
import ActiveMemberCard from "@/components/project/members/ActiveMemberCard";
import DepartmentCard from "@/components/project/members/DepartmentCard";
import AvgTaskCard from "@/components/project/members/AvgTaskCard";
import TabSlider from "@/components/ui/TabSlider";

export default function MembersPage() {
  const { project } = useProject();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [allTeamMembers, setAllTeamMembers] = useState<Member[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMounted = useRef(false);
  const [tab, setTab] = useState("전체");
  
  // Get unique roles from project members
  const uniqueRoles = Array.from(new Set(project?.members?.map(member => member.role) || []));
  
  // Create tabs object with '전체' tab and dynamic role tabs
  const memberTabs = {
    '전체': { 
      label: '전체', 
      count: project?.members?.length || 0 
    },
    ...Object.fromEntries(
      uniqueRoles.map(role => [
        role,
        { 
          label: role, 
          count: project?.members?.filter(member => member.role === role).length || 0 
        }
      ])
    )
  };

  useEffect(() => {
    setAllTeamMembers(project?.members);
  }, [project]);

  useEffect(() => {
    const selectedAssiId = localStorage.getItem("selectedAssiId");
    const memberCount = project?.members?.length ?? 0;

    if (selectedAssiId && memberCount > 0) {
      const memberToOpen = project?.members.find(
        (member) => member.id === Number(selectedAssiId)
      );

      if (memberToOpen) {
        setSelectedMember(memberToOpen);
        setIsModalOpen(true);
      }

      localStorage.removeItem("selectedAssiId");
    }
  }, [project]);

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

  const filteredMembers = (allTeamMembers ?? [])
    .filter((member) => {
      // Filter by tab
      const matchesTab = 
        tab === '전체' || 
        (member.role === tab);
      
      // If there's no search query, just return tab matches
      if (!searchQuery.trim()) return matchesTab;

      // Filter by search query
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        member.name.toLowerCase().includes(searchLower) ||
        member.role.toLowerCase().includes(searchLower) ||
        member.email?.toLowerCase().includes(searchLower) ||
        member.currentTask?.some(task => 
          task.title.toLowerCase().includes(searchLower)
        );

      return matchesTab && matchesSearch;
    })
    .sort((a, b) => {
      // Leader always comes first
      if (a.id === project?.leader.id) return -1;
      if (b.id === project?.leader.id) return 1;
      
      // Finally sort by name
      return a.name.localeCompare(b.name);
    });

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <TotalMemberCard totalMemberCount={project?.members?.length ?? 0} />
        <ActiveMemberCard totalMemberCount={project?.members?.length ?? 0} activeMemberCount={project?.members?.filter(member => member.status === '활성')?.length ?? 0} />
        <DepartmentCard departments={project?.members?.map(member => member.role) ?? []} />
        <AvgTaskCard avgTaskCount={project?.members?.length ? project.members.map(member => member.currentTask?.length ?? 0).reduce((a, b) => a + b, 0) / project.members.length : 0} />
      </div>

      <div className="w-full md:w-1/2 lg:w-1/3">
        <TabSlider 
          tabs={memberTabs} 
          selectedTab={tab} 
          onTabChange={setTab} 
        />
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center text-text-secondary mt-8 p-8 bg-component-background rounded-lg border border-component-border">
          검색 결과가 없습니다.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            isLeader={member.id === project?.leader.id}
            isManager={
              project?.manager.some((manager) => manager.id === member.id) ||
              false
            }
            onClick={() => handleMemberClick(member)}
          />
        ))}
      </div>

      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isLeader={selectedMember.id === project?.leader.id}
          isManager={
            project?.manager.some((manager) => manager.id === selectedMember.id) ||
            false
          }
        />
      )}
    </div>
  );
}
