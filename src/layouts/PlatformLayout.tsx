"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/platform/sidebar";
import NotificationSidebar from "@/components/platform/NotificationSidebar";
import { Logo, MiniLogo } from "@/components/logo";
import { useAuthStore } from "@/auth/authStore";
import { usePathname } from "next/navigation";
import { faHouse, faFolder, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import UserDropdown from "@/components/platform/UserDropdown";
import NewProjectModal from "@/components/platform/NewProjectModal";
import NotificationDropdown from "@/components/platform/NotificationDropdown";

export default function PlatformLayout({ children, HeaderTitle }: { children: React.ReactNode, HeaderTitle: string }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isMinimized, setIsMinimized] = useState(true);
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const toggleNotificationSidebar = () => {
    setIsNotificationSidebarOpen(!isNotificationSidebarOpen);
  };

  // 로딩 중이거나 인증되지 않은 상태면 내용을 표시하지 않음
  if (isLoading) {
    return null;
  }

  const mainNavItems = [
      { icon: faHouse, label: "내 프로젝트", href: "/platform", isActive: pathname === "/platform" },
      { icon: faFolder, label: "프로젝트 찾기", href: "/platform/projects", isActive: pathname === "/platform/projects" },
      { icon: faPeopleGroup, label: "팀원 찾기", href: "/platform/members", isActive: pathname === "/platform/members" },
    ];
  return (
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
  
        <Sidebar 
          isSidebarOpen={isSidebarOpen}
          title={<Logo />}
          miniTitle={<MiniLogo />}
          titleHref="/platform"
          navItems={mainNavItems}
          onMinimizeChange={setIsMinimized}
        />

        {/* 메인 컨텐츠 영역 */}
      <div className={`w-full flex-1 transition-all duration-300 ${isMinimized ? 'lg:ml-16' : 'lg:ml-64'} ${isNotificationSidebarOpen ? 'lg:mr-72' : ''}`}>
        {/* 헤더 */}
        <header className={`h-16 bg-component-background border-b border-component-border backdrop-blur-sm fixed top-0 right-0 left-0 ${isMinimized ? 'lg:left-16' : 'lg:left-64'} ${isNotificationSidebarOpen ? 'lg:right-72' : ''} z-[8000] transition-all duration-300`}>
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
            <div className="flex items-center space-x-4">
              <div className="flex items-center relative gap-2">
                {searchVisible && (
                  <div className={`${isSearchOpen ? 'animate-searchAppear' : 'animate-searchDisappear'} origin-right overflow-hidden`} style={{width: isSearchOpen ? '240px' : '0'}}>
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
                      <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
              <NotificationDropdown onToggleSidebar={toggleNotificationSidebar} />
              <button 
                className="group active:scale-95 flex items-center justify-center gap-2 px-4 py-2 bg-component-secondary-background border border-component-border text-sm text-text-primary font-medium rounded-lg transition-all hover:bg-component-tertiary-background"
                onClick={() => setIsModalOpen(true)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 3.33334V12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.33334 8H12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Create</span>
              </button>
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
  );
}