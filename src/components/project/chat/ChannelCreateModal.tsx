import ModalTemplete from "@/components/ModalTemplete";
import { MessageCaption } from "flowbite-react-icons/outline";
import { useState } from "react";
import AssigneeSelect from "@/components/project/AssigneeSelect";
import { useProject } from "@/contexts/ProjectContext";
import { useAuthStore } from "@/auth/authStore";
import { createChannel } from "@/hooks/getChannelData";
import CancelBtn from "@/components/ui/button/CancelBtn";
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { blankChannelCreateForm } from "@/types/Channel";

interface ChannelCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChannelCreateModal({ isOpen, onClose }: ChannelCreateModalProps) {
  const { project, addChannelInContext } = useProject();
  const user = useAuthStore((state) => state.user);
  const [formData, setFormData] = useState(blankChannelCreateForm);
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
      if (prev.member_ids.includes(memberId)) {
        return {
          ...prev,
          member_ids: prev.member_ids.filter((id) => id !== memberId),
        };
      } else {
        return {
          ...prev,
          member_ids: [...prev.member_ids, memberId],
        };
      }
    });
  };


  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError("채널 이름을 입력해주세요.")
      return;
    }

    if (!formData.is_public && formData.member_ids.length === 0) {
      useAuthStore.getState().setAlert("공개 채널이 아닐 경우 최소 한 명의 구성원을 선택해주세요.", "error")
      return;
    }

    if (!project?.id) {
      console.error("Project ID is missing. Cannot create channel.")
      useAuthStore.getState().setAlert("프로젝트 정보를 찾을 수 없습니다. 페이지를 새로고침하거나 문제가 지속되면 관리자에게 문의해주세요.", "error")
      return;
    }

    if (formData.is_public) {
      formData.member_ids = project?.members?.map((member) => member.user.id) || [];
    }

    if (project?.id) {
      setSubmitStatus('submitting');
      try {
        const data = await createChannel({
          ...formData,
          project_id: project.id,
          member_ids: formData.member_ids,
          created_by: user?.id || 0,
          updated_by: user?.id || 0,
        });
        setSubmitStatus('success');
        addChannelInContext(data);
        useAuthStore.getState().setAlert("채널이 성공적으로 생성되었습니다.", "success");
      } catch (error) {
        console.error("Failed to create channel:", error);
        let errorMessage = "채널 생성에 실패했습니다. 잠시 후 다시 시도해주세요.";
        if (error instanceof Error && error.message) {
          errorMessage = `채널 생성 중 오류가 발생했습니다. 입력값을 확인하거나 문제가 지속되면 관리자에게 문의해주세요. (상세: ${error.message})`;
        } else {
          errorMessage = "채널 생성 중 알 수 없는 오류가 발생했습니다. 입력값을 확인하거나 관리자에게 문의해주세요.";
        }
        setSubmitStatus('error');
        useAuthStore.getState().setAlert(errorMessage, "error");
      } finally {
        setTimeout(() => {
          onClose();
          setFormData(blankChannelCreateForm);
          setSubmitStatus('idle');
        }, 1000);
      }
    };
  };

  const modalHeader = (
    <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary-100">
        <MessageCaption
          className="text-text-primary text-lg"
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
        fit
      />
    </div>
  )

  return (
    <ModalTemplete header={modalHeader} footer={modalFooter} isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            placeholder="채널 이름을 입력하세요"
            startAdornment={<span className="font-semibold">#</span>}
            label="채널 이름"
            isRequired
            className="!pl-8"
            autoComplete="off"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <TextArea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="채널 설명을 입력하세요"
          label="채널 설명"
        />
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between p-4 bg-component-secondary-background rounded-lg border border-component-border transition-all hover:border-component-border-hover">
            <div>
              <h3 className="text-text-primary font-medium">공개</h3>
              <p className="text-text-secondary text-sm mt-1">공개 채널은 모든 프로젝트 구성원이 볼 수 있습니다.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked onChange={(e) => {
                setFormData({ ...formData, is_public: e.target.checked });
              }} />
              <div className="w-11 h-6 bg-component-tertiary-background rounded-full peer peer-checked:bg-point-color-indigo peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
          {!formData.is_public && (
            <AssigneeSelect
              selectedAssignee={formData.member_ids}
              assignee={project?.members?.map((member) => member.user) || []}
              toggleAssignee={toggleAssignee}
              isAssigned={(memberId) => formData.member_ids.includes(memberId)}
              label="선택된 구성원"
              className="px-1"
            />
          )}
        </div>
      </div>
    </ModalTemplete>
  )
}
