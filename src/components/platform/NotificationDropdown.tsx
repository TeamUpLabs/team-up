"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/auth/authStore";
import { Notification } from "@/types/Member";
import { acceptScout, rejectScout } from "@/hooks/getMemberData";
import { checkAndRefreshAuth } from "@/auth/authStore";
import { useNotifications } from "@/providers/NotificationProvider";

interface NotificationDropdownProps {
  onToggleSidebar: () => void;
}

const getIconByType = (type: Notification["type"]) => {
  switch (type) {
    case "info":
      return (
        <div className="bg-blue-100 rounded-full p-1.5 sm:p-2 flex items-center justify-center text-blue-600 w-7 h-7 sm:w-8 sm:h-8">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]"
          >
            <path
              d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    case "task":
      return (
        <div className="bg-green-100 rounded-full p-1.5 sm:p-2 flex items-center justify-center text-green-600 w-7 h-7 sm:w-8 sm:h-8">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]"
          >
            <path
              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    case "message":
      return (
        <div className="bg-sky-100 rounded-full p-1.5 sm:p-2 flex items-center justify-center text-sky-600 w-7 h-7 sm:w-8 sm:h-8">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]"
          >
            <path
              d="M8 10H8.01M12 10H12.01M16 10H16.01M9 16H5C3.89543 16 3 15.1046 3 14V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V14C21 15.1046 20.1046 16 19 16H14L9 21V16Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    case "milestone":
      return (
        <div className="bg-indigo-100 rounded-full p-1.5 sm:p-2 flex items-center justify-center text-indigo-600 w-7 h-7 sm:w-8 sm:h-8">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]"
          >
            <path
              d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1v12zm0 0v6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    case "chat":
      return (
        <div className="bg-purple-100 rounded-full p-1.5 sm:p-2 flex items-center justify-center text-purple-600 w-7 h-7 sm:w-8 sm:h-8">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]"
          >
            <path
              d="M12 9V12M12 16H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    case "scout":
      return (
        <div className="bg-emerald-100 rounded-full p-1.5 sm:p-2 flex items-center justify-center text-emerald-600 w-7 h-7 sm:w-8 sm:h-8">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]"
          >
            <path
              d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    default:
      return (
        <div className="bg-gray-100 rounded-full p-1.5 sm:p-2 flex items-center justify-center text-gray-600 w-7 h-7 sm:w-8 sm:h-8">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[14px] h-[14px] sm:w-[16px] sm:h-[16px]"
          >
            <path
              d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
  }
};

const formatRelativeTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 6); // Corrected to 6 days ago to include 7 full days period

  const notificationDateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const timeString = date.toLocaleTimeString("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (notificationDateOnly.getTime() === today.getTime()) {
    return `오늘 ${timeString}`;
  }
  if (notificationDateOnly.getTime() === yesterday.getTime()) {
    return `어제 ${timeString}`;
  }
  if (notificationDateOnly >= oneWeekAgo) {
    // Greater than or equal to one week ago (within the last 7 days)
    const dayOfWeek = date.toLocaleDateString("ko-KR", { weekday: "short" }); // Using short for brevity
    return `${dayOfWeek} ${timeString}`;
  }
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.toLocaleDateString("ko-KR", {
      month: "numeric",
      day: "numeric",
    })} ${timeString}`;
  }
  return `${date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  })} ${timeString}`;
};

export default function NotificationDropdown({
  onToggleSidebar,
}: NotificationDropdownProps) {
  const user = useAuthStore((state) => state.user);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    fetchInitialNotifications,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) {
        // If will be open
        fetchInitialNotifications();
      }
      return !prev;
    });
  }, [fetchInitialNotifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleViewAllClick = useCallback(() => {
    setIsOpen(false);
    onToggleSidebar();
  }, [onToggleSidebar]);

  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      if (!notification.isRead) {
        try {
          await markAsRead(notification.id);
        } catch (error) {
          console.error(
            "Failed to mark notification as read from dropdown:",
            error
          );
        }
      }
    },
    [markAsRead]
  );

  const handleDeleteNotificationItem = useCallback(
    async (
      event: React.MouseEvent | React.KeyboardEvent,
      notificationId: number
    ) => {
      event.stopPropagation();
      try {
        await deleteNotification(notificationId);
      } catch (error) {
        console.error("Failed to delete notification from dropdown:", error);
      }
    },
    [deleteNotification]
  );

  const handleAcceptScoutItem = useCallback(
    async (e: React.MouseEvent, notification: Notification) => {
      e.stopPropagation();
      if (!user?.id) return;
      try {
        if (!notification.isRead) {
          await markAsRead(notification.id);
        }
        await acceptScout(user.id, notification.id);
        await checkAndRefreshAuth();
        useAuthStore
          .getState()
          .setAlert("스카우트를 수락하였습니다.", "success");
      } catch (error) {
        console.error("Failed to accept scout from dropdown:", error);
        useAuthStore
          .getState()
          .setAlert("스카우트 수락에 실패했습니다.", "error");
      }
    },
    [user?.id, markAsRead]
  );

  const handleRejectScoutItem = useCallback(
    async (e: React.MouseEvent, notification: Notification) => {
      e.stopPropagation();
      if (!user?.id) return;
      try {
        if (!notification.isRead) {
          await markAsRead(notification.id);
        }
        await rejectScout(user.id, notification.id);
        useAuthStore
          .getState()
          .setAlert("스카우트를 거절하였습니다.", "success");
      } catch (error) {
        console.error("Failed to reject scout from dropdown:", error);
        useAuthStore
          .getState()
          .setAlert("스카우트 거절에 실패했습니다.", "error");
      }
    },
    [user?.id, markAsRead]
  );

  const displayedNotifications = notifications.slice(0, 5);

  const handleMarkAllAsRead = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (unreadCount > 0) {
        try {
          await markAllAsRead();
        } catch (err) {
          console.error("Failed to mark all as read from dropdown:", err);
        }
      }
    },
    [markAllAsRead, unreadCount]
  );

  const handleDeleteAllNotifications = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (notifications.length > 0) {
        try {
          await deleteAllNotifications();
        } catch (err) {
          console.error(
            "Failed to delete all notifications from dropdown:",
            err
          );
        }
      }
    },
    [deleteAllNotifications, notifications.length]
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="notification-button" // Added ID for aria-labelledby
        aria-label="알림 보기"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="rounded-full p-2 hover:bg-component-secondary-background focus:outline-none focus-visible:ring-2 focus-visible:ring-point-color-indigo focus-visible:ring-opacity-75 transition-colors duration-200 relative"
        onClick={toggleDropdown}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unreadCount > 0 && (
          <span
            className="absolute top-0 right-0 -mt-0.5 -mr-0.5 px-1.5 py-0.5 bg-point-color-indigo text-white text-[10px] font-bold rounded-full flex items-center justify-center pointer-events-none"
            aria-label={`${unreadCount}개의 읽지 않은 알림`}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute right-0 mt-2 bg-component-background border border-component-border rounded-lg shadow-xl overflow-hidden z-[9000] w-80 sm:w-96 max-w-[calc(100vw-2rem)]"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="notification-button"
          >
            <div className="p-3 sm:p-4 border-b border-component-border flex justify-between items-center">
              <h3 className="font-semibold text-text-primary text-base sm:text-lg">
                알림
              </h3>
              <div className="flex items-center gap-1 sm:gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs sm:text-sm font-medium text-point-color-indigo hover:bg-point-color-indigo/10 py-1 px-1.5 sm:px-2 rounded-md transition-colors duration-200"
                    title="모든 알림 읽음 처리"
                    role="menuitem"
                  >
                    모두 읽음
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleDeleteAllNotifications}
                    className="text-xs sm:text-sm font-medium text-red-500 hover:bg-red-500/10 py-1 px-1.5 sm:px-2 rounded-md transition-colors duration-200"
                    title="모든 알림 삭제"
                    role="menuitem"
                  >
                    모두 삭제
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-y-auto max-h-[280px] sm:max-h-[360px] divide-y divide-component-border fancy-scrollbar">
              {displayedNotifications.length > 0 ? (
                displayedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 hover:bg-component-secondary-background focus-within:bg-component-secondary-background cursor-pointer transition-colors duration-150 group ${
                      !notification.isRead
                        ? "bg-point-color-indigo/5"
                        : "bg-transparent"
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                    role="menuitem"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        handleNotificationClick(notification);
                      if (e.key === "Delete")
                        handleDeleteNotificationItem(e, notification.id);
                    }}
                    aria-label={`알림: ${
                      notification.title
                    } - ${notification.message.substring(0, 30)}...${
                      notification.isRead ? " (읽음)" : " (읽지 않음)"
                    }`}
                  >
                    <div className="flex gap-2.5 sm:gap-3 items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIconByType(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5 sm:mb-1">
                          <p
                            className={`font-medium text-sm truncate ${
                              notification.isRead
                                ? "text-text-secondary group-hover:text-text-primary"
                                : "text-text-primary"
                            }`}
                          >
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div
                              className="w-2 h-2 rounded-full bg-point-color-indigo flex-shrink-0 ml-2 mt-1 self-start"
                              title="읽지 않음"
                            ></div>
                          )}
                        </div>
                        <p className="text-xs text-text-tertiary mb-1 sm:mb-1.5 line-clamp-2 break-all">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between text-xs text-text-tertiary">
                          <span
                            title={new Date(
                              notification.timestamp
                            ).toLocaleString("ko-KR")}
                          >
                            {formatRelativeTime(notification.timestamp)}
                          </span>

                          <div className="flex items-center gap-0.5 sm:gap-1">
                            {notification.type === "scout" &&
                              notification.result !== "accept" &&
                              notification.result !== "reject" && (
                                <>
                                  <button
                                    onClick={(e) =>
                                      handleAcceptScoutItem(e, notification)
                                    }
                                    className="text-xs font-medium text-point-color-indigo hover:underline px-1 sm:px-1.5 py-0.5 rounded hover:bg-point-color-indigo/10"
                                    aria-label={`'${notification.title}' 스카우트 제안 수락`}
                                  >
                                    수락
                                  </button>
                                  <button
                                    onClick={(e) =>
                                      handleRejectScoutItem(e, notification)
                                    }
                                    className="text-xs font-medium text-point-color-indigo hover:underline px-1 sm:px-1.5 py-0.5 rounded hover:bg-point-color-indigo/10"
                                    aria-label={`'${notification.title}' 스카우트 제안 거절`}
                                  >
                                    거절
                                  </button>
                                </>
                              )}
                            {notification.type === "scout" &&
                              notification.result === "accept" && (
                                <span className="text-xs font-medium text-green-600 px-1 sm:px-1.5">
                                  수락됨
                                </span>
                              )}
                            {notification.type === "scout" &&
                              notification.result === "reject" && (
                                <span className="text-xs font-medium text-red-600 px-1 sm:px-1.5">
                                  거절됨
                                </span>
                              )}
                            <button
                              onClick={(e) =>
                                handleDeleteNotificationItem(e, notification.id)
                              }
                              className="text-text-tertiary hover:text-red-500 p-0.5 sm:p-1 rounded-full hover:bg-red-500/10 transition-colors duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                              aria-label={`알림 '${notification.title}' 삭제`}
                              title="알림 삭제"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px]"
                              >
                                <path
                                  d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 sm:py-10 flex flex-col items-center justify-center text-center px-4">
                  <div className="bg-component-tertiary-background p-2.5 sm:p-3 rounded-full mb-3">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-text-secondary w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]"
                    >
                      <path
                        d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-text-primary font-semibold text-sm mb-1">
                    새로운 알림이 없습니다.
                  </p>
                  <p className="text-xs text-text-tertiary">
                    활동이 생기면 여기에 표시됩니다.
                  </p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-2 border-t border-component-border bg-component-background">
                <button
                  onClick={handleViewAllClick}
                  className="w-full py-2 text-center text-sm font-medium text-point-color-indigo hover:bg-point-color-indigo/10 rounded-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-point-color-indigo focus-visible:ring-offset-1 focus-visible:ring-offset-component-background"
                  role="menuitem"
                >
                  모든 알림 보기{" "}
                  {notifications.length > 0 ? `(${notifications.length})` : ""}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
