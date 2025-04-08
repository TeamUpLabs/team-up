import Link from "next/link"

export default function Header() {
    return (
        <header className="w-full backdrop-blur-md bg-(--color-background)/50 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="font-mono text-xl">
            <Link href="/">
              <span className="text-green-400">&lt;</span>
              <span className="text-purple-400">TeamUp</span>
              <span className="text-green-400">/&gt;</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <a href="#" className="hover:text-purple-400 transition-colors">플랫폼</a>
            <a href="#" className="hover:text-purple-400 transition-colors">커뮤니티</a>
            <a href="#" className="hover:text-purple-400 transition-colors">멘토링</a>
            <a href="#" className="hover:text-purple-400 transition-colors">이벤트</a>
          </nav>
          <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            시작하기
          </button>
        </div>
      </header>
    )
}