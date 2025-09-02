import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export interface IconProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
}

interface SlideingMenuProps {
  icons: IconProps[];
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}


export default function SlideingMenu({ icons, isSearchOpen, setIsSearchOpen }: SlideingMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
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
            onClick={() => value.label === "Search" && setIsSearchOpen(!isSearchOpen)}
          >
            {value.icon}
          </Link>
        ))}
      </div>
    </div>
  )
}