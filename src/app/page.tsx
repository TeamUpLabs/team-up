"use client"

import Header from "@/components/header"
import Hero from "@/components/hero"
import Stats from "@/components/stats"
import Events from "@/components/events"
import Footer from "@/components/footer"
import { useAuthStore } from "@/auth/authStore";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated()) {
      redirect("/platform");
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero */}
      <Hero />

      {/* Stats */}
      <Stats />

      {/* Events */}
      <Events />

      {/* Footer */}
      <Footer />
    </div>
  )
}