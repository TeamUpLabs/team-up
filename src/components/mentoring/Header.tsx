"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Search from "@/components/ui/Search";
import UserDropdown from "@/components/platform/UserDropdown";
import { Home, UserRoundPlus } from "lucide-react";
import SlideingMenu, { IconProps } from "@/components/ui/SlideingMenu";
import Badge from "@/components/ui/Badge";

interface HeaderProps {
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  isSearchOpen?: boolean;
  onSearchOpenChange?: (isOpen: boolean) => void;
}

const icons: IconProps[] = [
  {
    icon: <Home className="w-5 h-5" />,
    label: "Home",
    href: "/",
  }
]

export default function Header({
  searchQuery = '',
  onSearchQueryChange = () => { },
  isSearchOpen: propIsSearchOpen = false,
  onSearchOpenChange: setPropIsSearchOpen = () => { }
}: HeaderProps) {
  const [localIsSearchOpen, setLocalIsSearchOpen] = useState(propIsSearchOpen);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with prop
  useEffect(() => {
    setLocalIsSearchOpen(propIsSearchOpen);
  }, [propIsSearchOpen]);

  // Sync search query with prop
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (query: string) => {
    setLocalSearchQuery(query);
    onSearchQueryChange(query);
  };

  const handleSearchOpenChange = useCallback((isOpen: boolean) => {
    setLocalIsSearchOpen(isOpen);
    setPropIsSearchOpen(isOpen);
  }, [setPropIsSearchOpen]);

  // Handle keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not in an input field and '/' is pressed
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleSearchOpenChange(true);
        // Use setTimeout to ensure the input is rendered before focusing
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
      // Close search on Escape key
      if (e.key === 'Escape' && localIsSearchOpen) {
        e.preventDefault();
        handleSearchOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [localIsSearchOpen, handleSearchOpenChange]);

  return (
    <div className="w-full">
      <header className="sticky top-0 z-10 bg-component-background min-h-10 border-b border-component-border">
        <div className="px-3 py-2 flex items-center gap-3 w-full justify-between">
          <div className="flex items-center">
            <SlideingMenu icons={icons} />
          </div>

          {localIsSearchOpen && (
            <div className="flex-1">
              <Search
                placeholder="내용, 태그, 작성자를 검색하세요."
                searchQuery={localSearchQuery}
                setSearchQuery={handleSearchChange}
                inputRef={inputRef}
                autoFocus
              />
            </div>
          )}
          <div className="flex items-center gap-6">
            <Badge
              content={
                <div className="flex items-center gap-2">
                  <UserRoundPlus className="w-4 h-4" />
                  <span>멘토 등록하기</span>
                </div>
              }
              color="black"
              className="!px-3 !py-1 cursor-pointer active:scale-95"
            />
            <UserDropdown />
          </div>
        </div>
      </header>
    </div>
  );
}