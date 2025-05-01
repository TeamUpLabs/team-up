import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/auth/authStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBell,
  faRightFromBracket,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useTheme } from "@/contexts/ThemeContext";
import { logout } from "@/auth/authApi";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  const { isDark, toggleDarkMode } = useTheme();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-9 w-9 rounded-full bg-component-tertiary-background text-text-primary transition-colors duration-200 focus:outline-none"
        aria-label="User menu"
      >
        {user ? user.name.charAt(0) : "?"}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md bg-component-tertiary-background shadow-md z-50 border border-component-border">
          <div className="px-4 py-2 border-b border-component-secondary-border">
            <p className="text-sm font-medium text-text-primary">{user ? user.name : "로그인을 해주세요."}</p>
            {user?.email && <p className="text-xs text-text-secondary">{user.email}</p>}
          </div>

          <div>
            <MenuItem
              icon={faUser}
              text="내 프로필"
              onClick={() => { setIsOpen(false); window.location.href = "/platform/profile"; }}
              className="text-text-secondary"
            />
            <MenuItem
              icon={faBell}
              text="알림"
              onClick={() => { setIsOpen(false); window.location.href = "/platform/notifications"; }}
              className="text-text-secondary"
            />

            <div className="border-t border-component-secondary-border"></div>

            <MenuItem
              icon={isDark ? faSun : faMoon}
              text={isDark ? "라이트 모드" : "다크 모드"}
              onClick={() => {
                toggleDarkMode();
                setIsOpen(false);
              }}
              className="text-text-secondary"
            />

            <div className="border-t border-component-secondary-border"></div>

            <MenuItem
              icon={faRightFromBracket}
              text="로그아웃"
              onClick={logout}
              className="text-red-400"
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface MenuItemProps {
  icon: IconDefinition;
  text: string;
  onClick: () => void;
  className?: string;
}

function MenuItem({ icon, text, onClick, className = "" }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 flex items-center gap-2 text-sm hover:bg-component-secondary-background ${className}`}
    >
      <FontAwesomeIcon icon={icon} className="w-4 h-4" />
      {text}
    </button>
  );
}