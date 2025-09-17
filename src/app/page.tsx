"use client"

import Header from "@/components/header"
import Hero from "@/components/hero"
import Stats from "@/components/stats"
import UserReview from "@/components/UserReview"
import Events from "@/components/events"
import Footer from "@/components/footer"

export default function Home() {;
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

      {/* User Review */}
      <UserReview />
      
      {/* Footer */}
      <Footer />
    </div>
  )
}