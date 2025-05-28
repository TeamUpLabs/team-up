"use client";

import { useEffect, createContext, useContext, useState, useRef } from "react";
import { useAuthStore } from "@/auth/authStore";
import { Notification } from "@/types/Member";
import { server } from "@/auth/server";

// Create context for notifications
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null); // Add a ref to hold the EventSource instance
  
  useEffect(() => {
    // Initialize notifications from user state
    if (user?.notification) {
      setNotifications(user.notification);
    }
  }, [user?.notification]);
  
  // Setup SSE connection when user is authenticated
  useEffect(() => {
    if (!user?.id) {
      // If there's an existing connection, close it when the user logs out or is not available
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    const connect = () => {
      // Close any existing connection before creating a new one
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const newEventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/member/${user.id}/notifications/sse`);
      eventSourceRef.current = newEventSource;

      newEventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data) {
            if (Array.isArray(data)) {
              // Full notifications refresh
              setNotifications(data);
              console.log("Full notifications refresh:", data);
            } else {
              // Single notification, add it to existing ones
              setNotifications(prev => [data, ...prev]);
              
              // NotificationAlertProvider will handle showing the toast/alert
            }
          }
        } catch (error) {
          console.error("Error parsing notification data:", error);
        }
      };
      
      newEventSource.onerror = (event) => {
        console.error("SSE connection error:", event);
        newEventSource.close(); // Close the failed connection

        // Attempt to reconnect only if the current eventSource is the one that failed
        if (eventSourceRef.current === newEventSource) {
            eventSourceRef.current = null; // Clear the ref before attempting to reconnect
            console.log("Attempting to reconnect to notification stream in 5 seconds...");
            setTimeout(() => {
            if (user?.id) { // Check if user is still authenticated before reconnecting
              connect();
            }
            }, 5000);
        }
      };
    };

    connect(); // Initial connection

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [user?.id]);
  
  // Calculate unread notification count
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // Mark a notification as read
  const markAsRead = async (id: number) => {
    if (!user?.id) return;
    
    try {
      const res = await server.put(`/member/${user.id}/notification/${id}`, {
        isRead: true
      });
      
      if (res.status === 200) {
        // Update local state
        setNotifications(notifications.map(notification =>
          notification.id === id ? { ...notification, isRead: true } : notification
        ));
      }
    } catch (error) {
      console.error("Failed to update notification:", error);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user?.id) return;
    
    try {
      const unreadNotifications = notifications.filter(notification => !notification.isRead);
      
      for (const notification of unreadNotifications) {
        await markAsRead(notification.id);
      }
      
      setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
    } catch (error) {
      console.error("Failed to update all notifications:", error);
    }
  };
  
  // Delete a notification
  const deleteNotification = async (id: number) => {
    if (!user?.id) return;
    
    try {
      const res = await server.delete(`/member/${user.id}/notification/${id}`);
      
      if (res.status === 200) {
        setNotifications(notifications.filter(n => n.id !== id));
        useAuthStore.getState().setAlert("알림이 삭제되었습니다.", "success");
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
      useAuthStore.getState().setAlert("알림 삭제에 실패했습니다.", "error");
    }
  };
  
  // Delete all notifications
  const deleteAllNotifications = async () => {
    if (!user?.id || notifications.length === 0) return;
    
    try {
      const res = await server.delete(`/member/${user.id}/notifications`);
      
      if (res.status === 200) {
        setNotifications([]);
        useAuthStore.getState().setAlert("모든 알림이 삭제되었습니다.", "success");
      }
    } catch (error) {
      console.error("Failed to delete all notifications:", error);
      useAuthStore.getState().setAlert("알림 삭제에 실패했습니다.", "error");
    }
  };
  
  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
} 