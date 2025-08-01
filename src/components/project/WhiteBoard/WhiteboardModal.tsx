import ModalTemplete from "@/components/ModalTemplete";
import { WhiteBoard } from "@/types/WhiteBoard";
import { useState } from "react";
import { Lightbulb, Eye, ThumbsUp, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/auth/authStore";
import CancelBtn from "@/components/ui/button/CancelBtn";
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import Accordion from "@/components/ui/Accordion";
import { InfoCircle } from "flowbite-react-icons/outline";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import Image from "next/image";
import { formatDate } from "date-fns";

interface WhiteboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: WhiteBoard;
}

export default function WhiteboardModal({
  isOpen,
  onClose,
  idea,
}: WhiteboardModalProps) {
  const user = useAuthStore.getState().user;
  const [ideaData, setIdeaData] = useState(idea);
  const [isEditing, setIsEditing] = useState("none");
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIdeaData({ ...ideaData, [name]: value });
  }

  const handleSelectChange = (name: string, value: string | string[]) => {
    setIdeaData({ ...ideaData, [name]: value });
  };

  const handleEdit = (name: string) => {
    if (user && ideaData.creator.id === user.id) {
      setIsEditing(name);
      if (name !== "none") {
        useAuthStore.getState().setAlert("편집 모드로 전환되었습니다.", "info");
      } else {
        useAuthStore.getState().setAlert("편집 모드를 종료했습니다.", "info");
      }
    } else {
      useAuthStore.getState().setAlert("담당자가 아니므로 수정할 수 없습니다.", "warning");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing("none");
    useAuthStore.getState().setAlert("편집 모드를 종료했습니다.", "info");
  };

  const header = (
    <div className="flex items-start">
      <div className="flex items-center gap-2 flex-1">
        <Lightbulb />
        {isEditing == "title" ? (
          <Input
            type="text"
            name="title"
            value={ideaData.title}
            onChange={handleChange}
            className="!text-xl !font-semibold !py-1 !px-2"
            placeholder="작업 제목을 입력하세요"
          />
        ) : (
          <div className="flex items-center gap-2 group relative">
            <span className="text-xl font-semibold text-text-primary">
              {ideaData?.title}
            </span>
            <FontAwesomeIcon
              icon={faPencil}
              size="xs"
              className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={() =>
                isEditing === "title" ? handleEdit("none") : handleEdit("title")
              }
            />
          </div>
        )}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-text-secondary text-xs">
            <ThumbsUp className="w-4 h-4" />
            <span>{ideaData.likes || 0}</span>
          </div>
          <div className="flex items-center space-x-1 text-text-secondary text-xs">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{ideaData.comments?.length || 0}</span>
          </div>
          <div className="flex items-center space-x-1 text-text-secondary text-xs">
            <Eye className="w-4 h-4" />
            <span>{ideaData.views || 0}</span>
          </div>
        </div>
      </div>

      {(isEditing !== "none") && (
        <div className="flex items-center gap-2">
          <CancelBtn
            handleCancel={handleCancelEdit}
            className="!text-sm"
            withIcon
          />
          <SubmitBtn
            // onClick={handleSaveEdit}
            submitStatus={submitStatus}
            buttonText="저장"
            successText="저장 완료"
            errorText="오류 발생"
            className="!text-sm"
            withIcon
          />
        </div>
      )}
    </div>
  );

  return (
    <ModalTemplete
      isOpen={isOpen}
      onClose={onClose}
      header={header}
    >
      <Accordion
        title="Overview"
        icon={InfoCircle}
        defaultOpen
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 group relative">
              <h4 className="font-medium text-text-secondary text-sm">타입</h4>
              <FontAwesomeIcon
                icon={faPencil}
                size="xs"
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() =>
                  isEditing === "type" ? handleEdit("none") : handleEdit("type")
                }
              />
            </div>
            {isEditing === "type" ? (
              <Select
                options={[
                  { name: "type", value: "document", label: "document" },
                  { name: "type", value: "canvas", label: "canvas" },
                ]}
                value={ideaData.type}
                onChange={(value) => handleSelectChange("type", value)}
                className="!px-2 !py-0.5 !rounded-full !text-sm"
                likeBadge={true}
                autoWidth
                color="black"
              />
            ) : (
              <Badge
                content={ideaData.type}
                color="black"
                fit
                className="!rounded-full !px-2 !py-0.5 !text-sm"
              />
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-text-secondary text-sm">프로젝트 ID</h4>
            <span className="text-text-primary font-medium">{ideaData.project_id}</span>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-text-secondary text-sm">생성자</h4>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden">
                {ideaData.creator.profile_image ? (
                  <Image
                    src={ideaData.creator.profile_image}
                    alt={ideaData.creator.name}
                    width={32}
                    height={32}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-text-secondary flex items-center justify-center">
                    {ideaData.creator.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-text-primary font-medium">{ideaData.creator.name}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-text-secondary text-sm">최종 수정자</h4>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden">
                {ideaData.updater.profile_image ? (
                  <Image
                    src={ideaData.updater.profile_image}
                    alt={ideaData.updater.name}
                    width={32}
                    height={32}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-text-secondary flex items-center justify-center">
                    {ideaData.updater.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-text-primary font-medium">{ideaData.updater.name}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-text-secondary text-sm">생성일</h4>
            <span className="text-text-primary font-medium">{formatDate(new Date(ideaData.created_at), "yyyy년 MM월 dd일 hh:mm a")}</span>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-text-secondary text-sm">최종 수정일</h4>
            <span className="text-text-primary font-medium">{formatDate(new Date(ideaData.updated_at), "yyyy년 MM월 dd일 hh:mm a")}</span>
          </div>
        </div>
      </Accordion>
    </ModalTemplete>
  );
}