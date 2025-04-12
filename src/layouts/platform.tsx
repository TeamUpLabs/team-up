"use client";

import { useState, useEffect } from "react";
import { Project } from "@/types/Project";
import { useAuthStore } from "@/auth/authStore";
import { getProjectByMemberId } from "@/hooks/getProjectData";
import ProjectCard from "@/components/platform/ProjectCard";


export default function Platform() {
  const [projects, setProjects] = useState<Project[]>([]);
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

  return (
          <div className="max-w-7xl mx-auto">
            {/* 필터 영역 */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 md:items-center md:space-x-4">
              <div className="relative">
                <select className="appearance-none bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-10 py-2.5 text-sm w-full md:w-48 text-gray-300 hover:border-gray-600 focus:border-purple-500 focus:outline-none transition-colors">
                  <option value="">모든 카테고리</option>
                  <option value="web">웹 개발</option>
                  <option value="mobile">모바일 앱</option>
                  <option value="design">디자인</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a 1 1 0 01-1.414 0l-4-4a 1 1 0 010-1.414z"/>
                  </svg>
                </div>
              </div>
              <div className="relative flex-1">
                <input
                  type="search"
                  placeholder="프로젝트 검색..."
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
              {projects.map(project => (
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