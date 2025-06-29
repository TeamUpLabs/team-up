"use client";

import Link from "next/link"
import { useState } from "react"
import { Logo } from "@/components/logo";
import { Github } from "flowbite-react-icons/solid";
import { Globe } from "flowbite-react-icons/outline";

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (openSection === section) {
      setOpenSection(null);
    } else {
      setOpenSection(section);
    }
  };

  return (
    <footer className="py-8 sm:py-12 md:py-16 bg-background border-t border-component-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8 md:mb-12">
          <div className="col-span-1 xs:col-span-2 md:col-span-1 lg:col-span-2 self-center text-center md:text-left ">
            <Logo className="mb-4" />
            <p className="text-text-secondary-color text-sm mb-4">
              개발자들을 위한 신뢰 기반 협업 플랫폼.<br />
              함께 만들어가는 더 나은 개발 문화.
            </p>
            <div className="flex space-x-4 justify-self-center md:justify-self-start">
              <Link href="https://github.com/TeamUpLabs/team-up" target="_blank" className="text-text-secondary-color hover:text-text-primary-color transition-colors p-1">
                <Github />
              </Link>
              <Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors p-1">
                <Globe />
              </Link>
            </div>
          </div>

          {/* 모바일에서는 아코디언, 데스크탑에서는 일반 메뉴 */}
          <div className="mt-4 xs:mt-0 md:hidden">
            <div
              className="text-sm font-semibold text-text-secondary-color uppercase tracking-wider py-3 flex justify-between items-center cursor-pointer border-b border-component-border"
              onClick={() => toggleSection('platform')}
            >
              플랫폼
              <svg
                className={`w-4 h-4 transition-transform ${openSection === 'platform' ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {openSection === 'platform' && (
              <ul className="space-y-3 text-sm py-3">
                <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">기능</Link></li>
                <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">협업 도구</Link></li>
                <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">통합</Link></li>
                <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">API</Link></li>
              </ul>
            )}

            <div
              className="text-sm font-semibold text-text-secondary-color uppercase tracking-wider py-3 flex justify-between items-center cursor-pointer border-b border-component-border"
              onClick={() => toggleSection('community')}
            >
              커뮤니티
              <svg
                className={`w-4 h-4 transition-transform ${openSection === 'community' ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {openSection === 'community' && (
              <ul className="space-y-3 text-sm py-3">
                <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">포럼</Link></li>
                <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">이벤트</Link></li>
                <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">밋업</Link></li>
                <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">오픈소스</Link></li>
              </ul>
            )}

            <div
              className="text-sm font-semibold text-text-secondary-color uppercase tracking-wider py-3 flex justify-between items-center cursor-pointer border-b border-component-border"
              onClick={() => toggleSection('company')}
            >
              회사
              <svg
                className={`w-4 h-4 transition-transform ${openSection === 'company' ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {openSection === 'company' && (
              <ul className="space-y-3 text-sm py-3">
                <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">소개</Link></li>
                <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">블로그</Link></li>
                <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">채용</Link></li>
                <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">문의</Link></li>
              </ul>
            )}
          </div>

          {/* 데스크탑 메뉴 */}
          <div className="hidden md:block">
            <h3 className="text-sm font-semibold text-text-secondary-color uppercase tracking-wider mb-4">플랫폼</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">기능</Link></li>
              <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">협업 도구</Link></li>
              <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">통합</Link></li>
              <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">API</Link></li>
            </ul>
          </div>

          <div className="hidden md:block">
            <h3 className="text-sm font-semibold text-text-secondary-color uppercase tracking-wider mb-4">커뮤니티</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">포럼</Link></li>
              <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">이벤트</Link></li>
              <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">밋업</Link></li>
              <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">오픈소스</Link></li>
            </ul>
          </div>

          <div className="hidden md:block">
            <h3 className="text-sm font-semibold text-text-secondary-color uppercase tracking-wider mb-4">회사</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">소개</Link></li>
              <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">블로그</Link></li>
              <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">채용</Link></li>
              <li><Link href="#" className="text-text-secondary-color hover:text-text-primary-color transition-colors block py-1">문의</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-4 sm:pt-8 md:border-t border-component-border flex flex-col sm:flex-row justify-between items-center">
          <p className="text-text-secondary-color text-sm">© {new Date().getFullYear()} TeamUp. All rights reserved.</p>
          <div className="flex space-x-4 sm:space-x-6 mt-4 sm:mt-0">
            <Link href="#" className="text-xs text-text-secondary-color hover:text-text-primary-color transition-colors py-1">이용약관</Link>
            <Link href="#" className="text-xs text-text-secondary-color hover:text-text-primary-color transition-colors py-1">개인정보처리방침</Link>
            <Link href="#" className="text-xs text-text-secondary-color hover:text-text-primary-color transition-colors py-1">쿠키 정책</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}