export default function RecentFileCard() {
  return (
    <div className="col-span-1 sm:col-span-2 bg-gray-800 p-4 sm:p-6 rounded-lg">
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">최근 파일</h2>
      <div className="space-y-2 sm:space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
          <div className="p-2 bg-blue-100 rounded">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div className="mt-2 sm:mt-0 ml-0 sm:ml-3 w-full sm:flex-1">
            <p className="text-white">프로젝트 기획안.pdf</p>
            <p className="text-sm text-gray-400">2MB · 오늘 수정됨</p>
          </div>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <div className="text-xs px-2 py-1 bg-blue-500 text-white rounded">공유됨</div>
            <button className="p-2 hover:bg-gray-500 rounded">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
          <div className="p-2 bg-green-100 rounded">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div className="mt-2 sm:mt-0 ml-0 sm:ml-3 w-full sm:flex-1">
            <p className="text-white">월간 보고서.xlsx</p>
            <p className="text-sm text-gray-400">1.5MB · 어제 수정됨</p>
          </div>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <div className="text-xs px-2 py-1 bg-gray-500 text-white rounded">비공개</div>
            <button className="p-2 hover:bg-gray-500 rounded">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}