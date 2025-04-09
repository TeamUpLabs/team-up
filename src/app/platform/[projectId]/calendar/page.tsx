'use client';

import { useState, useEffect } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Task } from '@/types/Task';
import TaskModal from '@/components/project/task/TaskModal';
import Calendar from '@/components/project/calendar/CalendarComponent';
import ScheduleStatus from '@/components/project/calendar/ScheduleStatus';

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

  const previousMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col py-4 sm:py-6 px-2 sm:px-4 md:px-6">
      <Calendar
        currentDate={currentDate}
        tasks={tasks}
        days={days}
        onPreviousMonth={previousMonth}
        onNextMonth={nextMonth}
        onSelectTask={handleSelectTask}
      />

      <ScheduleStatus tasks={tasks} />

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