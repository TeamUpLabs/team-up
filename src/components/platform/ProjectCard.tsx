import { Project } from "@/types/Project";
import Link from "next/link";
import { useAuthStore } from "@/auth/authStore";
import { sendParticipationRequest, cancelParticipationRequest } from "@/hooks/getMemberData";
import Badge from "@/components/Badge";
interface ProjectCardProps {
  project: Project;
  isExplore?: boolean;
}

export default function ProjectCard({ project, isExplore }: ProjectCardProps) {
  const user = useAuthStore((state) => state.user);

  console.log(project.participationRequestMembers);
  return (
    <div className="bg-component-background rounded-lg shadow-md p-6 border border-component-border hover:border-point-color-indigo transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{project.title}</h3>
        <div className="space-x-3">
          <span className="text-sm text-text-secondary">{project.members.length}/{project.teamSize}명</span>
          <span className="text-sm text-point-color-green">{project.status}</span>
        </div>
      </div>
      <p className="text-text-secondary mb-4 line-clamp-2 min-h-[3rem]">{project.description}</p>
      <div className="flex items-center space-x-2 mb-4">
        {project.roles.map((role, index) => (
          <Badge key={index} content={role} color="purple" />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {
            project.members.slice(0, 2).map((member => (
              <div key={member.id} className="w-8 h-8 rounded-full bg-component-secondary-background border-2 border-component-border text-sm flex align-center justify-center place-items-center">
                {member.name.charAt(0)}
              </div>
            )))
          }
          {project.members.length > 2 && (
            <div className="w-8 h-8 rounded-full bg-component-secondary-background border-2 border-component-border text-sm flex align-center justify-center place-items-center">
              +{project.members.length - 2}
            </div>
          )}
        </div>
        {isExplore ? (
          project.participationRequestMembers && project.participationRequestMembers.some(member => member.id === user?.id) ? (
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
              className="text-sm text-point-color-indigo hover:text-point-color-indigo-hover"
            > 참여 요청 취소 </button>
          ) : (
            <button
              onClick={() => {
                if (!user) {
                  useAuthStore.getState().setAlert("로그인이 필요합니다.", "error");
                  return;
                }
                if (project.members.length >= project.teamSize) {
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
              className="text-sm text-point-color-indigo hover:text-point-color-indigo-hover"
            >
              참여 요청하기
            </button>
          )
        ) : (
          <Link href={`/platform/${project.id}`} className="text-sm text-point-color-indigo hover:text-point-color-indigo-hover">
            참여하기
          </Link>
        )}
      </div>
    </div>
  )
}