"use client";

import ProjectProgressCard from "@/components/project/ProjectProgressCard";
import MileStoneCard from "@/components/project/MileStoneCard";
import TeamActivities from "@/components/project/TeamActivities";
import RecentFileCard from "@/components/project/RecentFileCard";
import { use } from "react";

export default function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);

  return (
    <div className="py-4 sm:py-6 px-2 sm:px-4 md:px-6">
      {/* 모바일에서는 1열, 태블릿에서 2열, 데스크탑에서 4열 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {/* 프로젝트 진행률 - 모바일에서도 2열 span */}
        <ProjectProgressCard projectId={projectId} />
        {/* 다가오는 마일스톤 - 모바일에서 전체 너비 */}
        <MileStoneCard projectId={projectId} />

        {/* 팀원 활동 - 모바일에서도 2열 span */}
        <TeamActivities projectId={projectId} />

        {/* 최근 파일 - 모바일에서도 2열 span */}
        <RecentFileCard />
      </div>
    </div>
  );
}