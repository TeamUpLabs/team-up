export default function MileStoneCard() {
  return (
    <div className="col-span-1 sm:col-span-2 bg-gray-800 p-4 sm:p-6 rounded-lg overflow-x-auto">
      <h2 className="text-xl font-semibold text-white mb-4">다가오는 마일스톤</h2>
      <div className="space-y-4">
        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-white font-medium">MVP 출시</p>
          <p className="text-sm text-gray-400 mt-1">2024.02.15</p>
          <div className="mt-2 flex items-center">
            <div className="w-full bg-gray-600 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <span className="ml-2 text-sm text-gray-400">80%</span>
          </div>
        </div>
      </div>
    </div>
  )
}