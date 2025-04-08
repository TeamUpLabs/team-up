import Link from "next/link"

export default function Header() {
    return (
        <header className="fixed w-full backdrop-blur-md bg-(--color-background)/70 z-50 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="font-mono text-xl font-semibold">
            <Link href="/">
              <span className="text-green-400">&lt;</span>
              <span className="text-purple-400">TeamUp</span>
              <span className="text-green-400">/&gt;</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-10 text-sm font-medium">
            <a href="#" className="hover:text-purple-400 transition-colors duration-200">플랫폼</a>
            <a href="#" className="hover:text-purple-400 transition-colors duration-200">커뮤니티</a>
            <a href="#" className="hover:text-purple-400 transition-colors duration-200">멘토링</a>
            <a href="#" className="hover:text-purple-400 transition-colors duration-200">이벤트</a>
          </nav>
          <button className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-md shadow-purple-900/30">
            시작하기
          </button>
        </div>
      </header>
    )
}