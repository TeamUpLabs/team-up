import Link from "next/link"
import Logo from "@/components/logo"

export default function Header() {
    return (
        <header className="fixed w-full backdrop-blur-md bg-background/70 z-40 border-b border-component-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="hidden md:flex space-x-10 text-sm font-medium">
            <Link href="/platform" className="hover:text-point-color-purple transition-colors duration-200">플랫폼</Link>
            <Link href="#" className="hover:text-point-color-purple transition-colors duration-200">커뮤니티</Link>
            <Link href="#" className="hover:text-point-color-purple transition-colors duration-200">멘토링</Link>
            <Link href="#" className="hover:text-point-color-purple transition-colors duration-200">이벤트</Link>
          </nav>
          <Link href="/signin" className="bg-point-color-purple hover:bg-point-color-purple-hover px-5 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-md shadow-point-color-purple/30">
            시작하기
          </Link>
        </div>
      </header>
    )
}