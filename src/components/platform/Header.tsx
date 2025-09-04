import { useState, useRef, useEffect } from "react";
import SlideingMenu, { IconProps } from "@/components/ui/SlideingMenu";
import Search from "@/components/ui/Search";
import UserDropdown from "@/components/platform/UserDropdown";
import NotificationDropdown from "@/components/platform/NotificationDropdown";
import { OpenSidebarAlt, CloseSidebarAlt } from "flowbite-react-icons/outline";
import { Home, Search as SearchIcon } from "lucide-react";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isNotificationSidebarOpen: boolean;
  setIsNotificationSidebarOpen: (open: boolean) => void;
  children: React.ReactNode;
}

export default function Header({ isSidebarOpen, setIsSidebarOpen, isNotificationSidebarOpen, setIsNotificationSidebarOpen, children }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not in an input field and '/' is pressed
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
        // Use setTimeout to ensure the input is rendered before focusing
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
      // Close search on Escape key
      if (e.key === 'Escape' && isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  const icons: IconProps[] = [
    {
      icon: <Home className="w-5 h-5" />,
      label: "Home",
      href: "/",
    },
    {
      icon: <SearchIcon className="w-5 h-5" />,
      label: "Search",
    },
  ]

  return (
    <div className="w-full">
      <header className="sticky top-0 z-10 bg-component-background min-h-10 border-b border-component-border">
        <div className="px-3 py-2 flex items-center gap-3 w-full justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-text-secondary hover:bg-component-tertiary-background hover:text-text-primary cursor-pointer"
            >
              {isSidebarOpen ? (
                <OpenSidebarAlt />
              ) : (
                <CloseSidebarAlt />
              )}
            </button>

            <div className="h-6 w-px bg-component-border mx-2"></div>

            <div className="w-full">
              <SlideingMenu icons={icons} isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
            </div>


          </div>
          {isSearchOpen && (
            <div className="flex-1">
              <Search
                placeholder="Search projects, tasks, or team members..."
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                inputRef={inputRef}
              />
            </div>
          )}
          <div className="flex flex-shrink-0 items-center gap-3">
            <NotificationDropdown
              onToggleSidebar={() => setIsNotificationSidebarOpen(!isNotificationSidebarOpen)}
            />
            <UserDropdown />
          </div>
        </div>
      </header>
      <main className="p-4">
        {children}
      </main>
    </div>
  )
}