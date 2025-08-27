"use client";

import { useState } from "react";
import Header from "@/components/community/Header";

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  const [isSiderbarOpen, setIsSiderbarOpen] = useState(false);
    return <div>
      <Header isSidebarOpen={isSiderbarOpen} setIsSidebarOpen={setIsSiderbarOpen}>
        {children}
      </Header>
    </div>;
}