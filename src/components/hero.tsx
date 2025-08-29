"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuthStore } from "@/auth/authStore"
import { ArrowRight } from "flowbite-react-icons/outline"
import { Zap } from "lucide-react";
import Badge from "@/components/ui/Badge"

export default function Hero() {
  const [isClient, setIsClient] = useState(false)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <section className="max-w-7xl mx-auto pt-36 pb-28 px-6 relative overflow-hidden">
      <div className="mx-auto text-center relative">
        <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
          <span className="text-text-primary">개발자 </span>
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-green-400 bg-clip-text text-transparent">
            커뮤니티의
          </span>
          <br />
          <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            새로운 시작
          </span>
        </h1>
        <p className="text-xl font-semibold md:text-2xl text-text-primary mb-12 max-w-4xl mx-auto leading-relaxed">
          TeamUp은 개발자들이 함께 성장하고 협업하는 신뢰 기반 플랫폼입니다. <br />
          코드를 공유하고, 지식을 나누며, 함께 미래를 만들어갑니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isClient && !isAuthenticated() && (
            <Link href="/signin" className="flex w-full sm:w-fit justify-center group">
              <Badge
                content={
                  <span className="flex items-center gap-2 font-semibold">
                    <Zap className="w-5 h-5" />
                    지금 시작하기
                  </span>
                }
                color="purple"
                className="!px-10 !py-3 !font-semibold flex !w-full sm:!w-fit !justify-center"
                isHover
              />
            </Link>
          )}
          <Link href="/about" className="flex w-full sm:w-fit justify-center group">
            <Badge
              content={
                <span className="flex items-center gap-2 font-semibold">
                  더 알아보기
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              }
              color="indigo"
              className="!px-10 !py-3 !font-semibold flex !w-full sm:!w-fit !justify-center"
              isHover
            />
          </Link>
        </div>
      </div>
    </section>
  )
}