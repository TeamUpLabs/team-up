import ModalTemplete from "@/components/ModalTemplete";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale/ko";
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import { useState } from "react";
import { useAuthStore } from "@/auth/authStore";
import { TextArea } from "@/components/ui/TextArea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowUp } from "@fortawesome/free-solid-svg-icons";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const comments = [
  {
    id: 1,
    creator: {
      id: 1,
      name: "Liam Rubicorn",
      avatar: "/DefaultProfile.jpg",
    },
    content: "A better understanding of usage can aid in prioritizing features and ensuring that the most important ones are implemented first.",
    created_at: "2025-09-02T13:45:35.000Z",
    updated_at: "2025-09-02T13:45:35.000Z",
  }
]

export default function CommentModal({ isOpen, onClose }: CommentModalProps) {
  const user = useAuthStore.getState().user;
  const [comment, setComment] = useState<string>("");

  const header = (
    <h3 className="text-xl font-bold text-text-primary">
      댓글 ({comments.length})
    </h3>
  )

  return (
    <ModalTemplete isOpen={isOpen} onClose={onClose} header={header}>
      <div className="py-2 flex flex-col gap-10">
        {comments.length === 0 ? (
          <div className="flex items-center justify-center">
            <p className="text-text-secondary text-sm">댓글이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-component-teirary-background">
                  <Image
                    src={comment.creator.avatar}
                    alt={comment.creator.name}
                    width={40}
                    height={40}
                    className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-red-500"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-text-primary text-sm font-semibold">{comment.creator.name}</span>
                    <span className="text-text-secondary text-xs font-medium">{formatDistanceToNow(new Date(comment.created_at), { locale: ko })}</span>
                  </div>
                  <span className="text-text-primary text-sm">{comment.content}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <div className="w-12 h-12 rounded-full bg-component-teirary-background">
            <Image
              src={user?.profile_image ?? "/DefaultProfile.jpg"}
              alt="DefaultProfile"
              width={40}
              height={40}
              className="w-12 h-12 rounded-full ring-2 ring-offset-2 ring-red-500"
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <TextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글을 입력해주세요"
              fullWidth
            />
            <div className="flex items-center justify-end">
              <SubmitBtn
                submitStatus="idle"
                buttonText={
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCircleArrowUp} />
                    댓글 등록
                  </div>
                }
                successText="등록 완료"
                errorText="등록 실패"
                className="!text-sm !px-4 !py-2"
                fit
              />
            </div>
          </div>
        </div>
      </div>
    </ModalTemplete >
  );
}