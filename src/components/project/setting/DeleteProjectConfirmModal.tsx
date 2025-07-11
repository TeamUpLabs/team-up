import { useState } from "react";
import { deleteProject } from "@/hooks/getProjectData";
import { useProject } from "@/contexts/ProjectContext";
import { useAuthStore } from "@/auth/authStore";
import ModalTemplete from "@/components/ModalTemplete";
import { Input } from "@/components/ui/Input";
import CancelBtn from "@/components/ui/button/CancelBtn";
import DeleteBtn from "@/components/ui/button/DeleteBtn";

interface DeleteProjectConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteProjectConfirmModal({ isOpen, onClose }: DeleteProjectConfirmModalProps) {
  const { project } = useProject();
  const [confirmText, setConfirmText] = useState("");
  const isDeleteEnabled = confirmText === "Delete";
  const token = useAuthStore((state) => state.token);

  const handleDelete = async () => {
    try {
      if (project) {
        await deleteProject(project.id, token || "");
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
    <div className="flex flex-col space-y-1">
      <h3 className="text-xl font-bold text-text-primary">프로젝트 삭제</h3>
      <p className="text-sm text-point-color-indigo mt-0.5">정말로 삭제하시겠습니까?</p>
    </div>
  );

  const footer = (
    <div className="flex justify-end gap-2">
      <CancelBtn handleCancel={onClose} withIcon />
      <DeleteBtn handleDelete={handleDelete} disabled={!isDeleteEnabled} withIcon />
    </div>
  );

  return (
    <ModalTemplete
      isOpen={isOpen}
      onClose={onClose}
      header={header}
      footer={footer}
    >
      <div className="mb-2">
        <p className="text-text-secondary text-sm mb-3">프로젝트와 모든 관련 데이터가 영구적으로 삭제됩니다.</p>
        <Input
          type="text"
          placeholder="진행하기 위해 'Delete'를 입력해주세요."
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
        />
      </div>
    </ModalTemplete>
  );
}