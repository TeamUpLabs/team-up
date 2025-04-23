import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/auth/authStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBell,
  faGear,
  faRightFromBracket,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  const logout = async () => {
    try { 
      await useAuthStore.getState().logout();
      useAuthStore.getState().setAlert("로그아웃 되었습니다.", "info");
      window.location.href = '/';
    } catch (error) {
      console.error("Error logging out:", error);
      useAuthStore.getState().setAlert("로그아웃 중 오류가 발생했습니다.", "error");
    }
  };

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
        className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none"
        aria-label="User menu"
      >
        {user ? user.name.charAt(0) : "?"}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md bg-white dark:bg-gray-800 shadow-md z-50 border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user ? user.name : "로그인"}</p>
            {user?.email && <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>}
          </div>
          
          <div className="py-1">
            <MenuItem 
              icon={faUser}
              text="내 프로필"
              onClick={() => { setIsOpen(false); window.location.href = "/platform/profile"; }}
            />
            <MenuItem 
              icon={faBell}
              text="알림"
              onClick={() => { setIsOpen(false); window.location.href = "/platform/notifications"; }}
            />
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700"></div>
          
          <div className="py-1">
            <MenuItem 
              icon={faGear}
              text="설정"
              onClick={() => { setIsOpen(false); window.location.href = "/platform/settings"; }}
            />
            <MenuItem 
              icon={faMoon}
              text="다크모드"
              onClick={() => {
                setIsOpen(false);
                // 여기에 다크모드 토글 핸들러 연결
              }}
            />
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700"></div>
          
          <div className="py-1">
            <MenuItem 
              icon={faRightFromBracket}
              text="로그아웃"
              onClick={logout}
              className="text-red-600 dark:text-red-400"
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
      className={`w-full text-left px-4 py-2 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${className}`}
    >
      <FontAwesomeIcon icon={icon} className="w-4 h-4" />
      {text}
    </button>
  );
}