import ModalTemplete from "@/components/ModalTemplete";
import { blankUserBrief } from "@/types/User";
import { WhiteBoard, CommentCreateFormData } from "@/types/WhiteBoard";
import { useState, useCallback } from "react";
import { Lightbulb, Eye, ThumbsUp, MessageCircle, Download } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faCircleArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/auth/authStore";
import CancelBtn from "@/components/ui/button/CancelBtn";
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import Accordion from "@/components/ui/Accordion";
import { InfoCircle, FileLines, MessageDots } from "flowbite-react-icons/outline";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import Image from "next/image";
import { formatDate } from "date-fns";
import MarkdownEditor from "@/components/ui/MarkdownEditor";
import { useTheme } from "@/contexts/ThemeContext";
import { formatFileSize } from "@/utils/fileSize";
import { useProject } from "@/contexts/ProjectContext";
import { addComment, deleteComment, updateIdea } from "@/hooks/getWhiteBoardData";

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
  const [editorMode, setEditorMode] = useState<"write" | "preview">("preview");
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [commentSubmitStatus, setCommentSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const { isDark } = useTheme();
  const { project } = useProject();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setIdeaData({ ...ideaData, [name]: value });
  };

  const handleContentChange = useCallback(
    (value: string) => {
      setIdeaData({
        ...ideaData,
        documents: [{ ...ideaData.documents[0], content: value }],
      });
    },
    [ideaData]
  );

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
      useAuthStore
        .getState()
        .setAlert("담당자가 아니므로 수정할 수 없습니다.", "warning");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing("none");
    setIdeaData(idea);
    useAuthStore.getState().setAlert("편집 모드를 종료했습니다.", "info");
  };

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const commentInput = form.elements.namedItem(
      "comment"
    ) as HTMLTextAreaElement;
    const commentContent = commentInput.value.trim();

    if (commentContent === "") {
      useAuthStore.getState().setAlert("댓글을 작성해주세요.", "warning");
      return;
    }

    const newComment: CommentCreateFormData = {
      content: commentContent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: user ? user : blankUserBrief,
    };

    setCommentSubmitStatus("submitting");

    try {
      const data = await addComment(
        project?.id ? String(project.id) : "0",
        ideaData.id,
        newComment
      );
      setCommentSubmitStatus("success");
      useAuthStore
        .getState()
        .setAlert("댓글이 성공적으로 추가되었습니다.", "success");

      commentInput.value = "";
      setIdeaData((prev) => ({
        ...prev,
        comments: [
          ...prev.comments,
          {
            id: data.id,
            content: newComment.content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user: user ? user : blankUserBrief,
          },
        ],
      }));
    } catch (error) {
      console.error("Error adding comment:", error);
      setCommentSubmitStatus("error");
      useAuthStore.getState().setAlert("댓글 추가에 실패했습니다.", "error");
    } finally {
      setCommentSubmitStatus("idle");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
      try {
        useAuthStore
          .getState()
          .setConfirm("댓글을 삭제하시겠습니까?", async () => {
            try {
              await deleteComment(ideaData.id, commentId);
              useAuthStore
                .getState()
                .setAlert("댓글이 성공적으로 삭제되었습니다.", "success");
              setIdeaData((prev) => ({
                ...prev,
                comments: prev.comments.filter(
                  (comment) => comment.id !== commentId
                ),
              }));
            } catch (error) {
              console.error("Error deleting comment:", error);
              useAuthStore
                .getState()
                .setAlert("댓글 삭제에 실패했습니다.", "error");
            }
          });
      } catch (error) {
        console.error("Error deleting comment:", error);
        useAuthStore.getState().setAlert("댓글 삭제에 실패했습니다.", "error");
      }
    };

    const handleUpdateIdea = async () => {
      try {
        await updateIdea(
          project?.id ? String(project.id) : "0",
          ideaData.id,
          ideaData
        );
        setSubmitStatus("success");
        useAuthStore
          .getState()
          .setAlert("아이디어가 성공적으로 수정되었습니다.", "success");
        onClose();
      } catch (error) {
        console.error("Error updating idea:", error);
        setSubmitStatus("error");
        useAuthStore.getState().setAlert("아이디어 수정에 실패했습니다.", "error");
      } finally {
        setTimeout(() => {
          setSubmitStatus("idle");
        }, 1000);
      }
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

      {isEditing !== "none" && (
        <div className="flex items-center gap-2">
          <CancelBtn
            handleCancel={handleCancelEdit}
            className="!text-sm"
            withIcon
          />
          <SubmitBtn
            onClick={handleUpdateIdea}
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
    <ModalTemplete isOpen={isOpen} onClose={onClose} header={header}>
      <Accordion title="Overview" icon={InfoCircle} defaultOpen>
        <div className="grid grid-cols-2 gap-4 border border-component-border rounded-lg p-4">
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
                  { name: "type", value: "document", label: "Document" },
                  { name: "type", value: "canvas", label: "Canvas" },
                ]}
                value={ideaData.type}
                onChange={(value) => handleSelectChange("type", value)}
                className="!px-2 !py-0.5 !rounded-full !text-sm"
                likeBadge={true}
                autoWidth
                color="violet"
              />
            ) : (
              <Badge
                content={
                  ideaData.type[0].toUpperCase() + ideaData.type.slice(1)
                }
                color="violet"
                fit
                className="!rounded-full !px-2 !py-0.5 !text-sm"
              />
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-text-secondary text-sm">
              프로젝트 ID
            </h4>
            <span className="text-text-primary font-medium text-sm">
              {ideaData.project_id}
            </span>
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
              <span className="text-text-primary font-medium text-sm">
                {ideaData.creator.name}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-text-secondary text-sm">
              최종 수정자
            </h4>
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
              <span className="text-text-primary font-medium text-sm">
                {ideaData.updater.name}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-text-secondary text-sm">생성일</h4>
            <span className="text-text-primary font-medium text-sm">
              {formatDate(
                new Date(ideaData.created_at),
                "yyyy년 MM월 dd일 hh:mm a"
              )}
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-text-secondary text-sm">
              최종 수정일
            </h4>
            <span className="text-text-primary font-medium text-sm">
              {formatDate(
                new Date(ideaData.updated_at),
                "yyyy년 MM월 dd일 hh:mm a"
              )}
            </span>
          </div>
        </div>
      </Accordion>

      <Accordion title="문서 내용" icon={FileLines}>
        <div className="space-y-4 p-4 border border-component-border rounded-lg">
          <div className="space-y-2">
            <h1 className="text-base font-semibold">문서 1</h1>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <span>
                생성:{" "}
                {formatDate(
                  new Date(ideaData.documents[0].created_at),
                  "yyyy년 MM월 dd일 hh:mm a"
                )}
              </span>
              <span>|</span>
              <span>
                수정:{" "}
                {formatDate(
                  new Date(ideaData.documents[0].updated_at),
                  "yyyy년 MM월 dd일 hh:mm a"
                )}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 group relative">
              <h4 className="font-medium text-text-secondary text-sm">내용</h4>
              <FontAwesomeIcon
                icon={faPencil}
                size="xs"
                className={`${
                  isEditing === "content"
                    ? "text-primary"
                    : "text-text-secondary"
                } hover:text-primary transition-colors`}
                onClick={() => {
                  if (isEditing === "content") {
                    handleEdit("none");
                  } else {
                    handleEdit("content");
                    setEditorMode("write");
                  }
                }}
              />
            </div>
            <MarkdownEditor
              value={ideaData.documents[0].content}
              onChange={handleContentChange}
              placeholder="문서 내용을 작성하세요."
              mode={isEditing === "content" ? editorMode : "preview"}
              disableModeToggle={isEditing !== "content"}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 group relative">
              <span className="text-text-secondary text-sm">태그</span>
              <FontAwesomeIcon
                icon={faPencil}
                size="xs"
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() =>
                  isEditing === "tags" ? handleEdit("none") : handleEdit("tags")
                }
              />
            </div>

            {ideaData.documents[0].tags.length == 0 && (
              <span className="text-text-secondary text-xs">태그 없음</span>
            )}

            {ideaData.documents[0].tags.map((tag, idx) => (
              <Badge
                key={idx}
                content={tag}
                color="pink"
                isDark={isDark}
                className="!text-xs !px-2 !py-0.5 !rounded-full"
                fit
              />
            ))}
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-text-secondary text-sm">첨부파일</span>

            {ideaData.documents[0].attachments.length == 0 && (
              <span className="text-text-secondary text-xs">첨부파일 없음</span>
            )}

            {ideaData.documents[0].attachments.map((attachment, idx) => (
              <div key={idx} className="p-3 border border-component-border rounded-md flex justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-component-tertiary-background">
                    <Download className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-text-primary font-semibold">{attachment.filename}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-text-secondary">{attachment.file_type}</span>
                      <span className="text-xs text-text-secondary">•</span>
                      <span className="text-xs text-text-secondary">{formatFileSize(attachment.file_size)}</span>
                    </div>
                  </div>
                </div>
                <a
                  href={attachment.file_url}
                  className="px-2 py-1 border border-component-border rounded-md bg-transparent hover:bg-component-tertiary-background cursor-pointer"
                  download
                >
                  <span className="text-sm">다운로드</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </Accordion>

      <Accordion
        title={`댓글 (${ideaData.comments && ideaData.comments.length || 0})`}
        icon={MessageDots}
      >
        <div className="flex flex-col gap-2">
          {ideaData?.comments && ideaData?.comments.length > 0 ? (
            ideaData?.comments?.map((comment, index) => (
              <div
                key={index}
                className="bg-component-secondary-background p-4 rounded-md border border-component-border hover:border-component-border-hover transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 relative border border-component-border rounded-full bg-component-tertiary-background flex items-center justify-center">
                    {project?.members.find(
                      (member) => member.user.id === comment?.user.id
                    )?.user.profile_image ? (
                      <Image
                        src={
                          project?.members.find(
                            (member) => member.user.id === comment?.user.id
                          )?.user.profile_image ?? "/DefaultProfile.jpg"
                        }
                        alt="Profile"
                        className="w-full h-full object-fit rounded-full"
                        quality={100}
                        width={40}
                        height={40}
                      />
                    ) : (
                      <p>
                        {project?.members
                          .find(
                            (member) => member.user.id === comment?.user.id
                          )
                          ?.user.name.charAt(0)}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col">
                        <span className="font-semibold text-text-primary">
                          {
                            project?.members.find(
                              (member) => member.user.id === comment?.user.id
                            )?.user.name
                          }
                        </span>
                        <span className="text-xs text-text-secondary">
                          {
                            project?.members.find(
                              (member) => member.user.id === comment?.user.id
                            )?.role
                          }{" "}
                          • {new Date(comment?.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {comment?.user.id === user?.id && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-text-secondary hover:text-red-400 p-1.5 transition-all cursor-pointer"
                          aria-label="댓글 삭제"
                        >
                          <FontAwesomeIcon icon={faTrash} size="sm" />
                        </button>
                      )}
                    </div>
                    <p className="text-text-secondary leading-relaxed">
                      {comment?.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 bg-component-secondary-background border border-dashed border-component-border rounded-md">
              <p className="text-text-secondary mb-1">아직 댓글이 없습니다</p>
              <p className="text-xs text-text-secondary">
                첫 댓글을 작성해보세요
              </p>
            </div>
          )}

          {/* 댓글 입력 폼 */}
          <form className="mt-4" onSubmit={handleCommentSubmit}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 mt-2 relative border border-component-border rounded-full bg-component-tertiary-background flex-shrink-0 flex items-center justify-center">
                {user?.profile_image ? (
                  <Image
                    src={user?.profile_image ?? "/DefaultProfile.jpg"}
                    alt="Profile"
                    className="w-full h-full object-fit rounded-full"
                    quality={100}
                    width={40}
                    height={40}
                  />
                ) : (
                  <p>{user?.name.charAt(0)}</p>
                )}
              </div>
              <div className="flex-1">
                <textarea
                  name="comment"
                  placeholder="댓글을 작성하세요..."
                  className="w-full p-3 rounded-md bg-component-secondary-background border border-component-border text-text-primary hover:border-input-border-hover focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="flex items-center justify-end mt-2">
                  <SubmitBtn
                    submitStatus={commentSubmitStatus}
                    buttonText={
                      <div className="flex items-center gap-1">
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
          </form>
        </div>
      </Accordion>
    </ModalTemplete>
  );
}
