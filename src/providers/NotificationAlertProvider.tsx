"use client";

import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faBell,
  faMessage,
  faCalendarCheck,
  faUser,
  faComments,
  faInfoCircle,
  faExclamationTriangle,
  faFlag,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "@/auth/authStore";
import { Notification, NotificationAlertType } from "@/types/Notification";

export type AlertType = NotificationAlertType | "success" | "error" | "info_general" | undefined;

interface AlertContent {
  message: Pick<Notification, "id" | "title" | "message">;
  type: AlertType;
}

function NotificationAlert() {
  const notificationAlertFromStore = useAuthStore(
    (state) => state.notificationAlert
  );
  const clearNotificationAlert = useAuthStore(
    (state) => state.clearNotificationAlert
  );

  const [activeAlert, setActiveAlert] = useState<AlertContent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const autoDismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const postDismissClearTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearRunningTimers = () => {
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = null;
    }
    if (postDismissClearTimerRef.current) {
      clearTimeout(postDismissClearTimerRef.current);
      postDismissClearTimerRef.current = null;
    }
  };

  useEffect(() => {
    clearRunningTimers();

    if (notificationAlertFromStore && notificationAlertFromStore.message) {
      if (!activeAlert || activeAlert.message.id !== notificationAlertFromStore.message.id || activeAlert.type !== notificationAlertFromStore.type) {
        setActiveAlert(notificationAlertFromStore);
        setIsVisible(true);

        autoDismissTimerRef.current = setTimeout(() => {
          setIsVisible(false);
          postDismissClearTimerRef.current = setTimeout(() => {
            const currentStoreAlert = useAuthStore.getState().notificationAlert;
            if (
              notificationAlertFromStore &&
              currentStoreAlert &&
              currentStoreAlert.message.id === notificationAlertFromStore.message.id
            ) {
              clearNotificationAlert();
            }
            setActiveAlert(null);
          }, 300);
        }, 3000);
      }
    } else if (!notificationAlertFromStore && activeAlert) {
        setIsVisible(false);
        postDismissClearTimerRef.current = setTimeout(() => {
            setActiveAlert(null);
        }, 300);
    }

    return clearRunningTimers;
  }, [
    notificationAlertFromStore,
    clearNotificationAlert,
    activeAlert
  ]);

  const handleManualClose = () => {
    clearRunningTimers();
    setIsVisible(false);

    postDismissClearTimerRef.current = setTimeout(() => {
      const currentStoreAlert = useAuthStore.getState().notificationAlert;
      if (
        activeAlert && 
        notificationAlertFromStore &&
        currentStoreAlert &&
        currentStoreAlert.message.id === notificationAlertFromStore.message.id
      ) {
        clearNotificationAlert(); 
      }
      setActiveAlert(null);
    }, 300);
  };

  if (!activeAlert || !activeAlert.message) {
    return null;
  }

  const getNotificationStyle = (type: AlertType) => {
    switch (type) {
      case "message":
        return {
          icon: faMessage,
          borderColor: "border-blue-500/50",
          textColor: "text-blue-400",
        };
      case "task":
        return {
          icon: faCalendarCheck,
          borderColor: "border-yellow-500/50",
          textColor: "text-yellow-400",
        };
      case "chat":
        return {
          icon: faComments,
          borderColor: "border-purple-500/50",
          textColor: "text-purple-400",
        };
      case "scout":
        return {
          icon: faUser,
          borderColor: "border-pink-500/50",
          textColor: "text-pink-400",
        };
      case "info":
        return {
          icon: faInfoCircle,
          borderColor: "border-sky-500/50",
          textColor: "text-sky-400",
        };
      case "milestone":
        return {
          icon: faFlag,
          borderColor: "border-indigo-500/50",
          textColor: "text-indigo-400",
        };
      case "success":
        return {
          icon: faCheckCircle,
          borderColor: "border-green-500/50",
          textColor: "text-green-400",
        };
      case "error":
        return {
          icon: faExclamationTriangle,
          borderColor: "border-red-500/50",
          textColor: "text-red-400",
        };
      case "info_general":
         return {
          icon: faInfoCircle,
          borderColor: "border-gray-500/50",
          textColor: "text-gray-400",
        };
      default:
        return {
          icon: faBell,
          borderColor: "border-gray-400/50",
          textColor: "text-gray-300",
        };
    }
  };

  const notificationStyle = getNotificationStyle(activeAlert.type);

  return (
    <div
      className={`fixed top-5 right-2 z-[10001] transition-all duration-300 ease-out transform \
        ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-sm w-full px-4 py-3">
        <div
          className={`bg-component-background backdrop-blur-md text-text-primary px-5 py-3.5 rounded-xl flex items-center justify-between shadow-2xl border ${notificationStyle.borderColor} transition-all`}
        >
          <div className="flex items-center space-x-3.5">
            <FontAwesomeIcon
              icon={notificationStyle.icon}
              className={`w-5 h-5 ${notificationStyle.textColor}`}
              aria-hidden="true"
            />
            <div className="flex flex-col">
              <span className="text-text-primary font-semibold text-sm leading-tight">
                {activeAlert.message.title}
              </span>
              {activeAlert.message.message && (
                <span className="text-text-secondary text-xs leading-tight">
                  {activeAlert.message.message}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleManualClose}
            className="text-text-secondary hover:text-text-primary transition-all duration-200 ml-4 cursor-pointer"
            aria-label="알림 닫기"
          >
            <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NotificationAlertProvider() {
  return <NotificationAlert />;
}
