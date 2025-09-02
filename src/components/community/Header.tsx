import { OpenSidebarAlt, CloseSidebarAlt } from "flowbite-react-icons/outline";
import UserDropdown from "@/components/platform/UserDropdown";
import Link from "next/link";
import { Home } from "lucide-react";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  children: React.ReactNode;
}

export default function Header({ isSidebarOpen, setIsSidebarOpen, children }: HeaderProps) {
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
            <Link 
              href="/" 
              className="p-2 rounded-md text-text-secondary hover:bg-component-tertiary-background hover:text-text-primary"
              aria-label="Go to home"
            >
              <Home className="w-5 h-5" />
            </Link>
          </div>
          <UserDropdown />
        </div>
      </header>
      <main className="p-4">
        {children}
      </main>
    </div>
  );
}