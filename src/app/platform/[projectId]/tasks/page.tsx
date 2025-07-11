'use client';

import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Task } from '@/types/Task';
import TaskComponent from '@/components/project/task/TaskComponent';
import TaskModal from '@/components/project/task/TaskModal';
import { getStatusColorName } from "@/utils/getStatusColor";
import { useProject } from '@/contexts/ProjectContext';
import SelectMilestoneModal from '@/components/project/task/SelectMilestoneModal';
import { updateTaskStatus } from '@/hooks/getTaskData';
import { useAuthStore } from '@/auth/authStore';
import { useTheme } from '@/contexts/ThemeContext';
import Badge from '@/components/ui/Badge';

export default function TasksPage() {
  const { isDark } = useTheme();
  const { project } = useProject();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectMilestoneModalOpen, setIsSelectMilestoneModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!project?.tasks) return;

    try {
      setTasks(project.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [project])

    // Listen for header search events
    useEffect(() => {
      const handleHeaderSearch = (event: Event) => {
        const customEvent = event as CustomEvent;
        const searchValue = customEvent.detail || '';
        
        // Only update if value is different
        if (searchValue !== searchQuery) {
          setSearchQuery(searchValue);
        }
      };
  
      // Add event listener
      window.addEventListener('headerSearch', handleHeaderSearch);
      
      return () => {
        window.removeEventListener('headerSearch', handleHeaderSearch);
      };
    }, [searchQuery]);

  useEffect(() => {
    const selectedTaskId = localStorage.getItem('selectedTaskId');

    if (selectedTaskId && tasks.length > 0) {
      const taskToOpen = tasks.find(task => task.id === parseInt(selectedTaskId));

      if (taskToOpen) {
        setSelectedTask(taskToOpen);
        setIsModalOpen(true);
      }

      localStorage.removeItem('selectedTaskId');
    }
  }, [tasks]);

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

  const filterTasks = (taskList: Task[]) => {
    if (!searchQuery.trim()) return taskList;
    
    const query = searchQuery.toLowerCase();
    return taskList.filter(task => 
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query) ||
      project?.members?.some(member => member.user.name.toLowerCase().includes(query)) ||
      task.subtasks?.some(subtask => subtask.title.toLowerCase().includes(query))
    );
  };

  const groupedTasks = {
    'not_started': filterTasks(tasks.filter(task => task.status === 'not_started')),
    'in_progress': filterTasks(tasks.filter(task => task.status === 'in_progress')),
    'completed': filterTasks(tasks.filter(task => task.status === 'completed')),
  };

  const moveTask = async (taskId: number, newStatus: Task['status']) => {
    if (newStatus === 'completed') {
      const task = tasks.find(task => task.id === taskId);
      if (task?.subtasks && task.subtasks.length > 0) {
        const allSubtasksCompleted = task.subtasks.every(subtask => subtask.is_completed);
        if (!allSubtasksCompleted) {
          useAuthStore.getState().setAlert('모든 하위 작업이 완료되어야 작업을 완료 상태로 이동할 수 있습니다.', 'error');
          return;
        }
      }
    }
    await updateTaskStatus(taskId, newStatus);
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 flex flex-col gap-4">
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
              isDark={isDark}
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
                      isDark={isDark}
                      className="!inline-flex !px-2 !py-1 !rounded-md !text-xs !font-medium !mr-2"
                    />
                    <span className="text-text-secondary text-sm">
                      {tasksList.length}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-2">
                {tasksList.map((task: Task) => (
                  <div key={task.id} onClick={() => handleTaskClick(task)}>
                    <TaskComponent task={task} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedTask && (
          <TaskModal
            task={selectedTask}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        <SelectMilestoneModal
          isOpen={isSelectMilestoneModalOpen}
          onClose={() => setIsSelectMilestoneModalOpen(false)}
        />
      </div>
    </DndProvider>
  );
}