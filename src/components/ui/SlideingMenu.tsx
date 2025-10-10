import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Tooltip from "./Tooltip";

export interface IconProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
}

interface SlideingMenuProps {
  icons: IconProps[];
  isSearchOpen?: boolean;
  setIsSearchOpen?: (open: boolean) => void;
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
        className={`flex items-center gap-2 transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-w-[300px]' : 'max-w-0'}`}
        onMouseEnter={() => setIsMenuOpen(true)}
        onMouseLeave={() => setIsMenuOpen(false)}
      >
        {icons.map((value) => (
          <Tooltip key={value.label} content={value.label} placement="bottom" className="p-2 hover:bg-component-tertiary-background rounded-md text-text-secondary hover:text-text-primary cursor-pointer">
            <Link
              href={value.href || ""}
              aria-label={value.label}
              onClick={() => value.label === "Search" && setIsSearchOpen?.(!isSearchOpen)}
            >
              {value.icon}
            </Link>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}