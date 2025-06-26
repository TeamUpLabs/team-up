"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuthStore } from "@/auth/authStore"

export default function Hero() {
  const [isClient, setIsClient] = useState(false)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <section className="pt-36 pb-28 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
          개발자 <span className="text-purple-400 bg-point-color-purple bg-clip-text text-transparent">커뮤니티</span>의 <span className="text-green-400 bg-point-color-green bg-clip-text text-transparent">새로운 시작</span>
        </h1>
        <p className="text-xl text-text-secondary-color mb-12 max-w-2xl leading-relaxed">
          TeamUp은 개발자들이 함께 성장하고 협업하는 신뢰 기반 플랫폼입니다.
          코드를 공유하고, 지식을 나누며, 함께 미래를 만들어갑니다.
        </p>
        <div className="flex flex-wrap gap-5">
          {isClient && !isAuthenticated() && (
            <Link href="/signin" className="bg-point-color-purple px-8 py-3.5 rounded-md text-white font-medium hover:bg-point-color-purple-hover transition-all duration-300">
              가입하기
            </Link>
          )}
          <Link href="/about" className="bg-transparent border border-component-border px-8 py-3.5 rounded-md text-text-secondary-color font-medium hover:bg-white/5 transition-colors">
            더 알아보기
          </Link>
        </div>
      </div>
    </section>
  )
}