import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { MileStone } from '@/types/MileStone';
import { getPriorityColor } from '@/utils/getPriorityColor';
import { useParams, useRouter } from 'next/navigation';

interface MilestoneModalProps {
  milestone: MileStone;
  isOpen: boolean;
  onClose: () => void;
}

export default function MilestoneModal({ milestone, isOpen, onClose }: MilestoneModalProps) {
  const params = useParams();
  const router = useRouter();

  if (!isOpen) return null;

  const totalTasks = milestone?.subtasks.length ?? 0;
  const completedTasks = milestone?.subtasks.filter(task => task.status === 'done').length ?? 0;

  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleAssigneeClick = (assiId: number) => {
    localStorage.setItem('selectedAssiId', assiId.toString());

    const projectId = params?.projectId ? String(params.projectId) : 'default';
    router.push(`/platform/${projectId}/members`);
    
    onClose();
  };

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-white">{milestone.title}</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white"
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
                      {milestone.tags.map((tag, index) => (
                        <span key={index} className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
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

                  <div className='bg-gray-700/30 p-4 rounded-lg'>
                    <h3 className="text-gray-400 mb-2">하위 작업</h3>
                    <div className="space-y-2">
                      {milestone.subtasks.map((subtask) => (
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
                            <span className={`text-sm ${
                              subtask.subtasks.length > 0 && subtask.subtasks.every(st => st.completed) ?
                              'text-gray-400 line-through' : 'text-white'
                            }`}>
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
                      ))}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition >
  );
}
