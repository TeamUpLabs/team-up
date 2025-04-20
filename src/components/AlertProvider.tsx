"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/auth/authStore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

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
      }, 5000);
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
    <>
      {alert && (
        <div
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
            alertVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
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
                onClick={() => setAlertVisible(false)} 
                className="text-gray-400 hover:text-white transition-all duration-200 hover:rotate-90"
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