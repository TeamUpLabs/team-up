import { Project } from "@/types/Project";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import TaskModal from "@/components/project/task/TaskModal";
import MilestoneModal from "@/components/project/milestone/MilestoneModal";
import ScheduleModal from "@/components/project/calendar/ScheduleModal";
import { Task } from "@/types/Task";
import { MileStone } from "@/types/MileStone";
import { Schedule } from "@/types/Schedule";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface Activity {
  id: string;
  user: {
    name: string;
    email?: string;
    profile_image?: string;
    isActive?: string;
  };
  type: 'task' | 'milestone' | 'meeting' | 'event';
  action: string;
  timestamp: Date;
  link?: string;
}

interface RecentActivityProps {
  project: Project;
  isLoading?: boolean;
}

const getActivityTypeLabel = (type: string) => {
  switch (type) {
    case 'task': return '작업';
    case 'milestone': return '마일스톤';
    case 'meeting': return '회의';
    case 'event': return '이벤트';
    default: return type;
  }
};

const skeleton = () => {
  return (
    <div className="flex items-center gap-10 justify-between">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden animate-pulse"></div>
        <div className="flex flex-col gap-1">
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="h-4 w-15 bg-gray-200 rounded animate-pulse"></div>
    </div>
  )
}

export default function RecentActivity({ project, isLoading = false }: RecentActivityProps) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Task | MileStone | Schedule | null>(null);
  const { isDark } = useTheme();

  // Generate sample activities from project data
  const activities: Activity[] = [
    ...(project.tasks?.map(task => ({
      id: `task-${task.id}`,
      user: {
        name: task.creator.name || '담당자 없음',
        email: task.creator.email || '이메일 없음',
        profile_image: task.creator.profile_image || '/DefaultProfile.jpg',
        isActive: task.creator.status || '활동 없음',
      },
      type: 'task' as const,
      action: `"${task.title}" 작업을 ${task.status === 'completed' ? '완료했습니다.' : '시작했습니다.'}`,
      timestamp: new Date(task.updated_at || task.created_at)
    })) || []),

    ...(project.milestones?.map(milestone => {
      return {
        id: `milestone-${milestone.id}`,
        user: {
          name: milestone.creator.name || '담당자 없음',
          email: milestone.creator.email || '이메일 없음',
          profile_image: milestone.creator.profile_image || '/DefaultProfile.jpg',
          isActive: milestone.creator.status || '활동 없음',
        },
        type: 'milestone' as const,
        action: `"${milestone.title}" 마일스톤을 ${milestone.status === 'completed' ? '달성했습니다.' : '시작했습니다.'}`,
        timestamp: new Date(milestone.updated_at || milestone.created_at)
      };
    }) || []),

    ...(project.schedules?.filter(schedule => schedule.type === 'meeting').map(schedule => {
      return {
        id: `${schedule.type}-${schedule.id}`,
        user: {
          name: schedule.creator.name || '담당자 없음',
          email: schedule.creator.email || '이메일 없음',
          profile_image: schedule.creator.profile_image || '/DefaultProfile.jpg',
          isActive: schedule.creator.status || '활동 없음',
        },
        type: 'meeting' as const,
        action: `"${schedule.title}" 회의를 ${schedule.status === 'completed' ? '참여했습니다.' : '시작했습니다.'}`,
        timestamp: new Date(schedule.updated_at || schedule.created_at)
      };
    }) || []),

    ...(project.schedules?.filter(schedule => schedule.type === 'event').map(schedule => {
      return {
        id: `${schedule.type}-${schedule.id}`,
        user: {
          name: schedule.creator.name || '담당자 없음',
          email: schedule.creator.email || '이메일 없음',
          profile_image: schedule.creator.profile_image || '/DefaultProfile.jpg',
          isActive: schedule.creator.status || '활동 없음',
        },
        type: 'event' as const,
        action: `"${schedule.title}" 이벤트를 ${schedule.status === 'completed' ? '참여했습니다.' : '시작했습니다.'}`,
        timestamp: new Date(schedule.updated_at || schedule.created_at)
      };
    }) || []),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const getUserInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleModalOpen = (type: string, id: string) => {
    const itemId = id.split('-')[1]; // Extract the ID from the activity ID

    if (type === 'task') {
      const task = project.tasks?.find(t => t.id.toString() === itemId);
      if (task) {
        setSelectedItem(task);
        setIsTaskModalOpen(true);
      }
    } else if (type === 'milestone') {
      const milestone = project.milestones?.find(m => m.id.toString() === itemId);
      if (milestone) {
        setSelectedItem(milestone);
        setIsMilestoneModalOpen(true);
      }
    } else if (type === 'meeting' || type === 'event') {
      const schedule = project.schedules?.find(s => s.id.toString() === itemId);
      if (schedule) {
        setSelectedItem(schedule);
        setIsScheduleModalOpen(true);
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setIsTaskModalOpen(false);
    setIsMilestoneModalOpen(false);
    setIsScheduleModalOpen(false);
  };

  return (
    <div className="bg-component-background shadow-sm p-6 rounded-md border border-component-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-text-primary text-base font-semibold">최근 활동</h2>
      </div>
      <div className="divide-y divide-component-border max-h-[300px] overflow-y-auto">
        {/* Task Modal */}
        {isTaskModalOpen && selectedItem && 'title' in selectedItem && (
          <TaskModal
            isOpen={isTaskModalOpen}
            onClose={handleCloseModal}
            task={selectedItem as Task}
          />
        )}

        {/* Milestone Modal */}
        {isMilestoneModalOpen && selectedItem && 'title' in selectedItem && (
          <MilestoneModal
            isOpen={isMilestoneModalOpen}
            onClose={handleCloseModal}
            milestone={selectedItem as MileStone}
          />
        )}

        {/* Schedule Modal */}
        {isScheduleModalOpen && selectedItem && 'title' in selectedItem && (
          <ScheduleModal
            isOpen={isScheduleModalOpen}
            onClose={handleCloseModal}
            schedule={selectedItem as Schedule}
          />
        )}

        {isLoading ? (
          skeleton()
        ) : (
          activities.length > 0 ? (
            activities.map((activity, index) => {
              const isFirst = index === 0;
              const isLast = index === activities.length - 1;
              return (
                <div
                  onClick={() => handleModalOpen(activity.type, activity.id)}
                  key={activity.id}
                  className={`flex items-center gap-3 p-3 ${isFirst ? "rounded-t-md" : ""} ${isLast ? "rounded-b-md" : ""} hover:bg-component-tertiary-background transition-all duration-200 cursor-pointer`}
                >
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {activity.user.profile_image ? (
                        <Image
                          src={activity.user.profile_image}
                          alt={activity.user.name}
                          className="w-full h-full object-cover border border-component-border rounded-full"
                          width={32}
                          height={32}
                        />
                      ) : (
                        <span className="text-xs text-gray-700">
                          {getUserInitials(activity.user.name)}
                        </span>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                      <div className={`w-3 h-3 ${activity.user.isActive ? "rounded-full bg-green-500" : "rounded-full bg-gray-500"}`}></div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-6 justify-between">
                      <div className="flex gap-1">
                        <p className="text-sm text-text-primary">
                          {activity.user.name}님이 {activity.action}
                        </p>
                      </div>
                      <span className="text-xs text-text-tertiary whitespace-nowrap ml-2">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: ko })}
                      </span>
                    </div>
                    <div className="mt-1">
                      <Badge
                        content={getActivityTypeLabel(activity.type)}
                        color="blue"
                        className="!text-xs !font-medium !px-2 !py-0.5 !rounded"
                        isDark={isDark}
                        fit
                      />
                    </div>
                  </div>
                </div>
              )
            })
          )
            : (
              <p className="text-sm text-text-tertiary text-center py-4">
                최근 활동이 없습니다
              </p>
            ))}
      </div>
    </div>
  );
}