"use client";

import { useState } from 'react';
import TeamMembersData from "../../../../../public/json/members.json";
import MemberDetailModal from '@/components/platform/MemberDetailModal';
import { TeamMember } from '@/types/member';

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const allTeamMembers: TeamMember[] = TeamMembersData.slice();

  const filteredMembers = allTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.currentTask.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && member.status === '활성') ||
      (statusFilter === 'away' && member.status === '자리비움') ||
      (statusFilter === 'offline' && member.status === '오프라인');

    return matchesSearch && matchesStatus;
  });

  const handleCardClick = (member: TeamMember, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCardPosition({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    });
    setSelectedMember(member);
  };

  return (
    <div className="py-6 px-4 sm:px-6">
      <div className="rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4 lg:items-center justify-between">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이름, 역할, 작업으로 검색..."
              className="pl-10 pr-4 py-2.5 w-full bg-gray-700/50 text-white rounded-xl 
                        border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                        outline-none transition-all duration-200 placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 w-full sm:w-44 appearance-none bg-gray-700/50 text-white rounded-xl 
                        border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                        outline-none transition-all duration-200"
            >
              <option value="all">모든 상태</option>
              <option value="active">활성</option>
              <option value="away">자리비움</option>
              <option value="offline">오프라인</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {filteredMembers.length === 0 && (
        <div className="text-center text-gray-400 mt-8 p-8 bg-gray-800/50 rounded-lg">
          검색 결과가 없습니다.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="group bg-gray-800/90 backdrop-blur p-6 rounded-xl shadow-lg 
                     hover:shadow-xl hover:scale-105 transition-all duration-300 
                     border border-gray-700 hover:border-blue-500 cursor-pointer"
            onClick={(e) => handleCardClick(member, e)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {member.name}
                </h2>
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300 mt-2">
                  {member.abbreviation}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center bg-gray-700/50 px-3 py-1 rounded-full">
                  <span
                    className={`w-3 h-3 rounded-full ${member.status === "활성" ? "bg-emerald-500" :
                        member.status === "자리비움" ? "bg-amber-500" : "bg-gray-500"
                      } animate-pulse`}
                  />
                  <span className="ml-2 text-sm text-gray-300">{member.status}</span>
                </div>
                <span className="text-xs text-gray-500 mt-1">{member.statusTime}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-gray-700/50 rounded-full text-sm text-gray-300">
                  {member.role}
                </span>
              </div>
              <div className="border-t border-gray-700 pt-3 mt-3">
                <p className="text-sm">
                  <span className="text-gray-400 font-medium">현재 작업</span>
                  <div className="mt-2 p-3 bg-gray-700/30 rounded-lg text-gray-300">
                    {member.currentTask}
                  </div>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          cardPosition={cardPosition}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}

const styles = `
  @keyframes backdropFadeIn {
    0% { 
      background-color: rgba(0, 0, 0, 0);
      backdrop-filter: blur(0px);
    }
    100% { 
      background-color: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
    }
  }

  @keyframes expandCard {
    0% {
      opacity: 0.5;
      left: var(--card-left);
      top: var(--card-top);
      width: var(--card-width);
      height: var(--card-height);
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.05);
    }
    100% {
      opacity: 1;
      left: calc(50vw - min(600px, 90vw) / 2);
      top: calc(50vh - min(80vh, 600px) / 2);
      width: min(600px, 90vw);
      height: min(80vh, 600px);
      transform: scale(1);
    }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}