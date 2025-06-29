'use client';

import { useState, useEffect } from 'react';
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
import { Schedule } from '@/types/Schedule';
import ScheduleModal from '@/components/project/calendar/ScheduleModal';
import Badge from '@/components/ui/Badge';
import { useTheme } from '@/contexts/ThemeContext';

export default function CalendarPage() {
  const { project } = useProject();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { isDark } = useTheme();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 일요일 시작
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const previousMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));

  useEffect(() => {
    const selectedScheduleId = localStorage.getItem('selectedScheduleId');

    if (selectedScheduleId && project?.schedules?.length) {
      const scheduleToOpen = project?.schedules?.find(schedule => schedule.id === parseInt(selectedScheduleId));

      if (scheduleToOpen) {
        setSelectedSchedule(scheduleToOpen);
        setIsModalOpen(true);
      }

      localStorage.removeItem('selectedScheduleId');
    }
  }, [project?.schedules]);

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSelectSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex active:scale-95"
        >
          <Badge
            content={
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
                <span>일정 추가</span>
              </div>
            }
            color={isDark ? 'white' : 'black'}
            isDark={isDark}
            className="!px-4 !py-2 !font-semibold"
          />
        </button>
      </div>

      <Calendar
        currentDate={currentDate}
        tasks={project?.tasks}
        meetings={project?.schedules.filter(schedule => schedule.type === 'meeting')}
        events={project?.schedules.filter(schedule => schedule.type === 'event')}
        days={days}
        onPreviousMonth={previousMonth}
        onNextMonth={nextMonth}
        onSelectTask={handleSelectTask}
        onSelectSchedule={handleSelectSchedule}
      />

      <ScheduleStatus
        tasks={project?.tasks}
        meetings={project?.schedules.filter(schedule => schedule.type === 'meeting')}
        events={project?.schedules.filter(schedule => schedule.type === 'event')}
      />

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

      {selectedSchedule && (
        <ScheduleModal
          schedule={selectedSchedule}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSchedule(null);
          }}
        />
      )}
    </div>
  );
}