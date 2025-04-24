import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faUser, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Member } from '@/types/Member';
import { Project } from '@/types/Project';

interface PermissionChangeModalProps {
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

export default function PermissionChangeModal({ selectedMember, isOpen, onClose, selectedRole, setSelectedRole, setShowRoleModal, handlePermissionChange, roleDescriptions }: PermissionChangeModalProps) {

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-gray-800 backdrop-blur-sm p-6 text-left align-middle shadow-xl transition-all border border-gray-700 flex flex-col max-h-[90vh]">
                {/* 헤더 섹션 */}
                <div className="flex justify-between items-start border-b border-gray-700/50 pb-6">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-xl font-medium text-gray-100">권한 변경: {selectedMember.name}</h3>
                  </div>
                  <button
                    type="button"
                    className="p-1 text-gray-400 hover:text-white transition-all duration-150"
                    onClick={onClose}
                    aria-label="닫기"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>

                {/* 권한 변경 섹션 */}
                <div className="my-6">
                  <p className="text-gray-300 mb-4">
                    권한을 변경하면 팀원의 프로젝트 접근 권한이 변경됩니다.
                  </p>

                  <div className="space-y-3">
                    <div
                      className={`flex items-center p-3 rounded-lg cursor-pointer border 
                    ${selectedRole === 'manager'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-600 hover:bg-gray-700'}`}
                      onClick={() => setSelectedRole('manager')}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-blue-400">
                          <FontAwesomeIcon icon={faUserShield} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-100">관리자</p>
                          <p className="text-gray-400 text-sm">{roleDescriptions.manager}</p>
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
                          : 'border-gray-600 hover:bg-gray-700'}`}
                      onClick={() => setSelectedRole('member')}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-green-400">
                          <FontAwesomeIcon icon={faUser} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-100">멤버</p>
                          <p className="text-gray-400 text-sm">{roleDescriptions.member}</p>
                        </div>
                      </div>
                      {selectedRole === 'member' && (
                        <FontAwesomeIcon icon={faCheck} className="text-green-400" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 text-gray-300 hover:text-white rounded-lg transition-colors"
                    onClick={() => setShowRoleModal(false)}
                  >
                    취소
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    onClick={handlePermissionChange}
                  >
                    변경 저장
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}