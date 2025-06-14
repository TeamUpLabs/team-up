import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faUser, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Member } from '@/types/Member';
import { Project } from '@/types/Project';
import ModalTemplete from '@/components/ModalTemplete';
import CancelBtn from '@/components/ui/button/CancelBtn';
import SubmitBtn from '@/components/ui/button/SubmitBtn';


interface PermissionChangeModalProps {
  submitStatus: 'idle' | 'submitting' | 'success' | 'error';
  selectedMember: Member;
  isOpen: boolean;
  onClose: () => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  setShowRoleModal: (show: boolean) => void;
  handlePermissionChange: () => void;
  roleDescriptions: Record<string, string>;
  project: Project;
}

export default function PermissionChangeModal({ submitStatus, selectedMember, isOpen, onClose, selectedRole, setSelectedRole, setShowRoleModal, handlePermissionChange, roleDescriptions }: PermissionChangeModalProps) {

  const header = (
    <div className="flex items-center space-x-4">
      <h3 className="text-xl font-medium text-text-primary">권한 변경: {selectedMember.name}</h3>
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
        <p className="text-text-secondary mb-4">
          권한을 변경하면 팀원의 프로젝트 접근 권한이 변경됩니다.
        </p>

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