import { Fragment, useEffect, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { MileStone } from '@/types/MileStone';
import TaskCreateModal from '@/components/project/task/TaskCreateModal';
import ModalTemplete from '@/components/ModalTemplete';
import Badge from '@/components/ui/Badge';

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

  const header = (
    <div className="flex items-center space-x-4">
      <h2 className="text-xl font-bold text-text-primary">마일스톤 선택</h2>
    </div>
  );

  const footer = (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 rounded-lg border border-component-border text-text-secondary hover:bg-component-secondary-background transition-colors"
      >
        취소
      </button>
      <button
        type="button"
        disabled={!selectedMilestone}
        onClick={handleSelectMilestone}
        className={`px-4 py-2 rounded-lg ${
          !selectedMilestone
            ? "bg-blue-600/50 text-white cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        } transition-colors flex items-center active:scale-95`}
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
          <div className="py-8 text-center text-text-secondary">
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
                    : "border-component-border hover:border-component-border-hover hover:bg-component-secondary-background"
                  } cursor-pointer transition-all`}
              >
                <div className="flex justify-between items-center">
                  <h3 className={`font-medium ${selectedMilestone === milestone ? "text-blue-400" : "text-text-primary"}`}>
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
                <div className="mt-2 text-sm text-text-secondary">{milestone.description}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {milestone.tags.map((tag, idx) => (
                    <Badge key={idx} content={tag} color="red" className="text-xs" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </ModalTemplete>

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