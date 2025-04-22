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
    Array(4).fill(0).map((_, index) => (
      <div key={index} className="flex items-center justify-between p-2 border-b border-gray-700 animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-600/50 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-gray-500/50 rounded-sm"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-600/50 rounded w-24"></div>
            <div className="h-3 bg-gray-600/40 rounded w-20"></div>
            <div className="flex items-center">
              <span className="h-2.5 bg-gray-600/30 rounded w-[100px]"></span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-600/50 rounded-full"></div>
            <div className="h-3 bg-gray-600/40 rounded w-12"></div>
          </div>
          <div className="h-2 bg-gray-600/30 rounded w-16"></div>
        </div>
      </div>
    ))
  );

  return (
    <div className="col-span-1 sm:col-span-2 bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-white">팀원 활동</h2>
        <Link href={`/platform/${project?.id}/members`} className="flex items-center text-gray-400 hover:text-gray-300">
          더보기
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          project?.members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-2 border-b border-gray-700 hover:bg-gray-700 transition duration-200">
              <div className="flex items-center">
                <div className={`w-10 h-10 ${getColorForMember(member.id)} rounded-full flex items-center justify-center text-white font-bold`}>
                  {member.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="text-white">{member.name}</p>
                  <p className="text-sm text-gray-400">{member.role}</p>
                  <div className="flex gap-1 align-center">
                    <p className="text-xs text-gray-500">현재 작업: </p>
                    {
                      member.currentTask.length > 0 ?
                        member.currentTask.map((task, idx) => (
                          <p key={idx} className="text-xs text-gray-500">{task.title}</p>
                        ))
                        :
                        <p className="text-xs text-gray-500">없음</p>
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
                  <span className="ml-2 text-gray-300">{member.status}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}