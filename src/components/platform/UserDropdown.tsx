"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/auth/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Moon, Sun, LogOut } from "lucide-react";
import { logout } from "@/auth/authApi";
import { convertRoleName } from "@/utils/ConvertRoleName";
import { useTheme } from "@/contexts/ThemeContext";

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
    <div className="relative z-[9000] flex" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="font-semibold text-sm cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 relative rounded-full flex items-center justify-center bg-component-tertiary-background border border-component-secondary-border text-text-primary">
            {user?.profile_image ? (
              <Image src={user.profile_image} alt="Profile" className="object-fit rounded-full" quality={100} width={32} height={32} />
            ) : (
              <p>{user?.name.charAt(0) || "??"}</p>
            )}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-10 w-56 rounded-md shadow-md bg-component-background z-[9999] border border-component-border overflow-visible"
          >
            <div>
              <MenuItem
                text={
                  <div className="flex flex-col">
                    <span className="font-semibold">{user?.name}</span>
                    <span className="text-text-secondary">{convertRoleName(user?.role || "")}</span>
                  </div>
                }
                isHover={false}
              />

              <div className="border-t border-component-border"></div>

              <MenuItem
                icon={<Settings className="w-4 h-4" />}
                text="설정"
                onClick={() => { setIsOpen(false); window.location.href = "/platform/profile"; }}
                className="text-text-primary"
                isHover
              />

              <MenuItem
                icon={isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                text={isDark ? "라이트 모드" : "다크 모드"}
                onClick={() => {
                  toggleDarkMode();
                }}
                className="text-text-primary"
                isHover
              />

              <div className="border-t border-component-border"></div>

              <MenuItem
                icon={<LogOut className="w-4 h-4" />}
                text="로그아웃"
                onClick={logout}
                className="text-red-400 rounded-b-md"
                isHover
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MenuItemProps {
  icon?: React.ReactNode;
  text: string | React.ReactNode;
  onClick?: () => void;
  className?: string;
  isHover?: boolean;
}

function MenuItem({ icon, text, onClick, className = "", isHover = false }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 flex items-center gap-2 text-sm ${isHover ? "hover:bg-component-tertiary-background cursor-pointer" : ""} ${className}`}
    >
      {icon}
      {text}
    </button>
  );
}