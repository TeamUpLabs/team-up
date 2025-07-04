"use client";

import { useState, useEffect } from "react";
import { Task, Comment } from "@/types/Task";
import ModalTemplete from "@/components/ModalTemplete";
import { useProject } from "@/contexts/ProjectContext";
import { useAuthStore } from "@/auth/authStore";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { SubTask } from "@/types/Task";
import { updateTask, addComment, updateSubtask, deleteTask, deleteComment } from "@/hooks/getTaskData";
import { getCurrentKoreanTimeDate } from "@/utils/dateUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faBullseye, faCheck, faHourglassStart, faHourglassEnd, faTrash, faPlus, faUser, faCircleArrowUp } from "@fortawesome/free-solid-svg-icons";
import { InfoCircle, CalendarWeek, FileCheck, User, Flag, Tag, MessageDots } from "flowbite-react-icons/outline";
import Badge from "@/components/ui/Badge";
import Accordion from "@/components/ui/Accordion";
import Image from "next/image";
import Select from "@/components/ui/Select";
import { getPriorityColorName } from "@/utils/getPriorityColor";
import { getStatusColorName } from "@/utils/getStatusColor";
import DatePicker from "@/components/ui/DatePicker";
import CancelBtn from "@/components/ui/button/CancelBtn";
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import DeleteBtn from "@/components/ui/button/DeleteBtn";
import { Input } from "@/components/ui/Input";
import { useTheme } from "@/contexts/ThemeContext";


interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskModal({ task, isOpen, onClose }: TaskModalProps) {
  const { isDark } = useTheme();
  const { project } = useProject();
  const user = useAuthStore.getState().user;
  const router = useRouter();
  const params = useParams();
  const [isEditing, setIsEditing] = useState<string>("none");
  const [taskData, setTaskData] = useState<Task>(task);
  const [newTag, setNewTag] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [commentSubmitStatus, setCommentSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Update taskData when the task prop changes
  useEffect(() => {
    setTaskData(task);
    console.log(task);
  }, [task]);

  const calculateProgress = (subtasksList: SubTask[]) => {
    if (subtasksList.length === 0 && taskData.status === "done") return 100;
    if (subtasksList.length === 0) return 0;
    const completedTasks = subtasksList.filter(
      (subtask) => subtask.completed
    ).length;
    return Math.round((completedTasks / subtasksList.length) * 100);
  };

  const isUserAssignee = user && task?.assignee?.some((assi) => assi.id === user?.id);

  const handleSubtaskToggle = async (index: number) => {
    if (taskData.status === "done") {
      useAuthStore
        .getState()
        .setAlert(
          "완료된 작업은 수정할 수 없습니다. 취소 후 수정해주세요.",
          "error"
        );
      return;
    }
    const updated = taskData.subtasks.map((subtask, i) =>
      i === index ? { ...subtask, completed: !subtask.completed } : subtask
    );
    setTaskData({ ...taskData, subtasks: updated });

    try {
      await updateSubtask(
        project?.id ? String(project.id) : "0",
        task.id,
        updated[index]
      );
    } catch (error) {
      console.error("Error updating subtask:", error);
    }
  };

  const handleSubtaskChange = (index: number, value: string) => {
    const updatedSubtasks = taskData.subtasks.map((subtask, i) =>
      i === index ? { ...subtask, title: value } : subtask
    );
    setTaskData({ ...taskData, subtasks: updatedSubtasks });
  };

  const handleAssigneeClick = (assiId: number) => {
    localStorage.setItem("selectedAssiId", assiId.toString());

    const projectId = params?.projectId ? String(params.projectId) : "default";
    router.push(`/platform/${projectId}/members`);

    onClose();
  };

  const handleMilestoneClick = (milestoneId: number) => {
    localStorage.setItem("selectedMilestoneId", milestoneId.toString());

    const projectId = params?.projectId ? String(params.projectId) : "default";
    router.push(`/platform/${projectId}/milestone`);

    onClose();
  };

  const handleEdit = (name: string) => {
    if (user && taskData.assignee?.some((assi) => assi.id === user?.id)) {
      setIsEditing(name);
      if (name !== "none") {
        useAuthStore.getState().setAlert("편집 모드로 전환되었습니다.", "info");
      } else {
        useAuthStore.getState().setAlert("편집 모드를 종료했습니다.", "info");
      }
    } else {
      useAuthStore
        .getState()
        .setAlert("작업을 수정할 권한이 없습니다.", "error");
    }
    if (isEditing === "subtasks") {
      // Remove subtasks with empty titles when finishing edit
      const filteredSubtasks = taskData.subtasks.filter(
        (subtask) => subtask.title.trim() !== ""
      );
      setTaskData((prev) => ({
        ...prev,
        subtasks: filteredSubtasks,
      }));
    }
  };

  const handleSave = async () => {
    setSubmitStatus('submitting');
    try {
      await updateTask(project?.id ? String(project.id) : "0", task.id, {
        ...taskData,
        assignee_id: taskData.assignee?.map((a) => a.id) ?? [],
        createdAt: taskData.createdAt,
        updatedAt: getCurrentKoreanTimeDate(),
        endDate: taskData.endDate ?? "",
        startDate: taskData.startDate ?? "",
        subtasks: taskData.subtasks,
        comments: taskData.comments,
        milestone_id: taskData.milestone_id,
        tags: taskData.tags,
        priority: taskData.priority,
        status: taskData.status,
      });

      useAuthStore.getState().setAlert("작업 수정에 성공했습니다.", "success");
      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error updating task:", error);
      setSubmitStatus('error');
      useAuthStore.getState().setAlert("작업 수정에 실패했습니다.", "error");
    } finally {
      setIsEditing("none");
      setSubmitStatus('idle');
    }
  };

  const handleSelectChange = (name: string, value: string | string[]) => {
    setTaskData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleDelete = () => {
    useAuthStore.getState().setConfirm("작업을 삭제하시겠습니까?", async () => {
      try {
        await deleteTask(project?.id ?? "", task.id);
        useAuthStore
          .getState()
          .setAlert("작업 삭제에 성공했습니다.", "success");
        useAuthStore.getState().clearConfirm();
      } catch (error) {
        console.error("Error deleting task:", error);
        useAuthStore.getState().setAlert("작업 삭제에 실패했습니다.", "error");
      } finally {
        setIsEditing("none");
        setSubmitStatus('idle');
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      if (newTag.trim() !== "") {
        setTaskData({
          ...taskData,
          tags: [...taskData.tags, newTag.trim()],
        });
        setNewTag("");
      }
    }
  };

  const handleCancelEdit = () => {
    setTaskData(task);
    setIsEditing("none");
    useAuthStore.getState().setAlert("편집 모드를 종료했습니다.", "info");
  };

  const handleRemoveTag = (tagIndex: number) => {
    const updatedTags = taskData.tags.filter((_, index) => index !== tagIndex);
    setTaskData({
      ...taskData,
      tags: updatedTags,
    });
  };

  const handleDeleteSubtask = (index: number) => {
    const updatedSubtasks = taskData.subtasks.filter((_, i) => i !== index);
    setTaskData({ ...taskData, subtasks: updatedSubtasks });
  };

  const handleAddSubtask = () => {
    const newSubtask: SubTask = {
      id: Date.now() + Math.floor(Math.random() * 10000),
      title: "",
      completed: false,
    };
    setTaskData({
      ...taskData,
      subtasks: [...taskData.subtasks, newSubtask],
    });
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

    const newComment: Comment = {
      id: Date.now() + Math.floor(Math.random() * 10000),
      author_id: user?.id ?? 0,
      content: commentContent,
      createdAt: getCurrentKoreanTimeDate(),
    };

    setCommentSubmitStatus('submitting');

    try {
      await addComment(
        project?.id ? String(project.id) : "0",
        task.id,
        newComment
      );
      setCommentSubmitStatus('success');
      useAuthStore.getState().setAlert("댓글이 성공적으로 추가되었습니다.", "success");

      commentInput.value = "";

      setTaskData((prev) => ({
        ...prev,
        comments: [...prev.comments, newComment],
      }));
    } catch (error) {
      console.error("Error adding comment:", error);
      setCommentSubmitStatus('error');
      useAuthStore.getState().setAlert("댓글 추가에 실패했습니다.", "error");
    } finally {
      setCommentSubmitStatus('idle');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    console.log(commentId);
    try {
      useAuthStore.getState().setConfirm("댓글을 삭제하시겠습니까?", async () => {
        try {
          await deleteComment(project?.id ? String(project.id) : "0", task.id, commentId);
          useAuthStore.getState().setAlert("댓글이 성공적으로 삭제되었습니다.", "success");
          setTaskData((prev) => ({
            ...prev,
            comments: prev.comments.filter((comment) => comment.id !== commentId),
          }));
        } catch (error) {
          console.error("Error deleting comment:", error);
          useAuthStore.getState().setAlert("댓글 삭제에 실패했습니다.", "error");
        }
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      useAuthStore.getState().setAlert("댓글 삭제에 실패했습니다.", "error");
    }
  };

  useEffect(() => {
    if (task?.subtasks) {
      setTaskData((prev) => ({ ...prev, subtasks: task.subtasks }));
    }
  }, [task?.subtasks]);

  // Calculate progress based on current subtasks state
  const progress = calculateProgress(taskData.subtasks);

  const modalHeader = (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faBullseye}
          />
          {isEditing === "title" ? (
            <Input
              type="text"
              name="title"
              value={taskData?.title}
              onChange={handleChange}
              className="!text-xl font-semibold !py-1 !px-2"
              placeholder="작업 제목을 입력하세요"
            />
          ) : (
            <div className="flex items-center gap-2 group relative">
              <span className="text-xl font-semibold text-text-primary">
                {taskData?.title}
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
        </div>
        <div className="flex flex-wrap gap-2">
          {taskData?.milestone_id ? (
            <Badge
              content={project?.milestones?.find((milestone) => milestone.id === taskData?.milestone_id)?.title}
              color="teal"
              isEditable={false}
              className="!rounded-full !px-2 !py-0.5 cursor-pointer"
              onClick={() => handleMilestoneClick(taskData?.milestone_id ?? 0)}
              isDark={isDark}
            />
          ) : (
            <Badge
              content="미등록"
              color="teal"
              isEditable={false}
              className="!rounded-full !px-2 !py-0.5 cursor-pointer"
              isDark={isDark}
            />
          )}
          {isEditing === "status" ? (
            <Select
              options={[
                { name: "status", value: "not-started", label: "NOT STARTED" },
                { name: "status", value: "in-progress", label: "IN PROGRESS" },
                { name: "status", value: "done", label: "Done" },
              ]}
              value={taskData.status}
              onChange={(value) => handleSelectChange("status", value as string)}
              color={getStatusColorName(taskData.status)}
              className="px-3 py-1 rounded-full text-sm"
            />
          ) : (
            <div className="flex items-center gap-2 group relative">
              <Badge
                content={taskData.status.replace('-', ' ').toUpperCase()}
                color={getStatusColorName(taskData.status)}
                isEditable={false}
                className="!rounded-full !px-2 !py-0.5"
                isDark={isDark}
              />
              <FontAwesomeIcon
                icon={faPencil}
                size="xs"
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() =>
                  isEditing === "status" ? handleEdit("none") : handleEdit("status")
                }
              />
            </div>
          )}
          {isEditing === "priority" ? (
            <Select
              options={[
                { name: "priority", value: "high", label: "HIGH" },
                { name: "priority", value: "medium", label: "MEDIUM" },
                { name: "priority", value: "low", label: "LOW" },
              ]}
              value={taskData.priority}
              onChange={(value) => handleSelectChange("priority", value as string)}
              color={getPriorityColorName(taskData.priority)}
              className="px-3 py-1 rounded-full text-sm"
            />
          ) : (
            <div className="flex items-center gap-2 group relative">
              <Badge
                content={
                  <div className="flex items-center gap-1">
                    <Flag className="w-4 h-4" />
                    {taskData.priority.toUpperCase()}
                  </div>
                }
                color={getPriorityColorName(taskData.priority)}
                isEditable={false}
                className="!rounded-full !px-2 !py-0.5"
                isDark={isDark}
              />
              <FontAwesomeIcon
                icon={faPencil}
                size="xs"
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() =>
                  isEditing === "priority" ? handleEdit("none") : handleEdit("priority")
                }
              />
            </div>
          )}
        </div>
      </div>
      {(isUserAssignee && isEditing !== "none") && (
        <div className="flex items-center gap-2">
          <CancelBtn
            handleCancel={handleCancelEdit}
            className="!text-sm"
            withIcon
          />
          <SubmitBtn
            onClick={handleSave}
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
  )

  const modalFooter =
    isEditing !== "none" ? (
      <DeleteBtn
        handleDelete={handleDelete}
        className="!text-sm justify-self-end"
        text="작업 삭제"
        withIcon
      />
    ) : null;

  return (
    <ModalTemplete
      isOpen={isOpen}
      onClose={onClose}
      header={modalHeader}
      footer={modalFooter}
    >
      {/* Overview Accordian */}
      <Accordion
        title="Overview"
        icon={InfoCircle}
        defaultOpen
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 group relative">
              <h4 className="font-medium">Description</h4>
              <FontAwesomeIcon
                icon={faPencil}
                size="xs"
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() =>
                  isEditing === "description" ? handleEdit("none") : handleEdit("description")
                }
              />
            </div>
            {isEditing === "description" ? (
              <textarea
                name="description"
                value={taskData.description}
                onChange={handleChange}
                className="w-full p-3 rounded-md m-auto bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo resize-none"
                placeholder="작업의 설명을 작성하세요"
              />
            ) : (
              taskData.description ? (
                <p className="text-muted-foreground leading-relaxed">{taskData.description}</p>
              ) : (
                <p className="text-text-secondary">작업의 설명이 없습니다.</p>
              )
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Created</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(task.createdAt).toLocaleDateString()} by {project?.members.find((member) => member.id === task.createdBy)?.name}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Last Updated</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(task.updatedAt).toLocaleDateString()} by {project?.members.find((member) => member.id === task.updatedBy)?.name}
              </p>
            </div>
          </div>
        </div>
      </Accordion>

      {/* Timeline Accordian */}
      <Accordion
        title="Timeline"
        icon={CalendarWeek}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 bg-component-secondary-background border border-component-border p-3 rounded-md">
            <div className="flex items-center gap-2 group relative">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faHourglassStart} color="green" />
                <h4 className="font-medium">Start Date</h4>
              </div>
              <FontAwesomeIcon
                icon={faPencil}
                size="xs"
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() =>
                  isEditing === "startDate" ? handleEdit("none") : handleEdit("startDate")
                }
              />
            </div>
            {isEditing === "startDate" ? (
              <DatePicker
                value={taskData.startDate ? new Date(taskData.startDate) : undefined}
                onChange={(date: Date | undefined) => {
                  if (date) {
                    setTaskData({ ...taskData, startDate: date ? date.toISOString().split("T")[0] : undefined });
                  }
                }}
                className="text-sm"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {taskData.startDate}
              </p>
            )}
          </div>
          <div className="space-y-2 bg-component-secondary-background border border-component-border p-3 rounded-md">
            <div className="flex items-center gap-2 group relative">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faHourglassEnd} color="red" />
                <h4 className="font-medium">End Date</h4>
              </div>
              <FontAwesomeIcon
                icon={faPencil}
                size="xs"
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() =>
                  isEditing === "endDate" ? handleEdit("none") : handleEdit("endDate")
                }
              />
            </div>
            {isEditing === "endDate" ? (
              <DatePicker
                value={taskData.endDate ? new Date(taskData.endDate) : undefined}
                onChange={(date: Date | undefined) => {
                  if (date) {
                    setTaskData({ ...taskData, endDate: date ? date.toISOString().split("T")[0] : undefined });
                  }
                }}
                minDate={taskData.startDate ? new Date(taskData.startDate) : undefined}
                className="text-sm"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {taskData.endDate}
              </p>
            )}
          </div>
        </div>
      </Accordion>

      {/* Progress & Subtasks Accordian */}
      <Accordion
        title={`Progress & Subtasks (${taskData.subtasks && taskData.subtasks.filter(subtask => subtask.completed).length}/${taskData.subtasks && taskData.subtasks.length || 0})`}
        icon={FileCheck}
        defaultOpen
      >
        <div className="space-y-4">
          <div className="bg-component-secondary-background border border-component-border p-3 rounded-md">
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-point-color-indigo rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            {taskData.subtasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-6">
                <span className="text-text-secondary">하위 작업이 없습니다.</span>
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="w-full flex items-center justify-center gap-2 bg-component-tertiary-background hover:bg-component-tertiary-background/60 border border-component-border p-3 rounded-md text-text-primary transition-colors"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  새 하위 작업 추가
                </button>
              </div>
            ) : (
              taskData.subtasks.map((subtask, index) => (
                <div key={index} className="flex items-center bg-component-secondary-background border border-component-border p-3 rounded-md justify-between group relative">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => handleSubtaskToggle(index)}
                      className="w-4 h-4 rounded border-gray-300 text-point-color-indigo focus:ring-point-color-indigo"
                    />
                    {isEditing === "subtasks" ? (
                      <>
                        <Input
                          type="text"
                          value={subtask.title}
                          onChange={(e) => handleSubtaskChange(index, e.target.value)}
                          className="!text-sm !p-1"
                        />
                      </>
                    ) : (
                      <span
                        className={`text-sm ${subtask?.completed
                          ? "text-text-secondary line-through"
                          : "text-text-primary"
                          }`}
                      >
                        {subtask?.title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      icon={faPencil}
                      size="xs"
                      className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() =>
                        isEditing === "subtasks" ? handleEdit("none") : handleEdit("subtasks")
                      }
                    />
                    {isEditing === "subtasks" && (
                      <FontAwesomeIcon
                        icon={faTrash}
                        size="xs"
                        className="text-text-secondary cursor-pointer hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={() => handleDeleteSubtask(index)}
                      />
                    )}
                  </div>
                </div>
              ))
            )}
            {isEditing === "subtasks" && taskData.subtasks.length > 0 && (
              <button
                type="button"
                onClick={handleAddSubtask}
                className="w-full flex items-center justify-center gap-2 bg-component-tertiary-background hover:bg-component-tertiary-background/60 border border-component-border p-3 rounded-md text-text-primary transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} />
                새 하위 작업 추가
              </button>
            )}
          </div>
        </div>
      </Accordion>

      {/* Assignee Accordian */}
      <Accordion
        title={`Assignees (${taskData.assignee && taskData.assignee.length || 0})`}
        icon={User}
      >
        <div className="space-y-2">
          {isEditing === "assignee" ? (
            <div className="border border-component-border rounded-md p-3 bg-component-secondary-background hover:border-component-border-hover transition-all">
              <div className="mb-3">
                <p className="text-sm text-text-secondary">
                  선택된 담당자:{" "}
                  {taskData.assignee?.length ?? 0 > 0
                    ? `${taskData.assignee?.length}명`
                    : "없음"}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project?.milestones?.find((milestone) => taskData.milestone_id === milestone.id)?.assignee?.map((member) => {
                  const isSelected = taskData.assignee?.some(
                    (a) => a.id === member.id
                  );
                  return (
                    <div
                      key={member.id}
                      onClick={() => {
                        if (isSelected) {
                          if (
                            taskData.assignee?.length &&
                            taskData.assignee?.length > 1
                          ) {
                            setTaskData({
                              ...taskData,
                              assignee: taskData.assignee?.filter(
                                (a) => a.id !== member.id
                              ),
                            });
                          } else {
                            useAuthStore
                              .getState()
                              .setAlert(
                                "최소 한 명의 담당자는 필요합니다.",
                                "warning"
                              );
                          }
                        } else {
                          setTaskData({
                            ...taskData,
                            assignee: [...(taskData.assignee ?? []), member],
                          });
                        }
                      }}
                      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all duration-200 ${isSelected
                        ? "bg-purple-500/20 border border-purple-500/50"
                        : "bg-component-tertiary-background border border-component-border hover:bg-component-tertiary-background/60"
                        }`}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-component-secondary-background flex items-center justify-center overflow-hidden">
                          <div className="relative w-full h-full flex items-center justify-center border border-component-border rounded-full">
                            {member.profileImage ? (
                              <Image
                                src={member.profileImage}
                                alt="Profile"
                                className={`rounded-full absolute text-text-secondary transform transition-all duration-300 ${isSelected
                                  ? "opacity-0 rotate-90 scale-0"
                                  : "opacity-100 rotate-0 scale-100"
                                  }`}
                                quality={100}
                                width={60}
                                height={60}
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/DefaultProfile.jpg";
                                }}
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faUser}
                                className={`absolute text-text-secondary transform transition-all duration-300 ${isSelected
                                  ? "opacity-0 rotate-90 scale-0"
                                  : "opacity-100 rotate-0 scale-100"
                                  }`}
                              />
                            )}
                            <FontAwesomeIcon
                              icon={faCheck}
                              className={`absolute text-text-secondary transform transition-all duration-300 ${isSelected
                                ? "opacity-100 rotate-0 scale-100"
                                : "opacity-0 -rotate-90 scale-0"
                                }`}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-text-primary">
                          {member.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 border border-component-border rounded-md p-3 bg-component-secondary-background hover:border-component-border-hover">
              <div className="flex items-center gap-2 group relative">
                <p className="text-sm text-text-secondary">
                  담당자:{" "}
                  {taskData.assignee?.length ?? 0 > 0
                    ? `${taskData.assignee?.length}명`
                    : "없음"}
                </p>
                <FontAwesomeIcon
                  icon={faPencil}
                  size="xs"
                  className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() =>
                    isEditing === "assignee" ? handleEdit("none") : handleEdit("assignee")
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {taskData?.assignee?.map((assi) => (
                  <div
                    key={assi?.id}
                    className="flex items-center gap-3 p-2 rounded-md bg-component-tertiary-background border border-component-border transform transition-all duration-300 hover:bg-component-tertiary-background/60 hover:border-point-color-indigo cursor-pointer"
                    onClick={() => handleAssigneeClick(assi?.id ?? 0)}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-component-secondary-background flex items-center justify-center overflow-hidden">
                        <div className="relative w-full h-full flex items-center justify-center border border-component-border rounded-full">
                          {assi.profileImage ? (
                            <Image
                              src={assi.profileImage}
                              alt="Profile"
                              quality={100}
                              className="rounded-full"
                              width={60}
                              height={60}
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/DefaultProfile.jpg";
                              }}
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faUser}
                              className={`absolute text-text-secondary transform transition-all duration-300`}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-text-primary">
                        {assi.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {assi.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Accordion>

      {/* Tag Accordian */}
      <Accordion
        title={`Tags & Labels (${taskData.tags && taskData.tags.length || 0})`}
        icon={Tag}
      >
        <div className="flex flex-wrap gap-2 py-1">
          {isEditing === "tags" ? (
            <>
              {taskData.tags.map((tag, index) => (
                <Badge
                  key={index}
                  content={tag}
                  color="pink"
                  isEditable={true}
                  onRemove={() => handleRemoveTag(index)}
                  isDark={isDark}
                />
              ))}
              <div className="flex">
                <Input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  placeholder="새 태그 추가"
                  className="h-full"
                />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 group relative">
              {taskData?.tags.length === 0 ? (
                <p className="text-text-secondary">태그가 없습니다.</p>
              ) : (
                taskData?.tags.map((tag, index) => (
                  <Badge key={index} content={tag} color="pink" isDark={isDark} />
                ))
              )}
              <FontAwesomeIcon
                icon={faPencil}
                size="xs"
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() =>
                  isEditing === "tags" ? handleEdit("none") : handleEdit("tags")
                }
              />
            </div>
          )}
        </div>
      </Accordion>

      {/* Comment Accordian */}
      <Accordion
        title={`Comments (${taskData?.comments && taskData?.comments.length || 0})`}
        icon={MessageDots}
      >
        <div className="flex flex-col gap-2">
          {taskData?.comments && taskData?.comments.length > 0 ? (
            taskData?.comments?.map((comment, index) => (
              <div
                key={index}
                className="bg-component-secondary-background p-4 rounded-md border border-component-border hover:border-component-border-hover transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 relative border border-component-border rounded-full bg-component-tertiary-background flex items-center justify-center">
                    {project?.members.find(
                      (member) => member.id === comment?.author_id
                    )?.profileImage ? (
                      <Image
                        src={
                          project?.members.find(
                            (member) => member.id === comment?.author_id
                          )?.profileImage ?? "/DefaultProfile.jpg"
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
                          .find((member) => member.id === comment?.author_id)
                          ?.name.charAt(0)}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col">
                        <span className="font-semibold text-text-primary">
                          {
                            project?.members.find(
                              (member) => member.id === comment?.author_id
                            )?.name
                          }
                        </span>
                        <span className="text-xs text-text-secondary">
                          {
                            project?.members.find(
                              (member) => member.id === comment?.author_id
                            )?.role
                          }{" "}
                          •{" "}
                          {new Date(comment?.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {comment?.author_id === user?.id && (
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
                {user?.profileImage ? (
                  <Image
                    src={user?.profileImage ?? "/DefaultProfile.jpg"}
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