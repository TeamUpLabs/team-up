
import { Project } from "@/types/Project";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { getStatusColorName } from "@/utils/getStatusColor";
import { useState } from "react";
import TaskModal from "@/components/project/task/TaskModal";
import MilestoneModal from "@/components/project/milestone/MilestoneModal";
import ScheduleModal from "@/components/project/calendar/ScheduleModal";
import { Task } from "@/types/Task";
import { MileStone } from "@/types/MileStone";
import { Schedule } from "@/types/Schedule";
import { isMarkdown } from "@/utils/isMarkdown";
import { summarizeMarkdown } from "@/utils/summarizeMarkdown";

interface Activity {
  id: string;
  user: {
    name: string;
    email?: string;
    image?: string;
    isActive?: string;
  };
  title: string;
  status: string;
  description: string;
  type: 'task' | 'milestone' | 'meeting' | 'event';
  timestamp: Date;
}
interface UpcommingDeadlineProps {
  project: Project;
  isLoading?: boolean;
}

const skeleton = () => {
  return (
    <div className="flex items-center gap-10 justify-between">
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1">
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="h-4 w-15 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-15 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  )
}

export default function UpcommingDeadline({ project, isLoading = false }: UpcommingDeadlineProps) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Task | MileStone | Schedule | null>(null);

  // Generate sample activities from project data
  const activities: Activity[] = [
    ...(project.tasks?.map(task => ({
      id: `task-${task.id}`,
      user: {
        name: project?.members?.find(member => member.id === task.createdBy)?.name || '담당자 없음',
        email: project?.members?.find(member => member.id === task.createdBy)?.email || '이메일 없음',
        image: project?.members?.find(member => member.id === task.createdBy)?.profileImage || '프로필 이미지 없음',
        isActive: project?.members?.find(member => member.id === task.createdBy)?.status || '활동 없음',
      },
      type: 'task' as const,
      title: task.title,
      status: task.status,
      description: task.description,
      timestamp: new Date(task.endDate || "")
    })) || []),

    ...(project.milestones?.map(milestone => {
      return {
        id: `milestone-${milestone.id}`,
        user: {
          name: project?.members?.find(member => member.id === milestone.createdBy)?.name || '담당자 없음',
          email: project?.members?.find(member => member.id === milestone.createdBy)?.email || '이메일 없음',
          image: project?.members?.find(member => member.id === milestone.createdBy)?.profileImage || '프로필 이미지 없음',
          isActive: project?.members?.find(member => member.id === milestone.createdBy)?.status || '활동 없음',
        },
        type: 'milestone' as const,
        title: milestone.title,
        status: milestone.status,
        description: milestone.description,
        timestamp: new Date(milestone.endDate || "")
      };
    }) || []),

    ...(project.schedules?.filter(schedule => schedule.type === 'meeting').map(schedule => {
      return {
        id: `${schedule.type}-${schedule.id}`,
        user: {
          name: project?.members?.find(member => member.id === schedule.created_by)?.name || '담당자 없음',
          email: project?.members?.find(member => member.id === schedule.created_by)?.email || '이메일 없음',
          image: project?.members?.find(member => member.id === schedule.created_by)?.profileImage || '프로필 이미지 없음',
          isActive: project?.members?.find(member => member.id === schedule.created_by)?.status || '활동 없음',
        },
        type: 'meeting' as const,
        title: schedule.title,
        status: schedule.status,
        description: schedule.description,
        timestamp: new Date(schedule.end_time || "")
      };
    }) || []),

    ...(project.schedules?.filter(schedule => schedule.type === 'event').map(schedule => {
      return {
        id: `${schedule.type}-${schedule.id}`,
        user: {
          name: project?.members?.find(member => member.id === schedule.created_by)?.name || '담당자 없음',
          email: project?.members?.find(member => member.id === schedule.created_by)?.email || '이메일 없음',
          image: project?.members?.find(member => member.id === schedule.created_by)?.profileImage || '프로필 이미지 없음',
          isActive: project?.members?.find(member => member.id === schedule.created_by)?.status || '활동 없음',
        },
        type: 'event' as const,
        title: schedule.title,
        status: schedule.status,
        description: schedule.description,
        timestamp: new Date(schedule.end_time || "")
      };
    }) || []),
  ].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());


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
        <h2 className="text-text-primary text-base font-semibold">마감 임박</h2>
      </div>

      {/* Modals */}
      {isTaskModalOpen && selectedItem && 'title' in selectedItem && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={handleCloseModal}
          task={selectedItem as Task}
        />
      )}
      
      {isMilestoneModalOpen && selectedItem && 'title' in selectedItem && (
        <MilestoneModal
          isOpen={isMilestoneModalOpen}
          onClose={handleCloseModal}
          milestone={selectedItem as MileStone}
        />
      )}
      
      {isScheduleModalOpen && selectedItem && 'title' in selectedItem && (
        <ScheduleModal
          isOpen={isScheduleModalOpen}
          onClose={handleCloseModal}
          schedule={selectedItem as Schedule}
        />
      )}

      <div className="divide-y divide-component-border max-h-[300px] overflow-y-auto">
        {isLoading ? (
          skeleton()
        ) :
          activities.length > 0 ?
          activities.map((activity, index) => {
            const isFirst = index === 0;
            const isLast = index === activities.length - 1;
            return (
              <div 
                key={activity.id} 
                onClick={() => handleModalOpen(activity.type, activity.id)}
                className={`flex items-center justify-between gap-6 p-3 ${isFirst ? "rounded-t-md" : ""} ${isLast ? "rounded-b-md" : ""} hover:bg-component-tertiary-background transition-all duration-200 cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full bg-${getStatusColorName(activity.status)}-500`}></div>
                  <div className="flex flex-col">
                    <p className="text-text-primary text-base font-semibold">{activity.title}</p>
                    <span className="text-text-secondary text-sm line-clamp-1">
                      {
                        activity.description ? (isMarkdown(activity.description) ? summarizeMarkdown(activity.description) : activity.description || "설명이 없습니다.") : "설명이 없습니다."
                      }
                    </span>
                  </div>
                </div>

                <div className="flex flex-col flex-shrink-0 items-end">
                  <span className="text-text-secondary text-sm">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: ko })}
                  </span>
                  <span className="text-text-secondary text-xs">
                    Due {activity.timestamp.toLocaleDateString()}
                  </span>
                </div>
              </div>
            )
          })
          : (
            <p>마감 임박 활동이 없습니다.</p>
          )}
      </div>
    </div>
  );
}