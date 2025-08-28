"use client";

import { useState } from "react";
import Header from "@/components/community/Header";
import SideBar from "@/components/community/SideBar";

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  const [isSiderbarOpen, setIsSiderbarOpen] = useState(false);
    return <div>
      <SideBar isSidebarOpen={isSiderbarOpen} />
      <Header isSidebarOpen={isSiderbarOpen} setIsSidebarOpen={setIsSiderbarOpen}>
        {children}
      </Header>
    </div>;
}