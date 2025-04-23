import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { MileStone } from '@/types/MileStone';
import { getPriorityColor } from '@/utils/getPriorityColor';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/auth/authStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { deleteMilestone } from '@/hooks/getMilestoneData';
interface MilestoneModalProps {
  milestone: MileStone;
  isOpen: boolean;
  onClose: () => void;
}

export default function MilestoneModal({ milestone, isOpen, onClose }: MilestoneModalProps) {
  const user = useAuthStore.getState().user;
  const params = useParams();
  const router = useRouter();

  if (!isOpen) return null;

  const totalTasks = milestone?.subtasks.length ?? 0;
  const completedTasks = milestone?.subtasks.filter(task => task.status === 'done').length ?? 0;

  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const isUserAssignee = milestone.assignee.some(assi => assi.id === user?.id);

  const handleAssigneeClick = (assiId: number) => {
    localStorage.setItem('selectedAssiId', assiId.toString());

    const projectId = params?.projectId ? String(params.projectId) : 'default';
    router.push(`/platform/${projectId}/members`);

    onClose();
  };

  const handleTaskClick = (taskId: number) => {
    localStorage.setItem('selectedTaskId', taskId.toString());

    const projectId = params?.projectId ? String(params.projectId) : 'default';
    router.push(`/platform/${projectId}/tasks`);

    onClose();
  };

  const handleEdit = () => {
    console.log('수정');
  };

  const handleDelete = () => {
    useAuthStore.getState().setConfirm("마일스톤을 삭제하시겠습니까?", async () => {
      try {
        await deleteMilestone(milestone.id);
        useAuthStore.getState().setAlert("마일스톤 삭제에 성공했습니다.", "success");
        useAuthStore.getState().clearConfirm();
        onClose();
        window.location.reload();
      } catch (error) {
        console.error("Error deleting milestone:", error);
        useAuthStore.getState().setAlert("마일스톤 삭제에 실패했습니다.", "error");
      }
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-white">{milestone.title}</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${milestone.status === 'done' ? 'bg-green-500/20 text-green-400' :
                      milestone.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                      {milestone.status === 'done' ? '완료' :
                        milestone.status === 'in-progress' ? '진행중' : '시작 전'}
                    </span>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getPriorityColor(milestone.priority)}`}>
                      {milestone.priority === 'high' ? '높음' :
                        milestone.priority === 'medium' ? '중간' : '낮음'}
                    </span>
                  </div>

                  <div className='bg-gray-700/30 p-4 rounded-lg'>
                    <h3 className="text-gray-400 mb-2">설명</h3>
                    <p className="text-white">{milestone.description}</p>
                  </div>

                  <div className='bg-gray-700/30 p-4 rounded-lg'>
                    <h3 className="text-gray-400 mb-2">태그</h3>
                    <div className="flex flex-wrap gap-2">
                      {milestone.tags.length > 0 ? (
                        milestone.tags.map((tag, index) => (
                          <span key={index} className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-sm">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">태그가 없습니다.</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-gray-400 mb-2">진행률</h3>
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>진행도</span>
                      <span>{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className='bg-gray-700/30 p-4 rounded-lg'>
                      <h3 className="text-gray-400 mb-2">기간</h3>
                      <p className="text-white">시작일: {milestone.startDate}</p>
                      <p className="text-white">종료일: {milestone.endDate}</p>
                    </div>
                    <div className='bg-gray-700/30 p-4 rounded-lg'>
                      <h3 className="text-gray-400 mb-2">담당자</h3>
                      <div className="flex flex-wrap gap-2">
                        {
                          milestone.assignee.map((assi) => (
                            <p
                              key={assi.id}
                              className="text-gray-200 hover:text-blue-400 cursor-pointer transition-colors"
                              onClick={() => handleAssigneeClick(assi.id)}
                            >{assi.name}</p>
                          ))
                        }
                      </div>
                    </div>
                  </div>

                  <div className='bg-gray-700/30 p-4 rounded-lg'>
                    <h3 className="text-gray-400 mb-2">하위 작업</h3>
                    <div className="space-y-2">
                      {milestone.subtasks.length > 0 ? (
                        milestone.subtasks.map((subtask) => (
                          <div key={subtask.id} className="flex flex-col">
                            <div className="flex gap-2">
                              <input
                              type="checkbox"
                              readOnly
                              checked={
                                subtask.subtasks.length > 0 &&
                                subtask.subtasks.every((st) => st.completed)
                              }
                              className='rounded bg-gray-700 border-gray-600'
                            />
                            <span className={`text-sm cursor-pointer hover:text-blue-400 ${subtask.subtasks.length > 0 && subtask.subtasks.every(st => st.completed) ?
                                'text-gray-400 line-through' : 'text-white'
                              }`}
                              onClick={() => handleTaskClick(subtask.id)}
                            >
                              {subtask.title}
                            </span>
                          </div>
                          <div className="ml-8 mt-2">
                            {
                              subtask.subtasks.map((sub, idx) => (
                                <div key={idx} className='space-x-2'>
                                  <input
                                    type="checkbox"
                                    readOnly
                                    checked={sub.completed}
                                    className='rounded bg-gray-700 border-gray-600'
                                  />
                                  <span className={`text-sm`}>{sub.title}</span>
                                </div>
                              ))
                            }
                          </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500">하위 작업이 없습니다.</span>
                      )}
                    </div>
                  </div>

                  {/* Bottom section with delete button */}
                  {isUserAssignee && (
                    <div className="border-t border-gray-700 pt-4 mt-8 flex gap-2 justify-end">
                      <button
                        onClick={handleEdit}
                        className="flex items-center gap-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 hover:text-indigo-300 px-4 py-2 rounded-md transition-all duration-200 font-medium"
                      >
                        <FontAwesomeIcon icon={faPencil} className="w-4 h-4" />
                        마일스톤 수정
                      </button>
                      <button
                        onClick={handleDelete}
                        className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 px-4 py-2 rounded-md transition-all duration-200 font-medium"
                        aria-label="마일스톤 삭제"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        마일스톤 삭제
                      </button>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition >
  );
}
