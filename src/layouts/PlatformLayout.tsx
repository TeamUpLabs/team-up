"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/platform/sidebar";
import Logo from "@/components/logo";
import { useAuthStore } from "@/auth/authStore";
import { usePathname } from "next/navigation";
import { faHouse, faFolder, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import UserDropdown from "@/components/platform/UserDropdown";

export default function PlatformLayout({ children, HeaderTitle }: { children: React.ReactNode, HeaderTitle: string }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  // 로딩 중이거나 인증되지 않은 상태면 내용을 표시하지 않음
  if (isLoading) {
    return null;
  }

  const mainNavItems = [
      { icon: faHouse, label: "홈", href: "/platform", isActive: pathname === "/platform" },
      { icon: faFolder, label: "프로젝트 찾기", href: "/platform/projects", isActive: pathname === "/platform/projects" },
      { icon: faPeopleGroup, label: "팀원 찾기", href: "/platform/members", isActive: pathname === "/platform/members" },
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
              <button className="px-3 py-1.5 md:px-4 md:py-2 bg-purple-600 text-white text-sm md:text-base rounded-lg hover:bg-purple-700">
                + 새 프로젝트
              </button>
              <UserDropdown />
            </div>
          </div>
        </header>
        
        <main className="pt-20 md:pt-24 px-4 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}