import { Transition, Dialog } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useProject } from '@/contexts/ProjectContext';
import { MileStone } from '@/types/MileStone';
import TaskCreateModal from '@/components/project/task/TaskCreateModal';

interface SelectMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SelectMilestoneModal({ isOpen, onClose }: SelectMilestoneModalProps) {
  const { project } = useProject();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMilestone, setSelectedMilestone] = useState<MileStone | null>(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  useEffect(() => {
    if (project?.milestones) {
      setIsLoading(false);
    }
  }, [project]);

  const handleSelectMilestone = () => {
    if (!selectedMilestone) return;
    
    setIsCreateTaskModalOpen(true);
    onClose();
  }

  return (
    <>
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-gray-800/95 backdrop-blur-sm p-6 text-left align-middle shadow-xl transition-all border border-gray-700 flex flex-col max-h-[90vh]">
                  {/* 해더 */}
                  <div className="flex justify-between items-start border-b border-gray-700/50 pb-6">
                    <div className="flex items-center space-x-4">
                      <h2 className="text-xl font-bold text-white">마일스톤 선택</h2>
                    </div>
                    <button
                      type="button"
                      className="p-1 text-gray-400 hover:text-white transition-all"
                      onClick={onClose}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                  {/* 본문 */}
                  <div className="mt-6 flex-1 overflow-y-auto">
                    {isLoading ? (
                      <div className="flex justify-center items-center py-10">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-gray-300">마일스톤을 불러오는 중...</span>
                      </div>
                    ) : project?.milestones.length === 0 ? (
                      <div className="py-8 text-center text-gray-400">
                        <p>마일스톤이 없습니다.</p>
                        <p className="mt-2 text-sm">마일스톤을 생성해주세요.</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {project?.milestones.map((milestone) => (
                          <div
                            key={milestone.id}
                            onClick={() => setSelectedMilestone(milestone)}
                            className={`p-4 rounded-lg border ${selectedMilestone === milestone
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-gray-700 hover:border-gray-600 hover:bg-gray-700/30"
                              } cursor-pointer transition-all`}
                          >
                            <div className="flex justify-between items-center">
                              <h3 className={`font-medium ${selectedMilestone === milestone ? "text-blue-400" : "text-white"}`}>
                                {milestone.title}
                              </h3>
                              {selectedMilestone === milestone && (
                                <div className="flex-shrink-0 h-5 w-5 text-blue-500">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="mt-2 text-sm text-gray-400">{milestone.description}</div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {milestone.tags.map((tag, idx) => (
                                <span key={idx} className="px-2 py-1 rounded-md text-xs bg-gray-700/50 text-gray-300">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-700/50">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        disabled={!selectedMilestone}
                        onClick={handleSelectMilestone}
                        className={`px-4 py-2 rounded-lg ${
                          !selectedMilestone
                            ? "bg-blue-500/30 text-blue-300/70 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        } transition-colors flex items-center`}
                      >
                        선택하기
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {isCreateTaskModalOpen && (
        <TaskCreateModal
          isOpen={isCreateTaskModalOpen}
          onClose={() => setIsCreateTaskModalOpen(false)}
          milestone_id={selectedMilestone?.id ?? null}
        />
      )}
    </>
  );
}