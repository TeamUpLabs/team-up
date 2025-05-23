import { useState } from 'react';
import MilestoneModal from './MilestoneModal';
import { MileStone } from '@/types/MileStone';
import { getStatusColor } from '@/utils/getStatusColor';

export default function MilestoneCard({ milestone }: { milestone: MileStone }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculateProgress = () => {
    let totalTasks = 0;
    let completedTasks = 0;

    milestone?.subtasks.forEach(task => {
      // Count the main task
      totalTasks++;
      if (task.status === 'done') {
        completedTasks++;
      }

      // Count subtasks
      if (task.subtasks.length > 0) {
        totalTasks += task.subtasks.length;
        completedTasks += task.subtasks.filter(st => st.completed).length;
      }
    });

    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };
  const progressPercentage = calculateProgress();

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-component-background rounded-lg shadow-md p-6 transition-colors duration-300 border border-component-border hover:border-point-color-indigo-hover cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-text-primary">{milestone.title}</h3>
          <span className={`px-3 py-1 rounded-md text-sm ${getStatusColor(milestone.status)}`}>
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
            {milestone.assignee.length <= 2 ? (
              milestone.assignee.map((assi) => (
                <p key={assi.id} className="text-text-secondary">{assi.name}</p>
              ))
            ) : (
              <>
                <p className="text-text-secondary">{milestone.assignee[0].name}</p>
                <p className="text-text-secondary">{milestone.assignee[1].name}</p>
                <p className="text-text-secondary">+{milestone.assignee.length - 2}명</p>
              </>
            )}
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
