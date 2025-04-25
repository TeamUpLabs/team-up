"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/platform/sidebar";
import Logo from "@/components/logo";
import { useAuthStore } from "@/auth/authStore";
import { usePathname } from "next/navigation";
import { faHouse, faFolder, faPeopleGroup, faGear } from "@fortawesome/free-solid-svg-icons";
import UserDropdown from "@/components/platform/UserDropdown";
import NewProjectModal from "@/components/platform/NewProjectModal";
import { Project } from "@/types/Project";
import { getProjectByMemberId } from "@/hooks/getProjectData";

export default function PlatformLayout({ children, HeaderTitle }: { children: React.ReactNode, HeaderTitle: string }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasParticipationRequests, setHasParticipationRequests] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  // 인증 상태 확인
  useEffect(() => {
    if (!isAuthenticated()) {
      useAuthStore.getState().setAlert("로그인 후 사용 가능합니다.", "warning");
      window.location.href = '/signin';
      return;
    }
    setIsLoading(false);
  }, [isAuthenticated]);

  // 프로젝트 데이터 가져오기
  useEffect(() => {
    const fetchProjects = async (member_id: number) => {
      try {
        const data = await getProjectByMemberId(member_id);
        
        // 참여 요청이 있는지 확인
        const hasRequests = data.some(
          (project: Project) => project.participationRequestMembers && 
          project.participationRequestMembers.length > 0
        );
        setHasParticipationRequests(hasRequests);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    
    if (user) {
      fetchProjects(user.id);
    }
  }, [user]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 로딩 중이거나 인증되지 않은 상태면 내용을 표시하지 않음
  if (isLoading) {
    return null;
  }

  const mainNavItems = [
      { icon: faHouse, label: "홈", href: "/platform", isActive: pathname === "/platform" },
      { icon: faFolder, label: "프로젝트 찾기", href: "/platform/projects", isActive: pathname === "/platform/projects" },
      { icon: faPeopleGroup, label: "팀원 찾기", href: "/platform/members", isActive: pathname === "/platform/members" },
      { icon: faGear, label: "설정", href: "/platform/settings", isActive: pathname === "/platform/settings", hasNotification: hasParticipationRequests }
    ];
  return (
    <div className="flex min-h-screen bg-(--color-background)">
      {/* 모바일 사이드바 오버레이 */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-(--color-background)/70 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
  
        <Sidebar 
          isSidebarOpen={isSidebarOpen}
          title={<Logo />}
          titleHref="/platform"
          navItems={mainNavItems}
        />

        {/* 메인 컨텐츠 영역 */}
      <div className="w-full lg:ml-64 flex-1">
        {/* 헤더 */}
        <header className="h-16 border-b border-gray-800 backdrop-blur-sm fixed top-0 right-0 left-0 lg:left-64 z-10">
          <div className="h-full px-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center">
              <button 
                className="mr-4 lg:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h2 className="text-lg md:text-xl font-semibold">{HeaderTitle}</h2>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button 
                className="group flex items-center gap-1.5 px-3.5 py-2 bg-white/5 border border-purple-500/20 text-sm font-medium rounded-md transition-all hover:bg-purple-500/10 hover:border-purple-500/40 hover:shadow-sm"
                onClick={() => setIsModalOpen(true)}
              >
                <span className="text-purple-400 group-hover:text-purple-300">+</span>
                <span className="text-purple-400 group-hover:text-purple-300">새 프로젝트</span>
              </button>
              <UserDropdown />
            </div>
          </div>
        </header>
        
        <main className="pt-20 md:pt-24 px-4 md:px-6">
          {children}
        </main>
      </div>
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}