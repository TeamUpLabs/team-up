"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/community/Header";
import SideBar from "@/components/community/SideBar";
import { CommunityProvider } from "@/contexts/CommunityContext";

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get('search') || '';

  const handleSearchChange = useCallback((query: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  return (
    <CommunityProvider>
      <div className="flex min-h-screen bg-background">
        <SideBar 
          isSidebarOpen={isSidebarOpen} 
          onTopicClick={(topic) => handleSearchChange(topic)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
        <div className={`flex-1 transition-all duration-300 ${!isSidebarOpen ? 'md:ml-80' : 'md:ml-0'}`}>
          <Header 
            isSidebarOpen={isSidebarOpen} 
            setIsSidebarOpen={setIsSidebarOpen}
            searchQuery={searchQuery}
            onSearchQueryChange={handleSearchChange}
            isSearchOpen={isSearchOpen}
            onSearchOpenChange={setIsSearchOpen}
          >
            {children}
          </Header>
        </div>
      </div>
    </CommunityProvider>
  );
}