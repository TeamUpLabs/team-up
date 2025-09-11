import WelcomeBanner from "@/components/community/Sidebar/WelcomeBanner";
import Topics from "@/components/community/Sidebar/Topics";
import RecommendFollow from "@/components/community/Sidebar/RecommendFollow";
import RecentActivities from "@/components/community/Sidebar/RecentActivities";

interface SideBarProps {
  isSidebarOpen: boolean;
  onTopicClick?: (topic: string) => void;
  onOpenSearch?: () => void;
}

export default function SideBar({ isSidebarOpen, onTopicClick, onOpenSearch }: SideBarProps) {
  return (
    <div
      className={`fixed h-full border-r border-component-border
            bg-sidebar-background transition-all duration-300 overflow-hidden
            ${isSidebarOpen ? 'w-0 translate-x-0' : 'w-80 -translate-x-0'}`}
    >
      <div className="w-80 h-full flex flex-col transition-opacity duration-300">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <WelcomeBanner />
          <Topics onTopicClick={onTopicClick} onOpenSearch={onOpenSearch} />
          <RecommendFollow />
          <RecentActivities />
        </div>
      </div>
    </div>
  );
}