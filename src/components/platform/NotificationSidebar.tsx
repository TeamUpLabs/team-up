"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useAuthStore } from "@/auth/authStore";
import { Notification } from "@/types/Member";
import { acceptScout, rejectScout } from "@/hooks/getMemberData";
import { useNotifications } from "@/providers/NotificationProvider";

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const getIconByType = (type: Notification["type"]) => {
  switch (type) {
    case "info":
      return (
        <div className="bg-blue-100 rounded-full p-2 flex items-center justify-center text-blue-600 w-8 h-8">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
        <div className="bg-green-100 rounded-full p-2 flex items-center justify-center text-green-600 w-8 h-8">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
        <div className="bg-sky-100 rounded-full p-2 flex items-center justify-center text-sky-600 w-8 h-8">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
        <div className="bg-indigo-100 rounded-full p-2 flex items-center justify-center text-indigo-600 w-8 h-8">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
        <div className="bg-purple-100 rounded-full p-2 flex items-center justify-center text-purple-600 w-8 h-8">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
        <div className="bg-emerald-100 rounded-full p-2 flex items-center justify-center text-emerald-600 w-8 h-8">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
        <div className="bg-gray-100 rounded-full p-2 flex items-center justify-center text-gray-600 w-8 h-8">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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

export default function NotificationSidebar({
  isOpen,
  onClose,
}: NotificationSidebarProps) {
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
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchInitialNotifications();
    }
  }, [isOpen, user?.id, fetchInitialNotifications]);

  const handleAcceptScout = useCallback(
    async (notification: Notification) => {
      if (!user?.id) return;
      try {
        if (!notification.isRead) {
          await markAsRead(notification.id);
        }
        await acceptScout(user.id, notification.id);
        useAuthStore
          .getState()
          .setAlert("스카우트를 수락하였습니다.", "success");
      } catch (error) {
        console.error("Failed to accept scout from sidebar:", error);
        useAuthStore
          .getState()
          .setAlert("스카우트 수락에 실패했습니다.", "error");
      }
    },
    [user?.id, markAsRead]
  );

  const handleRejectScout = useCallback(
    async (notification: Notification) => {
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
        console.error("Failed to reject scout from sidebar:", error);
        useAuthStore
          .getState()
          .setAlert("스카우트 거절에 실패했습니다.", "error");
      }
    },
    [user?.id, markAsRead]
  );

  const handleDeleteNotificationItem = useCallback(
    async (
      e: React.MouseEvent | React.KeyboardEvent,
      notificationId: number
    ) => {
      e.stopPropagation();
      if (!user?.id) return;
      try {
        await deleteNotification(notificationId);
      } catch (error) {
        console.error("Failed to delete notification from sidebar:", error);
      }
    },
    [user?.id, deleteNotification]
  );

  const formatDate = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const formatTime = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const getRelativeDateGroup = useCallback(
    (timestamp: string): string => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const notificationDate = new Date(timestamp);
      notificationDate.setHours(0, 0, 0, 0);

      if (notificationDate.getTime() === today.getTime()) return "오늘";
      if (notificationDate.getTime() === yesterday.getTime()) return "어제";
      return formatDate(timestamp);
    },
    [formatDate]
  );

  const filteredNotifications = useMemo(() => {
    return activeTab === "all"
      ? notifications
      : notifications.filter((n) => !n.isRead);
  }, [notifications, activeTab]);

  const groupedNotifications = useMemo(() => {
    const sortedNotifications = [...filteredNotifications].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return sortedNotifications.reduce((groups, notification) => {
      const dateGroup = getRelativeDateGroup(notification.timestamp);
      if (!groups[dateGroup]) {
        groups[dateGroup] = [];
      }
      groups[dateGroup].push(notification);
      return groups;
    }, {} as Record<string, Notification[]>);
  }, [filteredNotifications, getRelativeDateGroup]);

  const dateGroupOrder = useMemo(() => {
    const groups = Object.keys(groupedNotifications);
    return groups.sort((a, b) => {
      if (a === "오늘") return -1;
      if (b === "오늘") return 1;
      if (a === "어제") return -1;
      if (b === "어제") return 1;
      return new Date(b).getTime() - new Date(a).getTime();
    });
  }, [groupedNotifications]);

  const handleMarkNotificationAsRead = useCallback(
    async (notification: Notification) => {
      if (!notification.isRead) {
        try {
          await markAsRead(notification.id);
        } catch (error) {
          console.error(
            "Error marking notification as read from sidebar: ",
            error
          );
        }
      }
    },
    [markAsRead]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    if (unreadCount > 0) {
      try {
        await markAllAsRead();
      } catch (error) {
        console.error(
          "Error marking all notifications as read from sidebar: ",
          error
        );
      }
    }
  }, [markAllAsRead, unreadCount]);

  const handleDeleteAllNotifications = useCallback(async () => {
    if (notifications.length > 0) {
      try {
        await deleteAllNotifications();
      } catch (error) {
        console.error("Error deleting all notifications from sidebar: ", error);
      }
    }
  }, [deleteAllNotifications, notifications.length]);

  return (
    <div
      className={`fixed top-0 right-0 h-full z-[8400] border-l border-component-border bg-component-background transition-transform duration-300 ease-in-out w-72 transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      aria-label="알림 목록"
      role="complementary"
    >
      <div className="py-4 h-full flex flex-col">
        <div className="px-4 flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-text-primary">알림</h1>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-component-secondary-background focus:outline-none focus-visible:ring-2 focus-visible:ring-point-color-indigo"
              aria-label="알림 사이드바 닫기"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M6 18L18 6M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        <div
          className="flex px-4 border-b border-component-border mb-4"
          role="tablist"
          aria-label="알림 필터"
        >
          <button
            id="tab-all"
            role="tab"
            aria-selected={activeTab === "all"}
            aria-controls="panel-all"
            className={`py-2.5 px-4 font-medium text-sm relative transition-colors duration-200 ${
              activeTab === "all"
                ? "text-point-color-indigo"
                : "text-text-secondary hover:text-text-primary"
            }`}
            onClick={() => setActiveTab("all")}
          >
            전체 {notifications.length > 0 ? `(${notifications.length})` : ""}
            {activeTab === "all" && (
              <div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-point-color-indigo rounded-t-full"
                aria-hidden="true"
              ></div>
            )}
          </button>
          <button
            id="tab-unread"
            role="tab"
            aria-selected={activeTab === "unread"}
            aria-controls="panel-unread"
            className={`py-2.5 px-4 font-medium text-sm relative flex items-center transition-colors duration-200 ${
              activeTab === "unread"
                ? "text-point-color-indigo"
                : "text-text-secondary hover:text-text-primary"
            }`}
            onClick={() => setActiveTab("unread")}
          >
            안 읽은 알림
            {unreadCount > 0 && (
              <span
                className={`ml-1.5 px-1.5 py-0.5 text-xs font-semibold rounded-full transition-colors duration-200 pointer-events-none ${
                  activeTab === "unread"
                    ? "bg-point-color-indigo text-white"
                    : "bg-point-color-indigo/20 text-point-color-indigo"
                }`}
                aria-hidden="true"
              >
                {unreadCount}
              </span>
            )}
            {activeTab === "unread" && (
              <div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-point-color-indigo rounded-t-full"
                aria-hidden="true"
              ></div>
            )}
          </button>
        </div>

        {(notifications.length > 0 || unreadCount > 0) && (
          <div className="px-4 mb-4 flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex-1 py-2 text-sm font-medium bg-component-secondary-background hover:bg-component-tertiary-background text-point-color-indigo border border-component-border rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-point-color-indigo"
                aria-label="모든 알림 읽음 처리"
              >
                <div
                  className="flex items-center justify-center gap-1.5"
                  aria-hidden="true"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M9 14L11 16L15 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  모두 읽음
                </div>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleDeleteAllNotifications}
                className="flex-1 py-2 text-sm font-medium bg-component-secondary-background hover:bg-component-tertiary-background text-red-500 border border-component-border rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label="모든 알림 삭제"
              >
                <div
                  className="flex items-center justify-center gap-1.5"
                  aria-hidden="true"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  모두 삭제
                </div>
              </button>
            )}
          </div>
        )}

        <div
          id={activeTab === "all" ? "panel-all" : "panel-unread"}
          role="tabpanel"
          aria-labelledby={activeTab === "all" ? "tab-all" : "tab-unread"}
          className="px-4 overflow-y-auto flex-1 fancy-scrollbar pb-4"
        >
          {filteredNotifications.length > 0 ? (
            <div className="space-y-6">
              {dateGroupOrder.map((dateGroup) => (
                <div key={dateGroup}>
                  <h2 className="text-sm font-semibold text-text-secondary mb-2 sticky top-0 bg-component-background py-1 z-10">
                    {dateGroup}
                  </h2>
                  <ul className="space-y-2" role="list">
                    {groupedNotifications[dateGroup].map((notification) => (
                      <li
                        key={notification.id}
                        className={`p-3.5 rounded-lg hover:bg-component-secondary-background focus-within:bg-component-secondary-background group cursor-pointer transition-all duration-200 border ${
                          notification.isRead
                            ? "border-component-border"
                            : "border-point-color-indigo shadow-sm"
                        }`}
                        onClick={() =>
                          handleMarkNotificationAsRead(notification)
                        }
                        role="article"
                        aria-labelledby={`notification-title-${notification.id}`}
                        aria-describedby={`notification-message-${notification.id}`}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ")
                            handleMarkNotificationAsRead(notification);
                          if (e.key === "Delete")
                            handleDeleteNotificationItem(e, notification.id);
                        }}
                      >
                        <div className="flex gap-3">
                          <div
                            className="flex-shrink-0 mt-1"
                            aria-hidden="true"
                          >
                            {getIconByType(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <p
                                id={`notification-title-${notification.id}`}
                                className={`font-semibold text-sm ${
                                  notification.isRead
                                    ? "text-text-secondary group-hover:text-text-primary"
                                    : "text-text-primary"
                                }`}
                              >
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <div
                                  className="w-2 h-2 rounded-full bg-point-color-indigo flex-shrink-0 ml-2 mt-1.5"
                                  title="읽지 않음"
                                  aria-label="읽지 않은 알림"
                                ></div>
                              )}
                            </div>
                            <p
                              id={`notification-message-${notification.id}`}
                              className="text-sm text-text-tertiary mb-2 line-clamp-3 break-all"
                            >
                              {notification.message}
                            </p>

                            <div className="flex items-center justify-between mt-2">
                              <span
                                className="text-xs text-text-tertiary"
                                title={new Date(
                                  notification.timestamp
                                ).toLocaleString("ko-KR")}
                              >
                                {formatTime(notification.timestamp)}
                              </span>

                              <div className="flex items-center gap-2">
                                {notification.type === "scout" &&
                                  notification.result !== "accept" &&
                                  notification.result !== "reject" && (
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAcceptScout(notification);
                                        }}
                                        className="text-xs font-medium text-point-color-indigo hover:underline px-2 py-1 rounded hover:bg-point-color-indigo/10 transition-colors"
                                        aria-label={`'${notification.title}' 스카우트 제안 수락`}
                                      >
                                        수락
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleRejectScout(notification);
                                        }}
                                        className="text-xs font-medium text-point-color-indigo hover:underline px-2 py-1 rounded hover:bg-point-color-indigo/10 transition-colors"
                                        aria-label={`'${notification.title}' 스카우트 제안 거절`}
                                      >
                                        거절
                                      </button>
                                    </div>
                                  )}
                                {notification.type === "scout" &&
                                  notification.result === "accept" && (
                                    <span className="text-xs font-medium text-green-600 px-2 py-1 rounded bg-green-500/10">
                                      수락됨
                                    </span>
                                  )}
                                {notification.type === "scout" &&
                                  notification.result === "reject" && (
                                    <span className="text-xs font-medium text-red-600 px-2 py-1 rounded bg-red-500/10">
                                      거절됨
                                    </span>
                                  )}

                                <button
                                  onClick={(e) =>
                                    handleDeleteNotificationItem(
                                      e,
                                      notification.id
                                    )
                                  }
                                  className="text-text-tertiary hover:text-red-500 p-1.5 rounded-full hover:bg-red-500/10 transition-colors duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                  aria-label={`알림 '${notification.title}' 삭제`}
                                  title="알림 삭제"
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
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
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div
                className="bg-component-tertiary-background p-4 rounded-full mb-4"
                aria-hidden="true"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-text-secondary"
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
              <p className="text-text-primary font-semibold mb-1" role="status">
                알림이 없습니다
              </p>
              <p className="text-sm text-text-tertiary max-w-xs">
                {activeTab === "unread"
                  ? "읽지 않은 알림이 없습니다. 모든 알림 탭에서 확인해보세요."
                  : "새로운 알림이 도착하면 여기에 표시됩니다."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
