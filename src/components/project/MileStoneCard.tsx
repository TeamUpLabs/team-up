import { useState, useEffect } from 'react';
import { MileStone } from '@/types/MileStone';
import { useProject } from '@/contexts/ProjectContext';
import MilestoneCardSkeleton from '@/components/skeleton/MilestoneCardSkeleton';
import { getStatusColorName } from '@/utils/getStatusColor';
import Badge, { BadgeColor } from '@/components/ui/Badge';
import { useTheme } from '@/contexts/ThemeContext';
import { isMarkdown } from '@/utils/isMarkdown';
import { summarizeMarkdown } from '@/utils/summarizeMarkdown';

export default function MileStoneCard() {
  const { project } = useProject();
  const [closestMilestone, setClosestMilestone] = useState<MileStone | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    const getClosestMilestone = async () => {
      try {
        const data: MileStone[] = project?.milestones ?? [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const closest = data
          .filter(milestone => ['in-progress', 'not-started'].includes(milestone.status))
          .filter(milestone => new Date(milestone.endDate || "") >= today)
          .sort((a, b) => new Date(a.endDate || "").getTime() - new Date(b.endDate || "").getTime())[0] || null;

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
      <MilestoneCardSkeleton isPreview={false} />
    );
  }

  return (
    <div className="col-span-1 sm:col-span-2 bg-component-background p-4 sm:p-6 rounded-lg overflow-x-auto border border-component-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">다가오는 마일스톤</h2>
      </div>
      <div className="space-y-4">
        {closestMilestone ? (
          <div className="bg-component-secondary-background p-3 rounded-lg border border-component-border hover:border-point-color-indigo-hover transition duration-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-text-primary">{closestMilestone?.title}</h3>
              <Badge
                content={
                  <span className='inline-flex items-center'>
                    {closestMilestone?.status === 'done' ? '완료' :
                      closestMilestone.status === 'in-progress' ? '진행중' : '시작 전'}
                  </span>
                }
                color={getStatusColorName(closestMilestone?.status ?? '') as BadgeColor}
                isDark={isDark}
              />
            </div>
            {isMarkdown(closestMilestone.description) ? (
              <p className="text-sm text-text-secondary line-clamp-2">{summarizeMarkdown(closestMilestone.description) || "설명 없음"}</p>
            ) : (
              <p className="text-sm text-text-secondary line-clamp-2">{closestMilestone.description || "설명 없음"}</p>
            )}
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