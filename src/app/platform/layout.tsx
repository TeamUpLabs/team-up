"use client";

import { useState } from "react";
import SideBar from "@/components/platform/SideBar";
import { Logo } from "@/components/logo";
import {
  Search as SearchOutline,
  FolderOpen as FolderOpenOutline,
  Users as UsersOutline,
} from "flowbite-react-icons/outline";
import {
  Search as SearchSolid,
  FolderOpen as FolderOpenSolid,
  Users as UsersSolid,
} from "flowbite-react-icons/solid";
import { usePathname } from "next/navigation";
import Header from "@/components/platform/Header";
import NotificationSidebar from "@/components/platform/NotificationSidebar";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);

  const pathname = usePathname();
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
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* 모바일 사이드바 오버레이 */}
      {/* {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-background/70 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )} */}

        {/* 모바일 알림 사이드바 오버레이 */}
        {/* {isNotificationSidebarOpen && (
          <div
            className="fixed inset-0 bg-background/70 lg:hidden"
            onClick={() => setIsNotificationSidebarOpen(false)}
          />
        )} */}
      <SideBar
        isSidebarOpen={isSidebarOpen}
        title={<Logo className="!text-xl" />}
        titleHref="/platform"
        navItems={mainNavItems}
      />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'} ${isNotificationSidebarOpen ? 'md:mr-72' : 'md:mr-0'}`}>
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
  )
}