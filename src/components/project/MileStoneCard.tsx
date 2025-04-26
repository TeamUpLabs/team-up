"use client";
import { useState, useEffect } from 'react';
import { MileStone } from '@/types/MileStone';
import Link from 'next/link';
import { useProject } from '@/contexts/ProjectContext';

export default function MileStoneCard() {
  const { project } = useProject();
  const [closestMilestone, setClosestMilestone] = useState<MileStone | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getClosestMilestone = async () => {
      try {
        const data: MileStone[] = project?.milestones ?? [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const closest = data
          .filter(milestone => ['in-progress', 'not-started'].includes(milestone.status))
          .filter(milestone => new Date(milestone.endDate) >= today)
          .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())[0] || null;

        setClosestMilestone(closest);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    }

    getClosestMilestone();
  }, [project]);

  const totalTasks = closestMilestone?.subtasks.length ?? 0;
  const completedTasks = closestMilestone?.subtasks.filter(task => task.status === 'done').length ?? 0;

  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (isLoading) {
    return (
      <div className="col-span-1 sm:col-span-2 bg-component-background p-4 sm:p-6 rounded-lg overflow-x-auto border border-component-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-primary">다가오는 마일스톤</h2>
          <Link href={`/platform/${project?.id}/milestone`} className="flex items-center text-text-secondary hover:text-text-primary">
            더보기
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="space-y-4">
          <div className="bg-component-secondary-background p-3 rounded-lg border border-component-border">
            <div className="flex justify-between items-start mb-2">
              <div className="h-6 bg-component-skeleton-background rounded w-1/3 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
              <div className="h-6 bg-component-skeleton-background rounded-md w-16 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
            </div>
            <div className="h-4 bg-component-skeleton-background rounded w-2/3 animate-[pulse_1.5s_ease-in-out_infinite] mt-2"></div>
            <div className="mt-4 flex items-center">
              <div className="w-full bg-component-skeleton-background rounded-full h-1.5">
                <div className="bg-component-skeleton-background h-1.5 rounded-full w-[60%] animate-[pulse_1.5s_ease-in-out_infinite]"></div>
              </div>
              <div className="ml-2 h-4 bg-component-skeleton-background rounded w-12 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
            </div>
            <div className="flex flex-col gap-2 mt-3">
              <div className="flex items-center">
                <span className="text-sm text-text-secondary mr-2">시작일:</span>
                <div className="h-4 bg-component-skeleton-background rounded w-24 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-text-secondary mr-2">종료일:</span>
                <div className="h-4 bg-component-skeleton-background rounded w-24 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-1 sm:col-span-2 bg-component-background p-4 sm:p-6 rounded-lg overflow-x-auto border border-component-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">다가오는 마일스톤</h2>
        <Link href={`/platform/${project?.id}/milestone`} className="flex items-center text-text-secondary hover:text-text-primary">
          더보기
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <div className="space-y-4">
        {closestMilestone ? (
          <div className="bg-component-secondary-background p-3 rounded-lg border border-component-border hover:border-point-color-indigo-hover transition duration-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-text-primary">{closestMilestone?.title}</h3>
              <span className={`px-3 py-1 rounded-md text-sm ${closestMilestone?.status === 'done' ? 'bg-green-500/20 text-green-400' :
                closestMilestone.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                {closestMilestone?.status === 'done' ? '완료' :
                  closestMilestone.status === 'in-progress' ? '진행중' : '시작 전'}
              </span>
            </div>
            <p className="text-sm text-text-secondary">{closestMilestone.description}</p>
            <div className="mt-2 flex items-center">
              <div className="w-full bg-component-tertiary-background rounded-full h-1.5">
                <div
                  className="bg-point-color-indigo h-1.5 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-text-secondary">{progressPercentage}%</span>
            </div>
            <p className="text-sm text-text-secondary mt-1">시작일: {closestMilestone.startDate}</p>
            <p className="text-sm text-text-secondary mt-1">종료일: {closestMilestone.endDate}</p>
          </div>
        ) : (
          <div className="bg-component-secondary-background p-3 rounded-lg border border-component-border">
            <p className="text-text-secondary font-medium">예정된 마일스톤이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}