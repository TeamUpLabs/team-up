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

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);
  const logout = () => {
    useAuthStore.getState().logout();
    window.location.href = '/';
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
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer select-none"
      >
        {user ? user.name.charAt(0) : "?"}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-gray-200 rounded-lg shadow-lg z-30 border border-gray-700">
          <button
            onClick={() => { setIsOpen(false); window.location.href = "/platform/profile"; }}
            className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2 rounded-t-lg"
          >
            <FontAwesomeIcon icon={faUser} />
            내 프로필
          </button>

          <button
            onClick={() => { setIsOpen(false); window.location.href = "/platform/notifications"; }}
            className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faBell} />
            알림
          </button>

          <div className="border-t border-gray-700 my-1" />

          <button
            onClick={() => { setIsOpen(false); window.location.href = "/platform/settings"; }}
            className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faGear} />
            설정
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              // 여기에 다크모드 토글 핸들러 연결
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faMoon} />
            다크모드
          </button>

          <div className="border-t border-gray-700 my-1" />

          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white flex items-center gap-2 rounded-b-lg"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}