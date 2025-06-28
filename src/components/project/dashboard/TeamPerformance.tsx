import { Project } from "@/types/Project";
import Image from "next/image";

interface TeamPerformanceProps {
  project: Project;
  isLoading?: boolean;
  className?: string;
}

export default function TeamPerformance({ project, isLoading = false, className }: TeamPerformanceProps) {
  const getUserInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const skeleton = () => {
    return (
      <div className="flex items-center gap-10 justify-between">
        <div className="flex flex-2 items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden animate-pulse"></div>
          <div className="flex flex-col gap-1">
            <div className="h-4 w-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-2">
          <div className="h-2 bg-gray-100 rounded-full flex-1 overflow-hidden animate-pulse">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '0%' }} />
          </div>
          <span className="text-xs font-medium text-text-secondary animate-pulse">0%</span>
        </div>
      </div>
    )
  }


  return (
    <div className={`${className} bg-component-background shadow-sm p-6 rounded-md border border-component-border`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-text-primary text-base font-semibold">팀 성과</h2>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          skeleton()
        ) :
          project.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-10 justify-between">
              <div className="flex flex-2 items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {member.profileImage ? (
                    <Image
                      src={member.profileImage}
                      alt={member.name}
                      className="w-full h-full object-cover border border-component-border rounded-full"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <span className="text-xs text-gray-700">
                      {getUserInitials(member.name)}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="text-text-primary font-semibold text-sm">{member.name}</p>
                  <span className="text-text-secondary text-xs">
                    {project.tasks?.filter(task =>
                      Array.isArray(task.assignee_id)
                        ? task.assignee_id.includes(member.id)
                        : task.assignee_id === member.id
                    ).filter(task => task.status === "done").length || 0} {" "}
                    tasks completed
                  </span>
                </div>
              </div>

              <div className="flex flex-1 items-center gap-2">
                <div className="h-2 bg-gray-100 rounded-full flex-1 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${(project.tasks?.filter(task =>
                        (Array.isArray(task.assignee_id)
                          ? task.assignee_id.includes(member.id)
                          : task.assignee_id === member.id) && task.status === 'done'
                      ).length / (project.tasks?.filter(task =>
                        Array.isArray(task.assignee_id)
                          ? task.assignee_id.includes(member.id)
                          : task.assignee_id === member.id
                      ).length || 1) * 100) || 0}%`
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-text-secondary">
                  {Math.round((project.tasks?.filter(task =>
                    (Array.isArray(task.assignee_id)
                      ? task.assignee_id.includes(member.id)
                      : task.assignee_id === member.id) && task.status === 'done'
                  ).length / (project.tasks?.filter(task =>
                    Array.isArray(task.assignee_id)
                      ? task.assignee_id.includes(member.id)
                      : task.assignee_id === member.id
                  ).length || 1) * 100) || 0)}%
                </span>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}