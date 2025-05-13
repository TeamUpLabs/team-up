"use client";

import { faBorderAll, faMessage, faTasks, faCalendar, faUsers, faFlag, faGear, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "@/components/platform/sidebar";
import { useState, useEffect, use } from "react";
import { Project } from "@/types/Project";
import { usePathname } from "next/navigation";
import { getProjectById } from "@/hooks/getProjectData";
import { ProjectProvider } from "@/contexts/ProjectContext";
import UserDropdown from "@/components/platform/UserDropdown";
import NotificationDropdown from "@/components/platform/NotificationDropdown";
import NotificationSidebar from "@/components/platform/NotificationSidebar";
import { NotificationProvider } from "@/providers/NotificationProvider";
import NotificationAlertProvider from "@/providers/NotificationAlertProvider";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isMinimized, setIsMinimized] = useState(true);
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);

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

  // Close sidebar on navigation change (for mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Handle search animations
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSearchOpen) {
      setSearchVisible(true);
    } else {
      timer = setTimeout(() => {
        setSearchVisible(false);
      }, 300); // match this to your animation duration
    }
    return () => clearTimeout(timer);
  }, [isSearchOpen]);

  const toggleNotificationSidebar = () => {
    setIsNotificationSidebarOpen(!isNotificationSidebarOpen);
  };

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
    { icon: faBorderAll, label: "대시보드", href: `/platform/${projectId}`, isActive: pathname === `/platform/${projectId}` },
    { icon: faUsers, label: "팀원", href: `/platform/${projectId}/members`, isActive: pathname === `/platform/${projectId}/members` },
    { icon: faMessage, label: "채팅", href: `/platform/${projectId}/chat`, isActive: pathname === `/platform/${projectId}/chat` },
    { icon: faTasks, label: "작업", href: `/platform/${projectId}/tasks`, isActive: pathname === `/platform/${projectId}/tasks` },
    { icon: faCalendar, label: "일정", href: `/platform/${projectId}/calendar`, isActive: pathname === `/platform/${projectId}/calendar` },
    { icon: faFlag, label: "마일스톤", href: `/platform/${projectId}/milestone`, isActive: pathname === `/platform/${projectId}/milestone` },
    { icon: faGear, label: "설정", href: `/platform/${projectId}/setting`, isActive: pathname === `/platform/${projectId}/setting` },
    { icon: faChevronLeft, label: "나가기", href: `/platform`, isActive: pathname === `/platform` }
  ];

  return (
    <ProjectProvider project={project}>
      <NotificationProvider>
        <NotificationAlertProvider />
        <div className="flex min-h-screen bg-background">
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-background/70 z-1 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* 모바일 알림 사이드바 오버레이 */}
          {isNotificationSidebarOpen && (
            <div 
              className="fixed inset-0 bg-background/70 z-[8400] lg:hidden"
              onClick={() => setIsNotificationSidebarOpen(false)}
            />
          )}

          <Sidebar
            isSidebarOpen={isSidebarOpen}
            title={project.title}
            miniTitle={project.title.charAt(0)}
            titleHref={`/platform/${projectId}`}
            navItems={projectNavItems}
            onMinimizeChange={setIsMinimized}
          />

          <div className={`w-full flex-1 transition-all duration-300 ${isMinimized ? 'lg:ml-16' : 'lg:ml-64'} ${isNotificationSidebarOpen ? 'lg:mr-72' : ''}`}>
            <header className={`h-auto bg-component-background min-h-16 border-b border-component-border backdrop-blur-sm fixed top-0 right-0 left-0 ${isMinimized ? 'lg:left-16' : 'lg:left-64'} ${isNotificationSidebarOpen ? 'lg:right-72' : ''} z-40 content-center transition-all duration-300`}>
              <div className="h-full px-3 py-2 sm:px-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    className="text-text-secondary lg:hidden mt-1"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <p className="text-sm md:text-base text-text-secondary line-clamp-2 pr-2">
                      {project.description}
                    </p>
                    <span className="px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-100 rounded-full w-fit whitespace-nowrap">
                      {project.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center relative gap-2">
                    {searchVisible && (
                      <div className={`${isSearchOpen ? 'animate-searchAppear' : 'animate-searchDisappear'} origin-right overflow-hidden`} style={{ width: isSearchOpen ? '240px' : '0' }}>
                        <input
                          type="text"
                          placeholder="Search..."
                          className="bg-component-background border border-component-border rounded-full py-1 px-4 w-full focus:outline-none focus:border-point-color-indigo hover:border-point-color-indigo"
                          autoFocus
                          value={headerSearchQuery}
                          onChange={(e) => {
                            const value = e.target.value;
                            setHeaderSearchQuery(value);

                            const searchEvent = new CustomEvent('headerSearch', {
                              detail: value,
                              bubbles: true,
                              cancelable: true
                            });
                            window.dispatchEvent(searchEvent);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const searchEvent = new CustomEvent('headerSearch', {
                                detail: headerSearchQuery,
                                bubbles: true,
                                cancelable: true
                              });
                              window.dispatchEvent(searchEvent);
                            }
                          }}
                        />
                      </div>
                    )}
                    <button
                      aria-label="Search"
                      onClick={() => setIsSearchOpen(!isSearchOpen)}
                      className="rounded-full p-2 hover:bg-component-secondary-background transition-colors duration-200"
                    >
                      {isSearchOpen ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <NotificationDropdown onToggleSidebar={toggleNotificationSidebar} />
                  <UserDropdown />
                </div>
              </div>
            </header>

            <main>
              {children}
            </main>
          </div>
          <NotificationSidebar 
            isOpen={isNotificationSidebarOpen} 
            onClose={() => setIsNotificationSidebarOpen(false)}
          />
        </div>
      </NotificationProvider>
    </ProjectProvider>
  );
}
