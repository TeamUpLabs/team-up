import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Task } from '@/types/Task';

export default function ProjectProgressCard({  projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/json/tasks.json')
      .then(response => response.json())
      .then(data => {
        setTasks(data);
        setLoading(false);
      });
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading) {
    return (
      <div className="col-span-1 sm:col-span-2 bg-gray-800 p-4 sm:p-6 rounded-lg animate-pulse">
        <div className="h-7 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-5 bg-gray-700 rounded w-24"></div>
            <div className="h-5 bg-gray-700 rounded w-12"></div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5"></div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-3 sm:mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-700 p-4 rounded-lg">
                <div className="h-4 bg-gray-600 rounded w-16 mx-auto mb-2"></div>
                <div className="h-6 bg-gray-600 rounded w-8 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-1 sm:col-span-2 bg-gray-800 p-4 sm:p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white">프로젝트 진행률</h1>
        <Link href={`/platform/${projectId}/members`} className="flex items-center text-gray-400 hover:text-gray-300">
          더보기
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">전체 진행률</span>
          <span className="text-white font-bold">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-3 sm:mt-4">
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-gray-400">총 작업</p>
            <p className="text-xl font-bold text-white">{totalTasks}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-gray-400">완료</p>
            <p className="text-xl font-bold text-green-500">{completedTasks}</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-gray-400">진행중</p>
            <p className="text-xl font-bold text-yellow-500">{inProgressTasks}</p>
          </div>
        </div>
      </div>
    </div>
  );
}