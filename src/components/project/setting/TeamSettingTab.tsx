import { Project } from "@/types/Project";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faTrash, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Member } from "@/types/Member";
import PermissionChangeModal from "@/components/project/setting/PermissionChangeModal";
import { updateProjectMemberPermission } from "@/hooks/getProjectData";
import { useAuthStore } from "@/auth/authStore";

interface TeamSettingTabProps {
  project: Project;
}

export default function TeamSettingTab({ project }: TeamSettingTabProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPendingInvites, setShowPendingInvites] = useState(false);
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

  // Mock data for pending invites (would come from backend)
  const pendingInvites = [
    { email: "pending@example.com", sentAt: "2023-07-15" },
    { email: "waiting@example.com", sentAt: "2023-07-16" },
  ];

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
    setSelectedRole(project.leader.id == member.id ? "leader" : project.manager.some(manager => manager.id == member.id) ? "manager" : "member"); // Default to member if role is undefined
    console.log(selectedRole);
    setShowRoleModal(true);
  };

  const handlePermissionChange = async () => {
    // Here you would update the role in the backen
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

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-100 mb-6">팀 관리</h2>

      {/* Invite Section */}
      <div className="mb-8 border-b border-gray-700 pb-6">
        <label className="block text-gray-300 mb-2 font-medium">팀원 초대</label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="email"
              placeholder="이메일 주소"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            {inviteEmail && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                onClick={() => setInviteEmail("")}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
          </div>
          <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100">
            <option value="member">멤버</option>
            <option value="admin">관리자</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
            <FontAwesomeIcon icon={faUserPlus} />
            <span>초대</span>
          </button>
        </div>

        {/* Pending Invites */}
        <div className="mt-4">
          <button
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
            onClick={() => setShowPendingInvites(!showPendingInvites)}
          >
            {showPendingInvites ? "대기 중인 초대 숨기기" : `대기 중인 초대 보기 (${pendingInvites.length})`}
          </button>

          {showPendingInvites && (
            <div className="mt-3 space-y-2">
              {pendingInvites.map((invite, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                  <div>
                    <span className="text-gray-300">{invite.email}</span>
                    <span className="text-gray-500 text-xs ml-2">초대일: {invite.sentAt}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-gray-400 hover:text-gray-200 text-sm">재발송</button>
                    <button className="text-red-400 hover:text-red-300 text-sm">취소</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Team Members Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-200">현재 팀원</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="팀원 검색..."
              className="bg-gray-700 border border-gray-600 rounded-lg pl-9 pr-4 py-1 text-gray-100 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="space-y-4">
          {filteredMembers?.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-100 font-medium">{member.name}</p>
                    {member.id === project.leader.id ? (
                      <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded">프로젝트 리더</span>
                    ) : Array.isArray(project.manager) && project.manager.some(manager => manager.id === member.id) ? (
                      <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded">관리자</span>
                    ) : (
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded">멤버</span>
                    )}

                  </div>
                  <p className="text-gray-400 text-sm">{member.email}</p>
                </div>
              </div>
              {isCurrentUserLeaderOrManager && member.id !== project.leader.id && (
                <div className="flex items-center gap-3">
                  <button
                    className="bg-gray-600 hover:bg-gray-500 text-gray-200 rounded px-3 py-1 text-xs transition-colors"
                    onClick={() => openRoleModal(member)}
                  >
                    권한 변경
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300 p-1 rounded"
                    onClick={() => handleDeleteMember(member)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Role Explanation */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h4 className="text-gray-200 font-medium mb-3">역할 및 권한 설명</h4>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="text-yellow-400 font-medium">프로젝트 리더:</span>
              <span className="text-gray-300">{roleDescriptions.leader}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-blue-400 font-medium">관리자:</span>
              <span className="text-gray-300">{roleDescriptions.manager}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-green-400 font-medium">멤버:</span>
              <span className="text-gray-300">{roleDescriptions.member}</span>
            </div>
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
  );
}