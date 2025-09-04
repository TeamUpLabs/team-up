"use client";

import { useProject } from '@/contexts/ProjectContext';
import { Suspense, lazy, useMemo } from 'react';
import { Project, blankProject } from '@/types/Project';

// 지연 로딩을 위한 컴포넌트들
const ActiveMilestoneCard = lazy(() => import("@/components/project/dashboard/ActiveMilestoneCard"));
const ActiveTaskCard = lazy(() => import("@/components/project/dashboard/ActiveTaskCard"));
const TeamCard = lazy(() => import("@/components/project/dashboard/TeamCard"));
const CompletionRateCard = lazy(() => import("@/components/project/dashboard/CompletionRateCard"));
const RecentActivity = lazy(() => import("@/components/project/dashboard/RecentActivity"));
const TeamPerformance = lazy(() => import("@/components/project/dashboard/TeamPerformance"));
const WeeklyChart = lazy(() => import("@/components/project/dashboard/WeeklyChart"));
const QuickAction = lazy(() => import("@/components/project/dashboard/QuickAction"));
const UpcommingDeadline = lazy(() => import("@/components/project/dashboard/UpcommingDeadline"));

// 스켈레톤 카드 컴포넌트
const SkeletonCard = () => (
  <div className="bg-component-tertiary-background animate-pulse rounded-lg h-32"></div>
);

export default function ProjectPage() {
  const { project, isLoading } = useProject();
  
  // 메모이제이션을 통한 계산 최적화
  const projectStats = useMemo(() => {
    if (!project) return null;
    
    const activeMilestoneCount = project.milestones?.filter(milestone => milestone.status !== "completed").length || 0;
    const activeTaskCount = project.tasks?.filter(task => task.status !== "completed").length || 0;
    const totalMemberCount = project.members?.length || 0;
    const activeMemberCount = project.members?.filter(member => member.user.status === "active").length || 0;
    
    return {
      activeMilestoneCount,
      activeTaskCount,
      totalMemberCount,
      activeMemberCount,
    };
  }, [project]);

  // Provide default empty values when project is loading
  const projectData = project || blankProject;

  if (isLoading) {
    return (
      <div className="p-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Suspense fallback={<SkeletonCard />}>
          <ActiveMilestoneCard 
            activeMilestoneCount={projectStats?.activeMilestoneCount || 0}
          />
        </Suspense>
        <Suspense fallback={<SkeletonCard />}>
          <ActiveTaskCard 
            activeTaskCount={projectStats?.activeTaskCount || 0}
          />
        </Suspense>
        <Suspense fallback={<SkeletonCard />}>
          <TeamCard 
            TotalMemberCount={projectStats?.totalMemberCount || 0} 
            ActiveMemberCount={projectStats?.activeMemberCount || 0}
          />
        </Suspense>
        <Suspense fallback={<SkeletonCard />}>
          <CompletionRateCard 
            project={project as Project || projectData} 
          />
        </Suspense>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Suspense fallback={<SkeletonCard />}>
          <TeamPerformance 
            project={project as Project || projectData} 
            className="md:col-span-2" 
            isLoading={isLoading}
          />
        </Suspense>
        <Suspense fallback={<SkeletonCard />}>
          <WeeklyChart 
            tasks={project?.tasks || []} 
            milestones={project?.milestones || []} 
            schedules={project?.schedules || []}
            whiteboards={project?.whiteboards || []}
          />
        </Suspense>
        <Suspense fallback={<SkeletonCard />}>
          <QuickAction />
        </Suspense>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <Suspense fallback={<SkeletonCard />}>
          <RecentActivity 
            project={project as Project || projectData} 
            isLoading={isLoading}
          />
        </Suspense>
        <Suspense fallback={<SkeletonCard />}>
          <UpcommingDeadline 
            project={project as Project || projectData} 
            isLoading={isLoading}
          />
        </Suspense>
      </div>
    </div>
  );
}