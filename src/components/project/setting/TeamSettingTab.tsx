import { Project } from "@/types/Project";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark, faTrash, faSearch, faUserGroup, faShield } from '@fortawesome/free-solid-svg-icons';
import { Member } from "@/types/Member";
import PermissionChangeModal from "@/components/project/setting/PermissionChangeModal";
import { updateProjectMemberPermission, allowParticipationRequest, rejectParticipationRequest } from "@/hooks/getProjectData";
import { useAuthStore } from "@/auth/authStore";

interface TeamSettingTabProps {
  project: Project;
}

export default function TeamSettingTab({ project }: TeamSettingTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showJoinRequests, setShowJoinRequests] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isCurrentUserLeaderOrManager, setIsCurrentUserLeaderOrManager] = useState(false);
  const { user } = useAuthStore();

  // Check if current user is leader or manager
  useEffect(() => {
    if (user && project) {
      const isLeader = project.leader.id === user.id;
      const isManager = Array.isArray(project.manager) && project.manager.some(manager => manager.id === user.id);
      setIsCurrentUserLeaderOrManager(isLeader || isManager);
    }
  }, [user, project]);

  const filteredMembers = project?.members
    .filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Leader has highest priority
      if (a.id === project.leader.id) return -1;
      if (b.id === project.leader.id) return 1;

      // Managers have second priority
      const aIsManager = Array.isArray(project.manager) && project.manager.some(manager => manager.id === a.id);
      const bIsManager = Array.isArray(project.manager) && project.manager.some(manager => manager.id === b.id);

      if (aIsManager && !bIsManager) return -1;
      if (!aIsManager && bIsManager) return 1;

      // Otherwise sort by name
      return a.name.localeCompare(b.name);
    });

  // Role descriptions for tooltip
  const roleDescriptions = {
    leader: "프로젝트 생성자. 모든 설정 및 관리 권한 보유",
    manager: "프로젝트 설정 변경, 멤버 관리, 모든 작업 수정 가능",
    member: "작업 확인 및 할당된 작업 수정 가능",
    default: "기본 권한, 작업 확인만 가능"
  };

  const openRoleModal = (member: Member) => {
    setSelectedMember(member);
    setSelectedRole(project.leader.id == member.id ? "leader" : project.manager.some(manager => manager.id == member.id) ? "manager" : "member");
    setShowRoleModal(true);
  };

  const handlePermissionChange = async () => {
    if (selectedMember) {
      try {
        await updateProjectMemberPermission(project.id, selectedMember.id, selectedRole);
        useAuthStore.getState().setAlert(`${selectedMember.name}님의 권한이 ${selectedRole === "manager" ? "관리자" : "멤버"}로 변경되었습니다.`, "success");

        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        console.error("Error updating project member permission:", error);
        useAuthStore.getState().setAlert("권한 변경에 실패했습니다.", "error");
      }
    }
    // Close modal and reset state
    setShowRoleModal(false);
    setSelectedMember(null);
  };

  const handleDeleteMember = async (member: Member) => {
    try {
      useAuthStore.getState().setConfirm("정말로 이 팀원을 퇴출하시겠습니까?", () => {
        useAuthStore.getState().setAlert(`${member.name}님이 퇴출되었습니다.`, "success");
        useAuthStore.getState().clearConfirm();
      });
    } catch (error) {
      useAuthStore.getState().setAlert("팀원 퇴출에 실패했습니다.", "error");
      console.error("Error deleting project member:", error);
    }
  };

  const handleApproveRequest = async (user_id: number, name: string) => {
    if (!isCurrentUserLeaderOrManager) {
      useAuthStore.getState().setAlert("권한이 없습니다.", "error");
      return;
    }
    try {
      useAuthStore.getState().setConfirm(`${name}님의 참여 요청을 승인하시겠습니까?`, async () => {
        await allowParticipationRequest(project.id, user_id);
        useAuthStore.getState().setAlert(`${name}님의 참여 요청이 승인되었습니다.`, "success");
        useAuthStore.getState().clearConfirm();
        setTimeout(() => {
          window.location.reload();
        }, 500);
      });
    } catch (error) {
      useAuthStore.getState().setAlert("참여 요청 승인에 실패했습니다.", "error");
      console.error("Error approving participation request:", error);
    }
  };

  const handleRejectRequest = async (user_id: number, name: string) => {
    if (!isCurrentUserLeaderOrManager) {
      useAuthStore.getState().setAlert("권한이 없습니다.", "error");
      return;
    }
    try {
      useAuthStore.getState().setConfirm(`${name}님의 참여 요청을 거절하시겠습니까?`, async () => {
        await rejectParticipationRequest(project.id, user_id);
        useAuthStore.getState().setAlert(`${name}님의 참여 요청이 거절되었습니다.`, "info");
        useAuthStore.getState().clearConfirm();
        setTimeout(() => {
          window.location.reload();
        }, 500);
      });
    } catch (error) {
      useAuthStore.getState().setAlert("참여 요청 거절에 실패했습니다.", "error");
      console.error("Error rejecting participation request:", error);
    }
  };

  return (
    <div className="bg-component-background border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-100 border-b border-gray-700/50 px-6 py-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        팀 관리
      </h2>

      <div className="p-6 space-y-6">
        {/* Join Requests Section */}
        {project.participationRequestMembers.length > 0 && (
          <div className="rounded-lg border border-gray-700 overflow-hidden">
            <div className="bg-gray-700/50 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUserGroup} className="text-blue-400" />
                <h3 className="font-medium text-gray-200">참여 요청</h3>
                <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full">
                  {project.participationRequestMembers.length}
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
              <div className="divide-y divide-gray-700">
                {project.participationRequestMembers.map((request) => (
                  <div key={request.id} className="px-4 py-3 bg-gray-800/50 hover:bg-gray-800 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center text-gray-300">
                          {request.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-gray-200 font-medium">{request.name}</p>
                            <span className="bg-gray-500/20 text-gray-400 text-xs px-2 py-0.5 rounded-md">{request.role}</span>
                          </div>
                          <p className="text-gray-400 text-xs">{request.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition-colors"
                          onClick={() => handleApproveRequest(request.id, request.name)}
                        >
                          <FontAwesomeIcon icon={faCheck} className="mr-1.5" />
                          승인
                        </button>
                        <button
                          className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1.5 rounded text-sm transition-colors"
                          onClick={() => handleRejectRequest(request.id, request.name)}
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
        <div className="rounded-lg border border-gray-700 overflow-hidden">
          <div className="bg-gray-700/50 px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faShield} className="text-yellow-400" />
              <h3 className="font-medium text-gray-200">팀원 관리</h3>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="팀원 검색..."
                className="bg-gray-700 border border-gray-600 rounded-lg pl-9 pr-3 py-1.5 text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="divide-y divide-gray-700">
            {filteredMembers?.map((member) => (
              <div key={member.id} className="px-4 py-3 bg-gray-800/50 hover:bg-gray-800 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-100 font-medium">{member.name}</p>
                        {member.id === project.leader.id ? (
                          <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-md">프로젝트 리더</span>
                        ) : Array.isArray(project.manager) && project.manager.some(manager => manager.id === member.id) ? (
                          <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-md">관리자</span>
                        ) : (
                          <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-md">멤버</span>
                        )}
                        <span className="bg-gray-500/20 text-gray-400 text-xs px-2 py-0.5 rounded-md">{member.role}</span>
                      </div>
                      <p className="text-gray-400 text-xs">{member.email}</p>
                    </div>
                  </div>
                  {isCurrentUserLeaderOrManager && member.id !== project.leader.id && (
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-gray-700 hover:bg-gray-600 text-gray-200 rounded px-3 py-1.5 text-sm transition-colors"
                        onClick={() => openRoleModal(member)}
                      >
                        권한 변경
                      </button>
                      <button
                        className="text-gray-400 hover:text-red-400 p-2 rounded transition-colors"
                        onClick={() => handleDeleteMember(member)}
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
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mt-6">
          <h4 className="text-gray-200 font-medium mb-3 pb-2 border-b border-gray-700">역할 및 권한 설명</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center">
              <span className="inline-block w-20 text-yellow-400 font-medium">리더:</span>
              <span className="text-gray-300">{roleDescriptions.leader}</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-20 text-blue-400 font-medium">관리자:</span>
              <span className="text-gray-300">{roleDescriptions.manager}</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-20 text-green-400 font-medium">멤버:</span>
              <span className="text-gray-300">{roleDescriptions.member}</span>
            </div>
          </div>
        </div>

        {/* Role Change Modal */}
        {showRoleModal && selectedMember && (
          <PermissionChangeModal
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