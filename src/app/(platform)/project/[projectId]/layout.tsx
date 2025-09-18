"use client";

import SideBar from "@/components/platform/SideBar";
import { useState, use } from "react";
import { Project } from "@/types/Project";
import { usePathname } from "next/navigation";
import { ProjectProvider } from "@/contexts/ProjectContext";
import NotificationSidebar from "@/components/platform/NotificationSidebar";
import { VoiceCallProvider } from "@/contexts/VoiceCallContext";
import VoiceCallContainer from "@/components/project/VoiceCall/VoiceCallContainer";
import useAuthHydration from "@/hooks/useAuthHydration";
import { fetcher } from "@/auth/server";
import useSWR from "swr";
import {
  Grid as GridOutline,
  Users as UsersOutline,
  Messages as MessagesOutline,
  ClipboardList as ClipboardListOutline,
  CalendarMonth as CalendarMonthOutline,
  Flag as FlagOutline,
  Cog as CogOutline,
  ArrowRightToBracket as ArrowRightToBracketOutline,
  Book as BookOutline,
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
  Book as BookSolid,
} from "flowbite-react-icons/solid";
import Header from "@/components/platform/Header";


export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);

  const hydrated = useAuthHydration();
  const { data: project, error, isLoading } = useSWR<Project>(
    hydrated ? `/api/v1/projects/${projectId}` : null,
    fetcher
  );

  const projectNavItems = [
    {
      icon: GridOutline,
      activeIcon: GridSolid,
      category: "프로젝트",
      label: "대시보드",
      href: `/project/${projectId}`,
      isActive: pathname === `/project/${projectId}`,
    },
    {
      icon: UsersOutline,
      activeIcon: UsersSolid,
      category: "팀",
      label: "팀원",
      href: `/project/${projectId}/members`,
      isActive: pathname === `/project/${projectId}/members`,
    },
    {
      icon: MessagesOutline,
      activeIcon: MessagesSolid,
      category: "팀",
      label: "채팅",
      href: `/project/${projectId}/chat`,
      isActive: pathname === `/project/${projectId}/chat`,
    },
    {
      icon: ClipboardListOutline,
      activeIcon: ClipboardListSolid,
      category: "프로젝트",
      label: "작업",
      href: `/project/${projectId}/tasks`,
      isActive: pathname === `/project/${projectId}/tasks`,
    },
    {
      icon: CalendarMonthOutline,
      activeIcon: CalendarMonthSolid,
      category: "프로젝트",
      label: "일정",
      href: `/project/${projectId}/calendar`,
      isActive: pathname === `/project/${projectId}/calendar`,
    },
    {
      icon: FlagOutline,
      activeIcon: FlagSolid,
      category: "프로젝트",
      label: "마일스톤",
      href: `/project/${projectId}/milestone`,
      isActive: pathname === `/project/${projectId}/milestone`,
    },
    {
      icon: BookOutline,
      activeIcon: BookSolid,
      category: "프로젝트",
      label: "화이트 보드",
      href: `/project/${projectId}/whiteboard`,
      isActive: pathname === `/project/${projectId}/whiteboard`,
    },
    {
      icon: CogOutline,
      activeIcon: CogSolid,
      category: "환경 설정",
      label: "설정",
      href: `/project/${projectId}/setting`,
      isActive: pathname === `/project/${projectId}/setting`,
    },
    {
      icon: GithubSolid,
      activeIcon: GithubSolid,
      category: "기능",
      label: "깃허브",
      href: `/project/${projectId}/github`,
      isActive: pathname === `/project/${projectId}/github`,
      hasIndicator: true,
      IndicatorColor: project?.github_url ? "green" : "red",
    },
    {
      icon: ArrowRightToBracketOutline,
      activeIcon: ArrowRightToBracketOutline,
      label: "나가기",
      href: `/platform`,
      isActive: pathname === `/platform`,
    },
  ];

  const layoutContent = (
    <div className="flex min-h-screen bg-background">
      {/* {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/70 lg:hidden z-[11]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {isNotificationSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/70 lg:hidden"
          onClick={() => setIsNotificationSidebarOpen(false)}
        />
      )} */}
      <SideBar
        isSidebarOpen={isSidebarOpen}
        title={project?.title}
        titleHref={`/project/${projectId}`}
        navItems={projectNavItems}
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "md:ml-0"} ${isNotificationSidebarOpen ? "md:mr-72" : "md:mr-0"}`}>
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isNotificationSidebarOpen={isNotificationSidebarOpen}
          setIsNotificationSidebarOpen={setIsNotificationSidebarOpen}
        >
          {children}
        </Header>
      </div>
      <NotificationSidebar
        isOpen={isNotificationSidebarOpen}
        onClose={() => setIsNotificationSidebarOpen(false)}
      />
    </div>
  );

  if (isLoading || !hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-text-secondary">
        로딩 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-red-500">
        프로젝트를 불러오는 데 실패했습니다.
      </div>
    );
  }

  if (!project) {
    // 데이터가 없고 로딩도 끝났으며 에러도 없는 경우 (예: 권한 없음 또는 존재하지 않는 프로젝트)
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-text-secondary">
        프로젝트를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <ProjectProvider projectId={projectId}>
      <VoiceCallProvider>
        {layoutContent}
        <VoiceCallContainer />
      </VoiceCallProvider>
    </ProjectProvider>
  );
}
