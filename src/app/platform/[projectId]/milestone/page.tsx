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
    <div className="py-6 px-2 sm:px-4 md:px-6">
      <div className="rounded-xl shadow-lg">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 bg-gray-800 p-6 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">마일스톤</h1>
            <p className="text-gray-400 mt-2">프로젝트의 주요 이정표를 관리하세요</p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
            <span>마일스톤 추가</span>
          </button>
        </div>

        {/* Filter Section */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg transition-colors space-x-1 ${
              filter === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'
            }`}
            onClick={() => setFilter('all')}
          >
            <span>전체</span>
            <span>{project?.milestones.length}</span>
          </button>

          <button
            className={`px-4 py-2 rounded-lg transition-colors space-x-1 ${
              filter === 'not-started' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'
            }`}
            onClick={() => setFilter('not-started')}
          >
            <span>시작 전</span>
            <span>{project?.milestones.filter(m => m.status === 'not-started').length}</span>
          </button>

          <button
            className={`px-4 py-2 rounded-lg transition-colors space-x-1 ${
              filter === 'in-progress' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'
            }`}
            onClick={() => setFilter('in-progress')}
          >
            <span>진행중</span>
            <span>{project?.milestones.filter(m => m.status === 'in-progress').length}</span>
          </button>

          <button
            className={`px-4 py-2 rounded-lg transition-colors space-x-1 ${
              filter === 'done' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'
            }`}
            onClick={() => setFilter('done')}
          >
            <span>완료</span>
            <span>{project?.milestones.filter(m => m.status === 'done').length}</span>
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMilestones.map((milestone) => (
            <MilestoneCard key={milestone.id} milestone={milestone} />
          ))}
          {filteredMilestones.length === 0 && (
            <div className="col-span-full text-center text-gray-400">
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