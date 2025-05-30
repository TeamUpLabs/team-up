"use client";

import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faBell, faMessage, faCalendarCheck, faUser, faComments } from '@fortawesome/free-solid-svg-icons';
import { useNotifications } from "@/providers/NotificationProvider";
import { Notification } from "@/types/Member";

// Internal component that uses hooks and will only render when inside NotificationProvider
function NotificationAlert() {
  const [newNotification, setNewNotification] = useState<Notification | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const { notifications } = useNotifications();
  const prevNotificationsRef = useRef<Notification[]>([]);

  useEffect(() => {
    // Only proceed if we have notifications
    if (!notifications || notifications.length === 0) return;
    
    // First-time initialization
    if (prevNotificationsRef.current.length === 0) {
      prevNotificationsRef.current = [...notifications];
      return;
    }
    
    // Check for new notifications by comparing with previous state
    const prevIds = new Set(prevNotificationsRef.current.map(n => n.id));
    const newNotifications = notifications.filter(n => !prevIds.has(n.id) && !n.isRead);
    
    // If we have new notifications, show the most recent one
    if (newNotifications.length > 0) {
      const latestNotification = newNotifications[0];
      setNewNotification(latestNotification);
      setAlertVisible(true);
      
      const timer = setTimeout(() => {
        setAlertVisible(false);
        setTimeout(() => {
          setNewNotification(null);
        }, 300); // After fade out animation
      }, 3000);
      
      // Update our reference list of notifications
      prevNotificationsRef.current = [...notifications];
      
      return () => clearTimeout(timer);
    }
    
    // Always update reference to latest notifications
    prevNotificationsRef.current = [...notifications];
  }, [notifications]);

  // Don't render anything if no notification to show
  if (!newNotification) return null;

  // Determine notification type icon and color
  const getNotificationStyle = () => {
    if (!newNotification?.type) {
      return {
        icon: faBell,
        borderColor: "border-blue-500/50",
        textColor: "text-blue-400"
      };
    }
    
    switch (newNotification.type) {
      case "message":
        return {
          icon: faMessage,
          borderColor: "border-green-500/50",
          textColor: "text-green-400"
        };
      case "task":
        return {
          icon: faCalendarCheck,
          borderColor: "border-yellow-500/50",
          textColor: "text-yellow-400"
        };
      case "chat":
        return {
          icon: faComments,
          borderColor: "border-purple-500/50",
          textColor: "text-purple-400"
        };
      case "scout":
        return {
          icon: faUser,
          borderColor: "border-pink-500/50",
          textColor: "text-pink-400"
        };
      default:
        return {
          icon: faBell,
          borderColor: "border-blue-500/50",
          textColor: "text-blue-400"
        };
    }
  };

  const notificationStyle = getNotificationStyle();

  return (
    <div
      className={`fixed top-0 right-0 z-[10001] transition-all duration-300 ease-out ${
        alertVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="max-w-md px-4 py-3">
        <div 
          className={`bg-component-secondary-background backdrop-blur-sm text-text-primary px-6 py-4 rounded-xl flex items-center justify-between shadow-xl border ${notificationStyle.borderColor} transition-all`}
        >
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon icon={notificationStyle.icon} className={`w-5 h-5 ${notificationStyle.textColor}`} />
            <div className="flex flex-col">
              <span className="text-text-primary font-medium">{newNotification.title}</span>
              <span className="text-text-secondary text-sm">{newNotification.message}</span>
            </div>
          </div>
          <button 
            onClick={() => setAlertVisible(false)} 
            className="text-text-secondary hover:text-text-primary transition-all duration-200 ml-4"
          >
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Main component that catches errors
export default function NotificationAlertProvider() {
  try {
    return <NotificationAlert />;
  } catch {
    console.error("NotificationAlertProvider must be used within a NotificationProvider");
    return null;
  }
}
