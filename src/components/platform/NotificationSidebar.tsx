"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/auth/authStore";
import { Notification } from "@/types/Member";
import { updateNotification, deleteNotification, deleteAllNotifications } from "@/hooks/getNotificationData";
import { acceptScout, rejectScout } from "@/hooks/getMemberData";
import { checkAndRefreshAuth } from "@/auth/authStore";

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function NotificationSidebar({ isOpen, onClose }: NotificationSidebarProps) {
  const user = useAuthStore((state) => state.user);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (user) {
      const notifications = user.notification || [];
      setNotifications(notifications);
    }
  }, [user]);

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
        const unreadNotifications = notifications.filter(notification => !notification.isRead);

        for (const notification of unreadNotifications) {
          await markAsRead(notification.id);
        }

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

  const getIconByType = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return (
          <div className="bg-blue-100 rounded-full p-2 flex items-center justify-center text-blue-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
      case "task":
        return (
          <div className="bg-green-100 rounded-full p-2 flex items-center justify-center text-green-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
      case "message":
        return (
          <div className="bg-red-100 rounded-full p-2 flex items-center justify-center text-red-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V12M12 16H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
      case "milestone":
        return (
          <div className="bg-purple-100 rounded-full p-2 flex items-center justify-center text-purple-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 10H8.01M12 10H12.01M16 10H16.01M9 16H5C3.89543 16 3 15.1046 3 14V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V14C21 15.1046 20.1046 16 19 16H14L9 21V16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
      case "chat":
        return (
          <div className="bg-amber-100 rounded-full p-2 flex items-center justify-center text-amber-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4607 20 9.01172 19.6565 7.74467 19.0511L3 20L4.39499 16.28C3.51156 15.0423 3 13.5743 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
      case "scout":
        return (
          <div className="bg-emerald-100 rounded-full p-2 flex items-center justify-center text-emerald-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 rounded-full p-2 flex items-center justify-center text-gray-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
    }
  };

  const filteredNotifications = activeTab === "all"
    ? notifications
    : notifications.filter(n => !n.isRead);

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  // Group notifications by date
  const getNotificationDate = (timestamp: string) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (timestamp.includes("분 전") || timestamp.includes("시간 전") || timestamp.includes("방금 전")) {
      return "오늘";
    } else if (timestamp.includes("어제")) {
      return "어제";
    } else {
      return "이전";
    }
  };

  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = getNotificationDate(notification.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);

  const dateOrder = ["오늘", "어제", "이전"];

  const handleAcceptScout = async (notification: Notification) => {
    if (user?.id) {
      try {
        if (notification.isRead == false) {
          await markAsRead(notification.id);
        }
        await acceptScout(user.id, notification.id);
        // Refresh user data to update projects list
        await checkAndRefreshAuth();
        
        setNotifications(notifications.map(n =>
          n.id === notification.id ? { ...n, result: "accept" } : n
        ));
        useAuthStore.getState().setAlert("스카우트를 수락하였습니다.", "success");
      } catch (error) {
        console.error("Failed to accept scout:", error);
        useAuthStore.getState().setAlert("스카우트 수락에 실패했습니다.", "error");
      }
    }
  }

  const handleRejectScout = async (notification: Notification) => {
    if (user?.id) {
      try {
        if (notification.isRead == false) {
          await markAsRead(notification.id);
        }
        await rejectScout(user.id, notification.id);
        setNotifications(notifications.map(n =>
          n.id === notification.id ? { ...n, result: "reject" } : n
        ));
        useAuthStore.getState().setAlert("스카우트를 거절하였습니다.", "success");
      } catch (error) {
        console.error("Failed to reject scout:", error);
        useAuthStore.getState().setAlert("스카우트 거절에 실패했습니다.", "error");
      }
    }
  }

  const handleDeleteNotification = async (e: React.MouseEvent, notification: Notification) => {
    e.stopPropagation();
    if (user?.id) {
      try {
        await deleteNotification(user.id, notification.id);
        setNotifications(notifications.filter(n => n.id !== notification.id));
        useAuthStore.getState().setAlert("알림이 삭제되었습니다.", "success");
      } catch (error) {
        console.error("Failed to delete notification:", error);
        useAuthStore.getState().setAlert("알림 삭제에 실패했습니다.", "error");
      }
    }
  }

  return (
    <div className={`fixed top-0 right-0 h-full border-l border-component-border bg-component-background transition-all duration-300 w-72 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="py-4 h-full flex flex-col">
        <div className="px-4 flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">알림</h1>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-component-secondary-background"
            aria-label="Close notifications"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 border-b border-component-border mb-4">
          <button
            className={`py-2 px-4 font-medium text-sm relative ${activeTab === 'all' ? 'text-point-color-indigo' : 'text-text-secondary'}`}
            onClick={() => setActiveTab('all')}
          >
            전체 {notifications.length}
            {activeTab === 'all' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-point-color-indigo"></div>
            )}
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm relative flex items-center ${activeTab === 'unread' ? 'text-point-color-indigo' : 'text-text-secondary'}`}
            onClick={() => setActiveTab('unread')}
          >
            안 읽은 알림 {unreadCount}
            {unreadCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-point-color-indigo text-white text-xs font-bold rounded-full">
                {unreadCount}
              </span>
            )}
            {activeTab === 'unread' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-point-color-indigo"></div>
            )}
          </button>
        </div>

        {notifications.length > 0 && (
          <div className="px-4 mb-4 flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex-1 py-2 text-sm font-medium bg-component-secondary-background hover:bg-component-tertiary-background text-point-color-indigo border border-component-border rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M9 14L11 16L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  모두 읽음
                </div>
              </button>
            )}
            <button
              onClick={handleDeleteAll}
              className="flex-1 py-2 text-sm font-medium bg-component-secondary-background hover:bg-component-tertiary-background text-red-500 border border-component-border rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center justify-center gap-1.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                모두 삭제
              </div>
            </button>
          </div>
        )}

        <div className="px-4 overflow-y-auto flex-1">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-6">
              {dateOrder.map(date => {
                if (!groupedNotifications[date]) return null;
                return (
                  <div key={date}>
                    <h2 className="text-sm font-medium text-text-secondary mb-2">{date}</h2>
                    <div className="space-y-2">
                      {groupedNotifications[date].map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg hover:bg-component-secondary-background cursor-pointer transition-colors duration-200 border ${notification.isRead ? "border-component-border" : "border-point-color-indigo"}`}
                          onClick={() => markAsRead(notification.id)}
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
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAcceptScout(notification);
                                        }}
                                        className="text-xs font-medium text-point-color-indigo hover:underline"
                                      >
                                        수락
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRejectScout(notification);
                                        }}
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
                                    onClick={(e) => handleDeleteNotification(e, notification)}
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
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
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
      </div>
    </div>
  );
}