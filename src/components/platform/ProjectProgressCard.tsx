export default function ProjectProgressCard() {
  return (
    <div className="col-span-1 sm:col-span-2 bg-gray-800 p-4 sm:p-6 rounded-lg">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">프로젝트 진행률</h2>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">전체 진행률</span>
          <span className="text-white font-bold">75%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-3 sm:mt-4">
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-gray-400">총 작업</p>
            <p className="text-xl font-bold text-white">24</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-gray-400">완료</p>
            <p className="text-xl font-bold text-green-500">18</p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-gray-400">진행중</p>
            <p className="text-xl font-bold text-yellow-500">6</p>
          </div>
        </div>
      </div>
    </div>
  )
}