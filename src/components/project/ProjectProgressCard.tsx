import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useProject } from '@/contexts/ProjectContext';

interface TaskLabelRenderType {
  label: string;
  color: string;
  value: number;
}

export default function ProjectProgressCard() {
  const { project } = useProject();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (project && project.tasks) {
      setIsLoading(false);
    }
  }, [project]);

  const totalTasks = project?.tasks.length ?? 0;
  const completedTasks = project?.tasks.filter(task => task.status === 'done').length ?? 0;
  const inProgressTasks = project?.tasks.filter(task => task.status === 'in-progress').length ?? 0;

  const TaskLabelRender: TaskLabelRenderType[] = [
    { label: '총 작업', color: 'text-white', value: totalTasks },
    { label: '진행중', color: 'text-blue-500', value: inProgressTasks },
    { label: '완료', color: 'text-green-500', value: completedTasks }
  ]

  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (isLoading) {
    return (
      <div className="col-span-1 sm:col-span-2 bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-300">프로젝트 진행률</h1>
          <div className="flex items-center text-gray-400">
            <Link href={`/platform/${project?.id}/tasks`} className="flex items-center text-gray-400 hover:text-gray-300">
              더보기
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">전체 진행률</span>
            <div className="h-5 bg-gray-800 rounded w-12 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
          </div>
          <div className="relative w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gray-700 h-2.5 rounded-full w-3/5 animate-progressBar"></div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-3 sm:mt-4">
            {TaskLabelRender.map((taskLabel, index) => (
              <div key={index} className="bg-gray-800/50 p-4 rounded-lg text-center border border-gray-700/50">
                <p className="text-gray-400">{taskLabel.label}</p>
                <div className="h-7 bg-gray-800 rounded w-10 mx-auto mt-2 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-1 sm:col-span-2 bg-gray-900/50 p-4 sm:p-6 rounded-lg border border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-300">프로젝트 진행률</h1>
        <Link href={`/platform/${project?.id}/tasks`} className="flex items-center text-gray-400 hover:text-gray-300">
          더보기
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">전체 진행률</span>
          <span className="text-gray-400 font-bold">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2.5">
          <div className="bg-indigo-500/70 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-3 sm:mt-4">
          {TaskLabelRender.map((taskLabel, index) => (
            <div key={index} className={`bg-gray-800/50 p-4 rounded-lg text-center ${taskLabel.color} border border-gray-700/50
                hover:border-purple-600 transition duration-200 ease-in-out`}>
              <p className="text-gray-400">{taskLabel.label}</p>
              <p className="text-xl font-bold">{taskLabel.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}