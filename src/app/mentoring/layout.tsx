import Header from "@/components/mentoring/Header";

export default function MentoringLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-col min-h-screen bg-background">
      <Header />
      <main className="max-w-5xl mx-auto py-10">
        {children}
      </main>
    </div>
  );
}