import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { deleteProject } from "@/hooks/getProjectData";
import { useProject } from "@/contexts/ProjectContext";
import { useAuthStore } from "@/auth/authStore";
interface DeleteProjectConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteProjectConfirmModal({ isOpen, onClose }: DeleteProjectConfirmModalProps) {
  const { project } = useProject();
  const [confirmText, setConfirmText] = useState("");
  const isDeleteEnabled = confirmText === "Delete";

  const handleDelete = async () => {
    try {
      if (project) {
        await deleteProject(project.id);
        onClose();
        useAuthStore.getState().setAlert("프로젝트가 성공적으로 삭제되었습니다.", "success");
        
        setTimeout(() => {
          window.location.href = "/platform";
        }, 500);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  }

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-gray-800 p-0 text-left align-middle shadow-xl transition-all border border-gray-700 flex flex-col max-h-[90vh]">
                {/* 헤더 섹션 */}
                <div className="flex justify-between items-center border-b border-gray-700 p-5">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-xl font-bold text-white">프로젝트 삭제</h3>
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

                {/* 삭제 섹션 */}
                <div className="p-5">
                  <p className="text-gray-400 text-sm mb-3">정말로 삭제하시겠습니까?</p>
                  <p className="text-gray-400 text-sm mb-3">프로젝트와 모든 관련 데이터가 영구적으로 삭제됩니다.</p>
                  <input 
                    type="text" 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100" 
                    placeholder="진행하기 위해 'Delete'를 입력해주세요." 
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <button 
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      onClick={onClose}
                    >
                      취소
                    </button>
                    <button 
                      className={`px-4 py-2 ${isDeleteEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600/50 cursor-not-allowed'} text-white rounded-lg transition-colors`}
                      disabled={!isDeleteEnabled}
                      onClick={handleDelete}
                    >
                      프로젝트 삭제
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}