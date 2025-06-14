"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/auth/authStore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import SubmitBtn from "@/components/ui/button/SubmitBtn";
import CancelBtn from "@/components/ui/button/CancelBtn";

export default function ConfirmProvider() {
  const confirm = useAuthStore((state) => state.confirm);
  const clearConfirm = useAuthStore((state) => state.clearConfirm);
  const [progress, setProgress] = useState(100);
  const TIMEOUT_DURATION = 5000; // 5 seconds timeout
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (confirm) {
      setProgress(100);

      const timer = setTimeout(() => {
        // This will trigger the exit animation in AnimatePresence
        clearConfirm();
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

  const handleConfirm = () => {
    setSubmitStatus('submitting');
    if (confirm?.onConfirm) {
      confirm.onConfirm();
      setSubmitStatus('success');
    } else {
      setSubmitStatus('error');
    }
    clearConfirm();
  };

  const handleCancel = () => {
    clearConfirm();
  };

  return (
    <AnimatePresence>
      {confirm && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="fixed top-5 left-1/2 -translate-x-1/2 w-full max-w-lg z-[10001]"
        >
          <div
            className="relative bg-component-background rounded-2xl shadow-lg border border-component-secondary-border overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCircleCheck} className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-text-primary">
                    작업 확인
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {confirm.message}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex justify-end items-center gap-3">
                <CancelBtn 
                  handleCancel={handleCancel}
                  className="!text-sm"
                  withIcon
                />
                <SubmitBtn
                  onClick={handleConfirm}
                  className="!text-sm !bg-blue-600 hover:!bg-blue-700"
                  submitStatus={submitStatus}
                  buttonText="확인"
                  successText="완료"
                  errorText="오류"
                  withIcon
                />
              </div>
            </div>

            {/* Progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-blue-500"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

}
