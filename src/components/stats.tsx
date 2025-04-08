export default function Stats() {
    return (
        <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">5K+</p>
              <p className="text-gray-400 text-sm uppercase tracking-wider">개발자</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-green-400 mb-2">300+</p>
              <p className="text-gray-400 text-sm uppercase tracking-wider">프로젝트</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">120+</p>
              <p className="text-gray-400 text-sm uppercase tracking-wider">멘토</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-green-400 mb-2">50+</p>
              <p className="text-gray-400 text-sm uppercase tracking-wider">기업 파트너</p>
            </div>
          </div>
        </div>
      </section>
    )
}