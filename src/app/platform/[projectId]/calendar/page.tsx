'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Task } from '@/types/Task';
import TaskModal from '@/components/task/TaskModal';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/json/tasks.json')
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'in-progress':
        return 'bg-blue-500/20 text-blue-500';
      case 'done':
        return 'bg-green-500/20 text-green-500';
    }
  };

  const previousMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col py-4 sm:py-6 px-2 sm:px-4 md:px-6">
      <div className="flex-1 bg-gray-800 rounded-xl shadow-lg border border-gray-700 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-900">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-100">일정 관리</h1>
            <div className="flex items-center space-x-4">
              <button onClick={previousMonth} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5 text-gray-300" />
              </button>
              <h2 className="text-xl font-semibold text-gray-100">
                {format(currentDate, 'yyyy년 M월')}
              </h2>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-900">
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <div key={day} className="bg-gray-800 py-2 text-center font-medium text-gray-300">
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 gap-px bg-gray-900">
          {days.map((day) => {
            const dayTasks = tasks.filter(task => task.dueDate === format(day, 'yyyy-MM-dd'));
            
            return (
              <div
                key={day.toString()}
                className={`p-2 transition-colors cursor-pointer
                  ${!isSameMonth(day, currentDate) 
                    ? ' hover:bg-slate-800/90' 
                    : 'bg-gray-800 hover:bg-gray-700/90'}
                  ${isToday(day) ? 'ring-2 ring-blue-400 ring-inset' : ''}`}
              >
                <p className={`text-sm font-medium
                  ${!isSameMonth(day, currentDate) ? 'text-gray-500' : 'text-gray-200'}
                  ${isToday(day) ? 'text-blue-300' : ''}`}>
                  {format(day, 'd')}
                </p>
                <div className="mt-1 space-y-1">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => {
                        setSelectedTask(task);
                        setIsModalOpen(true);
                      }}
                      className={`px-2 py-1 rounded-md text-xs ${getStatusColor(task.status)} hover:opacity-80 cursor-pointer`}
                    >
                      <p className="font-medium truncate">{task.title}</p>
                      <p className="text-xs opacity-75">{task.assignee}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-4 bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">일정 현황</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['todo', 'in-progress', 'done'].map((status) => (
            <div key={status} className={`p-4 rounded-lg border border-gray-700 ${getStatusColor(status)}`}>
              <h4 className="font-medium capitalize mb-2">
                {status === 'todo' ? '예정' : status === 'in-progress' ? '진행중' : '완료'}
              </h4>
              <p className="text-2xl font-bold">
                {tasks.filter(task => task.status === status).length}
              </p>
            </div>
          ))}
        </div>
      </div>

      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
      />
    </div>
  );
}