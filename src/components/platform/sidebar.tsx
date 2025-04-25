import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useProject } from "@/contexts/ProjectContext";

interface NavItem {
  icon: IconDefinition;
  label: string;
  href: string;
  isActive?: boolean;
  hasNotification?: boolean;
}

interface Channel {
  id: string;
  name: string;
}

interface SidebarProps {
  isSidebarOpen: boolean;
  title?: string | React.ReactNode;
  titleHref: string;
  navItems: NavItem[];
}

export default function Sidebar({ isSidebarOpen, title, titleHref, navItems }: SidebarProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { project } = useProject();
  
  // 임시 채널 데이터
  const channels: Channel[] = [
    { id: 'general', name: '일반' },
    { id: 'announcement', name: '공지사항' },
    { id: 'free-chat', name: '자유채팅' },
  ];

  // 참여 요청이 있는지 확인 (프로젝트 컨텍스트가 있는 경우)
  const hasParticipationRequests = project?.participationRequestMembers && project.participationRequestMembers.length > 0;

  return (
    <div className={`w-64 fixed h-full border-r border-gray-800 bg-(--color-background) z-30 transition-transform duration-300 lg:translate-x-0 ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div>
        <Link href={titleHref} className="block pt-6 pl-6 pr-6">
          <h1 className="text-xl font-bold text-white mb-8 text-center">{title}</h1>
        </Link>
        <nav className="space-y-4">
          {navItems.map((item, index) => {
            if (item.label === "채팅") {
              return (
                <div key={index} className="pl-6 pr-6">
                  <button 
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className={`w-full flex items-center justify-between ${
                      item.isActive ? 'text-white font-semibold' : 'text-gray-300'
                    } hover:text-white`}
                  >
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={item.icon} className="w-5 mr-3" />
                      {item.label}
                    </div>
                    <FontAwesomeIcon 
                      icon={isChatOpen ? faChevronUp : faChevronDown} 
                      className="w-3"
                    />
                  </button>
                  {isChatOpen && (
                    <div className="ml-8 mt-2 space-y-2">
                      {channels.map((channel) => (
                        <Link
                          key={channel.id}
                          href={`/platform/${titleHref.split('/').pop()}/chat/${channel.id}`}
                          className="block text-sm text-gray-400 hover:text-white"
                        >
                          # {channel.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            
            // 프로젝트 레이아웃에서 설정 메뉴에 알림 표시 추가
            if (item.label === "설정" && (hasParticipationRequests || item.hasNotification)) {
              const notificationCount = project?.participationRequestMembers?.length || '';
              
              return (
                <Link 
                  key={index} 
                  href={item.href} 
                  className={`flex items-center pl-6 pr-6 border-l-3 ${
                    item.isActive ? 'text-white border-purple-500' : 'text-gray-300 border-transparent'
                  } hover:text-white relative`}
                >
                  <FontAwesomeIcon icon={item.icon} className="w-5 mr-3" />
                  {item.label}
                  <span className="absolute right-4 flex h-5 w-5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-100"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center">
                      {notificationCount}
                    </span>
                  </span>
                </Link>
              );
            }
            
            return (
              <Link 
                key={index} 
                href={item.href} 
                className={`flex items-center pl-6 pr-6 border-l-3 ${
                  item.isActive ? 'text-white border-purple-500' : 'text-gray-300 border-transparent'
                } hover:text-white`}
              >
                <FontAwesomeIcon icon={item.icon} className="w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}