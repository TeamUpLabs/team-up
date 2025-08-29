import WelcomeBanner from "@/components/community/Sidebar/WelcomeBanner";
import Topics from "@/components/community/Sidebar/Topics";

interface SideBarProps {
  isSidebarOpen: boolean;
}

export default function SideBar({ isSidebarOpen }: SideBarProps) {
  return (
    <div
      className={`fixed h-full border-r border-component-border
            bg-sidebar-background transition-all duration-300 z-[20] overflow-hidden
            ${isSidebarOpen ? 'w-0 translate-x-0' : 'w-80 -translate-x-0'}`}
    >
      <div className="w-80 h-full flex flex-col transition-opacity duration-300">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <WelcomeBanner />
          <Topics />
        </div>
      </div>
    </div>
  );
}