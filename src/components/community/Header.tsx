import { OpenSidebarAlt, CloseSidebarAlt } from "flowbite-react-icons/outline";
import UserDropdown from "@/components/platform/UserDropdown";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  children: React.ReactNode;
}

export default function Header({ isSidebarOpen, setIsSidebarOpen, children }: HeaderProps) {
  return (
    <div className={`w-full flex-1 transition-all duration-300 ${isSidebarOpen ? "lg:ml-0" : "lg:ml-64"}`}>
      <header className={`h-auto bg-component-background min-h-16 border-b border-component-border fixed top-0 right-0 left-0 content-center transition-all duration-300 ${isSidebarOpen ? "lg:left-0" : "lg:left-64"}`}>
        <div className="px-3 py-2 sm:px-4 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-text-secondary hover:bg-component-tertiary-background hover:text-text-primary cursor-pointer">
              {isSidebarOpen ? <OpenSidebarAlt /> : <CloseSidebarAlt />}
            </button>
            <div className="h-6 w-px bg-component-border mx-2"></div>
          </div>

          <UserDropdown />
        </div>
      </header>
      <main className="pt-20 px-4">
        {children}
      </main>
    </div>
  );
}