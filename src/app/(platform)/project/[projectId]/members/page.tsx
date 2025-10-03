"use client";

import { useState, useEffect, useRef, Suspense, lazy, useMemo, useCallback } from "react";
import { ProjectMember } from "@/types/Project";
import { useProject } from "@/contexts/ProjectContext";
import TabSlider from "@/components/ui/TabSlider";
import { convertJobName } from "@/utils/ConvertJobName";

// 지연 로딩을 위한 컴포넌트들
const MemberDetailModal = lazy(() => import("@/components/project/members/MemberDetailModal"));
const MemberCard = lazy(() => import("@/components/project/members/MemberCard"));
const TotalMemberCard = lazy(() => import("@/components/project/members/TotalMemberCard"));
const ActiveMemberCard = lazy(() => import("@/components/project/members/ActiveMemberCard"));
const DepartmentCard = lazy(() => import("@/components/project/members/DepartmentCard"));
const AvgTaskCard = lazy(() => import("@/components/project/members/AvgTaskCard"));

// 로딩 컴포넌트
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
  </div>
);

// 스켈레톤 카드 컴포넌트
const SkeletonCard = () => (
  <div className="bg-component-tertiary-background animate-pulse rounded-lg h-32"></div>
);

export default function MembersPage() {
  const { project, additional_data } = useProject();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<ProjectMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMounted = useRef(false);
  const [tab, setTab] = useState("전체");
  
  // 메모이제이션을 통한 탭 데이터 최적화
  const memberTabs = useMemo(() => {
    const uniqueJobs = Array.from(new Set(project?.members?.map(member => member.user.job) || []));
    
    return {
      '전체': { 
        label: '전체', 
        count: project?.members?.length || 0 
      },
      ...Object.fromEntries(
        uniqueJobs.map(job => [
          job,
          { 
            label: convertJobName(job), 
            count: project?.members?.filter(member => member.user.job === job).length || 0 
          }
        ])
      )
    };
  }, [project?.members]);

  // 디바운스된 검색 함수
  const debouncedSetSearchQuery = useCallback((value: string) => {
    const timeoutId = setTimeout(() => setSearchQuery(value), 300);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const selectedAssiId = localStorage.getItem("selectedAssiId");
    const memberCount = project?.members?.length ?? 0;

    if (selectedAssiId && memberCount > 0) {
      const memberToOpen = project?.members.find(
        (member) => member.user.id === Number(selectedAssiId)
      );

      if (memberToOpen) {
        setSelectedMember(memberToOpen);
        setIsModalOpen(true);
      }

      localStorage.removeItem("selectedAssiId");
    }
  }, [project]);

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

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // 메모이제이션을 통한 필터링 최적화
  const filteredMembers = useMemo(() => {
    return (project?.members ?? [])
      .filter((member) => {
        const matchesTab = 
          tab === '전체' || 
          (member.user.job === tab);
        if (!searchQuery.trim()) return matchesTab;

        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          member.user.name.toLowerCase().includes(searchLower) ||
          member.user.job.toLowerCase().includes(searchLower) ||
          member.user.email?.toLowerCase().includes(searchLower) ||
          additional_data?.tasks?.some(task => 
            task.title.toLowerCase().includes(searchLower)
          );

        return matchesTab && matchesSearch;
      })
      .sort((a, b) => {
        if (a.user.id === project?.owner.id) return -1;
        if (b.user.id === project?.owner.id) return 1;
        return a.user.name.localeCompare(b.user.name);
      });
  }, [project?.members, tab, searchQuery, project?.owner?.id, additional_data?.tasks]);

  // 메모이제이션을 통한 통계 계산 최적화
  const memberStats = useMemo(() => {
    const totalMemberCount = project?.members?.length ?? 0;
    const activeMemberCount = project?.members?.filter(member => member.user.status === 'active')?.length ?? 0;
    const departments = project?.members?.map(member => member.user.job) ?? [];
    const avgTaskCount = project?.members?.length 
      ? additional_data?.tasks?.length / project.members.length 
      : 0;
    
    return {
      totalMemberCount,
      activeMemberCount,
      departments,
      avgTaskCount
    };
  }, [project?.members, additional_data?.tasks]);

  const handleMemberClick = (member: ProjectMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Suspense fallback={<SkeletonCard />}>
          <TotalMemberCard totalMemberCount={memberStats.totalMemberCount} />
        </Suspense>
        <Suspense fallback={<SkeletonCard />}>
          <ActiveMemberCard 
            totalMemberCount={memberStats.totalMemberCount} 
            activeMemberCount={memberStats.activeMemberCount} 
          />
        </Suspense>
        <Suspense fallback={<SkeletonCard />}>
          <DepartmentCard departments={memberStats.departments} />
        </Suspense>
        <Suspense fallback={<SkeletonCard />}>
          <AvgTaskCard avgTaskCount={memberStats.avgTaskCount} />
        </Suspense>
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
          <Suspense key={member.user.id} fallback={<SkeletonCard />}>
            <MemberCard
              member={member.user}
              isLeader={member.role === "leader" || project?.owner.id === member.user.id}
              isManager={
                project?.members.some((manager) => manager.role === "manager") || project?.owner.id === member.user.id
              }
              onClick={() => handleMemberClick(member)}
            />
          </Suspense>
        ))}
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        {selectedMember && (
          <MemberDetailModal
            member={selectedMember.user}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            isLeader={project?.members.some((member) => member.role === "leader") || project?.owner.id === selectedMember.user.id}
            isManager={
              project?.members.some((manager) => manager.role === "manager") || project?.owner.id === selectedMember.user.id
            }
          />
        )}
      </Suspense>
    </div>
  );
}
