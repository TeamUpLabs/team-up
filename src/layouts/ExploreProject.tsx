"use client";

import { useState, useEffect } from "react"
import { getAllProjectsExceptMyProject } from "@/hooks/getProjectData";
import { Project } from "@/types/Project";
import ProjectCard from "@/components/platform/ProjectCard";
import { useAuthStore } from "@/auth/authStore";

export default function ExploreProject() {
  const [searchQuery, setSearchQuery] = useState('');;
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedOption, setSelectedOption] = useState('');
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchProjects = async (user_id: number) => {
      try {
        const data = await getAllProjectsExceptMyProject(user_id);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        alert("프로젝트를 가져오는 데 실패했습니다.");
      }
    }

    if (user) {
      fetchProjects(user.id);
    }
  }, [user])

  const placeholderMap: { [key: string]: string } = {
    title: "프로젝트 제목을 입력하세요",
    status: "프로젝트의 상태를 입력하세요  예: 모집중, 진행중",
    role: "역할을 입력하세요  예: 백엔드 개발자, 디자이너",
    teckstack: "기술 스택을 입력하세요  예: Next.js, Python",
    location: "위치를 입력하세요  예: 서울, 원격",
  };

  const filteredProjects = (projects ?? []).filter(project => {
    let matchesSearch = false;
    switch (selectedOption) {
      case "title":
        matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
        break;
      case "status":
        matchesSearch = project.status.toLowerCase().includes(searchQuery.toLowerCase());
        break;
      case "role":
        matchesSearch = project.roles.some(role => (
          role.toLowerCase().includes(searchQuery.toLowerCase())
        ));
        break;
      case "teckstack":
        matchesSearch = project.techStack.some(techstack => (
          techstack.toLowerCase().includes(searchQuery.toLowerCase())
        ));
        break;
      case "location":
        matchesSearch = project.location.toLowerCase().includes(searchQuery.toLowerCase());
        break;
      default:
        matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return matchesSearch
  })

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row gap-4 md:items-center md:space-x-3">
        <div className="relative">
          <select 
            className="appearance-none bg-gray-900 border border-gray-700/50 rounded-lg pl-4 pr-10 py-2.5 text-sm w-full md:w-48 text-gray-300 hover:border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
            onChange={(e) => setSelectedOption(e.target.value)}
            value={selectedOption}
          >
            <option value="">모든 카테고리</option>
            <option value="title">제목</option>
            <option value="status">상태</option>
            <option value="role">역할</option>
            <option value="techstack">기술</option>
            <option value="location">위치</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a 1 1 0 01-1.414 0l-4-4a 1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        <div className="relative flex-1">
          <input
            type="search"
            placeholder={placeholderMap[selectedOption] || "프로젝트 검색"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-300 placeholder-gray-400 hover:border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center text-gray-400 mt-8 p-8 bg-component-background border border-gray-700/50 rounded-lg">
          검색 결과가 없습니다.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} isExplore={true} />
        ))}
      </div>
    </div>
  )
}