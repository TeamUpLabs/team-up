import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface NavItem {
  icon: IconDefinition;
  label: string;
  href: string;
}

interface SidebarProps {
  isSidebarOpen: boolean;
  title: string;
  titleHref: string;
  navItems: NavItem[];
}

export default function Sidebar({ isSidebarOpen, title, titleHref, navItems }: SidebarProps) {
  return (
    <div className={`w-64 fixed h-full border-r border-gray-800 bg-(--color-background) z-30 transition-transform duration-300 lg:translate-x-0 ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="p-6">
        <Link href={titleHref}>
          <h1 className="text-xl font-bold text-white mb-8">{title}</h1>
        </Link>
        <nav className="space-y-4">
          {navItems.map((item, index) => (
            <Link key={index} href={item.href} className="flex items-center text-gray-300 hover:text-white">
              <FontAwesomeIcon icon={item.icon} className="w-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}