import ModalTemplete from "@/components/ModalTemplete";
import { Presentation } from "lucide-react";
import Document from "@/components/project/WhiteBoard/Document";
import CancelBtn from "@/components/ui/button/CancelBtn";
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import { useState } from "react";
import { createWhiteBoard } from "@/hooks/getWhiteBoardData";
import { blankWhiteBoardCreateFormData } from "@/types/WhiteBoard";
import { useAuthStore } from "@/auth/authStore";
import { useProject } from "@/contexts/ProjectContext";

interface WhiteboardCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhiteboardCreateModal({
  isOpen,
  onClose,
}: WhiteboardCreateModalProps) {
  const { project, addWhiteBoardInContext } = useProject();
  const user = useAuthStore.getState().user;
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [whiteBoardData, setWhiteBoardData] = useState(blankWhiteBoardCreateFormData);

  const handleSubmit = async () => {
    if (!whiteBoardData.title.trim()) {
      useAuthStore.getState().setAlert("화이트보드 제목을 입력해주세요.", "error");
      return;
    }

    if (!whiteBoardData.content.trim()) {
      useAuthStore.getState().setAlert("화이트보드 내용을 입력해주세요.", "error");
      return;
    }

    try {
      setSubmitStatus('submitting');
      const res = await createWhiteBoard(project?.id || "", {
        ...whiteBoardData,
        type: "document",
        created_by: user?.id || 0,
        updated_by: user?.id || 0
      });
      setSubmitStatus('success');
      addWhiteBoardInContext(res);
      useAuthStore.getState().setAlert("화이트보드가 성공적으로 생성되었습니다.", "success");
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
      useAuthStore.getState().setAlert("화이트보드 생성에 실패했습니다. 잠시 후 다시 시도해주세요.", "error");
    } finally {
      setTimeout(() => {
        onClose();
        setWhiteBoardData(blankWhiteBoardCreateFormData);
        setSubmitStatus('idle');
      }, 1000);
    }
  }
  const modalHeader = (
    <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary-100">
        <Presentation
          className="text-text-primary text-lg"
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-text-primary">
          화이트 보드 생성
        </h3>
        <p className="text-sm text-point-color-indigo mt-0.5">
          당신의 아이디어를 자유롭게 표현하세요
        </p>
      </div>
    </div>
  )

  const modalFooter = (
    <div className="flex justify-end space-x-3 pt-4">
      <CancelBtn
        handleCancel={onClose}
        withIcon
      />
      <SubmitBtn
        submitStatus={submitStatus}
        buttonText="저장하기"
        withIcon
        fit
        onClick={handleSubmit}
      />
    </div>
  )
  return (
    <ModalTemplete
      header={modalHeader}
      isOpen={isOpen}
      onClose={onClose}
      footer={modalFooter}
    >
      <Document
        formData={whiteBoardData}
        onChange={setWhiteBoardData}
      />
    </ModalTemplete>
  );
}