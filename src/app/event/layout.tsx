export default function EventLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-col min-h-screen bg-background">
      {children}
    </div>
  );
}