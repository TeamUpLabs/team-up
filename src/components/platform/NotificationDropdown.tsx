"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/auth/authStore";
import { Notification } from "@/types/Member";
import { updateNotification, deleteNotification, deleteAllNotifications } from "@/hooks/getNotificationData";
import { acceptScout, rejectScout } from "@/hooks/getMemberData";
import { checkAndRefreshAuth } from "@/auth/authStore";

interface NotificationDropdownProps {
  onToggleSidebar: () => void;
}

export default function NotificationDropdown({ onToggleSidebar }: NotificationDropdownProps) {
  const user = useAuthStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  useEffect(() => {
    if (user) {
      const notifications = user.notification || [];
      setNotifications(notifications);
    }
  }, [user]);

  // Check for mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markAsRead = async (id: number) => {
    if (user?.id) {
      try {
        await updateNotification(user.id, id);
        setNotifications(notifications.map(notification =>
          notification.id === id ? { ...notification, isRead: true } : notification
        ));
      } catch (error) {
        console.error("Failed to update notification:", error);
      }
    }
  };

  const markAllAsRead = async () => {
    if (user?.id) {
      try {
        // Get all unread notifications
        const unreadNotifications = notifications.filter(notification => !notification.isRead);

        // Process each notification sequentially to ensure reliability
        for (const notification of unreadNotifications) {
          await markAsRead(notification.id);
        }

        // Update local state after all API calls are successful
        setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
      } catch (error) {
        console.error("Failed to update all notifications:", error);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (user?.id && notifications.length > 0) {
      try {
        await deleteAllNotifications(user.id);
        setNotifications([]);
        useAuthStore.getState().setAlert("모든 알림이 삭제되었습니다.", "success");
      } catch (error) {
        console.error("Failed to delete all notifications:", error);
        useAuthStore.getState().setAlert("알림 삭제에 실패했습니다.", "error");
      }
    }
  };

  const handleViewAllClick = () => {
    setIsOpen(false);
    onToggleSidebar();
  };

  const handleNotificationClick = (notificationId: number) => {
    markAsRead(notificationId);
  };

  const handleDeleteNotification = async (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    if (user?.id) {
      try {
        await deleteNotification(user.id, notificationId);
        setNotifications(notifications.filter(notification => notification.id !== notificationId));
        useAuthStore.getState().setAlert("알림이 삭제되었습니다.", "success");
      } catch (error) {
        console.error("Failed to delete notification:", error);
        useAuthStore.getState().setAlert("알림 삭제에 실패했습니다.", "error");
      }
    }
  };

  const handleAcceptScout = async (e: React.MouseEvent, notification: Notification) => {
    // 이벤트 전파 중지
    e.stopPropagation();

    if (user?.id) {
      try {
        if (notification.isRead == false) {
          await markAsRead(notification.id);
        }
        await acceptScout(user.id, notification.id);
        // Refresh user data to update projects list
        await checkAndRefreshAuth();

        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, result: "accept" as const } : n)
        );

        useAuthStore.getState().setAlert("스카우트를 수락하였습니다.", "success");
      } catch (error) {
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ?
            { ...n, result: notification.result } : n)
        );
        console.error("Failed to accept scout:", error);
        useAuthStore.getState().setAlert("스카우트 수락에 실패했습니다.", "error");
      }
    }
  }

  const handleRejectScout = async (e: React.MouseEvent, notification: Notification) => {
    // 이벤트 전파 중지
    e.stopPropagation();

    if (user?.id) {
      try {
        if (notification.isRead == false) {
          await markAsRead(notification.id);
        }
        await rejectScout(user.id, notification.id);

        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, result: "reject" as const } : n)
        );

        useAuthStore.getState().setAlert("스카우트를 거절하였습니다.", "success");
      } catch (error) {
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ?
            { ...n, result: notification.result } : n)
        );
        console.error("Failed to reject scout:", error);
        useAuthStore.getState().setAlert("스카우트 거절에 실패했습니다.", "error");
      }
    }
  }

  const getIconByType = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return (
          <div className="bg-blue-100 rounded-full p-2 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
      case "task":
        return (
          <div className="bg-green-100 rounded-full p-2 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
      case "message":
        return (
          <div className="bg-purple-100 rounded-full p-2 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V12M12 16H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
      case "milestone":
        return (
          <div className="bg-purple-100 rounded-full p-2 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 10H8.01M12 10H12.01M16 10H16.01M9 16H5C3.89543 16 3 15.1046 3 14V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V14C21 15.1046 20.1046 16 19 16H14L9 21V16Z" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
      case "chat":
        return (
          <div className="bg-purple-100 rounded-full p-2 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V12M12 16H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
      case "scout":
        return (
          <div className="bg-emerald-100 rounded-full p-2 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );

      default:
        return (
          <div className="bg-gray-100 rounded-full p-2 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-label="Notifications"
        className="rounded-full p-2 hover:bg-component-secondary-background transition-colors duration-200 relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 px-1.5 py-0.5 bg-point-color-indigo text-white text-xs font-bold rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute ${isMobile ? 'right-0 left-0 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-0' : 'right-0'} mt-2 w-80 ${isMobile ? 'max-w-[calc(100vw-2rem)] mx-auto' : ''} bg-component-background border border-component-border rounded-lg shadow-lg z-50 overflow-hidden`}
            style={isMobile ? {
              width: 'calc(100vw - 2rem)',
              maxWidth: '320px',
              left: '50%',
              transform: 'translateX(-50%)'
            } : undefined}
          >
            <div className="p-4 border-b border-component-border flex justify-between items-center">
              <h3 className="font-semibold text-text-primary text-base">알림 ({notifications.length})</h3>
              <div className="flex gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-point-color-indigo hover:underline font-medium"
                  >
                    모두 읽음
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleDeleteAll}
                    className="text-xs text-red-500 hover:underline font-medium"
                  >
                    전체 삭제
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-y-auto max-h-[400px] divide-y divide-component-border">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-component-secondary-background cursor-pointer transition-colors duration-200 ${!notification.isRead ? 'bg-component-tertiary-background/50' : ''}`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIconByType(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-medium text-text-primary text-sm">{notification.title}</p>
                          {!notification.isRead && (
                            <div className="w-2 h-2 rounded-full bg-point-color-indigo flex-shrink-0 ml-2"></div>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary mb-2">{notification.message}</p>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-text-tertiary">{notification.timestamp}</span>

                          <div className="flex items-center">
                            {notification.type === "scout" && notification.result !== "accept" && notification.result !== "reject" && (
                              <div className="flex items-center gap-3 mr-3">
                                <button
                                  onClick={(e) => handleAcceptScout(e, notification)}
                                  className="text-xs font-medium text-point-color-indigo hover:underline"
                                >
                                  수락
                                </button>
                                <button
                                  onClick={(e) => handleRejectScout(e, notification)}
                                  className="text-xs font-medium text-point-color-indigo hover:underline"
                                >
                                  거절
                                </button>
                              </div>
                            )}
                            {notification.type === "scout" && notification.result === "accept" && (
                              <div className="flex items-center mr-3">
                                <span className="text-xs font-medium text-point-color-indigo">수락함</span>
                              </div>
                            )}
                            {notification.type === "scout" && notification.result === "reject" && (
                              <div className="flex items-center mr-3">
                                <span className="text-xs font-medium text-point-color-indigo">거절함</span>
                              </div>
                            )}

                            <button
                              onClick={(e) => handleDeleteNotification(e, notification.id)}
                              className="text-text-tertiary hover:text-red-500 p-1 transition-colors duration-200"
                              aria-label="Delete notification"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-60 text-center">
                  <div className="bg-gray-100 p-3 rounded-full mb-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-text-secondary mb-1 font-medium">알림이 없습니다</p>
                  <p className="text-sm text-text-tertiary">새로운 알림이 도착하면 여기에 표시됩니다</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-component-border bg-component-secondary-background/50">
              <button
                className="w-full py-2 text-sm font-medium text-center text-point-color-indigo hover:underline"
                onClick={handleViewAllClick}
              >
                모든 알림 보기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 