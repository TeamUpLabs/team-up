"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ModalTempleteProps {
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  zIndex?: number;
}

export default function ModalTemplete({ header, children, footer, isOpen, onClose, zIndex }: ModalTempleteProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle mount/unmount with animation
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      const timer = setTimeout(() => {
        setIsVisible(true);
        document.body.style.overflow = 'hidden';
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 300); // Match this with the exit animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Don't render anything if not mounted
  if (!isMounted && !isOpen) return null;

  return (
    <AnimatePresence mode="wait" onExitComplete={onClose}>
      <div className="fixed inset-0 z-20" onClick={onClose}>
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        />

        {/* Modal Panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              className={`w-full max-w-2xl overflow-hidden rounded-xl bg-component-background backdrop-blur-sm text-left align-middle shadow-xl border border-component-border flex flex-col max-h-[90vh] z-${zIndex}`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.95,
                y: isVisible ? 0 : 20
              }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
                duration: 0.3
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Section */}
              <div className="flex justify-between gap-3 items-start p-6 pb-2">
                <div className="w-full">
                  {header}
                </div>
                <button
                  onClick={onClose}
                  className="text-text-secondary hover:text-text-primary transition-all"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>

              {/* Scrollable Content Section */}
              <div className="flex-1 overflow-y-auto px-6">
                <div className="space-y-6">
                  {children}
                </div>
              </div>

              {/* Footer Section - Fixed at bottom */}
              {footer && (
                <div className="pt-4 pb-6 px-6">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatePresence >
  )
}