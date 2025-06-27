import { Project } from "@/types/Project";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import { useRouter } from "next/navigation";

interface Activity {
  id: number;
  user: {
    name: string;
    email?: string;
    image?: string;
    isActive?: string;
  };
  type: 'task' | 'milestone' | 'project';
  action: string;
  timestamp: Date;
  link?: string;
}

interface RecentActivityProps {
  project: Project;
}

const getActivityTypeLabel = (type: string) => {
  switch (type) {
    case 'task': return '작업';
    case 'milestone': return '마일스톤';
    case 'project': return '프로젝트';
    default: return type;
  }
};

export default function RecentActivity({ project }: RecentActivityProps) {
  const router = useRouter();

  const handleMilestoneClick = (milestoneId: number) => {
    localStorage.setItem("selectedMilestoneId", milestoneId.toString());
    router.push(`/platform/${project?.id}/milestone`);
  };

  const handleTaskClick = (taskId: number) => {
    localStorage.setItem("selectedTaskId", taskId.toString());
    router.push(`/platform/${project?.id}/tasks`);
  };
  // Generate sample activities from project data
  const activities: Activity[] = [
    ...(project.tasks?.map(task => ({
      id: task.id,
      user: {
        name: project?.members?.find(member => member.id === task.createdBy)?.name || '담당자 없음',
        email: project?.members?.find(member => member.id === task.createdBy)?.email || '이메일 없음',
        image: project?.members?.find(member => member.id === task.createdBy)?.profileImage || '프로필 이미지 없음',
        isActive: project?.members?.find(member => member.id === task.createdBy)?.status || '활동 없음',
      },
      type: 'task' as const,
      action: `"${task.title}" 작업을 ${task.status === 'done' ? '완료했습니다' : '시작했습니다'}`,
      timestamp: new Date(task.updatedAt || task.createdAt)
    })) || []),
    ...(project.milestones?.map(milestone => {
      return {
        id: milestone.id,
        user: {
          name: project?.members?.find(member => member.id === milestone.createdBy)?.name || '담당자 없음',
          email: project?.members?.find(member => member.id === milestone.createdBy)?.email || '이메일 없음',
          image: project?.members?.find(member => member.id === milestone.createdBy)?.profileImage || '프로필 이미지 없음',
          isActive: project?.members?.find(member => member.id === milestone.createdBy)?.status || '활동 없음',
        },
        type: 'milestone' as const,
        action: `"${milestone.title}" 마일스톤을 ${milestone.status === 'done' ? '달성했습니다' : '시작했습니다'}`,
        timestamp: new Date(milestone.updatedAt || milestone.createdAt)
      };
    }) || [])
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5);

  const getUserInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="bg-component-background shadow-sm p-6 rounded-md border border-component-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-text-primary text-base font-semibold">최근 활동</h2>
      </div>
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              onClick={() => {
                if (activity.type === 'task') {
                  handleTaskClick(activity.id);
                } else if (activity.type === 'milestone') {
                  handleMilestoneClick(activity.id);
                }
              }}
              key={activity.id}
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-component-tertiary-background transition-all duration-200 cursor-pointer"
            >
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {activity.user.image ? (
                    <Image
                      src={activity.user.image}
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
                <div className="flex items-baseline justify-between">
                  <div className="flex gap-1">
                    <span className="text-sm font-medium text-text-primary truncate">
                      {activity.user.name}님이
                    </span>
                    <p className="text-sm text-text-primary">
                      {activity.action}
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
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-text-tertiary text-center py-4">
            최근 활동이 없습니다
          </p>
        )}
      </div>
    </div>
  );
}