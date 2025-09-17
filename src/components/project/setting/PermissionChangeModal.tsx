import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faUser, faCheck } from '@fortawesome/free-solid-svg-icons';
import { User } from '@/types/user/User';
import { Project } from '@/types/Project';
import ModalTemplete from '@/components/ModalTemplete';
import CancelBtn from '@/components/ui/button/CancelBtn';
import SubmitBtn from '@/components/ui/button/SubmitBtn';
import { updateProjectMemberPermission } from '@/hooks/getProjectData';
import { useAuthStore } from '@/auth/authStore';
import { useState } from 'react';

interface PermissionChangeModalProps {
  selectedMember: User;
  isOpen: boolean;
  onClose: () => void;
  setShowRoleModal: (show: boolean) => void;
  roleDescriptions: Record<string, string>;
  project: Project;
}

export default function PermissionChangeModal({ selectedMember, isOpen, onClose, setShowRoleModal, roleDescriptions, project }: PermissionChangeModalProps) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [selectedRole, setSelectedRole] = useState<string>(
    project.members.find((member) => member.user.id === selectedMember.id && member.is_leader)
      ? "leader"
      : project.members.some((member) => member.user.id === selectedMember.id && member.is_manager)
      ? "manager"
      : "member"
  );

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
        setSubmitStatus('idle');
      }
    }
    // Close modal and reset state
    setShowRoleModal(false);
  };

  const header = (
    <div className="flex flex-col space-y-1">
      <h3 className="text-xl font-bold text-text-primary">
        권한 변경: {selectedMember.name}
      </h3>
      <p className="text-sm text-point-color-indigo mt-0.5">
        권한을 변경하면 팀원의 프로젝트 접근 권한이 변경됩니다.
      </p>
    </div>
  );

  const footer = (
    <div className="flex justify-end gap-3">
      <CancelBtn
        handleCancel={() => setShowRoleModal(false)}
        className="!text-sm"
        withIcon
      />
      <SubmitBtn
        submitStatus={submitStatus}
        onClick={handlePermissionChange}
        buttonText="변경 저장"
        successText="변경 완료"
        errorText="변경 실패"
        className="!text-sm !bg-blue-600 hover:!bg-blue-700"
        fit
        withIcon
      />
    </div>
  );

  return (
    <ModalTemplete
      header={header}
      footer={footer}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <div className="space-y-3">
          <div
            className={`flex items-center p-3 rounded-lg cursor-pointer border 
          ${selectedRole === 'manager'
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-component-border hover:bg-component-secondary-background'}`}
            onClick={() => setSelectedRole('manager')}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="text-blue-400">
                <FontAwesomeIcon icon={faUserShield} />
              </div>
              <div>
                <p className="font-medium text-text-primary">관리자</p>
                <p className="text-text-secondary text-sm">{roleDescriptions.manager}</p>
              </div>
            </div>
            {selectedRole === 'manager' && (
              <FontAwesomeIcon icon={faCheck} className="text-blue-400" />
            )}
          </div>

          <div
            className={`flex items-center p-3 rounded-lg cursor-pointer border 
          ${selectedRole === 'member'
                ? 'border-green-500 bg-green-500/10'
                : 'border-component-border hover:bg-component-secondary-background'}`}
            onClick={() => setSelectedRole('member')}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="text-green-400">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div>
                <p className="font-medium text-text-primary">멤버</p>
                <p className="text-text-secondary text-sm">{roleDescriptions.member}</p>
              </div>
            </div>
            {selectedRole === 'member' && (
              <FontAwesomeIcon icon={faCheck} className="text-green-400" />
            )}
          </div>
        </div>
      </div>
    </ModalTemplete>
  );
}