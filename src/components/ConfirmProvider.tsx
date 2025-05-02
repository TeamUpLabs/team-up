"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/auth/authStore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

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
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
            confirmVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
            }`}
        >
          <div className="max-w-2xl mx-auto px-4 py-3 mt-4">
            <div
              className="bg-component-background border-0 rounded-xl shadow-lg backdrop-blur-xl transition-all relative overflow-hidden"
            >
              <div className="p-5">
                <h3 className="text-sm font-medium text-text-primary mb-3 flex items-center">
                  <FontAwesomeIcon icon={faCircleQuestion} className="w-4 h-4 mr-2 text-emerald-400" />
                  확인
                </h3>
                <p className="text-text-primary text-sm mb-5">{confirm.message}</p>
                
                <div className="flex justify-end space-x-3">
                <button
                  onClick={handleConfirmClose}
                    className="px-4 py-2 text-xs font-medium text-white bg-cancel-button-background hover:bg-cancel-button-background-hover rounded-lg transition-colors duration-150 flex items-center"
                  >
                    <FontAwesomeIcon icon={faTimes} className="w-3 h-3 mr-1.5" />
                    취소
                </button>
                <button
                  onClick={() => {
                    if (confirm.onConfirm) confirm.onConfirm();
                    handleConfirmClose();
                  }}
                    className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors duration-150 flex items-center"
                  >
                    <FontAwesomeIcon icon={faCheck} className="w-3 h-3 mr-1.5" />
                    확인
                </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 h-1 w-full bg-slate-800">
                <div
                  className="h-full bg-emerald-400 transition-all duration-100 ease-linear"
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
