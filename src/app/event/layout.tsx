"use client";

import Header from "@/components/event/Header";

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-col min-h-screen bg-background">
      <Header />
      <main className="max-w-5xl mx-auto py-10">
        {children}
      </main>
    </div>
  );
}