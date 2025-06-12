'use client'

import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import MilestoneCard from '@/components/project/milestone/MilestoneCard'
import { useProject } from '@/contexts/ProjectContext';
import MilestoneCreateModal from '@/components/project/milestone/MilestoneCreateModal';
import MilestoneModal from '@/components/project/milestone/MilestoneModal';
import { MileStone } from '@/types/MileStone';

export default function MilestonePage() {
  const { project } = useProject();
  const [filter, setFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<MileStone | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredMilestones = project?.milestones.filter(milestone => {
    if (filter === 'all') return true;
    if (filter === 'not-started') return milestone.status === 'not-started';
    if (filter === 'in-progress') return milestone.status === 'in-progress';
    if (filter === 'done') return milestone.status === 'done';
    return true;
  }) ?? [];

  useEffect(() => {
    const selectedMilestoneId = localStorage.getItem('selectedMilestoneId');
    if (selectedMilestoneId && project?.milestones) {
      const milestone = project.milestones.find(
        m => m.id === parseInt(selectedMilestoneId)
      );
      if (milestone) {
        setSelectedMilestone(milestone);
        setIsModalOpen(true);
        localStorage.removeItem('selectedMilestoneId');
      }
    }
  }, [project]);

  return (
    <div className="py-20 px-4">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center bg-project-page-title-background border border-project-page-title-border p-6 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">마일스톤</h1>
            <p className="text-text-secondary mt-2">프로젝트의 주요 이정표를 관리하세요</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-point-color-indigo hover:bg-point-color-indigo-hover text-white px-4 py-2 rounded-lg transition-colors active:scale-95"
          >
            <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
            <span>마일스톤 추가</span>
          </button>
        </div>

        {/* Filter Section */}
        <div className="flex gap-2 bg-component-secondary-background w-fit rounded-lg border border-component-border p-1">
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out flex items-center justify-center
                        ${filter === 'all'
                          ? 'bg-point-color-indigo text-white'
                          : 'text-text-secondary hover:bg-component-background hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-point-color-indigo/50'
                        }`}
            onClick={() => setFilter('all')}
          >
            <span>전체</span>
            <span
              className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full
                          ${filter === 'all'
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-700 text-gray-200'
                          }`}
            >
              {project?.milestones.length}
            </span>
          </button>

          <button
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out flex items-center justify-center
                        ${filter === 'not-started'
                          ? 'bg-point-color-indigo text-white shadow-md'
                          : 'text-text-secondary hover:bg-component-background hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-point-color-indigo/50'
                        }`}
            onClick={() => setFilter('not-started')}
          >
            <span>시작 전</span>
            <span
              className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full
                          ${filter === 'not-started'
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-700 text-gray-200'
                          }`}
            >
              {project?.milestones.filter(m => m.status === 'not-started').length}
            </span>
          </button>

          <button
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out flex items-center justify-center
                        ${filter === 'in-progress'
                          ? 'bg-point-color-indigo text-white shadow-md'
                          : 'text-text-secondary hover:bg-component-background hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-point-color-indigo/50'
                        }`}
            onClick={() => setFilter('in-progress')}
          >
            <span>진행중</span>
            <span
              className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full
                          ${filter === 'in-progress'
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-700 text-gray-200'
                          }`}
            >
              {project?.milestones.filter(m => m.status === 'in-progress').length}
            </span>
          </button>

          <button
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out flex items-center justify-center
                        ${filter === 'done'
                          ? 'bg-point-color-indigo text-white shadow-md'
                          : 'text-text-secondary hover:bg-component-background hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-point-color-indigo/50'
                        }`}
            onClick={() => setFilter('done')}
          >
            <span>완료</span>
            <span
              className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full
                          ${filter === 'done'
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-700 text-gray-200'
                          }`}
            >
              {project?.milestones.filter(m => m.status === 'done').length}
            </span>
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMilestones.map((milestone) => (
            <MilestoneCard key={milestone.id} milestone={milestone} />
          ))}
          {filteredMilestones.length === 0 && (
            <div className="col-span-full text-center text-text-secondary">
              마일스톤이 없습니다.
            </div>
          )}
        </div>
      </div>
      <MilestoneCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      {selectedMilestone && (
        <MilestoneModal
          milestone={selectedMilestone}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMilestone(null);
          }}
        />
      )}
    </div>
  )
}