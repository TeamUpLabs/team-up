import { useState } from 'react';
import MilestoneModal from './MilestoneModal';
import { MileStone } from '@/types/MileStone';

export default function MilestoneCard({ milestone }: { milestone: MileStone }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalTasks = milestone?.subtasks.length ?? 0;
  const completedTasks = milestone?.subtasks.filter(task => task.status === 'done').length ?? 0;

  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-component-background rounded-lg shadow-md p-6 transition-colors duration-300 border border-component-border hover:border-point-color-indigo-hover cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-text-primary">{milestone.title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm ${
            milestone.status === 'done' ? 'bg-green-500/20 text-green-400' : 
            milestone.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {milestone.status === 'done' ? '완료' : 
             milestone.status === 'in-progress' ? '진행중' : '시작 전'}
          </span>
        </div>
        <p className="text-text-secondary mb-4 line-clamp-1">{milestone.description}</p>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-text-secondary mb-2">
            <span>진행률</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-component-secondary-background rounded-full h-2">
            <div
              className="bg-point-color-indigo h-2 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <div className="text-text-secondary">
            <p>시작일: {milestone.startDate}</p>
            <p>종료일: {milestone.endDate}</p>
          </div>
          <div className="text-text-secondary flex flex-wrap gap-1 items-end">
            <p>담당자:</p>
            {
              milestone.assignee.map((assi) => (
                <p key={assi.id} className="text-text-secondary">{assi.name}</p>
              ))
            }
          </div>
        </div>
      </div>
      {isModalOpen && (
        <MilestoneModal
          milestone={milestone}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
