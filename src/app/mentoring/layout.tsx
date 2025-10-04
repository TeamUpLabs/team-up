"use client";

import Header from "@/components/mentoring/Header";
import { MentoringProvider } from "@/contexts/MentoringContext";

export default function MentoringLayout({ children }: { children: React.ReactNode }) {
  return (
    <MentoringProvider>
      <div className="flex-col min-h-screen bg-background">
        <Header />
        <main className="max-w-5xl mx-auto py-10">
          {children}
        </main>
      </div>
    </MentoringProvider>
  );
}