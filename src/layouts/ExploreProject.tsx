"use client";

import { useState, useEffect, useMemo, Suspense, lazy } from "react";
import useSWR from 'swr';
import { useAuthStore } from "@/auth/authStore";
import useAuthHydration from "@/hooks/useAuthHydration";
import { fetcher } from "@/auth/server";
import { Project } from "@/types/Project";

// Lazy load ProjectCard
const ProjectCard = lazy(() => import("@/components/platform/ProjectCard"));

export default function ExploreProject() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthHydration();

  // Debounce search input (type-safe for string)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data: projects, error, isLoading } = useSWR<Project[]>(
    hydrated && user?.id ? `/projects/exclude/${user.id}` : null,
    fetcher
  );

  // Listen for header search events
  useEffect(() => {
    const handleHeaderSearch = (event: Event) => {
      const customEvent = event as CustomEvent;
      const searchValue = customEvent.detail || "";
      if (searchValue !== searchQuery) {
        setSearchQuery(searchValue);
      }
    };
    window.addEventListener("headerSearch", handleHeaderSearch);
    return () => {
      window.removeEventListener("headerSearch", handleHeaderSearch);
    };
  }, [searchQuery]);

  // Memoize filtered projects (remove memoize utility to avoid type error)
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (!debouncedQuery.trim()) return projects;
    const lowercaseQuery = debouncedQuery.toLowerCase();
    return projects.filter((project: Project) =>
      project.id.toLowerCase().includes(lowercaseQuery) ||
      project.title.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      project.status.toLowerCase().includes(lowercaseQuery) ||
      project.location.toLowerCase().includes(lowercaseQuery) ||
      project.project_type.toLowerCase().includes(lowercaseQuery) ||
      project.tags.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [projects, debouncedQuery]);

  // Show loading state consistently on both server and client
  if (!hydrated || isLoading) {
    return (
      <div className="mx-auto">
        <div className="text-center text-text-secondary p-8">로딩 중...</div>
      </div>
    );
  }
  if (error) {
    return <div className="text-center text-red-500 p-8">프로젝트를 가져오는 데 실패했습니다.</div>;
  }
  return (
    <div className="mx-auto">
      {filteredProjects.length === 0 ? (
        <div className="text-center text-text-secondary p-8 bg-component-background border border-component-border rounded-lg">
          검색 결과가 없습니다.
        </div>
      ) : (
        <Suspense fallback={<div className="text-center text-text-secondary p-8">로딩 중...</div>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
            {filteredProjects.map((project: Project) => (
              <ProjectCard key={project.id} project={project} isExplore={true} />
            ))}
          </div>
        </Suspense>
      )}
    </div>
  );
}
