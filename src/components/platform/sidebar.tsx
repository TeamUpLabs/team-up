import Link from "next/link";
import { useState, useEffect } from "react";
import React from "react";
import { ChevronDown, ChevronUp, ArrowRightToBracket } from 'flowbite-react-icons/outline';
import { useProject } from "@/contexts/ProjectContext";
import CreateChannelButton from "@/components/ui/ChannelCreateBtn";

interface NavItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  activeIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
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
  miniTitle?: string | React.ReactNode;
  titleHref: string;
  navItems: NavItem[];
  onMinimizeChange?: (isMinimized: boolean) => void;
}

export default function Sidebar({ isSidebarOpen, title, miniTitle, titleHref, navItems, onMinimizeChange }: SidebarProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { project } = useProject();

  useEffect(() => {
    if (onMinimizeChange) {
      onMinimizeChange(isMinimized);
    }
  }, [isMinimized, onMinimizeChange]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isMinimized) {
      timer = setTimeout(() => {
        setShowLabels(true);
      }, 150); // Delay showing labels until sidebar has expanded a bit
    } else {
      setShowLabels(false);
    }
    return () => clearTimeout(timer);
  }, [isMinimized]);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px is the lg breakpoint in Tailwind
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 임시 채널 데이터
  const channels: Channel[] = [
    { id: 'general', name: '일반' },
    { id: 'announcement', name: '공지사항' },
    { id: 'free-chat', name: '자유채팅' },
  ];

  // 참여 요청이 있는지 확인 (프로젝트 컨텍스트가 있는 경우)
  const hasParticipationRequests = project?.participationRequestMembers && project.participationRequestMembers.length > 0;

  // 나가기 항목과 다른 항목 분리
  const exitItem = navItems.find(item => item.label === "나가기");
  const regularItems = navItems.filter(item => item.label !== "나가기");

  return (
    <div
      className={`fixed h-full border-r border-component-border z-[8500] bg-component-background transition-all duration-300 lg:translate-x-0 ${isMobile ? 'w-64' : (isMinimized ? 'w-16' : 'w-64')
        } ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      onMouseEnter={() => !isMobile && setIsMinimized(false)}
      onMouseLeave={() => !isMobile && setIsMinimized(true)}
    >
      <div className="flex flex-col h-full">
        <div>
          <div className="flex items-center justify-center py-5 px-6 transition-all duration-300">
            {!title ? (
              <div className="h-8 bg-component-tertiary-background rounded w-16"></div>
            ) : (!isMinimized || isMobile) ? (
              <Link href={titleHref} className={`block transition-opacity duration-200 ${(showLabels || isMobile) ? 'opacity-100' : 'opacity-0'}`}>
                <h1 className="text-xl font-bold text-text-primary text-center whitespace-nowrap">{title}</h1>
              </Link>
            ) : (
              <Link href={titleHref} className="block">
                <h1 className="text-xl font-bold text-text-primary text-center">{miniTitle}</h1>
              </Link>
            )}
          </div>
          <nav className="space-y-2">
            {regularItems.map((item, index) => {
              if (item.label === "채팅") {
                const IconComponent = item.icon;
                const ActiveIconComponent = item.activeIcon;
                return (
                  <div key={index} className="mx-2">
                    <button
                      onClick={() => setIsChatOpen(!isChatOpen)}
                      className={`flex items-center px-4 py-2 rounded-lg w-full transition-all duration-300 ${item.isActive ? 'text-point-color-indigo bg-point-color-indigo/10' : 'text-text-secondary'
                        } hover:bg-point-color-indigo/10 hover:text-point-color-indigo ${(isMinimized && !isMobile) ? 'justify-center' : 'justify-between'
                        }`}
                    >
                      <div className="flex items-center">
                        {item.isActive ?
                          <ActiveIconComponent className={`${(isMinimized && !isMobile) ? '' : 'mr-3'}`} /> :
                          <IconComponent className={`${(isMinimized && !isMobile) ? '' : 'mr-3'}`} />}
                        {(!isMinimized || isMobile) && (
                          <span className={`transition-opacity duration-200 whitespace-nowrap ${(showLabels || isMobile) ? 'opacity-100' : 'opacity-0'}`}>
                            {item.label}
                          </span>
                        )}
                      </div>
                      {(!isMinimized || isMobile) && (
                        isChatOpen ?
                          <ChevronUp className={`transition-opacity duration-200 ${(showLabels || isMobile) ? 'opacity-100' : 'opacity-0'}`} /> :
                          <ChevronDown className={`transition-opacity duration-200 ${(showLabels || isMobile) ? 'opacity-100' : 'opacity-0'}`} />
                      )}
                    </button>
                    {isChatOpen && (!isMinimized || isMobile) && (showLabels || isMobile) && (
                      <div className="mt-2">
                        <CreateChannelButton />
                        <div className="ml-8 mt-2 space-y-2 transition-opacity duration-200">
                          {channels.map((channel) => (
                            <Link
                              key={channel.id}
                              href={`/platform/${titleHref.split('/').pop()}/chat?channel=${channel.id}`}
                            className="block text-sm text-text-secondary hover:text-text-primary whitespace-nowrap"
                          >
                            # {channel.name}
                          </Link>
                        ))}
                      </div>
                      </div>
                    )}
                  </div>
                );
              }

              // 프로젝트 레이아웃에서 설정 메뉴에 알림 표시 추가
              if (item.label === "설정" && (hasParticipationRequests || item.hasNotification)) {
                const IconComponent = item.icon;
                const ActiveIconComponent = item.activeIcon;
                const notificationCount = project?.participationRequestMembers?.length || '';

                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={`flex items-center mx-2 rounded-lg transition-all duration-300 ${item.isActive ? 'text-point-color-indigo bg-point-color-indigo/10' : 'text-text-secondary'
                      } hover:bg-point-color-indigo/10 hover:text-point-color-indigo ${(isMinimized && !isMobile) ? 'justify-center py-2' : 'px-4 py-2'
                      }`}
                    title={(isMinimized && !isMobile) ? item.label : ''}
                  >
                    {item.isActive ?
                      <ActiveIconComponent className={`${(isMinimized && !isMobile) ? '' : 'mr-3'}`} /> :
                      <IconComponent className={`${(isMinimized && !isMobile) ? '' : 'mr-3'}`} />}
                    {(!isMinimized || isMobile) && (
                      <span className={`transition-opacity duration-200 whitespace-nowrap ${(showLabels || isMobile) ? 'opacity-100' : 'opacity-0'}`}>
                        {item.label}
                      </span>
                    )}
                    <span className={`${(isMinimized && !isMobile) ? 'absolute right-2 -translate-y-1/2' : 'absolute right-4'} flex h-5 w-5`}>
                      <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-100"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center">
                        {notificationCount}
                      </span>
                    </span>
                  </Link>
                );
              }

              const IconComponent = item.icon;
              const ActiveIconComponent = item.activeIcon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center mx-2 rounded-lg transition-all duration-300 ${item.isActive ? 'text-point-color-indigo bg-point-color-indigo/10' : 'text-text-secondary'
                    } hover:bg-point-color-indigo/10 hover:text-point-color-indigo ${(isMinimized && !isMobile) ? 'justify-center py-2' : 'px-4 py-2'
                    }`}
                  title={(isMinimized && !isMobile) ? item.label : ''}
                >
                  {item.isActive ?
                    <ActiveIconComponent className={`${(isMinimized && !isMobile) ? '' : 'mr-3'}`} /> :
                    <IconComponent className={`${(isMinimized && !isMobile) ? '' : 'mr-3'}`} />}
                  {(!isMinimized || isMobile) && (
                    <span className={`transition-opacity duration-200 whitespace-nowrap ${(showLabels || isMobile) ? 'opacity-100' : 'opacity-0'}`}>
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 나가기 버튼을 맨 아래 배치 */}
        <div className="mt-auto mb-4">
          {exitItem && (
            <Link
              key="exit"
              href={exitItem.href}
              className={`flex items-center mx-2 rounded-lg transition-all duration-300 text-text-secondary hover:bg-red-500/10 hover:text-red-500 ${(isMinimized && !isMobile) ? 'justify-center py-2' : 'px-4 py-2'
                }`}
              title={(isMinimized && !isMobile) ? exitItem.label : ''}
            >
              <ArrowRightToBracket className={`${(isMinimized && !isMobile) ? '' : 'mr-3'}`} />
              {(!isMinimized || isMobile) && (
                <span className={`transition-opacity duration-200 whitespace-nowrap ${(showLabels || isMobile) ? 'opacity-100' : 'opacity-0'}`}>
                  {exitItem.label}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}