"use client";

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Task } from '@/types/Task';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { getPriorityColor } from '@/utils/getPriorityColor';
import { SubTask } from '@/types/Task';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { getStatusColor } from '@/utils/getStatusColor';
import { useProject } from '@/contexts/ProjectContext';
interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskModal({ task, isOpen, onClose }: TaskModalProps) {
  const { project } = useProject();
  const router = useRouter();
  const params = useParams();

  const calculateProgress = (subtasksList: SubTask[]) => {
    if (subtasksList.length === 0) return 0;
    const completedTasks = subtasksList.filter(subtask => subtask.completed).length;
    return Math.round((completedTasks / subtasksList.length) * 100);
  };

  const [subtasks, setSubtasks] = useState<SubTask[]>([]);

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

  useEffect(() => {
    if (task?.subtasks) {
      setSubtasks(task?.subtasks);
    }
  }, [task]);

  // Calculate progress based on current subtasks state
  const progress = calculateProgress(subtasks);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-gray-800/95 backdrop-blur-sm p-8 text-left align-middle shadow-xl transition-all border border-gray-700">
                <div className="flex items-center justify-between pb-6 border-b border-gray-700">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-100">{task?.title}</h3>
                    <div className="flex gap-2 mt-2">
                      {task?.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs rounded-md bg-gray-700/50 text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="transition-all duration-200 hover:rotate-90"
                  >
                    <FontAwesomeIcon icon={faXmark} className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="mt-6 space-y-6">
                  <div className="bg-gray-700/30  p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">상세 설명</h4>
                    <p className="text-gray-200">{task?.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 bg-gray-700/30 p-4 rounded-lg ">
                      <h4 className="text-sm font-medium text-gray-400">상태</h4>
                      <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${getStatusColor(task?.status)}`}>
                        {task?.status === 'not-started' ? '준비' : task?.status === 'in-progress' ? '진행 중' : '완료'}
                      </span>
                    </div>

                    <div className="space-y-1 bg-gray-700/30 p-4 rounded-lg ">
                      <h4 className="text-sm font-medium text-gray-400">우선순위</h4>
                      <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium
                        ${getPriorityColor(task?.priority)}`}>
                        {task?.priority === 'high' ? '높음' : task?.priority === 'medium' ? '중간' : '낮음'}
                      </span>
                    </div>

                    <div className="space-y-1 bg-gray-700/30 p-4 rounded-lg ">
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

                    <div className="space-y-1 bg-gray-700/30 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-400">마감일</h4>
                      <p className="text-gray-200">{task?.dueDate}</p>
                    </div>
                  </div>

                  <div className="space-y-1 bg-gray-700/30 p-4 rounded-lg ">
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
                    <div className="w-full bg-gray-700/30 hover:bg-gray-700/50 rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-sm text-gray-400 mt-1">{progress}%</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">하위 작업</h4>
                    <div className="space-y-2">
                      {subtasks?.map((subtask, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-700/30  p-3 rounded-lg">
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
                      ))}
                    </div>
                  </div>

                  {task?.comments?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">댓글</h4>
                      <div className="space-y-3">
                        {task?.comments?.map((comment, index) => (
                          <div key={index} className="bg-gray-700/30  p-4 rounded-lg">
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
