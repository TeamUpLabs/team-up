import ModalTemplete from "@/components/ModalTemplete";
import { Channel } from "@/types/Channel";
import { FilePen, TrashBin } from "flowbite-react-icons/outline";
import { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/auth/authStore";
import { updateChannel, deleteChannel } from "@/hooks/getChannelData";
import SubmitBtn from "@/components/ui/SubmitBtn";


interface ChannelEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: Channel;
}

export default function ChannelEditModal({ isOpen, onClose, channel }: ChannelEditModalProps) {
  const { project } = useProject();
  const router = useRouter();
  const [formData, setFormData] = useState({
    channelName: channel.channelName,
    channelDescription: channel.channelDescription,
    isPublic: channel.isPublic,
    member_id: channel.member_id,
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

  const handleSubmit = async () => {
    if (!formData.channelName.trim()) {
      setError("채널 이름을 입력해주세요.")
      return;
    }

    if (!project?.id) {
      console.error("Project ID is missing. Cannot create channel.")
      useAuthStore.getState().setAlert("프로젝트 정보를 찾을 수 없습니다. 페이지를 새로고침하거나 문제가 지속되면 관리자에게 문의해주세요.", "error")
      return;
    }

    try {
      setSubmitStatus('submitting');
      await updateChannel(channel.projectId, channel.channelId, formData);
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

  const handleDelete = () => {
    useAuthStore.getState().setConfirm("채널을 삭제하시겠습니까?", async () => {
      try {
        await deleteChannel(channel.projectId, channel.channelId);
        useAuthStore.getState().setAlert("채널이 성공적으로 삭제되었습니다.", "success");
        router.push(`/platform/${channel.projectId}`)
        setTimeout(() => {
          onClose();
        }, 1000);
      } catch (error) {
        console.error("Failed to delete channel:", error);
        let errorMessage = "채널 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.";
        if (error instanceof Error && error.message) {
          errorMessage = `채널 삭제 중 오류가 발생했습니다. 입력값을 확인하거나 문제가 지속되면 관리자에게 문의해주세요. (상세: ${error.message})`;
        } else {
          errorMessage = "채널 삭제 중 알 수 없는 오류가 발생했습니다. 입력값을 확인하거나 관리자에게 문의해주세요.";
        }
        useAuthStore.getState().setAlert(errorMessage, "error");
      }
    });
  };

  const modelHeader = (
    <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary-100">
        <FilePen
          className="text-primary-600 text-lg"
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-text-primary">
          채널 정보 수정
        </h3>
        <p className="text-sm text-text-tertiary mt-0.5">
          채널 정보를 수정하세요
        </p>
      </div>
    </div>
  )

  const modalFooter = (
    <div className="flex items-center justify-between">
      <button
        onClick={() => {
          setError(null)
          handleDelete()
        }}
        className="flex items-center gap-1.5 text-red-400 bg-red-500/20 hover:bg-red-500/30 transition-all px-4 py-2 rounded-lg transition-colors cursor-pointer"
      >
        <TrashBin />
        채널 삭제
      </button>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setError(null)
            onClose()
          }}
          className="text-text-secondary hover:text-text-primary bg-cancel-button-background hover:bg-cancel-button-background-hover transition-all px-4 py-2 text-text-primary rounded-lg transition-colors border border-component-border"
        >
          취소
        </button>
        <SubmitBtn
          submitStatus={submitStatus}
          onClick={handleSubmit}
          buttonText="채널 수정"
          successText="수정 완료"
          errorText="수정 실패"
        />
      </div>
    </div>
  )

  return (
    <ModalTemplete header={modelHeader} footer={modalFooter} isOpen={isOpen} onClose={onClose}>
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
      </div>
    </ModalTemplete>
  );
}