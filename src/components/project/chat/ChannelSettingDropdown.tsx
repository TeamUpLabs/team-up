import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import {
  FilePen,
  Star,
  Users,
  Thumbtack,
  Bell,
  BellRing,
} from "flowbite-react-icons/outline";
import { Channel } from "@/types/Channel";
import { useAuthStore } from "@/auth/authStore";
import ChannelEditModal from "@/components/project/chat/ChannelEditModal";
import ChannelMemberEditModal from "@/components/project/chat/ChannelMemberEditModal";

interface ChannelSettingsDropdownProps {
  channel: Channel;
  isOwner: boolean;
}

export default function ChannelSettingsDropdown({
  channel,
  isOwner,
}: ChannelSettingsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isStarred, setIsStarred] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMemnerEditModalOpen, setIsMemnerEditModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleStar = () => {
    setIsStarred(!isStarred);
    // 실제 구현에서는 서버에 상태 저장
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
    // 실제 구현에서는 서버에 상태 저장
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // 실제 구현에서는 서버에 상태 저장
  };

  const handleEditModalOpen = () => {
    if (isOwner) {
      setIsEditModalOpen(true);
    } else {
      useAuthStore
        .getState()
        .setAlert("채널 정보 수정은 채널 개설자만 가능합니다.", "error");
    }
  };

  const handleMemberEditModalOpen = () => {
    if (isOwner) {
      setIsMemnerEditModalOpen(true);
    } else {
      useAuthStore
        .getState()
        .setAlert("채널 구성원 수정은 채널 개설자만 가능합니다.", "error");
    }
  };

  return (
    <div className="relative flex" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="font-semibold text-sm cursor-pointer"
      >
        <FontAwesomeIcon
          icon={faGear}
          className="text-text-secondary cursor-pointer hover:text-text-primary"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-10 w-56 rounded-md bg-component-background shadow-md z-[9999] border border-component-border overflow-visible"
          >
            <div className="divide-y divide-component-border">
              <MenuItem className="rounded-t-md" disabled>
                <span className="font-bold">채널 설정</span>
              </MenuItem>

              <div>
                <MenuItem onClick={handleEditModalOpen}>
                  <FilePen className="h-4 w-4" />
                  <span>채널 정보 수정</span>
                </MenuItem>
                <MenuItem
                  onClick={handleMemberEditModalOpen}
                  className="rounded-b-md"
                >
                  <Users className="h-4 w-4" />
                  <span>멤버 관리</span>
                </MenuItem>

                <MenuItem onClick={toggleStar}>
                  <Star
                    className={`h-4 w-4 ${isStarred ? "fill-yellow-400" : ""}`}
                  />
                  <span>{isStarred ? "즐겨찾기 해제" : "즐겨찾기 추가"}</span>
                </MenuItem>

                <MenuItem onClick={togglePin}>
                  <Thumbtack
                    className={`h-4 w-4 ${isPinned ? "fill-red-500" : ""}`}
                  />
                  <span>{isPinned ? "고정 해제" : "채널 고정"}</span>
                </MenuItem>
              </div>

              <div>
                <MenuItem onClick={toggleMute}>
                  {isMuted ? (
                    <Bell className="h-4 w-4" />
                  ) : (
                    <BellRing className="h-4 w-4 fill-yellow-400" />
                  )}
                  <span>{isMuted ? "알림 켜기" : "알림 끄기"}</span>
                </MenuItem>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isEditModalOpen && (
        <ChannelEditModal
          channel={channel}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {isMemnerEditModalOpen && (
        <ChannelMemberEditModal
          channel={channel}
          isOpen={isMemnerEditModalOpen}
          onClose={() => setIsMemnerEditModalOpen(false)}
        />
      )}
    </div>
  );
}

interface MenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

function MenuItem({
  children,
  onClick,
  className = "",
  disabled = false,
}: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 flex items-center gap-2 text-sm ${
        disabled ? "" : "hover:bg-component-secondary-background"
      } ${className}`}
    >
      {children}
    </button>
  );
}
