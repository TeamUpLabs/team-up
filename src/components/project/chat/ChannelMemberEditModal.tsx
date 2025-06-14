import ModalTemplete from "@/components/ModalTemplete";
import { Channel } from "@/types/Channel";
import AssigneeSelect from "@/components/project/AssigneeSelect";
import { useProject } from "@/contexts/ProjectContext";
import { Users } from "flowbite-react-icons/outline";
import { useAuthStore } from "@/auth/authStore";
import { updateChannel } from "@/hooks/getChannelData";
import { useState } from "react";
import CancelBtn from "@/components/ui/CancelBtn";
import SubmitBtn from "@/components/ui/SubmitBtn";

interface ChannelMemberEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: Channel;
}

export default function ChannelMemberEditModal({ isOpen, onClose, channel }: ChannelMemberEditModalProps) {
  const { project } = useProject();
  const [formData, setFormData] = useState({
    channelName: channel.channelName,
    channelDescription: channel.channelDescription,
    isPublic: channel.isPublic as boolean,
    member_id: channel.member_id as number[],
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

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
      await updateChannel(channel.projectId, channel.channelId, {
        ...formData,
      });
      useAuthStore.getState().setAlert("채널이 성공적으로 수정되었습니다.", "success");
      setSubmitStatus('success');
      
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Failed to create channel:", error);
      let errorMessage = "채널 수정에 실패했습니다. 잠시 후 다시 시도해주세요.";
      if (error instanceof Error && error.message) {
        errorMessage = `채널 수정 중 오류가 발생했습니다. 입력값을 확인하거나 문제가 지속되면 관리자에게 문의해주세요. (상세: ${error.message})`;
      } else {
        errorMessage = "채널 수정 중 알 수 없는 오류가 발생했습니다. 입력값을 확인하거나 관리자에게 문의해주세요.";
      }
      useAuthStore.getState().setAlert(errorMessage, "error");
      setSubmitStatus('error');
    }
  };


  const modelHeader = (
    <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary-100">
        <Users
          className="text-primary-600 text-lg"
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-text-primary">
          채널 구성원 수정
        </h3>
        <p className="text-sm text-point-color-indigo mt-0.5">
          채널 구성원을 수정하세요
        </p>
      </div>
    </div>
  )

  const modalFooter = (
    <div className="flex justify-end gap-2">
      <CancelBtn
        handleCancel={onClose}
        className="!text-sm"
        withIcon
      />
      <SubmitBtn
        submitStatus={submitStatus}
        onClick={handleSubmit}
        buttonText="구성원 수정"
        successText="수정 완료"
        errorText="수정 실패"
        className="!text-sm"
        withIcon
      />
    </div>
  )

  return (
    <ModalTemplete header={modelHeader} footer={modalFooter} isOpen={isOpen} onClose={onClose}>
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
    </ModalTemplete>
  )
}