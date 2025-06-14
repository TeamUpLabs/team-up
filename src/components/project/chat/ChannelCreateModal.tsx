import ModalTemplete from "@/components/ModalTemplete";
import { MessageCaption } from "flowbite-react-icons/outline";
import { useState } from "react";
import AssigneeSelect from "@/components/project/AssigneeSelect";
import { useProject } from "@/contexts/ProjectContext";
import { useAuthStore } from "@/auth/authStore";
import { createChannel } from "@/hooks/getChannelData";
import CancelBtn from "@/components/ui/CancelBtn";
import SubmitBtn from "@/components/ui/SubmitBtn";

interface ChannelCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChannelCreateModal({ isOpen, onClose }: ChannelCreateModalProps) {
  const { project } = useProject();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    channelName: '',
    channelDescription: '',
    isPublic: true as boolean,
    member_id: [] as number[],
    created_by: user?.id || 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleAssignee = (memberId: number) => {
    setFormData((prev) => {
      if (prev.member_id.includes(memberId)) {
        return {
          ...prev,
          member_id: prev.member_id.filter((id) => id !== memberId),
        };
      } else {
        return {
          ...prev,
          member_id: [...prev.member_id, memberId],
        };
      }
    });
  };


  const handleSubmit = async () => {
    if (!formData.channelName.trim()) {
      setError("채널 이름을 입력해주세요.")
      return;
    }

    if (!formData.isPublic && formData.member_id.length === 0) {
      useAuthStore.getState().setAlert("공개 채널이 아닐 경우 최소 한 명의 구성원을 선택해주세요.", "error")
      return;
    }

    if (!project?.id) {
      console.error("Project ID is missing. Cannot create channel.")
      useAuthStore.getState().setAlert("프로젝트 정보를 찾을 수 없습니다. 페이지를 새로고침하거나 문제가 지속되면 관리자에게 문의해주세요.", "error")
      return;
    }

    if (formData.isPublic) {
      formData.member_id = project?.members?.map((member) => member.id) || [];
    }

    try {
      setSubmitStatus('submitting');
      await createChannel(project.id, formData);
      useAuthStore.getState().setAlert("채널이 성공적으로 생성되었습니다.", "success");
      setSubmitStatus('success');

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Failed to create channel:", error);
      let errorMessage = "채널 생성에 실패했습니다. 잠시 후 다시 시도해주세요.";
      if (error instanceof Error && error.message) {
        errorMessage = `채널 생성 중 오류가 발생했습니다. 입력값을 확인하거나 문제가 지속되면 관리자에게 문의해주세요. (상세: ${error.message})`;
      } else {
        errorMessage = "채널 생성 중 알 수 없는 오류가 발생했습니다. 입력값을 확인하거나 관리자에게 문의해주세요.";
      }
      useAuthStore.getState().setAlert(errorMessage, "error");
      setSubmitStatus('error');
    }
  };

  const modalHeader = (
    <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary-100">
        <MessageCaption
          className="text-primary-600 text-lg"
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-text-primary">
          새 채널 생성
        </h3>
        <p className="text-sm text-point-color-indigo mt-0.5">
          프로젝트 채널을 관리하세요
        </p>
      </div>
    </div>
  )

  const modalFooter = (
    <div className="flex justify-end gap-2">
      <CancelBtn
        handleCancel={() => {
          setError(null)
          onClose()
        }}
        className="!text-sm"
        withIcon
      />
      <SubmitBtn
        submitStatus={submitStatus}
        onClick={handleSubmit}
        buttonText="채널 생성"
        successText="생성 완료"
        errorText="생성 실패"
        className="!text-sm"
        withIcon
      />
    </div>
  )
  
  return (
    <ModalTemplete header={modalHeader} footer={modalFooter} isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label
            className="text-sm font-medium text-text-secondary"
            htmlFor="channelName"
          >
            채널 이름 <span className="text-point-color-purple ml-1">*</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-text-secondary font-bold">#</span>
            <input
              type="text"
              id="channelName"
              name="channelName"
              value={formData.channelName}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover"
              placeholder="채널 이름을 입력하세요"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <div className="flex flex-col space-y-2">
          <label
            className="text-sm font-medium text-text-secondary"
            htmlFor="channelDescription"
          >
            채널 설명
          </label>
          <textarea
            id="channelDescription"
            name="channelDescription"
            value={formData.channelDescription}
            onChange={handleChange}
            className="resize-none w-full px-3 py-2 rounded-lg bg-input-background border border-input-border text-text-secondary focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent transition-all duration-200 hover:border-input-border-hover"
            placeholder="채널 설명을 입력하세요"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between p-4 bg-component-secondary-background rounded-lg border border-component-border transition-all hover:border-component-border-hover">
            <div>
              <h3 className="text-text-primary font-medium">공개</h3>
              <p className="text-text-secondary text-sm mt-1">공개 채널은 모든 프로젝트 구성원이 볼 수 있습니다.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked onChange={(e) => {
                setFormData({ ...formData, isPublic: e.target.checked });
              }} />
              <div className="w-11 h-6 bg-component-tertiary-background rounded-full peer peer-checked:bg-point-color-indigo peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
          {!formData.isPublic && (
            <AssigneeSelect
              selectedAssignee={formData.member_id}
              assignee={project?.members || []}
              toggleAssignee={toggleAssignee}
              isAssigned={(memberId) => formData.member_id.includes(memberId)}
              label="선택된 구성원"
              className="px-1"
            />
          )}
        </div>
      </div>
    </ModalTemplete>
  )
}
