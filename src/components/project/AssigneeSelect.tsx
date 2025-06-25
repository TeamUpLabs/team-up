import { Member } from "@/types/Member";
import Image from "next/image";
import { useProject } from "@/contexts/ProjectContext";
import { Check } from "flowbite-react-icons/outline";
import { getStatusInfo } from "@/utils/getStatusColor";

interface AssigneeSelectProps {
  selectedAssignee: number[];
  assignee: Member[];
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

  const getRoleInfo = (assignee_id: number) => {
    if (project?.leader?.id === assignee_id) {
      return {
        text: "리더",
        className: "bg-yellow-100 text-yellow-700 border-yellow-200"
      };
    }
    if (project?.manager?.some((manager) => manager.id === assignee_id)) {
      return {
        text: "관리자",
        className: "bg-blue-100 text-blue-700 border-blue-200"
      };
    }
    return {
      text: "멤버",
      className: "bg-gray-100 text-gray-700 border-gray-200"
    };
  };

  const getWorkloadColor = (workload: number) => {
    if (workload <= 2) return "text-green-600 bg-green-100"
    if (workload <= 4) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
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
                <div className={`absolute left-0 flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm font-medium ${roleInfo.className} border`}>
                  <span className="text-sm">{roleInfo.text}</span>
                </div>
                <div className="flex justify-center items-center">
                  <div className="relative">
                    <Image
                      src={member.profileImage}
                      alt={member.name}
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
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getWorkloadColor(project?.tasks.filter((task) => task.assignee_id?.includes(member.id)).length || 0)}`}>
                {getWorkloadText(project?.tasks.filter((task) => task.assignee_id?.includes(member.id)).length || 0)} ({project?.tasks.filter((task) => task.assignee_id?.includes(member.id)).length || 0}개 작업)
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}