import Link from "next/link";
import { useState } from "react";
import React from "react";
import { ChevronDown } from "flowbite-react-icons/outline";
import { useProject } from "@/contexts/ProjectContext";
import CreateChannelButton from "@/components/project/chat/ChannelCreateBtn";
import { useAuthStore } from "@/auth/authStore";
import { ParticipationRequest } from "@/types/ParticipationRequest";

interface NavItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  activeIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  category?: string;
  label: string;
  href: string;
  isActive?: boolean;
  hasIndicator?: boolean;
  IndicatorColor?: string;
}

interface SidebarProps {
  isSidebarOpen: boolean;
  title?: string | React.ReactNode;
  titleHref: string;
  navItems: NavItem[];
}

export default function SideBar({
  isSidebarOpen,
  title,
  titleHref,
  navItems,
}: SidebarProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { project } = useProject();
  const user = useAuthStore((state) => state.user);

  return (
    <div
      className={`fixed h-full border-r border-component-border
        bg-sidebar-background transition-all duration-300 overflow-hidden
        ${isSidebarOpen ? 'w-64' : 'w-0'}`}
    >
      <div className="w-64 h-full flex flex-col transition-opacity duration-300">
        <div className="flex-1 text-center p-6 border-b border-component-border">
          {project || title ? (
            <>
              <span className="text-lg font-bold">{project?.title || title}</span>
              <span className="text-xs text-text-secondary line-clamp-1">{project?.description || ""}</span>
            </>
          ) : (
            <div className="space-y-1">
              <div className="h-6 bg-component-tertiary-background rounded w-16"></div>
              <div className="h-6 bg-component-tertiary-background rounded w-32"></div>
            </div>
          )}
        </div>
        <nav className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4 px-2">
            {(() => {
              const otherItems = navItems.filter(item => item.label !== '나가기');

              const groupedItems = otherItems.reduce<Record<string, NavItem[]>>((acc, item) => {
                const category = item.category || 'Other';
                if (!acc[category]) {
                  acc[category] = [];
                }
                acc[category].push(item);
                return acc;
              }, {});

              // Sort categories to put 'Other' at the end (but before exit item)
              const sortedCategories = Object.entries(groupedItems).sort(([categoryA], [categoryB]) => {
                if (categoryA === 'Other') return 1;
                if (categoryB === 'Other') return -1;
                return 0;
              });

              // Render sorted categories
              return sortedCategories.map(([category, items]) => (
                <div key={category} className="mb-6">
                  <h3 className="px-4 mb-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    {category}
                  </h3>
                  <ul className="space-y-1">
                    {items.map((item) => {
                      const notificationCount = item.label === '설정' ? project?.participation_requests.filter((request: ParticipationRequest) => request.status === "pending").length || 0 : 0;

                      return (
                        <li key={item.href}>
                          {item.label === '채팅' ? (
                            <>
                              <button
                                onClick={() => setIsChatOpen(!isChatOpen)}
                                className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-md transition-colors ${item.isActive
                                  ? 'bg-component-active-background text-component-active-foreground font-medium'
                                  : 'text-text-secondary hover:bg-component-hover-background hover:text-text-primary cursor-pointer'
                                  }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span>
                                    {item.isActive
                                      ? React.createElement(item.activeIcon, { className: 'w-5 h-5' })
                                      : React.createElement(item.icon, { className: 'w-5 h-5' })}
                                  </span>
                                  <span>{item.label}</span>
                                </div>
                                <ChevronDown className={`transition-all duration-200 ${isChatOpen ? 'rotate-180' : ''}`} />
                              </button>
                              {isChatOpen && (
                                <div className="mt-2">
                                  <CreateChannelButton />
                                  <div className="mt-2 ml-8 space-y-1">
                                    {project?.channels
                                      ?.filter((channel) => channel.members.map((member) => member.id).includes(user?.id || 0))
                                      .map((channel) => (
                                        <Link
                                          key={channel.channel_id}
                                          href={`/project/${titleHref.split('/').pop()}/chat?project_id=${project.id}&channel=${channel.channel_id}`}
                                          className="block text-sm text-text-secondary hover:text-text-primary px-2 py-1 rounded hover:bg-component-hover-background"
                                        >
                                          # {channel.name}
                                        </Link>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <Link
                              href={item.href}
                              className={`flex items-center justify-between px-4 py-2 text-sm rounded-md transition-colors ${item.isActive
                                ? 'bg-component-active-background text-component-active-foreground font-medium'
                                : 'text-text-secondary hover:bg-component-hover-background hover:text-text-primary'
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <span>
                                  {item.isActive
                                    ? React.createElement(item.activeIcon, { className: 'w-5 h-5' })
                                    : React.createElement(item.icon, { className: 'w-5 h-5' })}
                                </span>
                                <span>{item.label}</span>
                              </div>

                              {notificationCount > 0 && item.label === '설정' && (
                                <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center">
                                  {notificationCount}
                                </span>
                              )}
                              {item.hasIndicator && (
                                <span className={`relative inline-flex rounded-full h-2 w-2 bg-${item.IndicatorColor}-500 text-white text-xs flex items-center justify-center`}></span>
                              )}
                            </Link>
                          )}
                        </li>
                      )
                    }
                    )}
                  </ul>
                </div>
              ));
            })()}
          </div>

          {/* Exit item at the bottom */}
          {navItems.some(item => item.label === '나가기') && (
            <div className="mt-auto border-t border-component-border">
              {(() => {
                const exitItem = navItems.find(item => item.label === '나가기');
                if (!exitItem) return null;

                return (
                  <Link
                    href={exitItem.href}
                    className={`flex items-center px-4 py-4 text-sm rounded-md transition-colors ${exitItem.isActive
                      ? 'bg-component-active-background text-component-active-foreground font-medium'
                      : 'text-text-secondary hover:bg-component-hover-background hover:text-text-primary'
                      }`}
                  >
                    <span className="mr-3">
                      {exitItem.isActive ?
                        React.createElement(exitItem.activeIcon, { className: 'w-5 h-5' }) :
                        React.createElement(exitItem.icon, { className: 'w-5 h-5' })}
                    </span>
                    <span>{exitItem.label}</span>
                  </Link>
                );
              })()}
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
