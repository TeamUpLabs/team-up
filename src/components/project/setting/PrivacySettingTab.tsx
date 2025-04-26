export default function PrivacySettingTab() {
  return (
    <div className="bg-component-background border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-100 border-b border-gray-700/50 px-6 py-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        개인정보 보호 설정
      </h2>

      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/30 transition-all hover:border-gray-600/50">
          <div>
            <h3 className="text-gray-200 font-medium">활동 로그</h3>
            <p className="text-gray-400 text-sm mt-1">다른 사용자가 내 활동 로그를 볼 수 있습니다.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/30 transition-all hover:border-gray-600/50">
          <div>
            <h3 className="text-gray-200 font-medium">프로필 표시</h3>
            <p className="text-gray-400 text-sm mt-1">다른 사용자에게 내 프로필이 표시됩니다.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/30 transition-all hover:border-gray-600/50">
          <div>
            <h3 className="text-gray-200 font-medium">데이터 공유</h3>
            <p className="text-gray-400 text-sm mt-1">프로젝트 통계 및 데이터가 다른 멤버들과 공유됩니다.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/30 transition-all hover:border-gray-600/50">
          <div>
            <h3 className="text-gray-200 font-medium">이중 인증 (2FA)</h3>
            <p className="text-gray-400 text-sm mt-1">계정 보안을 위한 이중 인증을 설정합니다.</p>
          </div>
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
            설정하기
          </button>
        </div>
        <button className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          변경사항 저장
        </button>
      </div>

    </div>
  );
}