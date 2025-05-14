'use client';

import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Task } from '@/types/Task';
import TaskComponent from '@/components/project/task/TaskComponent';
import TaskModal from '@/components/project/task/TaskModal';
import { getStatusColor } from "@/utils/getStatusColor";
import { useProject } from '@/contexts/ProjectContext';
import SelectMilestoneModal from '@/components/project/task/SelectMilestoneModal';
import { updateTaskStatus } from '@/hooks/getTaskData';
import { useAuthStore } from '@/auth/authStore';

export default function TasksPage() {
  const { project } = useProject();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectMilestoneModalOpen, setIsSelectMilestoneModalOpen] = useState(false);

  useEffect(() => {
    if (!project?.tasks) return;

    try {
      setTasks(project.tasks.map((task: Task) => ({
        ...task,
        id: task.id,
        status: task.status as "not-started" | "in-progress" | "done",
        priority: task.priority as "high" | "medium" | "low"
      })));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [project])

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
      case 'not-started':
        return '준비';
      case 'in-progress':
        return '진행 중';
      case 'done':
        return '완료';
    }
  };

  const groupedTasks = {
    'not-started': tasks.filter(task => task.status === 'not-started'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    'done': tasks.filter(task => task.status === 'done'),
  };

  const moveTask = async (taskId: number, newStatus: Task['status']) => {
    if (newStatus === 'done') {
      const task = tasks.find(task => task.id === taskId);
      if (task?.subtasks && task.subtasks.length > 0) {
        const allSubtasksCompleted = task.subtasks.every(subtask => subtask.completed);
        if (!allSubtasksCompleted) {
          useAuthStore.getState().setAlert('모든 하위 작업이 완료되어야 작업을 완료 상태로 이동할 수 있습니다.', 'error');
          return;
        }
      }
    }

    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    await updateTaskStatus(project?.id ?? '', taskId, newStatus);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="py-20 px-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 bg-project-page-title-background border border-project-page-title-border p-6 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">작업</h1>
            <p className="text-text-secondary mt-2">프로젝트의 작업을 관리하세요</p>
          </div>
          <button 
            onClick={() => setIsSelectMilestoneModalOpen(true)}
            className="flex items-center gap-2 bg-point-color-indigo hover:bg-point-color-indigo-hover text-white px-4 py-2 rounded-lg transition-colors active:scale-95"
          >
            <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
            <span>작업 추가</span>
          </button>
        </div>

        {/* Tasks Columns */}
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
                    <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium mr-2 ${getStatusColor(status as Task['status'])}`}>
                      {getStatusText(status as Task['status'])}
                    </span>
                    <span className="text-text-secondary text-sm">{tasksList.length}</span>
                  </div>
                </div>
              </div>
              <div className="p-2">
                {tasksList.map((task) => (
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