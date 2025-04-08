import Header from "@/components/header"
import Hero from "@/components/hero"
import Stats from "@/components/stats"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero */}
      <Hero />

      {/* Stats */}
      <Stats />
    </div>
  )
}