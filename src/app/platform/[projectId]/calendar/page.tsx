'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval
} from 'date-fns';
import { Task } from '@/types/Task';
import TaskModal from '@/components/project/task/TaskModal';
import Calendar from '@/components/project/calendar/CalendarComponent';
import ScheduleStatus from '@/components/project/calendar/ScheduleStatus';
import { useProject } from "@/contexts/ProjectContext";
import ScheduleCreateModal from '@/components/project/calendar/ScheduleCreateModal';

export default function CalendarPage() {
  const { project } = useProject();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 일요일 시작
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const previousMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col py-20 px-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 bg-project-page-title-background border border-project-page-title-border p-6 rounded-lg">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">일정</h1>
          <p className="text-text-secondary mt-2">프로젝트의 일정을 관리하세요</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-point-color-indigo hover:bg-point-color-indigo-hover text-white px-4 py-2 rounded-lg transition-colors active:scale-95"
        >
          <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
          <span>일정 추가</span>
        </button>
      </div>

      <Calendar
        currentDate={currentDate}
        tasks={project?.tasks}
        days={days}
        onPreviousMonth={previousMonth}
        onNextMonth={nextMonth}
        onSelectTask={handleSelectTask}
      />

      <ScheduleStatus tasks={project?.tasks} />

      <ScheduleCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}