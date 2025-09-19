"use client";

import { useProject } from '@/contexts/ProjectContext';
import { Suspense, lazy, useMemo } from 'react';
import { blankProject } from '@/types/Project';

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
  const { project, additional_data, isLoading } = useProject();
  // 메모이제이션을 통한 계산 최적화
  const projectStats = useMemo(() => {
    if (!project) return null;
    
    const activeMilestoneCount = additional_data.milestones?.filter(milestone => milestone.status !== "completed").length || 0;
    const activeTaskCount = additional_data.tasks?.filter(task => task.status !== "completed").length || 0;
    const totalMemberCount = project.members?.length || 0;
    const activeMemberCount = project.members?.filter(member => member.user.status === "active").length || 0;
    
    return {
      activeMilestoneCount,
      activeTaskCount,
      totalMemberCount,
      activeMemberCount,
    };
  }, [project, additional_data]);

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
            tasks={additional_data.tasks || []} 
          />
        </Suspense>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Suspense fallback={<SkeletonCard />}>
          <TeamPerformance 
            project={projectData}
            tasks={additional_data.tasks || []}
            className="md:col-span-2" 
            isLoading={isLoading}
          />
        </Suspense>
        <Suspense fallback={<SkeletonCard />}>
          <WeeklyChart 
            tasks={additional_data.tasks || []} 
            milestones={additional_data.milestones || []} 
            schedules={additional_data.schedules || []}
            whiteboards={additional_data.whiteboards || []}
          />
        </Suspense>
        <Suspense fallback={<SkeletonCard />}>
          <QuickAction />
        </Suspense>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <Suspense fallback={<SkeletonCard />}>
          <RecentActivity 
            isLoading={isLoading}
          />
        </Suspense>
        <Suspense fallback={<SkeletonCard />}>
          <UpcommingDeadline 
            isLoading={isLoading}
          />
        </Suspense>
      </div>
    </div>
  );
}