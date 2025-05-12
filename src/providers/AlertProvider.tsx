"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/auth/authStore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheckCircle, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default function AlertProvider() {
  const alert = useAuthStore((state) => state.alert);
  const clearAlert = useAuthStore((state) => state.clearAlert);
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    if (alert) {
      setAlertVisible(true);
      const timer = setTimeout(() => {
        setAlertVisible(false);
        setTimeout(() => {
          clearAlert();
        }, 300); // After fade out animation
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert, clearAlert]);

  // Get the appropriate styling based on alert type
  const getAlertStyle = () => {
    if (!alert) return {
      icon: faCheckCircle,
      bgColor: "",
      textColor: ""
    };
    
    switch (alert.type) {
      case "success":
        return {
          icon: faCheckCircle,
          bgColor: "bg-component-secondary-background border-green-500/50",
          textColor: "text-green-400"
        };
      case "error":
        return {
          icon: faExclamationTriangle,
          bgColor: "bg-component-secondary-background border-red-500/50",
          textColor: "text-red-400"
        };
      case "warning":
        return {
          icon: faExclamationTriangle,
          bgColor: "bg-component-secondary-background border-yellow-500/50",
          textColor: "text-yellow-400"
        };
      case "info":
        return {
          icon: faInfoCircle,
          bgColor: "bg-component-secondary-background border-blue-500/50",
          textColor: "text-blue-400"
        };
      default:
        return {
          icon: faCheckCircle,
          bgColor: "bg-component-secondary-background border-blue-500/50",
          textColor: "text-blue-400"
        };
    }
  };

  const alertStyle = getAlertStyle();

  return (
    <>
      {alert && (
        <div
          className={`fixed top-0 left-0 right-0 z-[10001] transition-all duration-300 ease-out ${
            alertVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          }`}
        >
          <div className="max-w-screen-md mx-auto px-4 py-3 mt-4">
            <div 
              className={`${alertStyle.bgColor} backdrop-blur-sm text-text-primary px-6 py-4 rounded-xl flex items-center justify-between shadow-xl border transition-all`}
            >
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={alertStyle.icon} className={`w-5 h-5 ${alertStyle.textColor}`} />
                <span className="text-text-primary font-medium">{alert.message}</span>
              </div>
              <button 
                onClick={() => setAlertVisible(false)} 
                className="text-text-secondary hover:text-text-primary transition-all duration-200"
              >
                <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 