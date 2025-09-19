'use client';

import { useState, useEffect, Suspense, lazy, useMemo } from 'react';
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
import { useProject } from "@/contexts/ProjectContext";
import { Schedule } from '@/types/Schedule';
import { MileStone } from '@/types/MileStone';
import Badge from '@/components/ui/Badge';
import { useTheme } from "@/contexts/ThemeContext";

// 지연 로딩을 위한 컴포넌트들
const TaskModal = lazy(() => import('@/components/project/task/TaskModal'));
const MilestoneModal = lazy(() => import('@/components/project/milestone/MilestoneModal'));
const Calendar = lazy(() => import('@/components/project/calendar/CalendarComponent'));
const ScheduleStatus = lazy(() => import('@/components/project/calendar/ScheduleStatus'));
const ScheduleCreateModal = lazy(() => import('@/components/project/calendar/ScheduleCreateModal'));
const ScheduleModal = lazy(() => import('@/components/project/calendar/ScheduleModal'));

// 로딩 컴포넌트
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
  </div>
);

// 스켈레톤 컴포넌트
const SkeletonCalendar = () => (
  <div className="bg-component-tertiary-background animate-pulse rounded-lg h-96"></div>
);

export default function CalendarPage() {
  const { additional_data } = useProject();
  const { isDark } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<MileStone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // 메모이제이션을 통한 날짜 계산 최적화
  const calendarData = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 일요일 시작
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return {
      monthStart,
      monthEnd,
      calendarStart,
      calendarEnd,
      days
    };
  }, [currentDate]);

  // 메모이제이션을 통한 일정 필터링 최적화
  const scheduleData = useMemo(() => {
    const meetings = additional_data.schedules?.filter(schedule => schedule.type === 'meeting') || [];
    const events = additional_data.schedules?.filter(schedule => schedule.type === 'event') || [];
    
    return {
      meetings,
      events
    };
  }, [additional_data.schedules]);

  const previousMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));

  useEffect(() => {
    const selectedScheduleId = localStorage.getItem('selectedScheduleId');

    if (selectedScheduleId && additional_data.schedules?.length) {
      const scheduleToOpen = additional_data.schedules?.find(schedule => schedule.id === parseInt(selectedScheduleId));

      if (scheduleToOpen) {
        setSelectedSchedule(scheduleToOpen);
        setIsModalOpen(true);
      }

      localStorage.removeItem('selectedScheduleId');
    }
  }, [additional_data.schedules]);

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSelectMilestone = (milestone: MileStone) => {
    setSelectedMilestone(milestone);
    setIsModalOpen(true);
  };

  const handleSelectSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
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
            className="!px-4 !py-2 !font-semibold"
          />
        </button>
      </div>

      <Suspense fallback={<SkeletonCalendar />}>
        <Calendar
          currentDate={currentDate}
          tasks={additional_data.tasks}
          milestones={additional_data.milestones}
          meetings={scheduleData.meetings}
          events={scheduleData.events}
          days={calendarData.days}
          onPreviousMonth={previousMonth}
          onNextMonth={nextMonth}
          onSelectTask={handleSelectTask}
          onSelectSchedule={handleSelectSchedule}
          onSelectMilestone={handleSelectMilestone}
        />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <ScheduleStatus
          tasks={additional_data.tasks}
          meetings={scheduleData.meetings}
          events={scheduleData.events}
          milestones={additional_data.milestones}
        />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        <ScheduleCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
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
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
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
      </Suspense>

      <Suspense fallback={<LoadingSpinner />}>
        {selectedMilestone && (
          <MilestoneModal
            milestone={selectedMilestone}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedMilestone(null);
            }}
          />
        )}
      </Suspense>
    </div>
  );
}