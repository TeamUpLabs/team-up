"use client";

import { useState, useEffect } from 'react';
import { Task } from '@/types/Task';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faUser, faCheck, faSave } from '@fortawesome/free-solid-svg-icons';
import { getPriorityColor } from '@/utils/getPriorityColor';
import { SubTask, Comment } from '@/types/Task';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { getStatusColor } from '@/utils/getStatusColor';
import { useProject } from '@/contexts/ProjectContext';
import { useAuthStore } from '@/auth/authStore';
import { deleteTask, updateTask } from '@/hooks/getTaskData';
import ModalTemplete from '@/components/ModalTemplete';
import Badge from '@/components/Badge';
import { Member } from '@/types/Member';

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

interface TaskModalData {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignee: Member[];
  assignee_id: number[];
  tags: string[];
  milestone_id: number;
  subtasks: SubTask[];
  comments: Comment[];
}

export default function TaskModal({ task, isOpen, onClose }: TaskModalProps) {
  const { project } = useProject();
  const user = useAuthStore.getState().user;
  const router = useRouter();
  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [taskData, setTaskData] = useState<TaskModalData>({
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? '',
    priority: task?.priority ?? '',
    dueDate: task?.dueDate ?? '',
    assignee: task?.assignee ?? [],
    assignee_id: task?.assignee?.map(assi => assi.id) ?? [],
    tags: task?.tags ?? [],
    milestone_id: task?.milestone_id ?? 0,
    subtasks: task?.subtasks ?? [],
    comments: task?.comments ?? [],
  });
  const [newTag, setNewTag] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const calculateProgress = (subtasksList: SubTask[]) => {
    if (subtasksList.length === 0) return 0;
    const completedTasks = subtasksList.filter(subtask => subtask.completed).length;
    return Math.round((completedTasks / subtasksList.length) * 100);
  };

  const isUserAssignee = task?.assignee?.some(assi => assi.id === user?.id);

  const handleSubtaskToggle = async (index: number) => {
    const updated = taskData.subtasks.map((subtask, i) =>
      i === index ? { ...subtask, completed: !subtask.completed } : subtask
    );
    setTaskData({ ...taskData, subtasks: updated });

    // api 호출
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

  const handleEdit = () => {
    if (isEditing) {
      // Remove subtasks with empty titles when finishing edit
      const filteredSubtasks = taskData.subtasks.filter(subtask => subtask.title.trim() !== '');
      setTaskData(prev => ({
        ...prev,
        subtasks: filteredSubtasks
      }));
      console.log(taskData);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      await updateTask(project?.id ? String(project.id) : "0", task.id, {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        dueDate: taskData.dueDate,
        assignee_id: taskData.assignee_id,
        tags: taskData.tags,
        priority: taskData.priority,
        subtasks: taskData.subtasks,
        milestone_id: taskData.milestone_id,
        comments: taskData.comments
      });

      useAuthStore.getState().setAlert("작업 수정에 성공했습니다.", "success");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating task:", error);
      useAuthStore.getState().setAlert("작업 수정에 실패했습니다.", "error");
    } finally {
      setIsEditing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleDelete = () => {
    useAuthStore.getState().setConfirm("작업을 삭제하시겠습니까?", async () => {
      try {
        await deleteTask(task.id);
        useAuthStore.getState().setAlert("작업 삭제에 성공했습니다.", "success");
        useAuthStore.getState().clearConfirm();
        onClose();
        window.location.reload();
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
      title: '',
      completed: false
    };
    setTaskData({
      ...taskData,
      subtasks: [...taskData.subtasks, newSubtask]
    });
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
        {isEditing ? (
          <input
            type="text"
            name="title"
            value={taskData?.title}
            onChange={handleChange}
            className="text-lg p-2 rounded-lg bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo"
            placeholder="작업 제목을 입력하세요"
          />
        ) : (
          <h3 className="text-2xl font-semibold text-text-primary">{taskData?.title}</h3>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          {isEditing ? (
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
            taskData?.tags.map((tag, index) => (
              <Badge key={index} content={tag} color="pink" />
            ))
          )}
        </div>
      </div>
      {isUserAssignee && (
        <div className="flex items-center gap-2">
        {isEditing && (
          <button
            onClick={() => {
              setIsEditing(false);
              setTaskData({
                ...taskData,
                title: task?.title ?? '',
                description: task?.description ?? '',
                status: task?.status ?? '',
                priority: task?.priority ?? '',
                dueDate: task?.dueDate ?? '',
                assignee: task?.assignee ?? [],
                assignee_id: task?.assignee?.map(assi => assi.id) ?? [],
                tags: task?.tags ?? [],
                milestone_id: task?.milestone_id ?? 0,
                subtasks: task?.subtasks ?? [],
                comments: task?.comments ?? []
              });
            }}
            className="flex items-center gap-1.5 bg-component-secondary-background hover:bg-component-secondary-background/80 text-text-secondary hover:text-text-primary px-3 py-2 rounded-md transition-all duration-200 font-medium"
          >
            취소
          </button>
        )}
        <button
          onClick={() => isEditing ? handleSave() : handleEdit()}
          className="flex items-center gap-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 hover:text-indigo-300 px-3 py-2 rounded-md transition-all duration-200 font-medium"
        >
          <FontAwesomeIcon icon={isEditing ? faSave : faPencil} />
            {isEditing ? '저장' : '수정'}
          </button>
        </div>
      )}
    </div>
  );

  // Footer section for ModalTemplete (only if user is assignee)
  const modalFooter = isEditing ? (
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
          <h4 className="text-base font-medium text-text-primary">상세 설명</h4>
          {isEditing ? (
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
            <h4 className="font-medium text-text-primary">상태</h4>
            {isEditing ? (
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
            <h4 className="font-medium text-text-primary">우선순위</h4>
            {isEditing ? (
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
            <h4 className="font-medium text-text-primary">담당자</h4>
            {isEditing ? (
              <div className="border border-component-border rounded-lg p-3 bg-component-secondary-background hover:border-component-border-hover transition-all">
                <div className="mb-3">
                  <p className="text-sm text-text-secondary">선택된 담당자: {taskData.assignee.length > 0 ? `${taskData.assignee.length}명` : '없음'}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project?.members.map((member) => {
                    const isSelected = taskData.assignee.some(a => a.id === member.id);
                    return (
                      <div
                        key={member.id}
                        onClick={() => {
                          if (isSelected) {
                            if (taskData.assignee.length > 1) {
                              setTaskData({
                                ...taskData,
                                assignee: taskData.assignee.filter(a => a.id !== member.id),
                                assignee_id: taskData.assignee.filter(a => a.id !== member.id).map(a => a.id)
                              });
                            } else {
                              useAuthStore.getState().setAlert("최소 한 명의 담당자는 필요합니다.", "warning");
                            }
                          } else {
                            setTaskData({
                              ...taskData,
                              assignee: [...taskData.assignee, member],
                              assignee_id: [...taskData.assignee_id, member.id]
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
                                className={`absolute text-white transform transition-all duration-300 ${isSelected
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
                      className="text-gray-200 hover:text-blue-400 cursor-pointer transition-colors"
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
            <h4 className="font-medium text-text-primary">마감일</h4>
            {isEditing ? (
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
          <h4 className="font-medium text-text-primary">하위 작업</h4>
          <div className="space-y-2">
            {taskData?.subtasks?.length > 0 ? (
              taskData?.subtasks?.map((subtask, index) => (
                isEditing ? (
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
              isEditing ? (
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

        {isEditing && taskData?.subtasks?.length > 0 && (
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

        <div>
          <h4 className="font-medium text-text-primary">댓글</h4>
          <div className="space-y-3">
            {taskData?.comments && taskData?.comments.length > 0 ? (
              taskData?.comments?.map((comment, index) => (
                <div key={index} className="bg-component-secondary-background p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-text-secondary">{comment?.author_id}</span>
                    <span className="text-xs text-text-secondary">
                      {new Date(comment?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm">{comment?.content}</p>
                </div>
              ))
            ) : (
              <p className="text-text-secondary mb-3">댓글이 없습니다.</p>
            )}

            {/* 댓글 입력 폼 */}
            <form
              className="mt-3"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const commentInput = form.elements.namedItem('comment') as HTMLTextAreaElement;

                if (commentInput.value.trim()) {
                  // TODO: API 호출로 댓글 추가 기능 구현
                  console.log('댓글 추가:', commentInput.value);

                  // 폼 초기화
                  commentInput.value = '';
                }
              }}
            >
              <textarea
                name="comment"
                placeholder="댓글을 작성하세요..."
                className="w-full p-3 rounded-lg bg-component-secondary-background border border-component-border text-text-primary focus:outline-none focus:ring-1 focus:ring-point-color-indigo resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="bg-point-color-indigo hover:bg-point-color-indigo-hover text-white px-4 py-2 rounded-md transition-all duration-200 font-medium"
                >
                  댓글 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ModalTemplete>
  );
}
