import { OpenSidebarAlt, CloseSidebarAlt } from "flowbite-react-icons/outline";
import UserDropdown from "@/components/platform/UserDropdown";
import { Home, Pencil, Search as SearchIcon } from "lucide-react";
import Badge from "@/components/ui/Badge";
import SlideingMenu, { IconProps } from "@/components/ui/SlideingMenu";
import { useState, useRef, useEffect, useCallback, ReactNode } from "react";
import Search from "@/components/ui/Search";
import NewPostCreateModal from "@/components/community/NewPostCreateModal";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  children: ReactNode;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  isSearchOpen?: boolean;
  onSearchOpenChange?: (isOpen: boolean) => void;
}

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

export default function Header({ 
  isSidebarOpen, 
  setIsSidebarOpen, 
  children, 
  searchQuery = '', 
  onSearchQueryChange = () => {},
  isSearchOpen: propIsSearchOpen = false,
  onSearchOpenChange: setPropIsSearchOpen = () => {}
}: HeaderProps) {
  const [localIsSearchOpen, setLocalIsSearchOpen] = useState(propIsSearchOpen);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with prop
  useEffect(() => {
    setLocalIsSearchOpen(propIsSearchOpen);
  }, [propIsSearchOpen]);

  // Sync search query with prop
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (query: string) => {
    setLocalSearchQuery(query);
    onSearchQueryChange(query);
  };

  const handleSearchOpenChange = useCallback((isOpen: boolean) => {
    setLocalIsSearchOpen(isOpen);
    setPropIsSearchOpen(isOpen);
  }, [setPropIsSearchOpen]);

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not in an input field and '/' is pressed
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleSearchOpenChange(true);
        // Use setTimeout to ensure the input is rendered before focusing
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
      // Close search on Escape key
      if (e.key === 'Escape' && localIsSearchOpen) {
        e.preventDefault();
        handleSearchOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [localIsSearchOpen, handleSearchOpenChange]);

  return (
    <div className="w-full">
      <header className="sticky top-0 z-10 bg-component-background min-h-10 border-b border-component-border">
        <div className="px-3 py-2 flex items-center gap-3 w-full justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-text-secondary hover:bg-component-tertiary-background hover:text-text-primary cursor-pointer"
              aria-label={isSidebarOpen ? "Open sidebar" : "Close sidebar"}
            >
              {isSidebarOpen ? <OpenSidebarAlt /> : <CloseSidebarAlt />}
            </button>

            <div className="h-6 w-px bg-component-border mx-2"></div>

            <div className="w-full">
              <SlideingMenu 
                icons={icons} 
                isSearchOpen={localIsSearchOpen} 
                setIsSearchOpen={handleSearchOpenChange} 
              />
            </div>
          </div>

          {localIsSearchOpen && (
            <div className="flex-1">
              <Search 
                placeholder="내용, 태그, 작성자를 검색하세요." 
                searchQuery={localSearchQuery} 
                setSearchQuery={handleSearchChange} 
                inputRef={inputRef} 
                autoFocus
              />
            </div>
          )}

          <div className="flex items-center gap-4">
            <Badge
              content={
                <span className="flex items-center gap-2 font-semibold">
                  <Pencil className="w-4 h-4" />
                  새 글 작성
                </span>
              }
              color="white"
              className="!px-3 !py-1 !flex active:scale-95 cursor-pointer"
              isHover
              onClick={() => setIsModalOpen(true)}
            />
            <UserDropdown />
          </div>
        </div>
        <NewPostCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </header>
      <main className="p-4">
        {children}
      </main>
    </div>
  );
}