"use client";

import SideBar from "@/components/platform/SideBar";
import { useState, useEffect, use, useRef } from "react";
import { Project } from "@/types/Project";
import { usePathname } from "next/navigation";
import { getProjectById } from "@/hooks/getProjectData";
import { ProjectProvider } from "@/contexts/ProjectContext";
import UserDropdown from "@/components/platform/UserDropdown";
import NotificationDropdown from "@/components/platform/NotificationDropdown";
import NotificationSidebar from "@/components/platform/NotificationSidebar";
import { VoiceCallProvider } from "@/contexts/VoiceCallContext";
import VoiceCallContainer from "@/components/project/VoiceCall/VoiceCallContainer";
import {
  Grid as GridOutline,
  Users as UsersOutline,
  Messages as MessagesOutline,
  ClipboardList as ClipboardListOutline,
  CalendarMonth as CalendarMonthOutline,
  Flag as FlagOutline,
  Cog as CogOutline,
  ArrowRightToBracket as ArrowRightToBracketOutline,
  Search,
  OpenSidebarAlt,
  CloseSidebarAlt,
} from "flowbite-react-icons/outline";
import {
  Grid as GridSolid,
  Users as UsersSolid,
  Messages as MessagesSolid,
  ClipboardList as ClipboardListSolid,
  CalendarMonth as CalendarMonthSolid,
  Flag as FlagSolid,
  Cog as CogSolid,
  Github as GithubSolid,
} from "flowbite-react-icons/solid";
import { Input } from "@/components/ui/Input";

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [project, setProjects] = useState<Project>();
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProjects = async (project_id: string) => {
      try {
        const data = await getProjectById(project_id);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        alert("프로젝트를 가져오는 데 실패했습니다.");
        window.location.href = "/platform";
      }
    };
    fetchProjects(projectId);
  }, [projectId]);

  // Close sidebar on navigation change (for mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const toggleNotificationSidebar = () => {
    setIsNotificationSidebarOpen(!isNotificationSidebarOpen);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 사용자가 "/"를 눌렀고, input이 아닌 곳에 포커스가 있을 때만
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault(); // "/" 입력 방지
        inputRef.current?.focus(); // input에 포커스 주기
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const projectNavItems = [
    {
      icon: GridOutline,
      activeIcon: GridSolid,
      category: "프로젝트",
      label: "대시보드",
      href: `/platform/${projectId}`,
      isActive: pathname === `/platform/${projectId}`,
    },
    {
      icon: UsersOutline,
      activeIcon: UsersSolid,
      category: "팀",
      label: "팀원",
      href: `/platform/${projectId}/members`,
      isActive: pathname === `/platform/${projectId}/members`,
    },
    {
      icon: MessagesOutline,
      activeIcon: MessagesSolid,
      category: "팀",
      label: "채팅",
      href: `/platform/${projectId}/chat`,
      isActive: pathname === `/platform/${projectId}/chat`,
    },
    {
      icon: ClipboardListOutline,
      activeIcon: ClipboardListSolid,
      category: "프로젝트",
      label: "작업",
      href: `/platform/${projectId}/tasks`,
      isActive: pathname === `/platform/${projectId}/tasks`,
    },
    {
      icon: CalendarMonthOutline,
      activeIcon: CalendarMonthSolid,
      category: "프로젝트",
      label: "일정",
      href: `/platform/${projectId}/calendar`,
      isActive: pathname === `/platform/${projectId}/calendar`,
    },
    {
      icon: FlagOutline,
      activeIcon: FlagSolid,
      category: "프로젝트",
      label: "마일스톤",
      href: `/platform/${projectId}/milestone`,
      isActive: pathname === `/platform/${projectId}/milestone`,
    },
    {
      icon: CogOutline,
      activeIcon: CogSolid,
      category: "환경 설정",
      label: "설정",
      href: `/platform/${projectId}/setting`,
      isActive: pathname === `/platform/${projectId}/setting`,
    },
    {
      icon: GithubSolid,
      activeIcon: GithubSolid,
      category: "INTEGRATIONS",
      label: "깃허브",
      href: `/platform/${projectId}/github`,
      isActive: pathname === `/platform/${projectId}/github`,
      hasIndicator: true,
      IndicatorColor: project?.github_repo_url ? "green" : "red",
    },
    {
      icon: ArrowRightToBracketOutline,
      activeIcon: ArrowRightToBracketOutline,
      label: "나가기",
      href: `/platform`,
      isActive: pathname === `/platform`,
    },
  ];

  const defaultLayout = (children: React.ReactNode) => (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/70 z-[8400] lg:hidden"
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

      <SideBar
        isSidebarOpen={isSidebarOpen}
        title={project?.title}
        titleHref={`/platform/${projectId}`}
        navItems={projectNavItems}
        isMinimized={isSidebarCollapsed}
      />

      <div
        className={`w-full flex-1 transition-all duration-300 
          ${isSidebarCollapsed ? "lg:ml-0" : "lg:ml-64"}
          ${isNotificationSidebarOpen ? "lg:mr-72" : ""}`}
      >
        <header
          className={`h-auto bg-component-background min-h-16 border-b border-component-border backdrop-blur-sm fixed top-0 right-0 left-0 ${isSidebarCollapsed ? "lg:left-0" : "lg:left-64"
            } ${isNotificationSidebarOpen ? "lg:right-72" : ""
            } z-40 content-center transition-all duration-300`}
        >
          <div className="h-full px-3 py-2 sm:px-4 flex items-center gap-3 justify-between">
            <div className="flex items-center gap-4 w-full">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setIsSidebarOpen(!isSidebarOpen);
                    } else {
                      setIsSidebarCollapsed(!isSidebarCollapsed);
                    }
                  }}
                  className="p-2 rounded-md text-text-secondary hover:bg-component-tertiary-background hover:text-text-primary cursor-pointer"
                >
                  {isSidebarCollapsed ? (
                    <OpenSidebarAlt className="w-5 h-5" />
                  ) : (
                    <CloseSidebarAlt className="w-5 h-5" />
                  )}
                </button>
                <div className="h-6 w-px bg-component-border mx-2"></div>
              </div>
              <div className="relative flex-1 max-w-2xl">
                <Input
                  ref={inputRef}
                  placeholder="Search projects, tasks, or team members..."
                  value={headerSearchQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    setHeaderSearchQuery(value);

                    const searchEvent = new CustomEvent(
                      "headerSearch",
                      {
                        detail: value,
                        bubbles: true,
                        cancelable: true,
                      }
                    );
                    window.dispatchEvent(searchEvent);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const searchEvent = new CustomEvent(
                        "headerSearch",
                        {
                          detail: headerSearchQuery,
                          bubbles: true,
                          cancelable: true,
                        }
                      );
                      window.dispatchEvent(searchEvent);
                    }
                  }}
                  startAdornment={
                    <Search className="w-5 h-5 text-text-secondary" />
                  }
                  endAdornment={
                    <span className="text-text-secondary p-1 border border-component-border rounded w-6 h-6 flex items-center justify-center">/</span>
                  }
                />
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-3">
              <NotificationDropdown
                onToggleSidebar={toggleNotificationSidebar}
              />
              <UserDropdown />
            </div>
          </div>
        </header>

        <main className="mt-16">{children}</main>
      </div>
    </>
  );

  if (!project) {
    return (
      <div className="flex min-h-screen bg-background">
        <VoiceCallProvider>
          {defaultLayout(children)}
          <VoiceCallContainer />
        </VoiceCallProvider>
      </div>
    );
  }

  return (
    <ProjectProvider project={project}>
      <VoiceCallProvider>
        <div className="flex min-h-screen bg-background">
          {defaultLayout(children)}

          {/* Voice Call Container always present but conditionally rendered */}
          <VoiceCallContainer />
          <NotificationSidebar
            isOpen={isNotificationSidebarOpen}
            onClose={() => setIsNotificationSidebarOpen(false)}
          />
        </div>
      </VoiceCallProvider>
    </ProjectProvider>
  );
}
