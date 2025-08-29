import { useEffect, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import TaskCreateModal from '@/components/project/task/TaskCreateModal';
import ModalTemplete from '@/components/ModalTemplete';
import Badge from '@/components/ui/Badge';
import CancelBtn from '@/components/ui/button/CancelBtn';
import { Flag } from 'flowbite-react-icons/outline';
import { isMarkdown } from '@/utils/isMarkdown';
import { summarizeMarkdown } from '@/utils/summarizeMarkdown';

interface SelectMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SelectMilestoneModal({ isOpen, onClose }: SelectMilestoneModalProps) {
  const { project } = useProject();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  useEffect(() => {
    if (project?.milestones) {
      setIsLoading(false);
    }
  }, [project]);

  const handleSelectMilestone = () => {
    setIsCreateTaskModalOpen(true);
    onClose();
  }

  const header = (
    <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary-100">
        <Flag
          className="text-primary-600 text-lg"
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-text-primary">
          마일스톤 선택
        </h3>
        <p className="text-sm text-point-color-indigo mt-0.5">
          마일스톤을 선택해주세요
        </p>
      </div>
    </div>
  );

  const footer = (
    <div className="flex justify-end gap-3">
      <CancelBtn
        handleCancel={onClose}
        className="!text-sm"
        withIcon
      />
      <button
        type="button"
        onClick={handleSelectMilestone}
        className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors flex items-center active:scale-95"
      >
        선택하기
      </button>
    </div>
  );

  return (
    <>
      <ModalTemplete
        isOpen={isOpen}
        onClose={onClose}
        header={header}
        footer={footer}
      >
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-text-secondary">마일스톤을 불러오는 중...</span>
          </div>
        ) : project?.milestones.length === 0 ? (
          <div
            onClick={() => setSelectedMilestone(null)}
            className={`p-4 rounded-lg border ${selectedMilestone === null
              ? "border-blue-500 bg-blue-500/10"
              : "border-component-border hover:border-component-border-hover hover:bg-component-secondary-background"
              } cursor-pointer transition-all`}
          >
            <div className="flex justify-between items-center">
              <h3 className={`font-medium ${selectedMilestone === null ? "text-blue-400" : "text-text-primary"}`}>
                선택하지 않음
              </h3>
              {selectedMilestone === null && (
                <div className="flex-shrink-0 h-5 w-5 text-blue-500">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            <div className="mt-2 text-sm text-text-secondary">마일스톤을 선택하지 않겠습니다.</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {project?.milestones.map((milestone) => (
              <div
                key={milestone.id}
                onClick={() => setSelectedMilestone(milestone.id)}
                className={`p-4 rounded-lg border ${selectedMilestone === milestone.id
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-component-border hover:border-component-border-hover hover:bg-component-secondary-background"
                  } cursor-pointer transition-all`}
              >
                <div className="flex justify-between items-center">
                  <h3 className={`font-medium ${selectedMilestone === milestone.id ? "text-blue-400" : "text-text-primary"}`}>
                    {milestone.title}
                  </h3>
                  {selectedMilestone === milestone.id && (
                    <div className="flex-shrink-0 h-5 w-5 text-blue-500">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                {isMarkdown(milestone.description) ? (
                  <div className="mt-2 text-sm text-text-secondary line-clamp-1">
                    {summarizeMarkdown(milestone.description || "마일스톤의 설명이 없습니다.")}
                  </div>
                ) : (
                  <p className="text-text-secondary leading-relaxed line-clamp-1">{milestone.description}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {milestone.tags.map((tag, idx) => (
                    <Badge key={idx} content={tag} color="red" className="text-xs" />
                  ))}
                </div>
              </div>
            ))}

            <div
              onClick={() => setSelectedMilestone(null)}
              className={`p-4 rounded-lg border ${selectedMilestone === null
                ? "border-blue-500 bg-blue-500/10"
                : "border-component-border hover:border-component-border-hover hover:bg-component-secondary-background"
                } cursor-pointer transition-all`}
            >
              <div className="flex justify-between items-center">
                <h3 className={`font-medium ${selectedMilestone === null ? "text-blue-400" : "text-text-primary"}`}>
                  선택하지 않음
                </h3>
                {selectedMilestone === null && (
                  <div className="flex-shrink-0 h-5 w-5 text-blue-500">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="mt-2 text-sm text-text-secondary">마일스톤을 선택하지 않겠습니다.</div>
            </div>
          </div>
        )}
      </ModalTemplete>

      {isCreateTaskModalOpen && (
        <TaskCreateModal
          isOpen={isCreateTaskModalOpen}
          onClose={() => setIsCreateTaskModalOpen(false)}
          milestone_id={selectedMilestone ?? null}
        />
      )}
    </>
  );
}