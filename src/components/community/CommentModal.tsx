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
import { Comment } from "@/types/community/Post";
import { Trash2 } from "lucide-react";
import { createComment, deleteComment } from "@/hooks/community/getCommunityPostData";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  post_id: number;
}

export default function CommentModal({ isOpen, onClose, comments, post_id }: CommentModalProps) {
  const user = useAuthStore.getState().user;
  const [originalComments, setOriginalComments] = useState<Comment[]>(comments);
  const [comment, setComment] = useState<string>("");

  const handleAddComment = async () => {
    try {
      useAuthStore.getState().setConfirm("댓글을 등록하시겠습니까?", async () => {
        try {
          const data = await createComment(post_id, comment);
          useAuthStore.getState().setAlert("댓글이 성공적으로 등록되었습니다.", "success");
          setOriginalComments(data.reaction.comments);
        } catch (error) {
          console.error('Failed to add comment:', error);
          useAuthStore.getState().setAlert("댓글 등록에 실패했습니다.", "error");
        } finally {
          setComment("");
        }
      });
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleDeleteComment = async (comment_id: number) => {
    try {
      useAuthStore.getState().setConfirm("댓글을 삭제하시겠습니까?", async () => {
        try {
          const data = await deleteComment(post_id, comment_id);
          useAuthStore.getState().setAlert("댓글이 성공적으로 삭제되었습니다.", "success");
          setOriginalComments(data.reaction.comments);
        } catch (error) {
          console.error('Failed to delete comment:', error);
          useAuthStore.getState().setAlert("댓글 삭제에 실패했습니다.", "error");
        }
      });
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const header = (
    <h3 className="text-xl font-bold text-text-primary">
      댓글 ({originalComments.length})
    </h3>
  )

  return (
    <ModalTemplete isOpen={isOpen} onClose={onClose} header={header}>
      <div className="py-2 flex flex-col gap-10">
        {originalComments.length === 0 ? (
          <div className="flex items-center justify-center">
            <p className="text-text-secondary text-sm">댓글이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {originalComments.map((comment) => (
              <div key={comment.id} className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-component-teirary-background">
                    <Image
                      src={comment.user.profile_image}
                      alt={comment.user.name}
                      width={40}
                      height={40}
                      className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-red-500"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-text-primary text-sm font-semibold">{comment.user.name}</span>
                      <span className="text-text-secondary text-xs font-medium">{formatDistanceToNow(new Date(comment.created_at), { locale: ko })}</span>
                    </div>
                    <span className="text-text-primary text-sm">{comment.content}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <Trash2 className="w-4 h-4 hover:text-red-500 cursor-pointer" />
                </button>
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
                onClick={handleAddComment}
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