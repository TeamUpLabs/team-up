"use client";
import { useState, useEffect } from 'react';
import { MileStone } from '@/types/MileStone';
import Link from 'next/link';

export default function MileStoneCard({ projectId }: { projectId: string }) {
  const [closestMilestone, setClosestMilestone] = useState<MileStone | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMileStone = async () => {
      try {
        const response = await fetch('/json/milestones.json');
        if (!response.ok) {
          throw new Error('네트워크 응답이 올바르지 않습니다.');
        }
        const data: MileStone[] = await response.json();
        
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

    fetchMileStone();
  }, []);

  if (isLoading) {
    return (
      <div className="col-span-1 sm:col-span-2 bg-gray-800 p-4 sm:p-6 rounded-lg overflow-x-auto border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="h-7 bg-gray-700 rounded w-40 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="h-5 bg-gray-600 rounded w-3/4 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-600 rounded w-1/4 animate-pulse mb-2"></div>
            <div className="mt-2 flex items-center">
              <div className="w-full bg-gray-600 rounded-full h-1.5 animate-pulse"></div>
              <div className="ml-2 h-4 bg-gray-600 rounded w-8 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!closestMilestone) {
    return (
      <div className="col-span-1 sm:col-span-2 bg-gray-800 p-4 sm:p-6 rounded-lg overflow-x-auto border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">다가오는 마일스톤</h2>
        <div className="space-y-4">
          <div className="bg-gray-700 p-3 rounded-lg">
            <p className="text-white font-medium">예정된 마일스톤이 없습니다</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-1 sm:col-span-2 bg-gray-800 p-4 sm:p-6 rounded-lg overflow-x-auto border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">다가오는 마일스톤</h2>
        <Link href={`/platform/${projectId}/milestone`} className="flex items-center text-gray-400 hover:text-gray-300">
          더보기
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <div className="space-y-4">
        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-white font-medium">{closestMilestone.title}</p>
          <p className="text-sm text-gray-400 mt-1">{closestMilestone.endDate}</p>
          <div className="mt-2 flex items-center">
            <div className="w-full bg-gray-600 rounded-full h-1.5">
              <div 
                className="bg-green-500 h-1.5 rounded-full" 
                style={{ width: `${closestMilestone.progress}%` }}
              ></div>
            </div>
            <span className="ml-2 text-sm text-gray-400">{closestMilestone.progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}