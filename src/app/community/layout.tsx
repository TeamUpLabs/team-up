"use client";

import { useState } from "react";
import Header from "@/components/community/Header";
import SideBar from "@/components/community/SideBar";

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <div className="flex min-h-screen bg-background">
      <SideBar isSidebarOpen={isSidebarOpen} />
      <div className={`flex-1 transition-all duration-300 ${!isSidebarOpen ? 'md:ml-80' : 'md:ml-0'}`}>
        <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}>
          {children}
        </Header>
      </div>
    </div>
  );
}