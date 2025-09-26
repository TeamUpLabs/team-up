import { Project } from "@/types/Project";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faXmark,
  faTrash,
  faUserGroup,
  faShield,
} from "@fortawesome/free-solid-svg-icons";
import { Users } from "lucide-react";
import { ProjectMember } from "@/types/Project";
import { ParticipationRequest } from "@/types/ParticipationRequest";
import PermissionChangeModal from "@/components/project/setting/PermissionChangeModal";
import {
  allowParticipationRequest,
  rejectParticipationRequest,
  kickOutMemberFromProject,
} from "@/hooks/getProjectData";
import { useAuthStore } from "@/auth/authStore";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";
import { convertRoleName } from "@/utils/ConvertRoleName";
import { AdditionalData } from "@/contexts/ProjectContext";
import { useUser } from "@/contexts/UserContext";

interface TeamSettingTabProps {
  project: Project;
  additional_data: AdditionalData;
}

export default function TeamSettingTab({ project, additional_data }: TeamSettingTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showJoinRequests, setShowJoinRequests] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ProjectMember | null>(null);
  const [isCurrentUserLeaderOrManager, setIsCurrentUserLeaderOrManager] = useState(false);
  const { user } = useUser();

  // Check if current user is leader or manager
  useEffect(() => {
    if (user && project && project.members.some((member) => member.user.id === user.id)) {
      const isLeader = project.members.some((member) => member.user.id === user.id && member.role === "leader");
      const isManager =
        Array.isArray(project.members) &&
        project.members.some((member) => member.user.id === user.id && member.role === "manager");
      setIsCurrentUserLeaderOrManager(isLeader || isManager);
    }
  }, [user, project]);

  const filteredMembers = (project?.members || [])
    .filter(
      (member) =>
        member.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Leader has highest priority
      if (a.user.id === project.members.find((member) => member.role === "leader")?.user.id) return -1;
      if (b.user.id === project.members.find((member) => member.role === "leader")?.user.id) return 1;

      // Managers have second priority
      const aIsManager =
        Array.isArray(project.members) &&
        project.members.some((member) => member.user.id === a.user.id && member.role === "manager");
      const bIsManager =
        Array.isArray(project.members) &&
        project.members.some((member) => member.user.id === b.user.id && member.role === "manager");

      if (aIsManager && !bIsManager) return -1;
      if (!aIsManager && bIsManager) return 1;

      // Otherwise sort by name
      return a.user.name.localeCompare(b.user.name);
    });

  // Role descriptions for tooltip
  const roleDescriptions = {
    leader: "프로젝트 생성자. 모든 설정 및 관리 권한 보유",
    manager: "프로젝트 설정 변경, 멤버 관리, 모든 작업 수정 가능",
    member: "작업 확인 및 할당된 작업 수정 가능",
    default: "기본 권한, 작업 확인만 가능",
  };

  const openRoleModal = (member: ProjectMember) => {
    setSelectedMember(member);
    setShowRoleModal(true);
  };

  const handleKickOutMember = (member: ProjectMember) => {
    try {
      useAuthStore.getState().setConfirm("정말로 이 팀원을 퇴출하시겠습니까?", async () => {
          await kickOutMemberFromProject(project.id, member.user.id);
          useAuthStore.getState().setAlert(`${member.user.name}님이 퇴출되었습니다.`, "success");
          useAuthStore.getState().clearConfirm();
        });
    } catch (error) {
      useAuthStore.getState().setAlert("팀원 퇴출에 실패했습니다.", "error");
      console.error("Error deleting project member:", error);
    }
  };

  const handleApproveRequest = async (request: ParticipationRequest) => {
    if (!isCurrentUserLeaderOrManager) {
      useAuthStore.getState().setAlert("권한이 없습니다.", "error");
      return;
    }
    try {
      useAuthStore.getState().setConfirm(`${request.user.name}님의 참여 요청을 승인하시겠습니까?`, async () => {
          if (project.members.length >= project.team_size) {
            useAuthStore.getState()
              .setAlert(
                "팀 인원이 다 찼습니다. 팀 규모를 늘리거나 팀원을 추방해주세요.",
                "error"
              );
            return;
          }
          await allowParticipationRequest(project.id, request.id);
          useAuthStore.getState().setAlert(`${request.user.name}님의 참여 요청이 승인되었습니다.`, "success");
          useAuthStore.getState().clearConfirm();
        });
    } catch (error) {
      useAuthStore.getState().setAlert("참여 요청 승인에 실패했습니다.", "error");
      console.error("Error approving participation request:", error);
    }
  };

  const handleRejectRequest = async (request: ParticipationRequest) => {
    if (!isCurrentUserLeaderOrManager) {
      useAuthStore.getState().setAlert("권한이 없습니다.", "error");
      return;
    }
    try {
      useAuthStore.getState().setConfirm(`${request.user.name}님의 참여 요청을 거절하시겠습니까?`, async () => {
          await rejectParticipationRequest(project.id, request.id);
          useAuthStore.getState().setAlert(`${request.user.name}님의 참여 요청이 거절되었습니다.`, "info");
          useAuthStore.getState().clearConfirm();
        });
    } catch (error) {
      useAuthStore.getState().setAlert("참여 요청 거절에 실패했습니다.", "error");
      console.error("Error rejecting participation request:", error);
    }
  };

  return (
    <div className="bg-component-background border border-component-border rounded-xl overflow-hidden">
      <h2 className="text-lg font-semibold text-text-primary border-b border-component-border px-6 py-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-400" />
        팀 관리
      </h2>

      <div className="p-6 space-y-6">
        {/* Join Requests Section */}
        {additional_data.participation_requests &&
          additional_data.participation_requests.filter((request: ParticipationRequest) => request.status === "pending").length > 0 && (
            <div className="rounded-lg border border-component-border overflow-hidden">
              <div className="bg-component-tertiary-background px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUserGroup} className="text-blue-400" />
                  <h3 className="font-medium text-text-primary">참여 요청</h3>
                  <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                    {additional_data.participation_requests.filter((request: ParticipationRequest) => request.status === "pending").length}
                  </span>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-200 text-sm transition-colors"
                  onClick={() => setShowJoinRequests(!showJoinRequests)}
                >
                  {showJoinRequests ? "숨기기" : "보기"}
                </button>
              </div>

              {showJoinRequests && (
                <div className="divide-y divide-component-border">
                  {additional_data.participation_requests &&
                    additional_data.participation_requests.filter((request: ParticipationRequest) => request.status === "pending").map((request: ParticipationRequest) => (
                      <div
                        key={request.id}
                        className="px-4 py-3 bg-component-secondary-background hover:bg-component-secondary-background/60 transition-colors"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 relative bg-component-tertiary-background rounded-full flex items-center justify-center text-text-secondary">
                              {request.user.profile_image ? (
                                <Image
                                  src={request.user.profile_image || ""}
                                  alt="Profile"
                                  className="w-full h-full object-fit rounded-full"
                                  quality={100}
                                  width={32}
                                  height={32}
                                />
                              ) : (
                                <p>{request.user.name.charAt(0)}</p>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-text-primary font-medium">
                                  {request.user.name}
                                </p>
                                <span className="bg-component-tertiary-background text-text-secondary text-xs px-2 py-0.5 rounded-md">
                                  {request.user.role}
                                </span>
                              </div>
                              <p className="text-text-secondary text-xs">
                                {request.user.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition-colors"
                              onClick={() =>
                                handleApproveRequest(request)
                              }
                            >
                              <FontAwesomeIcon icon={faCheck} className="mr-1.5" />
                              승인
                            </button>
                            <button
                              className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1.5 rounded text-sm transition-colors"
                              onClick={() =>
                                handleRejectRequest(request)
                              }
                            >
                              <FontAwesomeIcon icon={faXmark} className="mr-1.5" />
                              거절
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

        {/* Team Members Section */}
        <div className="rounded-lg border border-component-border overflow-hidden">
          <div className="bg-component-tertiary-background px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faShield} className="text-yellow-400" />
              <h3 className="font-medium text-text-primary">팀원 관리</h3>
            </div>
            <Input
              placeholder="팀원 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="!text-sm !py-1.5"
              startAdornment={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>

          <div className="divide-y divide-component-border">
            {filteredMembers &&
              filteredMembers?.map((member) => (
                <div
                  key={member.user.id}
                  className="px-4 py-3 bg-component-secondary-background hover:bg-component-secondary-background/60 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative border border-component-border bg-component-tertiary-background rounded-full flex items-center justify-center text-text-secondary">
                        {member.user.profile_image ? (
                          <Image
                            src={member.user.profile_image}
                            alt="Profile"
                            className="w-full h-full object-fit rounded-full"
                            quality={100}
                            width={32}
                            height={32}
                            onError={(e) => {
                              e.currentTarget.src = "/DefaultProfile.jpg";
                            }}
                          />
                        ) : (
                          <p>{member.user.name.charAt(0)}</p>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-text-primary font-medium">
                            {member.user.name}
                          </p>
                          {member.role === "leader" ? (
                            <Badge
                              content="프로젝트 리더"
                              color="yellow"
                              className="!text-xs !px-2 !py-0.5"
                            />
                          ) : member.role === "manager" ? (
                            <Badge
                              content="관리자"
                              color="blue"
                              className="!text-xs !px-2 !py-0.5"
                            />
                          ) : (
                            <Badge
                              content="멤버"
                              color="green"
                              className="!text-xs !px-2 !py-0.5"
                            />
                          )}
                          <Badge
                            content={convertRoleName(member.user.role)}
                            color="cyan"
                            className="!text-xs !px-2 !py-0.5"
                          />
                        </div>
                        <p className="text-text-secondary text-xs">
                          {member.user.email || "이메일 없음"}
                        </p>
                      </div>
                    </div>
                    {isCurrentUserLeaderOrManager &&
                      member.role != "leader" && (
                        <div className="flex items-center gap-2">
                          <button
                            className="bg-component-secondary-background hover:bg-component-secondary-background/80 text-text-primary rounded px-3 py-1.5 text-sm transition-colors border border-component-border cursor-pointer"
                            onClick={() => openRoleModal(member)}
                          >
                            권한 변경
                          </button>
                          <button
                            className="text-text-secondary hover:text-red-400 p-2 rounded transition-colors cursor-pointer"
                            onClick={() => handleKickOutMember(member)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Role Explanation */}
        <div className="bg-component-secondary-background rounded-lg p-4 border border-component-border mt-6">
          <h4 className="text-text-primary font-medium mb-3 pb-2 border-b border-component-border">
            역할 및 권한 설명
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center">
              <span className="inline-block w-20 text-yellow-500 font-medium">
                리더:
              </span>
              <span className="text-text-secondary">
                {roleDescriptions.leader}
              </span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-20 text-blue-500 font-medium">
                관리자:
              </span>
              <span className="text-text-secondary">
                {roleDescriptions.manager}
              </span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-20 text-green-500 font-medium">
                멤버:
              </span>
              <span className="text-text-secondary">
                {roleDescriptions.member}
              </span>
            </div>
          </div>
        </div>

        {/* Role Change Modal */}
        {showRoleModal && selectedMember && (
          <PermissionChangeModal
            selectedMember={selectedMember}
            isOpen={showRoleModal}
            onClose={() => setShowRoleModal(false)}
            setShowRoleModal={setShowRoleModal}
            roleDescriptions={roleDescriptions}
            project={project}
          />
        )}
      </div>
    </div>
  );
}
