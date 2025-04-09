import { useEffect, useState } from 'react';
import { Task } from '@/types/Task';

export default function ProjectProgressCard() {
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="col-span-1 sm:col-span-2 bg-gray-800 p-4 sm:p-6 rounded-lg">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">프로젝트 진행률</h2>
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