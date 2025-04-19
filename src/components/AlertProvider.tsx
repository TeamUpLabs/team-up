"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/auth/authStore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export default function AlertProvider() {
  const alert = useAuthStore((state) => state.alert);
  const clearAlert = useAuthStore((state) => state.clearAlert);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (alert) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          clearAlert();
        }, 300); // After fade out animation
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert, clearAlert]);

  if (!alert) return null;

  // Get the appropriate styling based on alert type
  const getAlertStyle = () => {
    switch (alert.type) {
      case "success":
        return {
          icon: faCheckCircle,
          bgColor: "bg-gray-800/95 border-green-500/50",
          textColor: "text-green-400"
        };
      case "error":
        return {
          icon: faExclamationTriangle,
          bgColor: "bg-gray-800/95 border-red-500/50",
          textColor: "text-red-400"
        };
      default:
        return {
          icon: faCheckCircle,
          bgColor: "bg-gray-800/95 border-blue-500/50",
          textColor: "text-blue-400"
        };
    }
  };

  const alertStyle = getAlertStyle();

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="max-w-screen-md mx-auto px-4 py-3 mt-4">
        <div 
          className={`${alertStyle.bgColor} backdrop-blur-sm text-white px-6 py-4 rounded-xl flex items-center justify-between shadow-xl border transition-all`}
        >
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon icon={alertStyle.icon} className={`w-5 h-5 ${alertStyle.textColor}`} />
            <span className="text-gray-100 font-medium">{alert.message}</span>
          </div>
          <button 
            onClick={() => setVisible(false)} 
            className="text-gray-400 hover:text-white transition-all duration-200"
          >
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 