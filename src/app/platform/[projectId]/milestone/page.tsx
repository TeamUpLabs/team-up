'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import MileStoneData from '../../../../../public/json/milestones.json'

export default function MilestonePage() {
  const [filter, setFilter] = useState('all')

  const dummyMilestones = MileStoneData;

  const filteredMilestones = dummyMilestones.filter(milestone => {
    if (filter === 'all') return true;
    if (filter === 'active') return milestone.status === 'in-progress';
    if (filter === 'completed') return milestone.status === 'completed';
    return true;
  });

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
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'
            }`}
            onClick={() => setFilter('all')}
          >
            전체
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'active' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'
            }`}
            onClick={() => setFilter('active')}
          >
            진행중
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'completed' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'
            }`}
            onClick={() => setFilter('completed')}
          >
            완료
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMilestones.map((milestone) => (
            <div key={milestone.id} className="bg-gray-700/50 rounded-lg p-6 hover:bg-gray-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">{milestone.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  milestone.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                  milestone.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {milestone.status === 'completed' ? '완료' : 
                   milestone.status === 'in-progress' ? '진행중' : '시작 전'}
                </span>
              </div>
              <p className="text-gray-400 mb-4">{milestone.description}</p>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>진행률</span>
                  <span>{milestone.progress}%</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all"
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <div className="text-gray-400">
                  <p>시작일: {milestone.startDate}</p>
                  <p>종료일: {milestone.endDate}</p>
                </div>
                <div className="text-gray-400">
                  <p>담당자:</p>
                  <p className="text-indigo-400">{milestone.assignee}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}