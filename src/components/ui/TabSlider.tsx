"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface TabSliderProps {
  tabs: Record<string, string | { label: string; count?: number }>; // key: tab value, value: display name or { label: string; count?: number }
  selectedTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
  sliderClassName?: string;
  fullWidth?: boolean;
}

export default function TabSlider({
  tabs,
  selectedTab,
  onTabChange,
  className = "",
  sliderClassName = "bg-component-background",
  fullWidth = false,
}: TabSliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });

  const updateSlider = useCallback(() => {
    const selectedEl = tabRefs.current[selectedTab];
    if (selectedEl) {
      const { offsetLeft, offsetWidth } = selectedEl;
      setSliderStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [selectedTab]);

  useEffect(() => {
    const timer = setTimeout(updateSlider, 0);

    const container = containerRef.current;
    if (!container) return () => clearTimeout(timer);

    const resizeObserver = new ResizeObserver(() => {
      updateSlider();
    });
    resizeObserver.observe(container);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [selectedTab, updateSlider]);

  return (
    <div
      ref={containerRef}
      className={`relative flex gap-2 items-center ${fullWidth ? "w-full" : "w-fit"} bg-component-tertiary-background rounded-lg p-1 text-xs md:text-sm ${className}`}
    >
      {/* Animated Slider */}
      <div
        className={`absolute top-1 bottom-1 rounded-lg transition-all duration-300 ${sliderClassName}`}
        style={{
          left: sliderStyle.left,
          width: sliderStyle.width,
        }}
      />

      {Object.entries(tabs).map(([key, value]) => {
        const label = typeof value === 'string' ? value : value.label;
        const count = typeof value === 'object' ? value.count : undefined;
        
        return (
          <div
            key={key}
            ref={(el) => {
              tabRefs.current[key] = el;
            }}
            onClick={() => onTabChange(key)}
            className={`
              relative flex ${fullWidth ? "w-full" : "w-fit"} items-center justify-center px-6 py-2 gap-1 font-semibold
              ${
                selectedTab === key
                  ? "text-text-primary"
                  : "text-text-secondary hover:bg-component-background/50 hover:text-text-primary"
              }
              cursor-pointer rounded-md transition-colors duration-200
            `}
          >
            <span className="flex-shrink-0">{label}</span>
            {count !== undefined && (
              <span className="text-xs text-text-secondary">
                ({count})
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
