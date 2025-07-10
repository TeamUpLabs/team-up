"use client";

import { useState, useEffect, useRef } from "react";
import ProjectCard from "@/components/platform/ProjectCard";
import { useAuthStore } from "@/auth/authStore";
import { fetcher } from "@/auth/server";
import useSWR from "swr";
import { Project } from "@/types/Project";

export default function ExploreProject() {
  const [searchQuery, setSearchQuery] = useState("");
  const user = useAuthStore((state) => state.user);
  const isMounted = useRef(false);

  const { data, error } = useSWR(`/projects/exclude/${user?.id}`, fetcher, {
    revalidateOnFocus: false, // 탭 다시 돌아왔을 때 다시 요청 안 함
    dedupingInterval: 1000 * 60 * 10, // 10분 간 재요청 방지
  });

  const projects = data;

  if (error) {
    console.error("Error fetching projects:", error);
    alert("프로젝트를 가져오는 데 실패했습니다.");
  }

  // Listen for header search events
  useEffect(() => {
    const handleHeaderSearch = (event: Event) => {
      const customEvent = event as CustomEvent;
      const searchValue = customEvent.detail || "";

      // Only update if value is different
      if (searchValue !== searchQuery) {
        setSearchQuery(searchValue);
      }
    };

    // Add event listener
    window.addEventListener("headerSearch", handleHeaderSearch);

    return () => {
      window.removeEventListener("headerSearch", handleHeaderSearch);
    };
  }, [searchQuery]);

  // Set mounted flag
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const filteredProjects = (projects ?? []).filter((project: Project) => {
    // If no search query, show all projects
    if (!searchQuery.trim()) return true;

    const lowercaseQuery = searchQuery.toLowerCase();

    // Use comprehensive search by default since we fixed selectedOption
    // Comprehensive search across all relevant fields
    return (
      project.id.toLowerCase().includes(lowercaseQuery) ||
      project.title.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      project.status.toLowerCase().includes(lowercaseQuery) ||
      project.location.toLowerCase().includes(lowercaseQuery) ||
      project.project_type.toLowerCase().includes(lowercaseQuery) ||
      project.tags.some((tag: string) =>
        tag.toLowerCase().includes(lowercaseQuery)
      )
    );
  });

  return (
    <div className="mx-auto">
      {filteredProjects.length === 0 && (
        <div className="text-center text-text-secondary p-8 bg-component-background border border-component-border rounded-lg">
          검색 결과가 없습니다.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {filteredProjects.map((project: Project) => (
          <ProjectCard key={project.id} project={project} isExplore={true} />
        ))}
      </div>
    </div>
  );
}
