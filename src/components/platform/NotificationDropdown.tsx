"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/auth/authStore";
import { Notification } from "@/types/Member";
import { updateNotification } from "@/hooks/getNotificationData";

export default function NotificationDropdown() {
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
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
            <div className="p-3 border-b border-component-border flex justify-between items-center">
              <h3 className="font-semibold text-text-primary">알림</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-point-color-indigo hover:underline"
                >
                  모두 읽음 표시
                </button>
              )}
            </div>

            <div className="overflow-y-auto max-h-96">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-component-border hover:bg-component-secondary-background cursor-pointer ${!notification.isRead ? 'bg-component-tertiary-background' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getIconByType(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-text-primary">{notification.title}</p>
                          <span className="text-xs text-text-secondary whitespace-nowrap ml-2">{notification.timestamp}</span>
                        </div>
                        <p className="text-sm text-text-secondary mt-1 line-clamp-2">{notification.message}</p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-point-color-indigo flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-text-secondary">
                  <p>알림이 없습니다</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-component-border">
              <button
                className="w-full py-1.5 text-sm text-center text-point-color-indigo hover:underline"
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