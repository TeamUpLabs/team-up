"use client";

import { useState } from 'react';
import MilestoneModal from '@/components/project/milestone/MilestoneModal';
import { MileStone } from '@/types/MileStone';
import Badge from '@/components/ui/Badge';
import { Flag, ArrowRight, Users } from 'flowbite-react-icons/outline';
import { getPriorityColorName } from '@/utils/getPriorityColor';

export default function MilestoneCard({ milestone }: { milestone: MileStone }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started': return 'bg-gray-500'
      case 'in-progress': return 'bg-blue-500'
      case 'done': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="space-y-4 bg-component-background rounded-lg shadow-md p-6 transition-colors duration-300 border border-component-border hover:border-point-color-indigo-hover cursor-pointer"
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(milestone.status)}`} />
            <h3 className="text-lg font-semibold text-text-primary">{milestone.title}</h3>
          </div>
          <Badge
            content={
              <div className="flex items-center gap-1">
                <Flag className="w-4 h-4" />
                {milestone.priority.toUpperCase()}
              </div>
            }
            color={getPriorityColorName(milestone.priority)}
            isEditable={false}
            className="!rounded-full !px-2 !py-0.5"
          />
        </div>

        <p className="text-text-secondary text-sm line-clamp-1">{milestone.description}</p>

        <div className="flex items-center gap-2">
          <p className="text-text-secondary text-sm">{new Date(milestone.startDate).toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })}</p>
          <ArrowRight className="w-4 h-4 text-text-secondary" />
          <p className="text-text-secondary text-sm">{new Date(milestone.endDate).toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-text-secondary" />
            <p className="text-text-secondary text-sm">{milestone.assignee.length}</p>
          </div>
          <p className="text-text-secondary text-sm">{milestone.subtasks.filter((task) => task.status === 'done').length}/{milestone.subtasks.length} tasks</p>
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