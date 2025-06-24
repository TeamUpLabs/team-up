import { useEffect, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import ProjectProgressCardSkeleton from '@/components/skeleton/ProjectProgressCardSkeleton';

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
    { label: '총 작업', color: 'text-text-primary', value: totalTasks },
    { label: '진행중', color: 'text-blue-500', value: inProgressTasks },
    { label: '완료', color: 'text-green-500', value: completedTasks }
  ]

  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (isLoading) {
    return (
      <ProjectProgressCardSkeleton isPreview={false} />
    );
  }

  return (
    <div className="col-span-1 sm:col-span-2 bg-component-background p-4 sm:p-6 rounded-lg border border-component-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">프로젝트 진행률</h2>
      </div>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">전체 진행률</span>
          <span className="text-text-secondary font-bold">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-component-secondary-background rounded-full h-2.5">
          <div className="bg-point-color-indigo h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-3 sm:mt-4">
          {TaskLabelRender.map((taskLabel, index) => (
            <div key={index} className={`bg-component-secondary-background p-4 rounded-lg text-center ${taskLabel.color} border border-component-border
                hover:border-point-color-indigo-hover transition duration-200 ease-in-out`}>
              <p className="text-text-secondary">{taskLabel.label}</p>
              <p className="text-lg font-bold">{taskLabel.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}