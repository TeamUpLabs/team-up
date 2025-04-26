import Link from "next/link";
import { useState, useEffect } from "react";
import { useProject } from "@/contexts/ProjectContext";


export default function TeamActivities() {
  const bgColors = [
    'bg-blue-500', 'bg-red-500', 'bg-green-500',
    'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
    'bg-indigo-500', 'bg-teal-500'
  ];

  const getColorForMember = (memberId: number) => {
    return bgColors[memberId % bgColors.length];
  };

  const { project } = useProject();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (project && project.members) {
      setIsLoading(false);
    }
  }, [project]);

  const SkeletonLoader = () => (
    Array(3).fill(0).map((_, index) => (
      <div key={index} className="flex items-center justify-between p-2 border-b border-component-border animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-component-skeleton-background rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-component-skeleton-background rounded-sm"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-component-skeleton-background rounded w-24"></div>
            <div className="h-3 bg-component-skeleton-background rounded w-20"></div>
            <div className="flex items-center">
              <span className="h-2.5 bg-component-skeleton-background rounded w-[100px]"></span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-component-skeleton-background rounded-full"></div>
            <div className="h-3 bg-component-skeleton-background rounded w-12"></div>
          </div>
          <div className="h-2 bg-component-skeleton-background rounded w-16"></div>
        </div>
      </div>
    ))
  );

  return (
    <div className="col-span-1 sm:col-span-2 bg-component-background p-4 sm:p-6 rounded-lg border border-component-border">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-text-primary">팀원 활동</h2>
        <Link href={`/platform/${project?.id}/members`} className="flex items-center text-text-secondary hover:text-text-primary">
          더보기
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <div className="max-h-[300px] overflow-y-auto divide-y divide-component-border">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          project?.members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-2 hover:bg-component-secondary-background transition duration-200">
              <div className="flex items-center">
                <div className={`w-10 h-10 ${getColorForMember(member.id)} rounded-full flex items-center justify-center text-text-primary font-bold`}>
                  {member.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <div className="flex items-center gap-2">
                    <p className="text-text-primary">{member.name}</p>
                    {member.id === project?.leader.id ? (
                      <div className="flex items-center bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full">
                        <span className="text-xs">프로젝트 리더</span>
                      </div>
                    ) : project?.manager.some((manager) => manager.id === member.id) ? (
                      <div className="flex items-center bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                        <span className="text-xs">관리자</span>
                      </div>
                    ) : (
                      <div className="flex items-center bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                        <span className="text-xs">멤버</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary">{member.role}</p>
                  <div className="flex gap-1 align-center">
                    <p className="text-xs text-text-secondary">현재 작업: </p>
                    {
                      member.currentTask.length > 0 ?
                        member.currentTask.map((task, idx) => (
                          <p key={idx} className="text-xs text-text-secondary">{task.title}</p>
                        ))
                        :
                        <p className="text-xs text-text-secondary">없음</p>
                    }
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center">
                  <span className={`w-3 h-3 bg-${member.status === "활성"
                    ? "green"
                    : member.status === "자리비움"
                      ? "yellow"
                      : "gray"
                    }-500 rounded-full`}></span>
                  <span className="ml-2 text-text-secondary">{member.status}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}