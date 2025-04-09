import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import React from "react";

interface NavItem {
  icon: IconDefinition;
  label: string;
  href: string;
  isActive?: boolean;
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
  
  // 임시 채널 데이터
  const channels: Channel[] = [
    { id: 'general', name: '일반' },
    { id: 'announcement', name: '공지사항' },
    { id: 'free-chat', name: '자유채팅' },
  ];

  return (
    <div className={`w-64 fixed h-full border-r border-gray-800 bg-(--color-background) z-30 transition-transform duration-300 lg:translate-x-0 ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="p-6">
        <Link href={titleHref}>
          <h1 className="text-xl font-bold text-white mb-8">{title}</h1>
        </Link>
        <nav className="space-y-4">
          {navItems.map((item, index) => {
            if (item.label === "채팅") {
              return (
                <div key={index}>
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
            return (
              <Link 
                key={index} 
                href={item.href} 
                className={`flex items-center ${
                  item.isActive ? 'text-white font-semibold' : 'text-gray-300'
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