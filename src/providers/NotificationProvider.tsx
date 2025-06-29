"use client";

import {
  useEffect,
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import { useAuthStore } from "@/auth/authStore";
import { Notification } from "@/types/Member";
import { server } from "@/auth/server";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  fetchInitialNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  const setNotificationAlert = useAuthStore((state) => state.setNotificationAlert);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);
  const lastProcessedNotificationIds = useRef(new Set<number>());
  const lastAlertedNotificationId = useRef<number | null>(null);
  const initialNotificationsHydrated = useRef(false);

  const fetchInitialNotifications = useCallback(async () => {
    initialNotificationsHydrated.current = false;
    if (user?.id) {
      try {
        const response = await server.get(`/member/${user.id}/notifications`);
        let initialNotifications: Notification[] = [];
        if (response.status === 200 && Array.isArray(response.data)) {
          initialNotifications = response.data;
        } else {
          initialNotifications = user.notification || [];
          console.warn("Fetched initial notifications from user.notification due to API issue or unexpected data.", response);
        }
        
        setNotifications(initialNotifications);
        lastProcessedNotificationIds.current = new Set(
          initialNotifications.map((n) => n.id)
        );

        if (initialNotifications.length > 0) {
          const mostRecentInitialNotification = initialNotifications.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() -
              new Date(a.timestamp).getTime()
          )[0];
          if (mostRecentInitialNotification) {
            lastAlertedNotificationId.current = mostRecentInitialNotification.id;
          }
        }
        initialNotificationsHydrated.current = true;

      } catch (error) {
        console.error("Failed to fetch initial notifications:", error);
        const fallbackNotifications = user.notification || [];
        setNotifications(fallbackNotifications);
        lastProcessedNotificationIds.current = new Set(
            fallbackNotifications.map((n: Notification) => n.id)
        );
        if (fallbackNotifications.length > 0) {
          const mostRecentFallbackNotification = fallbackNotifications.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() -
              new Date(a.timestamp).getTime()
          )[0];
          if (mostRecentFallbackNotification) {
            lastAlertedNotificationId.current = mostRecentFallbackNotification.id;
          }
        }
        initialNotificationsHydrated.current = true;
      }
    } else {
      setNotifications([]);
      lastProcessedNotificationIds.current = new Set();
      lastAlertedNotificationId.current = null;
      initialNotificationsHydrated.current = false;
    }
  }, [user?.id, user?.notification]);

  useEffect(() => {
    fetchInitialNotifications();
  }, [fetchInitialNotifications]);

  useEffect(() => {
    if (!user?.id) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setNotifications([]);
      lastProcessedNotificationIds.current = new Set();
      lastAlertedNotificationId.current = null;
      return;
    }

    const connect = () => {
      if (
        eventSourceRef.current &&
        eventSourceRef.current.readyState !== EventSource.CLOSED
      ) {
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        console.error("NEXT_PUBLIC_API_URL is not defined.");
        return;
      }
      const sseUrl = `${apiUrl}/member/${user.id}/notifications/sse`;
      
      console.log("Attempting to connect to SSE:", sseUrl);
      const newEventSource = new EventSource(sseUrl);
      eventSourceRef.current = newEventSource;

      newEventSource.onopen = () => {
        console.log("SSE connection established.");
      };

      newEventSource.onmessage = (event) => {
        try {
          const eventData = JSON.parse(event.data);
          
          if (!eventData) {
            console.warn("Received empty SSE data");
            return;
          }

          // Handle both formats: { notifications: [] } and []
          const notifications = Array.isArray(eventData.notifications) 
            ? eventData.notifications 
            : Array.isArray(eventData) 
              ? eventData 
              : [];

          if (!Array.isArray(notifications)) {
            console.error("Invalid notifications data format:", typeof notifications);
            return;
          }

          // Validate each notification
          const validNotifications = notifications.filter((n): n is Notification => {
            if (!n || typeof n !== 'object') return false;
            
            const hasRequiredFields = 
              typeof n.id === 'number' && 
              typeof n.timestamp === 'string' && 
              typeof n.isRead === 'boolean';

            if (!hasRequiredFields) {
              console.warn(`Skipping invalid notification:`, n);
              return false;
            }
            
            return true;
          });

          if (validNotifications.length === 0) {
            console.log("No valid notifications received");
            return;
          }

          setNotifications(validNotifications);

          const newNotifications = validNotifications.filter(
            (n: Notification) => !lastProcessedNotificationIds.current.has(n.id)
          );

          if (newNotifications.length > 0) {
            const mostRecentNewNotification = newNotifications.sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            )[0];

            if (initialNotificationsHydrated.current && mostRecentNewNotification && mostRecentNewNotification.id !== lastAlertedNotificationId.current) {
              setNotificationAlert(
                mostRecentNewNotification,
                mostRecentNewNotification.type || "info"
              );
              lastAlertedNotificationId.current = mostRecentNewNotification.id;
            }
            validNotifications.forEach((n: Notification) =>
              lastProcessedNotificationIds.current.add(n.id)
            );
          }
        } catch (error) {
          console.error(
            "Error processing SSE data:",
            error,
            "Raw data:", event.data
          );
          // Reset connection after parsing error
          if (eventSourceRef.current === newEventSource) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
            connect();
          }
        }
      };

      newEventSource.onerror = (event: Event) => {
        console.error("SSE connection error:", event);
        
        // Check error type
        const errorEvent = event as MessageEvent;
        if (errorEvent.data) {
          console.error("SSE error data:", errorEvent.data);
        }

        if (eventSourceRef.current === newEventSource) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
          
          // Only attempt reconnection if we're still authenticated
          if (user?.id) {
            // Exponential backoff for reconnection attempts
            let retryAttempts = 0;
            const backoffTime = Math.min(5000 * Math.pow(2, retryAttempts), 30000); // Max 30s
            retryAttempts++;
            
            console.log(
              `SSE error. Attempting to reconnect in ${backoffTime}ms... (Attempt ${retryAttempts})`
            );
            
            setTimeout(() => {
              if (user?.id) {
                connect();
              }
            }, backoffTime);
          }
        }
      };
    };

    connect();

    return () => {
      if (eventSourceRef.current) {
        console.log("Closing SSE connection due to component unmount or user change.");
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [user?.id, setNotificationAlert]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id: number) => {
    if (!user?.id) return;

    const originalNotifications = [...notifications];
    const notificationIndex = originalNotifications.findIndex(n => n.id === id);
    
    if (notificationIndex === -1) {
      console.error(`Notification with id ${id} not found`);
      return;
    }

    // Optimistically update state
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );

    try {
      const res = await server.put(`/member/${user.id}/notification/${id}`, {
        isRead: true,
      });

      if (res.status !== 200) {
        throw new Error(`Server returned status ${res.status}`);
      }
      
      lastProcessedNotificationIds.current.add(id);
    } catch (error) {
      console.error("Failed to update notification:", error);
      // Only revert if the error is not a 404 (notification not found)
      if (error instanceof Error && !error.message.includes('404')) {
        setNotifications(originalNotifications);
      }
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id || unreadCount === 0) return;

    const unreadNotificationIds = notifications
      .filter((n) => !n.isRead)
      .map((n) => n.id);

    if (unreadNotificationIds.length === 0) return;

    for (const id of unreadNotificationIds) {
      try {
        await markAsRead(id);
      } catch (error) {
        console.error(`Failed to mark notification ${id} as read during markAllAsRead operation:`, error);
      }
    }
  };

  const deleteNotification = async (id: number) => {
    if (!user?.id) return;

    const originalNotifications = [...notifications];
    setNotifications((prevNotifications) =>
      prevNotifications.filter((n) => n.id !== id)
    );
    lastProcessedNotificationIds.current.delete(id);

    try {
      const res = await server.delete(`/member/${user.id}/notification/${id}`);

      if (res.status === 200) {
        useAuthStore.getState().setAlert("알림이 삭제되었습니다.", "success");
      } else {
        setNotifications(originalNotifications);
        console.error("Failed to delete notification on server:", res);
        useAuthStore.getState().setAlert("알림 삭제에 실패했습니다.", "error");
      }
    } catch (error) {
      setNotifications(originalNotifications);
      console.error("Failed to delete notification:", error);
      useAuthStore.getState().setAlert("알림 삭제에 실패했습니다.", "error");
    }
  };

  const deleteAllNotifications = async () => {
    if (!user?.id || notifications.length === 0) return;

    const originalNotifications = [...notifications];
    setNotifications([]);
    lastProcessedNotificationIds.current.clear();
    lastAlertedNotificationId.current = null;

    try {
      const res = await server.delete(`/member/${user.id}/notifications`);

      if (res.status === 200) {
        useAuthStore
          .getState()
          .setAlert("모든 알림이 삭제되었습니다.", "success");
      } else {
        setNotifications(originalNotifications);
        console.error("Failed to delete all notifications on server:", res);
        useAuthStore
          .getState()
          .setAlert("알림 전체 삭제에 실패했습니다.", "error");
      }
    } catch (error) {
      setNotifications(originalNotifications);
      console.error("Failed to delete all notifications:", error);
      useAuthStore
        .getState()
        .setAlert("알림 전체 삭제에 실패했습니다.", "error");
    }
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    fetchInitialNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
