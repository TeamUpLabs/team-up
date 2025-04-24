import { useState } from "react";
import { deleteProject } from "@/hooks/getProjectData";
import { useProject } from "@/contexts/ProjectContext";
import { useAuthStore } from "@/auth/authStore";
import ModalTemplete from "@/components/ModalTemplete";

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

  const header = (
    <h3 className="text-xl font-bold text-white">프로젝트 삭제</h3>
  );

  const footer = (
    <div className="flex justify-end gap-2">
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
  );

  return (
    <ModalTemplete
      isOpen={isOpen}
      onClose={onClose}
      header={header}
      footer={footer}
    >
      <div>
        <p className="text-gray-400 text-sm mb-3">정말로 삭제하시겠습니까?</p>
        <p className="text-gray-400 text-sm mb-3">프로젝트와 모든 관련 데이터가 영구적으로 삭제됩니다.</p>
        <input 
          type="text" 
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100" 
          placeholder="진행하기 위해 'Delete'를 입력해주세요." 
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
        />
      </div>
    </ModalTemplete>
  );
}