import { OpenSidebarAlt, CloseSidebarAlt } from "flowbite-react-icons/outline";
import UserDropdown from "@/components/platform/UserDropdown";
import { Home, Pencil, Search as SearchIcon } from "lucide-react";
import Badge from "@/components/ui/Badge";
import SlideingMenu, { IconProps } from "@/components/ui/SlideingMenu";
import { useState } from "react";
import Search from "@/components/ui/Search";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  children: React.ReactNode;
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

export default function Header({ isSidebarOpen, setIsSidebarOpen, children }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
              {isSidebarOpen ? <CloseSidebarAlt /> : <OpenSidebarAlt />}
            </button>

            <div className="h-6 w-px bg-component-border mx-2"></div>

            <div className="w-full">
              <SlideingMenu icons={icons} isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
            </div>
          </div>

          {isSearchOpen && (
            <div className="flex-1">
              <Search placeholder="검색어를 입력하세요" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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
            />
            <UserDropdown />
          </div>
        </div>
      </header>
      <main className="p-4">
        {children}
      </main>
    </div>
  );
}