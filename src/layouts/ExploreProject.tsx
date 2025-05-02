"use client";

import { useState, useEffect, useRef } from "react"
import { getAllProjectsExceptMyProject } from "@/hooks/getProjectData";
import { Project } from "@/types/Project";
import ProjectCard from "@/components/platform/ProjectCard";
import { useAuthStore } from "@/auth/authStore";

export default function ExploreProject() {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const user = useAuthStore((state) => state.user);
  const isMounted = useRef(false);

  // Fetch projects data
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

  // Set mounted flag
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const filteredProjects = (projects ?? []).filter(project => {
    // If no search query, show all projects
    if (!searchQuery.trim()) return true;
    
    const lowercaseQuery = searchQuery.toLowerCase();
    
    // Use comprehensive search by default since we fixed selectedOption
    // Comprehensive search across all relevant fields
    return project.id.toLowerCase().includes(lowercaseQuery) ||
      project.title.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      project.status.toLowerCase().includes(lowercaseQuery) ||
      project.location.toLowerCase().includes(lowercaseQuery) ||
      project.projectType.toLowerCase().includes(lowercaseQuery) ||
      project.roles.some(role => role.toLowerCase().includes(lowercaseQuery)) ||
      project.techStack.some(tech => tech.toLowerCase().includes(lowercaseQuery));
  });

  return (
    <div className="max-w-7xl mx-auto">
      {filteredProjects.length === 0 && (
        <div className="text-center text-text-secondary mt-8 p-8 bg-component-background border border-component-border rounded-lg">
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