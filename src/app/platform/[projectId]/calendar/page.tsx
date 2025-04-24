'use client';

import { useState } from 'react';
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

export default function CalendarPage() {
  const { project } = useProject();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="flex flex-col py-4 sm:py-6 px-2 sm:px-4 md:px-6">
      <Calendar
        currentDate={currentDate}
        tasks={project?.tasks}
        days={days}
        onPreviousMonth={previousMonth}
        onNextMonth={nextMonth}
        onSelectTask={handleSelectTask}
      />

      <ScheduleStatus tasks={project?.tasks} />

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