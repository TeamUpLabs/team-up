import Header from "@/components/header"
import Hero from "@/components/hero"
import Stats from "@/components/stats"
import Events from "@/components/events"

export default function Home() {
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
    </div>
  )
}