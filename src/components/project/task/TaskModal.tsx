"use client";

import { useState, useEffect } from 'react';
import { Task } from '@/types/Task';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faUser, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getPriorityColor } from '@/utils/getPriorityColor';
import { SubTask, Comment } from '@/types/Task';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { getStatusColor } from '@/utils/getStatusColor';
import { useProject } from '@/contexts/ProjectContext';
import { useAuthStore } from '@/auth/authStore';
import { deleteTask, updateTask, addComment, updateSubtask } from '@/hooks/getTaskData';
import ModalTemplete from '@/components/ModalTemplete';
import Badge from '@/components/Badge';
import { getCurrentKoreanTimeDate } from '@/utils/dateUtils';
import Image from 'next/image';

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskModal({ task, isOpen, onClose }: TaskModalProps) {
  const { project } = useProject();
  const user = useAuthStore.getState().user;
  const router = useRouter();
  const params = useParams();
  const [isEditing, setIsEditing] = useState<string>("none");
  const [taskData, setTaskData] = useState<Task>(task);
  const [newTag, setNewTag] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  
  // Update taskData when the task prop changes
  useEffect(() => {
    setTaskData(task);
  }, [task]);

  const calculateProgress = (subtasksList: SubTask[]) => {
    if (subtasksList.length === 0 && taskData.status === "done") return 100;
    if (subtasksList.length === 0) return 0;
    const completedTasks = subtasksList.filter(subtask => subtask.completed).length;
    return Math.round((completedTasks / subtasksList.length) * 100);
  };

  const isUserAssignee = task?.assignee?.some(assi => assi.id === user?.id);

  const handleSubtaskToggle = async (index: number) => {
    if (taskData.status === "done") {
      useAuthStore.getState().setAlert("완료된 작업은 수정할 수 없습니다. 취소 후 수정해주세요.", "error");
      return;
    }
    const updated = taskData.subtasks.map((subtask, i) =>
      i === index ? { ...subtask, completed: !subtask.completed } : subtask
    );
    setTaskData({ ...taskData, subtasks: updated });

    try {
      await updateSubtask(project?.id ? String(project.id) : "0", task.id, updated[index]);
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
    localStorage.setItem('selectedAssiId', assiId.toString());

    const projectId = params?.projectId ? String(params.projectId) : 'default';
    router.push(`/platform/${projectId}/members`);

    onClose();
  };

  const handleMilestoneClick = (milestoneId: number) => {
    localStorage.setItem('selectedMilestoneId', milestoneId.toString());

    const projectId = params?.projectId ? String(params.projectId) : 'default';
    router.push(`/platform/${projectId}/milestone`);

    onClose();
  };

  const handleEdit = (name: string) => {
    if (taskData.assignee?.some(assi => assi.id === user?.id)) {
      setIsEditing(name);
      if (name !== "none") {
        useAuthStore.getState().setAlert("편집 모드로 전환되었습니다.", "info");
      } else {
        useAuthStore.getState().setAlert("편집 모드를 종료했습니다.", "info");
      }
    } else {
      useAuthStore.getState().setAlert("작업을 수정할 권한이 없습니다.", "error");
    }
    if (isEditing === "subtasks") {
      // Remove subtasks with empty titles when finishing edit
      const filteredSubtasks = taskData.subtasks.filter(subtask => subtask.title.trim() !== '');
      setTaskData(prev => ({
        ...prev,
        subtasks: filteredSubtasks
      }));
    }
  };

  const handleSave = async () => {
    try {
      await updateTask(project?.id ? String(project.id) : "0", task.id, {
        ...taskData,
        assignee_id: taskData.assignee?.map(a => a.id) ?? [],
        createdAt: taskData.createdAt,
        updatedAt: getCurrentKoreanTimeDate(),
        dueDate: taskData.dueDate ?? '',
        subtasks: taskData.subtasks,
        comments: taskData.comments,
        milestone_id: taskData.milestone_id,
        tags: taskData.tags,
        priority: taskData.priority,
        status: taskData.status,
      });

      useAuthStore.getState().setAlert("작업 수정에 성공했습니다.", "success");
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
      useAuthStore.getState().setAlert("작업 수정에 실패했습니다.", "error");
    } finally {
      setIsEditing("none");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleDelete = () => {
    useAuthStore.getState().setConfirm("작업을 삭제하시겠습니까?", async () => {
      try {
        await deleteTask(project?.id ?? "", task.id);
        useAuthStore.getState().setAlert("작업 삭제에 성공했습니다.", "success");
        useAuthStore.getState().clearConfirm();
        onClose();
      } catch (error) {
        console.error("Error deleting task:", error);
        useAuthStore.getState().setAlert("작업 삭제에 실패했습니다.", "error");
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();
      if (newTag.trim() !== '') {
        setTaskData({
          ...taskData,
          tags: [...taskData.tags, newTag.trim()]
        });
        setNewTag('');
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
      tags: updatedTags
    });
  };

  const handleDeleteSubtask = (index: number) => {
    const updatedSubtasks = taskData.subtasks.filter((_, i) => i !== index);
    setTaskData({ ...taskData, subtasks: updatedSubtasks });
  };

  const handleAddSubtask = () => {
    const newSubtask: SubTask = {
      id: Date.now() + Math.floor(Math.random() * 10000),
      title: '',
      completed: false
    };
    setTaskData({
      ...taskData,
      subtasks: [...taskData.subtasks, newSubtask]
    });
  };

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const commentInput = form.elements.namedItem('comment') as HTMLTextAreaElement;
    const commentContent = commentInput.value.trim();

    if (commentContent === '') {
      useAuthStore.getState().setAlert("댓글을 작성해주세요.", "warning");
      return;
    }

    const newComment: Comment = {
      author_id: user?.id ?? 0,
      content: commentContent,
      createdAt: getCurrentKoreanTimeDate(),
    };

    try {
      await addComment(project?.id ? String(project.id) : "0", task.id, newComment);
      commentInput.value = '';

      setTaskData(prev => ({
        ...prev,
        comments: [...prev.comments, newComment]
      }));
    } catch (error) {
      console.error("Error adding comment:", error);
      useAuthStore.getState().setAlert("댓글 추가에 실패했습니다.", "error");
    }
  };

  useEffect(() => {
    if (task?.subtasks) {
      setTaskData(prev => ({ ...prev, subtasks: task.subtasks }));
    }
  }, [task?.subtasks]);

  // Calculate progress based on current subtasks state
  const progress = calculateProgress(taskData.subtasks);

  // Header section for ModalTemplete
  const modalHeader = (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        {isEditing === "title" ? (
          <input
            type="text"
            name="title"
            value={taskData?.title}
            onChange={handleChange}
            className="text-lg p-2 rounded-lg bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
            placeholder="작업 제목을 입력하세요"
          />
        ) : (
          <div className="flex items-center gap-2 group relative">
            <h3 className="text-2xl font-semibold text-text-primary">{taskData?.title}</h3>
            <FontAwesomeIcon
              icon={faPencil}
              size='xs'
              className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={() => isEditing === "title" ? handleEdit("none") : handleEdit("title")}
            />
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {isEditing === "tags" ? (
            <>
              {taskData.tags.map((tag, index) => (
                <Badge key={index} content={tag} color="pink" isEditable={true} onRemove={() => handleRemoveTag(index)} />
              ))}
              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  placeholder="새 태그 추가"
                  className="px-2 rounded-md bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
                />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 group relative">
              {taskData?.tags.map((tag, index) => (
                <Badge key={index} content={tag} color="pink" />
              ))}
              <FontAwesomeIcon
                icon={faPencil}
                size='xs'
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => isEditing === "tags" ? handleEdit("none") : handleEdit("tags")}
              />
            </div>
          )}
        </div>
      </div>
      {isUserAssignee && (
        <div className="flex items-center gap-2">
          {isEditing !== "none" && (
            <>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-1.5 text-sm bg-cancel-button-background hover:bg-cancel-button-background-hover text-white px-3 py-2 rounded-md transition-all duration-200 font-medium"
              >
                취소
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 text-sm bg-point-color-indigo hover:bg-point-color-indigo-hover text-white px-3 py-2 rounded-md transition-all duration-200 font-medium"
              >
                <FontAwesomeIcon icon={faCheck} />
                저장
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );

  // Footer section for ModalTemplete (only if user is assignee)
  const modalFooter = isEditing !== "none" ? (
    <div className="flex gap-2 justify-end">
      <button
        onClick={handleDelete}
        className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-4 py-2 rounded-md transition-all duration-200 font-medium"
        aria-label="작업 삭제"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        작업 삭제
      </button>
    </div>
  ) : null;

  return (
    <ModalTemplete
      header={modalHeader}
      footer={modalFooter}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 group relative">
            <h4 className="text-base font-medium text-text-primary">상세 설명</h4>
            <FontAwesomeIcon
              icon={faPencil}
              size='xs'
              className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={() => isEditing === "description" ? handleEdit("none") : handleEdit("description")}
            />
          </div>
          {isEditing === "description" ? (
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo resize-none"
              placeholder="작업의 설명을 작성하세요"
            />
          ) : (
            <div className="bg-component-secondary-background p-4 rounded-lg">
              <p className="text-text-secondary">{taskData.description}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 group relative">
              <h4 className="font-medium text-text-primary">상태</h4>
              <FontAwesomeIcon
                icon={faPencil}
                size='xs'
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => isEditing === "status" ? handleEdit("none") : handleEdit("status")}
              />
            </div>
            {isEditing === "status" ? (
              <select
                name="status"
                value={taskData.status}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
              >
                <option value="not-started">준비</option>
                <option value="in-progress">진행 중</option>
                <option value="completed">완료</option>
              </select>
            ) : (
              <div className="bg-component-secondary-background p-4 rounded-lg">
                <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(taskData.status)}`}>
                  {taskData.status === 'not-started' ? '준비' : taskData.status === 'in-progress' ? '진행 중' : '완료'}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 group relative">
              <h4 className="font-medium text-text-primary">우선순위</h4>
              <FontAwesomeIcon
                icon={faPencil}
                size='xs'
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => isEditing === "priority" ? handleEdit("none") : handleEdit("priority")}
              />
            </div>
            {isEditing === "priority" ? (
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
              >
                <option value="high">높음</option>
                <option value="medium">중간</option>
                <option value="low">낮음</option>
              </select>
            ) : (
              <div className="bg-component-secondary-background p-4 rounded-lg">
                <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium
              ${getPriorityColor(taskData.priority)}`}>
                  {taskData.priority === 'high' ? '높음' : taskData.priority === 'medium' ? '중간' : '낮음'}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 group relative">
              <h4 className="font-medium text-text-primary">담당자</h4>
              <FontAwesomeIcon
                icon={faPencil}
                size='xs'
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => isEditing === "assignee" ? handleEdit("none") : handleEdit("assignee")}
              />
            </div>
            {isEditing === "assignee" ? (
              <div className="border border-component-border rounded-lg p-3 bg-component-secondary-background hover:border-component-border-hover transition-all">
                <div className="mb-3">
                  <p className="text-sm text-text-secondary">선택된 담당자: {taskData.assignee?.length ?? 0 > 0 ? `${taskData.assignee?.length}명` : '없음'}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project?.members.map((member) => {
                    const isSelected = taskData.assignee?.some(a => a.id === member.id);
                    return (
                      <div
                        key={member.id}
                        onClick={() => {
                          if (isSelected) {
                            if (taskData.assignee?.length && taskData.assignee?.length > 1) {
                              setTaskData({
                                ...taskData,
                                assignee: taskData.assignee?.filter(a => a.id !== member.id),
                              });
                            } else {
                              useAuthStore.getState().setAlert("최소 한 명의 담당자는 필요합니다.", "warning");
                            }
                          } else {
                            setTaskData({
                              ...taskData,
                              assignee: [...taskData.assignee ?? [], member],
                            });
                          }
                        }}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${isSelected
                          ? 'bg-purple-500/20 border border-purple-500/50'
                          : 'bg-component-tertiary-background border border-transparent hover:bg-component-tertiary-background/60'
                          }`}
                      >
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-component-secondary-background flex items-center justify-center overflow-hidden">
                            <div className="relative w-full h-full flex items-center justify-center">
                              <FontAwesomeIcon
                                icon={faUser}
                                className={`absolute text-text-secondary transform transition-all duration-300 ${isSelected
                                  ? 'opacity-0 rotate-90 scale-0'
                                  : 'opacity-100 rotate-0 scale-100'
                                  }`}
                              />
                              <FontAwesomeIcon
                                icon={faCheck}
                                className={`absolute text-text-secondary transform transition-all duration-300 ${isSelected
                                  ? 'opacity-100 rotate-0 scale-100'
                                  : 'opacity-0 -rotate-90 scale-0'
                                  }`}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-text-primary">{member.name}</p>
                          <p className="text-xs text-text-secondary">{member.role}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 bg-component-secondary-background p-4 rounded-lg">
                {
                  taskData?.assignee?.map((assi) => (
                    <p
                      key={assi?.id}
                      className="text-text-secondary hover:text-blue-400 cursor-pointer transition-colors"
                      onClick={() => handleAssigneeClick(assi?.id ?? 0)}
                    >{
                        assi?.name}
                    </p>
                  ))
                }
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 group relative">
              <h4 className="font-medium text-text-primary">마감일</h4>
              <FontAwesomeIcon
                icon={faPencil}
                size='xs'
                className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => isEditing === "dueDate" ? handleEdit("none") : handleEdit("dueDate")}
              />
            </div>
            {isEditing === "dueDate" ? (
              <input
                type="date"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
              />
            ) : (
              <div className="bg-component-secondary-background p-4 rounded-lg">
                <p className="text-text-secondary">{taskData.dueDate}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-text-primary">마일스톤</h4>
          <p
            className="text-text-secondary bg-component-secondary-background p-4 rounded-lg cursor-pointer hover:text-point-color-purple-hover transition-colors"
            onClick={() => handleMilestoneClick(taskData?.milestone_id ?? 0)}
          >
            {project?.milestones.find(milestone => milestone.id === taskData?.milestone_id)?.title}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-text-primary">진행률</h4>
          <div className="w-full bg-component-secondary-background hover:bg-component-secondary-background/80 rounded-full h-2.5">
            <div
              className="bg-point-color-purple h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-right text-sm text-text-secondary mt-1">{progress}%</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 group relative">
            <h4 className="font-medium text-text-primary">하위 작업</h4>
            <FontAwesomeIcon
              icon={faPencil}
              size='xs'
              className="text-text-secondary cursor-pointer hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={() => isEditing === "subtasks" ? handleEdit("none") : handleEdit("subtasks")}
            />
          </div>
          <div className="space-y-2">
            {taskData?.subtasks?.length > 0 ? (
              taskData?.subtasks?.map((subtask, index) => (
                isEditing === "subtasks" ? (
                  <div key={index} className="flex items-center gap-2 bg-component-secondary-background border border-component-border p-3 rounded-lg">
                    <input
                      type="checkbox"
                      checked={subtask?.completed}
                      onChange={() => handleSubtaskToggle(index)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500"
                    />
                    <input
                      type="text"
                      name="subtask"
                      value={subtask?.title}
                      onChange={(e) => handleSubtaskChange(index, e.target.value)}
                      className="w-full text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
                      placeholder="하위 작업을 입력하세요"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteSubtask(index)}
                      className="flex-shrink-0 text-red-400 hover:text-red-300 transition-colors"
                      aria-label="하위 작업 삭제"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div key={index} className="flex items-center gap-2 bg-component-secondary-background border border-component-border p-3 rounded-lg">
                    <input
                      type="checkbox"
                      checked={subtask?.completed}
                      onChange={() => handleSubtaskToggle(index)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500"
                    />
                    <span className={`text-sm ${subtask?.completed ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                      {subtask?.title}
                    </span>
                  </div>
                )
              ))
            ) : (
              isEditing === "subtasks" ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center p-4 bg-component-secondary-background border border-dashed border-component-border rounded-lg text-text-secondary">
                    아직 하위 작업이 없습니다. 새 하위 작업을 추가해보세요.
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="w-full flex items-center justify-center gap-2 bg-component-tertiary-background hover:bg-component-tertiary-background/60 border border-component-border p-3 rounded-lg text-text-primary transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    새 하위 작업 추가
                  </button>
                </div>
              ) : (
                <span className="text-text-secondary">하위 작업이 없습니다.</span>
              )
            )}
          </div>
        </div>

        {isEditing === "subtasks" && taskData?.subtasks?.length > 0 && (
          <button
            type="button"
            onClick={handleAddSubtask}
            className="w-full flex items-center justify-center gap-2 bg-component-tertiary-background hover:bg-component-tertiary-background/60 border border-component-border p-3 rounded-lg text-text-primary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            새 하위 작업 추가
          </button>
        )}

        <div className="space-y-2">
          <h4 className="font-medium text-text-primary">댓글</h4>
          <div className="space-y-4">
            {taskData?.comments && taskData?.comments.length > 0 ? (
              taskData?.comments?.map((comment, index) => (
                <div key={index} className="bg-component-secondary-background p-4 rounded-lg border border-component-border hover:border-component-border-hover transition-all duration-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 relative border border-component-border rounded-full bg-component-tertiary-background flex items-center justify-center shadow-inner">
                      {project?.members.find(member => member.id === comment?.author_id)?.profileImage ? (
                        <Image src={project?.members.find(member => member.id === comment?.author_id)?.profileImage ?? "/DefaultProfile.jpg"} alt="Profile" className="w-full h-full object-fit rounded-full" quality={100} fill />
                      ) : (
                        <p>{project?.members.find(member => member.id === comment?.author_id)?.name.charAt(0)}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex flex-col">
                          <span className="font-semibold text-text-primary">
                            {project?.members.find(member => member.id === comment?.author_id)?.name}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {project?.members.find(member => member.id === comment?.author_id)?.role} • {new Date(comment?.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {comment?.author_id === user?.id && (
                          <button
                            className="text-text-secondary hover:text-red-400 p-1.5 transition-all"
                            aria-label="댓글 삭제"
                          >
                            <FontAwesomeIcon icon={faTrash} size="sm" />
                          </button>
                        )}
                      </div>
                      <p className="text-text-secondary leading-relaxed">{comment?.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 bg-component-secondary-background border border-dashed border-component-border rounded-lg">
                <p className="text-text-secondary mb-1">아직 댓글이 없습니다</p>
                <p className="text-xs text-text-secondary">첫 댓글을 작성해보세요</p>
              </div>
            )}

            {/* 댓글 입력 폼 */}
            <form
              className="mt-4"
              onSubmit={handleCommentSubmit}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 mt-2 relative border border-component-border rounded-full bg-component-tertiary-background flex-shrink-0 flex items-center justify-center shadow-inner">
                  {user?.profileImage ? (
                    <Image src={user?.profileImage ?? "/DefaultProfile.jpg"} alt="Profile" className="w-full h-full object-fit rounded-full" quality={100} fill />
                  ) : (
                    <p>{user?.name.charAt(0)}</p>
                  )}
                </div>
                <div className="flex-1">
                  <textarea
                    name="comment"
                    placeholder="댓글을 작성하세요..."
                    className="w-full p-3 rounded-lg bg-component-secondary-background border border-component-border text-text-primary hover:border-input-border-hover focus:outline-none focus:ring-1 focus:ring-point-color-indigo focus:border-transparent resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      className="bg-point-color-indigo hover:bg-point-color-indigo-hover text-white px-4 py-2 rounded-md transition-all duration-200 font-medium text-sm flex items-center gap-1.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                      댓글 등록
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ModalTemplete>
  );
}
