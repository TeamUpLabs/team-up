export default function Hero() {
    return (
        <section className="pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            개발자 <span className="text-purple-400">커뮤니티</span>의 <span className="text-green-400">새로운 시작</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10">
            TeamUp은 개발자들이 함께 성장하고 협업하는 신뢰 기반 플랫폼입니다.
            코드를 공유하고, 지식을 나누며, 함께 미래를 만들어갑니다.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-3 rounded-md font-medium hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg shadow-purple-700/20">
              가입하기
            </button>
            <button className="bg-transparent border border-gray-700 px-8 py-3 rounded-md font-medium hover:bg-white/5 transition-colors">
              더 알아보기
            </button>
          </div>
        </div>
      </section>
    )
}