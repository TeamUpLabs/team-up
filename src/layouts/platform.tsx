"use client";

import { useState, useEffect, useRef } from "react";
import { Project } from "@/types/Project";
import { useAuthStore } from "@/auth/authStore";
import { getProjectByMemberId } from "@/hooks/getProjectData";
import ProjectCard from "@/components/platform/ProjectCard";
import NewProjectModal from "@/components/platform/NewProjectModal";
import { useSearchParams } from "next/navigation";

export default function Platform() {
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const initialSearchQuery = searchParams?.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isMounted = useRef(false);

  // 프로젝트 데이터 가져오기
  useEffect(() => {
    let didFetch = false;
    const fetchProjects = async (member_id: number) => {
      if (didFetch) return;
      didFetch = true;

      try {
        const data = await getProjectByMemberId(member_id);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        alert("프로젝트를 가져오는 데 실패했습니다.");
      }
    };
    if (user) {
      fetchProjects(user.id);
    }

    return () => {
      didFetch = true; // cleanup에서 재호출 방지
    }
  }, [user]);

  // Listen for header search events
  useEffect(() => {
    const handleHeaderSearch = (event: Event) => {
      const customEvent = event as CustomEvent;
      const searchValue = customEvent.detail || '';

      // Only update if value is different
      if (searchValue !== searchQuery) {
        setSearchQuery(searchValue);
      }
    };

    // Add event listener
    window.addEventListener('headerSearch', handleHeaderSearch);

    return () => {
      window.removeEventListener('headerSearch', handleHeaderSearch);
    };
  }, [searchQuery]);

  // Update mounted ref
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (isMounted.current) return;

    const searchValue = searchParams?.get('search');
    if (searchValue !== null) {
      setSearchQuery(searchValue || '');
    }
  }, [searchParams]);


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const filteredProjects = (projects ?? []).filter(project => {
    const lowercaseQuery = searchQuery.toLowerCase();

    return project.title.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      project.status.toLowerCase().includes(lowercaseQuery) ||
      project.location.toLowerCase().includes(lowercaseQuery) ||
      project.projectType.toLowerCase().includes(lowercaseQuery) ||
      project.roles.some(role => role.toLowerCase().includes(lowercaseQuery)) ||
      project.techStack.some(tech => tech.toLowerCase().includes(lowercaseQuery));
  })

  return (
    <div className="max-w-7xl mx-auto">
      {/* 프로젝트 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* 프로젝트 카드 */}
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} project={project} isExplore={false} />
        ))}

        {/* 빈 프로젝트 카드 */}
        <div className="bg-component-background rounded-lg p-6 border border-dashed border-gray-700/50 flex flex-col">
          <div className="flex-1 flex items-center justify-center min-h-[12rem]">
            <div className="text-center">
              <p className="text-text-secondary mb-2">새로운 프로젝트를 시작해보세요</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-point-color-indigo hover:text-point-color-indigo-hover hover:underline cursor-pointer"
              >+ 프로젝트 생성</button>
            </div>
          </div>
        </div>
      </div>
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}