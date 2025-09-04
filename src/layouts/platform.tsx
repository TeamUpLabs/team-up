"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import { useAuthStore } from "@/auth/authStore";
import useAuthHydration from "@/hooks/useAuthHydration";
import { Project } from "@/types/Project";
import { useSearchParams } from "next/navigation";
import { fetcher } from "@/auth/server";
import useSWR from "swr";

// 지연 로딩을 위한 컴포넌트들
const ProjectCard = lazy(() => import("@/components/platform/ProjectCard"));
const NewProjectModal = lazy(() => import("@/components/platform/NewProjectModal"));

// 로딩 컴포넌트
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
  </div>
);

// Separate component to handle search params with Suspense
function PlatformContent() {
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams?.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthHydration();

  const { data: projects, error, isLoading } = useSWR(
    hydrated && user?.id ? `/users/${user.id}/projects` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 10, // 10분
    }
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const filteredProjects = (projects ?? []).filter((project: Project) => {
    if (!searchQuery.trim()) return true;
    const lowercaseQuery = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(lowercaseQuery) ||
      project.description.toLowerCase().includes(lowercaseQuery) ||
      project.status.toLowerCase().includes(lowercaseQuery) ||
      project.location.toLowerCase().includes(lowercaseQuery) ||
      project.project_type.toLowerCase().includes(lowercaseQuery) ||
      project.tags.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery))
    );
  });

  // Show error state if there's an error
  if (error) {
    return <div className="text-center text-red-500 p-8">프로젝트를 가져오는 데 실패했습니다.</div>;
  }

  return (
    <div className="mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <Suspense fallback={
          <div className="col-span-full flex justify-center p-8">
            <LoadingSpinner />
          </div>
        }>
          {isLoading || !hydrated ? (
            <div className="col-span-full flex justify-center p-8">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {filteredProjects.map((project: Project) => (
                <ProjectCard key={project.id} project={project} isExplore={false} />
              ))}
              <div className="bg-component-background rounded-lg p-6 border border-dashed border-gray-700/50 flex flex-col">
                <div className="flex-1 flex items-center justify-center min-h-[12rem]">
                  <div className="text-center">
                    <p className="text-text-secondary mb-2">새로운 프로젝트를 시작해보세요</p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="text-point-color-indigo hover:text-point-color-indigo-hover hover:underline cursor-pointer"
                    >
                      + 프로젝트 생성
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </Suspense>
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <NewProjectModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </Suspense>
    </div>
  );
}

export default function Platform() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
      </div>
    }>
      <PlatformContent />
    </Suspense>
  );
}