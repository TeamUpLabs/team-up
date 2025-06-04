import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  tooltipClassName?: string;
  placement?: TooltipPlacement;
  offset?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  className,
  tooltipClassName = '',
  placement = 'top',
  offset = 4,
}) => {
  const [isVisibleIntent, setIsVisibleIntent] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const tooltipId = useId();

  const handleMouseEnter = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setIsVisibleIntent(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setIsVisibleIntent(false);
  }, []);

  useEffect(() => {
    if (isVisibleIntent) {
      setIsMounted(true);
      setOpacity(1);
    } else {
      setOpacity(0);
      setIsMounted(false);
    }
  }, [isVisibleIntent]);

  useEffect(() => {
    if (isMounted && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      let newTop = 0;
      let newLeft = 0;

      switch (placement) {
        case 'bottom':
          newTop = triggerRect.bottom + window.scrollY;
          newLeft = triggerRect.left + window.scrollX + triggerRect.width / 2;
          break;
        case 'left':
          newTop = triggerRect.top + window.scrollY + triggerRect.height / 2;
          newLeft = triggerRect.left + window.scrollX;
          break;
        case 'right':
          newTop = triggerRect.top + window.scrollY + triggerRect.height / 2;
          newLeft = triggerRect.right + window.scrollX;
          break;
        case 'top':
        default:
          newTop = triggerRect.top + window.scrollY;
          newLeft = triggerRect.left + window.scrollX + triggerRect.width / 2;
          break;
      }
      setPosition({ top: newTop, left: newLeft });
    }
  }, [isMounted, placement, children, content, isVisibleIntent]);

  const getTooltipStyles = useCallback(() => {
    const arrowSize = 8;
    const totalOffset = (arrowSize / 2) + offset;
    let transform = '';
    switch (placement) {
      case 'top':
        transform = `translate(-50%, calc(-100% - ${totalOffset}px))`;
        break;
      case 'bottom':
        transform = `translate(-50%, ${totalOffset}px)`;
        break;
      case 'left':
        transform = `translate(calc(-100% - ${totalOffset}px), -50%)`;
        break;
      case 'right':
        transform = `translate(${totalOffset}px, -50%)`;
        break;
    }
    return {
      position: 'absolute',
      top: `${position.top}px`,
      left: `${position.left}px`,
      transform,
      zIndex: 50000,
      opacity: opacity,
    } as React.CSSProperties;
  }, [placement, position.top, position.left, offset, opacity]);

  const getArrowStyles = useCallback(() => {
    const arrowSize = 8;
    const arrowVisualOffset = -(arrowSize / 2) + 'px';
    const styles: React.CSSProperties = {
      position: 'absolute',
      width: `${arrowSize}px`,
      height: `${arrowSize}px`,
      backgroundColor: 'inherit',
      transformOrigin: 'center center',
    };
    switch (placement) {
      case 'top':
        styles.bottom = arrowVisualOffset;
        styles.left = '50%';
        styles.transform = 'translateX(-50%) rotate(45deg)';
        break;
      case 'bottom':
        styles.top = arrowVisualOffset;
        styles.left = '50%';
        styles.transform = 'translateX(-50%) rotate(45deg)';
        break;
      case 'left':
        styles.right = arrowVisualOffset;
        styles.top = '50%';
        styles.transform = 'translateY(-50%) rotate(45deg)';
        break;
      case 'right':
        styles.left = arrowVisualOffset;
        styles.top = '50%';
        styles.transform = 'translateY(-50%) rotate(45deg)';
        break;
    }
    return styles;
  }, [placement]);

  return (
    <div 
      ref={triggerRef}
      className={className} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      aria-describedby={isMounted ? tooltipId : undefined}
    >
      {children}
      {isMounted && typeof document !== 'undefined' && createPortal(
        <div 
          id={tooltipId}
          role="tooltip"
          ref={tooltipRef}
          style={getTooltipStyles()}
          className={`px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap ${tooltipClassName}`}
        >
          {content}
          <div style={getArrowStyles()} className="bg-black/80"></div> {/* Arrow shares bg color */}
        </div>,
        document.body
      )}
    </div>
  );

};

export default Tooltip;