import { UserBrief } from "@/types/User";
import Image from "next/image";
import { useProject } from "@/contexts/ProjectContext";
import { Check } from "flowbite-react-icons/outline";
import { getStatusInfo } from "@/utils/getStatusColor";
import Badge, { BadgeColor } from "@/components/ui/Badge";

interface AssigneeSelectProps {
  selectedAssignee: number[];
  assignee: UserBrief[];
  toggleAssignee: (memberId: number) => void;
  isAssigned: (memberId: number) => boolean;
  className?: string;
  label?: string;
}

export default function AssigneeSelect({
  selectedAssignee,
  assignee,
  toggleAssignee,
  isAssigned,
  className,
  label
}: AssigneeSelectProps) {
  const { project } = useProject();

  const getRoleInfo = (assignee_id: number): { text: string; color: BadgeColor } => {
    if (project?.members.find((member) => member.user.id === assignee_id)?.is_leader) {
      return {
        text: "리더",
        color: "yellow"
      } as const;
    }
    if (project?.members.find((member) => member.user.id === assignee_id)?.is_manager) {
      return {
        text: "관리자",
        color: "blue"
      } as const;
    }
    return {
      text: "멤버",
      color: "gray"
    };
  };

  const getWorkloadColor = (workload: number): BadgeColor => {
    if (workload <= 2) return "green"
    if (workload <= 4) return "yellow"
    return "red"
  }

  const getWorkloadText = (workload: number) => {
    if (workload <= 2) return "여유"
    if (workload <= 4) return "보통"
    return "바쁨"
  }

  return (
    <div className={className}>
      <div className="mb-3">
        <p className="text-sm text-text-secondary">
          {label} : {selectedAssignee.length > 0 ? `${selectedAssignee.length}명` : "없음"}
        </p>
      </div>
      <div className={`grid ${assignee.length >= 2 ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
        {assignee.map((member) => {
          const roleInfo = getRoleInfo(member.id);
          const statusInfo = getStatusInfo(member.status);

          return (
            <div
              key={member.id}
              onClick={() => toggleAssignee(member.id)}
              className={`flex flex-col items-center gap-1 border border-component-border relative
            p-4 rounded-md cursor-pointer justify-center hover:bg-point-color-indigo/20 hover:border-point-color-indigo transition-all
            ${isAssigned(member.id) ? "bg-point-color-indigo/20 border-point-color-indigo" : ""}
            `}
            >
              {selectedAssignee.includes(member.id) && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-point-color-indigo rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="relative w-full">
                <Badge
                  className="absolute left-0 flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm font-medium border"
                  color={roleInfo.color}
                  content={roleInfo.text}
                />
                <div className="flex justify-center items-center">
                  <div className="relative">
                    <Image
                      src={member.profile_image || ""}
                      alt={member.name || ""}
                      width={60}
                      height={60}
                      className={`rounded-full ring-2 ${statusInfo.ringColor} ring-offset-2`}
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-4 h-4 ${statusInfo.indicator} rounded-full border-2 border-white`}
                      title={statusInfo.label}
                    ></span>
                  </div>
                </div>
              </div>
              <span className="text-text-primary">{member.name}</span>
              <span className="text-text-secondary text-sm">{member.role}</span>
              <Badge
                className="!px-2 !py-1 !rounded-full !text-xs !font-medium"
                color={getWorkloadColor(project?.tasks.filter((task) => task.assignees.some((assignee) => assignee.id === member.id)).length || 0)}
                content={`${getWorkloadText(project?.tasks.filter((task) => task.assignees.some((assignee) => assignee.id === member.id)).length || 0)} (${project?.tasks.filter((task) => task.assignees.some((assignee) => assignee.id === member.id)).length || 0}개 작업)`}
              />
            </div>
          )
        })}
      </div>
    </div>
  );
}