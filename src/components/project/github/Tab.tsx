"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCodeBranch,
  faExclamation,
  faCodePullRequest,
  faCodeCommit,
  faChartColumn,
} from "@fortawesome/free-solid-svg-icons";
import { faFolder, faCircle, faBuilding } from "@fortawesome/free-regular-svg-icons";

interface TabProps {
  selectedTab: 'overview' | 'repo' | 'issue' | 'pr' | 'commit' | 'org' | 'analytics';
  setSelectedTab: (tab: TabProps["selectedTab"]) => void;
}

export default function Tab({ selectedTab, setSelectedTab }: TabProps) {
  const tabName = {
    overview: "개요",
    repo: "저장소",
    issue: "이슈",
    pr: "PR",
    commit: "커밋",
    org: "조직",
    analytics: "분석",
  };

  const tabIcon = {
    overview: faFolder,
    repo: faCodeBranch,
    issue: faExclamation,
    pr: faCodePullRequest,
    commit: faCodeCommit,
    org: faBuilding,
    analytics: faChartColumn,
  };

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
      className="relative flex items-center w-full bg-component-tertiary-background rounded-lg p-2 text-xs md:text-sm"
    >
      {/* Animated Slider */}
      <div
        className="absolute top-2 bottom-2 bg-component-background rounded-lg transition-all duration-300"
        style={{
          left: sliderStyle.left,
          width: sliderStyle.width,
        }}
      />

      {Object.entries(tabName).map(([key, value]) => (
        <div
          key={key}
          ref={(el) => {
            tabRefs.current[key] = el;
          }}
          onClick={() => setSelectedTab(key as TabProps["selectedTab"])}
          className={`
            relative z-10 flex items-center gap-1 w-full px-1.5 py-1 md:px-3 md:py-2 justify-center rounded-lg
            ${selectedTab === key ? "text-text-primary font-medium" : "text-text-secondary"}
            cursor-pointer
          `}
        >
          {key === "issue" ? (
            <span className="fa-layers">
              <FontAwesomeIcon icon={faCircle} className="text-text-primary" />
              <FontAwesomeIcon icon={faExclamation} className="text-text-primary" transform="shrink-6" />
            </span>
          ) : (
            <FontAwesomeIcon icon={tabIcon[key as keyof typeof tabIcon]} size="sm" />
          )}
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}