'use client';

import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Task } from '@/types/Task';
import TaskComponent from '@/components/project/task/TaskComponent';
import TaskModal from '@/components/project/task/TaskModal';
import { getStatusColor } from "@/utils/getStatusColor";
import { useProject } from '@/contexts/ProjectContext';
import SelectMilestoneModal from '@/components/project/task/SelectMilestoneModal';

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
        id: String(task.id),
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
      const taskToOpen = tasks.find(task => task.id === selectedTaskId);
      
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

  const moveTask = (taskId: string, newStatus: Task['status']) => {
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
      <div className="px-2 sm:px-4 md:px-6 mx-auto py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-100">작업 관리</h1>
          <button 
            onClick={() => setIsSelectMilestoneModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
            <span>작업 추가</span>
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="작업 검색..."
              className="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Tasks Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(groupedTasks).map(([status, tasksList]) => (
            <div
              key={status}
              className="bg-gray-800 rounded-lg border border-gray-700"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const taskId = e.dataTransfer.getData('taskId');
                moveTask(taskId, status as Task['status']);
              }}
            >
              <div className="px-4 py-3 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mr-2 ${getStatusColor(status as Task['status'])}`}>
                      {getStatusText(status as Task['status'])}
                    </span>
                    <span className="text-gray-400 text-sm">{tasksList.length}</span>
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