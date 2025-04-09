'use client';

import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Task } from '@/types/Task';
import TaskData from "../../../../../public/json/tasks.json";


export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(TaskData.map(task => ({ ...task, id: String(task.id), status: task.status as "todo" | "in-progress" | "done" })));

  const getStatusBadgeColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-500';
      case 'done':
        return 'bg-green-500/20 text-green-500';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return '할 일';
      case 'in-progress':
        return '진행 중';
      case 'done':
        return '완료';
    }
  };

  const groupedTasks = {
    todo: tasks.filter(task => task.status === 'todo'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    done: tasks.filter(task => task.status === 'done'),
  };

  const moveTask = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="px-2 sm:px-4 md:px-6 mx-auto py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-100">작업 관리</h1>
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
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mr-2 ${getStatusBadgeColor(status as Task['status'])}`}>
                      {getStatusText(status as Task['status'])}
                    </span>
                    <span className="text-gray-400 text-sm">{tasksList.length}</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-200">
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-2">
                {tasksList.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('taskId', task.id);
                    }}
                    className="p-3 mb-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 cursor-move transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-100 mb-2">
                      {task.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      {task.assignee && (
                        <span className="flex items-center">
                          <span className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center mr-1 text-[10px]">
                            {task.assignee.charAt(0)}
                          </span>
                          {task.assignee}
                        </span>
                      )}
                      {task.dueDate && (
                        <span>
                          마감일: {task.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
}