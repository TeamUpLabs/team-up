"use client";

import { useState, useEffect } from 'react';
import { Task } from '@/types/Task';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { getPriorityColor } from '@/utils/getPriorityColor';
import { SubTask } from '@/types/Task';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { getStatusColor } from '@/utils/getStatusColor';
import { useProject } from '@/contexts/ProjectContext';
import { useAuthStore } from '@/auth/authStore';
import { deleteTask } from '@/hooks/getTaskData';
import ModalTemplete from '@/components/ModalTemplete';
import Badge from '@/components/Badge';

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

  const calculateProgress = (subtasksList: SubTask[]) => {
    if (subtasksList.length === 0) return 0;
    const completedTasks = subtasksList.filter(subtask => subtask.completed).length;
    return Math.round((completedTasks / subtasksList.length) * 100);
  };

  const [subtasks, setSubtasks] = useState<SubTask[]>([]);

  const isUserAssignee = task?.assignee?.some(assi => assi.id === user?.id);

  const handleSubtaskToggle = async (index: number) => {
    const updated = subtasks.map((subtask, i) =>
      i === index ? { ...subtask, completed: !subtask.completed } : subtask
    );
    setSubtasks(updated);

    // api 호출
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
    console.log('수정');
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

  useEffect(() => {
    if (task?.subtasks) {
      setSubtasks(task?.subtasks);
    }
  }, [task]);

  // Calculate progress based on current subtasks state
  const progress = calculateProgress(subtasks);
  
  // Header section for ModalTemplete
  const modalHeader = (
    <div>
      <h3 className="text-2xl font-semibold text-gray-100">{task?.title}</h3>
      <div className="flex gap-2 mt-2">
        {task?.tags.map((tag, index) => (
          <Badge key={index} content={tag} color="pink" />
        ))}
      </div>
    </div>
  );
  
  // Footer section for ModalTemplete (only if user is assignee)
  const modalFooter = isUserAssignee ? (
    <div className="flex gap-2 justify-end">
      <button
        onClick={handleEdit}
        className="flex items-center gap-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 hover:text-indigo-300 px-4 py-2 rounded-md transition-all duration-200 font-medium"
      >
        <FontAwesomeIcon icon={faPencil} className="w-4 h-4" />
        작업 수정
      </button>
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
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-400 mb-2">상세 설명</h4>
          <p className="text-gray-200">{task?.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1 bg-gray-800/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-400">상태</h4>
            <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(task?.status)}`}>
              {task?.status === 'not-started' ? '준비' : task?.status === 'in-progress' ? '진행 중' : '완료'}
            </span>
          </div>

          <div className="space-y-1 bg-gray-800/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-400">우선순위</h4>
            <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium
              ${getPriorityColor(task?.priority)}`}>
              {task?.priority === 'high' ? '높음' : task?.priority === 'medium' ? '중간' : '낮음'}
            </span>
          </div>

          <div className="space-y-1 bg-gray-800/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-400">담당자</h4>
            <div className="flex flex-wrap gap-2">
              {
                task?.assignee?.map((assi) => (
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
          </div>

          <div className="space-y-1 bg-gray-800/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-400">마감일</h4>
            <p className="text-gray-200">{task?.dueDate}</p>
          </div>
        </div>

        <div className="space-y-1 bg-gray-800/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-400 mb-2">마일스톤</h4>
          <p
            className="text-gray-200 cursor-pointer hover:text-blue-400 transition-colors"
            onClick={() => handleMilestoneClick(task?.milestone_id ?? 0)}
          >
            {project?.milestones.find(milestone => milestone.id === task?.milestone_id)?.title}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">진행률</h4>
          <div className="w-full bg-gray-800/50 hover:bg-gray-700/50 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-right text-sm text-gray-400 mt-1">{progress}%</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3">하위 작업</h4>
          <div className="space-y-2">
            {subtasks?.length > 0 ? (
              subtasks?.map((subtask, index) => (
                <div key={index} className="flex items-center gap-2 bg-gray-800/50 p-3 rounded-lg">
                  <input
                    type="checkbox"
                    checked={subtask?.completed}
                    onChange={() => handleSubtaskToggle(index)}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500"
                  />
                  <span className={`text-sm ${subtask?.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                    {subtask?.title}
                  </span>
                </div>
              ))
            ) : (
              <span className="text-gray-500">하위 작업이 없습니다.</span>
            )}
          </div>
        </div>

        {task?.comments?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-3">댓글</h4>
            <div className="space-y-3">
              {task?.comments?.map((comment, index) => (
                <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-200">{comment?.author_id}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{comment?.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ModalTemplete>
  );
}
