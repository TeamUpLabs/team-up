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
    bgColor: "bg-slate-900/85",
    borderColor: "border-indigo-400/10",
    textColor: "text-indigo-300"
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
          <div className="max-w-screen-md mx-auto px-4 py-2 mt-2">
            <div
              className={`${confirmStyle.bgColor} ${confirmStyle.borderColor} backdrop-blur-sm text-white px-4 py-3 rounded-md shadow-md border transition-all relative overflow-hidden`}
            >
              <div className="flex items-center space-x-2 mb-3">
                <FontAwesomeIcon icon={confirmStyle.icon} className={`w-3 h-3 ${confirmStyle.textColor}`} />
                <span className="text-gray-50 text-sm font-medium">확인</span>
              </div>
              <p className="text-gray-200 mb-3.5 text-sm">{confirm.message}</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleConfirmClose}
                  className="px-3 py-1 bg-gray-800/60 hover:bg-gray-700/80 rounded text-xs font-medium text-gray-300 transition-colors duration-150"
                >
                  <span className="flex items-center space-x-1">
                    <FontAwesomeIcon icon={faTimes} className="w-2.5 h-2.5" />
                    <span>취소</span>
                  </span>
                </button>
                <button
                  onClick={() => {
                    if (confirm.onConfirm) confirm.onConfirm();
                    handleConfirmClose();
                  }}
                  className="px-3 py-1 bg-indigo-500/90 hover:bg-indigo-500 rounded text-xs font-medium text-white transition-colors duration-150"
                >
                  <span className="flex items-center space-x-1">
                    <FontAwesomeIcon icon={faCheck} className="w-2.5 h-2.5" />
                    <span>확인</span>
                  </span>
                </button>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 h-0.5 w-full">
                <div
                  className="h-full bg-indigo-300/20 transition-all duration-100 ease-linear"
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
