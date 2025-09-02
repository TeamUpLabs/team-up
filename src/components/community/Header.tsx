import { OpenSidebarAlt, CloseSidebarAlt } from "flowbite-react-icons/outline";
import UserDropdown from "@/components/platform/UserDropdown";
import { Home, Pencil, Menu, Search } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { useState } from "react";
import Link from "next/link";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  children: React.ReactNode;
}

interface IconProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
}

const icons: IconProps[] = [
  {
    icon: <Home className="w-5 h-5" />,
    label: "Home",
    href: "/",
  },
  {
    icon: <Search className="w-5 h-5" />,
    label: "Search",
  },
]

export default function Header({ isSidebarOpen, setIsSidebarOpen, children }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full">
      <header className="sticky top-0 z-10 bg-component-background min-h-10 border-b border-component-border">
        <div className="px-3 py-2 sm:px-4 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-text-secondary hover:bg-component-tertiary-background hover:text-text-primary cursor-pointer"
              aria-label={isSidebarOpen ? "Open sidebar" : "Close sidebar"}
            >
              {isSidebarOpen ? <CloseSidebarAlt /> : <OpenSidebarAlt />}
            </button>

            <div className="h-6 w-px bg-component-border mx-2"></div>

            <div className="flex gap-2">
              <button
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
                className={`p-2 rounded-md text-text-secondary hover:bg-component-tertiary-background hover:text-text-primary cursor-pointer`}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div 
                className={`flex items-center gap-2 transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-w-[200px]' : 'max-w-0'}`}
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                {icons.map((value) => (
                  <Link
                    key={value.label}
                    href={value.href || ""}
                    className="p-2 rounded-md text-text-secondary hover:bg-component-tertiary-background hover:text-text-primary cursor-pointer"
                    aria-label={value.label}
                  >
                    {value.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

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