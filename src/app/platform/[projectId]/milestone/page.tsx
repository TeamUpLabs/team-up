'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import MilestoneCard from '@/components/project/milestone/MilestoneCard'
import { useProject } from '@/contexts/ProjectContext';

export default function MilestonePage() {
  const { project } = useProject();
  const [filter, setFilter] = useState('all')

  const filteredMilestones = project?.milestones.filter(milestone => {
    if (filter === 'all') return true;
    if (filter === 'active') return milestone.status === 'in-progress';
    if (filter === 'done') return milestone.status === 'done';
    return true;
  }) ?? [];

  return (
    <div className="py-6 px-2 sm:px-4 md:px-6">
      <div className="rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6 bg-gray-800 p-6 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">마일스톤</h1>
            <p className="text-gray-400 mt-2">프로젝트의 주요 이정표를 관리하세요</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
            <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
            <span>마일스톤 추가</span>
          </button>
        </div>

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
              filter === 'active' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'
            }`}
            onClick={() => setFilter('active')}
          >
            <span>진행중</span>
            <span>{project?.milestones.filter(m => m.status === 'in-progress').length}</span>
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors space-x-1 ${
              filter === 'completed' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'
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
        </div>
      </div>
    </div>
  )
}