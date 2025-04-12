"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faMessage, faTasks, faCalendar, faUsers, faFlag, faGear } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import Sidebar from "@/components/platform/sidebar";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Project } from "@/types/Project";
import { usePathname } from "next/navigation";
import { getProjectById } from "@/hooks/getProjectData";

export default function ProjectLayout({ 
  children,
  params 
}: { 
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [project, setProjects] = useState<Project>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async (project_id: string) => {
      try {
        const data = await getProjectById(project_id);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        alert("프로젝트를 가져오는 데 실패했습니다.");
        window.location.href = '/platform';
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects(projectId);
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-neutral-900 text-white">
        <div className="lg:ml-64 w-full p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-700 rounded w-1/3" />
            <div className="h-4 bg-gray-700 rounded w-1/2" />
            <div className="h-64 bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!project) {
    return <div className="text-white">프로젝트를 찾을 수 없습니다.</div>;
  }

  const projectNavItems = [
    { icon: faHouse, label: "대시보드", href: `/platform/${projectId}`, isActive: pathname === `/platform/${projectId}` },
    { icon: faUsers, label: "팀원", href: `/platform/${projectId}/members`, isActive: pathname === `/platform/${projectId}/members` },
    { icon: faMessage, label: "채팅", href: `/platform/${projectId}/chat`, isActive: pathname === `/platform/${projectId}/chat` },
    { icon: faTasks, label: "작업", href: `/platform/${projectId}/tasks`, isActive: pathname === `/platform/${projectId}/tasks` },
    { icon: faCalendar, label: "일정", href: `/platform/${projectId}/calendar`, isActive: pathname === `/platform/${projectId}/calendar` },
    { icon: faFlag, label: "마일스톤", href: `/platform/${projectId}/milestone`, isActive: pathname === `/platform/${projectId}/milestone` },
    { icon: faGear, label: "설정", href: `/platform/${projectId}/setting`, isActive: pathname === `/platform/${projectId}/setting` }
  ];

  return (
    <div className="flex min-h-screen bg-(--color-background)">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-(--color-background)/70 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        isSidebarOpen={isSidebarOpen}
        title={project.title}
        titleHref={`/platform/${projectId}`}
        navItems={projectNavItems}
      />

      <div className="w-full lg:ml-64 flex-1">
      <header className="h-auto min-h-16 border-b border-gray-800 backdrop-blur-sm fixed top-0 right-0 left-0 lg:left-64 z-10 content-center">
          <div className="h-full px-3 py-2 sm:px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                className="text-gray-400 lg:hidden mt-1"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <p className="text-sm md:text-base text-gray-400 line-clamp-2 pr-2">
                  {project.description}
                </p>         
                <span className="px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-100 rounded-full w-fit whitespace-nowrap">
                  {project.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faBell} className="w-4 h-4 sm:w-5 sm:h-5 p-2 border border-gray-700 rounded" />
              <Link href={`/platform`} className="p-2 text-sm font-bold bg-red-500 rounded">
                <span>나가기</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}
