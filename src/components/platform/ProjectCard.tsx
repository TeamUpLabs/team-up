import { Project } from "@/types/Project";
import Link from "next/link";
import { useAuthStore } from "@/auth/authStore";
import { sendParticipationRequest, cancelParticipationRequest } from "@/hooks/getMemberData";
import Badge from "@/components/ui/Badge";
import { useTheme } from "@/contexts/ThemeContext";
import { Clock, Users } from "flowbite-react-icons/outline";

interface ProjectCardProps {
  project: Project;
  isExplore?: boolean;
}

export default function ProjectCard({ project, isExplore }: ProjectCardProps) {
  const { isDark } = useTheme();
  const user = useAuthStore((state) => state.user);
    
  const statusColor = project.status === "planning" ? "indigo" : project.status === "in_progress" ? "blue" : project.status === "completed" ? "green" : "gray";
  const statusLabel = project.status === "planning" ? "모집중" : project.status === "in_progress" ? "진행중" : project.status === "completed" ? "완료" : "보류";
  return (
    <div
      className="bg-component-background rounded-lg p-8
     border border-component-border hover:translate-y-[-4px] hover:shadow-lg
     transition-all duration-200 space-y-6"
    >
      <div className="flex items-center justify-between">
        <Badge
          content={
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {statusLabel}
            </span>
          }
          color={statusColor}
          isDark={isDark}
          className="!text-xs !rounded-full"
        />
        <div className="flex items-center gap-1 text-sm text-text-secondary">
          <Users className="w-4 h-4" />
          <span className="">{project.members.length || 0}/{project.team_size}명</span>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">{project.title}</h3>
        <p className="text-text-secondary text-base line-clamp-2 min-h-[3rem]">{project.description}</p>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center">
          <span className="mr-2">필요한 역할</span>
          <span className="h-px flex-grow bg-component-border"></span>
        </h4>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {project.tags.slice(0, 3).map((tag, index) => (
            <Badge
              key={index}
              content={tag}
              color="purple"
              isDark={isDark}
              className="!text-xs !rounded-full"
            />
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs text-text-secondary">+{project.tags.length - 3}</span>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        {isExplore ? (
          project.participation_requests && project.participation_requests.some(request => request.user_id === user?.id && request.status === "pending") ? (
            <button
              onClick={() => {
                if (!user) {
                  useAuthStore.getState().setAlert("로그인이 필요합니다.", "error");
                  return;
                }
                useAuthStore.getState().setConfirm("참여 요청을 취소하시겠습니까?", async () => {
                  try {
                    await cancelParticipationRequest(project.id, user.id);
                    useAuthStore.getState().setAlert("참여 요청이 취소되었습니다.", "success");
                    useAuthStore.getState().clearConfirm();
                    window.location.reload();
                  } catch (error) {
                    console.error("Error updating project member:", error);
                    useAuthStore.getState().setAlert("참여 요청 취소에 실패했습니다.", "error");
                  }
                });
              }}
              className="text-sm text-point-color-indigo hover:text-point-color-indigo-hover hover:underline"
            > 참여 요청 취소 </button>
          ) : (
            <button
              onClick={() => {
                if (!user) {
                  useAuthStore.getState().setAlert("로그인이 필요합니다.", "error");
                  return;
                }
                if (project.members.length >= project.team_size) {
                  useAuthStore.getState().setAlert("모집 인원이 다 찼습니다. 다른 프로젝트를 찾아보세요.", "error");
                  return;
                }
                useAuthStore.getState().setConfirm("참여 요청하시겠습니까?", async () => {
                  try {
                    await sendParticipationRequest(project.id, user.id);
                    useAuthStore.getState().setAlert("참여 요청이 완료되었습니다.", "success");
                    useAuthStore.getState().clearConfirm();
                    window.location.reload();
                  } catch (error) {
                    console.error("Error updating project member:", error);
                    useAuthStore.getState().setAlert("참여 요청에 실패했습니다.", "error");
                  }
                });
              }}
              className="text-sm text-point-color-indigo hover:text-point-color-indigo-hover hover:underline"
            >
              참여 요청하기
            </button>
          )
        ) : (
          <Link href={`/platform/${project.id}`} className="text-sm text-point-color-indigo hover:text-point-color-indigo-hover hover:underline">
            참여하기
          </Link>
        )}
      </div>
    </div>
  )
}
