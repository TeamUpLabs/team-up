"use client";

import { useState, useEffect } from "react";
import { Project } from "@/types/Project";
import { useAuthStore } from "@/auth/authStore";
import { getProjectByMemberId } from "@/hooks/getProjectData";
import ProjectCard from "@/components/platform/ProjectCard";


export default function Platform() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const user = useAuthStore((state) => state.user);
  // 프로젝트 데이터 가져오기
  useEffect(() => {
    const fetchProjects = async (member_id: number) => {
      try {
        const data = await getProjectByMemberId(member_id);
        console.log(data);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        alert("프로젝트를 가져오는 데 실패했습니다.");
      }
    };
    if (user) {
      fetchProjects(user.id);
    }
  }, [user]);

  const filteredProjects = (projects ?? []).filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch;
  })

  return (
          <div className="max-w-7xl mx-auto">
            {/* 필터 영역 */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 md:items-center md:space-x-4">
              <div className="relative flex-1">
                <input
                  type="search"
                  placeholder="프로젝트 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-300 placeholder-gray-400 hover:border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* 프로젝트 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
              {/* 프로젝트 카드 */}
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}

              {/* 빈 프로젝트 카드 */}
              <div className="bg-gray-800/50 rounded-lg p-6 border border-dashed border-gray-700 flex flex-col">
                <div className="flex-1 flex items-center justify-center min-h-[12rem]">
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">새로운 프로젝트를 시작해보세요</p>
                    <button className="text-purple-400 hover:text-purple-300">+ 프로젝트 생성</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
  )
}