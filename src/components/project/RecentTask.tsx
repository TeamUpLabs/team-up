import { useProject } from '@/contexts/ProjectContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { getPriorityColor } from '@/utils/getPriorityColor';
import Image from 'next/image';
import { Task } from '@/types/Task';
import { useEffect, useState } from 'react';
import RecentTaskSkeleton from '@/components/skeleton/RecentTaskSkeleton';
import Tooltip from '@/components/ui/Tooltip';

export default function RecentTask() {
  const { project } = useProject();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (project && project.tasks) {
      setIsLoading(false);
    }
  }, [project]);

  const calculateProgress = (task: Task): number => {
    const { subtasks, status } = task;

    if (!subtasks || subtasks.length === 0) {
      return status === 'done' ? 100 : 0;
    }

    const completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
    return Math.round((completedSubtasks / subtasks.length) * 100);
  };

  if (isLoading) {
    return (
      <RecentTaskSkeleton />
    );
  }

  return (
    <div className="col-span-1 sm:col-span-2 bg-component-background p-4 sm:p-6 rounded-lg shadow-md border border-component-border">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-text-primary">최근 작업</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {project?.tasks?.slice(0, 2).map((task) => (
          <div key={task.id} className="bg-component-secondary-background p-4 rounded-lg border border-component-border flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${getPriorityColor(task.priority)}`}>
                  <span className={`w-2 h-2 mr-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-violet-500' : 'bg-cyan-500'}`}></span>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                <p className="text-sm text-text-secondary">마감일: {task.endDate}</p>
              </div>
              <h3 className="text-md font-semibold text-text-primary mb-1">{task.title}</h3>
              <p className="text-sm text-text-secondary mb-3 h-10 overflow-hidden text-ellipsis">
                {task.description || 'No description available. This task focuses on integrating the new API services.'}
              </p>
            </div>

            <div>
              <div className="w-full bg-component-border rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full ${calculateProgress(task) > 60 ? 'bg-green-500' : 'bg-yellow-400'}`}
                  style={{ width: `${calculateProgress(task)}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-sm text-text-secondary">
                <div className="flex -space-x-2">
                  {task.assignee?.map((assignee, i) => (
                    <Tooltip content={assignee.name} key={assignee.id}>
                      <Image
                        className="w-6 h-6 border-2 border-component-border rounded-full"
                        src={assignee.profileImage}
                        alt={`Assignee ${i + 1}`}
                        width={24}
                        height={24}
                      />
                    </Tooltip>
                  ))}
                  {task.assignee?.length === 0 && (
                    <span className="flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-component-background border-2 border-component-border rounded-full hover:bg-component-background/60">+</span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faCommentDots} className="mr-1" />
                    {task.comments?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {(project?.tasks?.length || 0) < 1 && (
          <p className="text-text-secondary col-span-full text-center py-4">최근 작업이 없습니다.</p>
        )}
        {(project?.tasks?.length || 0) === 1 && (
          <div className="hidden md:block"></div>
        )}
      </div>
    </div>
  );
}