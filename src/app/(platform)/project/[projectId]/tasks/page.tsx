'use client';

import { useState, useEffect, Suspense, lazy, useMemo, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Task } from '@/types/Task';
import { getStatusColorName } from "@/utils/getStatusColor";
import { useProject } from '@/contexts/ProjectContext';
import { updateTaskStatus } from '@/hooks/getTaskData';
import { useAuthStore } from '@/auth/authStore';
import Badge from '@/components/ui/Badge';
import { useTheme } from "@/contexts/ThemeContext";

// 지연 로딩을 위한 컴포넌트들
const TaskComponent = lazy(() => import('@/components/project/task/TaskComponent'));
const TaskModal = lazy(() => import('@/components/project/task/TaskModal'));
const SelectMilestoneModal = lazy(() => import('@/components/project/task/SelectMilestoneModal'));

// 로딩 컴포넌트
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
  </div>
);

// 스켈레톤 카드 컴포넌트
const SkeletonTaskCard = () => (
  <div className="bg-component-tertiary-background animate-pulse rounded-lg h-20 mb-2"></div>
);

export default function TasksPage() {
  const { tasks } = useProject();
  const { isDark } = useTheme();
  const [stateTasks, setStateTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectMilestoneModalOpen, setIsSelectMilestoneModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 디바운스된 검색 함수
  const debouncedSetSearchQuery = useCallback((value: string) => {
    const timeoutId = setTimeout(() => setSearchQuery(value), 300);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!tasks) return;

    try {
      setStateTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [tasks])

  // Listen for header search events
  useEffect(() => {
    const handleHeaderSearch = (event: Event) => {
      const customEvent = event as CustomEvent;
      const searchValue = customEvent.detail || '';
      
      // 디바운스된 검색 적용
      debouncedSetSearchQuery(searchValue);
    };

    window.addEventListener('headerSearch', handleHeaderSearch);
    
    return () => {
      window.removeEventListener('headerSearch', handleHeaderSearch);
    };
  }, [debouncedSetSearchQuery]);

  useEffect(() => {
    const selectedTaskId = localStorage.getItem('selectedTaskId');

    if (selectedTaskId && stateTasks.length > 0) {
      const taskToOpen = stateTasks.find(task => task.id === parseInt(selectedTaskId));

      if (taskToOpen) {
        setSelectedTask(taskToOpen);
        setIsModalOpen(true);
      }

      localStorage.removeItem('selectedTaskId');
    }
  }, [stateTasks]);

  // 메모이제이션을 통한 필터링 최적화
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return stateTasks;
    
    const query = searchQuery.toLowerCase();
    return stateTasks.filter(task => 
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query) ||
      task.assignees?.some(assignee => assignee.name.toLowerCase().includes(query)) ||
      task.subtasks?.some(subtask => subtask.title.toLowerCase().includes(query))
    );
  }, [stateTasks, searchQuery]);

  // 메모이제이션을 통한 그룹화 최적화
  const groupedTasks = useMemo(() => ({
    'not_started': filteredTasks.filter(task => task.status === 'not_started'),
    'in_progress': filteredTasks.filter(task => task.status === 'in_progress'),
    'completed': filteredTasks.filter(task => task.status === 'completed'),
  }), [filteredTasks]);

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'not_started':
        return '준비';
      case 'in_progress':
        return '진행 중';
      case 'completed':
        return '완료';
    }
  };

  const moveTask = async (taskId: number, newStatus: Task['status']) => {
    if (newStatus === 'completed') {
      const task = stateTasks.find(task => task.id === taskId);
      if (task?.subtasks && task.subtasks.length > 0) {
        const allSubtasksCompleted = task.subtasks.every(subtask => subtask.is_completed);
        if (!allSubtasksCompleted) {
          useAuthStore.getState().setAlert('모든 하위 작업이 완료되어야 작업을 완료 상태로 이동할 수 있습니다.', 'error');
          return;
        }
      }
    }
    await updateTaskStatus(taskId, newStatus);
    setStateTasks(stateTasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-end">
          <button
            onClick={() => setIsSelectMilestoneModalOpen(true)}
            className="flex active:scale-95"
          >
            <Badge
              content={
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
                  <span>작업 추가</span>
                </div>
              }
              color={isDark ? 'white' : 'black'}
              className="!px-4 !py-2 !font-semibold"
            />
          </button>
        </div>

        {/* Task Column */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(groupedTasks).map(([status, tasksList]) => (
            <div
              key={status}
              className="bg-component-background rounded-lg border border-component-border"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const taskId = e.dataTransfer.getData('taskId');
                moveTask(parseInt(taskId), status as Task['status']);
              }}
            >
              <div className="px-4 py-3 border-b border-component-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge
                      content={getStatusText(status as Task['status'])}
                      color={getStatusColorName(status as Task['status'])}
                      className="!inline-flex !px-2 !py-1 !rounded-md !text-xs !font-medium !mr-2"
                    />
                    <span className="text-text-secondary text-sm">
                      {tasksList.length}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-2">
                {tasksList.length === 0 ? (
                  <div className="text-center text-text-secondary py-8">
                    작업이 없습니다.
                  </div>
                ) : (
                  tasksList.map((task: Task) => (
                    <div key={task.id} onClick={() => handleTaskClick(task)}>
                      <Suspense fallback={<SkeletonTaskCard />}>
                        <TaskComponent task={task} />
                      </Suspense>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          {selectedTask && (
            <TaskModal
              task={selectedTask}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </Suspense>

        <Suspense fallback={<LoadingSpinner />}>
          <SelectMilestoneModal
            isOpen={isSelectMilestoneModalOpen}
            onClose={() => setIsSelectMilestoneModalOpen(false)}
          />
        </Suspense>
      </div>
    </DndProvider>
  );
}