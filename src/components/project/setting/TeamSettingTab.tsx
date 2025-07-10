import { Project } from "@/types/Project";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faXmark,
  faTrash,
  faSearch,
  faUserGroup,
  faShield,
} from "@fortawesome/free-solid-svg-icons";
import { Users } from "lucide-react";
import { User } from "@/types/User";
import { ParticipationRequest } from "@/types/ParticipationRequest";
import PermissionChangeModal from "@/components/project/setting/PermissionChangeModal";
import {
  updateProjectMemberPermission,
  allowParticipationRequest,
  rejectParticipationRequest,
  kickOutMemberFromProject,
} from "@/hooks/getProjectData";
import { useAuthStore } from "@/auth/authStore";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import { useTheme } from "@/contexts/ThemeContext";

interface TeamSettingTabProps {
  project: Project;
}

export default function TeamSettingTab({ project }: TeamSettingTabProps) {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [showJoinRequests, setShowJoinRequests] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isCurrentUserLeaderOrManager, setIsCurrentUserLeaderOrManager] = useState(false);
  const { user } = useAuthStore();
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Check if current user is leader or manager
  useEffect(() => {
    if (user && project && project.members.some((member) => member.user.id === user.id)) {
      const isLeader = project.members.some((member) => member.user.id === user.id && member.is_leader);
      const isManager =
        Array.isArray(project.members) &&
        project.members.some((member) => member.user.id === user.id && member.is_manager);
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
      if (a.user.id === project.members.find((member) => member.is_leader)?.user.id) return -1;
      if (b.user.id === project.members.find((member) => member.is_leader)?.user.id) return 1;

      // Managers have second priority
      const aIsManager =
        Array.isArray(project.members) &&
        project.members.some((member) => member.user.id === a.user.id && member.is_manager);
      const bIsManager =
        Array.isArray(project.members) &&
        project.members.some((member) => member.user.id === b.user.id && member.is_manager);

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

  const openRoleModal = (member: User) => {
    setSelectedMember(member);
    setSelectedRole(
      project.members.find((member) => member.user.id === member.user.id && member.is_leader)
        ? "leader"
        : project.members.some((member) => member.user.id === member.user.id && member.is_manager)
        ? "manager"
        : "member"
    );
    setShowRoleModal(true);
  };

  const handlePermissionChange = async () => {
    if (selectedMember) {
      setSubmitStatus('submitting');
      try {
        await updateProjectMemberPermission(
          project.id,
          selectedMember.id,
          selectedRole
        );
        useAuthStore
          .getState()
          .setAlert(
            `${selectedMember.name}님의 권한이 ${
              selectedRole === "manager" ? "관리자" : "멤버"
            }로 변경되었습니다.`,
            "success"
          );
          setSubmitStatus('success');
      } catch (error) {
        console.error("Error updating project member permission:", error);
        useAuthStore.getState().setAlert("권한 변경에 실패했습니다.", "error");
        setSubmitStatus('error');
      } finally {
        setShowRoleModal(false);
        setSelectedMember(null);
        setSubmitStatus('idle');
      }
    }
    // Close modal and reset state
    setShowRoleModal(false);
    setSelectedMember(null);
  };

  const handleKickOutMember = (member: User) => {
    try {
      useAuthStore
        .getState()
        .setConfirm("정말로 이 팀원을 퇴출하시겠습니까?", async () => {
          await kickOutMemberFromProject(project.id, member.id);
          useAuthStore
            .getState()
            .setAlert(`${member.name}님이 퇴출되었습니다.`, "success");
          useAuthStore.getState().clearConfirm();
        });
    } catch (error) {
      useAuthStore.getState().setAlert("팀원 퇴출에 실패했습니다.", "error");
      console.error("Error deleting project member:", error);
    }
  };

  const handleApproveRequest = async (user_id: number, name: string | undefined) => {
    if (!isCurrentUserLeaderOrManager) {
      useAuthStore.getState().setAlert("권한이 없습니다.", "error");
      return;
    }
    try {
      useAuthStore
        .getState()
        .setConfirm(`${name}님의 참여 요청을 승인하시겠습니까?`, async () => {
          if (project.members.length >= project.team_size) {
            useAuthStore
              .getState()
              .setAlert(
                "팀 인원이 다 찼습니다. 팀 규모를 늘리거나 팀원을 추방해주세요.",
                "error"
              );
            return;
          }
          await allowParticipationRequest(project.id, user_id);
          useAuthStore
            .getState()
            .setAlert(`${name}님의 참여 요청이 승인되었습니다.`, "success");
          useAuthStore.getState().clearConfirm();
        });
    } catch (error) {
      useAuthStore
        .getState()
        .setAlert("참여 요청 승인에 실패했습니다.", "error");
      console.error("Error approving participation request:", error);
    }
  };

  const handleRejectRequest = async (user_id: number, name: string | undefined) => {
    if (!isCurrentUserLeaderOrManager) {
      useAuthStore.getState().setAlert("권한이 없습니다.", "error");
      return;
    }
    try {
      useAuthStore
        .getState()
        .setConfirm(`${name}님의 참여 요청을 거절하시겠습니까?`, async () => {
          await rejectParticipationRequest(project.id, user_id);
          useAuthStore
            .getState()
            .setAlert(`${name}님의 참여 요청이 거절되었습니다.`, "info");
          useAuthStore.getState().clearConfirm();
        });
    } catch (error) {
      useAuthStore
        .getState()
        .setAlert("참여 요청 거절에 실패했습니다.", "error");
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
        {project.participation_requests &&
          project.participation_requests.length > 0 && (
            <div className="rounded-lg border border-component-border overflow-hidden">
              <div className="bg-component-tertiary-background px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faUserGroup}
                    className="text-blue-400"
                  />
                  <h3 className="font-medium text-text-primary">참여 요청</h3>
                  <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                    {project.participation_requests.length}
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
                  {project.participation_requests &&
                    project.participation_requests.map((request: ParticipationRequest) => (
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
                                handleApproveRequest(request.id, request.user.name || "알 수 없는 사용자")
                              }
                            >
                              <FontAwesomeIcon
                                icon={faCheck}
                                className="mr-1.5"
                              />
                              승인
                            </button>
                            <button
                              className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1.5 rounded text-sm transition-colors"
                              onClick={() =>
                                handleRejectRequest(request.id, request.user.name || "알 수 없는 사용자")
                              }
                            >
                              <FontAwesomeIcon
                                icon={faXmark}
                                className="mr-1.5"
                              />
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
            <div className="relative">
              <input
                type="text"
                placeholder="팀원 검색..."
                className="bg-input-secondary-background border border-input-secondary-border rounded-lg pl-9 pr-3 py-1.5 text-text-secondary text-sm focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
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
                          {project.members.find((member) => member.is_leader)?.user.id === member.user.id ? (
                            <Badge
                              content="프로젝트 리더"
                              color="yellow"
                              isDark={isDark}
                              className="!text-xs !px-2 !py-0.5"
                            />
                          ) : Array.isArray(project.members) &&
                            project.members.some(
                              (member) => member.user.id === member.user.id && member.is_manager
                            ) ? (
                            <Badge
                              content="관리자"
                              color="blue"
                              isDark={isDark}
                              className="!text-xs !px-2 !py-0.5"
                            />
                          ) : (
                            <Badge
                              content="멤버"
                              color="green"
                              isDark={isDark}
                              className="!text-xs !px-2 !py-0.5"
                            />
                          )}
                          <Badge
                            content={member.user.role}
                            color="cyan"
                            isDark={isDark}
                            className="!text-xs !px-2 !py-0.5"
                          />
                        </div>
                        <p className="text-text-secondary text-xs">
                          {member.user.email || "이메일 없음"}
                        </p>
                      </div>
                    </div>
                    {isCurrentUserLeaderOrManager &&
                      project.members.find((member) => member.user.id === member.user.id && !member.is_leader) && (
                        <div className="flex items-center gap-2">
                          <button
                            className="bg-component-secondary-background hover:bg-component-secondary-background/80 text-text-primary rounded px-3 py-1.5 text-sm transition-colors border border-component-border"
                            onClick={() => openRoleModal(member.user)}
                          >
                            권한 변경
                          </button>
                          <button
                            className="text-text-secondary hover:text-red-400 p-2 rounded transition-colors"
                            onClick={() => handleKickOutMember(member.user)}
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
            submitStatus={submitStatus}
            selectedMember={selectedMember}
            isOpen={showRoleModal}
            onClose={() => setShowRoleModal(false)}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            setShowRoleModal={setShowRoleModal}
            handlePermissionChange={handlePermissionChange}
            roleDescriptions={roleDescriptions}
            project={project}
          />
        )}
      </div>
    </div>
  );
}
