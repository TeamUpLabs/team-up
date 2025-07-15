import { Project } from "@/types/Project";
import Image from "next/image";
import MemberDetailModal from "@/components/project/members/MemberDetailModal";
import { useState } from "react";
import { AuthUser } from "@/types/AuthUser";
import { User } from "@/types/User";

interface TeamPerformanceProps {
  project: Project;
  isLoading?: boolean;
  className?: string;
}

export default function TeamPerformance({ project, isLoading = false, className }: TeamPerformanceProps) {
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<AuthUser | null>(null);

  const getUserInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleModalOpen = (member: AuthUser) => {
    setSelectedMember(member);
    setIsMemberModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsMemberModalOpen(false);
    setSelectedMember(null);
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
      <div className="divide-y divide-component-border max-h-[300px] overflow-y-auto">
        {isLoading ? (
          skeleton()
        ) :
          project.members?.map((member, index) => {
            const isFirst = index === 0;
            const isLast = index === project.members?.length - 1;

            return (
              <div
                key={member.user.id}
                onClick={() => handleModalOpen(member.user)}
                className={`flex items-center gap-10 p-3 ${isFirst ? "rounded-t-md" : ""} ${isLast ? "rounded-b-md" : ""} justify-between hover:bg-component-tertiary-background transition-all duration-200 cursor-pointer`}
              >
                <div className="flex flex-2 items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {member.user.profile_image ? (
                      <Image
                        src={member.user.profile_image}
                        alt={member.user.name}
                        className="w-full h-full object-cover border border-component-border rounded-full"
                        width={24}
                        height={24}
                      />
                    ) : (
                      <span className="text-xs text-gray-700">
                        {getUserInitials(member.user.name)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-text-primary font-semibold text-sm">{member.user.name}</p>
                    <span className="text-text-secondary text-xs">
                      {project.tasks?.filter(task =>
                        task.assignees.some(assignee => assignee.id === member.user.id)
                      ).filter(task => task.status === "completed").length || 0} {" "}
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
                          task.assignees.some(assignee => assignee.id === member.user.id) && task.status === 'completed'
                        ).length / (project.tasks?.filter(task =>
                          task.assignees.some(assignee => assignee.id === member.user.id)
                        ).length || 1) * 100) || 0}%`
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-text-secondary">
                    {Math.round((project.tasks?.filter(task =>
                      task.assignees.some(assignee => assignee.id === member.user.id) && task.status === 'completed'
                    ).length / (project.tasks?.filter(task =>
                      task.assignees.some(assignee => assignee.id === member.user.id)
                    ).length || 1) * 100) || 0)}%
                  </span>
                </div>
              </div>
            )
          }
          )}
      </div>

      {/* Member Modal */}
      {isMemberModalOpen && selectedMember && (
        <MemberDetailModal
          member={selectedMember as User}
          isOpen={isMemberModalOpen}
          onClose={handleCloseModal}
          isLeader={
            project?.members.some((member) => member.user.id === selectedMember.id && member.is_leader) ||
            project?.owner.id === selectedMember.id
          }
          isManager={
            project?.members.some((member) => member.user.id === selectedMember.id && member.is_manager) ||
            false
          }
        />
      )}
    </div>
  );
}