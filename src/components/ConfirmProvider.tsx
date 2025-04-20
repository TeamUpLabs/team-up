"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/auth/authStore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function ConfirmProvider() {
  const confirm = useAuthStore((state) => state.confirm);
  const clearConfirm = useAuthStore((state) => state.clearConfirm);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const TIMEOUT_DURATION = 5000; // 5 seconds timeout

  useEffect(() => {
    if (confirm) {
      setConfirmVisible(true);
      setProgress(100);

      const timer = setTimeout(() => {
        setConfirmVisible(false);
        setTimeout(() => {
          clearConfirm();
        }, 300); // After fade out animation
      }, TIMEOUT_DURATION);

      // Progress bar animation
      const startTime = Date.now();
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / TIMEOUT_DURATION) * 100);
        setProgress(remaining);

        if (remaining <= 0) {
          clearInterval(progressInterval);
        }
      }, 16); // ~60fps

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [confirm, clearConfirm]);

  const confirmStyle = {
    icon: faQuestion,
    bgColor: "bg-gray-900/95",
    borderColor: "border-indigo-500/20",
    textColor: "text-indigo-400"
  };

  const handleConfirmClose = () => {
    setConfirmVisible(false);
    setTimeout(() => {
      clearConfirm();
    }, 300);
  };

  return (
    <>
      {confirm && (
        <div
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${confirmVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
            }`}
        >
          <div className="max-w-screen-md mx-auto px-4 py-3 mt-4">
            <div
              className={`${confirmStyle.bgColor} ${confirmStyle.borderColor} backdrop-blur text-white px-6 py-4 rounded-lg shadow-xl border transition-all relative overflow-hidden`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <FontAwesomeIcon icon={confirmStyle.icon} className={`w-4 h-4 ${confirmStyle.textColor}`} />
                <span className="text-gray-100 font-medium">확인</span>
              </div>
              <p className="text-gray-300 mb-4 ml-1 text-sm">{confirm.message}</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleConfirmClose}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors duration-200 text-xs font-medium text-gray-300"
                >
                  <span className="flex items-center space-x-1.5">
                    <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                    <span>취소</span>
                  </span>
                </button>
                <button
                  onClick={() => {
                    if (confirm.onConfirm) confirm.onConfirm();
                    handleConfirmClose();
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors duration-200 text-xs font-medium"
                >
                  <span className="flex items-center space-x-1.5">
                    <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                    <span>확인</span>
                  </span>
                </button>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 h-0.5 bg-indigo-500/5 w-full">
                <div
                  className="h-full bg-indigo-500/40 transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
