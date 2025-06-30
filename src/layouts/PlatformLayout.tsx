"use client";

import { useState, useEffect, useRef } from "react";
import SideBar from "@/components/platform/SideBar";
import NotificationSidebar from "@/components/platform/NotificationSidebar";
import { Logo } from "@/components/logo";
import { useAuthStore } from "@/auth/authStore";
import { usePathname } from "next/navigation";
import { 
  Search as SearchOutline,
  FolderOpen as FolderOpenOutline,
  Users as UsersOutline,
  ArrowRightToBracket as ArrowRightToBracketOutline,
} from "flowbite-react-icons/outline";
import { 
  Search as SearchSolid,
  FolderOpen as FolderOpenSolid,
  Users as UsersSolid,
} from "flowbite-react-icons/solid";
import UserDropdown from "@/components/platform/UserDropdown";
import NewProjectModal from "@/components/platform/NewProjectModal";
import NotificationDropdown from "@/components/platform/NotificationDropdown";
import { NotificationProvider } from "@/providers/NotificationProvider";
import NotificationAlertProvider from "@/providers/NotificationAlertProvider";
import { Input } from "@/components/ui/Input";
import { Search } from "flowbite-react-icons/outline";
import { OpenSidebarAlt, CloseSidebarAlt } from "flowbite-react-icons/outline";

export default function PlatformLayout({ children }: { children: React.ReactNode, HeaderTitle: string }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 인증 상태 확인
  useEffect(() => {
    if (!isAuthenticated()) {
      useAuthStore.getState().setAlert("로그인 후 사용 가능합니다.", "warning");
      window.location.href = '/signin';
      return;
    }
    setIsLoading(false);
  }, [isAuthenticated]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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

  // 로딩 중이거나 인증되지 않은 상태면 내용을 표시하지 않음
  if (isLoading) {
    return null;
  }

  const mainNavItems = [
      { 
        icon: FolderOpenOutline, 
        activeIcon: FolderOpenSolid, 
        category: "내 활동",
        label: "내 프로젝트", 
        href: "/platform", 
        isActive: pathname === "/platform" 
      },
      { 
        icon: SearchOutline, 
        activeIcon: SearchSolid, 
        category: "탐색",
        label: "프로젝트 찾기", 
        href: "/platform/projects", 
        isActive: pathname === "/platform/projects" 
      },
      { 
        icon: UsersOutline, 
        activeIcon: UsersSolid, 
        category: "탐색",
        label: "팀원 찾기", 
        href: "/platform/members", 
        isActive: pathname === "/platform/members" 
      },
      {
        icon: ArrowRightToBracketOutline,
        activeIcon: ArrowRightToBracketOutline,
        label: "나가기",
        href: `/`,
        isActive: pathname === `/`,
      },
    ];
  return (
    <NotificationProvider>
      <NotificationAlertProvider />
      <div className="flex min-h-screen bg-background">
        {/* 모바일 사이드바 오버레이 */}
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
            title={<Logo className="!text-xl" />}
            titleHref="/platform"
            navItems={mainNavItems}
            isMinimized={isSidebarCollapsed}
          />

          {/* 메인 컨텐츠 영역 */}
        <div className={`w-full flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} ${isNotificationSidebarOpen ? 'lg:mr-72' : ''}`}>
          {/* 헤더 */}
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
          
          <main className="pt-20 px-4">
            {children}
          </main>
        </div>
        <NotificationSidebar 
          isOpen={isNotificationSidebarOpen} 
          onClose={() => setIsNotificationSidebarOpen(false)}
        />
        <NewProjectModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </NotificationProvider>
  );
}