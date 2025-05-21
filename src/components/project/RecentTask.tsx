import { useProject } from '@/contexts/ProjectContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faCommentDots, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getPriorityColor } from '@/utils/getPriorityColor';
import Image from 'next/image';
import { Task } from '@/types/Task';
import { useEffect, useState, useRef } from 'react';

const TaskSkeleton = () => {
  return (
    <div className="bg-component-secondary-background p-4 rounded-lg border border-component-border flex flex-col justify-between space-y-4 animate-pulse">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
          <div className="h-5 w-5 bg-gray-200 rounded-md"></div>
        </div>
        <div className="h-5 w-3/4 bg-gray-200 rounded-md mb-2"></div>
        <div className="h-10 w-full bg-gray-200 rounded-md mb-3"></div>
      </div>
      <div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3"></div>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-5 w-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default function RecentTask() {
  const { project } = useProject();
  const [isLoading, setIsLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project && project.tasks) {
      setIsLoading(false);
    }
  }, [project]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setActiveTaskId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDeleteClick = (taskId?: string) => {
    // Implement delete functionality here
    console.log('Delete button clicked', taskId ? `for task ${taskId}` : 'for card');
    setShowDropdown(false);
    setActiveTaskId(null);
  };

  const toggleDropdown = (taskId?: string) => {
    if (taskId) {
      setActiveTaskId(taskId === activeTaskId ? null : taskId);
      setShowDropdown(false);
    } else {
      setShowDropdown(!showDropdown);
      setActiveTaskId(null);
    }
  };

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
      <div className="col-span-1 sm:col-span-2 bg-component-background p-4 sm:p-6 rounded-lg shadow-md border border-component-border">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-text-primary">최근 작업</h2>
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center text-text-secondary hover:text-text-primary p-2 rounded-md border border-component-border"
              onClick={() => toggleDropdown()}
            >
              <FontAwesomeIcon icon={faEllipsis} />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-36 bg-component-secondary-background border border-component-border rounded-md shadow-lg z-10">
                <ul>
                  <li>
                    <button 
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-component-tertiary-background flex items-center rounded-md"
                      onClick={() => handleDeleteClick()}
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-2" />
                      삭제
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TaskSkeleton />
          <TaskSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-1 sm:col-span-2 bg-component-background p-4 sm:p-6 rounded-lg shadow-md border border-component-border">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-text-primary">최근 작업</h2>
        <div className="relative" ref={dropdownRef}>
          <button 
            className="flex items-center text-text-secondary hover:text-text-primary p-2 rounded-md border border-component-border"
            onClick={() => toggleDropdown()}
          >
            <FontAwesomeIcon icon={faEllipsis} />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-1 w-36 bg-component-secondary-background border border-component-border rounded-md shadow-lg z-10">
              <ul>
                <li>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-component-tertiary-background flex items-center rounded-md"
                    onClick={() => handleDeleteClick()}
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    삭제
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {project?.tasks?.slice(0, 2).map((task) => (
          <div key={task.id} className="bg-component-secondary-background p-4 rounded-lg border border-component-border flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${getPriorityColor(task.priority)}`}>
                  <span className={`w-2 h-2 mr-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                <div className="relative">
                  <FontAwesomeIcon 
                    icon={faEllipsis} 
                    className="text-text-secondary cursor-pointer" 
                    onClick={() => toggleDropdown(task.id.toString())}
                  />
                  {activeTaskId === task.id.toString() && (
                    <div className="absolute right-0 mt-1 w-36 bg-white border border-component-border rounded-md shadow-lg z-10">
                      <ul>
                        <li>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                            onClick={() => handleDeleteClick(task.id.toString())}
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                            삭제
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
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
                    <Image
                      key={assignee.id}
                      className="w-6 h-6 border-2 border-component-border rounded-full"
                      src={assignee.profileImage}
                      alt={`Assignee ${i + 1}`}
                      width={24}
                      height={24}
                    />
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
          <p className="text-text-secondary col-span-full text-center py-4">No recent tasks.</p>
        )}
        {(project?.tasks?.length || 0) === 1 && (
          <div className="hidden md:block"></div>
        )}
      </div>
    </div>
  );
}